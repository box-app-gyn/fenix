import * as functions from 'firebase-functions';
/**
 * Endpoint principal do dashboard - retorna todas as estatísticas
 */
export declare const getDashboardStats: functions.HttpsFunction & functions.Runnable<any>;
/**
 * Endpoint para dados de usuários
 */
export declare const getUsersData: functions.HttpsFunction & functions.Runnable<any>;
/**
 * Endpoint para dados de times
 */
export declare const getTeamsData: functions.HttpsFunction & functions.Runnable<any>;
/**
 * Endpoint para dados de audiovisual
 */
export declare const getAudiovisualData: functions.HttpsFunction & functions.Runnable<any>;
/**
 * Endpoint para dados de pedidos
 */
export declare const getOrdersData: functions.HttpsFunction & functions.Runnable<any>;
/**
 * Endpoint para dados de gamificação
 */
export declare const getGamificationData: functions.HttpsFunction & functions.Runnable<any>;
/**
 * Endpoint para atualizar dados em tempo real
 */
export declare const updateRealtimeData: functions.HttpsFunction & functions.Runnable<any>;
/**
 * Endpoint para sincronizar dados das coleções
 */
export declare const syncCollectionsData: functions.HttpsFunction & functions.Runnable<any>;
//# sourceMappingURL=dashboard-api.d.ts.map