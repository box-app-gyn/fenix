import { motion, AnimatePresence } from 'framer-motion';
import { usePWA } from '../hooks/usePWA';

export default function PWALoading() {
  const { showLoading } = usePWA();

  if (!showLoading) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="pwa-loading"
      >
        <div className="spinner"></div>
        <div className="mt-4 text-white text-sm">
          Carregando...
        </div>
      </motion.div>
    </AnimatePresence>
  );
} 