import { motion, AnimatePresence } from 'framer-motion';
import { usePWA } from '../hooks/usePWA';

export default function PWAUpdatePrompt() {
  const { showUpdatePrompt, hideUpdatePrompt } = usePWA();

  if (!showUpdatePrompt) return null;

  const handleUpdate = () => {
    // Recarregar a página para aplicar a atualização
    window.location.reload();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="pwa-update-prompt"
      >
        <div className="flex items-center space-x-3">
          <div className="text-lg">🔄</div>
          <div>
            <div className="font-semibold">Nova versão disponível!</div>
            <div className="text-sm opacity-90">Clique para atualizar</div>
          </div>
          <button
            onClick={handleUpdate}
            className="ml-2 px-3 py-1 bg-white text-purple-600 rounded text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            Atualizar
          </button>
          <button
            onClick={hideUpdatePrompt}
            className="text-white opacity-70 hover:opacity-100 transition-opacity"
          >
            ✕
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
