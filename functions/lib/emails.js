"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enviaEmailBoasVindas = exports.enviaEmailConfirmacao = void 0;
const https_1 = require("firebase-functions/v2/https");
const firebase_admin_1 = require("./firebase-admin");
exports.enviaEmailConfirmacao = (0, https_1.onCall)(async (request) => {
    var _a;
    const data = request.data;
    const contextData = {
        functionName: "enviaEmailConfirmacao",
        userId: (_a = request.auth) === null || _a === void 0 ? void 0 : _a.uid,
    };
    try {
        // Verificar autenticação
        if (!request.auth) {
            console.log("Tentativa de envio não autenticada", contextData);
            throw new Error("Usuário não autenticado");
        }
        // Validar dados
        if (!data.userEmail || !data.userName || !data.tipo) {
            throw new Error("Dados incompletos");
        }
        // Simular envio de email (implementar lógica real aqui)
        console.log("Enviando email", {
            to: data.userEmail,
            tipo: data.tipo,
            contextData,
        });
        // Log da ação
        await firebase_admin_1.db.collection("emailLogs").add({
            userId: request.auth.uid,
            userEmail: data.userEmail,
            userName: data.userName,
            tipo: data.tipo,
            enviadoPor: request.auth.uid,
            enviadoEm: firebase_admin_1.admin.firestore.FieldValue.serverTimestamp(),
            status: "success",
        });
        return {
            success: true,
            message: "Email enviado com sucesso",
        };
    }
    catch (error) {
        console.error("Erro ao enviar email", {
            error: error.message,
            userEmail: data.userEmail,
            contextData,
        });
        throw error;
    }
});
const enviaEmailBoasVindas = async (data) => {
    try {
        const { userEmail, userName, tipo } = data;
        // Aqui você pode integrar com um serviço de email como SendGrid, Mailgun, etc.
        console.log(`Enviando email de boas-vindas para ${userEmail} (${userName}) - Tipo: ${tipo}`);
        // Salvar log
        await firebase_admin_1.db.collection("email_logs").add({
            userEmail,
            userName,
            tipo,
            timestamp: firebase_admin_1.admin.firestore.Timestamp.now(),
            status: "sent",
            tipoEmail: "boas_vindas",
        });
    }
    catch (error) {
        console.error("Erro ao enviar email de boas-vindas", {
            error: error.message,
            userEmail: data.userEmail,
        });
        throw error;
    }
};
exports.enviaEmailBoasVindas = enviaEmailBoasVindas;
//# sourceMappingURL=emails.js.map