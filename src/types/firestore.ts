import { Timestamp as FirebaseTimestamp } from 'firebase/firestore';

// ============================================================================
// TIPOS BASE E ENUMS
// ============================================================================

// Tipos de usuário
export type UserRole =
  | 'publico'
  | 'atleta'
  | 'jurado'
  | 'midia'
  | 'fotografo'
  | 'admin'
  | 'patrocinador'
  | 'apoio'
  | 'espectador'
  | 'judge';

// Status de pagamento
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'expired';

// Status de aprovação
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'under_review';

// Status de convite
export type ConviteStatus = 'pendente' | 'aceito' | 'recusado' | 'cancelado' | 'expirado';

// Tipos de audiovisual
export type AudiovisualTipo = 'fotografo' | 'videomaker' | 'editor' | 'drone' | 'audio' | 'iluminacao';

// Categorias de competição
export type CategoriaCompeticao = 'Scale' | 'RX' | 'Elite';

// Lotes de inscrição
export type LoteInscricao = 'pre_venda' | 'primeiro' | 'segundo' | 'terceiro' | 'quarto' | 'quinto';

// Tipos de upsell
export type UpsellTipo = 'camiseta_extra' | 'kit_premium' | 'acesso_vip' | 'foto_profissional' | 'video_highlights' | 'recovery';

// Categorias de patrocinador
export type CategoriaPatrocinador = 'Ouro' | 'Prata' | 'Bronze' | 'Apoio' | 'Tecnologia' | 'Alimentação' | 'Equipamentos';

// Status de patrocinador
export type StatusPatrocinador = 'ativo' | 'pendente' | 'inativo' | 'cancelado';

// ============================================================================
// GAMIFICAÇÃO - TIPOS E ENUMS
// ============================================================================

// 🎯 GAMIFICAÇÃO CAMADA 1 - Tipos de ação que geram tokens $BOX
export type GamificationAction =
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

// Níveis de gamificação baseados em $BOX
export type GamificationLevel =
  | 'iniciante'    // 0-99 $BOX
  | 'bronze'       // 100-299 $BOX
  | 'prata'        // 300-599 $BOX
  | 'ouro'         // 600-999 $BOX
  | 'platina'      // 1000-1999 $BOX
  | 'diamante'     // 2000+ $BOX;

// Status de recompensa
export type RewardStatus = 'disponivel' | 'resgatada' | 'expirada';

// ============================================================================
// TIPOS AUXILIARES
// ============================================================================

// Alias para Timestamp do Firebase
export type Timestamp = FirebaseTimestamp;

// Geolocalização
export interface GeoPoint {
  latitude: number;
  longitude: number;
}

// Referência do Firestore
export interface DocumentReference {
  id: string;
  path: string;
}

// ============================================================================
// INTERFACES PRINCIPAIS
// ============================================================================

// Interface principal para usuários do sistema
export interface FirestoreUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  telefone?: string | null;
  whatsapp?: string | null;
  role: UserRole;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  // 🎯 GAMIFICAÇÃO - Sistema de Tokens $BOX
  gamification?: {
    tokens: {
      box: {
        balance: number;
        totalEarned: number;
        totalSpent: number;
        lastTransaction: Timestamp;
      };
    };
    level: string;
    totalActions: number;
    lastActionAt: Timestamp;
    achievements: string[];
    rewards: any[];
    streakDays: number;
    lastLoginStreak: Timestamp;
    referralCode: string;
    referrals: string[];
    referralTokens: number;
    weeklyTokens: number;
    monthlyTokens: number;
    yearlyTokens: number;
    bestStreak: number;
    badges: string[];
    challenges: any[];
  };
  // Campos adicionais para perfis
  box?: string;
  cidade?: string;
  categoria?: string;
  updatedBy?: string;
}

