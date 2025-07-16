import { useState, useEffect, useCallback } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { collection, getDocs, doc, getDoc, onSnapshot } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'
import { useAnalytics } from '../hooks/useAnalytics'
import Header from '../components/Header'
import Footer from '../components/Footer'

interface UserData {
  uid: string
  email: string
  role: string
  displayName: string
}

interface MarketingStats {
  totalUsers: number
  totalTeams: number
  totalAudiovisual: number
  engagementRate: number
  conversionRate: number
  socialMediaReach: number
  emailCampaigns: number
}

interface TokenData {
  total: number
  media: number
  holders: number
  marketCap: number
}

interface CampaignData {
  id: string
  name: string
  type: 'email' | 'social' | 'push' | 'banner'
  status: 'active' | 'paused' | 'completed' | 'draft'
  reach: number
  clicks: number
  conversions: number
  createdAt: any
}

export default function MarketingDashboard() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState<MarketingStats>({
    totalUsers: 0,
    totalTeams: 0,
    totalAudiovisual: 0,
    engagementRate: 0,
    conversionRate: 0,
    socialMediaReach: 0,
    emailCampaigns: 0
  })
  const [users, setUsers] = useState<any[]>([])
  const [teams, setTeams] = useState<any[]>([])
  const [audiovisual, setAudiovisual] = useState<any[]>([])
  const [tokenData, setTokenData] = useState<TokenData>({
    total: 0,
    media: 0,
    holders: 0,
    marketCap: 0
  })
  const [campaigns, setCampaigns] = useState<CampaignData[]>([])
  const [emailConfig, setEmailConfig] = useState({
    gmail: { email: '', password: '' },
    sendgrid: { apiKey: '', from: '' }
  })
  const [configStatus, setConfigStatus] = useState({
    firebase: true,
    gmail: false,
    sendgrid: false
  })
  
  const { trackPage, trackAdmin } = useAnalytics()

  const loadStats = useCallback(async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'))
      const teamsSnapshot = await getDocs(collection(db, 'teams'))
      const audiovisualSnapshot = await getDocs(collection(db, 'audiovisual'))

      // Calcular métricas de marketing
      const totalUsers = usersSnapshot.size
      const activeUsers = usersSnapshot.docs.filter(doc => doc.data().isActive).length
      const engagementRate = totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0

      setStats({
        totalUsers,
        totalTeams: teamsSnapshot.size,
        totalAudiovisual: audiovisualSnapshot.size,
        engagementRate: Math.round(engagementRate),
        conversionRate: 15, // Simulado
        socialMediaReach: 2500, // Simulado
        emailCampaigns: 8 // Simulado
      })
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
    }
  }, [])

  const loadUsers = useCallback(async () => {
    try {
      const snapshot = await getDocs(collection(db, 'users'))
      const usersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setUsers(usersData)
    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
    }
  }, [])

  const loadTeams = useCallback(async () => {
    try {
      const snapshot = await getDocs(collection(db, 'teams'))
      const teamsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setTeams(teamsData)
    } catch (error) {
      console.error('Erro ao carregar times:', error)
    }
  }, [])

  const loadAudiovisual = useCallback(async () => {
    try {
      const snapshot = await getDocs(collection(db, 'audiovisual'))
      const audiovisualData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setAudiovisual(audiovisualData)
    } catch (error) {
      console.error('Erro ao carregar audiovisual:', error)
    }
  }, [])

  const loadTokenData = useCallback(async () => {
    try {
      const unsubscribe = onSnapshot(
        doc(db, 'config', 'tempo_real'),
        (doc) => {
          if (doc.exists()) {
            const data = doc.data()
            setTokenData({
              total: data.token?.box?.total || 0,
              media: data.token?.box?.media || 0,
              holders: data.token?.box?.holders || 0,
              marketCap: data.token?.box?.marketCap || 0
            })
          }
        }
      )
      return unsubscribe
    } catch (error) {
      console.error('Erro ao carregar dados de token:', error)
    }
  }, [])

  const loadCampaigns = useCallback(async () => {
    // Dados simulados de campanhas
    const mockCampaigns: CampaignData[] = [
      {
        id: '1',
        name: 'Interbox 2025 - Pré-venda',
        type: 'email',
        status: 'active',
        reach: 1500,
        clicks: 450,
        conversions: 89,
        createdAt: new Date('2025-01-15')
      },
      {
        id: '2',
        name: 'Instagram Stories - Evento',
        type: 'social',
        status: 'active',
        reach: 3200,
        clicks: 1200,
        conversions: 156,
        createdAt: new Date('2025-01-20')
      },
      {
        id: '3',
        name: 'Push Notification - Últimas Vagas',
        type: 'push',
        status: 'paused',
        reach: 800,
        clicks: 320,
        conversions: 45,
        createdAt: new Date('2025-01-25')
      },
      {
        id: '4',
        name: 'Banner Homepage - CTA Principal',
        type: 'banner',
        status: 'completed',
        reach: 5000,
        clicks: 1800,
        conversions: 234,
        createdAt: new Date('2025-01-10')
      }
    ]
    setCampaigns(mockCampaigns)
  }, [])

  const loadMarketingData = useCallback(async () => {
    await loadStats()
    await loadUsers()
    await loadTeams()
    await loadAudiovisual()
    await loadTokenData()
    await loadCampaigns()
  }, [loadStats, loadUsers, loadTeams, loadAudiovisual, loadTokenData, loadCampaigns])

  const loadUserData = useCallback(async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid))
      if (userDoc.exists()) {
        const userData = userDoc.data() as UserData
        if (userData.role !== 'marketing') {
          window.location.href = '/marketing'
          return
        }
        setUserData(userData)
      } else {
        window.location.href = '/marketing'
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error)
      window.location.href = '/marketing'
    }
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      if (user) {
        await loadUserData(user.uid)
      } else {
        window.location.href = '/login'
      }
      setLoading(false)
    })
    return unsubscribe
  }, [loadUserData])

  useEffect(() => {
    if (userData && !loading) {
      trackPage('marketing')
      trackAdmin('marketing_access', userData.email)
      loadMarketingData()
    }
  }, [userData, loading, trackPage, trackAdmin, loadMarketingData])

  const handleLogout = async () => {
    trackAdmin('marketing_logout', userData?.email || '')
    await signOut(auth)
    window.location.href = '/'
  }

  const handleGmailConfig = async () => {
    if (!emailConfig.gmail.email || !emailConfig.gmail.password) {
      alert('Preencha todos os campos do Gmail')
      return
    }
    
    try {
      // Aqui você pode implementar a chamada para configurar o Gmail
      // Por enquanto, apenas simula o sucesso
      setConfigStatus(prev => ({ ...prev, gmail: true }))
      alert('Configuração Gmail salva com sucesso!')
      trackAdmin('email_config_gmail', userData?.email || '')
    } catch (error) {
      alert('Erro ao configurar Gmail: ' + error)
    }
  }

  const handleSendGridConfig = async () => {
    if (!emailConfig.sendgrid.apiKey || !emailConfig.sendgrid.from) {
      alert('Preencha todos os campos do SendGrid')
      return
    }
    
    try {
      // Aqui você pode implementar a chamada para configurar o SendGrid
      // Por enquanto, apenas simula o sucesso
      setConfigStatus(prev => ({ ...prev, sendgrid: true }))
      alert('Configuração SendGrid salva com sucesso!')
      trackAdmin('email_config_sendgrid', userData?.email || '')
    } catch (error) {
      alert('Erro ao configurar SendGrid: ' + error)
    }
  }

  const openEmailScript = () => {
    window.open('https://github.com/seu-repo/app-fenix/blob/main/functions/scripts/setup-email.js', '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-500 mx-auto mb-4"></div>
          <p>Carregando painel de marketing...</p>
        </div>
      </div>
    )
  }

  if (!userData || userData.role !== 'marketing') {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Acesso Negado</h1>
          <p className="text-gray-400 mb-4">Apenas profissionais de marketing podem acessar este painel</p>
          <button 
            onClick={() => window.location.href = '/marketing'}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded transition-all duration-300"
          >
            Voltar ao Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header />
      
      {/* Background com imagem principal */}
      <div 
        className="flex-1 relative"
        style={{
          backgroundImage: 'url(/images/bg_main.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Overlay gradiente */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/80"></div>
        
        {/* Conteúdo principal */}
        <div className="relative z-10 container mx-auto px-4 py-8">
          {/* Header do Marketing */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 mb-8 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">📈 Painel de Marketing</h1>
                <p className="text-gray-600">Bem-vindo, {userData.displayName}</p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  MARKETING
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Sair
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 mb-8 border border-white/20">
            <div className="flex flex-wrap space-x-4 mb-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'overview'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                📊 Visão Geral
              </button>
              <button
                onClick={() => setActiveTab('campaigns')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'campaigns'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                📢 Campanhas
              </button>
              <button
                onClick={() => setActiveTab('audience')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'audience'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                👥 Audiência
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'analytics'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                📈 Analytics
              </button>
              <button
                onClick={() => setActiveTab('email-config')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'email-config'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                📧 Configuração de Email
              </button>
            </div>

            {/* Conteúdo das tabs */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Cards de Métricas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm opacity-90">Usuários Ativos</p>
                        <p className="text-3xl font-bold">{stats.totalUsers}</p>
                      </div>
                      <div className="text-3xl">👥</div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm opacity-90">Engajamento</p>
                        <p className="text-3xl font-bold">{stats.engagementRate}%</p>
                      </div>
                      <div className="text-3xl">📈</div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm opacity-90">Conversão</p>
                        <p className="text-3xl font-bold">{stats.conversionRate}%</p>
                      </div>
                      <div className="text-3xl">🎯</div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm opacity-90">Alcance Social</p>
                        <p className="text-3xl font-bold">{stats.socialMediaReach.toLocaleString()}</p>
                      </div>
                      <div className="text-3xl">📱</div>
                    </div>
                  </div>
                </div>

                {/* Tokens $BOX */}
                <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg p-6 text-white">
                  <h3 className="text-xl font-bold mb-4">💰 Tokens $BOX - Métricas de Engajamento</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm opacity-90">Total Distribuído</p>
                      <p className="text-2xl font-bold">{tokenData.total.toLocaleString()} $BOX</p>
                    </div>
                    <div>
                      <p className="text-sm opacity-90">Holders Ativos</p>
                      <p className="text-2xl font-bold">{tokenData.holders}</p>
                    </div>
                    <div>
                      <p className="text-sm opacity-90">Market Cap</p>
                      <p className="text-2xl font-bold">${tokenData.marketCap.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'campaigns' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-800">📢 Campanhas Ativas</h3>
                  <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-md hover:from-purple-700 hover:to-pink-700 transition-colors">
                    + Nova Campanha
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Campanha
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tipo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Alcance
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Conversões
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          CTR
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {campaigns.map((campaign) => (
                        <tr key={campaign.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {campaign.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {campaign.type === 'email' && '📧 Email'}
                            {campaign.type === 'social' && '📱 Social'}
                            {campaign.type === 'push' && '🔔 Push'}
                            {campaign.type === 'banner' && '🖼️ Banner'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              campaign.status === 'active' ? 'bg-green-100 text-green-800' :
                              campaign.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                              campaign.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {campaign.status === 'active' ? 'Ativa' :
                               campaign.status === 'paused' ? 'Pausada' :
                               campaign.status === 'completed' ? 'Concluída' : 'Rascunho'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {campaign.reach.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {campaign.conversions}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {campaign.reach > 0 ? Math.round((campaign.clicks / campaign.reach) * 100) : 0}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'audience' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">👥 Demografia</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Atletas</span>
                        <span className="font-semibold">{users.filter(u => u.role === 'atleta').length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Espectadores</span>
                        <span className="font-semibold">{users.filter(u => u.role === 'espectador').length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Profissionais</span>
                        <span className="font-semibold">{audiovisual.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Times</span>
                        <span className="font-semibold">{teams.length}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Engajamento por Canal</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Instagram</span>
                        <span className="font-semibold text-blue-600">68%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email</span>
                        <span className="font-semibold text-green-600">45%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">WhatsApp</span>
                        <span className="font-semibold text-green-500">82%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Website</span>
                        <span className="font-semibold text-purple-600">34%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">📈 Métricas de Performance</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600">Taxa de Conversão</span>
                          <span className="text-sm font-semibold">{stats.conversionRate}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{width: `${stats.conversionRate}%`}}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600">Engajamento</span>
                          <span className="text-sm font-semibold">{stats.engagementRate}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{width: `${stats.engagementRate}%`}}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600">Retenção</span>
                          <span className="text-sm font-semibold">78%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-600 h-2 rounded-full" style={{width: '78%'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">🎯 ROI por Campanha</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email Marketing</span>
                        <span className="font-semibold text-green-600">320%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Social Media</span>
                        <span className="font-semibold text-blue-600">280%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Push Notifications</span>
                        <span className="font-semibold text-purple-600">450%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Banner Ads</span>
                        <span className="font-semibold text-orange-600">180%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'email-config' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-800">📧 Configuração do Sistema de Email</h3>
                  <button 
                    onClick={openEmailScript}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-md hover:from-purple-700 hover:to-pink-700 transition-colors"
                  >
                    📖 Ver Script
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Configuração Gmail */}
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">📧 Gmail</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Gmail
                        </label>
                        <input
                          type="email"
                          placeholder="seu-email@gmail.com"
                          value={emailConfig.gmail.email}
                          onChange={(e) => setEmailConfig(prev => ({
                            ...prev,
                            gmail: { ...prev.gmail, email: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Senha de App
                        </label>
                        <input
                          type="password"
                          placeholder="Senha de aplicativo"
                          value={emailConfig.gmail.password}
                          onChange={(e) => setEmailConfig(prev => ({
                            ...prev,
                            gmail: { ...prev.gmail, password: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Use senha de app, não sua senha principal
                        </p>
                      </div>
                      <button 
                        onClick={handleGmailConfig}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors"
                      >
                        ✅ Configurar Gmail
                      </button>
                    </div>
                  </div>

                  {/* Configuração SendGrid */}
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">📧 SendGrid</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          API Key
                        </label>
                        <input
                          type="password"
                          placeholder="SG.xxxxxxxxxxxxxxxxxxxxx"
                          value={emailConfig.sendgrid.apiKey}
                          onChange={(e) => setEmailConfig(prev => ({
                            ...prev,
                            sendgrid: { ...prev.sendgrid, apiKey: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Remetente
                        </label>
                        <input
                          type="email"
                          placeholder="noreply@interbox2025.com"
                          value={emailConfig.sendgrid.from}
                          onChange={(e) => setEmailConfig(prev => ({
                            ...prev,
                            sendgrid: { ...prev.sendgrid, from: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <button 
                        onClick={handleSendGridConfig}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
                      >
                        ✅ Configurar SendGrid
                      </button>
                    </div>
                  </div>
                </div>

                {/* Templates de Email */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">📝 Templates de Email</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h5 className="font-medium text-gray-800 mb-2">🎫 Pedido Confirmado</h5>
                      <p className="text-sm text-gray-600 mb-3">Email enviado após confirmação de pedido</p>
                      <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-1 px-3 rounded text-sm transition-colors">
                        Editar
                      </button>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h5 className="font-medium text-gray-800 mb-2">📸 Status Audiovisual</h5>
                      <p className="text-sm text-gray-600 mb-3">Notificação de aprovação/rejeição</p>
                      <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-1 px-3 rounded text-sm transition-colors">
                        Editar
                      </button>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h5 className="font-medium text-gray-800 mb-2">🎯 Notificação Admin</h5>
                      <p className="text-sm text-gray-600 mb-3">Comunicações administrativas</p>
                      <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-1 px-3 rounded text-sm transition-colors">
                        Editar
                      </button>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h5 className="font-medium text-gray-800 mb-2">👋 Boas-vindas</h5>
                      <p className="text-sm text-gray-600 mb-3">Email de boas-vindas para novos usuários</p>
                      <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-1 px-3 rounded text-sm transition-colors">
                        Editar
                      </button>
                    </div>
                  </div>
                </div>

                {/* Status da Configuração */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">🔧 Status da Configuração</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${configStatus.firebase ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="text-sm text-gray-700">
                        Firebase CLI {configStatus.firebase ? '(OK)' : '(Erro)'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${configStatus.gmail ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                      <span className="text-sm text-gray-700">
                        Gmail {configStatus.gmail ? '(Configurado)' : '(Pendente)'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${configStatus.sendgrid ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="text-sm text-gray-700">
                        SendGrid {configStatus.sendgrid ? '(Configurado)' : '(Não configurado)'}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <h5 className="font-medium text-blue-800 mb-2">💡 Instruções</h5>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Execute o script de configuração via terminal</li>
                      <li>• Configure pelo menos um provedor de email</li>
                      <li>• Teste o sistema antes de usar em produção</li>
                      <li>• Monitore os logs para identificar problemas</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
} 