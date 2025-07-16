# Sistema de Tipos Firestore - App Fenix

## 📋 Visão Geral

Este documento descreve o sistema completo de tipos TypeScript para o Firestore do App Fenix, incluindo todas as coleções, interfaces, validações e utilitários.

## 🏗️ Arquitetura

### Estrutura de Coleções

```
📁 Firestore Collections
├── 📄 users                    # Usuários do sistema
├── 📄 teams                    # Times de competição
├── 📄 convites_times          # Convites para times
├── 📄 pedidos                 # Pedidos e pagamentos
├── 📄 audiovisual             # Credenciamento audiovisual
├── 📄 patrocinadores          # Patrocinadores do evento
├── 📄 adminLogs               # Logs de ações administrativas
├── 📄 gamification_actions    # Histórico de ações de gamificação
├── 📄 gamification_leaderboard # Ranking de usuários
├── 📄 gamification_rewards    # Recompensas disponíveis
├── 📄 gamification_user_rewards # Recompensas resgatadas
├── 📄 gamification_achievements # Conquistas do sistema
└── 📄 gamification_community_highlights # Destaques da comunidade
```

## 🎯 Tipos Base

### UserRole

```typescript
type UserRole = 'publico' | 'fotografo' | 'videomaker' | 'patrocinador' | 'apoio' | 'judge' | 'atleta' | 'admin';
```

### PaymentStatus

```typescript
type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'expired';
```

### GamificationAction

```typescript
type GamificationAction = 
  | 'cadastro'           // +10 $BOX
  | 'indicacao_confirmada' // +50 $BOX
  | 'compra_ingresso'    // +100 $BOX
  | 'envio_conteudo'     // +75 $BOX
  | 'qr_scan_evento'     // +25 $BOX (variável)
  | 'prova_extra'        // +50 $BOX (variável)
  | 'participacao_enquete' // +15 $BOX
  | 'acesso_spoiler'     // +20 $BOX
  | 'checkin_evento'     // +30 $BOX
  | 'compartilhamento'   // +10 $BOX
  | 'login_diario'       // +5 $BOX
  | 'completar_perfil'   // +25 $BOX;
```

## 📊 Interfaces Principais

### FirestoreUser

Interface principal para usuários do sistema:

```typescript
interface FirestoreUser {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: UserRole;
  phone?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isActive: boolean;
  
  // Metadados e analytics
  metadata?: {
    lastLogin?: Timestamp;
    loginCount?: number;
    preferences?: Record<string, any>;
    deviceInfo?: {
      userAgent: string;
      platform: string;
      screenSize: string;
    };
    analytics?: {
      firstVisit: Timestamp;
      totalVisits: number;
      lastVisit: Timestamp;
      referrer?: string;
      utmSource?: string;
      utmMedium?: string;
      utmCampaign?: string;
    };
  };
  
  // Sistema de gamificação
  gamification?: {
    points: number;
    level: GamificationLevel;
    totalActions: number;
    lastActionAt?: Timestamp;
    achievements: string[];
    rewards: string[];
    streakDays: number;
    lastLoginStreak?: Timestamp;
    referralCode?: string;
    referredBy?: string;
    referrals: string[];
    referralPoints: number;
    weeklyPoints: number;
    monthlyPoints: number;
    yearlyPoints: number;
    bestStreak: number;
    badges: string[];
    challenges: Array<{
      id: string;
      progress: number;
      completed: boolean;
      completedAt?: Timestamp;
    }>;
  };
  
  // Segurança e auditoria
  security?: {
    lastPasswordChange?: Timestamp;
    failedLoginAttempts: number;
    lastFailedLogin?: Timestamp;
    accountLocked?: boolean;
    lockExpiresAt?: Timestamp;
    twoFactorEnabled: boolean;
    backupCodes?: string[];
  };
}
```

### FirestoreTeam

Interface para times de competição:

```typescript
interface FirestoreTeam {
  id: string;
  nome: string;
  captainId: string;
  atletas: string[];
  status: 'incomplete' | 'complete' | 'confirmado' | 'cancelado';
  categoria: CategoriaCompeticao;
  lote: LoteInscricao;
  box: {
    nome: string;
    cidade: string;
    estado: string;
    coordenadas?: GeoPoint;
  };
  valorInscricao: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  confirmadoEm?: Timestamp;
  
  // Metadados
  metadata?: {
    source: 'app' | 'admin' | 'api';
    ipAddress?: string;
    userAgent?: string;
    referrer?: string;
  };
  
  // Competição
  competition?: {
    grupo?: string;
    chaveamento?: string;
    resultados?: Array<{
      prova: string;
      pontuacao: number;
      posicao?: number;
      tempo?: number;
    }>;
    classificacao?: {
      posicao: number;
      pontos: number;
      desempate?: number;
    };
  };
  
  // Pagamento
  payment?: {
    status: PaymentStatus;
    flowpayOrderId?: string;
    pixCode?: string;
    pixExpiration?: Timestamp;
    paidAt?: Timestamp;
    gateway: 'pix' | 'cartao' | 'cripto';
    installments?: number;
    discount?: number;
    discountCode?: string;
  };
}
```

