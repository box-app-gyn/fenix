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
exports.criarInscricaoTime = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const db = admin.firestore();
exports.criarInscricaoTime = functions.https.onCall(async (data, context) => {
    var _a;
    const contextData = {
        functionName: "criarInscricaoTime",
        userId: (_a = context.auth) === null || _a === void 0 ? void 0 : _a.uid,
    };
    try {
        // Verificar autenticação
        if (!context.auth) {
            console.log("Tentativa de inscrição não autenticada", {}, contextData);
            throw new functions.https.HttpsError("unauthenticated", "Usuário não autenticado");
        }
        const { userId, timeData } = data;
        // Verificar se o usuário é o dono da inscrição
        if (context.auth.uid !== userId) {
            console.log("Tentativa de inscrição por usuário não autorizado", { userId }, contextData);
            throw new functions.https.HttpsError("permission-denied", "Usuário não autorizado");
        }
        // Criar inscrição do time
        const inscricaoRef = await db.collection("inscricoes_times").add(Object.assign(Object.assign({ userId }, timeData), { status: "pending", createdAt: admin.firestore.FieldValue.serverTimestamp(), updatedAt: admin.firestore.FieldValue.serverTimestamp() }));
        console.log("Inscrição de time criada", {
            inscricaoId: inscricaoRef.id,
            categoria: timeData.categoria,
        }, contextData);
        return {
            success: true,
            inscricaoId: inscricaoRef.id,
        };
    }
    catch (error) {
        console.error("Erro ao criar inscrição de time", {
            error: error.message,
            userId: data.userId,
        }, contextData);
        throw error;
    }
});
//# sourceMappingURL=pedidos.js.map