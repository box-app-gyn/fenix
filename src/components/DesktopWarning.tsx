import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface DesktopWarningProps {
  allowAdminAccess?: boolean;
  isAudiovisualForm?: boolean;
}

export default function DesktopWarning({ allowAdminAccess = false, isAudiovisualForm = false }: DesktopWarningProps) {
  const qrCodeRef = useRef<HTMLCanvasElement>(null);

  // Gerar QR code para a URL atual
  useEffect(() => {
    const generateQRCode = async () => {
      if (qrCodeRef.current) {
        try {
          const currentUrl = window.location.href;
          await QRCode.toCanvas(qrCodeRef.current, currentUrl, {
            width: 200,
            margin: 2,
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            }
          });
        } catch (error) {
          console.error('Erro ao gerar QR code:', error);
        }
      }
    };

    generateQRCode();
  }, []);

  // Se for formulário audiovisual, mostrar versão específica
  if (isAudiovisualForm) {
    return (
      <div
        className="fixed inset-0 w-full h-full flex items-center justify-center p-4 z-50"
        style={{
          backgroundImage: 'url(/images/bg_1.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Background com imagem */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/images/bg_1.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        ></div>

        {/* Conteúdo centralizado */}
        <div className="relative z-10 w-full max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-2xl p-8 w-full text-center"
          >
            <div className="mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Formulário Audiovisual
              </h1>
              <p className="text-gray-600">
                Candidate-se para fazer parte da equipe audiovisual da CERRADØ INTERBOX 2025!
              </p>
            </div>

            <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg p-4 text-white">
              <h3 className="font-semibold mb-2">🎯 CERRADØ INTERBOX 2025</h3>
              <p className="text-sm opacity-90">
                ᴄᴏᴍᴘᴇᴛɪçãᴏ. ᴄᴏᴍᴜɴɪᴅᴀᴅᴇ. ᴘʀᴏᴘóꜱɪᴛᴏ.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => window.history.back()}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors mr-3"
              >
                Voltar
              </button>
              <button
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Continuar
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Se permitir acesso administrativo, mostrar uma versão diferente
  if (allowAdminAccess) {
    return (
      <div
        className="fixed inset-0 w-full h-full flex items-center justify-center p-4 z-50"
        style={{
          backgroundImage: 'url(/images/bg_1.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Background com imagem */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/images/bg_1.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        ></div>

        {/* Conteúdo centralizado */}
        <div className="relative z-10 w-full max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-2xl p-8 w-full text-center"
          >
            <div className="mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Acesso Administrativo Permitido
              </h1>
              <p className="text-gray-600">
                Você está acessando um painel administrativo.
                A experiência pode ser otimizada para dispositivos móveis, mas o acesso é permitido.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-2">✅ Funcionalidades Disponíveis:</h3>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Todas as funcionalidades administrativas</li>
                  <li>• Gerenciamento completo do sistema</li>
                  <li>• Configurações avançadas</li>
                  <li>• Relatórios e analytics</li>
                </ul>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">💡 Recomendação:</h3>
                <p className="text-sm text-blue-700">
                  Para uma experiência ideal, considere usar um dispositivo móvel ou tablet
                </p>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-lg p-4 text-white">
                <h3 className="font-semibold mb-2">🎯 CERRADØ INTERBOX 2025</h3>
                <p className="text-sm opacity-90">
                  Painel Administrativo
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => window.history.back()}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors mr-3"
              >
                Voltar
              </button>
              <button
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Continuar
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Versão original para usuários normais
  return (
    <div
      className="fixed inset-0 w-full h-full flex items-center justify-center p-4 z-50"
      style={{
        backgroundImage: 'url(/images/bg_1.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Background com imagem */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/images/bg_1.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      ></div>

      {/* Conteúdo centralizado */}
      <div className="relative z-10 w-full max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl p-8 w-full text-center"
        >
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <img 
                src="/logos/logo_circulo.png" 
                alt="InterBox Logo" 
                className="w-10 h-10 object-contain"
              />
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
              <p className="text-sm text-blue-700 mb-3">
                Abra este link no seu smartphone ou escaneie o QR code abaixo
              </p>
              <div className="flex justify-center">
                <canvas
                  ref={qrCodeRef}
                  className="border-2 border-gray-300 rounded-lg shadow-sm"
                  style={{ width: '150px', height: '150px' }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Escaneie com a câmera do seu smartphone
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
    </div>
  );
}
