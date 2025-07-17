import { onCall } from "firebase-functions/v2/https";
import { db, admin } from "./firebase-admin";

export const enviarConviteTime = onCall(async (request) => {
  const data = request.data as { teamId: string; userId: string };
  
  const contextData = {
    functionName: "enviarConviteTime",
    userId: request.auth?.uid,
  };

  try {
    // Verificar autenticação
    if (!request.auth) {
      console.log("Tentativa de convite não autenticada", contextData);
      throw new Error("Usuário não autenticado");
    }

    const { teamId, userId } = data;

    // Verificar se o time existe e se o usuário é o dono
    const teamDoc = await db.collection("times").doc(teamId).get();
    if (!teamDoc.exists || teamDoc.data()?.ownerId !== request.auth!.uid) {
      throw new Error("Não autorizado");
    }

    // Verificar se o usuário já é membro
    const teamData = teamDoc.data();
    if (teamData?.members?.includes(userId)) {
      throw new Error("Usuário já é membro do time");
    }

    // Verificar se já existe convite pendente
    const existingInvite = await db
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
    const conviteRef = await db.collection("convites_times").add({
      teamId,
      userId,
      status: "pending",
      enviadoPor: request.auth!.uid,
      enviadoEm: admin.firestore.FieldValue.serverTimestamp(),
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
  } catch (error: any) {
    console.error("Erro ao enviar convite de time", {
      error: error.message,
      contextData,
    });
    throw error;
  }
});

export const responderConviteTime = onCall(async (request) => {
  const data = request.data as { inviteId: string; resposta: "accept" | "reject" };
  
  const contextData = {
    functionName: "responderConviteTime",
    userId: request.auth?.uid,
  };

  try {
    // Verificar autenticação
    if (!request.auth) {
      console.log("Tentativa de resposta não autenticada", contextData);
      throw new Error("Usuário não autenticado");
    }

    const { inviteId, resposta } = data;

    // Buscar convite
    const inviteDoc = await db.collection("convites_times").doc(inviteId).get();
    if (!inviteDoc.exists || inviteDoc.data()?.userId !== request.auth!.uid) {
      throw new Error("Convite não encontrado");
    }

    const inviteData = inviteDoc.data();
    if (!inviteData) {
      throw new Error("Dados do convite não encontrados");
    }

    // Atualizar status do convite
    await inviteDoc.ref.update({
      status: resposta === "accept" ? "accepted" : "rejected",
      respondidoEm: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Se aceitou, adicionar ao time
    if (resposta === "accept") {
      await db.collection("times").doc(inviteData.teamId).update({
        members: admin.firestore.FieldValue.arrayUnion(request.auth!.uid),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
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
  } catch (error: any) {
    console.error("Erro ao responder convite de time", {
      error: error.message,
      contextData,
    });
    throw error;
  }
});

export const listarConvitesTime = onCall(async (request) => {
  const contextData = {
    functionName: "listarConvitesTime",
    userId: request.auth?.uid,
  };

  try {
    // Verificar autenticação
    if (!request.auth) {
      console.log("Tentativa de listagem não autenticada", contextData);
      throw new Error("Usuário não autenticado");
    }

    // Buscar convites do usuário
    const convitesSnapshot = await db
      .collection("convites_times")
      .where("userId", "==", request.auth.uid)
      .where("status", "==", "pending")
      .get();

    const convites = convitesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("Convites de time listados", {
      count: convites.length,
      contextData,
    });

    return {
      success: true,
      convites,
    };
  } catch (error: any) {
    console.error("Erro ao listar convites de time", {
      error: error.message,
      contextData,
    });
    throw error;
  }
});

export const cancelarConviteTime = onCall(async (request) => {
  const data = request.data as { inviteId: string };
  
  const contextData = {
    functionName: "cancelarConviteTime",
    userId: request.auth?.uid,
  };

  try {
    // Verificar autenticação
    if (!request.auth) {
      console.log("Tentativa de cancelamento não autenticada", contextData);
      throw new Error("Usuário não autenticado");
    }

    const { inviteId } = data;

    // Buscar convite
    const inviteDoc = await db.collection("convites_times").doc(inviteId).get();
    if (!inviteDoc.exists) {
      throw new Error("Convite não encontrado");
    }

    const inviteData = inviteDoc.data();
    if (!inviteData) {
      throw new Error("Dados do convite não encontrados");
    }

    // Verificar se o usuário é o dono do time
    const teamDoc = await db.collection("times").doc(inviteData.teamId).get();
    if (!teamDoc.exists || teamDoc.data()?.ownerId !== request.auth!.uid) {
      throw new Error("Não autorizado");
    }

    // Cancelar convite
    await inviteDoc.ref.update({
      status: "cancelled",
      cancelledBy: request.auth!.uid,
      cancelledAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log("Convite de time cancelado", {
      inviteId,
      contextData,
    });

    return {
      success: true,
    };
  } catch (error: any) {
    console.error("Erro ao cancelar convite de time", {
      error: error.message,
      contextData,
    });
    throw error;
  }
});
