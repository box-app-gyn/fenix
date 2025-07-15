const {onCall} = require("firebase-functions/v2/https");
// const {onDocumentUpdated} = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// Função simples de teste
exports.testFunction = onCall(async (request) => {
  try {
    if (!request.auth) {
      throw new Error("Usuário não autenticado");
    }

    return {
      success: true,
      message: "Função de teste funcionando!",
      userId: request.auth.uid,
    };
  } catch (error) {
    console.error("Erro na função de teste:", error);
    throw error;
  }
});

// Função para criar inscrição de time
exports.criarInscricaoTime = onCall(async (request) => {
  try {
    if (!request.auth) {
      throw new Error("Usuário não autenticado");
    }

    const {userId, timeData} = request.data;

    // Verificar se o usuário é o dono da inscrição
    if (request.auth.uid !== userId) {
      throw new Error("Usuário não autorizado");
    }

    // Criar inscrição do time
    const inscricaoRef = await db.collection("inscricoes_times").add({
      userId,
      ...timeData,
      status: "pending",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log("Inscrição de time criada:", {
      inscricaoId: inscricaoRef.id,
      categoria: timeData.categoria,
    });
    return {success: true, inscricaoId: inscricaoRef.id};
  } catch (error) {
    console.error("Erro ao criar inscrição de time:", error);
    throw error;
  }
});

// Função para validar audiovisual
exports.validaAudiovisual = onCall(async (request) => {
  try {
    if (!request.auth) {
      throw new Error("Usuário não autenticado");
    }

    const {audiovisualId, adminId, aprovado, motivoRejeicao} = request.data;

    // Verificar se é admin
    const adminUser = await db.collection("users").doc(adminId).get();
    if (!adminUser.exists ||
        (adminUser.data() && adminUser.data().role !== "admin")) {
      throw new Error("Apenas admins podem validar profissionais audiovisuais");
    }

    // Buscar profissional audiovisual
    const audiovisualRef = db.collection("audiovisual").doc(audiovisualId);
    const audiovisualDoc = await audiovisualRef.get();

    if (!audiovisualDoc.exists) {
      throw new Error("Profissional audiovisual não encontrado");
    }

    const audiovisualData = audiovisualDoc.data();
    const tipo = (audiovisualData && audiovisualData.tipo) || "fotografo";

    // Atualizar status
    const updateData = {
      status: aprovado ? "approved" : "rejected",
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (aprovado) {
      updateData.aprovadoPor = adminId;
      updateData.aprovadoEm = admin.firestore.FieldValue.serverTimestamp();
    } else {
      updateData.rejeitadoPor = adminId;
      updateData.rejeitadoEm = admin.firestore.FieldValue.serverTimestamp();
      updateData.motivoRejeicao = motivoRejeicao || "Não especificado";
    }

    await audiovisualRef.update(updateData);

    // Atualizar role do usuário se aprovado
    if (aprovado && audiovisualData && audiovisualData.userId) {
      await db.collection("users").doc(audiovisualData.userId).update({
        role: tipo,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    console.log("Profissional audiovisual validado:", {
      audiovisualId,
      aprovado,
      tipo,
    });
    return {success: true, audiovisualId, aprovado};
  } catch (error) {
    console.error("Erro ao validar profissional audiovisual:", error);
    throw error;
  }
});

// TODO: Log de alterações em usuários - Temporariamente desabilitado
// devido a problemas de permissão do Eventarc Service Agent
// exports.logUserUpdate = onDocumentUpdated("users/{userId}",
//   async (event) => {
//   const before = event.data && event.data.before ?
//     event.data.before.data() : null;
//   const after = event.data && event.data.after ?
//     event.data.after.data() : null;
//   const userId = event.params.userId;

//   if (!before || !after) return;

//   // Detecta campos alterados
//   const changes = {};
//   Object.keys(after).forEach((key) => {
//     if (JSON.stringify(before[key]) !== JSON.stringify(after[key])) {
//       changes[key] = {before: before[key], after: after[key]};
//     }
//   });

//   // Salva log
//   return admin.firestore().collection("logs").add({
//     type: "user_update",
//     userId,
//     changes,
//     updatedAt: admin.firestore.FieldValue.serverTimestamp(),
//     updatedBy: after.updatedBy || null,
//   });
// });
