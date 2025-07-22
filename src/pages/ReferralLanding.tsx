import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, serverTimestamp, increment, addDoc, collection } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import { FirestoreUser } from '../types/firestore';

export default function ReferralLanding() {
  const { referralCode } = useParams<{ referralCode: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [referrer, setReferrer] = useState<FirestoreUser | null>(null);
  const [processed, setProcessed] = useState(false);

  useEffect(() => {
    const processReferral = async () => {
      if (!referralCode) {
        setError('Código de referência inválido');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Buscar usuário que compartilhou o link
        const q = await getDoc(doc(db, 'users', referralCode.replace('REF', '')));
        
        if (!q.exists()) {
          // Tentar buscar por código de referência
          const userQuery = await getDoc(doc(db, 'users', referralCode));
          if (!userQuery.exists()) {
            setError('Código de referência não encontrado');
            setLoading(false);
            return;
          }
          setReferrer(userQuery.data() as FirestoreUser);
        } else {
          setReferrer(q.data() as FirestoreUser);
        }

        // Se o usuário atual já está logado, processar a referência
        if (user) {
          await processReferralForUser(user.uid, referrer?.uid || '');
        }

        setProcessed(true);
      } catch (error) {
        console.error('Erro ao processar referência:', error);
        setError('Erro ao processar referência');
      } finally {
        setLoading(false);
      }
    };

    processReferral();
  }, [referralCode, user]);

  const processReferralForUser = async (newUserId: string, referrerId: string) => {
    if (!referrerId || newUserId === referrerId) return;

    try {
      // Verificar se já foi processado
      const newUserDoc = await getDoc(doc(db, 'users', newUserId));
      const newUserData = newUserDoc.data() as FirestoreUser;
      
      // Verificar se já tem referência (usando any para contornar o tipo)
      const gamification = newUserData?.gamification as any;
      if (gamification?.referredBy) {
        console.log('Referência já processada');
        return;
      }

      // Atualizar usuário novo com referência
      await updateDoc(doc(db, 'users', newUserId), {
        'gamification.referredBy': referrerId,
        updatedAt: serverTimestamp(),
      });

      // Atualizar usuário referenciador
      await updateDoc(doc(db, 'users', referrerId), {
        'gamification.referrals': increment(1),
        'gamification.referralTokens': increment(50),
        'gamification.tokens.box.balance': increment(50),
        'gamification.tokens.box.totalEarned': increment(50),
        'gamification.totalActions': increment(1),
        'gamification.lastActionAt': serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Registrar ação de gamificação
      await addDoc(collection(db, 'gamification_actions'), {
        userId: referrerId,
        userEmail: referrer?.email || '',
        userName: referrer?.displayName || 'Usuário',
        action: 'indicacao_confirmada',
        points: 50,
        description: `Indicação confirmada - Novo usuário: ${newUserData?.displayName || 'Usuário'}`,
        metadata: {
          referredUserId: newUserId,
          referredUserEmail: newUserData?.email,
          referredUserName: newUserData?.displayName,
        },
        createdAt: serverTimestamp(),
        processed: true,
        processedAt: serverTimestamp(),
      });

      console.log('✅ Referência processada com sucesso!');
    } catch (error) {
      console.error('Erro ao processar referência:', error);
    }
  };

  const handleContinue = () => {
    if (user) {
      navigate('/');
    } else {
      navigate('/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-500 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Processando...</h2>
          <p className="text-gray-400">Verificando código de referência</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto p-8"
        >
          <div className="bg-white/5 rounded-xl p-8 border border-white/10 mb-6">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Código Inválido
            </h2>
            <p className="text-gray-400 mb-6">
              {error}
            </p>
          </div>

          <button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-200"
          >
            Ir para o App
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md mx-auto p-8"
      >
        <div className="bg-white/5 rounded-xl p-8 border border-white/10 mb-6">
          <div className="text-6xl mb-4">🎯</div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Referência Confirmada!
          </h2>
          
          {referrer && (
            <div className="mb-6">
              <p className="text-gray-400 mb-2">
                Você foi convidado por:
              </p>
              <div className="bg-black/20 rounded-lg p-3 border border-pink-500/20">
                <div className="text-pink-400 font-semibold">
                  {referrer.displayName || 'Usuário'}
                </div>
                <div className="text-gray-400 text-sm">
                  {referrer.email}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4 text-left">
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <h3 className="text-green-400 font-semibold mb-2">🎉 Bônus de Boas-vindas!</h3>
              <div className="text-sm text-gray-300 space-y-1">
                <div>• +10 $BOX por usar link de referência</div>
                <div>• +25 $BOX ao completar seu perfil</div>
                <div>• +100 $BOX ao comprar ingresso</div>
                <div>• Acesso a conteúdo exclusivo</div>
              </div>
            </div>

            {processed && (
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <h3 className="text-blue-400 font-semibold mb-2">💰 Recompensa Atribuída!</h3>
                <p className="text-sm text-gray-300">
                  Seu amigo ganhou +50 $BOX por te convidar!
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleContinue}
            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-200"
          >
            {user ? 'Continuar no App' : 'Fazer Login'}
          </button>

          <div className="text-xs text-gray-400">
            CERRADO INTERBØX 2025 - O maior evento de times da América Latina
          </div>
        </div>
      </motion.div>
    </div>
  );
} 