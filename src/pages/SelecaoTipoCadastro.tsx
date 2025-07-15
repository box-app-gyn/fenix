import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import confetti from 'canvas-confetti';

const TIPOS_CADASTRO = [
  {
    id: 'atleta',
    titulo: '🏃‍♂️ Atleta',
    descricao: 'Quero competir no Interbox 2025',
    cor: 'from-green-500 to-green-600',
    hover: 'hover:from-green-600 hover:to-green-700',
    emoji: '🏃‍♂️'
  },
  {
    id: 'jurado',
    titulo: '⚖️ Jurado',
    descricao: 'Quero ser jurado do evento',
    cor: 'from-yellow-500 to-yellow-600',
    hover: 'hover:from-yellow-600 hover:to-yellow-700',
    emoji: '⚖️'
  },
  {
    id: 'midia',
    titulo: '📸 Mídia',
    descricao: 'Quero cobrir o evento',
    cor: 'from-purple-500 to-purple-600',
    hover: 'hover:from-purple-600 hover:to-purple-700',
    emoji: '📸'
  },
  {
    id: 'espectador',
    titulo: '👥 Espectador',
    descricao: 'Quero apenas assistir',
    cor: 'from-gray-500 to-gray-600',
    hover: 'hover:from-gray-600 hover:to-gray-700',
    emoji: '👥'
  },
  {
    id: 'publico',
    titulo: '👤 Público Geral',
    descricao: 'Outro tipo de participação',
    cor: 'from-blue-500 to-blue-600',
    hover: 'hover:from-blue-600 hover:to-blue-700',
    emoji: '👤'
  }
];

export default function SelecaoTipoCadastro() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nome: '',
    email: user?.email || '',
    telefone: '',
    whatsapp: '',
    box: '',
    cidade: '',
    mensagem: ''
  });

  const handleTypeSelect = (tipoId: string) => {
    setSelectedType(tipoId);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedType) return;

    setLoading(true);
    try {
      await setDoc(doc(db, 'users', user.uid), {
        ...formData,
        uid: user.uid,
        displayName: formData.nome,
        email: formData.email,
        categoria: selectedType,
        role: selectedType,
        isActive: true,
        profileComplete: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        // Gamificação - Primeira conquista
        gamification: {
          tokens: {
            box: {
              balance: 50, // +50 $BOX por cadastro
              totalEarned: 50,
              totalSpent: 0,
              lastTransaction: serverTimestamp()
            }
          },
          level: 'iniciante',
          totalActions: 1,
          lastActionAt: serverTimestamp(),
          achievements: ['primeiro_cadastro'],
          rewards: [],
          streakDays: 1,
          lastLoginStreak: serverTimestamp(),
          referralCode: `REF${user.uid.slice(-6).toUpperCase()}`,
          referrals: [],
          referralTokens: 0,
          weeklyTokens: 50,
          monthlyTokens: 50,
          yearlyTokens: 50,
          bestStreak: 1,
          badges: ['primeiro_cadastro'],
          challenges: []
        }
      });

      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Show success message with gamification
      setTimeout(() => {
        alert(`🎉 Cadastro realizado com sucesso! 
        
🏆 Primeira Conquista: +50 $BOX
🎯 Nível: Iniciante
📈 Streak: 1 dia

Bem-vindo ao Interbox 2025!`);
        navigate('/hub');
      }, 1000);

    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      alert('Erro ao realizar cadastro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const selectedTipo = TIPOS_CADASTRO.find(t => t.id === selectedType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black py-20">
      <div className="max-w-4xl mx-auto px-4">
        <AnimatePresence mode="wait">
          {!showForm ? (
            <motion.div
              key="selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl font-bold text-white mb-4">
                🎯 Como você quer participar?
              </h1>
              <p className="text-xl text-gray-300">
                Escolha o tipo de cadastro que melhor representa você no Interbox 2025
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl font-bold text-white mb-4">
                {selectedTipo?.emoji} {selectedTipo?.titulo.split(' ').slice(1).join(' ')}
              </h1>
              <p className="text-xl text-gray-300">
                Complete seus dados para finalizar o cadastro
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {!showForm ? (
            <motion.div
              key="types"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {TIPOS_CADASTRO.map((tipo, index) => (
                <motion.div
                  key={tipo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="group cursor-pointer"
                  onClick={() => handleTypeSelect(tipo.id)}
                >
                  <div className={`
                    bg-gradient-to-br ${tipo.cor} ${tipo.hover}
                    rounded-xl p-6 h-full
                    transform transition-all duration-300
                    group-hover:scale-105 group-hover:shadow-2xl
                    border-2 border-transparent group-hover:border-white/20
                  `}>
                    <div className="text-center">
                      <div className="text-4xl mb-4">{tipo.titulo.split(' ')[0]}</div>
                      <h3 className="text-xl font-bold text-white mb-2">
                        {tipo.titulo.split(' ').slice(1).join(' ')}
                      </h3>
                      <p className="text-white/90 text-sm">
                        {tipo.descricao}
                      </p>
                    </div>
                    
                    <div className="mt-6 text-center">
                      <div className="inline-flex items-center text-white/80 group-hover:text-white transition-colors">
                        <span className="text-sm">Selecionar</span>
                        <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="form-content"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-white rounded-lg shadow-xl p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome Completo *
                      </label>
                      <input
                        type="text"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Telefone
                      </label>
                      <input
                        type="tel"
                        name="telefone"
                        value={formData.telefone}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        WhatsApp
                      </label>
                      <input
                        type="tel"
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Box/Academia
                      </label>
                      <input
                        type="text"
                        name="box"
                        value={formData.box}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cidade *
                      </label>
                      <input
                        type="text"
                        name="cidade"
                        value={formData.cidade}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mensagem/Motivação
                    </label>
                    <textarea
                      name="mensagem"
                      value={formData.mensagem}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="Conte um pouco sobre sua motivação para participar do evento..."
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      ← Voltar
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:bg-gray-400 transition-colors"
                    >
                      {loading ? 'Cadastrando...' : '🎉 Finalizar Cadastro'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-center mt-12"
          >
            <button
              onClick={() => navigate('/hub')}
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Já tenho cadastro, ir para o Hub →
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
} 