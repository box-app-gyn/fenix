import * as functions from "firebase-functions";
import * as admin from "firebase-admin";


const db = admin.firestore();

interface TeamInvite {
  teamId: string;
  userId: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: admin.firestore.Timestamp;
}

export const enviarConviteTime = functions.https.onCall(async (data: { teamId: string; userId: string }, context) => {
  const contextData = {
    functionName: "enviarConviteTime",
    userId: context.auth?.uid,
  };

  try {
    if (!context.auth) {
      throw new functions.https.HttpsError("unauthenticated", "Usuário não autenticado");
    }

    const { teamId, userId } = data;

    // Verificar se o usuário atual é dono do time
    const teamDoc = await db.collection("teams").doc(teamId).get();
    if (!teamDoc.exists || teamDoc.data()?.ownerId !== context.auth.uid) {
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
  } catch (error: any) {
    console.error("Erro ao enviar convite de time", { error: error.message }, contextData);
    throw error;
  }
});

export const responderConviteTime = functions.https.onCall(async (data: { inviteId: string; resposta: "accept" | "reject" }, context) => {
  const contextData = {
    functionName: "responderConviteTime",
    userId: context.auth?.uid,
  };

  try {
    if (!context.auth) {
      throw new functions.https.HttpsError("unauthenticated", "Usuário não autenticado");
    }

    const { inviteId, resposta } = data;

    // Buscar convite
    const inviteDoc = await db.collection("team_invites").doc(inviteId).get();
    if (!inviteDoc.exists || inviteDoc.data()?.userId !== context.auth.uid) {
      throw new functions.https.HttpsError("not-found", "Convite não encontrado");
    }

    const inviteData = inviteDoc.data() as TeamInvite;

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
  } catch (error: any) {
    console.error("Erro ao responder convite de time", { error: error.message }, contextData);
    throw error;
  }
});

export const listarConvitesUsuario = functions.https.onCall(async (data: {}, context) => {
  const contextData = {
    functionName: "listarConvitesUsuario",
    userId: context.auth?.uid,
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

    const invites = invitesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { invites };
  } catch (error: any) {
    console.error("Erro ao listar convites do usuário", { error: error.message }, contextData);
    throw error;
  }
});

export const cancelarConviteTime = functions.https.onCall(async (data: { inviteId: string }, context) => {
  const contextData = {
    functionName: "cancelarConviteTime",
    userId: context.auth?.uid,
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

    const inviteData = inviteDoc.data() as TeamInvite;

    // Verificar se o usuário atual é dono do time
    const teamDoc = await db.collection("teams").doc(inviteData.teamId).get();
    if (!teamDoc.exists || teamDoc.data()?.ownerId !== context.auth.uid) {
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
  } catch (error: any) {
    console.error("Erro ao cancelar convite de time", { error: error.message }, contextData);
    throw error;
  }
});
