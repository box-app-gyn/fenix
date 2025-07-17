"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelarConviteTime = exports.listarConvitesTime = exports.responderConviteTime = exports.enviarConviteTime = void 0;
const https_1 = require("firebase-functions/v2/https");
const firebase_admin_1 = require("./firebase-admin");
exports.enviarConviteTime = (0, https_1.onCall)(async (request) => {
    var _a, _b, _c;
    const data = request.data;
    const contextData = {
        functionName: "enviarConviteTime",
        userId: (_a = request.auth) === null || _a === void 0 ? void 0 : _a.uid,
    };
    try {
        // Verificar autenticação
        if (!request.auth) {
            console.log("Tentativa de convite não autenticada", contextData);
            throw new Error("Usuário não autenticado");
        }
        const { teamId, userId } = data;
        // Verificar se o time existe e se o usuário é o dono
        const teamDoc = await firebase_admin_1.db.collection("times").doc(teamId).get();
        if (!teamDoc.exists || ((_b = teamDoc.data()) === null || _b === void 0 ? void 0 : _b.ownerId) !== request.auth.uid) {
            throw new Error("Não autorizado");
        }
        // Verificar se o usuário já é membro
        const teamData = teamDoc.data();
        if ((_c = teamData === null || teamData === void 0 ? void 0 : teamData.members) === null || _c === void 0 ? void 0 : _c.includes(userId)) {
            throw new Error("Usuário já é membro do time");
        }
        // Verificar se já existe convite pendente
        const existingInvite = await firebase_admin_1.db
            .collection("convites_times")
            .where("teamId", "==", teamId)
            .where("userId", "==", userId)
            .where("status", "==", "pending")
            .limit(1)
            .get();
        if (!existingInvite.empty) {
            throw new Error("Convite já enviado");
        }
        // Criar convite
        const conviteRef = await firebase_admin_1.db.collection("convites_times").add({
            teamId,
            userId,
            status: "pending",
            enviadoPor: request.auth.uid,
            enviadoEm: firebase_admin_1.admin.firestore.FieldValue.serverTimestamp(),
        });
        console.log("Convite de time enviado", {
            conviteId: conviteRef.id,
            teamId,
            userId,
            contextData,
        });
        return {
            success: true,
            conviteId: conviteRef.id,
        };
    }
    catch (error) {
        console.error("Erro ao enviar convite de time", {
            error: error.message,
            contextData,
        });
        throw error;
    }
});
exports.responderConviteTime = (0, https_1.onCall)(async (request) => {
    var _a, _b;
    const data = request.data;
    const contextData = {
        functionName: "responderConviteTime",
        userId: (_a = request.auth) === null || _a === void 0 ? void 0 : _a.uid,
    };
    try {
        // Verificar autenticação
        if (!request.auth) {
            console.log("Tentativa de resposta não autenticada", contextData);
            throw new Error("Usuário não autenticado");
        }
        const { inviteId, resposta } = data;
        // Buscar convite
        const inviteDoc = await firebase_admin_1.db.collection("convites_times").doc(inviteId).get();
        if (!inviteDoc.exists || ((_b = inviteDoc.data()) === null || _b === void 0 ? void 0 : _b.userId) !== request.auth.uid) {
            throw new Error("Convite não encontrado");
        }
        const inviteData = inviteDoc.data();
        if (!inviteData) {
            throw new Error("Dados do convite não encontrados");
        }
        // Atualizar status do convite
        await inviteDoc.ref.update({
            status: resposta === "accept" ? "accepted" : "rejected",
            respondidoEm: firebase_admin_1.admin.firestore.FieldValue.serverTimestamp(),
        });
        // Se aceitou, adicionar ao time
        if (resposta === "accept") {
            await firebase_admin_1.db.collection("times").doc(inviteData.teamId).update({
                members: firebase_admin_1.admin.firestore.FieldValue.arrayUnion(request.auth.uid),
                updatedAt: firebase_admin_1.admin.firestore.FieldValue.serverTimestamp(),
            });
        }
        console.log("Convite de time respondido", {
            inviteId,
            resposta,
            contextData,
        });
        return {
            success: true,
            resposta,
        };
    }
    catch (error) {
        console.error("Erro ao responder convite de time", {
            error: error.message,
            contextData,
        });
        throw error;
    }
});
exports.listarConvitesTime = (0, https_1.onCall)(async (request) => {
    var _a;
    const contextData = {
        functionName: "listarConvitesTime",
        userId: (_a = request.auth) === null || _a === void 0 ? void 0 : _a.uid,
    };
    try {
        // Verificar autenticação
        if (!request.auth) {
            console.log("Tentativa de listagem não autenticada", contextData);
            throw new Error("Usuário não autenticado");
        }
        // Buscar convites do usuário
        const convitesSnapshot = await firebase_admin_1.db
            .collection("convites_times")
            .where("userId", "==", request.auth.uid)
            .where("status", "==", "pending")
            .get();
        const convites = convitesSnapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
        console.log("Convites de time listados", {
            count: convites.length,
            contextData,
        });
        return {
            success: true,
            convites,
        };
    }
    catch (error) {
        console.error("Erro ao listar convites de time", {
            error: error.message,
            contextData,
        });
        throw error;
    }
});
exports.cancelarConviteTime = (0, https_1.onCall)(async (request) => {
    var _a, _b;
    const data = request.data;
    const contextData = {
        functionName: "cancelarConviteTime",
        userId: (_a = request.auth) === null || _a === void 0 ? void 0 : _a.uid,
    };
    try {
        // Verificar autenticação
        if (!request.auth) {
            console.log("Tentativa de cancelamento não autenticada", contextData);
            throw new Error("Usuário não autenticado");
        }
        const { inviteId } = data;
        // Buscar convite
        const inviteDoc = await firebase_admin_1.db.collection("convites_times").doc(inviteId).get();
        if (!inviteDoc.exists) {
            throw new Error("Convite não encontrado");
        }
        const inviteData = inviteDoc.data();
        if (!inviteData) {
            throw new Error("Dados do convite não encontrados");
        }
        // Verificar se o usuário é o dono do time
        const teamDoc = await firebase_admin_1.db.collection("times").doc(inviteData.teamId).get();
        if (!teamDoc.exists || ((_b = teamDoc.data()) === null || _b === void 0 ? void 0 : _b.ownerId) !== request.auth.uid) {
            throw new Error("Não autorizado");
        }
        // Cancelar convite
        await inviteDoc.ref.update({
            status: "cancelled",
            cancelledBy: request.auth.uid,
            cancelledAt: firebase_admin_1.admin.firestore.FieldValue.serverTimestamp(),
        });
        console.log("Convite de time cancelado", {
            inviteId,
            contextData,
        });
        return {
            success: true,
        };
    }
    catch (error) {
        console.error("Erro ao cancelar convite de time", {
            error: error.message,
            contextData,
        });
        throw error;
    }
});
//# sourceMappingURL=teams.js.map