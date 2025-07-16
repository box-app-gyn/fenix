import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { FirestoreGamificationLeaderboard, GamificationLevel } from '../types/firestore'

interface SeedLeaderboardEntry {
  userName: string
  userPhotoURL: string
  points: number // $BOX tokens
  userRole: string
  level: GamificationLevel
  totalActions: number
  streakDays: number
}

const mockLeaderboardData: SeedLeaderboardEntry[] = [
  {
    userName: 'João Silva',
    userPhotoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    points: 1250, // $BOX tokens
    userRole: 'atleta',
    level: 'platina',
    totalActions: 45,
    streakDays: 12
  },
  {
    userName: 'Maria Santos',
    userPhotoURL: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    points: 1180,
    userRole: 'atleta',
    level: 'platina',
    totalActions: 38,
    streakDays: 8
  },
  {
    userName: 'Pedro Costa',
    userPhotoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    points: 1050,
    userRole: 'jurado',
    level: 'ouro',
    totalActions: 32,
    streakDays: 15
  },
  {
    userName: 'Ana Oliveira',
    userPhotoURL: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    points: 920,
    userRole: 'midia',
    level: 'ouro',
    totalActions: 28,
    streakDays: 6
  },
  {
    userName: 'Carlos Lima',
    userPhotoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    points: 850,
    userRole: 'espectador',
    level: 'ouro',
    totalActions: 25,
    streakDays: 10
  },
  {
    userName: 'Fernanda Rocha',
    userPhotoURL: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    points: 780,
    userRole: 'atleta',
    level: 'prata',
    totalActions: 22,
    streakDays: 7
  },
  {
    userName: 'Roberto Alves',
    userPhotoURL: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
    points: 720,
    userRole: 'jurado',
    level: 'prata',
    totalActions: 19,
    streakDays: 9
  },
  {
    userName: 'Juliana Costa',
    userPhotoURL: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
    points: 680,
    userRole: 'midia',
    level: 'prata',
    totalActions: 16,
    streakDays: 5
  }
]

export const seedLeaderboardData = async () => {
  try {
    console.log('🌱 Iniciando seed dos dados do leaderboard $BOX...')
    
    const leaderboardRef = collection(db, 'gamification_leaderboard')
    
    for (let i = 0; i < mockLeaderboardData.length; i++) {
      const entry = mockLeaderboardData[i]
      const now = serverTimestamp()
      
      const leaderboardEntry: Omit<FirestoreGamificationLeaderboard, 'id'> = {
        userId: `user_${i + 1}`,
        userEmail: `${entry.userName.toLowerCase().replace(' ', '.')}@example.com`,
        userName: entry.userName,
        userPhotoURL: entry.userPhotoURL,
        userRole: entry.userRole as any,
        points: entry.points, // $BOX tokens
        level: entry.level,
        totalActions: entry.totalActions,
        streakDays: entry.streakDays,
        lastActionAt: now as any,
        position: i + 1, // Posição no ranking
        createdAt: now as any,
        updatedAt: now as any,
        weeklyPoints: Math.floor(entry.points * 0.1),
        monthlyPoints: Math.floor(entry.points * 0.3),
        yearlyPoints: entry.points,
        badges: ['primeiro_cadastro', 'ativo'],
        activeChallenges: []
      }
      
      await addDoc(leaderboardRef, leaderboardEntry)
      console.log(`✅ Adicionado: ${entry.userName} - ${entry.points} $BOX (${entry.level})`)
    }
    
    console.log('🎉 Seed do leaderboard $BOX concluído com sucesso!')
    return true
  } catch (error) {
    console.error('❌ Erro ao fazer seed dos dados:', error)
    return false
  }
}

// Função para limpar dados (apenas para desenvolvimento)
export const clearLeaderboardData = async () => {
  try {
    console.log('🧹 Limpando dados do leaderboard...')
    // Implementar limpeza se necessário
    console.log('✅ Dados limpos!')
    return true
  } catch (error) {
    console.error('❌ Erro ao limpar dados:', error)
    return false
  }
} 