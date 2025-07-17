"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncCollectionsData = exports.updateRealtimeData = exports.getGamificationData = exports.getOrdersData = exports.getAudiovisualData = exports.getTeamsData = exports.getUsersData = exports.getDashboardStats = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = require("firebase-admin");
if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();
const logger_1 = require("../utils/logger");
// ============================================================================
// FUNÇÕES AUXILIARES
// ============================================================================
/**
 * Verifica se o usuário é admin
 */
function isAdmin(auth) {
    return auth.token.admin === true || auth.token.role === 'admin';
}
/**
 * Verifica se o usuário tem permissão para acessar o dashboard
 */
function hasDashboardAccess(auth) {
    return auth.token.admin === true ||
        auth.token.role === 'admin' ||
        auth.token.role === 'dev' ||
        auth.token.role === 'marketing';
}
/**
 * Calcula estatísticas de usuários
 */
async function calculateUserStats() {
    const usersSnapshot = await db.collection('users').get();
    const now = admin.firestore.Timestamp.now();
    const oneDayAgo = new Date(now.toDate().getTime() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.toDate().getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.toDate().getTime() - 30 * 24 * 60 * 60 * 1000);
    let total = 0;
    let active = 0;
    let newToday = 0;
    let newWeek = 0;
    let newMonth = 0;
    const byRole = {};
    usersSnapshot.forEach(doc => {
        var _a;
        const userData = doc.data();
        total++;
        if (userData.isActive)
            active++;
        const createdAt = (_a = userData.createdAt) === null || _a === void 0 ? void 0 : _a.toDate();
        if (createdAt) {
            if (createdAt >= oneDayAgo)
                newToday++;
            if (createdAt >= oneWeekAgo)
                newWeek++;
            if (createdAt >= oneMonthAgo)
                newMonth++;
        }
        const role = userData.role || 'user';
        byRole[role] = (byRole[role] || 0) + 1;
    });
    return {
        total,
        active,
        newToday,
        newWeek,
        newMonth,
        byRole
    };
}
/**
 * Calcula estatísticas de times
 */
async function calculateTeamStats() {
    const teamsSnapshot = await db.collection('teams').get();
    let total = 0;
    let confirmed = 0;
    let pending = 0;
    const byCategory = {};
    const byLote = {};
    teamsSnapshot.forEach(doc => {
        const teamData = doc.data();
        total++;
        if (teamData.status === 'confirmado')
            confirmed++;
        else if (teamData.status === 'incomplete' || teamData.status === 'complete')
            pending++;
        const categoria = teamData.categoria || 'N/A';
        byCategory[categoria] = (byCategory[categoria] || 0) + 1;
        const lote = teamData.lote || 'N/A';
        byLote[lote] = (byLote[lote] || 0) + 1;
    });
    return {
        total,
        confirmed,
        pending,
        byCategory,
        byLote
    };
}
/**
 * Calcula estatísticas de audiovisual
 */
async function calculateAudiovisualStats() {
    const audiovisualSnapshot = await db.collection('audiovisual').get();
    let total = 0;
    let approved = 0;
    let pending = 0;
    let rejected = 0;
    const byType = {};
    audiovisualSnapshot.forEach(doc => {
        const audiovisualData = doc.data();
        total++;
        switch (audiovisualData.status) {
            case 'aprovado':
                approved++;
                break;
            case 'pendente':
                pending++;
                break;
            case 'rejeitado':
                rejected++;
                break;
        }
        const tipo = audiovisualData.tipo || 'N/A';
        byType[tipo] = (byType[tipo] || 0) + 1;
    });
    return {
        total,
        approved,
        pending,
        rejected,
        byType
    };
}
/**
 * Calcula estatísticas financeiras
 */
