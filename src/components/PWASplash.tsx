import { motion, AnimatePresence } from 'framer-motion';
import { usePWA } from '../hooks/usePWA';

export default function PWASplash() {
  const { showSplash, hideSplash, deviceInfo } = usePWA();

  if (!showSplash) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="pwa-splash"
        onAnimationComplete={() => {
          // Esconder splash após animação
          setTimeout(hideSplash, 500);
        }}
      >
        <div className="logo">
          🏆
        </div>
        
        <h1 className="title">
          CERRADØ INTERBOX 2025
        </h1>
        
        <p className="subtitle">
          Eternize a intensidade
        </p>

        {/* Loading spinner */}
        <div className="mt-8">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>

        {/* Device info */}
        {deviceInfo.isMobile && (
          <div className="mt-4 text-xs opacity-70">
            {deviceInfo.isIOS ? '📱 iOS' : deviceInfo.isAndroid ? '🤖 Android' : '📱 Mobile'}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
} 