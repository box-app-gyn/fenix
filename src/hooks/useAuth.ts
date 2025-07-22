import { useEffect, useState, useCallback } from 'react';
import {
  onAuthStateChanged,
  signInWithRedirect,
  signOut,
  User as FirebaseUser,
  getRedirectResult
} from 'firebase/auth';
import {
  auth,
  provider,
  db
} from '../lib/firebase';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  updateDoc,
  increment,
  collection,
  getDocs,
  query,
  where,
  arrayUnion
} from 'firebase/firestore';

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
  adminVerification?: {
    required?: boolean;
    cnh?: {
      frente: string;
      verso: string;
      uploadedAt: any;
      status: 'pending' | 'approved' | 'rejected';
    };
    completedAt?: any;
  };
}

// Cache global para evitar re-fetching
let referralRewardCache: number | null = null;
const userDataCache = new Map<string, any>();

// Função otimizada para buscar reward
async function fetchReferralReward(): Promise<number> {
  if (referralRewardCache !== null) return referralRewardCache;

  try {
    const ref = collection(db, 'gamification_rewards');
    const snapshot = await getDocs(query(ref, where('type', '==', 'acesso_vip')));
    const match = snapshot.docs.find(doc => doc.data().title.toLowerCase().includes('referral'));
    const value = match?.data()?.metadata?.discount?.percentage || 50;
    referralRewardCache = value;
    return value;
  } catch (e) {
    console.warn('⚠️ Fallback para recompensa de referral');
    referralRewardCache = 50;
    return 50;
  }
}

// Função assíncrona separada para setup de usuário
async function handleUserSetup(firebaseUser: FirebaseUser): Promise<void> {
  const userRef = doc(db, 'users', firebaseUser.uid);
  
  // Verifica cache primeiro
  const cached = userDataCache.get(firebaseUser.uid);
  if (cached) return;

  try {
    const snapshot = await getDoc(userRef);
    
    if (!snapshot.exists()) {
      // Busca dados de referral de forma assíncrona (não bloqueia)
      Promise.resolve().then(async () => {
        let referredByUid = null;
        const referralCode = localStorage.getItem('referralCode');

        if (referralCode) {
          const refQuery = await getDocs(
            query(collection(db, 'users'), where('gamification.referralCode', '==', referralCode))
          );
          if (!refQuery.empty) referredByUid = refQuery.docs[0].id;
        }

        const referralReward = await fetchReferralReward();

        // Cria usuário com dados mínimos
        await setDoc(userRef, {
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName || '',
          email: firebaseUser.email || '',
          photoURL: firebaseUser.photoURL || '',
          telefone: null,
          whatsapp: null,
          box: '',
          categoria: 'publico',
          cidade: '',
          mensagem: '',
          role: 'publico',
          isActive: true,
          profileComplete: false,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          gamification: {
            tokens: {
              box: {
                balance: referredByUid ? referralReward : 0,
                totalEarned: referredByUid ? referralReward : 0,
                totalSpent: 0,
                lastTransaction: serverTimestamp(),
              },
            },
            level: 'iniciante',
            totalActions: 0,
            lastActionAt: serverTimestamp(),
            achievements: [],
            rewards: [],
            streakDays: 0,
            lastLoginStreak: serverTimestamp(),
            referralCode: `REF${firebaseUser.uid.slice(-6).toUpperCase()}`,
            referrals: [],
            referralTokens: 0,
            weeklyTokens: 0,
            monthlyTokens: 0,
            yearlyTokens: 0,
            bestStreak: 0,
            badges: [],
            challenges: [],
            ...(referredByUid ? { referredBy: referredByUid } : {}),
          },
        });

        // Processa referral em background
        if (referredByUid) {
          await updateDoc(doc(db, 'users', referredByUid), {
            'gamification.referrals': arrayUnion(firebaseUser.uid),
            'gamification.referralTokens': increment(referralReward),
            'gamification.tokens.box.balance': increment(referralReward),
            'gamification.tokens.box.totalEarned': increment(referralReward),
            'gamification.totalActions': increment(1),
            'gamification.lastActionAt': serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
          localStorage.removeItem('referralCode');
        }
      }).catch(console.error);
    }

    // Cache resultado
    userDataCache.set(firebaseUser.uid, true);
  } catch (error) {
    console.error('❌ Erro no setup do usuário:', error);
  }
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (isInitialized) return;

    let isSubscribed = true;
    setIsInitialized(true);

    // Timeout de segurança reduzido para 3s
    const timeoutId = setTimeout(() => {
      if (isSubscribed && loading) {
        console.warn('⚠️ Auth timeout - finalizando loading');
        setLoading(false);
      }
    }, 3000);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!isSubscribed) return;

      if (firebaseUser) {
        try {
          // 1. Seta user IMEDIATAMENTE com dados básicos
          const basicUser: User = {
            ...firebaseUser,
            role: 'publico',
            profileComplete: false,
            isActive: true
          };
          setUser(basicUser);
          setLoading(false);
          clearTimeout(timeoutId);

          // 2. Busca dados detalhados de forma assíncrona
          const userRef = doc(db, 'users', firebaseUser.uid);
          const snapshot = await getDoc(userRef);
          
          if (snapshot.exists()) {
            const userData = snapshot.data();
            const extendedUser: User = {
              ...firebaseUser,
              role: userData?.role || 'publico',
              telefone: userData?.telefone || null,
              whatsapp: userData?.whatsapp || null,
              box: userData?.box || '',
              categoria: userData?.categoria || 'publico',
              cidade: userData?.cidade || '',
              mensagem: userData?.mensagem || '',
              isActive: userData?.isActive ?? true,
              profileComplete: userData?.profileComplete || false,
              adminVerification: userData?.adminVerification,
            };
            setUser(extendedUser);
          } else {
            // 3. Setup de usuário em background (não bloqueia UI)
            handleUserSetup(firebaseUser);
          }
          
        } catch (error) {
          console.error('❌ Erro ao carregar usuário:', error);
          // Fallback para dados básicos
          setUser({
            ...firebaseUser,
            role: 'publico',
            profileComplete: false,
            isActive: true
          });
          setLoading(false);
          clearTimeout(timeoutId);
        }
      } else {
        setUser(null);
        setLoading(false);
        clearTimeout(timeoutId);
      }
    });

    return () => {
      isSubscribed = false;
      clearTimeout(timeoutId);
      unsubscribe();
    };
  }, [isInitialized]);

  // Redirect result check otimizado
  useEffect(() => {
    if (user || loading) return;

    const checkRedirectResult = async () => {
      try {
        const result = await Promise.race([
          getRedirectResult(auth),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 2000)
          )
        ]) as any;

        if (result?.user) {
          console.log('✅ Login redirect OK:', result.user.displayName);
        }
      } catch (error: any) {
        // Silent fail - não é crítico
        if (error.message !== 'Timeout') {
          console.warn('Redirect check falhou:', error.message);
        }
      }
    };

    const timer = setTimeout(checkRedirectResult, 100);
    return () => clearTimeout(timer);
  }, [user, loading]);

  const login = useCallback(async () => {
    try {
      console.log('🔄 Iniciando login...');
      await signInWithRedirect(auth, provider);
    } catch (error: any) {
      console.error('❌ Erro no login:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      setUser(null);
      // Limpa cache
      userDataCache.clear();
      referralRewardCache = null;
      console.log('✅ Logout OK');
    } catch (error) {
      console.error('❌ Erro no logout:', error);
      throw error;
    }
  }, []);

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    forceLogout: logout,
    debugAuthState: () => console.log('🧠 Auth State:', { user: !!user, loading }),
  };
}