async function calculateFinancialStats() {
    const ordersSnapshot = await db.collection('pedidos').get();
    let totalRevenue = 0;
    let totalOrders = 0;
    const byStatus = {};
    const byGateway = {};
    ordersSnapshot.forEach(doc => {
        const orderData = doc.data();
        totalOrders++;
        if (orderData.status === 'pago') {
            totalRevenue += orderData.valorTotal || 0;
        }
        const status = orderData.status || 'N/A';
        byStatus[status] = (byStatus[status] || 0) + 1;
        const gateway = orderData.gateway || 'N/A';
        byGateway[gateway] = (byGateway[gateway] || 0) + 1;
    });
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    return {
        totalRevenue,
        totalOrders,
        averageOrderValue,
        byStatus,
        byGateway
    };
}
/**
 * Calcula estatísticas de gamificação
 */
async function calculateGamificationStats() {
    var _a, _b, _c, _d, _e, _f;
    const configDoc = await db.collection('config').doc('tempo_real').get();
    const configData = configDoc.data();
    return {
        totalTokens: ((_a = configData === null || configData === void 0 ? void 0 : configData.boxTokens) === null || _a === void 0 ? void 0 : _a.circulatingSupply) || 0,
        totalHolders: ((_c = (_b = configData === null || configData === void 0 ? void 0 : configData.boxTokens) === null || _b === void 0 ? void 0 : _b.topHolders) === null || _c === void 0 ? void 0 : _c.length) || 0,
        averageBalance: ((_d = configData === null || configData === void 0 ? void 0 : configData.boxTokens) === null || _d === void 0 ? void 0 : _d.averageBalance) || 0,
        totalActions: ((_e = configData === null || configData === void 0 ? void 0 : configData.actions) === null || _e === void 0 ? void 0 : _e.totalActions) || 0,
        totalAchievements: ((_f = configData === null || configData === void 0 ? void 0 : configData.achievements) === null || _f === void 0 ? void 0 : _f.totalAchievements) || 0
    };
}
/**
 * Obtém dados em tempo real
 */
async function getRealtimeData() {
    var _a, _b, _c, _d;
    const configDoc = await db.collection('config').doc('tempo_real').get();
    const configData = configDoc.data();
    return {
        onlineUsers: ((_a = configData === null || configData === void 0 ? void 0 : configData.realtime) === null || _a === void 0 ? void 0 : _a.onlineUsers) || 0,
        activeSessions: ((_b = configData === null || configData === void 0 ? void 0 : configData.realtime) === null || _b === void 0 ? void 0 : _b.activeSessions) || 0,
        peakUsers: ((_c = configData === null || configData === void 0 ? void 0 : configData.realtime) === null || _c === void 0 ? void 0 : _c.peakUsers) || 0,
        lastUpdate: ((_d = configData === null || configData === void 0 ? void 0 : configData.realtime) === null || _d === void 0 ? void 0 : _d.lastUpdate) || admin.firestore.Timestamp.now()
    };
}
// ============================================================================
// ENDPOINTS DA API
// ============================================================================
/**
 * Endpoint principal do dashboard - retorna todas as estatísticas
 */
exports.getDashboardStats = functions.https.onCall(async (data, context) => {
    var _a;
    try {
        // Verificar autenticação
        if (!context.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'Usuário não autenticado');
        }
        // Verificar permissões
        if (!hasDashboardAccess(context.auth)) {
            throw new functions.https.HttpsError('permission-denied', 'Acesso negado');
        }
        logger_1.logger.info('Calculando estatísticas do dashboard', { userId: context.auth.uid });
        // Calcular todas as estatísticas em paralelo
        const [userStats, teamStats, audiovisualStats, financialStats, gamificationStats, realtimeData] = await Promise.all([
            calculateUserStats(),
            calculateTeamStats(),
            calculateAudiovisualStats(),
            calculateFinancialStats(),
            calculateGamificationStats(),
            getRealtimeData()
        ]);
        const dashboardStats = {
            users: userStats,
            teams: teamStats,
            audiovisual: audiovisualStats,
            financial: financialStats,
            gamification: gamificationStats,
            realtime: realtimeData
        };
        logger_1.logger.info('Estatísticas calculadas com sucesso', {
            userId: context.auth.uid,
            stats: {
                totalUsers: userStats.total,
                totalTeams: teamStats.total,
                totalRevenue: financialStats.totalRevenue
            }
        });
        return { success: true, data: dashboardStats };
    }
    catch (error) {
        logger_1.logger.error('Erro ao calcular estatísticas do dashboard', {
            userId: (_a = context.auth) === null || _a === void 0 ? void 0 : _a.uid,
            error: error instanceof Error ? error.message : 'Erro desconhecido'
        });
        throw new functions.https.HttpsError('internal', 'Erro interno do servidor');
    }
});
/**
 * Endpoint para dados de usuários
 */
