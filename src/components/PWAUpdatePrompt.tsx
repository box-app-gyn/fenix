import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePWA } from '../hooks/usePWA';

interface PWAUpdatePromptProps {
  onClose?: () => void;
}

export default function PWAUpdatePrompt({ onClose }: PWAUpdatePromptProps) {
  const { isUpdateAvailable } = usePWA();
  const [isVisible, setIsVisible] = useState(isUpdateAvailable);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    setIsUpdating(true);
    
    try {
      // Recarregar a página para aplicar a atualização
      window.location.reload();
    } catch (error) {
      console.error('Erro ao atualizar PWA:', error);
      setIsUpdating(false);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto"
      >
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl font-bold">🔄</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Atualização Disponível</h3>
                <p className="text-sm text-gray-600">Interbox 2025</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-6">
            <p className="text-gray-700 mb-4">
              Uma nova versão do Interbox 2025 está disponível com melhorias e correções!
            </p>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span className="text-green-500">✓</span>
                <span>Melhorias de performance</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span className="text-green-500">✓</span>
                <span>Novas funcionalidades</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span className="text-green-500">✓</span>
                <span>Correções de bugs</span>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Depois
            </button>
            <button
              onClick={handleUpdate}
              disabled={isUpdating}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-sm font-medium flex items-center justify-center space-x-2"
            >
              {isUpdating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Atualizando...</span>
                </>
              ) : (
                <>
                  <span>🔄</span>
                  <span>Atualizar Agora</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
