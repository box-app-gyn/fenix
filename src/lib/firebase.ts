import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';
import { configurePrivacySettings, initializeAnalytics } from '../utils/analyticsUtils';
import { getFirebaseConfig, isDevelopment } from './env';

const firebaseConfig = getFirebaseConfig();

// Initialize Firebase
let app: any;
try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  if (isDevelopment) {
    console.log('✅ Firebase inicializado com sucesso');
  }
} catch (error) {
  console.error('❌ Erro ao inicializar Firebase:', error);
  throw error;
}

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const provider = new GoogleAuthProvider();

// Configurar provider para melhor compatibilidade com PWA
provider.setCustomParameters({
  prompt: 'select_account',
  // Configurações otimizadas para redirect
  ux_mode: 'redirect',
  // Adicionar escopo para melhor experiência
  scope: 'email profile',
});

// Configurar domínios autorizados para Firebase Auth
provider.addScope('email');
provider.addScope('profile');

// Configurar auth para melhor compatibilidade com PWA
auth.useDeviceLanguage();
auth.settings.appVerificationDisabledForTesting = false;

// Analytics será inicializado manualmente após consentimento
export let analytics: Analytics | null = null;

// Função para inicializar analytics manualmente
export const initializeAnalyticsManually = async (): Promise<Analytics | null> => {
  try {
    const isAnalyticsSupported = await isSupported();
    if (isAnalyticsSupported) {
      analytics = getAnalytics(app);

      // Verificar se pode inicializar analytics
      const canInitialize = configurePrivacySettings();

      if (canInitialize) {
        // Inicializar analytics com configurações corretas
        const success = initializeAnalytics(import.meta.env.VITE_FIREBASE_MEASUREMENT_ID);

        if (success) {
          if (isDevelopment) {
            console.log('✅ Google Analytics inicializado manualmente com sucesso');
          }
        } else {
          if (isDevelopment) {
            console.log('⚠️ Erro ao configurar Google Analytics');
          }
        }
      } else {
        if (isDevelopment) {
          console.log('ℹ️ Analytics aguardando consentimento de cookies');
        }
      }

      return analytics;
    } else {
      if (isDevelopment) {
        console.log('ℹ️ Google Analytics não suportado neste ambiente');
      }
      return null;
    }
} catch (error) {
  if (isDevelopment) {
    console.warn('⚠️ Erro ao inicializar Google Analytics manualmente:', error);
  }
  return null;
}
};

// Função de diagnóstico do Firebase Auth
export const diagnoseFirebaseAuth = async () => {
  if (!isDevelopment) return;

  console.log('🔍 === DIAGNÓSTICO FIREBASE AUTH ===');
  
  try {
    // Verificar configuração
    console.log('📋 Configuração Firebase:', {
      projectId: firebaseConfig.projectId,
      authDomain: firebaseConfig.authDomain,
      apiKey: firebaseConfig.apiKey ? '✅ Configurado' : '❌ Não configurado',
    });

    // Verificar domínio atual
    const currentDomain = window.location.hostname;
    const currentPort = window.location.port;
    const currentProtocol = window.location.protocol;
    
    console.log('🌐 Domínio atual:', {
      hostname: currentDomain,
      port: currentPort,
      protocol: currentProtocol,
      fullUrl: window.location.href,
    });

    // Verificar se está em localhost
    const isLocalhost = currentDomain === 'localhost' || currentDomain === '127.0.0.1';
    console.log('🏠 É localhost?', isLocalhost);

    // Verificar Service Worker
    const hasServiceWorker = 'serviceWorker' in navigator;
    const swRegistration = hasServiceWorker ? await navigator.serviceWorker.getRegistration() : null;
    console.log('🔒 Service Worker:', {
      suportado: hasServiceWorker,
      registrado: !!swRegistration,
      ativo: !!navigator.serviceWorker.controller,
    });

    // Verificar estado do auth
    const currentUser = auth.currentUser;
    console.log('👤 Usuário atual:', {
      logado: !!currentUser,
      email: currentUser?.email,
      uid: currentUser?.uid,
    });

    // Verificar se é PWA
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    console.log('📱 PWA:', {
      standalone: isStandalone,
      userAgent: navigator.userAgent.substring(0, 100) + '...',
    });

    // Testar provider
    console.log('🔑 Provider configurado:', {
      providerId: provider.providerId,
      isCustomParametersSet: true,
    });

    console.log('✅ Diagnóstico concluído');
    
    // Sugestões baseadas no diagnóstico
    if (isLocalhost && currentPort && currentPort !== '443') {
      console.log('💡 SUGESTÃO: Para localhost, certifique-se de que o domínio está autorizado no Firebase Console');
      console.log('   Vá em: Firebase Console > Authentication > Settings > Authorized domains');
      console.log('   Adicione: localhost, 127.0.0.1');
    }

    if (hasServiceWorker && swRegistration) {
      console.log('💡 SUGESTÃO: Service Worker ativo - login deve usar redirect, não popup');
    }

    if (isStandalone) {
      console.log('💡 SUGESTÃO: App em modo PWA - verificar configurações de OAuth');
    }

  } catch (error) {
    console.error('❌ Erro no diagnóstico:', error);
  }
};

