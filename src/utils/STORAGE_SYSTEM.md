# Sistema de Storage - App Fenix

## Visão Geral

O sistema de storage do App Fenix é uma solução robusta e type-safe para gerenciar dados locais do usuário. O sistema utiliza localStorage com cache em memória, listeners para mudanças, validação de tipos e hooks React para facilitar o uso.

## Arquitetura

### Estrutura de Arquivos

```
src/
├── utils/
│   ├── storage.ts                    # Sistema principal de storage
│   ├── __tests__/
│   │   └── storage.test.ts          # Testes unitários
│   └── STORAGE_SYSTEM.md            # Esta documentação
└── hooks/
    └── useStorage.ts                # Hooks React para storage
```

### Componentes Principais

1. **StorageManager** - Classe singleton para gerenciar storage
2. **Type Safety** - Tipos TypeScript para todos os dados
3. **Cache System** - Cache em memória para performance
4. **Event Listeners** - Sistema de notificação de mudanças
5. **React Hooks** - Hooks para integração com React

## Tipos de Dados

### UserType
```typescript
export const VALID_USER_TYPES = ['atleta', 'audiovisual', 'publico', 'admin'] as const;
export type UserType = typeof VALID_USER_TYPES[number];
```

### StorageData Interface
```typescript
interface StorageData {
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
```

## Chaves de Storage

```typescript
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
  PAYMENT_HISTORY: 'paymentHistory'
} as const;
```

## Uso Básico

### StorageManager

```typescript
import { storage } from '../utils/storage';

// Definir valor
storage.set('key', { data: 'value' });

// Obter valor
const value = storage.get('key');

// Obter valor com default
const value = storage.get('key', { default: 'value' });

// Remover valor
storage.remove('key');

// Verificar se existe
const exists = storage.has('key');

// Limpar tudo
storage.clear();
```

### Funções Específicas

```typescript
import { 
  getUserType, 
  setUserType, 
  getUserProfile, 
  setUserProfile,
  getPreferences,
  setPreferences,
  getGamification,
  setGamification
} from '../utils/storage';

// Tipo de usuário
const userType = getUserType();
setUserType('atleta');

// Perfil do usuário
const profile = getUserProfile();
setUserProfile({
  uid: 'user123',
  email: 'user@example.com',
  displayName: 'João Silva',
  role: 'atleta'
});

// Preferências
const preferences = getPreferences();
setPreferences({
  theme: 'dark',
  language: 'pt-BR'
});

// Gamificação
const gamification = getGamification();
setGamification({
  points: 100,
  level: 'iniciante',
  achievements: ['first_blood']
});
```

## Hooks React

### useStorage (Hook Genérico)

```typescript
import { useStorage } from '../hooks/useStorage';

function MyComponent() {
  const [value, setValue] = useStorage('myKey', 'defaultValue');

  return (
    <div>
      <p>Valor: {value}</p>
      <button onClick={() => setValue('novo valor')}>
        Atualizar
      </button>
    </div>
  );
}
```

### useUserType

```typescript
import { useUserType } from '../hooks/useStorage';

function UserTypeSelector() {
  const [userType, setUserType] = useUserType();

  return (
    <select value={userType} onChange={(e) => setUserType(e.target.value as UserType)}>
      <option value="atleta">Atleta</option>
      <option value="audiovisual">Audiovisual</option>
      <option value="publico">Público</option>
      <option value="admin">Admin</option>
    </select>
  );
}
```

### useUserProfile

```typescript
import { useUserProfile } from '../hooks/useStorage';

function ProfileEditor() {
  const [profile, updateProfile, clearProfile] = useUserProfile();

  const handleUpdate = () => {
    updateProfile({
      displayName: 'Novo Nome',
      isActive: true
    });
  };

  return (
    <div>
      <p>Nome: {profile?.displayName}</p>
      <button onClick={handleUpdate}>Atualizar</button>
      <button onClick={clearProfile}>Limpar</button>
    </div>
  );
}
```

### usePreferences

```typescript
import { usePreferences } from '../hooks/useStorage';

function PreferencesPanel() {
  const { 
    preferences, 
    updateTheme, 
    updateLanguage, 
    updateNotifications 
  } = usePreferences();

  return (
    <div>
      <select 
        value={preferences?.theme} 
        onChange={(e) => updateTheme(e.target.value as any)}
      >
        <option value="light">Claro</option>
        <option value="dark">Escuro</option>
        <option value="auto">Automático</option>
      </select>

      <select 
        value={preferences?.language} 
        onChange={(e) => updateLanguage(e.target.value as any)}
      >
        <option value="pt-BR">Português</option>
        <option value="en-US">English</option>
        <option value="es-ES">Español</option>
      </select>
    </div>
  );
}
```

### useGamification

```typescript
import { useGamification } from '../hooks/useStorage';

function GamificationPanel() {
  const { 
    gamification, 
    addPoints, 
    addAchievement, 
    addReward 
  } = useGamification();

  const handleAction = () => {
    addPoints(10);
    addAchievement('action_completed');
  };

  return (
    <div>
      <p>Pontos: {gamification?.points || 0}</p>
      <p>Nível: {gamification?.level || 'iniciante'}</p>
      <p>Conquistas: {gamification?.achievements?.length || 0}</p>
      <button onClick={handleAction}>Realizar Ação</button>
    </div>
  );
}
```

### useCache

```typescript
import { useCache } from '../hooks/useStorage';

function CachedData() {
  const [data, setData, clearData] = useCache('apiData');

  const fetchData = async () => {
    const response = await fetch('/api/data');
    const result = await response.json();
    setData(result, 300000); // Cache por 5 minutos
  };

  return (
    <div>
      <button onClick={fetchData}>Buscar Dados</button>
      <button onClick={clearData}>Limpar Cache</button>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
```

