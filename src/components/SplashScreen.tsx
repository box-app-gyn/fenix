import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface SplashScreenProps {
  onComplete: () => void
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isPlaying] = useState(true)
  const [videoEnded] = useState(false)
  const [videoFailed, setVideoFailed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleVideoEnd = () => {
      setVideoFailed(false)
      setIsLoading(false)
      onComplete()
    }

    const handleVideoError = () => {
      setVideoFailed(true)
      setIsLoading(false)
      onComplete()
    }

    const handleVideoLoad = () => {
      setIsLoading(false)
    }

    // Timeout para conexões lentas (ex: 7s)
    const timeout = setTimeout(() => {
      setVideoFailed(true)
      setIsLoading(false)
      handleVideoError()
    }, 7000)

    video.addEventListener('ended', handleVideoEnd)
    video.addEventListener('error', handleVideoError)
    video.addEventListener('loadeddata', handleVideoLoad)

    return () => {
      video.removeEventListener('ended', handleVideoEnd)
      video.removeEventListener('error', handleVideoError)
      video.removeEventListener('loadeddata', handleVideoLoad)
      if (timeout) clearTimeout(timeout)
    }
  }, [onComplete])

  return (
    <AnimatePresence>
      {isPlaying && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
          }}
        >
          {/* Loading Spinner */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black"
            >
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-white text-sm">Carregando...</p>
              </div>
            </motion.div>
          )}

          {/* Vídeo de intro ou fallback */}
          {!videoFailed ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              preload="auto"
              className="w-full h-full object-cover"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            >
              <source src="/videos/intro.mp4" type="video/mp4" />
              <source src="/videos/intro 2.mp4" type="video/mp4" />
              {/* Fallback para navegadores que não suportam vídeo */}
              <div className="flex items-center justify-center w-full h-full bg-black">
                <div className="text-center">
                  <img
                    src="/logos/logo_circulo.png"
                    alt="CERRADØ INTERBOX"
                    width={128}
                    height={128}
                    className="w-32 h-32 mx-auto mb-4 animate-pulse"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                  <h1 className="text-white text-2xl font-bold mb-2">CERRADØ INTERBOX</h1>
                  <p className="text-gray-300">2025</p>
                </div>
              </div>
            </video>
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-black">
              <div className="text-center">
                <img
                  src="/logos/logo_circulo.png"
                  alt="CERRADØ INTERBOX"
                  width={128}
                  height={128}
                  className="w-32 h-32 mx-auto mb-4 animate-pulse"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
                <h1 className="text-white text-2xl font-bold mb-2">CERRADØ INTERBOX</h1>
                <p className="text-gray-300">2025</p>
              </div>
            </div>
          )}

          {/* Overlay com logo quando vídeo termina */}
          <AnimatePresence>
            {videoEnded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex items-center justify-center bg-black"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-center"
                >
                  <img
                    src="/logos/logo_circulo.png"
                    alt="CERRADØ INTERBOX"
                    width={128}
                    height={128}
                    className="w-32 h-32 mx-auto mb-4"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                  <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="text-white text-3xl font-bold mb-2"
                  >
                    CERRADØ INTERBOX
                  </motion.h1>
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="text-gray-300 text-xl"
                  >
                    2025
                  </motion.p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Fallback para PWA */}
          <div className="absolute bottom-4 left-4 right-4 text-center">
            <p className="text-white/60 text-xs">
              Carregando CERRADO INTERBØX 2025...
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
