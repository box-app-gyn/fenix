import React, { useState } from 'react';
import { createInitialLinks, createSingleLink } from '../utils/createInitialLinks';
import { useAuth } from '../hooks/useAuth';

interface InitialLinkCreatorProps {
  className?: string;
}

export default function InitialLinkCreator({ className = '' }: InitialLinkCreatorProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customLink, setCustomLink] = useState({
    originalUrl: '',
    shortCode: '',
    title: '',
    description: '',
    category: 'outro' as const,
  });

  const handleCreateInitialLinks = async () => {
    if (!user) {
      setMessage('Usuário não autenticado');
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const success = await createInitialLinks(user.uid);
      if (success) {
        setMessage('✅ Links iniciais criados com sucesso!');
      } else {
        setMessage('❌ Erro ao criar links iniciais');
      }
    } catch (error) {
      setMessage('❌ Erro ao criar links iniciais');
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCustomLink = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setMessage('Usuário não autenticado');
      return;
    }

    if (!customLink.originalUrl || !customLink.shortCode) {
      setMessage('URL e código são obrigatórios');
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const success = await createSingleLink(
        user.uid,
        customLink.originalUrl,
        customLink.shortCode,
        customLink.title,
        customLink.description,
        customLink.category,
      );

      if (success) {
        setMessage('✅ Link criado com sucesso!');
        setCustomLink({
          originalUrl: '',
          shortCode: '',
          title: '',
          description: '',
          category: 'outro',
        });
        setShowCustomForm(false);
      } else {
        setMessage('❌ Erro ao criar link (código já existe?)');
      }
    } catch (error) {
      setMessage('❌ Erro ao criar link');
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  // Só mostrar para admins
  if (!user || user.email !== 'admin@interbox.com.br') {
    return null;
  }

  return (
    <div className={`bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl p-8 border border-yellow-500/30 ${className}`}>
      <h2 className="text-2xl font-bold text-white mb-4">🔧 Criador de Links Iniciais</h2>
      <p className="text-gray-400 mb-6">
        Ferramenta administrativa para criar links encurtados iniciais do sistema.
      </p>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.includes('✅')
            ? 'bg-green-500/20 border border-green-500/30 text-green-300'
            : 'bg-red-500/20 border border-red-500/30 text-red-300'
        }`}>
          {message}
        </div>
      )}

      <div className="space-y-4">
        <button
          onClick={handleCreateInitialLinks}
          disabled={loading}
          className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-bold py-3 px-6 rounded-lg hover:from-yellow-700 hover:to-orange-700 transition-all duration-200 disabled:opacity-50"
        >
          {loading ? 'Criando...' : 'Criar Links Iniciais'}
        </button>

        <button
          onClick={() => setShowCustomForm(!showCustomForm)}
          className="bg-white/10 text-white font-bold py-3 px-6 rounded-lg hover:bg-white/20 transition-all duration-200"
        >
          {showCustomForm ? 'Cancelar' : 'Criar Link Personalizado'}
        </button>
      </div>

      {showCustomForm && (
        <form onSubmit={handleCreateCustomLink} className="mt-6 space-y-4">
          <div>
            <label className="block text-white font-medium mb-2">URL Original *</label>
            <input
              type="url"
              value={customLink.originalUrl}
              onChange={(e) => setCustomLink({ ...customLink, originalUrl: e.target.value })}
              placeholder="https://exemplo.com"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500"
              required
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Código Curto *</label>
            <input
              type="text"
              value={customLink.shortCode}
              onChange={(e) => setCustomLink({ ...customLink, shortCode: e.target.value })}
              placeholder="meulink"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500"
              required
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Título</label>
            <input
              type="text"
              value={customLink.title}
              onChange={(e) => setCustomLink({ ...customLink, title: e.target.value })}
              placeholder="Título do link"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Descrição</label>
            <textarea
              value={customLink?.description ?? '—'}
              onChange={(e) => setCustomLink({ ...customLink, description: e.target.value })}
              placeholder="Descrição do link"
              rows={3}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Categoria</label>
            <select
              value={customLink.category}
              onChange={(e) => setCustomLink({ ...customLink, category: e.target.value as any })}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500"
            >
              <option value="outro">Outro</option>
              <option value="evento">Evento</option>
              <option value="ingresso">Ingresso</option>
              <option value="comunidade">Comunidade</option>
              <option value="midia">Mídia</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-bold py-3 px-6 rounded-lg hover:from-yellow-700 hover:to-orange-700 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? 'Criando...' : 'Criar Link'}
            </button>
            <button
              type="button"
              onClick={() => setShowCustomForm(false)}
              className="bg-white/10 text-white font-bold py-3 px-6 rounded-lg hover:bg-white/20 transition-all duration-200"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-2">Links que serão criados:</h3>
        <ul className="text-gray-400 space-y-2 text-sm">
          <li>• <code className="bg-white/10 px-2 py-1 rounded">ingresso2025</code> → Link de compra de ingressos</li>
          <li>• <code className="bg-white/10 px-2 py-1 rounded">comunidade</code> → WhatsApp da comunidade</li>
          <li>• <code className="bg-white/10 px-2 py-1 rounded">instagram</code> → Instagram oficial</li>
          <li>• <code className="bg-white/10 px-2 py-1 rounded">facebook</code> → Facebook oficial</li>
          <li>• <code className="bg-white/10 px-2 py-1 rounded">youtube</code> → YouTube oficial</li>
        </ul>
      </div>
    </div>
  );
}