// Coleção: teams
export interface FirestoreTeam {
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
  // Campos adicionais para gestão
  metadata?: {
    source: 'app' | 'admin' | 'api';
    ipAddress?: string;
    userAgent?: string;
    referrer?: string;
  };
  // Campos para competição
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
  // Campos para pagamento
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

// Coleção: convites_times
export interface FirestoreConviteTime {
  id: string;
  teamId: string;
  teamName: string;
  captainId: string;
  captainName: string;
  captainEmail: string;
  invitedEmail: string;
  invitedName: string;
  status: ConviteStatus;
  createdAt: Timestamp;
  expiresAt: Timestamp;
  respondedAt?: Timestamp;
  respondedBy?: string;
  canceledAt?: Timestamp;
  canceledBy?: string;
  createdBy: string;
  ipAddress: string;
  // Campos adicionais
  metadata?: {
    userAgent?: string;
    referrer?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
  };
  // Notificações
  notifications?: {
    emailSent: boolean;
    emailSentAt?: Timestamp;
    reminderSent: boolean;
    reminderSentAt?: Timestamp;
    smsSent?: boolean;
    smsSentAt?: Timestamp;
  };
}

// Coleção: pedidos
export interface FirestorePedido {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  teamId?: string;
  tipo: 'ingresso' | 'kit' | 'premium' | UpsellTipo;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  status: PaymentStatus;
  lote: LoteInscricao;
  categoria?: CategoriaCompeticao;
  flowpayOrderId?: string;
  pixCode?: string;
  pixExpiration?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  pagamentoConfirmado?: Timestamp;
  webhookData?: Record<string, any>;
  gateway: 'pix' | 'cartao' | 'cripto';
  // Campos adicionais
  metadata?: {
    source: 'app' | 'admin' | 'api';
    ipAddress?: string;
    userAgent?: string;
    referrer?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
  };
  // Campos para gestão financeira
  financial?: {
    discount?: number;
    discountCode?: string;
    tax?: number;
    fee?: number;
    netAmount: number;
    installments?: number;
    installmentValue?: number;
    nextPayment?: Timestamp;
  };
  // Campos para entrega
  delivery?: {
    address?: {
      street: string;
      number: string;
      complement?: string;
      neighborhood: string;
      city: string;
      state: string;
      zipCode: string;
    };
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'returned';
    trackingCode?: string;
    shippedAt?: Timestamp;
    deliveredAt?: Timestamp;
  };
  // Campos para reembolso
  refund?: {
    requestedAt?: Timestamp;
    processedAt?: Timestamp;
    amount: number;
    reason?: string;
    status: 'pending' | 'approved' | 'rejected' | 'processed';
  };
}

// Coleção: audiovisual
export interface FirestoreAudiovisual {
  id: string;
  userId: string;
  userEmail: string;
  nome: string;
  telefone: string;
  tipo: AudiovisualTipo;
  portfolio: {
    urls: string[];
    descricao: string;
    experiencia: string;
    equipamentos: string[];
    especialidades: string[];
  };
  termosAceitos: boolean;
  termosAceitosEm: Timestamp;
  status: ApprovalStatus;
  aprovadoPor?: string;
  aprovadoEm?: Timestamp;
  rejeitadoPor?: string;
  rejeitadoEm?: Timestamp;
  motivoRejeicao?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  // Campos adicionais
  metadata?: {
    source: 'app' | 'admin' | 'api';
    ipAddress?: string;
    userAgent?: string;
    referrer?: string;
  };
  // Campos para credenciamento
  credentials?: {
    badgeId?: string;
    badgePrinted?: boolean;
    badgePrintedAt?: Timestamp;
    accessLevel: 'basic' | 'premium' | 'vip';
    areas: string[];
    schedule?: Array<{
      date: string;
      startTime: string;
      endTime: string;
      area: string;
    }>;
  };
  // Campos para pagamento
  payment?: {
    required: boolean;
    amount?: number;
    status?: PaymentStatus;
    paidAt?: Timestamp;
    flowpayOrderId?: string;
  };
  // Campos para comunicação
  communication?: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    whatsappNotifications: boolean;
    lastContactAt?: Timestamp;
    notes?: string[];
  };
}

