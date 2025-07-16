// Tipos para o sistema de encurtamento de links do App Fenix

export interface ShortLink {
  id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  title?: string;
  description?: string;
  tags?: string[];
  category?: 'evento' | 'ingresso' | 'comunidade' | 'midia' | 'admin' | 'outro';
  isActive: boolean;
  isPublic: boolean;
  clickCount: number;
  uniqueVisitors: number;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
  createdBy: string;
  metadata?: {
    userAgent?: string;
    referrer?: string;
    ipAddress?: string;
    country?: string;
    device?: 'mobile' | 'desktop' | 'tablet';
  };
  analytics?: {
    totalClicks: number;
    clicksByDate: Record<string, number>;
    clicksByHour: Record<string, number>;
    clicksByDevice: Record<string, number>;
    clicksByCountry: Record<string, number>;
    lastClickedAt?: Date;
  };
}

export interface ShortLinkCreate {
  originalUrl: string;
  title?: string;
  description?: string;
  tags?: string[];
  category?: ShortLink['category'];
  isPublic?: boolean;
  expiresAt?: Date;
  customCode?: string;
}

export interface ShortLinkUpdate {
  title?: string;
  description?: string;
  tags?: string[];
  category?: ShortLink['category'];
  isActive?: boolean;
  isPublic?: boolean;
  expiresAt?: Date;
}

export interface ShortLinkClick {
  id: string;
  shortLinkId: string;
  clickedAt: Date;
  userAgent?: string;
  referrer?: string;
  ipAddress?: string;
  country?: string;
  device?: 'mobile' | 'desktop' | 'tablet';
  userId?: string;
  sessionId?: string;
}

export interface ShortLinkStats {
  totalLinks: number;
  totalClicks: number;
  activeLinks: number;
  expiredLinks: number;
  topLinks: Array<{
    id: string;
    title: string;
    clicks: number;
    shortUrl: string;
  }>;
  clicksByCategory: Record<string, number>;
  clicksByDate: Record<string, number>;
}

// Constantes para validação
export const LINK_CONSTRAINTS = {
  MAX_TITLE_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500,
  MAX_TAGS_COUNT: 10,
  MAX_TAG_LENGTH: 30,
  MIN_SHORT_CODE_LENGTH: 4,
  MAX_SHORT_CODE_LENGTH: 20,
  MAX_CUSTOM_CODE_LENGTH: 20,
  MAX_URL_LENGTH: 2048,
  ALLOWED_CATEGORIES: ['evento', 'ingresso', 'comunidade', 'midia', 'admin', 'outro'] as const,
  RESERVED_CODES: [
    'admin', 'api', 'auth', 'login', 'logout', 'register', 'profile',
    'dashboard', 'settings', 'help', 'about', 'contact', 'privacy',
    'terms', 'faq', 'support', 'docs', 'blog', 'news', 'events',
    'hub', 'tempo-real', 'leaderboard', 'audiovisual', 'sobre',
  ] as const,
  FORBIDDEN_CHARS: /[^a-zA-Z0-9-_]/g,
  VALID_CHARS: /^[a-zA-Z0-9-_]+$/,
} as const;

