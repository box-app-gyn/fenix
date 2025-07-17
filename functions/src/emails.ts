import { onCall } from "firebase-functions/v2/https";
import { db, admin } from "./firebase-admin";

interface EmailData {
  userEmail: string;
  userName: string;
  tipo: string;
}

export const enviaEmailConfirmacao = onCall(async (request) => {
  const data = request.data as EmailData;
  
  const contextData = {
    functionName: "enviaEmailConfirmacao",
    userId: request.auth?.uid,
  };

  try {
    // Verificar autenticação
    if (!request.auth) {
      console.log("Tentativa de envio não autenticada", contextData);
      throw new Error("Usuário não autenticado");
    }

    // Validar dados
    if (!data.userEmail || !data.userName || !data.tipo) {
      throw new Error("Dados incompletos");
    }

    // Simular envio de email (implementar lógica real aqui)
    console.log("Enviando email", {
      to: data.userEmail,
      tipo: data.tipo,
      contextData,
    });

    // Log da ação
    await db.collection("emailLogs").add({
      userId: request.auth.uid,
      userEmail: data.userEmail,
      userName: data.userName,
      tipo: data.tipo,
      enviadoPor: request.auth.uid,
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
