import { useState, useEffect, useCallback } from 'react';

interface PWAState {
  isOnline: boolean;
  isInstalled: boolean;
  isInstallable: boolean;
  isStandalone: boolean;
  hasServiceWorker: boolean;
  isUpdateAvailable: boolean;
  cacheStatus: 'idle' | 'caching' | 'cached' | 'error';
  offlineActions: number;
  analyticsQueue: number;
  deviceInfo: {
    isMobile: boolean;
    isIOS: boolean;
    isAndroid: boolean;
    isChrome: boolean;
    isSafari: boolean;
    isFirefox: boolean;
    isEdge: boolean;
    isPWA: boolean;
  };
}

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const usePWA = () => {
  const [state, setState] = useState<PWAState>({
    isOnline: navigator.onLine,
    isInstalled: false,
    isInstallable: false,
    isStandalone: window.matchMedia('(display-mode: standalone)').matches,
    hasServiceWorker: 'serviceWorker' in navigator,
    isUpdateAvailable: false,
    cacheStatus: 'idle',
    offlineActions: 0,
    analyticsQueue: 0,
    deviceInfo: {
      isMobile: false,
      isIOS: false,
      isAndroid: false,
      isChrome: false,
      isSafari: false,
      isFirefox: false,
      isEdge: false,
      isPWA: false,
    },
  });

  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);

  // Detectar informações do dispositivo
  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    
    const deviceInfo = {
      isMobile: /mobile|android|iphone|ipad|phone/i.test(userAgent),
      isIOS: /iphone|ipad|ipod/i.test(userAgent),
      isAndroid: /android/i.test(userAgent),
      isChrome: /chrome/i.test(userAgent) && !/edge/i.test(userAgent),
      isSafari: /safari/i.test(userAgent) && !/chrome/i.test(userAgent),
      isFirefox: /firefox/i.test(userAgent),
      isEdge: /edge/i.test(userAgent),
      isPWA: isStandalone,
    };

    setState(prev => ({ ...prev, deviceInfo, isStandalone }));
  }, []);

  // Detectar mudanças de conectividade
  useEffect(() => {
    const handleOnline = () => setState(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setState(prev => ({ ...prev, isOnline: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Detectar prompt de instalação
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as InstallPromptEvent);
      setState(prev => ({ ...prev, isInstallable: true }));
      
      // Analytics
      trackEvent('pwa_install_prompt_available', {
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
      });
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Detectar instalação
  useEffect(() => {
    const handleAppInstalled = () => {
      setState(prev => ({ 
        ...prev, 
        isInstalled: true, 
        isInstallable: false 
      }));
      setInstallPrompt(null);
      
      // Analytics
      trackEvent('pwa_installed', {
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
      });
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Verificar Service Worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        // Verificar atualizações
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setState(prev => ({ ...prev, isUpdateAvailable: true }));
                
                // Analytics
                trackEvent('pwa_update_available', {
                  timestamp: Date.now(),
                });
              }
            });
          }
        });

        // Verificar status do cache
        checkCacheStatus();
      }).catch(error => {
        console.error('Erro ao verificar Service Worker:', error);
      });
    }
  }, []);

  // Monitorar ações offline
  useEffect(() => {
    const checkOfflineData = async () => {
      try {
        const actions = await getOfflineActions();
        const analytics = await getOfflineAnalytics();
        
        setState(prev => ({
          ...prev,
          offlineActions: Array.isArray(actions) ? actions.length : 0,
          analyticsQueue: Array.isArray(analytics) ? analytics.length : 0,
        }));
      } catch (error) {
        console.error('Erro ao verificar dados offline:', error);
      }
    };

    checkOfflineData();
    
    // Verificar periodicamente
    const interval = setInterval(checkOfflineData, 30000); // 30s
    
    return () => clearInterval(interval);
  }, []);

  // Funções de instalação
  const installApp = useCallback(async () => {
    if (!installPrompt) return false;

    try {
      await installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setState(prev => ({ 
          ...prev, 
          isInstalled: true, 
          isInstallable: false 
        }));
        
        trackEvent('pwa_install_accepted', {
          timestamp: Date.now(),
        });
        
        return true;
      } else {
        trackEvent('pwa_install_dismissed', {
          timestamp: Date.now(),
        });
      }
    } catch (error) {
      console.error('Erro ao instalar PWA:', error);
      trackEvent('pwa_install_error', {
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now(),
      });
    }
    
    return false;
  }, [installPrompt]);

  // Funções de cache
  const cacheCriticalData = useCallback(async () => {
    setState(prev => ({ ...prev, cacheStatus: 'caching' }));
    
    try {
      const criticalResources = [
        '/images/bg_main.png',
        '/logos/logo_circulo.png',
        '/images/bg_1.png',
        '/manifest.json',
        '/offline.html',
        '/favicon.ico',
        '/favicon-192x192.png',
        '/favicon-512x512.png'
      ];

      const cache = await caches.open('interbox-critical-v2');
      await cache.addAll(criticalResources);
      
      setState(prev => ({ ...prev, cacheStatus: 'cached' }));
      
      trackEvent('cache_critical_success', {
        resources: criticalResources.length,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error('Erro ao cachear dados críticos:', error);
      setState(prev => ({ ...prev, cacheStatus: 'error' }));
      
      trackEvent('cache_critical_error', {
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now(),
      });
    }
  }, []);

  const clearCache = useCallback(async () => {
    try {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      
      setState(prev => ({ ...prev, cacheStatus: 'idle' }));
      
      trackEvent('cache_cleared', {
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error('Erro ao limpar cache:', error);
    }
  }, []);

  // Funções de sincronização
  const syncInBackground = useCallback(async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready;
        // Background sync pode não estar disponível em todos os navegadores
        if ('sync' in registration) {
          await (registration as any).sync.register('background-sync');
        }
        
        trackEvent('background_sync_triggered', {
          timestamp: Date.now(),
        });
      } catch (error) {
        console.error('Erro ao registrar background sync:', error);
      }
    }
  }, []);

  const syncAnalytics = useCallback(async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready;
        // Background sync pode não estar disponível em todos os navegadores
        if ('sync' in registration) {
          await (registration as any).sync.register('analytics-sync');
        }
        
        trackEvent('analytics_sync_triggered', {
          timestamp: Date.now(),
        });
      } catch (error) {
        console.error('Erro ao registrar analytics sync:', error);
      }
    }
  }, []);

  // Funções de notificação
  const requestNotificationPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      console.warn('Este navegador não suporta notificações');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      
      trackEvent('notification_permission_requested', {
        permission,
        timestamp: Date.now(),
      });
      
      return permission === 'granted';
    } catch (error) {
      console.error('Erro ao solicitar permissão de notificação:', error);
      return false;
    }
  }, []);

  const sendNotification = useCallback(async (title: string, options?: any) => {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return false;
    }

    try {
      new Notification(title, {
        icon: '/favicon-192x192.png',
        badge: '/favicon-96x96.png',
        ...options,
      });

      trackEvent('notification_sent', {
        title,
        timestamp: Date.now(),
      });

      return true;
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
      return false;
    }
  }, []);

  // Funções de analytics
  const trackEvent = useCallback((eventName: string, data: any = {}) => {
    try {
      // Enviar para analytics se online
      if (navigator.onLine) {
        sendAnalyticsEvent({
          event: eventName,
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
          ...data,
        });
      } else {
        // Salvar offline se não estiver online
        saveOfflineAnalytics({
          event: eventName,
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
          ...data,
        });
      }
    } catch (error) {
      console.error('Erro ao rastrear evento:', error);
    }
  }, []);

  // Funções auxiliares
  const checkCacheStatus = useCallback(async () => {
    try {
      const cache = await caches.open('interbox-critical-v2');
      const keys = await cache.keys();
      setState(prev => ({ 
        ...prev, 
        cacheStatus: keys.length > 0 ? 'cached' : 'idle' 
      }));
    } catch (error) {
      console.error('Erro ao verificar status do cache:', error);
      setState(prev => ({ ...prev, cacheStatus: 'error' }));
    }
  }, []);

  return {
    ...state,
    installApp,
    cacheCriticalData,
    clearCache,
    syncInBackground,
    syncAnalytics,
    requestNotificationPermission,
    sendNotification,
    trackEvent,
  };
};

