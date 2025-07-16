import {
  StorageManager,
  storage,
  VALID_USER_TYPES,
  UserType,
  getUserType,
  setUserType,
  getUserProfile,
  setUserProfile,
  getPreferences,
  setPreferences,
  getGamification,
  setGamification,
  getCache,
  setCache,
  clearExpiredCache,
  clearUserData,
  exportUserData,
  importUserData,
  STORAGE_KEYS,
} from '../storage';

// Mock do localStorage
const mockLocalStorage = {
  data: {} as Record<string, string>,
  getItem: function(key: string): string | null {
    return this.data[key] || null;
  },
  setItem: function(key: string, value: string): void {
    this.data[key] = value;
  },
  removeItem: function(key: string): void {
    delete this.data[key];
  },
  clear: function(): void {
    this.data = {};
  },
  length: 0,
  key: function(index: number): string | null {
    return Object.keys(this.data)[index] || null;
  },
};

// Mock do window
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

describe('StorageManager', () => {
  let storageManager: StorageManager;

  beforeEach(() => {
    // Limpar localStorage antes de cada teste
    mockLocalStorage.clear();
    storageManager = StorageManager.getInstance();
    storageManager.clearCache();
  });

  describe('Singleton Pattern', () => {
    it('deve retornar a mesma instância', () => {
      const instance1 = StorageManager.getInstance();
      const instance2 = StorageManager.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('Basic Operations', () => {
    it('deve definir e obter valor', () => {
      const key = 'testKey';
      const value = { test: 'data' };

      const setResult = storageManager.set(key, value);
      expect(setResult).toBe(true);

      const getResult = storageManager.get(key);
      expect(getResult).toEqual(value);
    });

    it('deve retornar null para chave inexistente', () => {
      const result = storageManager.get('nonexistent');
      expect(result).toBeNull();
    });

    it('deve retornar valor padrão para chave inexistente', () => {
      const defaultValue = { default: 'value' };
      const result = storageManager.get('nonexistent', defaultValue);
      expect(result).toEqual(defaultValue);
    });

    it('deve remover item', () => {
      const key = 'testKey';
      const value = { test: 'data' };

      storageManager.set(key, value);
      expect(storageManager.get(key)).toEqual(value);

      const removeResult = storageManager.remove(key);
      expect(removeResult).toBe(true);
      expect(storageManager.get(key)).toBeNull();
    });

    it('deve verificar se chave existe', () => {
      const key = 'testKey';
      const value = { test: 'data' };

      expect(storageManager.has(key)).toBe(false);

      storageManager.set(key, value);
      expect(storageManager.has(key)).toBe(true);
    });

    it('deve limpar todo o storage', () => {
      storageManager.set('key1', 'value1');
      storageManager.set('key2', 'value2');

      expect(storageManager.size()).toBe(2);

      const clearResult = storageManager.clear();
      expect(clearResult).toBe(true);
      expect(storageManager.size()).toBe(0);
    });
  });

  describe('Cache', () => {
    it('deve usar cache para leituras subsequentes', () => {
      const key = 'testKey';
      const value = { test: 'data' };

      storageManager.set(key, value);

      // Primeira leitura
      const firstRead = storageManager.get(key);
      expect(firstRead).toEqual(value);

      // Segunda leitura deve usar cache
      const secondRead = storageManager.get(key);
      expect(secondRead).toEqual(value);
    });

    it('deve limpar cache', () => {
      const key = 'testKey';
      const value = { test: 'data' };

      storageManager.set(key, value);
      storageManager.get(key); // Carregar no cache

      storageManager.clearCache();

      // Cache deve estar vazio
      const info = storageManager.getInfo();
      expect(info.cacheSize).toBe(0);
    });
  });

  describe('Listeners', () => {
    it('deve notificar listeners quando valor muda', () => {
      const key = 'testKey';
      const callback = jest.fn();

      const unsubscribe = storageManager.addListener(key, callback);

      storageManager.set(key, 'newValue');

      expect(callback).toHaveBeenCalledWith('newValue');

      unsubscribe();
    });

    it('deve remover listener quando unsubscribe é chamado', () => {
      const key = 'testKey';
      const callback = jest.fn();

      const unsubscribe = storageManager.addListener(key, callback);
      unsubscribe();

      storageManager.set(key, 'newValue');

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('deve lidar com JSON inválido', () => {
      // Simular localStorage com JSON inválido
      mockLocalStorage.setItem('invalidKey', 'invalid json');

      const result = storageManager.get('invalidKey');
      expect(result).toBeNull();
    });

    it('deve lidar com localStorage indisponível', () => {
      // Simular localStorage indisponível
      const originalLocalStorage = window.localStorage;
      delete (window as any).localStorage;

      const result = storageManager.get('testKey', 'default');
      expect(result).toBe('default');

      // Restaurar localStorage
      (window as any).localStorage = originalLocalStorage;
    });
  });
});

describe('User Type Functions', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
  });

  it('deve obter tipo de usuário válido', () => {
    const userType: UserType = 'atleta';
    setUserType(userType);

    const result = getUserType();
    expect(result).toBe(userType);
  });

  it('deve retornar default para tipo inválido', () => {
    // Simular tipo inválido no localStorage
    mockLocalStorage.setItem(STORAGE_KEYS.USER_TYPE, 'invalidType');

    const result = getUserType();
    expect(result).toBe('publico');
  });

  it('deve definir tipo de usuário válido', () => {
    const userType: UserType = 'audiovisual';
    const result = setUserType(userType);

    expect(result).toBe(true);
    expect(getUserType()).toBe(userType);
  });

  it('deve rejeitar tipo de usuário inválido', () => {
    const result = setUserType('invalidType' as UserType);

    expect(result).toBe(false);
  });

  it('deve validar tipos de usuário', () => {
    VALID_USER_TYPES.forEach((type) => {
      expect(setUserType(type)).toBe(true);
      expect(getUserType()).toBe(type);
    });
  });
});

describe('Profile Functions', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
  });

  it('deve definir e obter perfil do usuário', () => {
    const profile = {
      uid: 'test123',
      email: 'test@example.com',
      displayName: 'Test User',
      role: 'atleta' as UserType,
      isActive: true,
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z',
      gamification: {
        points: 100,
        level: 'iniciante',
        totalActions: 5,
        lastActionAt: '2025-01-01T00:00:00Z',
        achievements: ['first_blood'],
        rewards: [],
        streakDays: 3,
        lastLoginStreak: '2025-01-01T00:00:00Z',
        referralCode: 'REF123',
        referrals: [],
        referralPoints: 0,
      },
    };

    const setResult = setUserProfile(profile);
    expect(setResult).toBe(true);

    const getResult = getUserProfile();
    expect(getResult).toMatchObject(profile);
    expect(getResult?.updatedAt).toBeDefined();
  });
});

