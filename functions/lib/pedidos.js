"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.criarInscricaoTime = void 0;
const https_1 = require("firebase-functions/v2/https");
const firebase_admin_1 = require("./firebase-admin");
exports.criarInscricaoTime = (0, https_1.onCall)(async (request) => {
    var _a;
    const data = request.data;
    const contextData = {
        functionName: "criarInscricaoTime",
        userId: (_a = request.auth) === null || _a === void 0 ? void 0 : _a.uid,
    };
    try {
        // Verificar autenticação
        if (!request.auth) {
            console.log("Tentativa de inscrição não autenticada", contextData);
            throw new Error("Usuário não autenticado");
        }
        const { userId, timeData } = data;
        // Verificar se o usuário está tentando criar inscrição para outro usuário
        if (request.auth.uid !== userId) {
            throw new Error("Não autorizado");
        }
        // Criar inscrição do time
        const inscricaoRef = await firebase_admin_1.db.collection("times").add({
            userId: request.auth.uid,
            nome: timeData.nome,
            categoria: timeData.categoria,
            integrantes: timeData.integrantes,
            status: "pending",
            createdAt: firebase_admin_1.admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase_admin_1.admin.firestore.FieldValue.serverTimestamp(),
        });
        console.log("Inscrição de time criada", {
            inscricaoId: inscricaoRef.id,
            nome: timeData.nome,
            contextData,
        });
        return {
            success: true,
            inscricaoId: inscricaoRef.id,
        };
    }
    catch (error) {
        console.error("Erro ao criar inscrição de time", {
            error: error.message,
            contextData,
        });
        throw error;
    }
});
//# sourceMappingURL=pedidos.js.map