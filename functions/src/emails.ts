import * as functions from "firebase-functions";
import * as admin from "firebase-admin";


const db = admin.firestore();

interface EmailData {
  userEmail: string;
  userName: string;
  tipo: string;
  inscricaoId?: string;
}

export const enviaEmailConfirmacao = functions.https.onCall(async (data: EmailData, context) => {
  const contextData = {
    functionName: "enviaEmailConfirmacao",
    userId: context.auth?.uid,
  };

  try {
    if (!context.auth) {
      throw new functions.https.HttpsError("unauthenticated", "Usuário não autenticado");
    }

    const { userEmail, userName, tipo, inscricaoId } = data;

    // Salvar log do email
    await db.collection("email_logs").add({
      userEmail,
      userName,
      tipo,
      inscricaoId,
      enviadoPor: context.auth.uid,
      timestamp: admin.firestore.Timestamp.now(),
      status: "pending",
    });

    console.log("Email de confirmação solicitado", {
      userEmail,
      tipo,
    }, contextData);

    return { success: true, message: "Email de confirmação enviado" };
  } catch (error: any) {
    console.error("Erro ao enviar email de confirmação", {
      error: error.message,
      userEmail: data.userEmail,
    }, contextData);
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
