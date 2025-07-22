import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// --- Função para aguardar estilos carregarem ---
const waitForStylesheets = (): Promise<void> => {
  return new Promise((resolve) => {
    let attempts = 0
    const maxAttempts = 200

    const check = () => {
      attempts++
      const allLoaded = Array.from(document.styleSheets).every((sheet) => {
        try {
          return sheet.cssRules.length > 0 || sheet.href === null
        } catch {
          return false
        }
      })
      allLoaded || attempts >= maxAttempts ? resolve() : setTimeout(check, 50)
    }

    document.readyState === 'loading'
      ? document.addEventListener('DOMContentLoaded', check)
      : check()
  })
}

// --- Remover loading visual ---
const removeLoadingFallback = () => {
  const el = document.getElementById('loading-fallback')
  if (el) {
    el.style.opacity = '0'
    setTimeout(() => (el.style.display = 'none'), 300)
  }
}

// --- Registrar Service Worker com fallbacks ---
const registerServiceWorker = async () => {
  if (!('serviceWorker' in navigator)) {
    console.warn('❌ Service Worker não suportado');
    return;
  }

  try {
    // Verificar se já existe um SW registrado
    const existingRegistration = await navigator.serviceWorker.getRegistration();
    
    if (existingRegistration) {
      console.log('🔒 Service Worker já registrado:', existingRegistration);
      
      // Verificar se há atualização
      existingRegistration.addEventListener('updatefound', () => {
        const newWorker = existingRegistration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('🔄 Nova versão disponível!');
              // Aqui você pode mostrar um prompt para atualizar
              if (confirm('Nova versão disponível! Deseja atualizar agora?')) {
                newWorker.postMessage({ type: 'SKIP_WAITING' });
                window.location.reload();
              }
            }
          });
        }
      });
      
      return existingRegistration;
    }

    // Registrar novo SW
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none',
    });

    console.log('🔒 Service Worker registrado com sucesso:', registration);

    // Configurar listeners para atualizações
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('🔄 Nova versão disponível!');
            // Mostrar prompt de atualização
            if (confirm('Nova versão disponível! Deseja atualizar agora?')) {
              newWorker.postMessage({ type: 'SKIP_WAITING' });
              window.location.reload();
            }
          }
        });
      }
    });

    // Listener para quando o SW assume controle
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('🎯 Service Worker assumiu controle');
    });

    // Verificar atualizações periodicamente
    setInterval(() => {
      registration.update().catch(console.warn);
    }, 60000); // A cada minuto

    return registration;
  } catch (error) {
    console.error('❌ Erro ao registrar Service Worker:', error);
    return null;
  }
};

// --- Verificar conectividade ---
const checkConnectivity = () => {
  const updateOnlineStatus = () => {
    if (navigator.onLine) {
      console.log('✅ Conectado à internet');
      document.documentElement.classList.remove('offline');
      document.documentElement.classList.add('online');
    } else {
      console.log('❌ Sem conexão com a internet');
      document.documentElement.classList.remove('online');
      document.documentElement.classList.add('offline');
    }
  };

  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  updateOnlineStatus();
};

// --- Configurar PWA ---
const setupPWA = () => {
  // Verificar se está em modo standalone (PWA instalado)
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  
  if (isStandalone) {
    console.log('📱 App rodando em modo standalone (PWA)');
    document.documentElement.classList.add('pwa-standalone');
  }

  // Configurar viewport para PWA
  const viewport = document.querySelector('meta[name="viewport"]');
  if (viewport) {
    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, viewport-fit=cover');
  }

  // Adicionar classe para safe area (iPhone X+)
  document.documentElement.classList.add('safe-area');
};

// --- Inicializar aplicação ---
const boot = async () => {
  console.log('🚀 Iniciando CERRADO INTERBØX 2025...');
  
  try {
    // Aguardar estilos carregarem
    await Promise.race([waitForStylesheets(), new Promise(res => setTimeout(res, 5000))]);
    
    // Remover loading visual
    removeLoadingFallback();

    // Configurar PWA
    setupPWA();

    // Verificar conectividade
    checkConnectivity();

    // Registrar Service Worker
    await registerServiceWorker();

    // Renderização protegida
    const root = document.getElementById('root');
    if (root) {
      ReactDOM.createRoot(root).render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      );
      console.log('✅ App montado com sucesso');
    } else {
      console.error('🚨 #root não encontrado no HTML');
      throw new Error('Elemento root não encontrado');
    }
  } catch (error) {
    console.error('❌ Erro durante inicialização:', error);
    
    // Fallback: tentar renderizar mesmo com erro
    const root = document.getElementById('root');
    if (root) {
      ReactDOM.createRoot(root).render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      );
    }
  }
};

// --- Inicializar quando DOM estiver pronto ---
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
