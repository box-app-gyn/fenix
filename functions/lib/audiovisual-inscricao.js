"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.criarInscricaoAudiovisual = void 0;
const https_1 = require("firebase-functions/v2/https");
const firebase_admin_1 = require("./firebase-admin");
function validateAudiovisualData(data) {
    return !!(data.userEmail &&
        data.userName &&
        data.tipo &&
        data.experiencia &&
        data.portfolio &&
        data.telefone);
}
async function checkExistingAudiovisual(email) {
    const existing = await firebase_admin_1.db
        .collection("audiovisual")
        .where("userEmail", "==", email)
        .limit(1)
        .get();
    return !existing.empty;
}
exports.criarInscricaoAudiovisual = (0, https_1.onCall)(async (request) => {
    var _a;
    const data = request.data;
    const contextData = {
        functionName: "criarInscricaoAudiovisual",
        userId: (_a = request.auth) === null || _a === void 0 ? void 0 : _a.uid,
    };
    try {
        // Verificar autenticação
        if (!request.auth) {
            console.log("Tentativa de inscrição não autenticada", contextData);
            throw new Error("Usuário não autenticado");
        }
        // Validar dados
        if (!validateAudiovisualData(data)) {
            throw new Error("Dados incompletos");
        }
        // Verificar se já existe inscrição
        const existing = await checkExistingAudiovisual(data.userEmail);
        if (existing) {
            throw new Error("Já existe uma inscrição para este email");
        }
        // Criar inscrição usando transação
        const result = await firebase_admin_1.db.runTransaction(async (transaction) => {
            const inscricaoRef = firebase_admin_1.db.collection("audiovisual").doc();
            const inscricaoData = {
                userId: request.auth.uid,
                userEmail: data.userEmail,
                userName: data.userName,
                tipo: data.tipo,
                experiencia: data.experiencia,
                portfolio: data.portfolio,
                telefone: data.telefone,
                status: "pending",
                createdAt: firebase_admin_1.admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase_admin_1.admin.firestore.FieldValue.serverTimestamp(),
            };
            transaction.set(inscricaoRef, inscricaoData);
            return inscricaoRef.id;
        });
        console.log("Inscrição audiovisual criada", {
            inscricaoId: result,
            tipo: data.tipo,
            contextData,
        });
        return {
            success: true,
            inscricaoId: result,
        };
    }
    catch (error) {
        console.error("Erro ao criar inscrição audiovisual", {
            error: error.message,
            userEmail: data.userEmail,
            contextData,
        });
        throw error;
    }
});
//# sourceMappingURL=audiovisual-inscricao.js.map