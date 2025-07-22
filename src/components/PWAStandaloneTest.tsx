import { useState, useEffect } from 'react';
import { usePWA } from '../hooks/usePWA';

export default function PWAStandaloneTest() {
  const pwa = usePWA();
  const [standaloneInfo, setStandaloneInfo] = useState<any>(null);

  useEffect(() => {
    const checkStandalone = () => {
      const info = {
        // Verificações de standalone
        isStandalone: window.matchMedia('(display-mode: standalone)').matches,
        isFullscreen: window.matchMedia('(display-mode: fullscreen)').matches,
        isMinimalUI: window.matchMedia('(display-mode: minimal-ui)').matches,
        isBrowser: window.matchMedia('(display-mode: browser)').matches,
        
        // Verificações de PWA
        hasManifest: !!document.querySelector('link[rel="manifest"]'),
        hasServiceWorker: 'serviceWorker' in navigator,
        serviceWorkerActive: !!navigator.serviceWorker.controller,
        
        // Verificações de instalação
        isInstalled: pwa.isInstalled,
        isInstallable: pwa.isInstallable,
        
        // Verificações de dispositivo
        isMobile: /mobile|android|iphone|ipad|phone/i.test(navigator.userAgent),
        isIOS: /iphone|ipad|ipod/i.test(navigator.userAgent),
        isAndroid: /android/i.test(navigator.userAgent),
        
        // Verificações de navegador
        isChrome: /chrome/i.test(navigator.userAgent) && !/edge/i.test(navigator.userAgent),
        isSafari: /safari/i.test(navigator.userAgent) && !/chrome/i.test(navigator.userAgent),
        isFirefox: /firefox/i.test(navigator.userAgent),
        isEdge: /edge/i.test(navigator.userAgent),
        
        // Informações do manifest
        manifest: null as any,
        
        // URL e contexto
        url: window.location.href,
        hostname: window.location.hostname,
        protocol: window.location.protocol,
        
        // Timestamp
        timestamp: new Date().toISOString(),
      };

      // Tentar obter informações do manifest
      try {
        const manifestLink = document.querySelector('link[rel="manifest"]') as HTMLLinkElement;
        if (manifestLink) {
          fetch(manifestLink.href)
            .then(response => response.json())
            .then(manifest => {
              info.manifest = manifest;
              setStandaloneInfo(info);
            })
            .catch(() => {
              setStandaloneInfo(info);
            });
        } else {
          setStandaloneInfo(info);
        }
      } catch (error) {
        setStandaloneInfo(info);
      }
    };

    checkStandalone();
  }, [pwa]);

  if (!standaloneInfo) {
    return (
      <div className="fixed top-4 left-4 bg-white/95 backdrop-blur-lg rounded-lg shadow-lg border border-gray-200 p-4 max-w-md z-50">
        <div className="animate-pulse">Carregando informações do PWA...</div>
      </div>
    );
  }

  const getDisplayModeText = () => {
    if (standaloneInfo.isStandalone) return '📱 Standalone (PWA)';
    if (standaloneInfo.isFullscreen) return '🖥️ Fullscreen';
    if (standaloneInfo.isMinimalUI) return '📱 Minimal UI';
    if (standaloneInfo.isBrowser) return '🌐 Browser';
    return '❓ Desconhecido';
  };

  const getInstallStatus = () => {
    if (standaloneInfo.isInstalled) return '✅ Instalado';
    if (standaloneInfo.isInstallable) return '📥 Pode instalar';
    return '❌ Não instalável';
  };

  return (
    <div className="fixed top-4 left-4 bg-white/95 backdrop-blur-lg rounded-lg shadow-lg border border-gray-200 p-4 max-w-md z-50 max-h-[80vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">📱 PWA Standalone Test</h3>
        <button
          onClick={() => window.location.reload()}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          🔄
        </button>
      </div>

      <div className="space-y-4">
        {/* Display Mode */}
        <div className="bg-blue-50 p-3 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">🎯 Modo de Exibição</h4>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="font-medium">{getDisplayModeText()}</span>
            </div>
            <div className="flex justify-between">
              <span>Standalone:</span>
              <span className={standaloneInfo.isStandalone ? 'text-green-600' : 'text-red-600'}>
                {standaloneInfo.isStandalone ? '✅ Sim' : '❌ Não'}
              </span>
            </div>
          </div>
        </div>

        {/* Installation Status */}
        <div className="bg-green-50 p-3 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-2">📥 Instalação</h4>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="font-medium">{getInstallStatus()}</span>
            </div>
            <div className="flex justify-between">
              <span>Instalável:</span>
              <span className={standaloneInfo.isInstallable ? 'text-green-600' : 'text-red-600'}>
                {standaloneInfo.isInstallable ? '✅ Sim' : '❌ Não'}
              </span>
            </div>
          </div>
        </div>

        {/* PWA Features */}
        <div className="bg-purple-50 p-3 rounded-lg">
          <h4 className="font-semibold text-purple-800 mb-2">🔧 Recursos PWA</h4>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span>Manifest:</span>
              <span className={standaloneInfo.hasManifest ? 'text-green-600' : 'text-red-600'}>
                {standaloneInfo.hasManifest ? '✅ Presente' : '❌ Ausente'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Service Worker:</span>
              <span className={standaloneInfo.hasServiceWorker ? 'text-green-600' : 'text-red-600'}>
                {standaloneInfo.hasServiceWorker ? '✅ Suportado' : '❌ Não suportado'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>SW Ativo:</span>
              <span className={standaloneInfo.serviceWorkerActive ? 'text-green-600' : 'text-red-600'}>
                {standaloneInfo.serviceWorkerActive ? '✅ Ativo' : '❌ Inativo'}
              </span>
            </div>
          </div>
        </div>

        {/* Device Info */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">📱 Dispositivo</h4>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span>Mobile:</span>
              <span className={standaloneInfo.isMobile ? 'text-green-600' : 'text-blue-600'}>
                {standaloneInfo.isMobile ? '📱 Sim' : '💻 Não'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>iOS:</span>
              <span className={standaloneInfo.isIOS ? 'text-green-600' : 'text-gray-600'}>
                {standaloneInfo.isIOS ? '🍎 Sim' : '❌ Não'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Android:</span>
              <span className={standaloneInfo.isAndroid ? 'text-green-600' : 'text-gray-600'}>
                {standaloneInfo.isAndroid ? '🤖 Sim' : '❌ Não'}
              </span>
            </div>
          </div>
        </div>

        {/* Browser Info */}
        <div className="bg-yellow-50 p-3 rounded-lg">
          <h4 className="font-semibold text-yellow-800 mb-2">🌐 Navegador</h4>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span>Chrome:</span>
              <span className={standaloneInfo.isChrome ? 'text-green-600' : 'text-gray-600'}>
                {standaloneInfo.isChrome ? '✅ Sim' : '❌ Não'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Safari:</span>
              <span className={standaloneInfo.isSafari ? 'text-green-600' : 'text-gray-600'}>
                {standaloneInfo.isSafari ? '✅ Sim' : '❌ Não'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Firefox:</span>
              <span className={standaloneInfo.isFirefox ? 'text-green-600' : 'text-gray-600'}>
                {standaloneInfo.isFirefox ? '✅ Sim' : '❌ Não'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Edge:</span>
              <span className={standaloneInfo.isEdge ? 'text-green-600' : 'text-gray-600'}>
                {standaloneInfo.isEdge ? '✅ Sim' : '❌ Não'}
              </span>
            </div>
          </div>
        </div>

        {/* Manifest Info */}
        {standaloneInfo.manifest && (
          <div className="bg-indigo-50 p-3 rounded-lg">
            <h4 className="font-semibold text-indigo-800 mb-2">📋 Manifest</h4>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span>Nome:</span>
                <span className="font-medium">{standaloneInfo.manifest.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Display:</span>
                <span className="font-medium">{standaloneInfo.manifest.display}</span>
              </div>
              <div className="flex justify-between">
                <span>Start URL:</span>
                <span className="font-medium">{standaloneInfo.manifest.start_url}</span>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-orange-50 p-3 rounded-lg">
          <h4 className="font-semibold text-orange-800 mb-2">💡 Como Testar Standalone</h4>
          <div className="text-sm space-y-2">
            <div>
              <strong>📱 Mobile:</strong>
              <ul className="ml-4 mt-1 space-y-1">
                <li>• Adicione à tela inicial</li>
                <li>• Abra pelo ícone do app</li>
                <li>• Deve abrir sem barra de navegação</li>
              </ul>
            </div>
            <div>
              <strong>💻 Desktop:</strong>
              <ul className="ml-4 mt-1 space-y-1">
                <li>• Instale o app</li>
                <li>• Abra pelo ícone do app</li>
                <li>• Deve abrir em janela separada</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Debug Info */}
        <div className="bg-gray-100 p-3 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">🔍 Debug</h4>
          <div className="text-xs space-y-1">
            <div>URL: {standaloneInfo.url}</div>
            <div>Hostname: {standaloneInfo.hostname}</div>
            <div>Protocol: {standaloneInfo.protocol}</div>
            <div>Timestamp: {new Date(standaloneInfo.timestamp).toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
} 