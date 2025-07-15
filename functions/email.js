"use strict";
const __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  let desc = Object.getOwnPropertyDescriptor(m, k);
  if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
    desc = {enumerable: true, get: function() {
      return m[k];
    }};
  }
  Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
}));
const __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
  Object.defineProperty(o, "default", {enumerable: true, value: v});
}) : function(o, v) {
  o["default"] = v;
});
const __importStar = (this && this.__importStar) || (function() {
  let ownKeys = function(o) {
    ownKeys = Object.getOwnPropertyNames || function(o) {
      const ar = [];
      for (const k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
      return ar;
    };
    return ownKeys(o);
  };
  return function(mod) {
    if (mod && mod.__esModule) return mod;
    const result = {};
    if (mod != null) for (let k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
    __setModuleDefault(result, mod);
    return result;
  };
})();
Object.defineProperty(exports, "__esModule", {value: true});
exports.enviaEmailNotificacao = exports.enviaEmailBoasVindas = exports.enviaEmailConfirmacao = void 0;
const functions = __importStar(require("firebase-functions"));
const logger_1 = require("../utils/logger");
const emailService_1 = require("./services/emailService");
// Função de sanitização para prevenir XSS
function sanitizeHtml(text) {
  if (typeof text !== "string") {
    return "";
  }
  return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;")
      .replace(/\//g, "&#x2F;");
}
// Função para validar e sanitizar dados
function validateAndSanitizeData(data) {
  return {
    userEmail: sanitizeHtml(data.userEmail || ""),
    userName: sanitizeHtml(data.userName || ""),
    tipo: data.tipo,
    dadosAdicionais: data.dadosAdicionais ?
            Object.fromEntries(Object.entries(data.dadosAdicionais).map(([key, value]) => [
              key,
                typeof value === "string" ? sanitizeHtml(value) : value,
            ])) :
            undefined,
  };
}
// Templates de email (usando o serviço)
const emailTemplates = {
  pedido: {
    subject: "Pedido Confirmado - Interbox 2025",
    html: (data) => {
      let _a; let _b; let _c;
      return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Pedido Confirmado - Interbox 2025</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #ec4899;">🎫 Pedido Confirmado - Interbox 2025</h2>
          
          <p>Olá ${data.userName},</p>
          <p>Seu pedido foi confirmado com sucesso!</p>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>📋 Detalhes do Pedido:</h3>
            <p><strong>Tipo:</strong> ${((_a = data.dadosAdicionais) === null || _a === void 0 ? void 0 : _a.tipo) || "Ingresso"}</p>
            <p><strong>Quantidade:</strong> ${((_b = data.dadosAdicionais) === null || _b === void 0 ? void 0 : _b.quantidade) || 1}</p>
            <p><strong>Valor Total:</strong> R$ ${((_c = data.dadosAdicionais) === null || _c === void 0 ? void 0 : _c.valorTotal) || "0,00"}</p>
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
    `;
    },
  },
  audiovisual: {
    subject: "Status da Inscrição - Interbox 2025",
    html: (data) => {
      let _a; let _b; let _c;
      const aprovado = (_a = data.dadosAdicionais) === null || _a === void 0 ? void 0 : _a.aprovado;
      const tipo = ((_b = data.dadosAdicionais) === null || _b === void 0 ? void 0 : _b.tipo) || "Profissional Audiovisual";
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Status da Inscrição - Interbox 2025</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #ec4899;">📸 Status da Inscrição - Interbox 2025</h2>
            
            <p>Olá ${data.userName},</p>
            
            ${aprovado ? `
              <div style="background: #dcfce7; border: 1px solid #22c55e; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #166534;">✅ Inscrição Aprovada!</h3>
                <p>Parabéns! Sua inscrição como ${tipo} foi aprovada.</p>
                <p>Você está oficialmente credenciado para o Interbox 2025!</p>
              </div>
            ` : `
              <div style="background: #fef2f2; border: 1px solid #ef4444; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #991b1b;">❌ Inscrição Não Aprovada</h3>
                <p>Infelizmente sua inscrição não foi aprovada no momento.</p>
                ${((_c = data.dadosAdicionais) === null || _c === void 0 ? void 0 : _c.motivoRejeicao) ? `
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
    subject: "Interbox 2025 - Notificação",
    html: (data) => {
      let _a;
      return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Interbox 2025 - Notificação</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #ec4899;">🎯 Interbox 2025</h2>
          
          <p>Olá ${data.userName},</p>
          
          <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #92400e;">📢 Notificação Importante</h3>
            <p>${((_a = data.dadosAdicionais) === null || _a === void 0 ? void 0 : _a.message) || "Você tem uma notificação do Interbox 2025."}</p>
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
    `;
    },
  },
};
// Função para enviar email de confirmação
exports.enviaEmailConfirmacao = functions.https.onCall(async (data, context) => {
  let _a;
  const contextData = {
    functionName: "enviaEmailConfirmacao",
    userId: (_a = context.auth) === null || _a === void 0 ? void 0 : _a.uid,
  };
  try {
    // Validar dados
    if (!data.userEmail || !data.userName || !data.tipo) {
      throw new functions.https.HttpsError("invalid-argument", "Dados obrigatórios ausentes");
    }
    // Validar tipo de email
    if (!emailTemplates[data.tipo]) {
      throw new functions.https.HttpsError("invalid-argument", "Tipo de email inválido");
    }
    // Sanitizar dados
    const sanitizedData = validateAndSanitizeData(data);
    const template = emailTemplates[sanitizedData.tipo];
    // Gerar HTML do email
    const html = template.html(sanitizedData);
    // Enviar email usando o serviço
    const result = await emailService_1.emailService.sendTemplateEmail(sanitizedData.tipo, sanitizedData, sanitizedData.userEmail);
    if (result.success) {
      logger_1.logger.business("Email de confirmação enviado com sucesso", {
        userEmail: sanitizedData.userEmail,
        tipo: sanitizedData.tipo,
        messageId: result.messageId,
      }, contextData);
      return {
        success: true,
        message: "Email de confirmação enviado com sucesso",
        subject: template.subject,
        messageId: result.messageId,
      };
    } else {
      throw new functions.https.HttpsError("internal", `Erro ao enviar email: ${result.error}`);
    }
  } catch (error) {
    logger_1.logger.error("Erro ao enviar email de confirmação", {
      error: error instanceof Error ? error.message : "Erro desconhecido",
    }, contextData);
    throw error;
  }
});
// Função para enviar email de boas-vindas
const enviaEmailBoasVindas = async (data) => {
  const contextData = {functionName: "enviaEmailBoasVindas"};
  try {
    if (!data.userEmail) {
      logger_1.logger.warn("Email não fornecido para boas-vindas", {}, contextData);
      return;
    }
    const sanitizedData = validateAndSanitizeData(data);
    // Enviar email de boas-vindas usando o serviço
    const result = await emailService_1.emailService.sendWelcomeEmail(sanitizedData);
    if (result.success) {
      logger_1.logger.business("Email de boas-vindas enviado com sucesso", {
        userEmail: sanitizedData.userEmail,
        messageId: result.messageId,
      }, contextData);
    } else {
      logger_1.logger.error("Erro ao enviar email de boas-vindas", {
        error: result.error,
        userEmail: sanitizedData.userEmail,
      }, contextData);
    }
  } catch (error) {
    logger_1.logger.error("Erro ao enviar email de boas-vindas", {
      error: error instanceof Error ? error.message : "Erro desconhecido",
    }, contextData);
  }
};
exports.enviaEmailBoasVindas = enviaEmailBoasVindas;
// Função para enviar email de notificação
const enviaEmailNotificacao = async (userEmail, userName, message) => {
  const contextData = {functionName: "enviaEmailNotificacao"};
  try {
    const data = {
      userEmail,
      userName,
      tipo: "admin",
      dadosAdicionais: {message},
    };
    const sanitizedData = validateAndSanitizeData(data);
    // Enviar email de notificação usando o serviço
    const result = await emailService_1.emailService.sendNotificationEmail(sanitizedData);
    if (result.success) {
      logger_1.logger.business("Email de notificação enviado com sucesso", {
        userEmail: sanitizedData.userEmail,
        messageId: result.messageId,
      }, contextData);
    } else {
      logger_1.logger.error("Erro ao enviar email de notificação", {
        error: result.error,
        userEmail: sanitizedData.userEmail,
      }, contextData);
    }
  } catch (error) {
    logger_1.logger.error("Erro ao enviar email de notificação", {
      error: error instanceof Error ? error.message : "Erro desconhecido",
    }, contextData);
  }
};
exports.enviaEmailNotificacao = enviaEmailNotificacao;
// # sourceMappingURL=email.js.map
