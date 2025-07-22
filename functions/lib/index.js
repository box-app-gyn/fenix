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
exports.enviarEmailBoasVindas = exports.openpixWebhook = exports.validaAudiovisual = exports.criarInscricaoTime = exports.testFunction = void 0;
const functions = __importStar(require("firebase-functions"));
const firebase_admin_1 = require("./firebase-admin");
// ============================================================================
// FUNÇÕES ESSENCIAIS
// ============================================================================
// Função simples de teste
exports.testFunction = functions.https.onCall(async (data, context) => {
    try {
        if (!(context === null || context === void 0 ? void 0 : context.auth)) {
            throw new Error('Usuário não autenticado');
        }
        return {
            success: true,
            message: 'Função de teste funcionando!',
            userId: context.auth.uid,
        };
    }
    catch (error) {
        console.error('Erro na função de teste:', error);
        throw error;
    }
});
// Função para criar inscrição de time
exports.criarInscricaoTime = functions.https.onRequest(async (req, res) => {
    try {
        const { userId, timeData } = req.body;
        if (!userId || !timeData) {
            res.status(400).json({ success: false, msg: 'Dados incompletos' });
            return;
        }
        const inscricaoRef = await firebase_admin_1.db.collection('inscricoes_times').add(Object.assign(Object.assign({ userId }, timeData), { status: 'pending', createdAt: firebase_admin_1.admin.firestore.FieldValue.serverTimestamp(), updatedAt: firebase_admin_1.admin.firestore.FieldValue.serverTimestamp() }));
        console.log('Inscrição de time criada:', {
            inscricaoId: inscricaoRef.id,
            categoria: timeData.categoria,
        });
        res.status(200).json({ success: true, inscricaoId: inscricaoRef.id });
    }
    catch (error) {
        console.error('Erro ao criar inscrição de time:', error);
        res.status(500).json({ success: false, msg: 'Erro interno' });
    }
});
// Função para validar audiovisual
exports.validaAudiovisual = functions.https.onCall(async (data, context) => {
    var _a;
    try {
        if (!(context === null || context === void 0 ? void 0 : context.auth)) {
            throw new Error('Usuário não autenticado');
        }
        const { audiovisualId, adminId, aprovado, motivoRejeicao } = data;
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
// Webhook OpenPix (HTTP function)
exports.openpixWebhook = functions.https.onRequest(async (req, res) => {
    // Configurar CORS
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    // Responder a requisições OPTIONS (preflight)
    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
    }
    // Apenas aceitar POST
    if (req.method !== 'POST') {
        res.status(405).send('Method not allowed');
        return;
    }
    try {
        console.log('Webhook OpenPix recebido:', req.body);
        // Processar webhook aqui
        const { charge } = req.body;
        if (charge && charge.status === 'COMPLETED') {
            // Atualizar status do pagamento no Firestore
            await firebase_admin_1.db.collection('pagamentos').doc(charge.correlationID).update({
                status: 'completed',
                updatedAt: firebase_admin_1.admin.firestore.FieldValue.serverTimestamp(),
                webhookData: req.body
            });
            console.log('Pagamento processado com sucesso:', charge.correlationID);
        }
        res.status(200).send('OK');
    }
    catch (error) {
        console.error('Erro no webhook OpenPix:', error);
        res.status(500).send('Internal Server Error');
    }
});
// ============================================================================
// FUNÇÕES DE EMAIL
// ============================================================================
// Função para enviar email de boas-vindas
exports.enviarEmailBoasVindas = functions.https.onCall(async (data, context) => {
    try {
        if (!(context === null || context === void 0 ? void 0 : context.auth)) {
            throw new Error('Usuário não autenticado');
        }
        const { userId } = data;
        // Buscar dados do usuário
        const userDoc = await firebase_admin_1.db.collection('users').doc(userId).get();
        if (!userDoc.exists) {
            throw new Error('Usuário não encontrado');
        }
        const userData = userDoc.data();
        // Aqui você implementaria o envio do email
        console.log('Enviando email de boas-vindas para:', userData === null || userData === void 0 ? void 0 : userData.email);
        return { success: true, message: 'Email de boas-vindas enviado' };
    }
    catch (error) {
        console.error('Erro ao enviar email de boas-vindas:', error);
        throw error;
    }
});
//# sourceMappingURL=index.js.map