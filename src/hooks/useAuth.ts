import { useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithRedirect, signOut, User as FirebaseUser, getRedirectResult } from 'firebase/auth';
import { auth, provider, db } from '../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp, updateDoc, increment, addDoc, collection, getDocs, query, where, arrayUnion } from 'firebase/firestore';
import { GAMIFICATION_TOKENS } from '../types/firestore';

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

  // Função para verificar e processar login diário
  const processDailyLogin = async (userId: string, userData: any) => {
    try {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // Data atual sem hora

      // Verificar se já recebeu login diário hoje
      const lastLoginStreak = userData?.gamification?.lastLoginStreak;
      let lastLoginDate: Date | null = null;

      if (lastLoginStreak) {
        // Converter Timestamp do Firestore para Date
        if (lastLoginStreak.toDate) {
          lastLoginDate = lastLoginStreak.toDate();
        } else if (lastLoginStreak.seconds) {
          lastLoginDate = new Date(lastLoginStreak.seconds * 1000);
        }
      }

      // Se não tem data de último login ou se é um novo dia
      if (!lastLoginDate || lastLoginDate < today) {
        const tokensToAward = GAMIFICATION_TOKENS.login_diario; // 5 $BOX
        const currentStreak = userData?.gamification?.streakDays || 0;
        const newStreak = lastLoginDate
          && lastLoginDate.getTime() >= today.getTime() - 24 * 60 * 60 * 1000
          ? currentStreak + 1 : 1; // Se foi ontem, incrementa streak, senão reseta para 1

        console.log(`🎯 Login diário detectado! +${tokensToAward} $BOX (Streak: ${newStreak} dias)`);

        // Atualizar gamificação do usuário
        await updateDoc(doc(db, 'users', userId), {
          'gamification.tokens.box.balance': increment(tokensToAward),
          'gamification.tokens.box.totalEarned': increment(tokensToAward),
          'gamification.tokens.box.lastTransaction': serverTimestamp(),
          'gamification.totalActions': increment(1),
          'gamification.lastActionAt': serverTimestamp(),
          'gamification.streakDays': newStreak,
          'gamification.lastLoginStreak': serverTimestamp(),
          'gamification.weeklyTokens': increment(tokensToAward),
          'gamification.monthlyTokens': increment(tokensToAward),
          'gamification.yearlyTokens': increment(tokensToAward),
          'gamification.bestStreak': Math.max(newStreak, userData?.gamification?.bestStreak || 0),
          updatedAt: serverTimestamp(),
        });

        // Registrar a ação de gamificação
        await addDoc(collection(db, 'gamification_actions'), {
          userId,
          userEmail: userData.email,
          userName: userData.displayName || 'Usuário',
          action: 'login_diario',
          points: tokensToAward,
          description: `Login diário - Streak: ${newStreak} dias`,
          metadata: {
            streakDays: newStreak,
            previousStreak: currentStreak,
            loginDate: today.toISOString(),
          },
          createdAt: serverTimestamp(),
          processed: true,
          processedAt: serverTimestamp(),
        });

        return { awarded: true, tokens: tokensToAward, streak: newStreak };
      }

      return { awarded: false, reason: 'Já recebeu login diário hoje' };
    } catch (error) {
      console.error('❌ Erro ao processar login diário:', error);
      return { awarded: false, error: error };
    }
  };

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

              // Processar referência se existir
              let referredByUid = null;
              const referralCode = localStorage.getItem('referralCode');
              if (referralCode) {
                // Buscar usuário que indicou pelo código
                const refQuery = await getDocs(
                  query(collection(db, 'users'), where('gamification.referralCode', '==', referralCode))
                );
                if (!refQuery.empty) {
                  const refUser = refQuery.docs[0];
                  referredByUid = refUser.id;
                }
              }

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
                updatedAt: serverTimestamp(),
                gamification: {
                  tokens: {
                    box: {
                      balance: 0,
                      totalEarned: 0,
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

              // Se houve referência, atualizar o usuário que indicou
              if (referredByUid) {
                await updateDoc(doc(db, 'users', referredByUid), {
                  'gamification.referrals': arrayUnion(firebaseUser.uid),
                  'gamification.referralTokens': increment(50),
                  'gamification.tokens.box.balance': increment(50),
                  'gamification.tokens.box.totalEarned': increment(50),
                  'gamification.totalActions': increment(1),
                  'gamification.lastActionAt': serverTimestamp(),
                  updatedAt: serverTimestamp(),
                });
                // Limpar referralCode do localStorage
                localStorage.removeItem('referralCode');
              }

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
                profileComplete: userData?.profileComplete || false,
              };

              if (isSubscribed) {
                console.log('✅ Novo usuário criado e carregado com sucesso');
                setUser(extendedUser);
              }
            } else {
              // Buscar dados completos do usuário existente
              const userData = snapshot.data();

              // Processar login diário para usuários existentes
              if (userData?.gamification) {
                const dailyLoginResult = await processDailyLogin(firebaseUser.uid, userData);
                if (dailyLoginResult.awarded) {
                  console.log(`🎉 Login diário processado: +${dailyLoginResult.tokens} $BOX, Streak: ${dailyLoginResult.streak} dias`);
                } else {
                  console.log(`ℹ️ Login diário: ${dailyLoginResult.reason}`);
                }
              }

              // Verificar se é admin que precisa de verificação de CNH
              const adminEmails = ['avanticrossfit@gmail.com', 'gopersonal82@gmail.com'];
              const needsCNHVerification = adminEmails.includes(firebaseUser.email || '')
                && (userData?.role === 'admin' || userData?.role === 'dev')
                && !userData?.adminVerification?.completedAt;

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
                profileComplete: userData?.profileComplete || false,
                adminVerification: {
                  required: needsCNHVerification,
                  cnh: userData?.adminVerification?.cnh,
                  completedAt: userData?.adminVerification?.completedAt,
                },
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
                profileComplete: false,
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
    // Não verificar se já há usuário logado ou se ainda está carregando
    if (user || loading) {
      return;
    }

    const checkRedirectResult = async () => {
      try {
        console.log('🔍 Verificando resultado do redirecionamento...');

        // Reduzir timeout para 5 segundos e melhorar performance
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Timeout ao verificar redirecionamento')), 5000);
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
        // Se for timeout, apenas logar e continuar (não é um erro crítico)
        if (error.message === 'Timeout ao verificar redirecionamento') {
          console.log('⏰ Timeout ao verificar redirecionamento - continuando normalmente');
          return;
        }

        // Para outros erros, apenas logar (não são críticos para o funcionamento)
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
          console.log('ℹ️ Erro não crítico ao verificar redirecionamento:', error.message);
        }
      }
    };

    // Verificar apenas se não há usuário logado (otimização)
    const timer = setTimeout(checkRedirectResult, 200);
    return () => clearTimeout(timer);
  }, [user, loading]);

  const login = async () => {
    try {
      console.log('🔄 Iniciando login com redirecionamento...');

      // Usar apenas redirect (mais confiável)
      await signInWithRedirect(auth, provider);
      console.log('✅ Redirecionamento iniciado com sucesso');
    } catch (error: any) {
      console.error('❌ Erro ao iniciar login:', error);

      // Tratamento específico para diferentes tipos de erro
      if (error.code === 'auth/operation-not-allowed') {
        console.warn('⚠️ Login com Google não está habilitado');
      } else if (error.code === 'auth/invalid-api-key') {
        console.warn('⚠️ Erro de configuração do Firebase');
      } else {
        console.error('Erro desconhecido no login:', error);
      }

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