exports.getUsersData = functions.https.onCall(async (data, context) => {
    try {
        if (!context.auth || !hasDashboardAccess(context.auth)) {
            throw new functions.https.HttpsError('permission-denied', 'Acesso negado');
        }
        const { limit = 50, offset = 0, role, status } = data;
        let query = db.collection('users').orderBy('createdAt', 'desc');
        if (role) {
            query = query.where('role', '==', role);
        }
        if (status === 'active') {
            query = query.where('isActive', '==', true);
        }
        else if (status === 'inactive') {
            query = query.where('isActive', '==', false);
        }
        const snapshot = await query.limit(limit).offset(offset).get();
        const users = snapshot.docs.map(doc => (Object.assign({ uid: doc.id }, doc.data())));
        return { success: true, data: users, total: users.length };
    }
    catch (error) {
        logger_1.logger.error('Erro ao buscar dados de usuários', { error });
        throw new functions.https.HttpsError('internal', 'Erro interno do servidor');
    }
});
/**
 * Endpoint para dados de times
 */
exports.getTeamsData = functions.https.onCall(async (data, context) => {
    try {
        if (!context.auth || !hasDashboardAccess(context.auth)) {
            throw new functions.https.HttpsError('permission-denied', 'Acesso negado');
        }
        const { limit = 50, offset = 0, status, categoria } = data;
        let query = db.collection('teams').orderBy('createdAt', 'desc');
        if (status) {
            query = query.where('status', '==', status);
        }
        if (categoria) {
            query = query.where('categoria', '==', categoria);
        }
        const snapshot = await query.limit(limit).offset(offset).get();
        const teams = snapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
        return { success: true, data: teams, total: teams.length };
    }
    catch (error) {
        logger_1.logger.error('Erro ao buscar dados de times', { error });
        throw new functions.https.HttpsError('internal', 'Erro interno do servidor');
    }
});
/**
 * Endpoint para dados de audiovisual
 */
exports.getAudiovisualData = functions.https.onCall(async (data, context) => {
    try {
        if (!context.auth || !hasDashboardAccess(context.auth)) {
            throw new functions.https.HttpsError('permission-denied', 'Acesso negado');
        }
        const { limit = 50, offset = 0, status, tipo } = data;
        let query = db.collection('audiovisual').orderBy('createdAt', 'desc');
        if (status) {
            query = query.where('status', '==', status);
        }
        if (tipo) {
            query = query.where('tipo', '==', tipo);
        }
        const snapshot = await query.limit(limit).offset(offset).get();
        const audiovisual = snapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
        return { success: true, data: audiovisual, total: audiovisual.length };
    }
    catch (error) {
        logger_1.logger.error('Erro ao buscar dados de audiovisual', { error });
        throw new functions.https.HttpsError('internal', 'Erro interno do servidor');
    }
});
/**
 * Endpoint para dados de pedidos
 */
exports.getOrdersData = functions.https.onCall(async (data, context) => {
    try {
        if (!context.auth || !hasDashboardAccess(context.auth)) {
            throw new functions.https.HttpsError('permission-denied', 'Acesso negado');
        }
        const { limit = 50, offset = 0, status, gateway } = data;
        let query = db.collection('pedidos').orderBy('createdAt', 'desc');
        if (status) {
            query = query.where('status', '==', status);
        }
        if (gateway) {
            query = query.where('gateway', '==', gateway);
        }
        const snapshot = await query.limit(limit).offset(offset).get();
        const orders = snapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
        return { success: true, data: orders, total: orders.length };
    }
    catch (error) {
        logger_1.logger.error('Erro ao buscar dados de pedidos', { error });
        throw new functions.https.HttpsError('internal', 'Erro interno do servidor');
    }
});
/**
 * Endpoint para dados de gamificação
 */