## 🎮 Gamificação

### Sistema de $BOX

```typescript
const GAMIFICATION_POINTS: Record<GamificationAction, number> = {
  cadastro: 10,
  indicacao_confirmada: 50,
  compra_ingresso: 100,
  envio_conteudo: 75,
  qr_scan_evento: 25,
  prova_extra: 50,
  participacao_enquete: 15,
  acesso_spoiler: 20,
  checkin_evento: 30,
  compartilhamento: 10,
  login_diario: 5,
  completar_perfil: 25
};
```

### Níveis de Gamificação

```typescript
type GamificationLevel = 
  | 'iniciante'    // 0-99 $BOX
  | 'bronze'       // 100-299 $BOX
  | 'prata'        // 300-599 $BOX
  | 'ouro'         // 600-999 $BOX
  | 'platina'      // 1000-1999 $BOX
  | 'diamante'     // 2000+ $BOX;
```

### Cálculo de Nível

```typescript
export const calculateGamificationLevel = (points: number): GamificationLevel => {
  if (points >= 2000) return 'diamante';
  if (points >= 1000) return 'platina';
  if (points >= 600) return 'ouro';
  if (points >= 300) return 'prata';
  if (points >= 100) return 'bronze';
  return 'iniciante';
};
```

## 🔧 Utilitários

### Validação de Tipos

```typescript
// Validação de roles de usuário
export const isValidUserRole = (role: string): role is UserRole => {
  return ['publico', 'fotografo', 'videomaker', 'patrocinador', 'apoio', 'judge', 'atleta', 'admin'].includes(role);
};

// Validação de status de pagamento
export const isValidPaymentStatus = (status: string): status is PaymentStatus => {
  return ['pending', 'paid', 'failed', 'refunded', 'expired'].includes(status);
};

// Validação de ações de gamificação
export const isValidGamificationAction = (action: string): action is GamificationAction => {
  return [
    'cadastro', 'indicacao_confirmada', 'compra_ingresso', 'envio_conteudo',
    'qr_scan_evento', 'prova_extra', 'participacao_enquete', 'acesso_spoiler',
    'checkin_evento', 'compartilhamento', 'login_diario', 'completar_perfil'
  ].includes(action);
};
```

### Validação de Dados

```typescript
// Validação de dados de usuário
export const validateUserData = (data: Partial<FirestoreUser>): string[] => {
  const errors: string[] = [];
  
  if (data.email && !data.email.includes('@')) {
    errors.push('Email inválido');
  }
  
  if (data.role && !isValidUserRole(data.role)) {
    errors.push('Tipo de usuário inválido');
  }
  
  if (data.gamification?.points && data.gamification.points < 0) {
    errors.push('$BOX não podem ser negativos');
  }
  
  return errors;
};

// Validação de dados de time
export const validateTeamData = (data: Partial<FirestoreTeam>): string[] => {
  const errors: string[] = [];
  
  if (data.nome && data.nome.length < 2) {
    errors.push('Nome do time deve ter pelo menos 2 caracteres');
  }
  
  if (data.atletas && data.atletas.length > 10) {
    errors.push('Time não pode ter mais de 10 atletas');
  }
  
  if (data.valorInscricao && data.valorInscricao < 0) {
    errors.push('Valor de inscrição não pode ser negativo');
  }
  
  return errors;
};
```

### Funções Utilitárias

```typescript
// Criação de timestamp
export const createTimestamp = (): Timestamp => {
  const now = new Date();
  return {
    seconds: Math.floor(now.getTime() / 1000),
    nanoseconds: (now.getTime() % 1000) * 1000000
  };
};

// Conversão timestamp para Date
export const timestampToDate = (timestamp: Timestamp): Date => {
  return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
};

// Conversão Date para timestamp
export const dateToTimestamp = (date: Date): Timestamp => {
  return {
    seconds: Math.floor(date.getTime() / 1000),
    nanoseconds: (date.getTime() % 1000) * 1000000
  };
};

// Cálculo de $BOX para ação
export const calculatePointsForAction = (action: GamificationAction, metadata?: Record<string, any>): number => {
  const basePoints = GAMIFICATION_POINTS[action];
  
  if (metadata?.multiplier) {
    return Math.floor(basePoints * metadata.multiplier);
  }
  
  return basePoints;
};

// Geração de código de referência
export const generateReferralCode = (userId: string): string => {
  const prefix = 'REF';
  const suffix = userId.substring(0, 8).toUpperCase();
  return `${prefix}${suffix}`;
};
```

