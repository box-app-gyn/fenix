import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLinkShortener } from '../hooks/useLinkShortener';
import { isLinkExpired, ShortLink } from '../types/linkShortener';

interface LinkRedirectProps {
  shortCode: string;
}

export default function LinkRedirect({ shortCode }: LinkRedirectProps) {
  const { getLinkByCode, registerClick } = useLinkShortener();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [link, setLink] = useState<ShortLink | null>(null);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    const fetchLink = async () => {
      try {
        setLoading(true);
        setError(null);

        const linkData = await getLinkByCode(shortCode);

        if (!linkData) {
          setError('Link não encontrado ou inativo');
          return;
        }

        if (isLinkExpired(linkData)) {
          setError('Este link expirou');
          return;
        }

        setLink(linkData);

        // Registrar clique e redirecionar após pequeno delay
        setTimeout(async () => {
          setRedirecting(true);
          await registerClick(linkData.id);

          // Redirecionar para URL original
          window.location.href = linkData.originalUrl;
        }, 2000);
      } catch (err) {
        setError('Erro ao processar link');
        console.error('Erro ao buscar link:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLink();
  }, [shortCode, getLinkByCode, registerClick]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-500 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Carregando...</h2>
          <p className="text-gray-400">Verificando link encurtado</p>
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
          <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-8 mb-6">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-white mb-4">Link Inválido</h2>
            <p className="text-red-300 mb-6">{error}</p>
          </div>

          <div className="space-y-4">
            <p className="text-gray-400">
              O link que você está tentando acessar não existe ou não está mais disponível.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.history.back()}
                className="bg-white/10 text-white font-bold py-3 px-6 rounded-lg hover:bg-white/20 transition-all duration-200"
              >
                Voltar
              </button>

              <button
                onClick={() => window.location.href = '/'}
                className="bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-200"
              >
                Ir para Home
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (redirecting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto p-8"
        >
          <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-8 mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="text-6xl mb-4"
            >
              🔄
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-4">Redirecionando...</h2>
            <p className="text-green-300 mb-6">
              Você será redirecionado em alguns segundos
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-2">
                {link?.title || 'Link Encurtado'}
              </h3>
              {link?.description && (
                <p className="text-gray-400 text-sm mb-4">{link.description}</p>
              )}
              <p className="text-pink-400 text-sm break-all">
                {link?.originalUrl}
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 text-gray-400">
              <div className="animate-pulse">⏳</div>
              <span>Redirecionando automaticamente...</span>
            </div>

            <button
              onClick={() => link?.originalUrl && (window.location.href = link.originalUrl)}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-200"
            >
              Ir Agora
            </button>
          </div>
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
          <div className="text-6xl mb-4">🔗</div>
          <h2 className="text-2xl font-bold text-white mb-4">
            {link?.title || 'Link Encurtado'}
          </h2>
          {link?.description && (
            <p className="text-gray-400 mb-4">{link.description}</p>
          )}
          <p className="text-pink-400 text-sm break-all mb-6">
            {link?.originalUrl}
          </p>

          <div className="flex items-center justify-center gap-4 text-sm text-gray-400 mb-6">
            <span>👆 {link?.clickCount || 0} cliques</span>
            {link?.category && (
              <span className="px-2 py-1 bg-white/10 rounded-full text-xs">
                {link.category}
              </span>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-gray-400">
            Você será redirecionado automaticamente em alguns segundos.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                setRedirecting(true);
                link?.id && registerClick(link.id);
                link?.originalUrl && (window.location.href = link.originalUrl);
              }}
              className="bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-200"
            >
              Continuar
            </button>

            <button
              onClick={() => window.history.back()}
              className="bg-white/10 text-white font-bold py-3 px-6 rounded-lg hover:bg-white/20 transition-all duration-200"
            >
              Cancelar
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
