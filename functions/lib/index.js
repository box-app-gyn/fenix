"use strict";
// ============================================================================
// FIREBASE FUNCTIONS - INDEX
// ============================================================================
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
exports.validaAudiovisual = exports.criarInscricaoTime = exports.testFunction = void 0;
// Importar apenas funções essenciais para teste
// export * from './teams';
// export * from './pedidos';
// export * from './audiovisual';
// export * from './audiovisual-inscricao';
// Dashboard API - Removida para simplificar
// ============================================================================
// FUNÇÕES LEGADAS (mantidas para compatibilidade)
// ============================================================================
const https_1 = require("firebase-functions/v2/https");
const admin = __importStar(require("firebase-admin"));
// Inicializar Firebase Admin se não estiver inicializado
if (!admin.apps.length) {
    admin.initializeApp();
}
const db = admin.firestore();
// Função simples de teste
exports.testFunction = (0, https_1.onCall)(async (request) => {
    try {
        if (!request.auth) {
            throw new Error('Usuário não autenticado');
        }
        return {
            success: true,
            message: 'Função de teste funcionando!',
            userId: request.auth.uid,
        };
    }
    catch (error) {
        console.error('Erro na função de teste:', error);
        throw error;
    }
});
// Função para criar inscrição de time
exports.criarInscricaoTime = (0, https_1.onCall)(async (request) => {
    try {
        if (!request.auth) {
            throw new Error('Usuário não autenticado');
        }
        const { userId, timeData } = request.data;
        // Verificar se o usuário é o dono da inscrição
        if (request.auth.uid !== userId) {
            throw new Error('Usuário não autorizado');
        }
        // Criar inscrição do time
        const inscricaoRef = await db.collection('inscricoes_times').add(Object.assign(Object.assign({ userId }, timeData), { status: 'pending', createdAt: admin.firestore.FieldValue.serverTimestamp(), updatedAt: admin.firestore.FieldValue.serverTimestamp() }));
        console.log('Inscrição de time criada:', {
            inscricaoId: inscricaoRef.id,
            categoria: timeData.categoria,
        });
        return { success: true, inscricaoId: inscricaoRef.id };
    }
    catch (error) {
        console.error('Erro ao criar inscrição de time:', error);
        throw error;
    }
});
// Função para validar audiovisual
exports.validaAudiovisual = (0, https_1.onCall)(async (request) => {
    var _a;
    try {
        if (!request.auth) {
            throw new Error('Usuário não autenticado');
        }
        const { audiovisualId, adminId, aprovado, motivoRejeicao } = request.data;
        // Verificar se é admin
        const adminUser = await db.collection('users').doc(adminId).get();
        if (!adminUser.exists ||
            (((_a = adminUser.data()) === null || _a === void 0 ? void 0 : _a.role) !== 'admin')) {
            throw new Error('Apenas admins podem validar profissionais audiovisuais');
        }
        // Buscar profissional audiovisual
        const audiovisualRef = db.collection('audiovisual').doc(audiovisualId);
        const audiovisualDoc = await audiovisualRef.get();
        if (!audiovisualDoc.exists) {
            throw new Error('Profissional audiovisual não encontrado');
        }
        const audiovisualData = audiovisualDoc.data();
        const tipo = (audiovisualData && audiovisualData.tipo) || 'fotografo';
        // Atualizar status
        const updateData = {
            status: aprovado ? 'approved' : 'rejected',
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };
        if (aprovado) {
            updateData.aprovadoPor = adminId;
            updateData.aprovadoEm = admin.firestore.FieldValue.serverTimestamp();
        }
        else {
            updateData.rejeitadoPor = adminId;
            updateData.rejeitadoEm = admin.firestore.FieldValue.serverTimestamp();
            updateData.motivoRejeicao = motivoRejeicao || 'Não especificado';
        }
        await audiovisualRef.update(updateData);
        // Atualizar role do usuário se aprovado
        if (aprovado && audiovisualData && audiovisualData.userId) {
            await db.collection('users').doc(audiovisualData.userId).update({
                role: tipo,
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
        }
        console.log('Profissional audiovisual validado:', {
            audiovisualId,
            aprovado,
            tipo,
        });
        return { success: true, audiovisualId, aprovado };
    }
    catch (error) {
        console.error('Erro ao validar profissional audiovisual:', error);
        throw error;
    }
});
// ============================================================================
// EXPORTAÇÕES PARA COMPATIBILIDADE
// ============================================================================
// Exportar todas as funções para o sistema de build do Firebase
exports.default = {
    // Funções legadas
    testFunction: exports.testFunction,
    criarInscricaoTime: exports.criarInscricaoTime,
    validaAudiovisual: exports.validaAudiovisual,
    // Funções do dashboard (exportadas automaticamente via export *)
};
//# sourceMappingURL=index.js.map