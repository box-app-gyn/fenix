import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoIntroProps {
  onComplete: () => void;
}

export default function VideoIntro({ onComplete }: VideoIntroProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Auto-play após um pequeno delay
    const timer = setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch((error) => {
          console.log('Auto-play não permitido, aguardando interação:', error);
          // Se auto-play falhar, aguarda interação do usuário
        });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleVideoEnd = () => {
    setIsEnded(true);
    // Pequeno delay antes de chamar onComplete
    setTimeout(() => {
      onComplete();
    }, 1000);
  };

  const handleVideoClick = () => {
    if (videoRef.current && !isPlaying) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      });
    }
  };

  const handleSkip = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = videoRef.current.duration;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-50 bg-black flex items-center justify-center"
      >
        {/* Overlay de fundo */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
        
        {/* Container do vídeo */}
        <div className="relative w-full h-full flex items-center justify-center">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            onEnded={handleVideoEnd}
            onClick={handleVideoClick}
            muted
            playsInline
            preload="auto"
          >
            <source src="/videos/intro.mp4" type="video/mp4" />
            Seu navegador não suporta vídeos.
          </video>

          {/* Overlay de controles */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Botão de play se não estiver tocando */}
            {!isPlaying && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute inset-0 flex items-center justify-center bg-black/50"
              >
                <button
                  onClick={handleVideoClick}
                  className="bg-white/20 backdrop-blur-sm rounded-full p-6 hover:bg-white/30 transition-all duration-300"
                >
                  <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              </motion.div>
            )}

            {/* Botão de pular */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2 }}
              onClick={handleSkip}
              className="absolute bottom-8 right-8 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full hover:bg-black/70 transition-all duration-300"
            >
              Pular intro
            </motion.button>

            {/* Loading se não carregou */}
            {!isPlaying && !videoRef.current?.readyState && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              </div>
            )}
          </div>

          {/* Transição de saída */}
          <AnimatePresence>
            {isEnded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute inset-0 bg-black flex items-center justify-center"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-center"
                >
                  <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                    Interbox 2025
                  </h1>
                  <p className="text-xl text-gray-300">
                    Bem-vindo à experiência completa
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
} 