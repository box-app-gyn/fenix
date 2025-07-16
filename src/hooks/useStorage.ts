import { useState, useEffect, useCallback, useRef } from 'react';
import { storage, STORAGE_KEYS, UserType, VALID_USER_TYPES } from '../utils/storage';

// Hook para usar storage com React
export function useStorage<T>(key: string, defaultValue?: T) {
  const [value, setValue] = useState<T | null>(() => {
    return storage.get<T>(key, defaultValue);
  });

  const isInitialized = useRef(false);

  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true;
      return;
    }

    const unsubscribe = storage.addListener(key, (newValue: T | null) => {
      setValue(newValue);
    });

    return unsubscribe;
  }, [key]);

  const setStorageValue = useCallback((newValue: T | null) => {
    if (newValue === null) {
      storage.remove(key);
    } else {
      storage.set(key, newValue);
    }
  }, [key]);

  return [value, setStorageValue] as const;
}

// Hook específico para tipo de usuário
export function useUserType() {
  const [userType, setUserType] = useStorage<UserType>(STORAGE_KEYS.USER_TYPE, 'publico');

  const updateUserType = useCallback((newUserType: UserType) => {
    if (VALID_USER_TYPES.includes(newUserType)) {
      setUserType(newUserType);
      return true;
    }
    console.error('Invalid user type:', newUserType);
    return false;
  }, [setUserType]);

  return [userType, updateUserType] as const;
}

// Hook para perfil do usuário
export function useUserProfile() {
  const [profile, setProfile] = useStorage(STORAGE_KEYS.USER_PROFILE);

  const updateProfile = useCallback((updates: Partial<typeof profile>) => {
    if (profile) {
      setProfile({
        ...profile,
        ...updates,
        updatedAt: new Date().toISOString(),
      });
    } else {
      setProfile({
        ...updates,
        updatedAt: new Date().toISOString(),
      } as typeof profile);
    }
  }, [profile, setProfile]);

  const clearProfile = useCallback(() => {
    setProfile(null);
  }, [setProfile]);

  return [profile, updateProfile, clearProfile] as const;
}

// Hook para preferências
export function usePreferences() {
  const defaultPreferences = {
    theme: 'auto' as const,
    language: 'pt-BR' as const,
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    privacy: {
      profileVisibility: 'public' as const,
      showEmail: false,
      showPhone: false,
    },
  };

  const [preferences, setPreferences] = useStorage(STORAGE_KEYS.PREFERENCES, defaultPreferences);

  const updatePreferences = useCallback((updates: Partial<typeof preferences>) => {
    if (preferences) {
      setPreferences({
        ...preferences,
        ...updates,
      });
    } else {
      setPreferences({
        ...defaultPreferences,
        ...updates,
      });
    }
  }, [preferences, setPreferences]);

  const updateTheme = useCallback((theme: 'light' | 'dark' | 'auto') => {
    updatePreferences({ theme: theme as any });
  }, [updatePreferences]);

  const updateLanguage = useCallback((language: 'pt-BR' | 'en-US' | 'es-ES') => {
    updatePreferences({ language: language as any });
  }, [updatePreferences]);

  const updateNotifications = useCallback((notifications: any) => {
    updatePreferences({ notifications });
  }, [updatePreferences]);

  const updatePrivacy = useCallback((privacy: any) => {
    updatePreferences({ privacy });
  }, [updatePreferences]);

  return {
    preferences,
    updatePreferences,
    updateTheme,
    updateLanguage,
    updateNotifications,
    updatePrivacy,
  };
}

// Hook para gamificação
export function useGamification() {
  const [gamification, setGamification] = useStorage(STORAGE_KEYS.GAMIFICATION);

  const updateGamification = useCallback((updates: Partial<typeof gamification>) => {
    if (gamification) {
      setGamification({
        ...gamification,
        ...updates,
        lastActionAt: new Date().toISOString(),
      });
    } else {
      setGamification({
        ...updates,
        lastActionAt: new Date().toISOString(),
      } as typeof gamification);
    }
  }, [gamification, setGamification]);

  const addPoints = useCallback((points: number) => {
    if (gamification) {
      updateGamification({
        points: ((gamification as any).points || 0) + points,
        totalActions: ((gamification as any).totalActions || 0) + 1,
      });
    }
  }, [gamification, updateGamification]);

  const addAchievement = useCallback((achievement: string) => {
    if (gamification && !(gamification as any).achievements?.includes(achievement)) {
      updateGamification({
        achievements: [...((gamification as any).achievements || []), achievement],
      });
    }
  }, [gamification, updateGamification]);

  const addReward = useCallback((reward: string) => {
    if (gamification && !(gamification as any).rewards?.includes(reward)) {
      updateGamification({
        rewards: [...((gamification as any).rewards || []), reward],
      });
    }
  }, [gamification, updateGamification]);

  const updateStreak = useCallback((streakDays: number) => {
    updateGamification({
      streakDays,
      lastLoginStreak: new Date().toISOString(),
    });
  }, [updateGamification]);

  return {
    gamification,
    updateGamification,
    addPoints,
    addAchievement,
    addReward,
    updateStreak,
  };
}

