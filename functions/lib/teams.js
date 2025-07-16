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
exports.cancelarConviteTime = exports.listarConvitesUsuario = exports.responderConviteTime = exports.enviarConviteTime = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const db = admin.firestore();
exports.enviarConviteTime = functions.https.onCall(async (data, context) => {
    var _a, _b;
    const contextData = {
        functionName: "enviarConviteTime",
        userId: (_a = context.auth) === null || _a === void 0 ? void 0 : _a.uid,
    };
    try {
        if (!context.auth) {
            throw new functions.https.HttpsError("unauthenticated", "Usuário não autenticado");
        }
        const { teamId, userId } = data;
        // Verificar se o usuário atual é dono do time
        const teamDoc = await db.collection("teams").doc(teamId).get();
        if (!teamDoc.exists || ((_b = teamDoc.data()) === null || _b === void 0 ? void 0 : _b.ownerId) !== context.auth.uid) {
            throw new functions.https.HttpsError("permission-denied", "Apenas o dono do time pode enviar convites");
        }
        // Verificar se já existe convite
        const existingInvite = await db
            .collection("team_invites")
            .where("teamId", "==", teamId)
            .where("userId", "==", userId)
            .where("status", "==", "pending")
            .limit(1)
            .get();
        if (!existingInvite.empty) {
            throw new functions.https.HttpsError("already-exists", "Convite já enviado para este usuário");
        }
        // Criar convite
        await db.collection("team_invites").add({
            teamId,
            userId,
            status: "pending",
            createdAt: admin.firestore.Timestamp.now(),
            enviadoPor: context.auth.uid,
        });
        console.log("Convite de time enviado", { teamId, userId }, contextData);
        return { success: true };
    }
    catch (error) {
        console.error("Erro ao enviar convite de time", { error: error.message }, contextData);
        throw error;
    }
});
exports.responderConviteTime = functions.https.onCall(async (data, context) => {
    var _a, _b;
    const contextData = {
        functionName: "responderConviteTime",
        userId: (_a = context.auth) === null || _a === void 0 ? void 0 : _a.uid,
    };
    try {
        if (!context.auth) {
            throw new functions.https.HttpsError("unauthenticated", "Usuário não autenticado");
        }
        const { inviteId, resposta } = data;
        // Buscar convite
        const inviteDoc = await db.collection("team_invites").doc(inviteId).get();
        if (!inviteDoc.exists || ((_b = inviteDoc.data()) === null || _b === void 0 ? void 0 : _b.userId) !== context.auth.uid) {
            throw new functions.https.HttpsError("not-found", "Convite não encontrado");
        }
        const inviteData = inviteDoc.data();
        // Atualizar status do convite
        await db.collection("team_invites").doc(inviteId).update({
            status: resposta === "accept" ? "accepted" : "rejected",
            respondedAt: admin.firestore.Timestamp.now(),
        });
        // Se aceito, adicionar usuário ao time
        if (resposta === "accept") {
            await db.collection("teams").doc(inviteData.teamId).update({
                members: admin.firestore.FieldValue.arrayUnion(context.auth.uid),
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
        }
        console.log("Convite de time respondido", { inviteId, resposta }, contextData);
        return { success: true };
    }
    catch (error) {
        console.error("Erro ao responder convite de time", { error: error.message }, contextData);
        throw error;
    }
});
exports.listarConvitesUsuario = functions.https.onCall(async (data, context) => {
    var _a;
    const contextData = {
        functionName: "listarConvitesUsuario",
        userId: (_a = context.auth) === null || _a === void 0 ? void 0 : _a.uid,
    };
    try {
        if (!context.auth) {
            throw new functions.https.HttpsError("unauthenticated", "Usuário não autenticado");
        }
        const invitesSnapshot = await db
            .collection("team_invites")
            .where("userId", "==", context.auth.uid)
            .where("status", "==", "pending")
            .orderBy("createdAt", "desc")
            .get();
        const invites = invitesSnapshot.docs.map((doc) => (Object.assign({ id: doc.id }, doc.data())));
        return { invites };
    }
    catch (error) {
        console.error("Erro ao listar convites do usuário", { error: error.message }, contextData);
        throw error;
    }
});
exports.cancelarConviteTime = functions.https.onCall(async (data, context) => {
    var _a, _b;
    const contextData = {
        functionName: "cancelarConviteTime",
        userId: (_a = context.auth) === null || _a === void 0 ? void 0 : _a.uid,
    };
    try {
        if (!context.auth) {
            throw new functions.https.HttpsError("unauthenticated", "Usuário não autenticado");
        }
        const { inviteId } = data;
        // Buscar convite
        const inviteDoc = await db.collection("team_invites").doc(inviteId).get();
        if (!inviteDoc.exists) {
            throw new functions.https.HttpsError("not-found", "Convite não encontrado");
        }
        const inviteData = inviteDoc.data();
        // Verificar se o usuário atual é dono do time
        const teamDoc = await db.collection("teams").doc(inviteData.teamId).get();
        if (!teamDoc.exists || ((_b = teamDoc.data()) === null || _b === void 0 ? void 0 : _b.ownerId) !== context.auth.uid) {
            throw new functions.https.HttpsError("permission-denied", "Apenas o dono do time pode cancelar convites");
        }
        // Cancelar convite
        await db.collection("team_invites").doc(inviteId).update({
            status: "cancelled",
            cancelledAt: admin.firestore.Timestamp.now(),
            cancelledBy: context.auth.uid,
        });
        console.log("Convite de time cancelado", { inviteId }, contextData);
        return { success: true };
    }
    catch (error) {
        console.error("Erro ao cancelar convite de time", { error: error.message }, contextData);
        throw error;
    }
});
//# sourceMappingURL=teams.js.map