### Sanitização de Dados

```typescript
// Sanitização de dados de usuário
export const sanitizeUserData = (data: any): Partial<FirestoreUser> => {
  return {
    ...data,
    email: data.email?.toLowerCase().trim(),
    displayName: data.displayName?.trim(),
    phone: data.phone?.replace(/\D/g, ''),
    isActive: data.isActive ?? true
  };
};

// Sanitização de dados de time
export const sanitizeTeamData = (data: any): Partial<FirestoreTeam> => {
  return {
    ...data,
    nome: data.nome?.trim(),
    box: data.box ? {
      ...data.box,
      nome: data.box.nome?.trim(),
      cidade: data.box.cidade?.trim(),
      estado: data.box.estado?.trim()
    } : undefined
  };
};
```

## 📊 Dashboard e Métricas

### DashboardMetrics

```typescript
interface DashboardMetrics {
  // Participantes & Times
  totalTimes: number;
  timesPorCategoria: Record<CategoriaCompeticao, number>;
  timesPendentesPagamento: number;
  atletasConfirmados: number;
  atletasPorCategoria: Record<CategoriaCompeticao, number>;
  rankingPorLote: Record<LoteInscricao, number>;
  dadosPorBox: Array<{
    nome: string;
    cidade: string;
    estado: string;
    times: number;
    atletas: number;
    faturamento: number;
  }>;
  
  // Financeiro e Vendas
  faturamentoTotal: number;
  receitaPorLote: Record<LoteInscricao, number>;
  receitaPorCategoria: Record<CategoriaCompeticao, number>;
  upsellsVendidos: Record<UpsellTipo, number>;
  ticketMedioPorTime: number;
  receitaPorGateway: Record<'pix' | 'cartao' | 'cripto', number>;
  
  // Gamificação
  gamification?: {
    totalUsers: number;
    activeUsers: number;
    totalPoints: number;
    averagePoints: number;
    topUsers: Array<{
      userId: string;
      userName: string;
      points: number;
      level: GamificationLevel;
    }>;
    achievementsUnlocked: number;
    rewardsRedeemed: number;
    engagementRate: number;
  };
}
```

## 🔍 Queries e Filtros

### QueryFilters

```typescript
interface QueryFilters {
  // Filtros gerais
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
  
  // Filtros de usuário
  userRole?: UserRole;
  isActive?: boolean;
  createdAfter?: Timestamp;
  createdBefore?: Timestamp;
  
  // Filtros de time
  teamStatus?: 'incomplete' | 'complete' | 'confirmado' | 'cancelado';
  teamCategoria?: CategoriaCompeticao;
  teamLote?: LoteInscricao;
  
  // Filtros de pagamento
  paymentStatus?: PaymentStatus;
  paymentGateway?: 'pix' | 'cartao' | 'cripto';
  
  // Filtros de audiovisual
  audiovisualStatus?: ApprovalStatus;
  audiovisualTipo?: AudiovisualTipo;
  
  // Filtros de gamificação
  gamificationLevel?: GamificationLevel;
  minPoints?: number;
  maxPoints?: number;
  
  // Filtros de data
  dateRange?: {
    start: Timestamp;
    end: Timestamp;
  };
}
```

## 🚀 Cloud Functions

### Tipos para Cloud Functions

```typescript
// Criação de pedido PIX
export interface CriarPedidoPIXData {
  userId: string;
  userEmail: string;
  userName: string;
  tipo: 'ingresso' | 'kit' | 'premium';
  quantidade: number;
  valorUnitario: number;
}

// Validação de audiovisual
export interface ValidaAudiovisualData {
  audiovisualId: string;
  adminId: string;
  aprovado: boolean;
  motivoRejeicao?: string;
}

// Email de confirmação
export interface EmailConfirmacaoData {
  userEmail: string;
  userName: string;
  tipo: 'pedido' | 'audiovisual' | 'admin';
  dadosAdicionais?: Record<string, any>;
}

// Ação de gamificação
export interface GamificationActionData {
  userId: string;
  userEmail: string;
  userName: string;
  action: GamificationAction;
  points: number;
  description: string;
  metadata?: Record<string, any>;
}
```

