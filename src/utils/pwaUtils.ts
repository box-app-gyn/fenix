// Utilitários para PWA e Cache

// Limpar todos os caches do Service Worker
export const clearAllCaches = async (): Promise<void> => {
  try {
    console.log('🧹 Limpando todos os caches...');

    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map((cacheName) => {
          console.log(`🗑️ Removendo cache: ${cacheName}`);
          return caches.delete(cacheName);
        }),
      );
      console.log('✅ Todos os caches foram limpos');
    }
  } catch (error) {
    console.error('❌ Erro ao limpar caches:', error);
  }
};

// Verificar status do Service Worker
export const getServiceWorkerStatus = async (): Promise<{
  registered: boolean;
  waiting: boolean;
  installing: boolean;
  version?: string;
}> => {
  try {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();

      if (registration) {
        return {
          registered: true,
          waiting: !!registration.waiting,
          installing: !!registration.installing,
          version: registration.active?.scriptURL,
        };
      }
    }

    return {
      registered: false,
      waiting: false,
      installing: false,
    };
  } catch (error) {
    console.error('❌ Erro ao verificar Service Worker:', error);
    return {
      registered: false,
      waiting: false,
      installing: false,
    };
  }
};

// Forçar atualização do Service Worker
export const forceUpdateServiceWorker = async (): Promise<void> => {
  try {
    console.log('🔄 Forçando atualização do Service Worker...');

    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();

      if (registration && registration.waiting) {
        // Enviar mensagem para o Service Worker atualizar
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        console.log('✅ Mensagem de atualização enviada');
      } else {
        // Recarregar o Service Worker
        await navigator.serviceWorker.register('/sw.js');
        console.log('✅ Service Worker recarregado');
      }
    }
  } catch (error) {
    console.error('❌ Erro ao atualizar Service Worker:', error);
  }
};

// Verificar se o app está instalado como PWA
export const isPWAInstalled = (): boolean => {
  return window.matchMedia('(display-mode: standalone)').matches
         || (window.navigator as any).standalone === true;
};

// Verificar conectividade
export const isOnline = (): boolean => {
  return navigator.onLine;
};

// Listener para mudanças de conectividade
export const addConnectivityListener = (callback: (online: boolean) => void): void => {
  window.addEventListener('online', () => callback(true));
  window.addEventListener('offline', () => callback(false));
};

// Debug completo do PWA
export const debugPWA = async (): Promise<{
  serviceWorker: any;
  caches: string[];
  pwaInstalled: boolean;
  online: boolean;
  userAgent: string;
}> => {
  const cacheNames = await caches.keys();
  const swStatus = await getServiceWorkerStatus();

  return {
    serviceWorker: swStatus,
    caches: cacheNames,
    pwaInstalled: isPWAInstalled(),
    online: isOnline(),
    userAgent: navigator.userAgent,
  };
};

// Registrar Service Worker manualmente
export const registerServiceWorker = async (): Promise<void> => {
  try {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      console.log('✅ Service Worker registrado:', registration);

      // Listener para atualizações
      registration.addEventListener('updatefound', () => {
        console.log('🔄 Nova versão do Service Worker encontrada');
      });

      // Listener para ativação
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('✅ Service Worker ativado');
        window.location.reload();
      });
    }
  } catch (error) {
    console.error('❌ Erro ao registrar Service Worker:', error);
  }
};

// Verificar se Firebase Auth está funcionando
export const checkFirebaseAuth = async (): Promise<boolean> => {
  try {
    // Tentar fazer uma requisição para Firebase Auth
    const response = await fetch('https://firebase.googleapis.com/v1/projects/interbox-app-8d400', {
      method: 'HEAD',
    });

    return response.ok;
  } catch (error) {
    console.error('❌ Firebase Auth não está acessível:', error);
    return false;
  }
};

// Logs de debug do PWA
export const logPWADebug = async (): Promise<void> => {
  console.group('🔧 Debug PWA - CERRADØ INTERBOX 2025');

  const debug = await debugPWA();
  console.log('Service Worker:', debug.serviceWorker);
  console.log('Caches:', debug.caches);
  console.log('PWA Instalado:', debug.pwaInstalled);
  console.log('Online:', debug.online);
  console.log('User Agent:', debug.userAgent);

  const firebaseAuth = await checkFirebaseAuth();
  console.log('Firebase Auth:', firebaseAuth ? '✅ Acessível' : '❌ Inacessível');

  console.groupEnd();
};
