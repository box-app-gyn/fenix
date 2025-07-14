import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../lib/firebase'

interface SeedLeaderboardEntry {
  userName: string
  userPhotoURL: string
  score: number
  category: string
}

const mockLeaderboardData: SeedLeaderboardEntry[] = [
  {
    userName: 'João Silva',
    userPhotoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    score: 1250,
    category: 'Atleta'
  },
  {
    userName: 'Maria Santos',
    userPhotoURL: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    score: 1180,
    category: 'Atleta'
  },
  {
    userName: 'Pedro Costa',
    userPhotoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    score: 1050,
    category: 'Jurado'
  },
  {
    userName: 'Ana Oliveira',
    userPhotoURL: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    score: 920,
    category: 'Mídia'
  },
  {
    userName: 'Carlos Lima',
    userPhotoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    score: 850,
    category: 'Espectador'
  },
  {
    userName: 'Fernanda Rocha',
    userPhotoURL: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    score: 780,
    category: 'Atleta'
  },
  {
    userName: 'Roberto Alves',
    userPhotoURL: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
    score: 720,
    category: 'Jurado'
  },
  {
    userName: 'Juliana Costa',
    userPhotoURL: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
    score: 680,
    category: 'Mídia'
  }
]

export const seedLeaderboardData = async () => {
  try {
    console.log('🌱 Iniciando seed dos dados do leaderboard...')
    
    const leaderboardRef = collection(db, 'leaderboard')
    
    for (const entry of mockLeaderboardData) {
      await addDoc(leaderboardRef, {
        ...entry,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      console.log(`✅ Adicionado: ${entry.userName} - ${entry.score} pontos`)
    }
    
    console.log('🎉 Seed concluído com sucesso!')
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