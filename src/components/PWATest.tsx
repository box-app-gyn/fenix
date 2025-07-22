import { useState, useEffect } from 'react';
import { usePWA } from '../hooks/usePWA';

export default function PWATest() {
  const [isVisible, setIsVisible] = useState(false);
  const pwa = usePWA();

  // Só mostrar em desenvolvimento
  if (import.meta.env.PROD) return null;

  // Mostrar com query param ?debug=pwa
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const showDebug = urlParams.get('debug') === 'pwa';
    setIsVisible(showDebug);
  }, []);

  if (!isVisible) return null;

  const testServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        console.log('Service Worker Registration:', registration);
        
        if (registration) {
          await registration.update();
          alert('Service Worker atualizado!');
        } else {
          alert('Nenhum Service Worker registrado');
        }
      } catch (error) {
        console.error('Erro ao testar Service Worker:', error);
        alert('Erro: ' + error);
      }
    } else {
      alert('Service Worker não suportado');
    }
  };

  const testCache = async () => {
    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys();
        console.log('Caches disponíveis:', cacheNames);
        
        const cache = await caches.open('interbox-cache-v1.0.0');
        const keys = await cache.keys();
        console.log('Arquivos em cache:', keys.length);
        
        alert(`Caches: ${cacheNames.length}, Arquivos: ${keys.length}`);
      } catch (error) {
        console.error('Erro ao testar cache:', error);
        alert('Erro: ' + error);
      }
    } else {
      alert('Cache API não suportada');
    }
  };

  const testInstallation = async () => {
    try {
      const result = await pwa.installApp();
      if (result) {
        alert('PWA instalado com sucesso!');
      } else {
        alert('Instalação cancelada ou não disponível');
      }
    } catch (error) {
      console.error('Erro ao instalar PWA:', error);
      alert('Erro: ' + error);
    }
  };

  return (
    <div className="fixed top-4 left-4 bg-black/90 text-white p-4 rounded-lg shadow-lg max-w-sm z-50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold">📱 PWA Test</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>

      <div className="space-y-2 text-xs">
        <div className="grid grid-cols-2 gap-2">
          <div>Online:</div>
          <div className={pwa.isOnline ? 'text-green-400' : 'text-red-400'}>
            {pwa.isOnline ? '✅' : '❌'}
          </div>
          
          <div>SW:</div>
          <div className={pwa.hasServiceWorker ? 'text-green-400' : 'text-red-400'}>
            {pwa.hasServiceWorker ? '✅' : '❌'}
          </div>
          
          <div>Instalado:</div>
          <div className={pwa.isInstalled ? 'text-green-400' : 'text-red-400'}>
            {pwa.isInstalled ? '✅' : '❌'}
          </div>
          
          <div>Instalável:</div>
          <div className={pwa.isInstallable ? 'text-green-400' : 'text-red-400'}>
            {pwa.isInstallable ? '✅' : '❌'}
          </div>
          
          <div>Standalone:</div>
          <div className={pwa.isStandalone ? 'text-green-400' : 'text-red-400'}>
            {pwa.isStandalone ? '✅' : '❌'}
          </div>
          
          <div>Mobile:</div>
          <div className={pwa.deviceInfo.isMobile ? 'text-green-400' : 'text-red-400'}>
            {pwa.deviceInfo.isMobile ? '✅' : '❌'}
          </div>
        </div>

        <div className="border-t border-gray-700 pt-2 mt-2">
          <div className="space-y-1">
            <button
              onClick={testServiceWorker}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 px-2 rounded"
            >
              🔧 Testar SW
            </button>
            
            <button
              onClick={testCache}
              className="w-full bg-green-600 hover:bg-green-700 text-white text-xs py-1 px-2 rounded"
            >
              🗄️ Testar Cache
            </button>
            
            <button
              onClick={testInstallation}
              disabled={!pwa.isInstallable}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white text-xs py-1 px-2 rounded"
            >
              📱 Instalar PWA
            </button>
            
            <button
              onClick={pwa.clearCache}
              className="w-full bg-red-600 hover:bg-red-700 text-white text-xs py-1 px-2 rounded"
            >
              🧹 Limpar Cache
            </button>
          </div>
        </div>

        <details className="mt-2">
          <summary className="cursor-pointer hover:text-gray-300">
            📋 Detalhes
          </summary>
          <div className="mt-1 bg-gray-800 p-2 rounded text-xs">
            <pre className="whitespace-pre-wrap">
              {JSON.stringify({
                isOnline: pwa.isOnline,
                hasServiceWorker: pwa.hasServiceWorker,
                isInstalled: pwa.isInstalled,
                isInstallable: pwa.isInstallable,
                isStandalone: pwa.isStandalone,
                deviceInfo: pwa.deviceInfo,
                cacheStatus: pwa.cacheStatus,
                offlineActions: pwa.offlineActions,
                analyticsQueue: pwa.analyticsQueue,
              }, null, 2)}
            </pre>
          </div>
        </details>
      </div>
    </div>
  );
} 