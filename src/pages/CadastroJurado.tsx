import { useState } from 'react';
import { motion } from 'framer-motion';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';

export default function CadastroJurado() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: user?.email || '',
    telefone: '',
    whatsapp: '',
    box: '',
    categoria: 'jurado',
    cidade: '',
    mensagem: '',
    experiencia: '',
    certificacoes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      await setDoc(doc(db, 'users', user.uid), {
        ...formData,
        uid: user.uid,
        displayName: formData.nome,
        email: formData.email,
        role: 'jurado',
        isActive: true,
        profileComplete: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      alert('Cadastro realizado com sucesso!');
      window.location.href = '/home';
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      alert('Erro ao realizar cadastro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black py-20">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-lg shadow-xl p-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">⚖️ Cadastro de Jurado</h1>
            <p className="text-gray-600">Complete seu perfil para ser jurado do Interbox 2025</p>
          </div>

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
                Experiência como Jurado
              </label>
              <select
                name="experiencia"
                value={formData.experiencia}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="">Selecione...</option>
                <option value="iniciante">Iniciante (0-2 eventos)</option>
                <option value="intermediario">Intermediário (3-10 eventos)</option>
                <option value="experiente">Experiente (10+ eventos)</option>
                <option value="expert">Expert (20+ eventos)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Certificações
              </label>
              <textarea
                name="certificacoes"
                value={formData.certificacoes}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Liste suas certificações relevantes..."
              />
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
                placeholder="Conte um pouco sobre sua motivação para ser jurado..."
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:bg-gray-400 transition-colors"
              >
                {loading ? 'Cadastrando...' : 'Cadastrar'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
} 