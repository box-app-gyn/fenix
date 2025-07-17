import * as functions from "firebase-functions";
import * as admin from "firebase-admin";


const db = admin.firestore();

interface ValidaAudiovisualData {
  audiovisualId: string;
  adminId: string;
  aprovado: boolean;
}

export const validaAudiovisual = functions.https.onCall(async (request, context) => {
  const data = request.data as ValidaAudiovisualData;
  
  const contextData = {
    functionName: "validaAudiovisual",
    userId: context?.auth?.uid,
  };

  try {
    // Verificar autenticação
    if (!context?.auth) {
      console.log("Tentativa de validação não autenticada", contextData);
      throw new functions.https.HttpsError("unauthenticated", "Usuário não autenticado");
    }

    // Verificar se é admin
    const userDoc = await db.collection("users").doc(context.auth.uid).get();
    const userData = userDoc.data();
    
    if (!userData || userData.role !== "admin") {
      throw new functions.https.HttpsError("permission-denied", "Acesso negado");
    }

    // Atualizar status da inscrição
    await db.collection("audiovisual").doc(data.audiovisualId).update({
      status: data.aprovado ? "approved" : "rejected",
      validatedBy: context.auth.uid,
      validatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log("Inscrição audiovisual validada", {
      audiovisualId: data.audiovisualId,
      aprovado: data.aprovado,
      contextData,
    });

    return {
      success: true,
      audiovisualId: data.audiovisualId,
      aprovado: data.aprovado,
    };
  } catch (error: any) {
    console.error("Erro ao validar inscrição audiovisual", {
      error: error.message,
      audiovisualId: data.audiovisualId,
      contextData,
    });
    throw error;
  }
});

// Função auxiliar para enviar email (será implementada em emails.ts)
async function enviaEmailConfirmacao(data: any) {
  // Implementação será movida para emails.ts
  console.log("Enviando email de confirmação:", data);
}
