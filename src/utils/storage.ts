// Tipos de usuário válidos
export const VALID_USER_TYPES = ['atleta', 'audiovisual', 'publico', 'admin'] as const;
export type UserType = typeof VALID_USER_TYPES[number];

// Tipos de dados que podem ser armazenados
export interface StorageData {
  userType: UserType;
  userProfile: {
    uid: string;
    email: string;
    displayName: string;
    photoURL?: string;
    role: UserType;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    gamification: {
      points: number;
      level: string;
      totalActions: number;
      lastActionAt: string;
      achievements: string[];
      rewards: string[];
      streakDays: number;
      lastLoginStreak: string;
      referralCode: string;
      referrals: string[];
      referralPoints: number;
    };
  };
  authToken: string;
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    language: 'pt-BR' | 'en-US' | 'es-ES';
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    privacy: {
      profileVisibility: 'public' | 'private' | 'friends';
      showEmail: boolean;
      showPhone: boolean;
    };
  };
  session: {
    lastLogin: string;
    sessionId: string;
    deviceInfo: {
      userAgent: string;
      platform: string;
      screenSize: string;
    };
  };
  cache: {
    lastUpdated: string;
    version: string;
    data: Record<string, any>;
  };
}

// Chaves de storage
export const STORAGE_KEYS = {
  USER_TYPE: 'userType',
  USER_PROFILE: 'userProfile',
  AUTH_TOKEN: 'authToken',
  PREFERENCES: 'preferences',
  SESSION: 'session',
  CACHE: 'cache',
  THEME: 'theme',
  LANGUAGE: 'language',
  NOTIFICATIONS: 'notifications',
  PRIVACY: 'privacy',
  GAMIFICATION: 'gamification',
  REFERRAL_CODE: 'referralCode',
  LAST_LOGIN: 'lastLogin',
  DEVICE_INFO: 'deviceInfo',
  APP_VERSION: 'appVersion',
  FEATURE_FLAGS: 'featureFlags',
  ANALYTICS: 'analytics',
  CHAT_HISTORY: 'chatHistory',
  AUDIOVISUAL_SUBMISSIONS: 'audiovisualSubmissions',
  TEAM_INVITES: 'teamInvites',
  PAYMENT_HISTORY: 'paymentHistory',
} as const;

// Classe principal de storage
export class StorageManager {
  private static instance: StorageManager;
  private storage: Storage;
  private cache: Map<string, any> = new Map();
  private listeners: Map<string, Set<(value: any) => void>> = new Map();

  private constructor() {
    this.storage = typeof window !== 'undefined' ? window.localStorage : {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
      length: 0,
      key: () => null,
    };
  }

