import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useLeaderboard } from '../hooks/useLeaderboard';

export default function HomeGamification() {
  const { user } = useAuth();
  const { leaderboard, loading } = useLeaderboard();

  if (!user) return null;

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
            ) : (
              leaderboard.slice(0, 5).map((entry, index) => (
                <div
                  key={entry.id}
                  className={`flex items-center space-x-4 p-3 rounded-lg transition-all duration-300 ${
                    entry.userId === user?.uid
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
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
} 