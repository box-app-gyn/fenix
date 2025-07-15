import { useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, provider, db } from '../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

interface User {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          try {
            const ref = doc(db, 'users', firebaseUser.uid);
            const snapshot = await getDoc(ref);

            if (!snapshot.exists()) {
              await setDoc(ref, {
                uid: firebaseUser.uid,
                displayName: firebaseUser.displayName || '',
                email: firebaseUser.email || '',
                photoURL: firebaseUser.photoURL || '',
                telefone: null,
                whatsapp: null,
                box: '',
                categoria: 'atleta',
                cidade: '',
                mensagem: '',
                role: 'publico',
                isActive: true,
                profileComplete: false,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
              });
            }

            setUser({
              uid: firebaseUser.uid,
              displayName: firebaseUser.displayName,
              email: firebaseUser.email,
              photoURL: firebaseUser.photoURL
            });
          } catch (error) {
            console.error('Erro ao carregar dados do usuário:', error);
            // Em caso de erro, ainda definimos o usuário básico
            setUser({
              uid: firebaseUser.uid,
              displayName: firebaseUser.displayName,
              email: firebaseUser.email,
              photoURL: firebaseUser.photoURL
            });
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Erro ao inicializar autenticação:', error);
      setLoading(false);
      setUser(null);
    }
  }, []);

  const login = async () => {
    try {
      console.log('Tentando fazer login...');
      
      // Verificar se o popup está sendo bloqueado
      const popupBlocked = await new Promise<boolean>((resolve) => {
        const testPopup = window.open('', '_blank', 'width=1,height=1');
        if (testPopup) {
          testPopup.close();
          resolve(false); // Popup não está bloqueado
        } else {
          resolve(true); // Popup está bloqueado
        }
      });

      if (popupBlocked) {
        alert('Pop-ups estão bloqueados pelo navegador. Por favor, permita pop-ups para este site e tente novamente.');
        return;
      }

      await signInWithPopup(auth, provider);
      console.log('Login realizado com sucesso');
    } catch (error: any) {
      // Tratamento específico para diferentes tipos de erro
      if (error.code === 'auth/popup-closed-by-user') {
        // Popup fechado pelo usuário - não é um erro real
        console.log('Login cancelado pelo usuário');
        return; // Não lança erro para popup fechado
      } else if (error.code === 'auth/popup-blocked') {
        console.error('Popup bloqueado pelo navegador.');
        alert('Popup bloqueado pelo navegador. Por favor, permita pop-ups para este site e tente novamente.');
      } else if (error.code === 'auth/invalid-api-key') {
        console.error('API Key do Firebase inválida. Verifique as configurações.');
        alert('Erro de configuração. Entre em contato com o suporte.');
      } else if (error.code === 'auth/cancelled-popup-request') {
        console.log('Requisição de popup cancelada');
        return; // Não é um erro real
      } else {
        // Outros erros
        console.error('Erro no login:', error);
        alert('Erro ao fazer login. Tente novamente.');
      }
    }
  };

  const logout = async () => {
    try {
      console.log('Tentando fazer logout...');
      await signOut(auth);
      console.log('Logout realizado com sucesso');
    } catch (error) {
      console.error('Erro no logout:', error);
      throw error;
    }
  };

  return { user, loading, login, logout };
} 