// Coleção: patrocinadores
export interface FirestorePatrocinador {
  id: string;
  nome: string;
  nomeFantasia?: string;
  categoria: CategoriaPatrocinador;
  status: StatusPatrocinador;
  valorPatrocinio: number;
  logoUrl?: string;
  website?: string;
  email: string;
  telefone: string;
  contato: {
    nome: string;
    cargo: string;
    email: string;
    telefone: string;
  };
  beneficios: {
    descricao: string;
    itens: string[];
    valorEstimado: number;
  };
  contrato: {
    numero?: string;
    dataInicio: Timestamp;
    dataFim: Timestamp;
    valorTotal: number;
    parcelas: number;
    valorParcela: number;
    proximoVencimento?: Timestamp;
  };
  pagamentos: Array<{
    parcela: number;
    valor: number;
    vencimento: Timestamp;
    status: PaymentStatus;
    pagoEm?: Timestamp;
    comprovante?: string;
  }>;
  observacoes?: string;
  criadoPor: string;
  criadoEm: Timestamp;
  atualizadoEm: Timestamp;
  ativadoEm?: Timestamp;
  ativadoPor?: string;
  // Campos adicionais
  metadata?: {
    source: 'app' | 'admin' | 'api';
    ipAddress?: string;
    userAgent?: string;
    referrer?: string;
  };
  // Campos para marketing
  marketing?: {
    socialMedia?: {
      instagram?: string;
      facebook?: string;
      linkedin?: string;
      twitter?: string;
    };
    pressKit?: {
      logo: string;
      description: string;
      images: string[];
      videos: string[];
    };
    booth?: {
      size: string;
      location: string;
      requirements: string[];
    };
  };
  // Campos para compliance
  compliance?: {
    documents: Array<{
      type: string;
      url: string;
      uploadedAt: Timestamp;
      approved: boolean;
      approvedAt?: Timestamp;
      approvedBy?: string;
    }>;
    termsAccepted: boolean;
    termsAcceptedAt?: Timestamp;
    privacyAccepted: boolean;
    privacyAcceptedAt?: Timestamp;
  };
}

// Coleção: adminLogs
export interface FirestoreAdminLog {
  id: string;
  adminId: string;
  adminEmail: string;
  acao: 'validacao_audiovisual' | 'aprovacao_audiovisual' | 'rejeicao_audiovisual' | 'criacao_pedido' | 'confirmacao_pagamento' | 'criacao_time' | 'edicao_usuario' | 'exclusao_registro' | 'configuracao_sistema';
  targetId: string; // ID do usuário/audiovisual/pedido afetado
  targetType: 'user' | 'audiovisual' | 'pedido' | 'team' | 'patrocinador' | 'system';
  detalhes: Record<string, any>;
  createdAt: Timestamp;
  ipAddress?: string;
  userAgent?: string;
  // Campos adicionais
  metadata?: {
    sessionId?: string;
    requestId?: string;
    responseTime?: number;
    error?: string;
  };
  // Campos para auditoria
  audit?: {
    before?: Record<string, any>;
    after?: Record<string, any>;
    changes?: Array<{
      field: string;
      oldValue: any;
      newValue: any;
    }>;
  };
}

// ============================================================================
// GAMIFICAÇÃO - INTERFACES ESPECÍFICAS
// ============================================================================

// Coleção: gamification_actions
export interface FirestoreGamificationAction {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  action: GamificationAction;
  points: number;
  description: string;
  metadata?: Record<string, any>;
  createdAt: Timestamp;
  processed: boolean;
  processedAt?: Timestamp;
  // Campos adicionais
  batchId?: string;                    // Para processamento em lote
  retryCount: number;                  // Contador de tentativas
  error?: string;                      // Erro se houver
  // Campos para validação
  validation?: {
    isValid: boolean;
    validatedAt?: Timestamp;
    validatedBy?: string;
    notes?: string;
  };
}

// Coleção: gamification_leaderboard
export interface FirestoreGamificationLeaderboard {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  userPhotoURL?: string;
  userRole: UserRole;
  points: number;
  level: GamificationLevel;
  totalActions: number;
  streakDays: number;
  lastActionAt: Timestamp;
  position: number;                    // Posição no ranking
  previousPosition?: number;           // Posição anterior
  createdAt: Timestamp;
  updatedAt: Timestamp;
  // Campos adicionais
  weeklyPoints: number;                // Pontos da semana
  monthlyPoints: number;               // Pontos do mês
  yearlyPoints: number;                // Pontos do ano
  // Campos para ranking específico
  rankings?: {
    weekly?: number;
    monthly?: number;
    yearly?: number;
    allTime?: number;
  };
  // Campos para badges
  badges: string[];
  // Campos para desafios
  activeChallenges: Array<{
    id: string;
    progress: number;
    target: number;
    expiresAt: Timestamp;
  }>;
}

