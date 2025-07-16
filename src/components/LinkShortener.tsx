import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLinkShortener } from '../hooks/useLinkShortener';
import { ShortLinkCreate, ShortLinkUpdate, formatLinkStats } from '../types/linkShortener';
import { useAuth } from '../hooks/useAuth';

interface LinkShortenerProps {
  className?: string;
}

export default function LinkShortener({ className = '' }: LinkShortenerProps) {
  const { user } = useAuth();
  const {
    links,
    loading,
    error,
    stats,
    createLink,
    updateLink,
    deleteLink,
    registerClick,
  } = useLinkShortener();

  const [showForm, setShowForm] = useState(false);
  const [editingLink, setEditingLink] = useState<string | null>(null);
  const [formData, setFormData] = useState<ShortLinkCreate>({
    originalUrl: '',
    title: '',
    description: '',
    category: 'outro',
    isPublic: true,
  });

  const [editData, setEditData] = useState<ShortLinkUpdate>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await createLink(formData);
    if (result) {
      setFormData({
        originalUrl: '',
        title: '',
        description: '',
        category: 'outro',
        isPublic: true,
      });
      setShowForm(false);
    }
  };

  const handleEdit = async (linkId: string) => {
    const success = await updateLink(linkId, editData);
    if (success) {
      setEditingLink(null);
      setEditData({});
    }
  };

  const handleDelete = async (linkId: string) => {
    if (window.confirm('Tem certeza que deseja deletar este link?')) {
      await deleteLink(linkId);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Mostrar feedback visual
      const button = document.createElement('div');
      button.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg z-50';
      button.textContent = 'Copiado!';
      document.body.appendChild(button);
      setTimeout(() => document.body.removeChild(button), 2000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  const handleLinkClick = async (linkId: string, originalUrl: string) => {
    await registerClick(linkId);
    window.open(originalUrl, '_blank');
  };

  if (!user) {
    return (
      <div className={`bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-xl p-8 border border-pink-500/30 ${className}`}>
        <h2 className="text-2xl font-bold text-white mb-4">🔗 Encurtador de Links</h2>
        <p className="text-gray-400 mb-6">
          Faça login para criar e gerenciar seus links encurtados.
        </p>
        <button className="bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold py-3 px-8 rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-200">
          Fazer Login
        </button>
      </div>
    );
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-xl p-8 border border-pink-500/30">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">🔗 Encurtador de Links</h2>
            <p className="text-gray-400">
              Crie links curtos e acompanhe suas estatísticas
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-200"
          >
            {showForm ? 'Cancelar' : '+ Novo Link'}
          </button>
        </div>
      </div>

      {/* Estatísticas */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <div className="text-3xl font-bold text-pink-500 mb-2">{stats.totalLinks}</div>
            <div className="text-gray-400">Total de Links</div>
          </div>
          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <div className="text-3xl font-bold text-purple-500 mb-2">{stats.totalClicks !== undefined ? stats.totalClicks.toLocaleString('pt-BR') : '0'}</div>
            <div className="text-gray-400">Total de Cliques</div>
          </div>
          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <div className="text-3xl font-bold text-green-500 mb-2">{stats.activeLinks}</div>
            <div className="text-gray-400">Links Ativos</div>
          </div>
          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <div className="text-3xl font-bold text-orange-500 mb-2">{stats.expiredLinks}</div>
            <div className="text-gray-400">Links Expirados</div>
          </div>
        </motion.div>
      )}

      {/* Formulário de criação */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white/5 rounded-xl p-8 border border-white/10"
        >
          <h3 className="text-xl font-bold text-white mb-6">Criar Novo Link</h3>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6 text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white font-medium mb-2">URL Original *</label>
              <input
                type="url"
                value={formData.originalUrl}
                onChange={(e) => setFormData({ ...formData, originalUrl: e.target.value })}
                placeholder="https://exemplo.com/pagina-muito-longa"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-medium mb-2">Título</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Título do link"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Categoria</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500"
                >
                  <option value="outro">Outro</option>
                  <option value="evento">Evento</option>
                  <option value="ingresso">Ingresso</option>
                  <option value="comunidade">Comunidade</option>
                  <option value="midia">Mídia</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Descrição</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descrição do link"
                rows={3}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-white">
                <input
                  type="checkbox"
                  checked={formData.isPublic}
                  onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                  className="rounded border-white/20 bg-white/10 text-pink-500 focus:ring-pink-500"
                />
                Link público
              </label>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold py-3 px-8 rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50"
              >
                {loading ? 'Criando...' : 'Criar Link'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-white/10 text-white font-bold py-3 px-8 rounded-lg hover:bg-white/20 transition-all duration-200"
              >
                Cancelar
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Lista de links */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">Seus Links</h3>

        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
            <p className="text-gray-400 mt-2">Carregando links...</p>
          </div>
        )}

        {links.length === 0 && !loading && (
          <div className="text-center py-8 bg-white/5 rounded-lg border border-white/10">
            <p className="text-gray-400">Nenhum link criado ainda.</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold py-2 px-6 rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-200"
            >
              Criar Primeiro Link
            </button>
          </div>
        )}

        {links.map((link) => (
          <motion.div
            key={link.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 rounded-lg p-6 border border-white/10"
          >
            <div className="flex flex-col lg:flex-row justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-lg font-semibold text-white">
                    {link.title || 'Sem título'}
                  </h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    link.isActive ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                  }`}>
                    {link.isActive ? 'Ativo' : 'Inativo'}
                  </span>
                </div>

                <p className="text-gray-400 text-sm mb-2 break-all">
                  {link.originalUrl}
                </p>

                <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                  <span>🔗 {link.shortUrl}</span>
                  <span>👆 {link.clickCount} cliques</span>
                  <span>📅 {link.createdAt.toLocaleDateString('pt-BR')}</span>
                  {link.category && (
                    <span className="px-2 py-1 bg-white/10 rounded-full text-xs">
                      {link.category}
                    </span>
                  )}
                </div>

                {link.analytics && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-pink-500 font-semibold">
                        {formatLinkStats(link.analytics).totalClicks}
                      </div>
                      <div className="text-gray-400">Total</div>
                    </div>
                    <div>
                      <div className="text-purple-500 font-semibold">
                        {formatLinkStats(link.analytics).todayClicks}
                      </div>
                      <div className="text-gray-400">Hoje</div>
                    </div>
                    <div>
                      <div className="text-green-500 font-semibold">
                        {formatLinkStats(link.analytics).topDevice}
                      </div>
                      <div className="text-gray-400">Dispositivo</div>
                    </div>
                    <div>
                      <div className="text-orange-500 font-semibold">
                        {formatLinkStats(link.analytics).topCountry}
                      </div>
                      <div className="text-gray-400">País</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleLinkClick(link.id, link.originalUrl)}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold py-2 px-4 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-200"
                >
                  Testar
                </button>

                <button
                  onClick={() => copyToClipboard(link.shortUrl)}
                  className="bg-white/10 text-white font-bold py-2 px-4 rounded-lg hover:bg-white/20 transition-all duration-200"
                >
                  Copiar
                </button>

                <button
                  onClick={() => setEditingLink(editingLink === link.id ? null : link.id)}
                  className="bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-700 transition-all duration-200"
                >
                  Editar
                </button>

                <button
                  onClick={() => handleDelete(link.id)}
                  className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition-all duration-200"
                >
                  Deletar
                </button>
              </div>
            </div>

            {/* Formulário de edição */}
            {editingLink === link.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 pt-4 border-t border-white/10"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-medium mb-2">Título</label>
                    <input
                      type="text"
                      value={editData.title || link.title || ''}
                      onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Categoria</label>
                    <select
                      value={editData.category || link.category || 'outro'}
                      onChange={(e) => setEditData({ ...editData, category: e.target.value as any })}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pink-500"
                    >
                      <option value="outro">Outro</option>
                      <option value="evento">Evento</option>
                      <option value="ingresso">Ingresso</option>
                      <option value="comunidade">Comunidade</option>
                      <option value="midia">Mídia</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-white font-medium mb-2">Descrição</label>
                  <textarea
                    value={editData.description || link.description || ''}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    rows={2}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div className="flex gap-4 mt-4">
                  <button
                    onClick={() => handleEdit(link.id)}
                    className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-all duration-200"
                  >
                    Salvar
                  </button>
                  <button
                    onClick={() => {
                      setEditingLink(null);
                      setEditData({});
                    }}
                    className="bg-white/10 text-white font-bold py-2 px-4 rounded-lg hover:bg-white/20 transition-all duration-200"
                  >
                    Cancelar
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
