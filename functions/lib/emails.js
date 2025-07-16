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
exports.enviaEmailBoasVindas = exports.enviaEmailConfirmacao = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const db = admin.firestore();
exports.enviaEmailConfirmacao = functions.https.onCall(async (data, context) => {
    var _a;
    const contextData = {
        functionName: "enviaEmailConfirmacao",
        userId: (_a = context.auth) === null || _a === void 0 ? void 0 : _a.uid,
    };
    try {
        if (!context.auth) {
            throw new functions.https.HttpsError("unauthenticated", "Usuário não autenticado");
        }
        const { userEmail, userName, tipo, inscricaoId } = data;
        // Salvar log do email
        await db.collection("email_logs").add({
            userEmail,
            userName,
            tipo,
            inscricaoId,
            enviadoPor: context.auth.uid,
            timestamp: admin.firestore.Timestamp.now(),
            status: "pending",
        });
        console.log("Email de confirmação solicitado", {
            userEmail,
            tipo,
        }, contextData);
        return { success: true, message: "Email de confirmação enviado" };
    }
    catch (error) {
        console.error("Erro ao enviar email de confirmação", {
            error: error.message,
            userEmail: data.userEmail,
        }, contextData);
        throw error;
    }
});
const enviaEmailBoasVindas = async (data) => {
    try {
        const { userEmail, userName, tipo } = data;
        // Aqui você pode integrar com um serviço de email como SendGrid, Mailgun, etc.
        console.log(`Enviando email de boas-vindas para ${userEmail} (${userName}) - Tipo: ${tipo}`);
        // Salvar log
        await db.collection("email_logs").add({
            userEmail,
            userName,
            tipo,
            timestamp: admin.firestore.Timestamp.now(),
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