// Funções auxiliares para IndexedDB
async function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('InterboxOfflineDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      if (!db.objectStoreNames.contains('offlineActions')) {
        db.createObjectStore('offlineActions', { keyPath: 'id', autoIncrement: true });
      }
      
      if (!db.objectStoreNames.contains('offlineAnalytics')) {
        db.createObjectStore('offlineAnalytics', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

async function saveToIndexedDB(storeName: string, data: any) {
  const db = await openDB();
  const transaction = db.transaction([storeName], 'readwrite');
  const store = transaction.objectStore(storeName);
  return store.add(data);
}

async function getOfflineActions() {
  try {
    const db = await openDB();
    const transaction = db.transaction(['offlineActions'], 'readonly');
    const store = transaction.objectStore('offlineActions');
    const actions = await new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    return actions || [];
  } catch (error) {
    console.error('Erro ao buscar ações offline:', error);
    return [];
  }
}

async function getOfflineAnalytics() {
  try {
    const db = await openDB();
    const transaction = db.transaction(['offlineAnalytics'], 'readonly');
    const store = transaction.objectStore('offlineAnalytics');
    const analytics = await new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    return analytics || [];
  } catch (error) {
    console.error('Erro ao buscar analytics offline:', error);
    return [];
  }
}

async function saveOfflineAnalytics(data: any) {
  try {
    await saveToIndexedDB('offlineAnalytics', data);
  } catch (error) {
    console.error('Erro ao salvar analytics offline:', error);
  }
}

async function sendAnalyticsEvent(data: any) {
  try {
    const response = await fetch('/api/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
  } catch (error) {
    console.error('Erro ao enviar evento de analytics:', error);
    // Salvar offline se falhar
    await saveOfflineAnalytics(data);
  }
}