// Hook para cache
export function useCache<T>(key: string, defaultValue?: T) {
  const [value, setValue] = useState<T | null>(() => {
    const cached = storage.get(STORAGE_KEYS.CACHE);
    return (cached as any)?.data?.[key]?.value || defaultValue || null;
  });

  const setCacheValue = useCallback((newValue: T, ttl: number = 3600000) => {
    storage.set(STORAGE_KEYS.CACHE, {
      ...storage.get(STORAGE_KEYS.CACHE, { data: {}, lastUpdated: '', version: '1.0.0' }),
      data: {
        ...storage.get(STORAGE_KEYS.CACHE, { data: {}, lastUpdated: '', version: '1.0.0' })?.data,
        [key]: {
          value: newValue,
          timestamp: Date.now(),
          ttl,
        },
      },
      lastUpdated: new Date().toISOString(),
    });
    setValue(newValue);
  }, [key]);

  const clearCacheValue = useCallback(() => {
    const cache = storage.get(STORAGE_KEYS.CACHE);
    if ((cache as any)?.data?.[key]) {
      delete (cache as any).data[key];
      storage.set(STORAGE_KEYS.CACHE, cache);
      setValue(null);
    }
  }, [key]);

  return [value, setCacheValue, clearCacheValue] as const;
}

// Hook para sessão
export function useSession() {
  const [session, setSession] = useStorage(STORAGE_KEYS.SESSION);

  const updateSession = useCallback((updates: Partial<typeof session>) => {
    if (session) {
      setSession({
        ...session,
        ...updates,
        lastLogin: new Date().toISOString(),
      });
    } else {
      setSession({
        ...updates,
        lastLogin: new Date().toISOString(),
        sessionId: Math.random().toString(36).substring(2),
        deviceInfo: {
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          screenSize: `${window.screen.width}x${window.screen.height}`,
        },
      } as typeof session);
    }
  }, [session, setSession]);

  const clearSession = useCallback(() => {
    setSession(null);
  }, [setSession]);

  return [session, updateSession, clearSession] as const;
}

// Hook para dados específicos do app
export function useChatHistory() {
  return useStorage(STORAGE_KEYS.CHAT_HISTORY, []);
}

export function useAudiovisualSubmissions() {
  return useStorage(STORAGE_KEYS.AUDIOVISUAL_SUBMISSIONS, []);
}

export function useTeamInvites() {
  return useStorage(STORAGE_KEYS.TEAM_INVITES, []);
}

export function usePaymentHistory() {
  return useStorage(STORAGE_KEYS.PAYMENT_HISTORY, []);
}

// Hook para informações do storage
export function useStorageInfo() {
  const [info, setInfo] = useState(() => storage.getInfo());

  useEffect(() => {
    const updateInfo = () => {
      setInfo(storage.getInfo());
    };

    // Atualizar informações quando storage mudar
    const unsubscribe = storage.addListener('*', updateInfo);

    return unsubscribe;
  }, []);

  return info;
}

// Hook para limpeza automática
export function useStorageCleanup() {
  useEffect(() => {
    // Limpar cache expirado a cada 5 minutos
    const interval = setInterval(() => {
      const cache = storage.get(STORAGE_KEYS.CACHE);
      if ((cache as any)?.data) {
        const now = Date.now();
        const expiredKeys: string[] = [];

        Object.entries((cache as any).data).forEach(([key, item]: [string, any]) => {
          if (item.timestamp && item.ttl && (now - item.timestamp) > item.ttl) {
            expiredKeys.push(key);
          }
        });

        if (expiredKeys.length > 0) {
          expiredKeys.forEach((key) => {
            delete (cache as any).data[key];
          });
          storage.set(STORAGE_KEYS.CACHE, cache);
        }
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);
}

// Hook para sincronização entre abas
export function useStorageSync() {
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key && event.newValue !== null) {
        try {
          // const newValue = JSON.parse(event.newValue);
          storage.addListener(event.key, () => {}); // Trigger listeners
        } catch (error) {
          console.error('Error parsing storage change:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
}

// Hook combinado para uso geral
export function useAppStorage() {
  const [userType, setUserType] = useUserType();
  const [profile, updateProfile, clearProfile] = useUserProfile();
  const preferences = usePreferences();
  const gamification = useGamification();
  const [session, updateSession, clearSession] = useSession();
  const [chatHistory, setChatHistory] = useChatHistory();
  const [audiovisualSubmissions, setAudiovisualSubmissions] = useAudiovisualSubmissions();
  const [teamInvites, setTeamInvites] = useTeamInvites();
  const [paymentHistory, setPaymentHistory] = usePaymentHistory();
  const storageInfo = useStorageInfo();

  // Limpeza automática
  useStorageCleanup();

  // Sincronização entre abas
  useStorageSync();

  const clearAllUserData = useCallback(() => {
    clearProfile();
    clearSession();
    setChatHistory(null);
    setAudiovisualSubmissions(null);
    setTeamInvites(null);
    setPaymentHistory(null);
  }, [clearProfile, clearSession, setChatHistory, setAudiovisualSubmissions, setTeamInvites, setPaymentHistory]);

  return {
    // User data
    userType,
    setUserType,
    profile,
    updateProfile,
    clearProfile,

    // Preferences
    preferences,

    // Gamification
    gamification,

    // Session
    session,
    updateSession,
    clearSession,

    // App data
    chatHistory,
    setChatHistory,
    audiovisualSubmissions,
    setAudiovisualSubmissions,
    teamInvites,
    setTeamInvites,
    paymentHistory,
    setPaymentHistory,

    // Storage info
    storageInfo,

    // Utilities
    clearAllUserData,
  };
}