exports.getGamificationData = functions.https.onCall(async (data, context) => {
    try {
        if (!context.auth || !hasDashboardAccess(context.auth)) {
            throw new functions.https.HttpsError('permission-denied', 'Acesso negado');
        }
        const configDoc = await db.collection('config').doc('tempo_real').get();
        const configData = configDoc.data();
        const gamificationData = {
            tokens: (configData === null || configData === void 0 ? void 0 : configData.boxTokens) || {},
            actions: (configData === null || configData === void 0 ? void 0 : configData.actions) || {},
            achievements: (configData === null || configData === void 0 ? void 0 : configData.achievements) || {},
            leaderboard: (configData === null || configData === void 0 ? void 0 : configData.leaderboard) || {},
            referrals: (configData === null || configData === void 0 ? void 0 : configData.referrals) || {}
        };
        return { success: true, data: gamificationData };
    }
    catch (error) {
        logger_1.logger.error('Erro ao buscar dados de gamificação', { error });
        throw new functions.https.HttpsError('internal', 'Erro interno do servidor');
    }
});
/**
 * Endpoint para atualizar dados em tempo real
 */
exports.updateRealtimeData = functions.https.onCall(async (data, context) => {
    try {
        if (!context.auth || !isAdmin(context.auth)) {
            throw new functions.https.HttpsError('permission-denied', 'Apenas admins podem atualizar dados');
        }
        const { path, value } = data;
        if (!path || value === undefined) {
            throw new functions.https.HttpsError('invalid-argument', 'Path e value são obrigatórios');
        }
        const updateData = {};
        updateData[path] = value;
        updateData.updatedAt = admin.firestore.FieldValue.serverTimestamp();
        await db.collection('config').doc('tempo_real').update(updateData);
        logger_1.logger.info('Dados em tempo real atualizados', {
            userId: context.auth.uid,
            path,
            value
        });
        return { success: true, message: 'Dados atualizados com sucesso' };
    }
    catch (error) {
        logger_1.logger.error('Erro ao atualizar dados em tempo real', { error });
        throw new functions.https.HttpsError('internal', 'Erro interno do servidor');
    }
});
/**
 * Endpoint para sincronizar dados das coleções
 */
exports.syncCollectionsData = functions.https.onCall(async (data, context) => {
    try {
        if (!context.auth || !isAdmin(context.auth)) {
            throw new functions.https.HttpsError('permission-denied', 'Apenas admins podem sincronizar dados');
        }
        logger_1.logger.info('Iniciando sincronização de dados', { userId: context.auth.uid });
        // Sincronizar dados de usuários
        const usersSnapshot = await db.collection('users').get();
        const totalUsers = usersSnapshot.size;
        // Sincronizar dados de times
        const teamsSnapshot = await db.collection('teams').get();
        const totalTimes = teamsSnapshot.size;
        // Sincronizar dados de audiovisual
        const audiovisualSnapshot = await db.collection('audiovisual').get();
        const totalFotografos = audiovisualSnapshot.size;
        const aprovadosFotografos = audiovisualSnapshot.docs.filter(doc => doc.data().status === 'aprovado').length;
        // Atualizar dados sincronizados
        await db.collection('config').doc('tempo_real').update({
            'stats.totalUsers': totalUsers,
            'ingressos.totalTimes': totalTimes,
            'fotografos.total': totalFotografos,
            'fotografos.aprovados': aprovadosFotografos,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        logger_1.logger.info('Sincronização concluída', {
            userId: context.auth.uid,
            totalUsers,
            totalTimes,
            totalFotografos,
            aprovadosFotografos
        });
        return {
            success: true,
            message: 'Dados sincronizados com sucesso',
            data: {
                totalUsers,
                totalTimes,
                totalFotografos,
                aprovadosFotografos
            }
        };
    }
    catch (error) {
        logger_1.logger.error('Erro ao sincronizar dados', { error });
        throw new functions.https.HttpsError('internal', 'Erro interno do servidor');
    }
});
//# sourceMappingURL=dashboard-api.js.map