// Coleção: gamification_rewards
export interface FirestoreGamificationReward {
  id: string;
  title: string;
  description: string;
  type: 'spoiler' | 'enquete' | 'destaque' | 'acesso_vip' | 'conteudo_exclusivo' | 'badge' | 'desconto' | 'item_fisico';
  requiredPoints: number;
  requiredLevel: GamificationLevel;
  maxRedemptions?: number;             // Máximo de resgates (null = ilimitado)
  currentRedemptions: number;          // Resgates atuais
  isActive: boolean;
  expiresAt?: Timestamp;
  metadata?: {
    content?: string;                  // Conteúdo da recompensa
    imageURL?: string;                 // Imagem da recompensa
    externalLink?: string;             // Link externo
    instructions?: string;             // Instruções para resgate
    // Campos específicos por tipo
    badge?: {
      icon: string;
      color: string;
      rarity: 'common' | 'rare' | 'epic' | 'legendary';
    };
    discount?: {
      percentage: number;
      maxValue?: number;
      validFor: string[];
    };
    physicalItem?: {
      name: string;
      description: string;
      shippingRequired: boolean;
      weight?: number;
      dimensions?: {
        length: number;
        width: number;
        height: number;
      };
    };
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
  // Campos para gestão
  management?: {
    createdBy: string;
    approvedBy?: string;
    approvedAt?: Timestamp;
    notes?: string;
  };
  // Campos para analytics
  analytics?: {
    views: number;
    clicks: number;
    redemptions: number;
    conversionRate: number;
  };
}

// Coleção: gamification_user_rewards
export interface FirestoreGamificationUserReward {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  rewardId: string;
  rewardTitle: string;
  rewardType: string;
  status: RewardStatus;
  redeemedAt: Timestamp;
  expiresAt?: Timestamp;
  usedAt?: Timestamp;
  metadata?: Record<string, any>;
  // Campos adicionais
  pointsSpent: number;                 // Pontos gastos no resgate
  // Campos para itens físicos
  shipping?: {
    address: {
      street: string;
      number: string;
      complement?: string;
      neighborhood: string;
      city: string;
      state: string;
      zipCode: string;
    };
    status: 'pending' | 'processing' | 'shipped' | 'delivered';
    trackingCode?: string;
    shippedAt?: Timestamp;
    deliveredAt?: Timestamp;
  };
  // Campos para validação
  validation?: {
    validated: boolean;
    validatedAt?: Timestamp;
    validatedBy?: string;
    notes?: string;
  };
}

// Coleção: gamification_achievements
export interface FirestoreGamificationAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;                        // Emoji ou ícone
  requiredPoints?: number;
  requiredActions?: {
    action: GamificationAction;
    count: number;
  }[];
  requiredLevel?: GamificationLevel;
  isSecret: boolean;                   // Conquista secreta
  isActive: boolean;
  createdAt: Timestamp;
  // Campos adicionais
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  pointsReward: number;                // Pontos ganhos ao desbloquear
  // Campos para progresso
  progress?: {
    totalUsers: number;
    unlockedUsers: number;
    unlockRate: number;
  };
  // Campos para gestão
  management?: {
    createdBy: string;
    approvedBy?: string;
    approvedAt?: Timestamp;
    notes?: string;
  };
}

// Coleção: gamification_community_highlights
export interface FirestoreGamificationCommunityHighlight {
  id: string;
  title: string;
  subtitle: string;
  type: 'top_scorers' | 'new_achievements' | 'milestone_reached' | 'community_event' | 'weekly_winners' | 'monthly_winners';
  users: Array<{
    userId: string;
    userName: string;
    userPhotoURL?: string;
    points: number;
    achievement?: string;
    position?: number;
  }>;
  isActive: boolean;
  expiresAt: Timestamp;
  createdAt: Timestamp;
  // Campos adicionais
  metadata?: {
    imageURL?: string;
    externalLink?: string;
    description?: string;
  };
  // Campos para analytics
  analytics?: {
    views: number;
    clicks: number;
    shares: number;
    engagement: number;
  };
}

// ============================================================================
// TIPOS PARA DASHBOARD E MÉTRICAS
// ============================================================================

// Tipos para Dashboard Admin
export interface DashboardMetrics {
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

  // Audiovisual
  audiovisual?: {
    totalSubmissions: number;
    pendingApproval: number;
    approved: number;
    rejected: number;
    byType: Record<AudiovisualTipo, number>;
  };

  // Patrocinadores
  patrocinadores?: {
    total: number;
    active: number;
    pending: number;
    totalValue: number;
    byCategory: Record<CategoriaPatrocinador, number>;
  };
}

