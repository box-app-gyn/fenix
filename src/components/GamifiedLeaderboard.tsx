import { motion, AnimatePresence } from 'framer-motion'
import { useLeaderboard } from '../hooks/useLeaderboard';

interface GamifiedLeaderboardProps {
  showAnimations?: boolean
}

// Funções de sanitização
const sanitizeUrl = (url: string): string => {
  if (!url) return '/images/default-avatar.png'
  return url.startsWith('http') ? url : `/images/${url}`
}

const sanitizeText = (text: string): string => {
  return text || 'Usuário Anônimo'
}

export default function GamifiedLeaderboard({ 
  showAnimations = true 
}: GamifiedLeaderboardProps) {
  const { leaderboard: entries, loading, error } = useLeaderboard();

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇'
      case 2:
        return '🥈'
      case 3:
        return '🥉'
      default:
        return `#${rank}`
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600'
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500'
      case 3:
        return 'bg-gradient-to-r from-amber-600 to-amber-800'
      default:
        return 'bg-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="bg-black/50 backdrop-blur-sm rounded-xl p-6 border border-pink-500/20">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-700 rounded w-1/3"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gray-700 rounded"></div>
              <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                <div className="h-3 bg-gray-700 rounded w-1/6"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-900/20 backdrop-blur-sm rounded-xl p-6 border border-red-500/20">
        <p className="text-red-400 text-center">{error}</p>
      </div>
    )
  }

  return (
    <div className="bg-black/50 backdrop-blur-sm rounded-xl p-6 border border-pink-500/20">
      <motion.h2 
        className="text-2xl font-bold text-white mb-6 text-center"
        initial={showAnimations ? { opacity: 0, y: -20 } : false}
        animate={showAnimations ? { opacity: 1, y: 0 } : false}
        transition={{ duration: 0.5 }}
      >
        🏆 Ranking $BOX
      </motion.h2>

      <div className="space-y-3">
        <AnimatePresence>
          {entries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={showAnimations ? { opacity: 0, x: -50 } : false}
              animate={showAnimations ? { opacity: 1, x: 0 } : false}
              exit={showAnimations ? { opacity: 0, x: 50 } : undefined}
              transition={{ 
                duration: 0.3, 
                delay: showAnimations ? index * 0.1 : 0 
              }}
              className={`flex items-center space-x-4 p-4 rounded-lg border border-pink-500/10 hover:border-pink-500/30 transition-all duration-300 ${getRankColor(entry.position)}`}
            >
              {/* Rank */}
              <div className="flex-shrink-0">
                <span className="text-2xl font-bold text-white">
                  {getRankIcon(entry.position)}
                </span>
              </div>

              {/* Avatar */}
              <div className="flex-shrink-0">
                <img
                  src={sanitizeUrl(entry.userPhotoURL || '')}
                  alt={sanitizeText(entry.userName)}
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-pink-500/30"
                />
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold truncate">
                  {sanitizeText(entry.userName)}
                </h3>
                <p className="text-gray-300 text-sm">
                  {entry.userRole || 'Geral'} • Nível {entry.level}
                </p>
              </div>

              {/* $BOX Tokens */}
              <div className="flex-shrink-0 text-right">
                <div className="text-white font-bold text-lg">
                  {entry.points !== undefined ? entry.points.toLocaleString() : '—'} $BOX
                </div>
                <div className="text-gray-300 text-xs">
                  {entry.totalActions || 0} ações
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {entries.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <p className="text-gray-400">Nenhum participante ainda</p>
          <p className="text-gray-500 text-sm">Seja o primeiro a ganhar $BOX!</p>
        </motion.div>
      )}
    </div>
  )
} 