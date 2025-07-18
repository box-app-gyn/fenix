import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePWA } from '../hooks/usePWA';

interface PWAInstallPromptProps {
  onClose?: () => void;
  showIncentive?: boolean;
}

export default function PWAInstallPrompt({ onClose, showIncentive = true }: PWAInstallPromptProps) {
  const {
    isInstallable,
    isInstalled,
    isStandalone,
    installApp,
    trackEvent,
  } = usePWA();

  const [isVisible, setIsVisible] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [showBenefits, setShowBenefits] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  // Detectar dispositivo e navegador
  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: false,
    isIOS: false,
    isAndroid: false,
    isChrome: false,
    isSafari: false,
    isFirefox: false,
    isEdge: false,
  });

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    setDeviceInfo({
      isMobile: /mobile|android|iphone|ipad|phone/i.test(userAgent),
      isIOS: /iphone|ipad|ipod/i.test(userAgent),
      isAndroid: /android/i.test(userAgent),
      isChrome: /chrome/i.test(userAgent) && !/edge/i.test(userAgent),
      isSafari: /safari/i.test(userAgent) && !/chrome/i.test(userAgent),
      isFirefox: /firefox/i.test(userAgent),
      isEdge: /edge/i.test(userAgent),
    });
  }, []);

  // Mostrar prompt após delay
  useEffect(() => {
    if (isInstallable && !isInstalled && !isStandalone) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        trackEvent('pwa_install_prompt_shown', {
          timestamp: Date.now(),
        });
      }, 3000); // 3 segundos

      return () => clearTimeout(timer);
    }
  }, [isInstallable, isInstalled, isStandalone, trackEvent]);

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
        setIsVisible(false);
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
    setIsVisible(false);
    trackEvent('pwa_install_dismissed', {
      timestamp: Date.now(),
    });
    onClose?.();
  };

  const handleLater = () => {
    setIsVisible(false);
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

  if (!isVisible) return null;

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

            {showIncentive && (
              <div className="bg-gradient-to-r from-pink-50 to-blue-50 border border-pink-200 rounded-lg p-4 mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-pink-600 text-lg">🎁</span>
                  <span className="font-semibold text-pink-700">Bônus de Instalação</span>
                </div>
                <p className="text-sm text-gray-600">
                  Ganhe <strong>+25 ₿ tokens</strong> ao instalar o app!
                </p>
              </div>
            )}

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
                <span>Sincronização automática</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              onClick={handleLater}
              className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Depois
            </button>
            <button
              onClick={handleInstall}
              disabled={isInstalling}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-pink-600 to-blue-600 text-white rounded-lg hover:from-pink-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-sm font-medium flex items-center justify-center space-x-2"
            >
              {isInstalling ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Instalando...</span>
                </>
              ) : (
                <>
                  <span>📱</span>
                  <span>Instalar</span>
                </>
              )}
            </button>
          </div>

          {/* Instructions Button */}
          <button
            onClick={() => setShowInstructions(!showInstructions)}
            className="w-full mt-3 text-center text-sm text-blue-600 hover:text-blue-700 transition-colors font-medium"
          >
            {showInstructions ? 'Ocultar instruções' : '📋 Como instalar manualmente?'}
          </button>

          {/* Instructions */}
          <AnimatePresence>
            {showInstructions && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 pt-4 border-t border-gray-200 overflow-hidden"
              >
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                    <span className="mr-2">📋</span>
                    {instructions.title}
                  </h4>
                  <div className="space-y-2">
                    {instructions.steps.map((step, index) => (
                      <p key={index} className="text-sm text-blue-700 leading-relaxed">
                        {step}
                      </p>
                    ))}
                  </div>
                  
                  {/* Dica adicional */}
                  <div className="mt-3 p-2 bg-blue-100 rounded border border-blue-300">
                    <p className="text-xs text-blue-800">
                      💡 <strong>Dica:</strong> Após a instalação, o app aparecerá na sua tela inicial ou menu de aplicativos!
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Learn More */}
          <button
            onClick={() => setShowBenefits(!showBenefits)}
            className="w-full mt-3 text-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            {showBenefits ? 'Ocultar detalhes' : 'Ver mais benefícios'}
          </button>

          {/* Expanded Benefits */}
          <AnimatePresence>
            {showBenefits && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 pt-4 border-t border-gray-200 overflow-hidden"
              >
                <div className="space-y-3">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <h4 className="font-semibold text-blue-800 mb-1">🚀 Performance</h4>
                    <p className="text-sm text-blue-700">
                      Carregamento mais rápido e funcionamento offline
                    </p>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <h4 className="font-semibold text-green-800 mb-1">💾 Economia de Dados</h4>
                    <p className="text-sm text-green-700">
                      Menos consumo de internet com cache inteligente
                    </p>
                  </div>
                  
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <h4 className="font-semibold text-purple-800 mb-1">🔔 Notificações</h4>
                    <p className="text-sm text-purple-700">
                      Receba atualizações importantes em tempo real
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
