import { onCall } from "firebase-functions/v2/https";
import { db, admin } from "./firebase-admin";

interface CriarInscricaoTimeData {
  userId: string;
  timeData: {
    nome: string;
    categoria: string;
    integrantes: string[];
  };
}

export const criarInscricaoTime = onCall(async (request) => {
  const data = request.data as CriarInscricaoTimeData;
  
  const contextData = {
    functionName: "criarInscricaoTime",
    userId: request.auth?.uid,
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
    const inscricaoRef = await db.collection("times").add({
      userId: request.auth.uid,
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
