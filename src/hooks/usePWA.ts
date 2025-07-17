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
  });

  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);

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
              }
            });
          }
        });

        // Verificar status do cache
        checkCacheStatus();
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
      }
    } catch (error) {
      console.error('Erro ao instalar PWA:', error);
    }
    
    return false;
  }, [installPrompt]);

  // Funções de cache
  const cacheCriticalData = useCallback(async () => {
    setState(prev => ({ ...prev, cacheStatus: 'caching' }));
    
    try {
      const criticalResources = [
        '/images/bg_main.png',
        '/images/logo-1.png',
        '/images/bg_1.png',
        '/manifest.json',
        '/offline.html'
      ];

      const cache = await caches.open('interbox-critical-v1');
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
      console.log('Este navegador não suporta notificações');
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

  const sendTestNotification = useCallback(async () => {
    if (Notification.permission === 'granted') {
      new Notification('Interbox 2025', {
        body: 'Teste de notificação push! 🚀',
        icon: '/images/logo-1.png',
        badge: '/images/badge.png',
        data: {
          type: 'test',
          timestamp: Date.now(),
        },
      });

      trackEvent('test_notification_sent', {
        timestamp: Date.now(),
      });
    }
  }, []);

  // Funções de analytics offline
  const trackEvent = useCallback(async (event: string, data: any) => {
    const eventData = {
      event,
      data,
      timestamp: Date.now(),
      sessionId: getSessionId(),
      userId: getUserId(),
    };

    try {
      // Tentar enviar imediatamente se online
      if (navigator.onLine) {
        await sendAnalyticsEvent(eventData);
      } else {
        // Salvar offline
        await saveOfflineAnalytics(eventData);
        setState(prev => ({ 
          ...prev, 
          analyticsQueue: prev.analyticsQueue + 1 
        }));
      }
    } catch (error) {
      console.error('Erro ao trackear evento:', error);
      // Salvar offline como fallback
      await saveOfflineAnalytics(eventData);
    }
  }, []);

  // Funções de dados offline
  const saveOfflineAction = useCallback(async (action: string, data: any) => {
    try {
      const actionData = {
        type: action,
        data,
        timestamp: Date.now(),
        sessionId: getSessionId(),
        userId: getUserId(),
      };

      await saveToIndexedDB('offlineActions', actionData);
      setState(prev => ({ 
        ...prev, 
        offlineActions: prev.offlineActions + 1 
      }));
    } catch (error) {
      console.error('Erro ao salvar ação offline:', error);
    }
  }, []);

  // Funções auxiliares
  const checkCacheStatus = useCallback(async () => {
    try {
      const cache = await caches.open('interbox-critical-v1');
      const keys = await cache.keys();
      setState(prev => ({ 
        ...prev, 
        cacheStatus: keys.length > 0 ? 'cached' : 'idle' 
      }));
    } catch (error) {
      setState(prev => ({ ...prev, cacheStatus: 'error' }));
    }
  }, []);

  const getSessionId = () => {
    let sessionId = localStorage.getItem('interbox_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('interbox_session_id', sessionId);
    }
    return sessionId;
  };

  const getUserId = () => {
    // Implementar lógica para obter ID do usuário logado
    return localStorage.getItem('interbox_user_id') || 'anonymous';
  };

  return {
    ...state,
    installApp,
    cacheCriticalData,
    clearCache,
    syncInBackground,
    syncAnalytics,
    requestNotificationPermission,
    sendTestNotification,
    trackEvent,
    saveOfflineAction,
  };
};

// Funções auxiliares para IndexedDB
async function openDB() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open('InterboxOfflineDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      if (!db.objectStoreNames.contains('offlineActions')) {
        const actionStore = db.createObjectStore('offlineActions', { keyPath: 'id', autoIncrement: true });
        actionStore.createIndex('timestamp', 'timestamp', { unique: false });
      }
      
      if (!db.objectStoreNames.contains('analytics')) {
        const analyticsStore = db.createObjectStore('analytics', { keyPath: 'id', autoIncrement: true });
        analyticsStore.createIndex('timestamp', 'timestamp', { unique: false });
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
  const db = await openDB();
  const transaction = db.transaction(['offlineActions'], 'readonly');
  const store = transaction.objectStore('offlineActions');
  return store.getAll();
}

async function getOfflineAnalytics() {
  const db = await openDB();
  const transaction = db.transaction(['analytics'], 'readonly');
  const store = transaction.objectStore('analytics');
  return store.getAll();
}

async function saveOfflineAnalytics(data: any) {
  return saveToIndexedDB('analytics', data);
}

async function sendAnalyticsEvent(data: any) {
  // Implementar envio para seu sistema de analytics
  console.log('📊 Analytics event:', data);
  
  // Exemplo com Firebase Analytics
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', data.event, data.data);
  }
}

// Função para envio em lote de analytics (não utilizada no momento)
// async function sendAnalyticsBatch(analytics: any[]) {
//   // Implementar envio em lote
//   console.log('📊 Sending analytics batch:', analytics.length);
//   
//   for (const event of analytics) {
//     await sendAnalyticsEvent(event);
//   }
// }
