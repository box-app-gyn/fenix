import { useState, useEffect, useCallback } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { collection, getDocs, doc, getDoc } from 'firebase/firestore'
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

interface Stats {
  totalUsers: number
  totalTeams: number
  totalPedidos: number
  totalAudiovisual: number
  totalAtletas: number
  totalParceiros: number
  totalPatrocinadores: number
}

export default function AdminDashboard() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('stats')
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalTeams: 0,
    totalPedidos: 0,
    totalAudiovisual: 0,
    totalAtletas: 0,
    totalParceiros: 0,
    totalPatrocinadores: 0,
  })
  const [users, setUsers] = useState<any[]>([])
  const [teams, setTeams] = useState<any[]>([])
  const [audiovisual, setAudiovisual] = useState<any[]>([])
  const [patrocinadores, setPatrocinadores] = useState<any[]>([])
  const [leaderboardProvas, setLeaderboardProvas] = useState<any[]>([])

  const { trackPage, trackAdmin } = useAnalytics()

  const loadStats = useCallback(async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'))
      const teamsSnapshot = await getDocs(collection(db, 'teams'))
      const audiovisualSnapshot = await getDocs(collection(db, 'audiovisual'))
      const patrocinadoresSnapshot = await getDocs(collection(db, 'patrocinadores'))

      // Contar atletas (usuários com role 'atleta')
      const atletasCount = usersSnapshot.docs.filter(doc => doc.data().role === 'atleta').length
      
      // Contar parceiros (patrocinadores ativos)
      const parceirosCount = patrocinadoresSnapshot.docs.filter(doc => doc.data().status === 'ativo').length

      setStats({
        totalUsers: usersSnapshot.size,
        totalTeams: teamsSnapshot.size,
        totalPedidos: 0,
        totalAudiovisual: audiovisualSnapshot.size,
        totalAtletas: atletasCount,
        totalParceiros: parceirosCount,
        totalPatrocinadores: patrocinadoresSnapshot.size,
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

  const loadPatrocinadores = useCallback(async () => {
    try {
      const snapshot = await getDocs(collection(db, 'patrocinadores'))
      const patrocinadoresData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setPatrocinadores(patrocinadoresData)
    } catch (error) {
      console.error('Erro ao carregar patrocinadores:', error)
    }
  }, [])

  const loadLeaderboardProvas = useCallback(async () => {
    try {
      // Buscar times com dados de competição
      const teamsSnapshot = await getDocs(collection(db, 'teams'))
      const teamsWithCompetition = teamsSnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((team: any) => team.competition && team.competition.resultados)
        .sort((a: any, b: any) => {
          // Ordenar por pontuação total das provas
          const aTotal = a.competition.resultados.reduce((sum: number, prova: any) => sum + (prova.pontuacao || 0), 0)
          const bTotal = b.competition.resultados.reduce((sum: number, prova: any) => sum + (prova.pontuacao || 0), 0)
          return bTotal - aTotal
        })
        .slice(0, 20) // Top 20 times
      
      setLeaderboardProvas(teamsWithCompetition)
    } catch (error) {
      console.error('Erro ao carregar leaderboard de provas:', error)
    }
  }, [])

  const loadAdminData = useCallback(async () => {
    await loadStats()
    await loadUsers()
    await loadTeams()
    await loadAudiovisual()
    await loadPatrocinadores()
    await loadLeaderboardProvas()
  }, [loadStats, loadUsers, loadTeams, loadAudiovisual, loadPatrocinadores, loadLeaderboardProvas])

  const loadUserData = useCallback(async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid))
      if (userDoc.exists()) {
        const userData = userDoc.data() as UserData
        if (!['admin', 'marketing', 'dev'].includes(userData.role)) {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-pink-500 mx-auto mb-4"></div>
          <p>Carregando painel...</p>
        </div>
      </div>
    )
  }

  if (!userData || !['admin', 'marketing', 'dev'].includes(userData.role)) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Acesso Negado</h1>
          <button
            onClick={() => window.location.href = '/admin'}
            className="bg-gradient-to-r from-pink-600 to-blue-600 hover:from-pink-700 hover:to-blue-700 text-white px-4 py-2 rounded transition-all duration-300"
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
          {/* Header do Admin */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 mb-8 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Painel Administrativo</h1>
                <p className="text-gray-600">Bem-vindo, {userData.displayName}</p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="bg-gradient-to-r from-pink-500 to-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {userData.role.toUpperCase()}
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
            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => setActiveTab('stats')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'stats'
                    ? 'bg-gradient-to-r from-pink-600 to-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                📊 Estatísticas
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'users'
                    ? 'bg-gradient-to-r from-pink-600 to-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                👥 Usuários
              </button>
              <button
                onClick={() => setActiveTab('teams')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'teams'
                    ? 'bg-gradient-to-r from-pink-600 to-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                🏆 Times
              </button>
              <button
                onClick={() => setActiveTab('audiovisual')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'audiovisual'
                    ? 'bg-gradient-to-r from-pink-600 to-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                🎬 Audiovisual
              </button>
              <button
                onClick={() => setActiveTab('parceiros')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'parceiros'
                    ? 'bg-gradient-to-r from-pink-600 to-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                🤝 Parceiros
              </button>
              <button
                onClick={() => setActiveTab('leaderboard')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'leaderboard'
                    ? 'bg-gradient-to-r from-pink-600 to-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                🏆 Leaderboard Provas
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
                <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-90">Total de Atletas</p>
                      <p className="text-3xl font-bold">{stats.totalAtletas}</p>
                    </div>
                    <div className="text-3xl">🏃</div>
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
                <div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-90">Parceiros Ativos</p>
                      <p className="text-3xl font-bold">{stats.totalParceiros}</p>
                    </div>
                    <div className="text-3xl">🤝</div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-90">Total Patrocinadores</p>
                      <p className="text-3xl font-bold">{stats.totalPatrocinadores}</p>
                    </div>
                    <div className="text-3xl">💎</div>
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

            {activeTab === 'parceiros' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Parceiro
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Categoria
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Valor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contato
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {patrocinadores.slice(0, 10).map((patrocinador: any) => (
                      <tr key={patrocinador.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {patrocinador.nome || 'Sem nome'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {patrocinador.nomeFantasia}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {patrocinador.categoria || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          R$ {patrocinador.valorPatrocinio?.toLocaleString() || '0'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            patrocinador.status === 'ativo'
                              ? 'bg-green-100 text-green-800'
                              : patrocinador.status === 'pendente'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                          }`}>
                            {patrocinador.status === 'ativo' ? 'Ativo'
                              : patrocinador.status === 'pendente' ? 'Pendente' : 'Inativo'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {patrocinador.contato?.nome || 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'leaderboard' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg p-4 text-white">
                  <h3 className="text-lg font-bold mb-2">🏆 Leaderboard das Provas - Tempo Real</h3>
                  <p className="text-sm opacity-90">Ranking atualizado em tempo real durante o evento</p>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Posição
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Categoria
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Pontuação Total
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Provas
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {leaderboardProvas.map((team: any, index: number) => {
                        const totalPontos = team.competition?.resultados?.reduce((sum: number, prova: any) => sum + (prova.pontuacao || 0), 0) || 0
                        const provasCount = team.competition?.resultados?.length || 0
                        
                        return (
                          <tr key={team.id} className={index < 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50' : ''}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                {index === 0 && <span className="text-2xl mr-2">🥇</span>}
                                {index === 1 && <span className="text-2xl mr-2">🥈</span>}
                                {index === 2 && <span className="text-2xl mr-2">🥉</span>}
                                <span className={`text-lg font-bold ${
                                  index === 0 ? 'text-yellow-600' :
                                  index === 1 ? 'text-gray-600' :
                                  index === 2 ? 'text-orange-600' : 'text-gray-900'
                                }`}>
                                  #{index + 1}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {team.nome || 'Sem nome'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {team.box?.nome} - {team.box?.cidade}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {team.categoria || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-lg font-bold text-green-600">
                                {totalPontos} pts
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {provasCount} provas
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                team.status === 'confirmado'
                                  ? 'bg-green-100 text-green-800'
                                  : team.status === 'complete'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {team.status === 'confirmado' ? 'Confirmado'
                                  : team.status === 'complete' ? 'Completo' : 'Pendente'}
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
                
                {leaderboardProvas.length === 0 && (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">🏆</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum resultado disponível</h3>
                    <p className="text-gray-500">Os resultados das provas aparecerão aqui em tempo real durante o evento.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
