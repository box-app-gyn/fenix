import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { FirestoreUser } from '../types/firestore';

// Estender o tipo User do useAuth para incluir gamification
interface ExtendedUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  role?: string;
  gamification?: FirestoreUser['gamification'];
}

export default function UserGamificationCards() {
  const { user } = useAuth();
  const { leaderboard } = useLeaderboard();

  if (!user) return null;

  // Dados do usuário atual
  const userTokens = (user as ExtendedUser)?.gamification?.tokens?.box?.balance || 0;
  const userLevel = (user as ExtendedUser)?.gamification?.level || 'iniciante';
  const userStreak = (user as ExtendedUser)?.gamification?.streakDays || 0;
  const userPosition = leaderboard.findIndex(entry => entry.userId === user?.uid) + 1;

  // Desafios disponíveis
  const challenges = [
    {
      id: 'complete_profile',
      title: '📝 Perfil completo',
      description: 'Complete todas as informações do perfil',
      reward: 25,
      progress: user?.profileComplete ? 1 : 0,
      max: 1,
      completed: user?.profileComplete
    },
    {
      id: 'share_event',
      title: '📢 Compartilhar evento',
      description: 'Compartilhe o evento nas redes sociais',
      reward: 10,
      progress: 0,
      max: 1,
      completed: false
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Card do usuário */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-gradient-to-br from-pink-500/20 to-purple-500/20 backdrop-blur-sm rounded-2xl p-6 border border-pink-500/30"
      >
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
            <span className="text-2xl">💰</span>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-white mb-1">
              {user.displayName || 'Usuário'}
            </h3>
            <p className="text-gray-300 text-sm capitalize">
              Nível {userLevel}
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-3xl font-bold text-pink-400">
              {userTokens.toLocaleString()} $BOX
            </div>
            <div className="text-sm text-gray-400">
              Saldo atual
            </div>
          </div>

          <div className="flex justify-between text-sm">
            <div>
              <div className="text-white font-semibold">#{userPosition || '—'}</div>
              <div className="text-gray-400">Ranking</div>
            </div>
            <div>
              <div className="text-white font-semibold">{userStreak}</div>
              <div className="text-gray-400">Dias streak</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Desafios */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-black/50 backdrop-blur-sm rounded-2xl p-6 border border-pink-500/20"
      >
        <h3 className="text-xl font-bold text-white mb-4">🎯 Desafios</h3>
        <div className="space-y-3">
          {challenges.map((challenge) => (
            <div
              key={challenge.id}
              className={`p-3 rounded-lg border transition-all duration-300 ${
                challenge.completed
                  ? 'bg-green-500/10 border-green-500/30'
                  : 'bg-gray-800/50 border-gray-700'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h4 className="text-white font-semibold text-sm">
                    {challenge.title}
                  </h4>
                  <p className="text-gray-400 text-xs">
                    {challenge.description}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-pink-400 font-bold text-sm">
                    +{challenge.reward} $BOX
                  </div>
                  {challenge.completed && (
                    <div className="text-green-400 text-xs">✓ Concluído</div>
                  )}
                </div>
              </div>
              
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    challenge.completed
                      ? 'bg-green-500'
                      : 'bg-gradient-to-r from-pink-500 to-purple-600'
                  }`}
                  style={{
                    width: `${(challenge.progress / challenge.max) * 100}%`
                  }}
                />
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {challenge.progress}/{challenge.max}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
} 