// Funções utilitárias para validação
export const validateShortLink = (data: ShortLinkCreate): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Validar URL original
  if (!data.originalUrl) {
    errors.push('URL original é obrigatória');
  } else if (!isValidUrl(data.originalUrl)) {
    errors.push('URL original inválida');
  } else if (data.originalUrl.length > LINK_CONSTRAINTS.MAX_URL_LENGTH) {
    errors.push(`URL muito longa (máximo ${LINK_CONSTRAINTS.MAX_URL_LENGTH} caracteres)`);
  }

  // Validar título
  if (data.title && data.title.length > LINK_CONSTRAINTS.MAX_TITLE_LENGTH) {
    errors.push(`Título muito longo (máximo ${LINK_CONSTRAINTS.MAX_TITLE_LENGTH} caracteres)`);
  }

  // Validar descrição
  if (data.description && data.description.length > LINK_CONSTRAINTS.MAX_DESCRIPTION_LENGTH) {
    errors.push(`Descrição muito longa (máximo ${LINK_CONSTRAINTS.MAX_DESCRIPTION_LENGTH} caracteres)`);
  }

  // Validar tags
  if (data.tags) {
    if (data.tags.length > LINK_CONSTRAINTS.MAX_TAGS_COUNT) {
      errors.push(`Muitas tags (máximo ${LINK_CONSTRAINTS.MAX_TAGS_COUNT})`);
    }

    for (const tag of data.tags) {
      if (tag.length > LINK_CONSTRAINTS.MAX_TAG_LENGTH) {
        errors.push(`Tag muito longa: ${tag} (máximo ${LINK_CONSTRAINTS.MAX_TAG_LENGTH} caracteres)`);
      }
    }
  }

  // Validar categoria
  if (data.category && !LINK_CONSTRAINTS.ALLOWED_CATEGORIES.includes(data.category)) {
    errors.push(`Categoria inválida: ${data.category}`);
  }

  // Validar código customizado
  if (data.customCode) {
    if (data.customCode.length < LINK_CONSTRAINTS.MIN_SHORT_CODE_LENGTH) {
      errors.push(`Código muito curto (mínimo ${LINK_CONSTRAINTS.MIN_SHORT_CODE_LENGTH} caracteres)`);
    }

    if (data.customCode.length > LINK_CONSTRAINTS.MAX_CUSTOM_CODE_LENGTH) {
      errors.push(`Código muito longo (máximo ${LINK_CONSTRAINTS.MAX_CUSTOM_CODE_LENGTH} caracteres)`);
    }

    if (!LINK_CONSTRAINTS.VALID_CHARS.test(data.customCode)) {
      errors.push('Código contém caracteres inválidos (use apenas letras, números, hífen e underscore)');
    }

    if (LINK_CONSTRAINTS.RESERVED_CODES.includes(data.customCode.toLowerCase() as any)) {
      errors.push(`Código reservado: ${data.customCode}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Função para validar URL
export const isValidUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

// Função para sanitizar dados
export const sanitizeShortLinkData = (data: ShortLinkCreate): ShortLinkCreate => {
  return {
    ...data,
    title: data.title?.trim().slice(0, LINK_CONSTRAINTS.MAX_TITLE_LENGTH),
    description: data.description?.trim().slice(0, LINK_CONSTRAINTS.MAX_DESCRIPTION_LENGTH),
    tags: data.tags?.map((tag) => tag.trim().slice(0, LINK_CONSTRAINTS.MAX_TAG_LENGTH)).filter(Boolean),
    customCode: data.customCode?.toLowerCase().replace(LINK_CONSTRAINTS.FORBIDDEN_CHARS, ''),
  };
};

// Função para gerar código curto único
export const generateShortCode = (length: number = 6): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
};

// Função para gerar URL curta
export const generateShortUrl = (shortCode: string, baseUrl: string = window.location.origin): string => {
  return `${baseUrl}/l/${shortCode}`;
};

// Função para extrair código da URL
export const extractShortCode = (url: string): string | null => {
  const match = url.match(/\/l\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : null;
};

// Função para detectar dispositivo
export const detectDevice = (userAgent: string): 'mobile' | 'desktop' | 'tablet' => {
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  const tabletRegex = /iPad|Android(?=.*\bMobile\b)(?=.*\bSafari\b)/i;

  if (tabletRegex.test(userAgent)) return 'tablet';
  if (mobileRegex.test(userAgent)) return 'mobile';
  return 'desktop';
};

// Função para obter país do IP (mock - em produção usar serviço real)
export const getCountryFromIP = async (ip: string): Promise<string> => {
  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await response.json();
    return data.country_code || 'UNKNOWN';
  } catch {
    return 'UNKNOWN';
  }
};

// Função para calcular estatísticas
export const calculateLinkStats = (clicks: ShortLinkClick[]): ShortLink['analytics'] => {
  const stats: ShortLink['analytics'] = {
    totalClicks: clicks.length,
    clicksByDate: {},
    clicksByHour: {},
    clicksByDevice: {},
    clicksByCountry: {},
    lastClickedAt: clicks.length > 0 ? clicks[clicks.length - 1].clickedAt : undefined,
  };

  clicks.forEach((click) => {
    const date = click.clickedAt.toISOString().split('T')[0];
    const hour = click.clickedAt.getHours().toString().padStart(2, '0');
    const device = click.device || 'unknown';
    const country = click.country || 'unknown';

    stats.clicksByDate[date] = (stats.clicksByDate[date] || 0) + 1;
    stats.clicksByHour[hour] = (stats.clicksByHour[hour] || 0) + 1;
    stats.clicksByDevice[device] = (stats.clicksByDevice[device] || 0) + 1;
    stats.clicksByCountry[country] = (stats.clicksByCountry[country] || 0) + 1;
  });

  return stats;
};

// Função para verificar se link expirou
export const isLinkExpired = (link: ShortLink): boolean => {
  if (!link.expiresAt) return false;
  return new Date() > link.expiresAt;
};

// Função para verificar se link está ativo
export const isLinkActive = (link: ShortLink): boolean => {
  return link.isActive && !isLinkExpired(link);
};

// Função para formatar estatísticas para exibição
export const formatLinkStats = (stats: ShortLink['analytics'] | undefined): {
  totalClicks: string;
  todayClicks: string;
  topDevice: string;
  topCountry: string;
} => {
  if (!stats) {
    return {
      totalClicks: '0',
      todayClicks: '0',
      topDevice: 'N/A',
      topCountry: 'N/A',
    };
  }

  const today = new Date().toISOString().split('T')[0];
  const todayClicks = stats.clicksByDate[today] || 0;

  const topDevice = Object.entries(stats.clicksByDevice)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A';

  const topCountry = Object.entries(stats.clicksByCountry)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A';

  return {
    totalClicks: stats.totalClicks.toLocaleString('pt-BR'),
    todayClicks: todayClicks.toLocaleString('pt-BR'),
    topDevice,
    topCountry,
  };
};
