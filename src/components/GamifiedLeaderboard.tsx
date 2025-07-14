import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { collection, query, orderBy, limit, onSnapshot, where } from 'firebase/firestore'
import { db } from '../lib/firebase'

interface LeaderboardEntry {
  id: string
  userName: string
  userPhotoURL: string
  score: number
  rank: number
  category: string
  lastUpdated: any
}

interface GamifiedLeaderboardProps {
  category?: string
  limit?: number
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
  category = 'all', 
  limit: maxEntries = 10, 
  showAnimations = true 
}: GamifiedLeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        setLoading(true)
        setError(null)

        // Primeiro, tenta carregar dados reais do Firestore
        let q = query(
          collection(db, 'leaderboard'),
          orderBy('score', 'desc'),
          limit(maxEntries)
        )

        if (category !== 'all') {
          q = query(
            collection(db, 'leaderboard'),
            where('category', '==', category),
            orderBy('score', 'desc'),
            limit(maxEntries)
          )
        }

        const unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            const leaderboardData = snapshot.docs.map((doc, index) => ({
              id: doc.id,
              rank: index + 1,
              ...doc.data()
            })) as LeaderboardEntry[]

            // Se não há dados reais, usa dados de exemplo
            if (leaderboardData.length === 0) {
              const mockData: LeaderboardEntry[] = [
                {
                  id: '1',
                  rank: 1,
                  userName: 'João Silva',
                  userPhotoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
                  score: 1250,
                  category: 'Atleta',
                  lastUpdated: new Date()
                },
                {
                  id: '2',
                  rank: 2,
                  userName: 'Maria Santos',
                  userPhotoURL: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
                  score: 1180,
                  category: 'Atleta',
                  lastUpdated: new Date()
                },
                {
                  id: '3',
                  rank: 3,
                  userName: 'Pedro Costa',
                  userPhotoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
                  score: 1050,
                  category: 'Jurado',
                  lastUpdated: new Date()
                },
                {
                  id: '4',
                  rank: 4,
                  userName: 'Ana Oliveira',
                  userPhotoURL: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
                  score: 920,
                  category: 'Mídia',
                  lastUpdated: new Date()
                },
                {
                  id: '5',
                  rank: 5,
                  userName: 'Carlos Lima',
                  userPhotoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
                  score: 850,
                  category: 'Espectador',
                  lastUpdated: new Date()
                }
              ]
              setEntries(mockData)
            } else {
              setEntries(leaderboardData)
            }
            setLoading(false)
          },
          (err) => {
            console.error('Erro ao carregar leaderboard:', err)
            // Em caso de erro, também usa dados de exemplo
            const mockData: LeaderboardEntry[] = [
              {
                id: '1',
                rank: 1,
                userName: 'João Silva',
                userPhotoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
                score: 1250,
                category: 'Atleta',
                lastUpdated: new Date()
              },
              {
                id: '2',
                rank: 2,
                userName: 'Maria Santos',
                userPhotoURL: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
                score: 1180,
                category: 'Atleta',
                lastUpdated: new Date()
              },
              {
                id: '3',
                rank: 3,
                userName: 'Pedro Costa',
                userPhotoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
                score: 1050,
                category: 'Jurado',
                lastUpdated: new Date()
              }
            ]
            setEntries(mockData)
            setLoading(false)
          }
        )

        return () => unsubscribe()
      } catch (err) {
        console.error('Erro na configuração do leaderboard:', err)
        setError('Erro na configuração')
        setLoading(false)
      }
    }

    loadLeaderboard()
  }, [category, maxEntries])

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
        🏆 Ranking
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
              className={`flex items-center space-x-4 p-4 rounded-lg border border-pink-500/10 hover:border-pink-500/30 transition-all duration-300 ${getRankColor(entry.rank)}`}
            >
              {/* Rank */}
              <div className="flex-shrink-0">
                <span className="text-2xl font-bold text-white">
                  {getRankIcon(entry.rank)}
                </span>
              </div>

              {/* Avatar */}
              <div className="flex-shrink-0">
                <img
                  src={sanitizeUrl(entry.userPhotoURL)}
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
                  {entry.category || 'Geral'}
                </p>
              </div>

              {/* Score */}
              <div className="flex-shrink-0 text-right">
                <div className="text-white font-bold text-lg">
                  {entry.score.toLocaleString()}
                </div>
                <div className="text-gray-300 text-xs">pontos</div>
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
          <p className="text-gray-500 text-sm">Seja o primeiro!</p>
        </motion.div>
      )}
    </div>
  )
} 