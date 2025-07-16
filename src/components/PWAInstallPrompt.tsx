import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePWA } from '../hooks/usePWA';

export default function PWAInstallPrompt() {
  const { canInstall, isInstalled, hasUpdate, installApp } = usePWA();
  const [isVisible, setIsVisible] = useState(true);

  // Não mostrar se já está instalado, não pode instalar, ou se há atualização disponível
  if (isInstalled || !canInstall || hasUpdate) {
    return null;
  }

  const handleInstall = async () => {
    await installApp();
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };



  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-4 right-4 z-50"
        >
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm mx-auto">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <img
                  src="/logos/logo_circulo.png"
                  alt="CERRADØ"
                  className="w-12 h-12 rounded-lg"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900">
                  {hasUpdate ? 'Atualização Disponível' : 'Instalar App'}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Instale o CERRADØ INTERBOX para uma experiência melhor.
                </p>

                <div className="flex space-x-2 mt-3">
                  <button
                    onClick={handleInstall}
                    className="flex-1 bg-pink-600 text-white text-sm font-medium px-3 py-2 rounded-md hover:bg-pink-700 transition-colors"
                  >
                    Instalar
                  </button>

                  <button
                    onClick={handleDismiss}
                    className="flex-1 bg-gray-100 text-gray-700 text-sm font-medium px-3 py-2 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Agora não
                  </button>
                </div>
              </div>

              <button
                onClick={handleDismiss}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
