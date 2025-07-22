import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePWA } from '../hooks/usePWA';

export default function PWAInstallPrompt() {
  const {
    showInstallPrompt,
    hideInstallPrompt,
    isInstalled,
    isStandalone,
    deviceInfo,
    installApp,
    trackEvent,
  } = usePWA();

  const [isInstalling, setIsInstalling] = useState(false);
  const [showBenefits, setShowBenefits] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  // Não mostrar se já instalado ou em modo standalone
  if (!showInstallPrompt || isInstalled || isStandalone) return null;

  const handleInstall = async () => {
    setIsInstalling(true);
    trackEvent('pwa_install_attempted', {
      timestamp: Date.now(),
    });

    try {
      const success = await installApp();
      if (success) {
        trackEvent('pwa_install_success', {
          timestamp: Date.now(),
        });
        hideInstallPrompt();
      }
    } catch (error) {
      console.error('Erro ao instalar PWA:', error);
      trackEvent('pwa_install_error', {
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now(),
      });
    } finally {
      setIsInstalling(false);
    }
  };

  const handleClose = () => {
    hideInstallPrompt();
    trackEvent('pwa_install_dismissed', {
      timestamp: Date.now(),
    });
  };

  const handleLater = () => {
    hideInstallPrompt();
    trackEvent('pwa_install_later', {
      timestamp: Date.now(),
    });
    // Mostrar novamente em 24 horas
    localStorage.setItem('pwa_install_reminder', Date.now().toString());
  };

  // Gerar instruções específicas baseadas no dispositivo
  const getInstallInstructions = () => {
    if (deviceInfo.isIOS) {
      if (deviceInfo.isSafari) {
        return {
          title: "📱 iPhone/iPad (Safari)",
          steps: [
            "1. Toque no botão 📤 Compartilhar (quadrado com seta)",
            "2. Role para baixo e toque em 'Adicionar à Tela Inicial'",
            "3. Toque em 'Adicionar' para confirmar",
            "4. O app aparecerá na sua tela inicial!"
          ]
        };
      } else {
        return {
          title: "📱 iPhone/iPad (Outros navegadores)",
          steps: [
            "1. Abra o Safari no seu dispositivo",
            "2. Acesse este site novamente",
            "3. Toque no botão 📤 Compartilhar",
            "4. Selecione 'Adicionar à Tela Inicial'"
          ]
        };
      }
    } else if (deviceInfo.isAndroid) {
      if (deviceInfo.isChrome) {
        return {
          title: "🤖 Android (Chrome)",
          steps: [
            "1. Toque no menu ⋮ (três pontos)",
            "2. Selecione 'Adicionar à tela inicial'",
            "3. Toque em 'Adicionar' para confirmar",
            "4. O app aparecerá na sua tela inicial!"
          ]
        };
      } else {
        return {
          title: "🤖 Android (Outros navegadores)",
          steps: [
            "1. Abra o Chrome no seu dispositivo",
            "2. Acesse este site novamente",
            "3. Toque no menu do navegador",
            "4. Procure por 'Adicionar à tela inicial'"
          ]
        };
      }
    } else {
      // Desktop
      if (deviceInfo.isChrome) {
        return {
          title: "💻 Desktop (Chrome)",
          steps: [
            "1. Clique no ícone 📌 (instalar) na barra de endereços",
            "2. Ou clique no menu ⋮ → 'Mais ferramentas' → 'Criar atalho'",
            "3. Marque 'Abrir como janela' se desejar",
            "4. Clique em 'Instalar'"
          ]
        };
      } else if (deviceInfo.isEdge) {
        return {
          title: "💻 Desktop (Edge)",
          steps: [
            "1. Clique no ícone 📌 (instalar) na barra de endereços",
            "2. Ou clique no menu ⋯ → 'Aplicativos' → 'Instalar este site'",
            "3. Clique em 'Instalar' para confirmar"
          ]
        };
      } else if (deviceInfo.isFirefox) {
        return {
          title: "💻 Desktop (Firefox)",
          steps: [
            "1. Clique no ícone 📌 (fixar) na barra de endereços",
            "2. Ou clique no menu ☰ → 'Aplicativo' → 'Instalar'",
            "3. Clique em 'Adicionar' para confirmar"
          ]
        };
      } else {
        return {
          title: "💻 Desktop (Outros navegadores)",
          steps: [
            "1. Procure por um ícone de instalação na barra de endereços",
            "2. Ou verifique o menu do navegador por opções de instalação",
            "3. Alguns navegadores podem não suportar instalação de PWA"
          ]
        };
      }
    }
  };

  const instructions = getInstallInstructions();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto"
      >
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl font-bold">📱</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Instalar App</h3>
                <p className="text-sm text-gray-600">Interbox 2025</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="mb-6">
            <p className="text-gray-700 mb-4">
              Instale o Interbox 2025 no seu dispositivo para uma experiência completa!
            </p>

            <div className="bg-gradient-to-r from-pink-50 to-blue-50 border border-pink-200 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-pink-600 text-lg">🎁</span>
                <span className="font-semibold text-pink-700">Bônus de Instalação</span>
              </div>
              <p className="text-sm text-gray-600">
                Ganhe <strong>+25 ₿ tokens</strong> ao instalar o app!
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span className="text-green-500">✓</span>
                <span>Acesso offline completo</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span className="text-green-500">✓</span>
                <span>Notificações push</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span className="text-green-500">✓</span>
                <span>Experiência nativa</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span className="text-green-500">✓</span>
                <span>Atualizações automáticas</span>
              </div>
            </div>

            {/* Instructions */}
            {showInstructions && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-4 bg-gray-50 rounded-lg"
              >
                <h4 className="font-semibold text-gray-800 mb-2">{instructions.title}</h4>
                <ol className="space-y-1 text-sm text-gray-600">
                  {instructions.steps.map((step: string, index: number) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </motion.div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col space-y-3">
            {deviceInfo.isMobile && !deviceInfo.isChrome && !deviceInfo.isSafari ? (
              // Dispositivos mobile sem suporte nativo
              <button
                onClick={() => setShowInstructions(!showInstructions)}
                className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 text-sm font-medium"
              >
                {showInstructions ? 'Ocultar' : 'Ver'} Instruções
              </button>
            ) : (
              // Dispositivos com suporte nativo
              <button
                onClick={handleInstall}
                disabled={isInstalling}
                className="w-full px-4 py-3 bg-gradient-to-r from-pink-600 to-blue-600 text-white rounded-lg hover:from-pink-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-sm font-medium flex items-center justify-center space-x-2"
              >
                {isInstalling ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Instalando...</span>
                  </>
                ) : (
                  <>
                    <span>📱</span>
                    <span>Instalar Agora</span>
                  </>
                )}
              </button>
            )}

            <div className="flex space-x-3">
              <button
                onClick={handleLater}
                className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Depois
              </button>
              <button
                onClick={() => setShowBenefits(!showBenefits)}
                className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                {showBenefits ? 'Menos' : 'Mais'} Info
              </button>
            </div>
          </div>

          {/* Additional Benefits */}
          {showBenefits && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg"
            >
              <h4 className="font-semibold text-green-800 mb-2">🎯 Benefícios Exclusivos</h4>
              <ul className="space-y-1 text-sm text-green-700">
                <li>• Acesso prioritário a novos recursos</li>
                <li>• Sincronização automática de dados</li>
                <li>• Modo offline completo</li>
                <li>• Notificações personalizadas</li>
                <li>• Performance otimizada</li>
              </ul>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
