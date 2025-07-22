import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useLeaderboard } from '../hooks/useLeaderboard';

export default function HomeGamification() {
  const { user } = useAuth();
  const { leaderboard, loading } = useLeaderboard();

  return (
    <div 
      className="max-w-4xl mx-auto space-y-6 relative"
      style={{
        backgroundImage: 'url(/images/bg_1.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Overlay para melhorar legibilidade */}
      <div className="absolute inset-0 bg-black/40 rounded-3xl"></div>
      
      {/* Conteúdo com z-index */}
      <div className="relative z-10 p-8">
        {/* Header da seção */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">
            🎮 Gamificação $BOX
          </h2>
          <p className="text-gray-300 text-lg">
            Veja quem está liderando o ranking
          </p>
          {!user && (
            <p className="text-pink-400 text-sm mt-2">
              Faça login para participar e ganhar $BOX!
            </p>
          )}
        </motion.div>

        {/* Ranking */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-black/50 backdrop-blur-sm rounded-2xl p-6 border border-pink-500/20 max-w-2xl mx-auto"
        >
          <h3 className="text-xl font-bold text-white mb-6 text-center">🏆 Top 5</h3>
          <div className="space-y-3">
            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-3 animate-pulse">
                    <div className="w-6 h-6 bg-gray-700 rounded"></div>
                    <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-700 rounded w-2/3"></div>
                    </div>
                    <div className="w-16 h-4 bg-gray-700 rounded"></div>
                  </div>
                ))}
              </div>
            ) : leaderboard.length > 0 ? (
              leaderboard.slice(0, 5).map((entry, index) => (
                <div
                  key={entry.id}
                  className={`flex items-center space-x-4 p-3 rounded-lg transition-all duration-300 ${
                    user && entry.userId === user?.uid
                      ? 'bg-pink-500/20 border border-pink-500/30'
                      : 'hover:bg-gray-800/50'
                  }`}
                >
                  <div className="text-lg font-bold text-gray-400 w-8">
                    #{index + 1}
                  </div>
                  <img
                    src={entry.userPhotoURL || '/images/default-avatar.png'}
                    alt={entry.userName}
                    className="w-10 h-10 rounded-full border border-pink-500/30"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-base font-medium truncate">
                      {entry.userName}
                    </div>
                  </div>
                  <div className="text-pink-400 text-lg font-bold">
                    {entry.points?.toLocaleString() || 0}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-2">Nenhum participante ainda</p>
                <p className="text-gray-500 text-sm">Seja o primeiro a ganhar $BOX!</p>
                {!user && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-200 font-medium"
                  >
                    Participar Agora
                  </motion.button>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Informações sobre tokens $BOX */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-black/50 backdrop-blur-sm rounded-2xl p-6 border border-pink-500/20 max-w-2xl mx-auto mt-6"
        >
          <h3 className="text-xl font-bold text-white mb-4 text-center">💰 Como Ganhar $BOX</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-3">
              <span className="text-pink-400 font-bold">+10</span>
              <span className="text-gray-300">Cadastro</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-pink-400 font-bold">+50</span>
              <span className="text-gray-300">Indicação</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-pink-400 font-bold">+100</span>
              <span className="text-gray-300">Compra de Ingresso</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-pink-400 font-bold">+75</span>
              <span className="text-gray-300">Envio de Conteúdo</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-pink-400 font-bold">+25</span>
              <span className="text-gray-300">QR Code Evento</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-pink-400 font-bold">+5</span>
              <span className="text-gray-300">Login Diário</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 