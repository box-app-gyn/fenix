import { useState, useEffect, useCallback } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { collection, getDocs, doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'
import { useAnalytics } from '../hooks/useAnalytics'
import { seedLeaderboardData } from '../utils/seedData'
import { seedConfigData } from '../utils/seedConfigData'

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

export default function AdminDashboard() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('stats')
  const [seeding, setSeeding] = useState(false)
  const [seedingConfig, setSeedingConfig] = useState(false)
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalTeams: 0,
    totalPedidos: 0,
    totalAudiovisual: 0
  })
  const [users, setUsers] = useState<any[]>([])
  const [teams, setTeams] = useState<any[]>([])
  const [audiovisual, setAudiovisual] = useState<any[]>([])
  
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
        totalAudiovisual: audiovisualSnapshot.size
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

  const loadAdminData = useCallback(async () => {
    await loadStats()
    await loadUsers()
    await loadTeams()
    await loadAudiovisual()
  }, [loadStats, loadUsers, loadTeams, loadAudiovisual])

  const loadUserData = useCallback(async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid))
      if (userDoc.exists()) {
        const userData = userDoc.data() as UserData
        if (!['admin', 'marketing'].includes(userData.role)) {
          window.location.href = '/admin'
          return
        }
        setUserData(userData)
      } else {
        window.location.href = '/admin'
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error)
      window.location.href = '/admin'
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
      trackPage('admin')
      trackAdmin('access', userData.email)
      loadAdminData()
    }
  }, [userData, loading, trackPage, trackAdmin, loadAdminData])

  const handleLogout = async () => {
    trackAdmin('logout', userData?.email || '')
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
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-pink-500 mx-auto mb-4"></div>
          <p>Carregando painel...</p>
        </div>
      </div>
    )
  }

  if (!userData || !['admin', 'marketing'].includes(userData.role)) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Acesso Negado</h1>
          <button 
            onClick={() => window.location.href = '/admin'}
            className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded"
          >
            Voltar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header customizado */}
      <header className="bg-black border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/logos/logo_circulo.png" width={40} height={40} alt="Logo" />
            <div className="text-xl font-bold">PAINEL ADMINISTRATIVO</div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-400">Olá, {userData.displayName}</span>
            <button 
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Navegação tabs */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="flex space-x-8 px-6">
          <button
            onClick={() => setActiveTab('stats')}
            className={`py-4 px-2 border-b-2 font-medium ${
              activeTab === 'stats' 
                ? 'border-pink-500 text-pink-500' 
                : 'border-transparent text-gray-300 hover:text-white'
            }`}
          >
            Estatísticas
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`py-4 px-2 border-b-2 font-medium ${
              activeTab === 'users' 
                ? 'border-pink-500 text-pink-500' 
                : 'border-transparent text-gray-300 hover:text-white'
            }`}
          >
            Usuários
          </button>
          <button
            onClick={() => setActiveTab('teams')}
            className={`py-4 px-2 border-b-2 font-medium ${
              activeTab === 'teams' 
                ? 'border-pink-500 text-pink-500' 
                : 'border-transparent text-gray-300 hover:text-white'
            }`}
          >
            Times
          </button>
          <button
            onClick={() => setActiveTab('audiovisual')}
            className={`py-4 px-2 border-b-2 font-medium ${
              activeTab === 'audiovisual' 
                ? 'border-pink-500 text-pink-500' 
                : 'border-transparent text-gray-300 hover:text-white'
            }`}
          >
            Audiovisual
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`py-4 px-2 border-b-2 font-medium ${
              activeTab === 'config' 
                ? 'border-pink-500 text-pink-500' 
                : 'border-transparent text-gray-300 hover:text-white'
            }`}
          >
            Configurações
          </button>
        </div>
      </nav>

      {/* Conteúdo conforme activeTab */}
      <main className="p-6">
        {activeTab === 'stats' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Total de Usuários</h3>
              <p className="text-3xl font-bold text-pink-500">{stats.totalUsers}</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Total de Times</h3>
              <p className="text-3xl font-bold text-pink-500">{stats.totalTeams}</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Total de Pedidos</h3>
              <p className="text-3xl font-bold text-pink-500">{stats.totalPedidos}</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Candidatos Audiovisual</h3>
              <p className="text-3xl font-bold text-pink-500">{stats.totalAudiovisual}</p>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Usuários ({users.length})</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-2">Nome</th>
                    <th className="text-left py-2">Email</th>
                    <th className="text-left py-2">Categoria</th>
                    <th className="text-left py-2">Cidade</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user: any) => (
                    <tr key={user.id} className="border-b border-gray-700">
                      <td className="py-2">{user.displayName}</td>
                      <td className="py-2">{user.email}</td>
                      <td className="py-2">{user.categoria}</td>
                      <td className="py-2">{user.cidade}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'teams' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Times ({teams.length})</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-2">Nome do Time</th>
                    <th className="text-left py-2">Categoria</th>
                    <th className="text-left py-2">Cidade</th>
                  </tr>
                </thead>
                <tbody>
                  {teams.map((team: any) => (
                    <tr key={team.id} className="border-b border-gray-700">
                      <td className="py-2">{team.nome}</td>
                      <td className="py-2">{team.categoria}</td>
                      <td className="py-2">{team.cidade}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'audiovisual' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Candidatos Audiovisual ({audiovisual.length})</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-2">Nome</th>
                    <th className="text-left py-2">Email</th>
                    <th className="text-left py-2">Área</th>
                    <th className="text-left py-2">Cidade</th>
                    <th className="text-left py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {audiovisual.map((candidato: any) => (
                    <tr key={candidato.id} className="border-b border-gray-700">
                      <td className="py-2">{candidato.nome}</td>
                      <td className="py-2">{candidato.email}</td>
                      <td className="py-2">{candidato.areaAtuacao}</td>
                      <td className="py-2">{candidato.cidade}</td>
                      <td className="py-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          candidato.status === 'pendente' 
                            ? 'bg-yellow-600 text-yellow-100' 
                            : 'bg-green-600 text-green-100'
                        }`}>
                          {candidato.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'config' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Configurações do Sistema</h2>
            
            <div className="space-y-6">
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Dados de Exemplo</h3>
                <p className="text-gray-300 mb-4">
                  Adicione dados de exemplo ao leaderboard para testar a funcionalidade.
                </p>
                <button
                  onClick={handleSeedData}
                  disabled={seeding}
                  className={`px-4 py-2 rounded font-medium ${
                    seeding
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {seeding ? 'Adicionando...' : 'Adicionar Dados de Exemplo'}
                </button>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Configuração Tempo Real</h3>
                <p className="text-gray-300 mb-4">
                  Crie a configuração inicial para o componente TempoReal da home.
                </p>
                <button
                  onClick={handleSeedConfigData}
                  disabled={seedingConfig}
                  className={`px-4 py-2 rounded font-medium ${
                    seedingConfig
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {seedingConfig ? 'Criando...' : 'Criar Configuração Tempo Real'}
                </button>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Informações do Projeto</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Projeto Firebase:</span> interbox-box-app25</p>
                  <p><span className="font-medium">Analytics ID:</span> G-VRZEQPCZ55</p>
                  <p><span className="font-medium">Versão:</span> 1.0.0</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
} 