describe('Preferences Functions', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
  });

  it('deve retornar preferências padrão', () => {
    const preferences = getPreferences();

    expect(preferences).toMatchObject({
      theme: 'auto',
      language: 'pt-BR',
      notifications: {
        email: true,
        push: true,
        sms: false,
      },
      privacy: {
        profileVisibility: 'public',
        showEmail: false,
        showPhone: false,
      },
    });
  });

  it('deve definir preferências customizadas', () => {
    const customPreferences = {
      theme: 'dark' as const,
      language: 'en-US' as const,
      notifications: {
        email: false,
        push: true,
        sms: true,
      },
      privacy: {
        profileVisibility: 'private' as const,
        showEmail: true,
        showPhone: false,
      },
    };

    const setResult = setPreferences(customPreferences);
    expect(setResult).toBe(true);

    const getResult = getPreferences();
    expect(getResult).toEqual(customPreferences);
  });
});

describe('Gamification Functions', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
  });

  it('deve definir e obter dados de gamificação', () => {
    const gamification = {
      points: 500,
      level: 'intermediário',
      totalActions: 25,
      achievements: ['first_blood', 'streak_7'],
      rewards: ['badge_1'],
      streakDays: 7,
      referralCode: 'REF456',
      referrals: ['user1', 'user2'],
      referralPoints: 50,
    };

    const setResult = setGamification(gamification);
    expect(setResult).toBe(true);

    const getResult = getGamification();
    expect(getResult).toMatchObject(gamification);
    expect(getResult?.lastActionAt).toBeDefined();
  });
});

