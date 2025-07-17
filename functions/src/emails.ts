import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

const db = admin.firestore();

interface EmailData {
  userEmail: string;
  userName: string;
  tipo: string;
}

export const enviaEmailConfirmacao = functions.https.onCall(async (request, context) => {
  const data = request.data as EmailData;
  
  const contextData = {
    functionName: "enviaEmailConfirmacao",
    userId: context?.auth?.uid,
  };

  try {
    // Verificar autenticação
    if (!context?.auth) {
      console.log("Tentativa de envio não autenticada", contextData);
      throw new functions.https.HttpsError("unauthenticated", "Usuário não autenticado");
    }

    // Validar dados
    if (!data.userEmail || !data.userName || !data.tipo) {
      throw new functions.https.HttpsError("invalid-argument", "Dados incompletos");
    }

    // Simular envio de email (implementar lógica real aqui)
    console.log("Enviando email", {
      to: data.userEmail,
      tipo: data.tipo,
      contextData,
    });

    // Log da ação
    await db.collection("emailLogs").add({
      userId: context.auth.uid,
      userEmail: data.userEmail,
      userName: data.userName,
      tipo: data.tipo,
      enviadoPor: context.auth.uid,
      enviadoEm: admin.firestore.FieldValue.serverTimestamp(),
      status: "success",
    });

    return {
      success: true,
      message: "Email enviado com sucesso",
    };
  } catch (error: any) {
    console.error("Erro ao enviar email", {
      error: error.message,
      userEmail: data.userEmail,
      contextData,
    });
    throw error;
  }
});

export const enviaEmailBoasVindas = async (data: EmailData): Promise<void> => {
  try {
    const { userEmail, userName, tipo } = data;

    // Aqui você pode integrar com um serviço de email como SendGrid, Mailgun, etc.
    console.log(`Enviando email de boas-vindas para ${userEmail} (${userName}) - Tipo: ${tipo}`);

    // Salvar log
    await db.collection("email_logs").add({
      userEmail,
      userName,
      tipo,
      timestamp: admin.firestore.Timestamp.now(),
      status: "sent",
      tipoEmail: "boas_vindas",
    });
  } catch (error: any) {
    console.error("Erro ao enviar email de boas-vindas", {
      error: error.message,
      userEmail: data.userEmail,
    });
    throw error;
  }
};
