import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { FirestoreUser } from '../types/firestore';

interface ReferralStats {
  totalReferrals: number;
  activeReferrals: number;
  totalTokensEarned: number;
  referrals: Array<{
    userId: string;
    userName: string;
    userEmail: string;
    joinedAt: Date;
    status: 'active' | 'inactive';
  }>;
}

export default function ReferralLinkGenerator() {
  const { user } = useAuth();
  const [referralCode, setReferralCode] = useState<string>('');
  const [referralLink, setReferralLink] = useState<string>('');
  const [stats, setStats] = useState<ReferralStats>({
    totalReferrals: 0,
    activeReferrals: 0,
    totalTokensEarned: 0,
    referrals: [],
  });
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Buscar dados de referência do usuário
  useEffect(() => {
    const fetchReferralData = async () => {
      if (!user?.uid) return;

      try {
        setLoading(true);
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.data() as FirestoreUser;

        if (userData?.gamification?.referralCode) {
          setReferralCode(userData.gamification.referralCode);
          setReferralLink(`${window.location.origin}/ref/${userData.gamification.referralCode}`);
        } else {
          // Gerar código de referência se não existir
          const newCode = `REF${user.uid.slice(-6).toUpperCase()}`;
          await updateDoc(doc(db, 'users', user.uid), {
            'gamification.referralCode': newCode,
            updatedAt: serverTimestamp(),
          });
          setReferralCode(newCode);
          setReferralLink(`${window.location.origin}/ref/${newCode}`);
        }

        // Buscar estatísticas de referência
        const referrals = userData?.gamification?.referrals || [];
        const referralStats: ReferralStats = {
          totalReferrals: referrals.length,
          activeReferrals: referrals.length, // Simplificado por enquanto
          totalTokensEarned: userData?.gamification?.referralTokens || 0,
          referrals: [], // Será preenchido com dados completos
        };

        setStats(referralStats);
      } catch (error) {
        console.error('Erro ao buscar dados de referência:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReferralData();
  }, [user?.uid]);

  // Copiar link para clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Erro ao copiar:', error);
    }
  };

  // Compartilhar via WhatsApp
  const shareViaWhatsApp = () => {
    const message = encodeURIComponent(
      `🎯 CERRADØ INTERBOX 2025\n\n` +
      `Olha só! Use meu link de referência para se cadastrar no maior evento de times da América Latina!\n\n` +
      `🔗 ${referralLink}\n\n` +
      `Ganhe tokens $BOX e participe da gamificação! 💰`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  // Compartilhar via Instagram
  const shareViaInstagram = () => {
    window.open(`https://www.instagram.com/cerradointerbox`, '_blank');
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-pink-500/20 to-purple-500/20 backdrop-blur-sm rounded-2xl p-6 border border-pink-500/30">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-700 rounded w-1/3"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          <div className="h-10 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative bg-gradient-to-br from-pink-500/20 to-purple-500/20 backdrop-blur-sm rounded-2xl p-6 border border-pink-500/30 overflow-hidden"
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{ backgroundImage: 'url(/images/bg_1.png)' }}
      />
      <div className="relative z-10">
      <div className="text-center space-y-6">
        {/* Header */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">
            🎯 LINK PARA INSCRIÇÃO
          </h3>
          <p className="text-gray-300 text-sm">
            Compartilhe e ganhe tokens $BOX por cada novo usuário
          </p>
        </div>

        {/* Código de Referência */}
        <div className="space-y-3">
          <div className="text-sm text-gray-400">Seu código único:</div>
          <div className="bg-black/30 rounded-lg p-4 border border-pink-500/20">
            <div className="text-2xl font-mono font-bold text-pink-400 tracking-wider">
              {referralCode}
            </div>
          </div>
        </div>

        {/* Link Completo */}
        <div className="space-y-3">
          <div className="text-sm text-gray-400">Link de compartilhamento:</div>
          <div className="bg-black/30 rounded-lg p-3 border border-pink-500/20">
            <div className="text-sm text-gray-300 break-all">
              {referralLink}
            </div>
          </div>
          <button
            onClick={copyToClipboard}
            className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
              copied
                ? 'bg-green-600 text-white'
                : 'bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:from-pink-700 hover:to-purple-700'
            }`}
          >
            {copied ? '✅ Copiado!' : '📋 Copiar Link'}
          </button>
        </div>

        {/* Botões de Compartilhamento */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={shareViaWhatsApp}
            className="bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2"
          >
            <span>📱</span>
            WhatsApp
          </button>
          <button
            onClick={shareViaInstagram}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2"
          >
            <span>📸</span>
            Instagram
          </button>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-pink-500/20">
          <div className="text-center">
            <div className="text-2xl font-bold text-pink-400">
              {stats.totalReferrals}
            </div>
            <div className="text-xs text-gray-400">Referências</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {stats.activeReferrals}
            </div>
            <div className="text-xs text-gray-400">Ativas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {stats.totalTokensEarned}
            </div>
            <div className="text-xs text-gray-400">$BOX Ganhos</div>
          </div>
        </div>

        {/* Informações de Recompensa */}
        <div className="bg-black/20 rounded-lg p-4 border border-pink-500/10">
          <h4 className="text-white font-semibold mb-2">💰 Recompensas por Referência</h4>
          <div className="text-sm text-gray-300 space-y-1">
            <div>• +50 $BOX por cada novo usuário cadastrado</div>
            <div>• +25 $BOX quando o usuário completar o perfil</div>
            <div>• +100 $BOX quando o usuário comprar ingresso</div>
            <div>• Bônus especial para top referenciadores</div>
          </div>
        </div>
      </div>
      </div>
    </motion.div>
  );
} 