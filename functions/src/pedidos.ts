import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

const db = admin.firestore();

interface CriarInscricaoTimeData {
  userId: string;
  timeData: {
    nome: string;
    categoria: string;
    integrantes: string[];
  };
}

export const criarInscricaoTime = functions.https.onCall(async (request, context) => {
  const data = request.data as CriarInscricaoTimeData;
  
  const contextData = {
    functionName: "criarInscricaoTime",
    userId: context?.auth?.uid,
  };

  try {
    // Verificar autenticação
    if (!context?.auth) {
      console.log("Tentativa de inscrição não autenticada", contextData);
      throw new functions.https.HttpsError("unauthenticated", "Usuário não autenticado");
    }

    const { userId, timeData } = data;

    // Verificar se o usuário está tentando criar inscrição para outro usuário
    if (context.auth.uid !== userId) {
      throw new functions.https.HttpsError("permission-denied", "Não autorizado");
    }

    // Criar inscrição do time
    const inscricaoRef = await db.collection("times").add({
      userId: context.auth.uid,
      nome: timeData.nome,
      categoria: timeData.categoria,
      integrantes: timeData.integrantes,
      status: "pending",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
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
  } catch (error: any) {
    console.error("Erro ao criar inscrição de time", {
      error: error.message,
      contextData,
    });
    throw error;
  }
});
