import { onCall } from "firebase-functions/v2/https";

import { emailService } from "./services/emailService";

// Tipos para os dados de email
interface EmailData {
  userEmail: string;
  userName: string;
  tipo: "pedido" | "audiovisual" | "admin";
  dadosAdicionais?: Record<string, any>;
}

interface EmailTemplate {
  subject: string;
  html: (data: EmailData) => string;
}

// Função de sanitização para prevenir XSS
function sanitizeHtml(text: string): string {
  if (typeof text !== "string") return "";

  return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;")
      .replace(/\//g, "&#x2F;");
}

// Função para validar e sanitizar dados
function validateAndSanitizeData(data: any): EmailData {
  return {
    userEmail: sanitizeHtml(data.userEmail || ""),
    userName: sanitizeHtml(data.userName || ""),
    tipo: data.tipo,
    dadosAdicionais: data.dadosAdicionais ?
      Object.fromEntries(
          Object.entries(data.dadosAdicionais).map(([key, value]) => [
            key,
            typeof value === "string" ? sanitizeHtml(value) : value,
          ]),
      ) :
      undefined,
  };
}

// Templates de email (usando o serviço)
const emailTemplates: Record<string, EmailTemplate> = {
  pedido: {
    subject: "Pedido Confirmado - CERRADO INTERBØX 2025",
    html: (data: EmailData) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Pedido Confirmado - CERRADO INTERBØX 2025</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #ec4899;">🎫 Pedido Confirmado - CERRADO INTERBØX 2025</h2>
          
          <p>Olá ${data.userName},</p>
          <p>Seu pedido foi confirmado com sucesso!</p>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>📋 Detalhes do Pedido:</h3>
            <p><strong>Tipo:</strong> ${data.dadosAdicionais?.tipo || "Ingresso"}</p>
            <p><strong>Quantidade:</strong> ${data.dadosAdicionais?.quantidade || 1}</p>
            <p><strong>Valor Total:</strong> R$ ${data.dadosAdicionais?.valorTotal || "0,00"}</p>
          </div>
          
          <p>Em breve você receberá instruções para pagamento via PIX.</p>
          <p>Obrigado por fazer parte do maior evento de times da América Latina!</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="font-size: 12px; color: #6b7280;">
              Este é um email automático, não responda a esta mensagem.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  },

  audiovisual: {
    subject: "Status da Inscrição - CERRADO INTERBØX 2025",
    html: (data: EmailData) => {
      const aprovado = data.dadosAdicionais?.aprovado;
      const tipo = data.dadosAdicionais?.tipo || "Profissional Audiovisual";

      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Status da Inscrição - CERRADO INTERBØX 2025</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #ec4899;">📸 Status da Inscrição - CERRADO INTERBØX 2025</h2>
            
            <p>Olá ${data.userName},</p>
            
            ${aprovado ? `
              <div style="background: #dcfce7; border: 1px solid #22c55e; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #166534;">✅ Inscrição Aprovada!</h3>
                <p>Parabéns! Sua inscrição como ${tipo} foi aprovada.</p>
                <p>Você está oficialmente credenciado para o CERRADO INTERBØX 2025!</p>
              </div>
            ` : `
              <div style="background: #fef2f2; border: 1px solid #ef4444; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #991b1b;">❌ Inscrição Não Aprovada</h3>
                <p>Infelizmente sua inscrição não foi aprovada no momento.</p>
                ${data.dadosAdicionais?.motivoRejeicao ? `
                  <p><strong>Motivo:</strong> ${data.dadosAdicionais.motivoRejeicao}</p>
                ` : ""}
              </div>
            `}
            
            <p>Em caso de dúvidas, entre em contato conosco.</p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="font-size: 12px; color: #6b7280;">
                Este é um email automático, não responda a esta mensagem.
              </p>
            </div>
          </div>
        </body>
        </html>
      `;
    },
  },

  admin: {
    subject: "CERRADO INTERBØX 2025 - Notificação",
    html: (data: EmailData) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>CERRADO INTERBØX 2025 - Notificação</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #ec4899;">🎯 CERRADO INTERBØX 2025</h2>
          
          <p>Olá ${data.userName},</p>
          
          <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #92400e;">📢 Notificação Importante</h3>
            <p>${data.dadosAdicionais?.message || "Você tem uma notificação do CERRADO INTERBØX 2025."}</p>
          </div>
          
          <p>Fique atento às próximas atualizações!</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="font-size: 12px; color: #6b7280;">
              Este é um email automático, não responda a esta mensagem.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  },
};

// Função para enviar email de boas-vindas
export const enviarEmailBoasVindas = onCall(async (request) => {
  const data = request.data as any;
  
  const contextData = {
    functionName: "enviarEmailBoasVindas",
    userId: request.auth?.uid,
  };

  try {
    // Verificar autenticação
    if (!request.auth) {
      console.log("Tentativa de envio não autenticada", contextData);
      throw new Error("Usuário não autenticado");
    }

    // Validar dados
    if (!data.userEmail || !data.userName) {
      throw new Error("Dados incompletos");
    }

    // Enviar email usando o template admin com mensagem personalizada
    const emailData = {
      userEmail: data.userEmail,
      userName: data.userName,
      tipo: "admin" as const,
      dadosAdicionais: {
        message: data.dadosAdicionais?.message || "Bem-vindo ao INTERBØX 2025!",
        uid: data.dadosAdicionais?.uid,
        signUpDate: data.dadosAdicionais?.signUpDate,
      },
    };

    const result = await emailService.sendTemplateEmail("admin", emailData, data.userEmail);

    console.log("Email de boas-vindas enviado", {
      userEmail: data.userEmail,
      userName: data.userName,
      contextData,
    });

    return {
      success: true,
      message: "Email de boas-vindas enviado com sucesso",
    };
  } catch (error: any) {
    console.error("Erro ao enviar email de boas-vindas", {
      error: error.message,
      userEmail: data.userEmail,
      contextData,
    });
    throw error;
  }
});

// Função para enviar email de confirmação
export const enviarEmailConfirmacao = onCall(async (request) => {
  const data = request.data as any;
  
  const contextData = {
    functionName: "enviarEmailConfirmacao",
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

    // Verificar se o template existe
    if (!emailTemplates[data.tipo]) {
      throw new Error("Tipo de email inválido");
    }

    // Enviar email
    const result = await emailService.sendTemplateEmail(data.tipo, data, data.userEmail);

    // Log da ação
    // Assuming 'db' and 'admin' are available in the environment or imported elsewhere
    // For this example, we'll just log the success/error
    console.log("Email enviado", {
      userEmail: data.userEmail,
      tipo: data.tipo,
      contextData,
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

// Função para enviar email de boas-vindas
export const enviaEmailBoasVindas = async (data: EmailData): Promise<void> => {
  const contextData = { functionName: "enviaEmailBoasVindas" };

  try {
    if (!data.userEmail) {
      console.warn("Email não fornecido para boas-vindas", {}, contextData);
      return;
    }

    const sanitizedData = validateAndSanitizeData(data);

    // Enviar email de boas-vindas usando o serviço
    const result = await emailService.sendWelcomeEmail(sanitizedData);

    if (result.success) {
      console.log("Email de boas-vindas enviado com sucesso", {
        userEmail: sanitizedData.userEmail,
        messageId: result.messageId,
      }, contextData);
    } else {
      console.error("Erro ao enviar email de boas-vindas", {
        error: result.error,
        userEmail: sanitizedData.userEmail,
      }, contextData);
    }
  } catch (error) {
    console.error("Erro ao enviar email de boas-vindas", {
      error: error instanceof Error ? error.message : "Erro desconhecido",
    }, contextData);
  }
};

// Função para enviar email de notificação
export const enviaEmailNotificacao = async (
    userEmail: string,
    userName: string,
    message: string,
): Promise<void> => {
  const contextData = { functionName: "enviaEmailNotificacao" };

  try {
    const data: EmailData = {
      userEmail,
      userName,
      tipo: "admin",
      dadosAdicionais: { message },
    };

    const sanitizedData = validateAndSanitizeData(data);

    // Enviar email de notificação usando o serviço
    const result = await emailService.sendNotificationEmail(sanitizedData);

    if (result.success) {
      console.log("Email de notificação enviado com sucesso", {
        userEmail: sanitizedData.userEmail,
        messageId: result.messageId,
      }, contextData);
    } else {
      console.error("Erro ao enviar email de notificação", {
        error: result.error,
        userEmail: sanitizedData.userEmail,
      }, contextData);
    }
  } catch (error) {
    console.error("Erro ao enviar email de notificação", {
      error: error instanceof Error ? error.message : "Erro desconhecido",
    }, contextData);
  }
};
