import { useState, useEffect, useCallback } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { collection, getDocs, doc, getDoc, onSnapshot } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'
import { useAnalytics } from '../hooks/useAnalytics'
import { seedLeaderboardData } from '../utils/seedData'
import { seedConfigData } from '../utils/seedConfigData'
import Header from '../components/Header'
import Footer from '../components/Footer'

interface UserData {
  uid: string
  email: string
  role: string
  displayName: string
}

interface Stats {
  totalUsers: number
  totalTeams: number
  totalPedidos: number
  totalAudiovisual: number
}

interface TokenData {
  total: number
  media: number
  holders: number
  marketCap: number
}

export default function DevDashboard() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('stats')
  const [seeding, setSeeding] = useState(false)
  const [seedingConfig, setSeedingConfig] = useState(false)
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalTeams: 0,
    totalPedidos: 0,
    totalAudiovisual: 0,
  })
  const [users, setUsers] = useState<any[]>([])
  const [teams, setTeams] = useState<any[]>([])
  const [audiovisual, setAudiovisual] = useState<any[]>([])
  const [tokenData, setTokenData] = useState<TokenData>({
    total: 0,
    media: 0,
    holders: 0,
    marketCap: 0,
  })

  const { trackPage, trackAdmin } = useAnalytics()

  const loadStats = useCallback(async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'))
      const teamsSnapshot = await getDocs(collection(db, 'teams'))
      const audiovisualSnapshot = await getDocs(collection(db, 'audiovisual'))

      setStats({
        totalUsers: usersSnapshot.size,
        totalTeams: teamsSnapshot.size,
        totalPedidos: 0,
        totalAudiovisual: audiovisualSnapshot.size,
      })
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
    }
  }, [])

  const loadUsers = useCallback(async () => {
    try {
      const snapshot = await getDocs(collection(db, 'users'))
      const usersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setUsers(usersData)
    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
    }
  }, [])

  const loadTeams = useCallback(async () => {
    try {
      const snapshot = await getDocs(collection(db, 'teams'))
      const teamsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setTeams(teamsData)
    } catch (error) {
      console.error('Erro ao carregar times:', error)
    }
  }, [])

  const loadAudiovisual = useCallback(async () => {
    try {
      const snapshot = await getDocs(collection(db, 'audiovisual'))
      const audiovisualData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
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
              marketCap: data.token?.box?.marketCap || 0,
            })
          }
        },
      )
      return unsubscribe
    } catch (error) {
      console.error('Erro ao carregar dados de token:', error)
    }
  }, [])

  const loadDevData = useCallback(async () => {
    await loadStats()
    await loadUsers()
    await loadTeams()
    await loadAudiovisual()
    await loadTokenData()
  }, [loadStats, loadUsers, loadTeams, loadAudiovisual, loadTokenData])

  const loadUserData = useCallback(async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid))
      if (userDoc.exists()) {
        const userData = userDoc.data() as UserData
        if (userData.role !== 'dev') {
          window.location.href = '/dev'
          return
        }
        setUserData(userData)
      } else {
        window.location.href = '/dev'
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error)
      window.location.href = '/dev'
    }
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
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
      trackPage('dev')
      trackAdmin('dev_access', userData.email)
      loadDevData()
    }
  }, [userData, loading, trackPage, trackAdmin, loadDevData])

  const handleLogout = async () => {
    trackAdmin('dev_logout', userData?.email || '')
    await signOut(auth)
    window.location.href = '/'
  }

  const handleSeedData = async () => {
    setSeeding(true)
    try {
      await seedLeaderboardData()
      alert('Dados de exemplo adicionados com sucesso!')
    } catch (error) {
      console.error('Erro ao adicionar dados:', error)
      alert('Erro ao adicionar dados de exemplo')
    } finally {
      setSeeding(false)
    }
  }

  const handleSeedConfigData = async () => {
    setSeedingConfig(true)
    try {
      const success = await seedConfigData()
      if (success) {
        alert('✅ Configuração tempo_real criada com sucesso!')
      } else {
        alert('❌ Erro ao criar configuração')
      }
    } catch (error) {
      console.error('Erro ao criar configuração:', error)
      alert('❌ Erro ao criar configuração')
    } finally {
      setSeedingConfig(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-500 mx-auto mb-4"></div>
          <p>Carregando painel de desenvolvimento...</p>
        </div>
      </div>
    )
  }

  if (!userData || userData.role !== 'dev') {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Acesso Negado</h1>
          <p className="text-gray-400 mb-4">Apenas desenvolvedores podem acessar este painel</p>
          <button
            onClick={() => window.location.href = '/dev'}
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-4 py-2 rounded transition-all duration-300"
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
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Overlay gradiente */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/80"></div>

        {/* Conteúdo principal */}
        <div className="relative z-10 container mx-auto px-4 py-8">
          {/* Header do Dev */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 mb-8 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">🛠️ Painel do Desenvolvedor</h1>
                <p className="text-gray-600">Bem-vindo, {userData.displayName}</p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  DEVELOPER
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
                onClick={() => setActiveTab('stats')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'stats'
                    ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                📊 Estatísticas
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'users'
                    ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                👥 Usuários
              </button>
              <button
                onClick={() => setActiveTab('teams')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'teams'
                    ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                🏆 Times
              </button>
              <button
                onClick={() => setActiveTab('audiovisual')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'audiovisual'
                    ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                🎬 Audiovisual
              </button>
              <button
                onClick={() => setActiveTab('tokens')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'tokens'
                    ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                💰 Tokens $BOX
              </button>
              <button
                onClick={() => setActiveTab('tools')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'tools'
                    ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                🔧 Ferramentas
              </button>
            </div>

            {/* Conteúdo das tabs */}
            {activeTab === 'stats' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-90">Total de Usuários</p>
                      <p className="text-3xl font-bold">{stats.totalUsers}</p>
                    </div>
                    <div className="text-3xl">👥</div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-90">Total de Times</p>
                      <p className="text-3xl font-bold">{stats.totalTeams}</p>
                    </div>
                    <div className="text-3xl">🏆</div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-90">Audiovisual</p>
                      <p className="text-3xl font-bold">{stats.totalAudiovisual}</p>
                    </div>
                    <div className="text-3xl">🎬</div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-90">Pedidos</p>
                      <p className="text-3xl font-bold">{stats.totalPedidos}</p>
                    </div>
                    <div className="text-3xl">📋</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Usuário
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.slice(0, 10).map((user: any) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {user.displayName || 'Sem nome'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.role || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Ativo
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'teams' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Categoria
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Membros
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {teams.slice(0, 10).map((team: any) => (
                      <tr key={team.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {team.name || 'Sem nome'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {team.categoria || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {team.members?.length || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Ativo
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'audiovisual' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Profissional
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {audiovisual.slice(0, 10).map((item: any) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {item.displayName || 'Sem nome'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.tipo || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            item.aprovado
                              ? 'bg-green-100 text-green-800'
                              : item.aprovado === false
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {item.aprovado === true ? 'Aprovado'
                              : item.aprovado === false ? 'Rejeitado' : 'Pendente'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.createdAt ? new Date(item.createdAt.toDate()).toLocaleDateString() : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'tokens' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm opacity-90">Total $BOX</p>
                        <p className="text-3xl font-bold">{tokenData.total.toLocaleString()}</p>
                      </div>
                      <div className="text-3xl">💰</div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm opacity-90">Média por Usuário</p>
                        <p className="text-3xl font-bold">{tokenData.media}</p>
                      </div>
                      <div className="text-3xl">📊</div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm opacity-90">Holders</p>
                        <p className="text-3xl font-bold">{tokenData.holders}</p>
                      </div>
                      <div className="text-3xl">👥</div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm opacity-90">Market Cap</p>
                        <p className="text-3xl font-bold">${tokenData.marketCap.toLocaleString()}</p>
                      </div>
                      <div className="text-3xl">📈</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Dados em Tempo Real</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Preço por $BOX:</p>
                      <p className="text-xl font-bold text-green-600">
                        ${tokenData.marketCap && tokenData.total > 0
                          ? (tokenData.marketCap / tokenData.total).toFixed(4)
                          : '0.0000'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Última atualização:</p>
                      <p className="text-sm text-gray-800">{new Date().toLocaleString('pt-BR')}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tools' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                    <h3 className="text-lg font-semibold mb-4">🎯 Seed de Dados</h3>
                    <p className="text-sm opacity-90 mb-4">
                      Adiciona dados de exemplo para o leaderboard
                    </p>
                    <button
                      onClick={handleSeedData}
                      disabled={seeding}
                      className="bg-white text-green-600 px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                      {seeding ? 'Adicionando...' : 'Adicionar Dados'}
                    </button>
                  </div>

                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                    <h3 className="text-lg font-semibold mb-4">⚙️ Configuração</h3>
                    <p className="text-sm opacity-90 mb-4">
                      Cria configuração para tempo real
                    </p>
                    <button
                      onClick={handleSeedConfigData}
                      disabled={seedingConfig}
                      className="bg-white text-blue-600 px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                      {seedingConfig ? 'Criando...' : 'Criar Config'}
                    </button>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                  <h3 className="text-lg font-semibold mb-4">📈 Analytics</h3>
                  <p className="text-sm opacity-90 mb-4">
                    Tracking de páginas e ações do sistema
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white/20 p-4 rounded-lg">
                      <p className="text-sm opacity-90">Páginas Visitadas</p>
                      <p className="text-2xl font-bold">24/7</p>
                    </div>
                    <div className="bg-white/20 p-4 rounded-lg">
                      <p className="text-sm opacity-90">Ações Admin</p>
                      <p className="text-2xl font-bold">Real-time</p>
                    </div>
                    <div className="bg-white/20 p-4 rounded-lg">
                      <p className="text-sm opacity-90">Performance</p>
                      <p className="text-2xl font-bold">99.9%</p>
                    </div>
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