  // Singleton pattern
  public static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager();
    }
    return StorageManager.instance;
  }

  // Verificar se o storage está disponível
  private isStorageAvailable(): boolean {
    try {
      const test = '__storage_test__';
      this.storage.setItem(test, test);
      this.storage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  // Obter valor do storage com validação
  public get<T>(key: string, defaultValue?: T): T | null {
    try {
      if (!this.isStorageAvailable()) {
        return defaultValue || null;
      }

      // Verificar cache primeiro
      if (this.cache.has(key)) {
        return this.cache.get(key);
      }

      const item = this.storage.getItem(key);
      if (item === null) {
        return defaultValue || null;
      }

      const parsed = JSON.parse(item);
      this.cache.set(key, parsed);

      // Notificar listeners
      this.notifyListeners(key, parsed);

      return parsed;
    } catch (error) {
      console.error(`Error reading from storage (${key}):`, error);
      return defaultValue || null;
    }
  }

  // Definir valor no storage
  public set<T>(key: string, value: T): boolean {
    try {
      if (!this.isStorageAvailable()) {
        return false;
      }

      const serialized = JSON.stringify(value);
      this.storage.setItem(key, serialized);

      // Atualizar cache
      this.cache.set(key, value);

      // Notificar listeners
      this.notifyListeners(key, value);

      return true;
    } catch (error) {
      console.error(`Error writing to storage (${key}):`, error);
      return false;
    }
  }

  // Remover item do storage
  public remove(key: string): boolean {
    try {
      if (!this.isStorageAvailable()) {
        return false;
      }

      this.storage.removeItem(key);
      this.cache.delete(key);

      // Notificar listeners
      this.notifyListeners(key, null);

      return true;
    } catch (error) {
      console.error(`Error removing from storage (${key}):`, error);
      return false;
    }
  }

  // Limpar todo o storage
  public clear(): boolean {
    try {
      if (!this.isStorageAvailable()) {
        return false;
      }

      this.storage.clear();
      this.cache.clear();

      // Notificar todos os listeners
      this.listeners.forEach((listeners) => {
        listeners.forEach((listener) => listener(null));
      });

      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  }

  // Verificar se chave existe
  public has(key: string): boolean {
    try {
      if (!this.isStorageAvailable()) {
        return false;
      }
      return this.storage.getItem(key) !== null;
    } catch {
      return false;
    }
  }

  // Obter todas as chaves
  public keys(): string[] {
    try {
      if (!this.isStorageAvailable()) {
        return [];
      }
      return Object.keys(this.storage);
    } catch {
      return [];
    }
  }

  // Obter tamanho do storage
  public size(): number {
    try {
      if (!this.isStorageAvailable()) {
        return 0;
      }
      return this.storage.length;
    } catch {
      return 0;
    }
  }

  // Adicionar listener para mudanças
  public addListener(key: string, callback: (value: any) => void): () => void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }

    this.listeners.get(key)!.add(callback);

    // Retornar função para remover listener
    return () => {
      this.listeners.get(key)?.delete(callback);
    };
  }

  // Notificar listeners
  private notifyListeners(key: string, value: any): void {
    const keyListeners = this.listeners.get(key);
    if (keyListeners) {
      keyListeners.forEach((listener) => {
        try {
          listener(value);
        } catch (error) {
          console.error('Error in storage listener:', error);
        }
      });
    }
  }

  // Limpar cache
  public clearCache(): void {
    this.cache.clear();
  }

  // Obter informações do storage
  public getInfo(): {
    available: boolean;
    size: number;
    keys: string[];
    cacheSize: number;
    } {
    return {
      available: this.isStorageAvailable(),
      size: this.size(),
      keys: this.keys(),
      cacheSize: this.cache.size,
    };
  }
}

// Instância global do storage manager
export const storage = StorageManager.getInstance();

// Funções específicas para tipos de usuário
export const getUserType = (): UserType => {
  const userType = storage.get<UserType>(STORAGE_KEYS.USER_TYPE);
  if (userType && VALID_USER_TYPES.includes(userType)) {
    return userType;
  }
  return 'publico'; // Default mais seguro
};

export const setUserType = (userType: UserType): boolean => {
  if (!VALID_USER_TYPES.includes(userType)) {
    console.error('Invalid user type:', userType);
    return false;
  }
  return storage.set(STORAGE_KEYS.USER_TYPE, userType);
};

// Funções para perfil do usuário
export const getUserProfile = () => {
  return storage.get(STORAGE_KEYS.USER_PROFILE);
};

export const setUserProfile = (profile: any): boolean => {
  return storage.set(STORAGE_KEYS.USER_PROFILE, {
    ...profile,
    updatedAt: new Date().toISOString(),
  });
};

// Funções para preferências
export const getPreferences = () => {
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

  return storage.get(STORAGE_KEYS.PREFERENCES, defaultPreferences);
};

export const setPreferences = (preferences: any): boolean => {
  return storage.set(STORAGE_KEYS.PREFERENCES, preferences);
};

// Funções para gamificação
export const getGamification = () => {
  return storage.get(STORAGE_KEYS.GAMIFICATION);
};

