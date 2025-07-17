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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validaAudiovisual = exports.criarInscricaoTime = exports.testFunction = void 0;
const https_1 = require("firebase-functions/v2/https");
const firebase_admin_1 = require("./firebase-admin");
// ============================================================================
// IMPORTAR FUNÇÕES EXISTENTES (após inicialização)
// ============================================================================
__exportStar(require("./teams"), exports);
__exportStar(require("./pedidos"), exports);
__exportStar(require("./audiovisual"), exports);
__exportStar(require("./audiovisual-inscricao"), exports);
__exportStar(require("./flowpay"), exports);
// Dashboard API - Removida para simplificar
// ============================================================================
// FUNÇÕES LEGADAS (mantidas para compatibilidade)
// ============================================================================
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
        const inscricaoRef = await firebase_admin_1.db.collection('inscricoes_times').add(Object.assign(Object.assign({ userId }, timeData), { status: 'pending', createdAt: firebase_admin_1.admin.firestore.FieldValue.serverTimestamp(), updatedAt: firebase_admin_1.admin.firestore.FieldValue.serverTimestamp() }));
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
        const adminUser = await firebase_admin_1.db.collection('users').doc(adminId).get();
        if (!adminUser.exists ||
            (((_a = adminUser.data()) === null || _a === void 0 ? void 0 : _a.role) !== 'admin')) {
            throw new Error('Apenas admins podem validar profissionais audiovisuais');
        }
        // Buscar profissional audiovisual
        const audiovisualRef = firebase_admin_1.db.collection('audiovisual').doc(audiovisualId);
        const audiovisualDoc = await audiovisualRef.get();
        if (!audiovisualDoc.exists) {
            throw new Error('Profissional audiovisual não encontrado');
        }
        const audiovisualData = audiovisualDoc.data();
        const tipo = (audiovisualData && audiovisualData.tipo) || 'fotografo';
        // Atualizar status
        const updateData = {
            status: aprovado ? 'approved' : 'rejected',
            updatedAt: firebase_admin_1.admin.firestore.FieldValue.serverTimestamp(),
        };
        if (aprovado) {
            updateData.aprovadoPor = adminId;
            updateData.aprovadoEm = firebase_admin_1.admin.firestore.FieldValue.serverTimestamp();
        }
        else {
            updateData.rejeitadoPor = adminId;
            updateData.rejeitadoEm = firebase_admin_1.admin.firestore.FieldValue.serverTimestamp();
            updateData.motivoRejeicao = motivoRejeicao || 'Não especificado';
        }
        await audiovisualRef.update(updateData);
        // Atualizar role do usuário se aprovado
        if (aprovado && audiovisualData && audiovisualData.userId) {
            await firebase_admin_1.db.collection('users').doc(audiovisualData.userId).update({
                role: tipo,
                updatedAt: firebase_admin_1.admin.firestore.FieldValue.serverTimestamp(),
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