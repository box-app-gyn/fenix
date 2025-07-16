// ============================================================================
// TIPOS PARA TOKEN $BOX (BEP-20)
// ============================================================================

import { Timestamp } from 'firebase/firestore';

// Interface para o token $BOX
export interface BoxToken {
  // Informações básicas do token
  symbol: 'BOX';
  name: 'Cerrado Interbox Token';
  decimals: 18;
  totalSupply: number;
  circulatingSupply: number;
  burnedTokens: number;

  // Informações da blockchain
  network: 'BSC';
  chainId: 56;
  contractAddress: '0xBc972E10Df612C7d65054BC67aBCA96B3C22a017';

  // Métricas de mercado (simuladas)
  marketCap: number;
  price: number;
  volume24h: number;
  priceChange24h: number;

  // Timestamps
  lastUpdated: Timestamp;
  createdAt: Timestamp;
}

// Interface para saldo de usuário
export interface UserBoxBalance {
  userId: string;
  userEmail: string;
  userName: string;

  // Saldo atual
  balance: number;
  totalEarned: number;
  totalSpent: number;

  // Métricas de tempo
  weeklyEarned: number;
  monthlyEarned: number;
  yearlyEarned: number;

  // Histórico
  lastTransaction: Timestamp;
  lastActionAt: Timestamp;

  // Status
  isActive: boolean;
  isLocked: boolean;
  lockReason?: string;
}

// Interface para transações
export interface BoxTransaction {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;

  // Detalhes da transação
  type: 'earn' | 'spend' | 'transfer' | 'burn' | 'mint';
  amount: number;
  balance: number; // Saldo após transação

  // Metadados
  action: string;
  description: string;
  metadata?: Record<string, any>;

  // Timestamps
  createdAt: Timestamp;
  processedAt: Timestamp;

  // Status
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  error?: string;

  // Para transações on-chain (futuro)
  txHash?: string;
  blockNumber?: number;
  gasUsed?: number;
}

// Interface para distribuição de tokens
export interface TokenDistribution {
  id: string;
  action: string;
  amount: number;
  recipients: number;
  totalDistributed: number;

  // Configuração
  maxRecipients?: number;
  minAmount: number;
  maxAmount: number;

  // Status
  isActive: boolean;
  startDate: Timestamp;
  endDate?: Timestamp;

  // Métricas
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Interface para configurações do token
export interface TokenConfig {
  // Configurações de distribuição
  distribution: {
    cadastro: number;           // 10 $BOX
    indicacao_confirmada: number; // 50 $BOX
    compra_ingresso: number;    // 100 $BOX
    envio_conteudo: number;     // 75 $BOX
    qr_scan_evento: number;     // 25 $BOX
    prova_extra: number;        // 50 $BOX
    participacao_enquete: number; // 15 $BOX
    acesso_spoiler: number;     // 20 $BOX
    checkin_evento: number;     // 30 $BOX
    compartilhamento: number;   // 10 $BOX
    login_diario: number;       // 5 $BOX
    completar_perfil: number;   // 25 $BOX
  };

  // Limites e restrições
  limits: {
    maxDailyEarnings: number;
    maxWeeklyEarnings: number;
    maxMonthlyEarnings: number;
    minTransactionAmount: number;
    maxTransactionAmount: number;
  };

  // Configurações de nível
  levels: {
    iniciante: { min: 0, max: 99 };
    bronze: { min: 100, max: 299 };
    prata: { min: 300, max: 599 };
    ouro: { min: 600, max: 999 };
    platina: { min: 1000, max: 1999 };
    diamante: { min: 2000, max: 999999 };
  };

  // Timestamps
  updatedAt: Timestamp;
  updatedBy: string;
}

// Constantes do token
export const BOX_TOKEN_CONSTANTS = {
  SYMBOL: 'BOX',
  NAME: 'Cerrado Interbox Token',
  DECIMALS: 18,
  NETWORK: 'BSC',
  CHAIN_ID: 56,
  CONTRACT_ADDRESS: '0xBc972E10Df612C7d65054BC67aBCA96B3C22a017',

  // URLs
  EXPLORER_URL: 'https://bscscan.com/token/0xBc972E10Df612C7d65054BC67aBCA96B3C22a017',
  CHART_URL: 'https://dexscreener.com/bsc/0xBc972E10Df612C7d65054BC67aBCA96B3C22a017',

  // Configurações padrão
  DEFAULT_DISTRIBUTION: {
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
  },
} as const;

// Tipos de ação que geram tokens
export type TokenAction = keyof typeof BOX_TOKEN_CONSTANTS.DEFAULT_DISTRIBUTION;

// Função para calcular tokens por ação
export const calculateTokensForAction = (action: TokenAction, metadata?: Record<string, any>): number => {
  const baseAmount = BOX_TOKEN_CONSTANTS.DEFAULT_DISTRIBUTION[action];

  // Multiplicadores baseados em metadata
  if (metadata?.multiplier) {
    return Math.floor(baseAmount * metadata.multiplier);
  }

  return baseAmount;
};

// Função para validar endereço de contrato
export const isValidContractAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

// Função para formatar saldo
export const formatBoxBalance = (balance: number, decimals: number = 2): string => {
  return `${balance.toLocaleString('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  })} $BOX`;
};

// Função para calcular market cap
export const calculateMarketCap = (circulatingSupply: number, price: number): number => {
  return circulatingSupply * price;
};
