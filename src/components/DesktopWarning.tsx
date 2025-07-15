import { motion } from 'framer-motion';

export default function DesktopWarning() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center"
      >
        <div className="mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Acesso Mobile Exclusivo
          </h1>
          <p className="text-gray-600">
            O CERRADØ INTERBOX 2025 é otimizado para dispositivos móveis. 
            Acesse pelo seu smartphone para uma experiência completa.
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">📱 Funcionalidades Mobile:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Navegação otimizada para touch</li>
              <li>• Notificações push em tempo real</li>
              <li>• Instalação como app nativo</li>
              <li>• Experiência gamificada completa</li>
            </ul>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">🔗 Como acessar:</h3>
            <p className="text-sm text-blue-700">
              Abra este link no seu smartphone ou escaneie o QR code abaixo
            </p>
          </div>

          <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg p-4 text-white">
            <h3 className="font-semibold mb-2">🎯 CERRADØ INTERBOX 2025</h3>
            <p className="text-sm opacity-90">
              O maior evento de times da América Latina
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Desenvolvido com ❤️ para nossa comunidade
          </p>
        </div>
      </motion.div>
    </div>
  );
} 