### useAppStorage (Hook Combinado)

```typescript
import { useAppStorage } from '../hooks/useStorage';

function App() {
  const {
    userType,
    setUserType,
    profile,
    updateProfile,
    preferences,
    gamification,
    session,
    chatHistory,
    clearAllUserData
  } = useAppStorage();

  return (
    <div>
      <h1>App Fenix</h1>
      <p>Usuário: {profile?.displayName}</p>
      <p>Tipo: {userType}</p>
      <p>Pontos: {gamification?.points || 0}</p>
      <button onClick={clearAllUserData}>Logout</button>
    </div>
  );
}
```

## Funcionalidades Avançadas

### Listeners

```typescript
import { storage } from '../utils/storage';

// Adicionar listener
const unsubscribe = storage.addListener('userType', (newValue) => {
  console.log('Tipo de usuário mudou:', newValue);
});

// Remover listener
unsubscribe();
```

### Cache com TTL

```typescript
import { setCache, getCache, clearExpiredCache } from '../utils/storage';

// Definir cache com TTL (1 hora)
setCache('apiData', { data: 'value' }, 3600000);

// Obter cache
const data = getCache('apiData');

// Limpar cache expirado
clearExpiredCache();
```

### Export/Import de Dados

```typescript
import { exportUserData, importUserData } from '../utils/storage';

// Exportar dados
const userData = exportUserData();
console.log('Dados exportados:', userData);

// Importar dados
const success = importUserData(userData);
if (success) {
  console.log('Dados importados com sucesso');
}
```

### Informações do Storage

```typescript
import { storage } from '../utils/storage';

const info = storage.getInfo();
console.log('Storage info:', {
  available: info.available,
  size: info.size,
  keys: info.keys,
  cacheSize: info.cacheSize
});
```

## Tratamento de Erros

### localStorage Indisponível

O sistema detecta automaticamente se o localStorage está disponível e usa fallbacks apropriados:

```typescript
// Se localStorage não estiver disponível
const value = storage.get('key', 'default'); // Retorna 'default'
const success = storage.set('key', 'value'); // Retorna false
```

### JSON Inválido

```typescript
// Se o JSON no localStorage for inválido
const value = storage.get('invalidKey'); // Retorna null
```

### Validação de Tipos

```typescript
// Validação automática de tipos de usuário
const success = setUserType('invalidType'); // Retorna false
const userType = getUserType(); // Retorna 'publico' (default)
```

## Performance

### Cache em Memória

- Dados são cacheados em memória para leituras subsequentes
- Cache é limpo automaticamente quando necessário
- Cache expirado é removido periodicamente

### Limpeza Automática

```typescript
// Limpeza automática a cada 5 minutos
useStorageCleanup();
```

### Sincronização Entre Abas

```typescript
// Sincronização automática entre abas
useStorageSync();
```

## Testes

### Executar Testes

```bash
npm test src/utils/__tests__/storage.test.ts
```

### Cobertura de Testes

- ✅ Operações básicas (get, set, remove, clear)
- ✅ Cache em memória
- ✅ Listeners e notificações
- ✅ Tratamento de erros
- ✅ Validação de tipos
- ✅ Funções específicas
- ✅ Hooks React
- ✅ Integração entre componentes

## Boas Práticas

### 1. Sempre Use Tipos

```typescript
// ✅ Bom
const [userType, setUserType] = useUserType();

// ❌ Evite
const [userType, setUserType] = useStorage('userType');
```

### 2. Use Valores Padrão

```typescript
// ✅ Bom
const preferences = getPreferences(); // Retorna defaults

// ❌ Evite
const preferences = storage.get('preferences'); // Pode retornar null
```

### 3. Trate Erros

```typescript
// ✅ Bom
const success = setUserType('atleta');
if (!success) {
  console.error('Erro ao definir tipo de usuário');
}

// ❌ Evite
setUserType('atleta'); // Ignora resultado
```

### 4. Use Listeners com Cuidado

```typescript
// ✅ Bom
useEffect(() => {
  const unsubscribe = storage.addListener('key', callback);
  return unsubscribe; // Limpa listener
}, []);

// ❌ Evite
storage.addListener('key', callback); // Memory leak
```

### 5. Limpe Dados Sensíveis

```typescript
// ✅ Bom
const clearAllUserData = () => {
  clearUserData(); // Remove dados sensíveis
};

// ❌ Evite
storage.clear(); // Remove tudo, incluindo dados não sensíveis
```

## Migração do Código Original

### Antes (storage.js)

```javascript
const VALID_USER_TYPES = ['atleta', 'audiovisual', 'publico'] as const;
type UserType = typeof VALID_USER_TYPES[number];

export const getValidatedUserType = (): UserType => {
  try {
    const stored = localStorage.getItem('userType');
    if (stored && VALID_USER_TYPES.includes(stored as UserType)) {
      return stored as UserType;
    }
  } catch (error) {
    console.error('Error reading localStorage:', error);
  }
  return 'atleta';
};
```

### Depois (storage.ts)

```typescript
import { getUserType } from '../utils/storage';

// Função mantida para compatibilidade
export const getValidatedUserType = (): UserType => {
  return getUserType();
};

// Uso recomendado
const userType = getUserType();
// ou
const [userType, setUserType] = useUserType();
```

## Próximos Passos

1. **Migração Gradual** - Substituir uso direto do localStorage pelo sistema
2. **Testes de Integração** - Testar com componentes React reais
3. **Monitoramento** - Adicionar métricas de uso do storage
4. **Otimização** - Implementar compressão para dados grandes
5. **Sincronização** - Sincronização com backend quando necessário 