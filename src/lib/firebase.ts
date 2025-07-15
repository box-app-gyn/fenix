import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDdLZo5ZO32WOpxNgqqSQw381cekJPfVBg",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "interbox-app-8d400.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "interbox-app-8d400",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "interbox-app-8d400.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1087720410628",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1087720410628:web:xxxxxxx",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-XXXXXXXXXX"
};

// Initialize Firebase
let app;
try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  console.log('Firebase inicializado com sucesso');
} catch (error) {
  console.error('Erro ao inicializar Firebase:', error);
  throw error;
}

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const provider = new GoogleAuthProvider();

// Configurar provider para desenvolvimento local
provider.setCustomParameters({
  prompt: 'select_account'
});

export default app; 