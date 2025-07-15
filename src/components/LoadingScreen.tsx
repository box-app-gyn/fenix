import { motion } from 'framer-motion';

interface LoadingScreenProps {
  message?: string;
  showProgress?: boolean;
  progress?: number;
}

export default function LoadingScreen({ 
  message = "Carregando...", 
  showProgress = false,
  progress = 0 
}: LoadingScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-sm mx-auto"
      >
        {/* Spinner principal */}
        <div className="relative mb-6">
          <div className="w-20 h-20 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto"></div>
          <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-pink-400 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          
          {/* Logo central */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">I</span>
            </div>
          </div>
        </div>

        {/* Mensagem */}
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-white/90 text-lg font-medium mb-4"
        >
          {message}
        </motion.p>

        {/* Barra de progresso (opcional) */}
        {showProgress && (
          <motion.div 
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: '100%' }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="w-full bg-white/20 rounded-full h-2 mb-4"
          >
            <motion.div 
              className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </motion.div>
        )}

        {/* Indicador de carregamento */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex items-center justify-center gap-2 text-white/60 text-sm"
        >
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <span>Conectando...</span>
        </motion.div>

        {/* Informações adicionais */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="mt-8 text-white/40 text-xs"
        >
          <p>INTERBOX 2025</p>
          <p>O maior evento fitness do Brasil</p>
        </motion.div>
      </motion.div>
    </div>
  );
} 