import { useEffect, useState } from 'react';

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

let referralRewardCache: number | null = null;

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
    console.warn('⚠️ Falha ao buscar recompensa de referral. Usando fallback padrão.');
    return 50;
  }
}

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

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (isInitialized) return;

    let isSubscribed = true;
    setIsInitialized(true);

    const timeoutId = setTimeout(() => {
      if (isSubscribed && loading) {
        console.warn('⚠️ Timeout de segurança - finalizando loading');
        setLoading(false);
      }
    }, 10000);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!isSubscribed) return;

      if (firebaseUser) {
        try {
          const ref = doc(db, 'users', firebaseUser.uid);
          const snapshot = await getDoc(ref);

          if (!snapshot.exists()) {
            let referredByUid = null;
            const referralCode = localStorage.getItem('referralCode');

            if (referralCode) {
              const refQuery = await getDocs(
                query(collection(db, 'users'), where('gamification.referralCode', '==', referralCode))
              );
              if (!refQuery.empty) referredByUid = refQuery.docs[0].id;
            }

            const referralReward = await fetchReferralReward();

            await setDoc(ref, {
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
          }

          const userData = (await getDoc(ref)).data();
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
        } catch (error) {
          console.error('❌ Erro ao carregar dados do usuário:', error);
          setUser({ ...firebaseUser, role: 'publico', profileComplete: false });
        }
      } else {
        setUser(null);
      }

      setLoading(false);
      clearTimeout(timeoutId);
    });

    return () => {
      isSubscribed = false;
      clearTimeout(timeoutId);
      unsubscribe();
    };
  }, [isInitialized]);

  useEffect(() => {
    if (user || loading) return;

    const checkRedirectResult = async () => {
      try {
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Timeout ao verificar redirecionamento')), 5000);
        });

        const resultPromise = getRedirectResult(auth);
        const result = await Promise.race([resultPromise, timeoutPromise]) as any;

        if (result && result.user) {
          console.log('✅ Login com redirecionamento bem-sucedido:', result.user.displayName);
        } else {
          console.log('ℹ️ Nenhum resultado de redirecionamento encontrado');
        }
      } catch (error: any) {
        console.warn('Erro ao verificar redirecionamento:', error.message);
      }
    };

    const timer = setTimeout(checkRedirectResult, 200);
    return () => clearTimeout(timer);
  }, [user, loading]);

  const login = async () => {
    try {
      console.log('🔄 Iniciando login com redirecionamento...');
      await signInWithRedirect(auth, provider);
      console.log('✅ Redirecionamento iniciado com sucesso');
    } catch (error: any) {
      console.error('❌ Erro ao iniciar login:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      console.log('✅ Logout realizado');
    } catch (error) {
      console.error('❌ Erro no logout:', error);
      throw error;
    }
  };

  return {
    user,
    loading,
    login,
    logout,
    forceLogout: logout,
    debugAuthState: () => console.log('🧠 Auth State:', user),
  };
}
