// Tipos de usuário
export interface User {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export interface UserData {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  telefone?: string;
  whatsapp?: string;
  box: string;
  categoria: 'atleta' | 'jurado' | 'midia' | 'espectador';
  cidade: string;
  mensagem?: string;
  role: 'publico' | 'atleta' | 'jurado' | 'midia' | 'admin' | 'marketing';
  isActive: boolean;
  profileComplete: boolean;
  experiencia?: string;
  objetivos?: string;
  createdAt: any;
  updatedAt: any;
}

// Tipos de time
export interface Team {
  id: string;
  nome: string;
  categoria: string;
  cidade: string;
  box: string;
  membros: string[];
  lider: string;
  status: 'ativo' | 'inativo' | 'pendente';
  createdAt: any;
  updatedAt: any;
}

// Tipos de configuração
export interface Config {
  id: string;
  ingressos: {
    status: 'em_breve' | 'disponivel' | 'esgotado';
    dataAbertura?: string;
    loteAtual?: number;
    vagasRestantes?: number;
  };
  indicacoes: {
    total: number;
    hoje: number;
  };
  fotografos: {
    total: number;
    aprovados: number;
  };
  xp: {
    total: number;
    media: number;
  };
}

// Tipos de audiovisual
export interface AudiovisualSubmission {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  titulo: string;
  descricao: string;
  categoria: 'foto' | 'video' | 'artigo';
  urlArquivo: string;
  urlThumbnail?: string;
  status: 'pendente' | 'aprovado' | 'rejeitado';
  feedback?: string;
  createdAt: any;
  updatedAt: any;
}

// Tipos de gamificação
export interface LeaderboardEntry {
  id: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  xp: number;
  level: number;
  rank: number;
  achievements: string[];
  lastActivity: any;
}

// Tipos de evento
export interface Event {
  id: string;
  nome: string;
  data: string;
  local: string;
  descricao: string;
  status: 'agendado' | 'em_andamento' | 'finalizado' | 'cancelado';
  participantes: string[];
  maxParticipantes: number;
  categoria: string;
  createdAt: any;
  updatedAt: any;
}

// Tipos de notificação
export interface Notification {
  id: string;
  userId: string;
  titulo: string;
  mensagem: string;
  tipo: 'info' | 'success' | 'warning' | 'error';
  lida: boolean;
  createdAt: any;
}

// Tipos de analytics
export interface Analytics {
  pageViews: number;
  uniqueVisitors: number;
  sessionDuration: number;
  bounceRate: number;
  topPages: Array<{
    path: string;
    views: number;
  }>;
  topReferrers: Array<{
    source: string;
    visits: number;
  }>;
}

// Tipos de formulário
export interface FormData {
  nome: string;
  email: string;
  telefone?: string;
  whatsapp?: string;
  box: string;
  categoria: string;
  cidade: string;
  mensagem?: string;
  experiencia?: string;
  objetivos?: string;
}

// Tipos de validação
export interface ValidationError {
  field: string;
  message: string;
}

// Tipos de resposta da API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Tipos de paginação
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Tipos de filtros
export interface Filters {
  categoria?: string;
  cidade?: string;
  status?: string;
  dataInicio?: string;
  dataFim?: string;
  search?: string;
}

// Tipos de ordenação
export interface Sort {
  field: string;
  direction: 'asc' | 'desc';
}

// Tipos de configuração do app
export interface AppConfig {
  name: string;
  version: string;
  environment: 'development' | 'staging' | 'production';
  features: {
    gamification: boolean;
    audiovisual: boolean;
    realtime: boolean;
    admin: boolean;
  };
  limits: {
    maxFileSize: number;
    maxUploads: number;
    maxTeamMembers: number;
  };
} 