"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validaAudiovisual = void 0;
const https_1 = require("firebase-functions/v2/https");
const firebase_admin_1 = require("./firebase-admin");
exports.validaAudiovisual = (0, https_1.onCall)(async (request) => {
    var _a;
    const data = request.data;
    const contextData = {
        functionName: "validaAudiovisual",
        userId: (_a = request.auth) === null || _a === void 0 ? void 0 : _a.uid,
    };
    try {
        // Verificar autenticação
        if (!request.auth) {
            console.log("Tentativa de validação não autenticada", contextData);
            throw new Error("Usuário não autenticado");
        }
        // Verificar se é admin
        const userDoc = await firebase_admin_1.db.collection("users").doc(request.auth.uid).get();
        const userData = userDoc.data();
        if (!userData || userData.role !== "admin") {
            throw new Error("Acesso negado");
        }
        // Atualizar status da inscrição
        await firebase_admin_1.db.collection("audiovisual").doc(data.audiovisualId).update({
            status: data.aprovado ? "approved" : "rejected",
            validatedBy: request.auth.uid,
            validatedAt: firebase_admin_1.admin.firestore.FieldValue.serverTimestamp(),
        });
        console.log("Inscrição audiovisual validada", {
            audiovisualId: data.audiovisualId,
            aprovado: data.aprovado,
            contextData,
        });
        return {
            success: true,
            audiovisualId: data.audiovisualId,
            aprovado: data.aprovado,
        };
    }
    catch (error) {
        console.error("Erro ao validar inscrição audiovisual", {
            error: error.message,
            audiovisualId: data.audiovisualId,
            contextData,
        });
        throw error;
    }
});
// Função auxiliar para enviar email (será implementada em emails.ts)
async function enviaEmailConfirmacao(data) {
    // Implementação será movida para emails.ts
    console.log("Enviando email de confirmação:", data);
}
//# sourceMappingURL=audiovisual.js.map