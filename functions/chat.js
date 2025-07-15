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
exports.pollMessages = exports.createSession = exports.saveFeedback = exports.getChatHistory = exports.sendMessage = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const logger_1 = require("../utils/logger");
const db = admin.firestore();
exports.sendMessage = functions.https.onCall(async (data, context) => {
    var _a;
    const contextData = {
        functionName: 'sendMessage',
        userId: (_a = context.auth) === null || _a === void 0 ? void 0 : _a.uid
    };
    try {
        if (!context.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'Usuário não autenticado');
        }
        const { sessionId, message } = data;
        // Buscar dados do usuário
        const userDoc = await db.collection('users').doc(context.auth.uid).get();
        const userData = userDoc.data();
        const chatMessage = {
            userId: context.auth.uid,
            userName: (userData === null || userData === void 0 ? void 0 : userData.displayName) || (userData === null || userData === void 0 ? void 0 : userData.email) || 'Usuário',
            message,
            timestamp: admin.firestore.Timestamp.now(),
        };
        await db.collection('chat_sessions').doc(sessionId).collection('messages').add(chatMessage);
        return { success: true };
    }
    catch (error) {
        logger_1.logger.error('Erro ao enviar mensagem', { error: error.message }, contextData);
        throw error;
    }
});
exports.getChatHistory = functions.https.onCall(async (data, context) => {
    var _a;
    const contextData = {
        functionName: 'getChatHistory',
        userId: (_a = context.auth) === null || _a === void 0 ? void 0 : _a.uid
    };
    try {
        if (!context.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'Usuário não autenticado');
        }
        const { sessionId, limit = 50 } = data;
        const messagesSnapshot = await db
            .collection('chat_sessions').doc(sessionId).collection('messages')
            .orderBy('timestamp', 'desc')
            .limit(limit)
            .get();
        const messages = messagesSnapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
        return { messages: messages.reverse() };
    }
    catch (error) {
        logger_1.logger.error('Erro ao buscar histórico do chat', { error: error.message }, contextData);
        throw error;
    }
});
exports.saveFeedback = functions.https.onCall(async (data, context) => {
    var _a;
    const contextData = {
        functionName: 'saveFeedback',
        userId: (_a = context.auth) === null || _a === void 0 ? void 0 : _a.uid
    };
    try {
        if (!context.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'Usuário não autenticado');
        }
        const { sessionId, feedback, rating } = data;
        await db.collection('feedback').add({
            sessionId,
            userId: context.auth.uid,
            feedback,
            rating,
            timestamp: admin.firestore.Timestamp.now(),
        });
        return { success: true };
    }
    catch (error) {
        logger_1.logger.error('Erro ao salvar feedback', { error: error.message }, contextData);
        throw error;
    }
});
exports.createSession = functions.https.onCall(async (data, context) => {
    var _a;
    const contextData = {
        functionName: 'createSession',
        userId: (_a = context.auth) === null || _a === void 0 ? void 0 : _a.uid
    };
    try {
        if (!context.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'Usuário não autenticado');
        }
        const { participants } = data;
        const sessionRef = await db.collection('chat_sessions').add({
            participants: [...participants, context.auth.uid],
            createdAt: admin.firestore.Timestamp.now(),
            createdBy: context.auth.uid,
        });
        return { sessionId: sessionRef.id };
    }
    catch (error) {
        logger_1.logger.error('Erro ao criar sessão de chat', { error: error.message }, contextData);
        throw error;
    }
});
exports.pollMessages = functions.https.onCall(async (data, context) => {
    var _a;
    const contextData = {
        functionName: 'pollMessages',
        userId: (_a = context.auth) === null || _a === void 0 ? void 0 : _a.uid
    };
    try {
        if (!context.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'Usuário não autenticado');
        }
        const { sessionId, lastMessageId } = data;
        let query = db
            .collection('chat_sessions').doc(sessionId).collection('messages')
            .orderBy('timestamp', 'desc')
            .limit(10);
        if (lastMessageId) {
            const lastMessage = await db
                .collection('chat_sessions').doc(sessionId).collection('messages')
                .doc(lastMessageId).get();
            if (lastMessage.exists) {
                query = query.startAfter(lastMessage);
            }
        }
        const messagesSnapshot = await query.get();
        const messages = messagesSnapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
        return { messages: messages.reverse() };
    }
    catch (error) {
        logger_1.logger.error('Erro ao buscar novas mensagens', { error: error.message }, contextData);
        throw error;
    }
});
//# sourceMappingURL=chat.js.map