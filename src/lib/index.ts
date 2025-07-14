// App constants
export const APP_NAME = 'Cerrado App';
export const APP_DESCRIPTION = 'Plataforma para eventos fotográficos no Cerrado';

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  ADMIN: '/admin',
  INVESTIDORES: '/investidores',
  FOTOGRAFO: '/fotografo',
} as const;

// Firebase collections
export const COLLECTIONS = {
  USERS: 'users',
  EVENTS: 'events',
  PHOTOGRAPHERS: 'photographers',
  INVESTORS: 'investors',
  PAYMENTS: 'payments',
} as const;

// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  FOTOGRAFO: 'fotografo',
  INVESTIDOR: 'investidor',
} as const;

// Event status
export const EVENT_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  CANCELLED: 'cancelled',
} as const;

// Payment status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const;

// Photographer status
export const PHOTOGRAPHER_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

// Investor status
export const INVESTOR_STATUS = {
  PENDING: 'pending',
  CONTACTED: 'contacted',
  INTERESTED: 'interested',
  NOT_INTERESTED: 'not_interested',
} as const; 