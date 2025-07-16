// Constantes de segurança centralizadas

export const SECURITY_CONSTANTS = {
  // Rate Limiting
  RATE_LIMIT: {
    WINDOW_MS: 60000, // 1 minuto
    MAX_REQUESTS_PER_WINDOW: 100,
    MAX_REQUESTS_PER_IP: 50,
    BLOCK_DURATION_MS: 300000, // 5 minutos
  },

  // Autenticação
  AUTH: {
    SESSION_TIMEOUT_MS: 3600000, // 1 hora
    REFRESH_TOKEN_EXPIRY_MS: 604800000, // 7 dias
    MAX_LOGIN_ATTEMPTS: 5,
    LOCKOUT_DURATION_MS: 900000, // 15 minutos
    PASSWORD_MIN_LENGTH: 8,
    PASSWORD_MAX_LENGTH: 128,
    PASSWORD_REQUIREMENTS: {
      UPPERCASE: true,
      LOWERCASE: true,
      NUMBERS: true,
      SPECIAL_CHARS: true,
    },
  },

  // Validação de dados
  VALIDATION: {
    MAX_STRING_LENGTH: 1000,
    MAX_EMAIL_LENGTH: 254,
    MAX_URL_LENGTH: 2048,
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
    MAX_ARRAY_LENGTH: 100,
    MAX_OBJECT_DEPTH: 5,
  },

  // Headers de segurança
  SECURITY_HEADERS: {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  },

  // Content Security Policy
  CSP: {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      "'unsafe-eval'",
      "'unsafe-inline'",
      'https://www.googletagmanager.com',
      'https://www.google-analytics.com',
      'https://apis.google.com',
      'https://accounts.google.com',
      'https://firebase.googleapis.com',
      'https://www.gstatic.com'
    ],
    'style-src': [
      "'self'",
      "'unsafe-inline'",
      'https://fonts.googleapis.com',
    ],
    'font-src': [
      "'self'",
      'https://fonts.gstatic.com',
    ],
    'img-src': [
      "'self'",
      'data:',
      'https:',
      'blob:',
      'https://firebasestorage.googleapis.com',
    ],
    'connect-src': [
      "'self'",
      'https://api.flowpay.com.br',
      'https://www.google-analytics.com',
      'https://firestore.googleapis.com',
      'https://firebase.googleapis.com',
      'https://identitytoolkit.googleapis.com',
      'https://securetoken.googleapis.com',
      'https://accounts.google.com',
      'https://apis.google.com',
      'https://*.googleapis.com'
    ],
    'frame-src': [
      "'self'",
      'https://accounts.google.com',
      'https://*.firebaseapp.com',
      'https://firebaseapp.com'
    ],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'upgrade-insecure-requests': [],
  },

  // Domínios permitidos
  ALLOWED_DOMAINS: [
    'interbox.com.br',
    'www.interbox.com.br',
    'flowpay.com.br',
    'www.flowpay.com.br',
    'firebaseapp.com',
    'googleapis.com',
    'localhost',
  ],

  // User-Agents bloqueados
  BLOCKED_USER_AGENTS: [
    'bot',
    'crawler',
    'spider',
    'scraper',
    'curl',
    'wget',
    'python-requests',
    'python-urllib',
    'java-http-client',
    'go-http-client',
    'node-fetch',
    'axios',
  ],

  // Padrões suspeitos
  SUSPICIOUS_PATTERNS: [
    /\.\.\//, // Directory traversal
    /<script/i, // XSS
    /union\s+select/i, // SQL Injection
    /eval\s*\(/i, // Code injection
    /document\.cookie/i, // Cookie theft
    /javascript:/i, // JavaScript protocol
    /vbscript:/i, // VBScript protocol
    /data:text\/html/i, // Data URI HTML
    /on\w+\s*=/i, // Event handlers
    /expression\s*\(/i, // CSS expressions
    /import\s+url/i, // CSS import
    /@import/i, // CSS import
  ],

  // Rotas protegidas
  PROTECTED_ROUTES: [
    '/admin',
    '/api/admin',
    '/api/pedidos',
    '/api/fotografos',
    '/api/users',
    '/api/config',
  ],

  // Rotas públicas
  PUBLIC_ROUTES: [
    '/',
    '/sobre',
    '/beneficios',
    '/api/health',
    '/api/webhook',
  ],

  // Configurações de cache
  CACHE: {
    DEFAULT_TTL: 300, // 5 minutos
    MAX_SIZE: 1000,
    CLEANUP_INTERVAL: 60000, // 1 minuto
  },

  // Configurações de logging
  LOGGING: {
    LEVEL: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    MAX_LOG_SIZE: 10 * 1024 * 1024, // 10MB
    MAX_LOG_FILES: 5,
    ROTATION_INTERVAL: 24 * 60 * 60 * 1000, // 24 horas
  },

  // Configurações de monitoramento
  MONITORING: {
    ENABLE_METRICS: true,
    METRICS_INTERVAL: 60000, // 1 minuto
    ALERT_THRESHOLDS: {
      ERROR_RATE: 0.05, // 5%
      RESPONSE_TIME: 5000, // 5 segundos
      MEMORY_USAGE: 0.8, // 80%
      CPU_USAGE: 0.8, // 80%
    },
  },
} as const;

// Funções de segurança
export const SECURITY_UTILS = {
  // Verificar se string contém padrões suspeitos
  containsSuspiciousPattern: (input: string): boolean => {
    return SECURITY_CONSTANTS.SUSPICIOUS_PATTERNS.some(pattern => 
      pattern.test(input)
    );
  },

  // Sanitizar string
  sanitizeString: (input: string, maxLength: number = SECURITY_CONSTANTS.VALIDATION.MAX_STRING_LENGTH): string => {
    if (typeof input !== 'string') return '';
    
    return input
      .trim()
      .slice(0, maxLength)
      .replace(/[<>]/g, '')
      .replace(/javascript:/gi, '')
      .replace(/vbscript:/gi, '')
      .replace(/on\w+\s*=/gi, '');
  },

  // Validar email
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= SECURITY_CONSTANTS.VALIDATION.MAX_EMAIL_LENGTH;
  },

  // Validar URL
  isValidUrl: (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'https:' && 
             url.length <= SECURITY_CONSTANTS.VALIDATION.MAX_URL_LENGTH &&
             SECURITY_CONSTANTS.ALLOWED_DOMAINS.some(domain => 
               urlObj.hostname.endsWith(domain)
             );
    } catch {
      return false;
    }
  },

  // Validar senha
  isValidPassword: (password: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    const { PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH, PASSWORD_REQUIREMENTS } = SECURITY_CONSTANTS.AUTH;

    if (password.length < PASSWORD_MIN_LENGTH) {
      errors.push(`Senha deve ter pelo menos ${PASSWORD_MIN_LENGTH} caracteres`);
    }

    if (password.length > PASSWORD_MAX_LENGTH) {
      errors.push(`Senha não pode ter mais de ${PASSWORD_MAX_LENGTH} caracteres`);
    }

    if (PASSWORD_REQUIREMENTS.UPPERCASE && !/[A-Z]/.test(password)) {
      errors.push('Senha deve conter pelo menos uma letra maiúscula');
    }

    if (PASSWORD_REQUIREMENTS.LOWERCASE && !/[a-z]/.test(password)) {
      errors.push('Senha deve conter pelo menos uma letra minúscula');
    }

    if (PASSWORD_REQUIREMENTS.NUMBERS && !/\d/.test(password)) {
      errors.push('Senha deve conter pelo menos um número');
    }

    if (PASSWORD_REQUIREMENTS.SPECIAL_CHARS && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Senha deve conter pelo menos um caractere especial');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Gerar token seguro
  generateSecureToken: (length: number = 32): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },

  // Verificar se User-Agent é suspeito
  isSuspiciousUserAgent: (userAgent: string): boolean => {
    const lowerUA = userAgent.toLowerCase();
    return SECURITY_CONSTANTS.BLOCKED_USER_AGENTS.some(blocked => 
      lowerUA.includes(blocked)
    );
  },

  // Verificar se rota é protegida
  isProtectedRoute: (pathname: string): boolean => {
    return SECURITY_CONSTANTS.PROTECTED_ROUTES.some(route => 
      pathname.startsWith(route)
    );
  },

  // Verificar se rota é pública
  isPublicRoute: (pathname: string): boolean => {
    return SECURITY_CONSTANTS.PUBLIC_ROUTES.some(route => 
      pathname === route || pathname.startsWith(route)
    );
  },
} as const; 