## 📝 Uso Prático

### Exemplo de Criação de Usuário

```typescript
import { 
  FirestoreUser, 
  createTimestamp, 
  validateUserData, 
  sanitizeUserData,
  calculateGamificationLevel 
} from './types/firestore';

const createUser = (userData: Partial<FirestoreUser>): FirestoreUser => {
  // Sanitizar dados
  const sanitizedData = sanitizeUserData(userData);
  
  // Validar dados
  const errors = validateUserData(sanitizedData);
  if (errors.length > 0) {
    throw new Error(`Erro de validação: ${errors.join(', ')}`);
  }
  
  // Criar timestamp
  const now = createTimestamp();
  
  // Criar usuário com gamificação
  const user: FirestoreUser = {
    uid: sanitizedData.uid!,
    email: sanitizedData.email!,
    displayName: sanitizedData.displayName,
    photoURL: sanitizedData.photoURL,
    role: sanitizedData.role || 'publico',
    phone: sanitizedData.phone,
    createdAt: now,
    updatedAt: now,
    isActive: true,
    gamification: {
      points: 10, // $BOX por cadastro
      level: 'iniciante',
      totalActions: 1,
      lastActionAt: now,
      achievements: [],
      rewards: [],
      streakDays: 0,
      referrals: [],
      referralPoints: 0,
      weeklyPoints: 10,
      monthlyPoints: 10,
      yearlyPoints: 10,
      bestStreak: 0,
      badges: [],
      challenges: []
    }
  };
  
  return user;
};
```

### Exemplo de Ação de Gamificação

```typescript
import { 
  GamificationAction, 
  calculatePointsForAction,
  calculateGamificationLevel,
  createTimestamp 
} from './types/firestore';

const processGamificationAction = (
  userId: string,
  action: GamificationAction,
  metadata?: Record<string, any>
) => {
  // Calcular $BOX
  const points = calculatePointsForAction(action, metadata);
  
  // Atualizar usuário
  const userRef = db.collection('users').doc(userId);
  
  return db.runTransaction(async (transaction) => {
    const userDoc = await transaction.get(userRef);
    const userData = userDoc.data() as FirestoreUser;
    
    if (!userData) {
      throw new Error('Usuário não encontrado');
    }
    
    const currentPoints = userData.gamification?.points || 0;
    const newPoints = currentPoints + points;
    const newLevel = calculateGamificationLevel(newPoints);
    const now = createTimestamp();
    
    // Atualizar gamificação
    const updatedGamification = {
      ...userData.gamification,
      points: newPoints,
      level: newLevel,
      totalActions: (userData.gamification?.totalActions || 0) + 1,
      lastActionAt: now,
      weeklyPoints: (userData.gamification?.weeklyPoints || 0) + points,
      monthlyPoints: (userData.gamification?.monthlyPoints || 0) + points,
      yearlyPoints: (userData.gamification?.yearlyPoints || 0) + points
    };
    
    // Registrar ação
    const actionRef = db.collection('gamification_actions').doc();
    const actionData = {
      id: actionRef.id,
      userId,
      userEmail: userData.email,
      userName: userData.displayName || 'Usuário',
      action,
      points,
      description: `Ação: ${action}`,
      metadata,
      createdAt: now,
      processed: true,
      processedAt: now,
      retryCount: 0
    };
    
    transaction.update(userRef, {
      gamification: updatedGamification,
      updatedAt: now
    });
    
    transaction.set(actionRef, actionData);
    
    return {
      points,
      newTotal: newPoints,
      newLevel,
      actionId: actionRef.id
    };
  });
};
```

## 🔒 Segurança

### Regras de Validação

1. **Validação de Tipos**: Sempre use as funções de validação antes de salvar dados
2. **Sanitização**: Sempre sanitize dados de entrada
3. **Timestamps**: Use as funções utilitárias para criar timestamps
4. **Gamificação**: Valide $BOX e níveis antes de atualizar
5. **Permissões**: Verifique roles de usuário antes de operações sensíveis

### Boas Práticas

1. **Type Safety**: Use TypeScript strict mode
2. **Validação**: Sempre valide dados antes de salvar
3. **Transações**: Use transações para operações complexas
4. **Logs**: Registre todas as ações administrativas
5. **Backup**: Mantenha backups regulares dos dados

## 📚 Recursos Adicionais

- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)
- [Firestore Best Practices](https://firebase.google.com/docs/firestore/best-practices)

---

**Desenvolvido para o App Fenix** 🚀 