// ============================================================================
// TIPOS PARA CLOUD FUNCTIONS
// ============================================================================

export interface CriarPedidoPIXData {
  userId: string;
  userEmail: string;
  userName: string;
  tipo: 'ingresso' | 'kit' | 'premium';
  quantidade: number;
  valorUnitario: number;
}

export interface ValidaAudiovisualData {
  audiovisualId: string;
  adminId: string;
  aprovado: boolean;
  motivoRejeicao?: string;
}

export interface EmailConfirmacaoData {
  userEmail: string;
  userName: string;
  tipo: 'pedido' | 'audiovisual' | 'admin';
  dadosAdicionais?: Record<string, any>;
}

// Tipos para funções de times
export interface ConviteTimeData {
  teamId: string;
  teamName: string;
  captainId: string;
  captainName: string;
  invitedEmail: string;
  invitedName?: string;
}

export interface RespostaConviteData {
  conviteId: string;
  resposta: 'aceito' | 'recusado';
  userId: string;
  userName: string;
}

// Tipos para gamificação
export interface GamificationActionData {
  userId: string;
  userEmail: string;
  userName: string;
  action: GamificationAction;
  points: number;
  description: string;
  metadata?: Record<string, any>;
}

export interface RewardRedemptionData {
  userId: string;
  userEmail: string;
  userName: string;
  rewardId: string;
  rewardTitle: string;
  rewardType: string;
  pointsSpent: number;
}

// ============================================================================
// UTILITÁRIOS E VALIDAÇÕES
// ============================================================================

// Validação de tipos
export const isValidUserRole = (role: string): role is UserRole => {
  return ['publico', 'fotografo', 'videomaker', 'patrocinador', 'apoio', 'judge', 'atleta', 'admin'].includes(role);
};

export const isValidPaymentStatus = (status: string): status is PaymentStatus => {
  return ['pending', 'paid', 'failed', 'refunded', 'expired'].includes(status);
};

export const isValidGamificationAction = (action: string): action is GamificationAction => {
  return [
    'cadastro', 'indicacao_confirmada', 'compra_ingresso', 'envio_conteudo',
    'qr_scan_evento', 'prova_extra', 'participacao_enquete', 'acesso_spoiler',
    'checkin_evento', 'compartilhamento', 'login_diario', 'completar_perfil',
  ].includes(action);
};

export const isValidGamificationLevel = (level: string): level is GamificationLevel => {
  return ['iniciante', 'bronze', 'prata', 'ouro', 'platina', 'diamante'].includes(level);
};

// 🎯 Cálculo de tokens $BOX por ação
export const GAMIFICATION_TOKENS: Record<GamificationAction, number> = {
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
  completar_perfil: 25,
};

// Alias para compatibilidade (deprecated)
export const GAMIFICATION_POINTS = GAMIFICATION_TOKENS;

// 🎯 Cálculo de nível baseado em tokens $BOX
export const calculateGamificationLevel = (tokens: number): GamificationLevel => {
  if (tokens >= 2000) return 'diamante';
  if (tokens >= 1000) return 'platina';
  if (tokens >= 600) return 'ouro';
  if (tokens >= 300) return 'prata';
  if (tokens >= 100) return 'bronze';
  return 'iniciante';
};

// Validação de dados
export const validateUserData = (data: Partial<FirestoreUser>): string[] => {
  const errors: string[] = [];

  if (data.email && !data.email.includes('@')) {
    errors.push('Email inválido');
  }

  if (data.role && !isValidUserRole(data.role)) {
    errors.push('Tipo de usuário inválido');
  }

  if (data.gamification?.tokens?.box?.balance && data.gamification.tokens.box.balance < 0) {
    errors.push('Tokens não podem ser negativos');
  }

  return errors;
};

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

// Funções utilitárias
export const createTimestamp = (): Timestamp => {
  return FirebaseTimestamp.now();
};

export const timestampToDate = (timestamp: Timestamp): Date => {
  return timestamp.toDate();
};

export const dateToTimestamp = (date: Date): Timestamp => {
  return FirebaseTimestamp.fromDate(date);
};

