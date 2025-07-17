import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useDashboardAPI } from '../hooks/useDashboardAPI';

/**
 * Exemplo simplificado de como usar a API do Dashboard
 * Usa apenas consultas diretas ao Firestore
 */
const DashboardExample: React.FC = () => {
  const {
    // Estados
    loading,
    error,
    
    // Funções principais
    getDashboardStats,
    getUsersData,
    getTeamsData,
    getAudiovisualData,
    
    // Hooks específicos
    useDashboardStats,
    useUsersData,
    useTeamsData,
    useAudiovisualData,
  } = useDashboardAPI();

  // Estados locais para demonstração
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [audiovisual, setAudiovisual] = useState<any[]>([]);

  // ============================================================================
  // HOOKS ESPECÍFICOS COM AUTO-REFRESH
  // ============================================================================

  // Estatísticas com auto-refresh a cada 30 segundos
  const { stats: autoStats } = useDashboardStats(true, 30000);

  // Usuários com filtros
  const { users: filteredUsers } = useUsersData({
    limit: 10,
    role: 'user'
  });

  // Times com filtros
  const { teams: filteredTeams } = useTeamsData({
    limit: 10,
    status: 'confirmado'
  });

  // Audiovisual com filtros
  const { audiovisual: filteredAudiovisual } = useAudiovisualData({
    limit: 10,
    status: 'aprovado'
  });

  // ============================================================================
  // FUNÇÕES DE DEMONSTRAÇÃO
  // ============================================================================

  const handleGetStats = async () => {
    const data = await getDashboardStats();
    setStats(data);
  };

  const handleGetUsers = async () => {
    const data = await getUsersData({ limit: 5 });
    if (data) {
      setUsers(data);
    }
  };

  const handleGetTeams = async () => {
    const data = await getTeamsData({ limit: 5 });
    if (data) {
      setTeams(data);
    }
  };

  const handleGetAudiovisual = async () => {
    const data = await getAudiovisualData({ limit: 5 });
    if (data) {
      setAudiovisual(data);
    }
  };

  // ============================================================================
  // RENDERIZAÇÃO
  // ============================================================================

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-4">🚀 Dashboard API - Simplificado</h1>
          <p className="text-gray-400">
            Exemplo usando apenas consultas diretas ao Firestore
          </p>
        </motion.div>

        {/* Status */}
        <div className="mb-8 p-4 bg-gray-800 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">📊 Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-gray-700 rounded">
              <span className="text-sm text-gray-400">Loading:</span>
              <span className={`ml-2 ${loading ? 'text-yellow-400' : 'text-green-400'}`}>
                {loading ? 'Sim' : 'Não'}
              </span>
            </div>
            <div className="p-3 bg-gray-700 rounded">
              <span className="text-sm text-gray-400">Erro:</span>
              <span className={`ml-2 ${error ? 'text-red-400' : 'text-green-400'}`}>
                {error || 'Nenhum'}
              </span>
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">🎮 Ações</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={handleGetStats}
              disabled={loading}
              className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg transition-colors"
            >
              📊 Buscar Estatísticas
            </button>
            
            <button
              onClick={handleGetUsers}
              disabled={loading}
              className="p-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded-lg transition-colors"
            >
              👥 Buscar Usuários
            </button>
            
            <button
              onClick={handleGetTeams}
              disabled={loading}
              className="p-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 rounded-lg transition-colors"
            >
              🏆 Buscar Times
            </button>
            
            <button
              onClick={handleGetAudiovisual}
              disabled={loading}
              className="p-3 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 rounded-lg transition-colors"
            >
              📸 Buscar Audiovisual
            </button>
          </div>
        </div>

        {/* Estatísticas em Tempo Real */}
        {autoStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold mb-4">📈 Estatísticas em Tempo Real</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-800 rounded-lg">
                <h3 className="text-sm text-gray-400">Usuários</h3>
                <p className="text-2xl font-bold text-blue-400">{autoStats.users.total}</p>
                <p className="text-xs text-gray-500">+{autoStats.users.newToday} hoje</p>
              </div>
              
              <div className="p-4 bg-gray-800 rounded-lg">
                <h3 className="text-sm text-gray-400">Times</h3>
                <p className="text-2xl font-bold text-green-400">{autoStats.teams.total}</p>
                <p className="text-xs text-gray-500">{autoStats.teams.confirmed} confirmados</p>
              </div>
              
              <div className="p-4 bg-gray-800 rounded-lg">
                <h3 className="text-sm text-gray-400">Receita</h3>
                <p className="text-2xl font-bold text-purple-400">
                  R$ {autoStats.financial.totalRevenue.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">{autoStats.financial.totalOrders} pedidos</p>
              </div>
              
              <div className="p-4 bg-gray-800 rounded-lg">
                <h3 className="text-sm text-gray-400">Online</h3>
                <p className="text-2xl font-bold text-orange-400">{autoStats.realtime.onlineUsers}</p>
                <p className="text-xs text-gray-500">Atualizado: {autoStats.realtime.lastUpdate.toLocaleTimeString()}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Dados Manualmente Buscados */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold mb-4">📊 Dados Manualmente Buscados</h2>
            <div className="bg-gray-800 rounded-lg p-4">
              <pre className="text-sm overflow-auto">
                {JSON.stringify(stats, null, 2)}
              </pre>
            </div>
          </motion.div>
        )}

        {/* Usuários */}
        {users.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold mb-4">👥 Usuários (Manual)</h2>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="grid gap-2">
                {users.map((user, index) => (
                  <div key={index} className="p-3 bg-gray-700 rounded">
                    <p className="font-semibold">{user.displayName}</p>
                    <p className="text-sm text-gray-400">{user.email}</p>
                    <p className="text-xs text-gray-500">Role: {user.role}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Times */}
        {teams.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold mb-4">🏆 Times (Manual)</h2>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="grid gap-2">
                {teams.map((team, index) => (
                  <div key={index} className="p-3 bg-gray-700 rounded">
                    <p className="font-semibold">{team.nome}</p>
                    <p className="text-sm text-gray-400">Categoria: {team.categoria}</p>
                    <p className="text-xs text-gray-500">Status: {team.status}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Audiovisual */}
        {audiovisual.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold mb-4">📸 Audiovisual (Manual)</h2>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="grid gap-2">
                {audiovisual.map((item, index) => (
                  <div key={index} className="p-3 bg-gray-700 rounded">
                    <p className="font-semibold">{item.nome}</p>
                    <p className="text-sm text-gray-400">Tipo: {item.tipo}</p>
                    <p className="text-xs text-gray-500">Status: {item.status}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Usuários com Filtros */}
        {filteredUsers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold mb-4">👥 Usuários (Filtrados)</h2>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-4">
                Total: {filteredUsers.length} usuários (role: user)
              </p>
              <div className="grid gap-2">
                {filteredUsers.map((user, index) => (
                  <div key={index} className="p-3 bg-gray-700 rounded">
                    <p className="font-semibold">{user.displayName}</p>
                    <p className="text-sm text-gray-400">{user.email}</p>
                    <p className="text-xs text-gray-500">Criado: {user.createdAt.toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Times com Filtros */}
        {filteredTeams.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold mb-4">🏆 Times (Filtrados)</h2>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-4">
                Total: {filteredTeams.length} times confirmados
              </p>
              <div className="grid gap-2">
                {filteredTeams.map((team, index) => (
                  <div key={index} className="p-3 bg-gray-700 rounded">
                    <p className="font-semibold">{team.nome}</p>
                    <p className="text-sm text-gray-400">Categoria: {team.categoria}</p>
                    <p className="text-xs text-gray-500">Valor: R$ {team.valorInscricao}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Audiovisual com Filtros */}
        {filteredAudiovisual.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold mb-4">📸 Audiovisual (Filtrado)</h2>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-4">
                Total: {filteredAudiovisual.length} profissionais aprovados
              </p>
              <div className="grid gap-2">
                {filteredAudiovisual.map((item, index) => (
                  <div key={index} className="p-3 bg-gray-700 rounded">
                    <p className="font-semibold">{item.nome}</p>
                    <p className="text-sm text-gray-400">Tipo: {item.tipo}</p>
                    <p className="text-xs text-gray-500">Criado: {item.createdAt.toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Instruções */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6"
        >
          <h2 className="text-xl font-semibold mb-4 text-blue-400">📖 Como Usar</h2>
          <div className="space-y-2 text-sm text-gray-300">
            <p>• <strong>useDashboardStats()</strong> - Hook com auto-refresh para estatísticas</p>
            <p>• <strong>useUsersData()</strong> - Hook com filtros para usuários</p>
            <p>• <strong>useTeamsData()</strong> - Hook com filtros para times</p>
            <p>• <strong>useAudiovisualData()</strong> - Hook com filtros para audiovisual</p>
            <p>• <strong>getDashboardStats()</strong> - Função para buscar todas as estatísticas</p>
            <p>• <strong>getUsersData()</strong> - Função para buscar usuários com filtros</p>
            <p>• <strong>getTeamsData()</strong> - Função para buscar times com filtros</p>
            <p>• <strong>getAudiovisualData()</strong> - Função para buscar audiovisual com filtros</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardExample; 