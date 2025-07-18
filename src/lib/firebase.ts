import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';
import { configurePrivacySettings, initializeAnalytics } from '../utils/analyticsUtils';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
let app;
try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  console.log('✅ Firebase inicializado com sucesso');
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
          console.log('✅ Google Analytics inicializado manualmente com sucesso');
        } else {
          console.log('⚠️ Erro ao configurar Google Analytics');
        }
      } else {
        console.log('ℹ️ Analytics aguardando consentimento de cookies');
      }

      return analytics;
    } else {
      console.log('ℹ️ Google Analytics não suportado neste ambiente');
      return null;
    }
  } catch (error) {
    console.warn('⚠️ Erro ao inicializar Google Analytics manualmente:', error);
    return null;
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
  };
  
  // Expor funções de login para console
  // @ts-ignore - Exposição global para debug
  window.loginWithGoogle = () => {
    import('firebase/auth').then(({ signInWithPopup }) => {
      signInWithPopup(auth, provider)
        .then((result) => {
          console.log('✅ Login manual via console realizado:', result.user.email);
        })
        .catch((error) => {
          console.error('❌ Erro no login manual:', error);
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
  
  // Logs apenas em desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    console.log('🔧 Firebase exposto globalmente para debug');
    console.log('📝 Comandos disponíveis:');
    console.log('  - window.loginWithGoogle() - Login com Google');
    console.log('  - window.logout() - Logout');
    console.log('  - window.firebase.auth() - Instância do auth');
    console.log('  - window.firebase.db() - Instância do Firestore');
  }
}

export default app;
