import * as functions from "firebase-functions";
import * as admin from "firebase-admin";


const db = admin.firestore();

interface ValidaAudiovisualData {
  audiovisualId: string;
  adminId: string;
  aprovado: boolean;
  motivoRejeicao?: string;
}

interface AudiovisualData {
  userId: string;
  tipo: string;
  status: string;
}

interface AdminUserData {
  role: string;
  email: string;
}

export const validaAudiovisual = functions.https.onCall(async (data: ValidaAudiovisualData, context) => {
  const contextData = {
    functionName: "validaAudiovisual",
    userId: context?.auth?.uid,
  };

  try {
    // Verificar autenticação
    if (!context?.auth) {
      console.log("Tentativa de acesso não autenticado", contextData);
      throw new functions.https.HttpsError("unauthenticated", "Usuário não autenticado");
    }

    const { audiovisualId, adminId, aprovado, motivoRejeicao } = data;

    // Verificar se é admin
    const adminUser = await db.collection("users").doc(adminId).get();
    if (!adminUser.exists || (adminUser.data() as AdminUserData)?.role !== "admin") {
      console.log("Tentativa de validação por não-admin", { adminId }, contextData);
      throw new functions.https.HttpsError("permission-denied", "Apenas admins podem validar profissionais audiovisuais");
    }

    // Buscar profissional audiovisual
    const audiovisualRef = db.collection("audiovisual").doc(audiovisualId);
    const audiovisualDoc = await audiovisualRef.get();

    if (!audiovisualDoc.exists) {
      throw new functions.https.HttpsError("not-found", "Profissional audiovisual não encontrado");
    }

    const audiovisualData = audiovisualDoc.data() as AudiovisualData;
    const tipo = audiovisualData?.tipo || "fotografo";

    // Atualizar status do profissional audiovisual
    const updateData: any = {
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
    if (aprovado) {
      await db.collection("users").doc(audiovisualData?.userId).update({
        role: tipo, // 'fotografo', 'videomaker', 'editor', etc.
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    // Log da ação
    const logData = {
      adminId,
      adminEmail: (adminUser.data() as AdminUserData)?.email,
      acao: aprovado ? "aprovacao_audiovisual" : "rejeicao_audiovisual",
      targetId: audiovisualId,
      targetType: "audiovisual",
      detalhes: {
        tipo,
        aprovado,
        motivoRejeicao: motivoRejeicao || null,
      },
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection("adminLogs").add(logData);

    console.log("Profissional audiovisual validado", { audiovisualId, aprovado, tipo }, contextData);
    return { success: true, audiovisualId, aprovado };
  } catch (error: any) {
    console.error("Erro ao validar profissional audiovisual", {
      error: error.message,
      audiovisualId: data.audiovisualId,
    }, contextData);
    throw error;
  }
});

// Função auxiliar para enviar email (será implementada em emails.ts)
async function enviaEmailConfirmacao(data: any) {
  // Implementação será movida para emails.ts
  console.log("Enviando email de confirmação:", data);
}
