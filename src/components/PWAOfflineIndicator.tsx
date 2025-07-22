import { motion, AnimatePresence } from 'framer-motion';
import { usePWA } from '../hooks/usePWA';

export default function PWAOfflineIndicator() {
  const { showOfflineIndicator, hideOfflineIndicator } = usePWA();

  if (!showOfflineIndicator) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: '-100%' }}
        animate={{ y: 0 }}
        exit={{ y: '-100%' }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="pwa-offline-indicator"
      >
        <div className="flex items-center justify-center space-x-2">
          <span>📡</span>
          <span>Você está offline</span>
          <button
            onClick={hideOfflineIndicator}
            className="ml-2 opacity-70 hover:opacity-100 transition-opacity"
          >
            ✕
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
} 