describe('Cache Functions', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
  });

  it('deve definir e obter cache', () => {
    const key = 'testCache';
    const value = { cached: 'data' };
    const ttl = 60000; // 1 minuto

    const setResult = setCache(key, value, ttl);
    expect(setResult).toBe(true);

    const getResult = getCache(key);
    expect(getResult).toMatchObject({
      value,
      timestamp: expect.any(Number),
      ttl,
    });
  });

  it('deve limpar cache expirado', () => {
    const key = 'expiredCache';
    const value = { cached: 'data' };
    const ttl = 1000; // 1 segundo

    setCache(key, value, ttl);

    // Aguardar expiração
    setTimeout(() => {
      clearExpiredCache();

      const result = getCache(key);
      expect(result).toBeUndefined();
    }, 1100);
  });

  it('deve usar TTL padrão', () => {
    const key = 'defaultCache';
    const value = { cached: 'data' };

    setCache(key, value);

    const result = getCache(key);
    expect(result.ttl).toBe(3600000); // 1 hora padrão
  });
});

describe('Utility Functions', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
  });

  it('deve limpar dados do usuário', () => {
    // Adicionar dados do usuário
    setUserProfile({ uid: 'test' });
    setCache('chatHistory', []);
    setCache('audiovisualSubmissions', []);
    setCache('teamInvites', []);
    setCache('paymentHistory', []);

    const clearResult = clearUserData();
    expect(clearResult).toBe(true);

    // Verificar se dados foram removidos
    expect(getUserProfile()).toBeNull();
    expect(getCache('chatHistory')).toBeUndefined();
  });

  it('deve exportar dados do usuário', () => {
    const testData = {
      userType: 'atleta' as UserType,
      userProfile: { uid: 'test' },
      preferences: { theme: 'dark' },
    };

    Object.entries(testData).forEach(([key, value]) => {
      storage.set(key, value);
    });

    const exportResult = exportUserData();

    expect(exportResult).toMatchObject({
      exportDate: expect.any(String),
      version: '1.0.0',
      data: expect.objectContaining(testData),
    });
  });

  it('deve importar dados do usuário', () => {
    const importData = {
      exportDate: '2025-01-01T00:00:00Z',
      version: '1.0.0',
      data: {
        userType: 'audiovisual',
        userProfile: { uid: 'imported' },
        preferences: { theme: 'light' },
      },
    };

    const importResult = importUserData(importData);
    expect(importResult).toBe(true);

    // Verificar se dados foram importados
    expect(getUserType()).toBe('audiovisual');
    expect(getUserProfile()).toMatchObject({ uid: 'imported' });
  });

  it('deve rejeitar dados de importação inválidos', () => {
    const invalidData = { invalid: 'format' };

    const importResult = importUserData(invalidData);
    expect(importResult).toBe(false);
  });
});

describe('Storage Info', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
  });

  it('deve retornar informações do storage', () => {
    storage.set('key1', 'value1');
    storage.set('key2', 'value2');

    const info = storage.getInfo();

    expect(info).toMatchObject({
      available: true,
      size: 2,
      keys: expect.arrayContaining(['key1', 'key2']),
      cacheSize: expect.any(Number),
    });
  });
});

// Testes de integração
describe('Integration Tests', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
  });

  it('deve manter consistência entre operações', () => {
    // Definir tipo de usuário
    setUserType('atleta');

    // Definir perfil
    const profile = {
      uid: 'test123',
      email: 'test@example.com',
      displayName: 'Test User',
      role: 'atleta' as UserType,
      isActive: true,
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z',
      gamification: {
        points: 100,
        level: 'iniciante',
        totalActions: 5,
        lastActionAt: '2025-01-01T00:00:00Z',
        achievements: ['first_blood'],
        rewards: [],
        streakDays: 3,
        lastLoginStreak: '2025-01-01T00:00:00Z',
        referralCode: 'REF123',
        referrals: [],
        referralPoints: 0,
      },
    };
    setUserProfile(profile);

    // Definir preferências
    const preferences = {
      theme: 'dark' as const,
      language: 'pt-BR' as const,
      notifications: { email: true, push: true, sms: false },
      privacy: { profileVisibility: 'public' as const, showEmail: false, showPhone: false },
    };
    setPreferences(preferences);

    // Verificar consistência
    expect(getUserType()).toBe('atleta');
    expect(getUserProfile()).toMatchObject(profile);
    expect(getPreferences()).toEqual(preferences);

    // Verificar se dados persistem no localStorage
    expect(mockLocalStorage.getItem(STORAGE_KEYS.USER_TYPE)).toBe('"atleta"');
    expect(mockLocalStorage.getItem(STORAGE_KEYS.USER_PROFILE)).toBeDefined();
    expect(mockLocalStorage.getItem(STORAGE_KEYS.PREFERENCES)).toBeDefined();
  });
});