// 🎯 Funções para gamificação com tokens $BOX
export const calculateTokensForAction = (action: GamificationAction, metadata?: Record<string, any>): number => {
  const baseTokens = GAMIFICATION_TOKENS[action];

  // Multiplicadores baseados em metadata
  if (metadata?.multiplier) {
    return Math.floor(baseTokens * metadata.multiplier);
  }

  return baseTokens;
};

// Alias para compatibilidade (deprecated)
export const calculatePointsForAction = calculateTokensForAction;

export const generateReferralCode = (userId: string): string => {
  const prefix = 'REF';
  const suffix = userId.substring(0, 8).toUpperCase();
  return `${prefix}${suffix}`;
};

// Funções para validação de dados
export const sanitizeUserData = (data: any): Partial<FirestoreUser> => {
  return {
    ...data,
    email: data.email?.toLowerCase().trim(),
    displayName: data.displayName?.trim(),
    phone: data.phone?.replace(/\D/g, ''),
    isActive: data.isActive ?? true,
  };
};

export const sanitizeTeamData = (data: any): Partial<FirestoreTeam> => {
  return {
    ...data,
    nome: data.nome?.trim(),
    box: data.box ? {
      ...data.box,
      nome: data.box.nome?.trim(),
      cidade: data.box.cidade?.trim(),
      estado: data.box.estado?.trim(),
    } : undefined,
  };
};

export const validateAudiovisualData = (data: Partial<FirestoreAudiovisual>): string[] => {
  const errors: string[] = [];

  if (!data.nome?.trim()) {
    errors.push('Nome é obrigatório');
  }

  if (!data.userEmail?.trim()) {
    errors.push('Email é obrigatório');
  } else if (!data.userEmail.includes('@')) {
    errors.push('Email inválido');
  }

  if (!data.telefone?.trim()) {
    errors.push('Telefone é obrigatório');
  }

  if (!data.tipo) {
    errors.push('Tipo de audiovisual é obrigatório');
  } else if (!['fotografo', 'videomaker', 'editor', 'drone', 'audio', 'iluminacao'].includes(data.tipo)) {
    errors.push('Tipo de audiovisual inválido');
  }

  if (!data.portfolio?.urls?.length) {
    errors.push('Pelo menos um link do portfólio é obrigatório');
  }

  if (!data.portfolio?.experiencia?.trim()) {
    errors.push('Experiência é obrigatória');
  }

  if (!data.portfolio?.equipamentos?.length) {
    errors.push('Pelo menos um equipamento é obrigatório');
  }

  if (!data.portfolio?.especialidades?.length) {
    errors.push('Pelo menos uma especialidade é obrigatória');
  }

  return errors;
};

export const sanitizeAudiovisualData = (data: any): any => {
  return {
    ...data,
    nome: data.nome?.trim(),
    email: data.email?.toLowerCase().trim(),
    telefone: data.telefone?.replace(/\D/g, ''),
    cidade: data.cidade?.trim(),
    estado: data.estado?.trim(),
    experiencia: data.experiencia?.trim(),
    portfolio: data.portfolio?.trim(),
    equipamentos: data.equipamentos?.trim(),
    especialidades: data.especialidades?.trim(),
    disponibilidade: data.disponibilidade?.trim(),
    motivacao: data.motivacao?.trim(),
  };
};

// ============================================================================
// TIPOS PARA QUERIES E FILTROS
// ============================================================================

export interface QueryFilters {
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

// ============================================================================
// TIPOS PARA RELATÓRIOS
// ============================================================================

export interface ReportData {
  id: string;
  type: 'users' | 'teams' | 'payments' | 'audiovisual' | 'gamification' | 'patrocinadores';
  filters: QueryFilters;
  data: any[];
  generatedAt: Timestamp;
  generatedBy: string;
  expiresAt: Timestamp;
  downloadUrl?: string;
}

// ============================================================================
// EXPORT DEFAULT
// ============================================================================

// Exporta apenas as funções utilitárias como valores
export default {
  // Funções utilitárias
  isValidUserRole,
  isValidPaymentStatus,
  isValidGamificationAction,
  isValidGamificationLevel,
  calculateGamificationLevel,
  validateUserData,
  validateTeamData,
  validateAudiovisualData,
  createTimestamp,
  timestampToDate,
  dateToTimestamp,
  calculatePointsForAction,
  generateReferralCode,
  sanitizeUserData,
  sanitizeTeamData,
  sanitizeAudiovisualData,

  // Constantes
  GAMIFICATION_POINTS,
};