export const setGamification = (gamification: any): boolean => {
  return storage.set(STORAGE_KEYS.GAMIFICATION, {
    ...gamification,
    lastActionAt: new Date().toISOString(),
  });
};

// Funções para sessão
export const getSession = () => {
  return storage.get(STORAGE_KEYS.SESSION);
};

export const setSession = (session: any): boolean => {
  return storage.set(STORAGE_KEYS.SESSION, {
    ...session,
    lastLogin: new Date().toISOString(),
  });
};

// Funções para cache
export const getCache = (key: string) => {
  const cache = storage.get(STORAGE_KEYS.CACHE) as any;
  return cache?.data?.[key];
};

export const setCache = (key: string, value: any, ttl: number = 3600000): boolean => {
  const cache = storage.get(STORAGE_KEYS.CACHE, { data: {}, lastUpdated: '', version: '1.0.0' }) as any;

  if (cache && cache.data) {
    cache.data[key] = {
      value,
      timestamp: Date.now(),
      ttl,
    };

    cache.lastUpdated = new Date().toISOString();

    return storage.set(STORAGE_KEYS.CACHE, cache);
  }

  return false;
};

export const clearExpiredCache = (): void => {
  const cache = storage.get(STORAGE_KEYS.CACHE) as any;
  if (!cache?.data) return;

  const now = Date.now();
  const expiredKeys: string[] = [];

  Object.entries(cache.data).forEach(([key, item]: [string, any]) => {
    if (item.timestamp && item.ttl && (now - item.timestamp) > item.ttl) {
      expiredKeys.push(key);
    }
  });

  expiredKeys.forEach((key) => {
    delete cache.data[key];
  });

  if (expiredKeys.length > 0) {
    storage.set(STORAGE_KEYS.CACHE, cache);
  }
};

// Funções utilitárias
export const clearUserData = (): boolean => {
  const keysToRemove = [
    STORAGE_KEYS.USER_PROFILE,
    STORAGE_KEYS.AUTH_TOKEN,
    STORAGE_KEYS.SESSION,
    STORAGE_KEYS.CHAT_HISTORY,
    STORAGE_KEYS.AUDIOVISUAL_SUBMISSIONS,
    STORAGE_KEYS.TEAM_INVITES,
    STORAGE_KEYS.PAYMENT_HISTORY,
  ];

  let success = true;
  keysToRemove.forEach((key) => {
    if (!storage.remove(key)) {
      success = false;
    }
  });

  return success;
};

export const exportUserData = (): any => {
  const data: any = {};

  Object.values(STORAGE_KEYS).forEach((key) => {
    const value = storage.get(key);
    if (value !== null) {
      data[key] = value;
    }
  });

  return {
    exportDate: new Date().toISOString(),
    version: '1.0.0',
    data,
  };
};

export const importUserData = (data: any): boolean => {
  try {
    if (!data?.data || typeof data.data !== 'object') {
      throw new Error('Invalid data format');
    }

    Object.entries(data.data).forEach(([key, value]) => {
      storage.set(key, value);
    });

    return true;
  } catch (error) {
    console.error('Error importing user data:', error);
    return false;
  }
};

// Hook para React (se necessário)
export const useStorage = async (key: string, defaultValue?: any) => {
  // Importação dinâmica do React para evitar erros de build
  const React = await import('react');
  const [value, setValue] = React.useState(() => storage.get(key, defaultValue));

  React.useEffect(() => {
    const unsubscribe = storage.addListener(key, (newValue) => {
      setValue(newValue);
    });

    return unsubscribe;
  }, [key]);

  const setStorageValue = React.useCallback((newValue: any) => {
    storage.set(key, newValue);
  }, [key]);

  return [value, setStorageValue];
};

// Exportar funções específicas do arquivo original
export const getValidatedUserType = (): UserType => {
  return getUserType();
};
