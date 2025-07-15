const functions = require("firebase-functions");
const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// Função simples de teste
exports.testFunction = functions.https.onCall(async (data, context) => {
  try {
    if (!context.auth) {
      throw new functions.https.HttpsError(
          "unauthenticated",
          "Usuário não autenticado",
      );
    }

    return {
      success: true,
      message: "Função de teste funcionando!",
      userId: context.auth.uid,
    };
  } catch (error) {
    console.error("Erro na função de teste:", error);
    throw error;
  }
});

// Trigger quando usuário é criado
exports.onUserCreated = functions.auth.user().onCreate(async (user) => {
  try {
    const {uid, email, displayName, photoURL} = user;

    // Criar documento do usuário no Firestore
    const userData = {
      uid,
      email: email || "",
      displayName: displayName || "",
      photoURL: photoURL || "",
      role: "publico",
      isActive: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      // 🎯 GAMIFICAÇÃO CAMADA 1
      gamification: {
        points: 10, // Pontos iniciais por cadastro
        level: "iniciante",
        totalActions: 1,
        lastActionAt: admin.firestore.FieldValue.serverTimestamp(),
        achievements: ["first_blood"], // Primeira conquista
        rewards: [],
        streakDays: 1,
        lastLoginStreak: admin.firestore.FieldValue.serverTimestamp(),
        referralCode: `REF${uid.substring(0, 8).toUpperCase()}`,
        referrals: [],
        referralPoints: 0,
      },
    };

    await db.collection("users").doc(uid).set(userData);
    console.log("Novo usuário criado:", {email, displayName, uid});
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
  }
});

// Função para criar inscrição de time
exports.criarInscricaoTime = functions.https.onCall(async (data, context) => {
  try {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "Usuário não autenticado",
      );
    }

    const {userId, timeData} = data;

    // Verificar se o usuário é o dono da inscrição
    if (context.auth.uid !== userId) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "Usuário não autorizado",
      );
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
exports.validaAudiovisual = functions.https.onCall(async (data, context) => {
  try {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "Usuário não autenticado",
      );
    }

    const {audiovisualId, adminId, aprovado, motivoRejeicao} = data;

    // Verificar se é admin
    const adminUser = await db.collection("users").doc(adminId).get();
    if (!adminUser.exists || (adminUser.data() && adminUser.data().role !== "admin")) {
      throw new functions.https.HttpsError(
          "permission-denied",
          "Apenas admins podem validar profissionais audiovisuais",
      );
    }

    // Buscar profissional audiovisual
    const audiovisualRef = db.collection("audiovisual").doc(audiovisualId);
    const audiovisualDoc = await audiovisualRef.get();

    if (!audiovisualDoc.exists) {
      throw new functions.https.HttpsError(
        "not-found",
        "Profissional audiovisual não encontrado",
      );
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
