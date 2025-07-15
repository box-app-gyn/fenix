import { useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, User as FirebaseUser, getRedirectResult } from 'firebase/auth';
import { auth, provider, db } from '../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

interface User extends FirebaseUser {
  role?: string;
  telefone?: string | null;
  whatsapp?: string | null;
  box?: string;
  categoria?: string;
  cidade?: string;
  mensagem?: string;
  isActive?: boolean;
  profileComplete?: boolean;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isSubscribed = true; // Flag para evitar race conditions
    
    try {
      console.log('🔄 Inicializando listener de autenticação...');
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (!isSubscribed) return; // Evitar atualizações se componente foi desmontado
        
        console.log('👤 Estado de autenticação alterado:', firebaseUser ? 'Usuário logado' : 'Usuário deslogado');
        if (firebaseUser) {
          try {
            console.log('📊 Carregando dados do usuário do Firestore...');
            const ref = doc(db, 'users', firebaseUser.uid);
            const snapshot = await getDoc(ref);

            if (!snapshot.exists()) {
              console.log('🆕 Criando novo usuário no Firestore...');
              await setDoc(ref, {
                uid: firebaseUser.uid,
                displayName: firebaseUser.displayName || '',
                email: firebaseUser.email || '',
                photoURL: firebaseUser.photoURL || '',
                telefone: null,
                whatsapp: null,
                box: '',
                categoria: 'publico', // Categoria padrão para ir para seleção
                cidade: '',
                mensagem: '',
                role: 'publico',
                isActive: true,
                profileComplete: false,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
              });
              
              // Buscar dados novamente após criar
              const newSnapshot = await getDoc(ref);
              const userData = newSnapshot.data();
              
              const extendedUser: User = {
                ...firebaseUser,
                role: userData?.role || 'publico',
                telefone: userData?.telefone || null,
                whatsapp: userData?.whatsapp || null,
                box: userData?.box || '',
                categoria: userData?.categoria || 'publico',
                cidade: userData?.cidade || '',
                mensagem: userData?.mensagem || '',
                isActive: userData?.isActive || true,
                profileComplete: userData?.profileComplete || false
              };

              if (isSubscribed) {
                console.log('✅ Novo usuário criado e carregado com sucesso');
                setUser(extendedUser);
              }
            } else {
              // Buscar dados completos do usuário existente
              const userData = snapshot.data();
              const extendedUser: User = {
                ...firebaseUser,
                role: userData?.role || 'publico',
                telefone: userData?.telefone || null,
                whatsapp: userData?.whatsapp || null,
                box: userData?.box || '',
                categoria: userData?.categoria || 'atleta',
                cidade: userData?.cidade || '',
                mensagem: userData?.mensagem || '',
                isActive: userData?.isActive || true,
                profileComplete: userData?.profileComplete || false
              };

              if (isSubscribed) {
                console.log('✅ Dados do usuário carregados com sucesso');
                setUser(extendedUser);
              }
            }
          } catch (error) {
            console.error('❌ Erro ao carregar dados do usuário:', error);
            // Em caso de erro, ainda definimos o usuário básico
            if (isSubscribed) {
              setUser({
                ...firebaseUser,
                role: 'publico',
                profileComplete: false
              });
            }
          }
        } else {
          if (isSubscribed) {
            console.log('ℹ️ Nenhum usuário autenticado');
            setUser(null);
          }
        }
        if (isSubscribed) {
          console.log('🏁 Finalizando carregamento de autenticação');
          setLoading(false);
        }
      });

      return () => {
        isSubscribed = false;
        unsubscribe();
      };
    } catch (error) {
      console.error('Erro ao inicializar autenticação:', error);
      if (isSubscribed) {
        setLoading(false);
        setUser(null);
      }
    }
  }, []);

  // Verificar resultado do redirecionamento ao carregar a página (para casos onde ainda pode ter redirect)
  useEffect(() => {
    const checkRedirectResult = async () => {
      try {
        console.log('Verificando resultado do redirecionamento...');
        
        // Aumentar timeout para 10 segundos para conexões mais lentas
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Timeout ao verificar redirecionamento')), 10000);
        });
        
        const resultPromise = getRedirectResult(auth);
        const result = await Promise.race([resultPromise, timeoutPromise]) as any;
        
        if (result && result.user) {
          console.log('✅ Login com redirecionamento bem-sucedido:', result.user.displayName);
          // O onAuthStateChanged já vai lidar com o usuário
        } else {
          console.log('ℹ️ Nenhum resultado de redirecionamento encontrado');
        }
      } catch (error: any) {
        console.error('❌ Erro ao verificar resultado do redirecionamento:', error);
        
        // Se for timeout, apenas logar e continuar
        if (error.message === 'Timeout ao verificar redirecionamento') {
          console.log('⏰ Timeout ao verificar redirecionamento - continuando normalmente');
          return;
        }
        
        // Tratamento específico para diferentes tipos de erro
        if (error.code === 'auth/account-exists-with-different-credential') {
          console.warn('⚠️ Conta já existe com credencial diferente');
        } else if (error.code === 'auth/invalid-credential') {
          console.warn('⚠️ Credenciais inválidas');
        } else if (error.code === 'auth/operation-not-allowed') {
          console.warn('⚠️ Login com Google não está habilitado');
        } else if (error.code === 'auth/user-disabled') {
          console.warn('⚠️ Usuário desabilitado');
        } else if (error.code === 'auth/user-not-found') {
          console.warn('⚠️ Usuário não encontrado');
        } else if (error.code === 'auth/weak-password') {
          console.warn('⚠️ Senha muito fraca');
        } else {
          console.error('Erro desconhecido no login:', error);
        }
      }
    };

    // Adicionar pequeno delay para evitar conflitos
    const timer = setTimeout(checkRedirectResult, 100);
    return () => clearTimeout(timer);
  }, []);

  const login = async () => {
    try {
      console.log('🔄 Iniciando login com popup...');
      
      // Tentar popup primeiro (melhor para PWA)
      try {
        const result = await signInWithPopup(auth, provider);
        console.log('✅ Login com popup bem-sucedido:', result.user.displayName);
        return;
      } catch (popupError: any) {
        console.log('⚠️ Popup bloqueado, tentando redirect...', popupError.code);
        
        // Se popup falhar (geralmente bloqueado), tentar redirect
        if (popupError.code === 'auth/popup-blocked' || 
            popupError.code === 'auth/popup-closed-by-user' ||
            popupError.code === 'auth/cancelled-popup-request') {
          
          console.log('🔄 Tentando login com redirect...');
          // Importar signInWithRedirect dinamicamente
          const { signInWithRedirect } = await import('firebase/auth');
          await signInWithRedirect(auth, provider);
          console.log('✅ Redirecionamento iniciado com sucesso');
          return;
        }
        
        // Se for outro erro, relançar
        throw popupError;
      }
    } catch (error: any) {
      console.error('❌ Erro ao iniciar login:', error);
      
      // Não usar alert() - deixar o componente tratar o erro
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('🔄 Tentando fazer logout...');
      await signOut(auth);
      console.log('✅ Logout realizado com sucesso');
    } catch (error) {
      console.error('❌ Erro no logout:', error);
      throw error;
    }
  };

  return { user, loading, login, logout };
} 