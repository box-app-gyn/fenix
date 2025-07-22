import { useState } from 'react';
import { motion } from 'framer-motion';

export default function DevCacheButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Só mostrar em desenvolvimento
  if (import.meta.env.PROD) return null;

  const handleClearCache = async () => {
    setIsLoading(true);
    try {
      // Limpar cache do navegador
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      }

      // Limpar localStorage
      localStorage.clear();

      // Limpar sessionStorage
      sessionStorage.clear();

      // Limpar IndexedDB
      if ('indexedDB' in window) {
        const databases = await indexedDB.databases();
        databases.forEach(db => {
          if (db.name) {
            indexedDB.deleteDatabase(db.name);
          }
        });
      }

      // Forçar reload do service worker
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          await registration.update();
        }
      }

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);

      // Recarregar a página após 1 segundo
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (error) {
      console.error('Erro ao limpar cache:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.button
      onClick={handleClearCache}
      disabled={isLoading}
      className="fixed bottom-4 left-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white p-3 rounded-full shadow-lg z-50 transition-all duration-200"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      title="Limpar Cache (Dev)"
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : showSuccess ? (
        <span className="text-lg">✅</span>
      ) : (
        <span className="text-lg">🧹</span>
      )}
    </motion.button>
  );
} 