// Expor Firebase globalmente para debug e testes via console
if (typeof window !== 'undefined') {
  // @ts-ignore - Exposição global para debug
  window.firebase = {
    auth: () => auth,
    app: () => app,
    db: () => db,
    storage: () => storage,
    provider: () => provider,
    diagnose: diagnoseFirebaseAuth,
  };
  
  // Expor funções de login para console
  // @ts-ignore - Exposição global para debug
  window.loginWithGoogle = () => {
    import('firebase/auth').then(({ signInWithRedirect }) => {
      console.log('🔄 Iniciando login com redirect...');
      signInWithRedirect(auth, provider)
        .then(() => {
          console.log('✅ Redirecionamento iniciado com sucesso');
        })
        .catch((error) => {
          console.error('❌ Erro no login manual:', error);
          console.log('🔍 Código de erro:', error.code);
          console.log('📝 Mensagem:', error.message);
        });
    });
  };
  
  // @ts-ignore - Exposição global para debug
  window.loginWithPopup = () => {
    import('firebase/auth').then(({ signInWithPopup }) => {
      console.log('🔄 Iniciando login com popup...');
      signInWithPopup(auth, provider)
        .then((result) => {
          console.log('✅ Login manual via popup realizado:', result.user.email);
        })
        .catch((error) => {
          console.error('❌ Erro no login popup:', error);
          console.log('🔍 Código de erro:', error.code);
          console.log('📝 Mensagem:', error.message);
        });
    });
  };
  
  // @ts-ignore - Exposição global para debug
  window.logout = () => {
    import('firebase/auth').then(({ signOut }) => {
      signOut(auth)
        .then(() => {
          console.log('✅ Logout manual via console realizado');
        })
        .catch((error) => {
          console.error('❌ Erro no logout manual:', error);
        });
    });
  };
  
  // @ts-ignore - Exposição global para debug
  window.checkAuthState = () => {
    console.log('👤 Estado atual do auth:', {
      currentUser: auth.currentUser,
      isLoggedIn: !!auth.currentUser,
      email: auth.currentUser?.email,
      uid: auth.currentUser?.uid,
    });
  };
  
  // Logs apenas em desenvolvimento
  if (isDevelopment) {
    console.log('🔧 Firebase exposto globalmente para debug');
    console.log('📝 Comandos disponíveis:');
    console.log('  - window.loginWithGoogle() - Login com redirect');
    console.log('  - window.loginWithPopup() - Login com popup');
    console.log('  - window.logout() - Logout');
    console.log('  - window.checkAuthState() - Verificar estado do auth');
    console.log('  - window.firebase.diagnose() - Diagnóstico completo');
    console.log('  - window.firebase.auth() - Instância do auth');
    console.log('  - window.firebase.db() - Instância do Firestore');
    
    // Executar diagnóstico automaticamente
    setTimeout(() => {
      diagnoseFirebaseAuth();
    }, 2000);
  }
}

export default app;
