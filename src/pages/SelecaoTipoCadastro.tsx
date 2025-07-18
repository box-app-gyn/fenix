import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import confetti from 'canvas-confetti';
import Header from '../components/Header';
import Footer from '../components/Footer';

const TIPOS_CADASTRO = [
  {
    id: 'atleta',
    titulo: 'Atleta',
    descricao: 'Quero competir no Interbox 2025',
    icon: '🏃‍♂️',
    accentColor: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  {
    id: 'jurado',
    titulo: 'Jurado',
    descricao: 'Quero ser jurado do evento',
    icon: '⚖️',
    accentColor: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
  },
  {
    id: 'midia',
    titulo: 'Mídia',
    descricao: 'Quero cobrir o evento',
    icon: '📸',
    accentColor: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
  },
  {
    id: 'espectador',
    titulo: 'Espectador',
    descricao: 'Quero apenas assistir',
    icon: '👥',
    accentColor: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
  {
    id: 'publico',
    titulo: 'Público Geral',
    descricao: 'Outro tipo de participação',
    icon: '👤',
    accentColor: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
  },
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
    mensagem: '',
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
        gamification: {
          tokens: {
            box: {
              balance: 50,
              totalEarned: 50,
              totalSpent: 0,
              lastTransaction: serverTimestamp(),
            },
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
          challenges: [],
        },
      });

      confetti({
        particleCount: 50,
        spread: 45,
        origin: { y: 0.6 },
        colors: ['#007AFF', '#34C759', '#FF9500'],
      });

      setTimeout(() => {
        alert(`🎉 Cadastro realizado com sucesso! 
        
🏆 Primeira Conquista: +50 ₿
🎯 Nível: Iniciante
📈 Streak: 1 dia

Bem-vindo ao CERRADØ INTERBOX 2025!`);
        navigate('/home');
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
      [e.target.name]: e.target.value,
    });
  };

  const selectedTipo = TIPOS_CADASTRO.find((t) => t.id === selectedType);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {!showForm ? (
            <motion.div
              key="selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Como você quer participar?
                </h1>
                <p className="text-gray-600 text-lg">
                  Escolha o tipo de cadastro que melhor representa você
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                {TIPOS_CADASTRO.map((tipo, index) => (
                  <motion.div
                    key={tipo.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`
                      cursor-pointer transition-all duration-200
                      ${index !== TIPOS_CADASTRO.length - 1 ? 'border-b border-gray-100' : ''}
                      hover:bg-gray-50 active:bg-gray-100
                    `}
                    onClick={() => handleTypeSelect(tipo.id)}
                  >
                    <div className="px-6 py-4 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">{tipo.icon}</div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {tipo.titulo}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {tipo.descricao}
                          </p>
                        </div>
                      </div>
                      <div className="text-gray-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="text-center mb-8">
                <button
                  onClick={() => setShowForm(false)}
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors mb-4"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Voltar
                </button>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {selectedTipo?.icon} {selectedTipo?.titulo}
                </h1>
                <p className="text-gray-600 text-lg">
                  Complete seus dados para finalizar o cadastro
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nome Completo
                        </label>
                        <input
                          type="text"
                          name="nome"
                          value={formData.nome}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50"
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
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50"
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
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50"
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
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cidade
                        </label>
                        <input
                          type="text"
                          name="cidade"
                          value={formData.cidade}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 resize-none"
                        placeholder="Conte um pouco sobre sua motivação para participar do evento..."
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition-all duration-200 text-lg"
                    >
                      {loading ? 'Cadastrando...' : 'Finalizar Cadastro'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </div>
  );
}
