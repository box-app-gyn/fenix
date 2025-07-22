// Utils index - Centraliza exports para evitar chunk vazio
export * from './analyticsUtils';
export * from './cacheUtils';
export * from './createInitialLinks';
export * from './loadUtils';
export * from './logger';
export * from './offlineGamification';
export * from './pwaUtils';
export * from './seedConfigData';
export * from './seedData';
export * from './storage';

// Re-export específico para evitar conflitos
export { clearCacheAndReload, forceReload } from './clearCache'; 