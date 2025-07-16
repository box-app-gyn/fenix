import * as functions from "firebase-functions";

// Configurações de email
export const emailConfig = {
  // Configurações do Gmail
  gmail: {
    service: "gmail",
    auth: {
      user: functions.config().email?.user || process.env.EMAIL_USER,
      pass: functions.config().email?.password || process.env.EMAIL_PASSWORD,
    },
  },

  // Configurações do SendGrid (alternativa)
  sendgrid: {
    apiKey: functions.config().sendgrid?.api_key || process.env.SENDGRID_API_KEY,
    from: functions.config().sendgrid?.from || "noreply@interbox2025.com",
  },

  // Configurações do Resend (alternativa moderna)
  resend: {
    apiKey: functions.config().resend?.api_key || process.env.RESEND_API_KEY,
    from: functions.config().resend?.from || "noreply@interbox2025.com",
  },

  // Configurações gerais
  general: {
    from: "Interbox 2025 <noreply@interbox2025.com>",
    replyTo: "contato@interbox2025.com",
    maxRetries: 3,
    retryDelay: 5000, // 5 segundos
  },
};

// Templates de email em HTML
export const emailTemplates = {
  // Template base para todos os emails
  base: (content: string, title: string) => `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          margin: 0; 
          padding: 0; 
          background-color: #f4f4f4; 
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          background-color: #ffffff; 
          box-shadow: 0 0 10px rgba(0,0,0,0.1); 
        }
        .header { 
          background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%); 
          color: white; 
          padding: 30px 20px; 
          text-align: center; 
        }
        .header h1 { 
          margin: 0; 
          font-size: 28px; 
          font-weight: 700; 
        }
        .content { 
          padding: 30px 20px; 
        }
        .footer { 
          background-color: #f8f9fa; 
          padding: 20px; 
          text-align: center; 
          border-top: 1px solid #e9ecef; 
        }
        .footer p { 
          margin: 0; 
          font-size: 12px; 
          color: #6c757d; 
        }
        .button { 
          display: inline-block; 
          padding: 12px 24px; 
          background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%); 
          color: white; 
          text-decoration: none; 
          border-radius: 6px; 
          font-weight: 600; 
          margin: 20px 0; 
        }
        .info-box { 
          background-color: #f8f9fa; 
          border-left: 4px solid #ec4899; 
          padding: 15px; 
          margin: 20px 0; 
          border-radius: 4px; 
        }
        .success-box { 
          background-color: #d4edda; 
          border: 1px solid #c3e6cb; 
          color: #155724; 
          padding: 15px; 
          border-radius: 4px; 
          margin: 20px 0; 
        }
        .error-box { 
          background-color: #f8d7da; 
          border: 1px solid #f5c6cb; 
          color: #721c24; 
          padding: 15px; 
          border-radius: 4px; 
          margin: 20px 0; 
        }
        .warning-box { 
          background-color: #fff3cd; 
          border: 1px solid #ffeaa7; 
          color: #856404; 
          padding: 15px; 
          border-radius: 4px; 
          margin: 20px 0; 
        }
        @media only screen and (max-width: 600px) {
          .container { 
            margin: 0; 
            width: 100%; 
          }
          .header h1 { 
            font-size: 24px; 
          }
          .content { 
            padding: 20px 15px; 
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎯 Interbox 2025</h1>
        </div>
        <div class="content">
          ${content}
        </div>
        <div class="footer">
          <p>Este é um email automático, não responda a esta mensagem.</p>
          <p>© 2025 Interbox. Todos os direitos reservados.</p>
        </div>
      </div>
    </body>
    </html>
  `,

  // Template para pedidos confirmados
  pedido: (data: any) => {
    const content = `
      <h2 style="color: #ec4899; margin-top: 0;">🎫 Pedido Confirmado!</h2>
      
      <p>Olá <strong>${data.userName}</strong>,</p>
      <p>Seu pedido foi confirmado com sucesso! 🎉</p>
      
      <div class="success-box">
        <h3>📋 Detalhes do Pedido:</h3>
        <p><strong>Tipo:</strong> ${data.dadosAdicionais?.tipo || "Ingresso"}</p>
        <p><strong>Quantidade:</strong> ${data.dadosAdicionais?.quantidade || 1}</p>
        <p><strong>Valor Total:</strong> R$ ${data.dadosAdicionais?.valorTotal || "0,00"}</p>
      </div>
      
      <p>Em breve você receberá instruções para pagamento via PIX.</p>
      <p>Obrigado por fazer parte do maior evento de times da América Latina!</p>
    `;

    return emailTemplates.base(content, "Pedido Confirmado - Interbox 2025");
  },

  // Template para status de inscrição audiovisual
  audiovisual: (data: any) => {
    const aprovado = data.dadosAdicionais?.aprovado;
    const tipo = data.dadosAdicionais?.tipo || "Profissional Audiovisual";

    const statusBox = aprovado ?
      `<div class="success-box">
           <h3>✅ Inscrição Aprovada!</h3>
           <p>Parabéns! Sua inscrição como <strong>${tipo}</strong> foi aprovada.</p>
           <p>Você está oficialmente credenciado para o Interbox 2025!</p>
         </div>` :
      `<div class="error-box">
           <h3>❌ Inscrição Não Aprovada</h3>
           <p>Infelizmente sua inscrição não foi aprovada no momento.</p>
           ${data.dadosAdicionais?.motivoRejeicao ?
             `<p><strong>Motivo:</strong> ${data.dadosAdicionais.motivoRejeicao}</p>` : ""}
         </div>`;

    const content = `
      <h2 style="color: #ec4899; margin-top: 0;">📸 Status da Inscrição</h2>
      
      <p>Olá <strong>${data.userName}</strong>,</p>
      
      ${statusBox}
      
      <p>Em caso de dúvidas, entre em contato conosco.</p>
    `;

    return emailTemplates.base(content, "Status da Inscrição - Interbox 2025");
  },

  // Template para notificações administrativas
  admin: (data: any) => {
    const content = `
      <h2 style="color: #ec4899; margin-top: 0;">📢 Notificação Importante</h2>
      
      <p>Olá <strong>${data.userName}</strong>,</p>
      
      <div class="warning-box">
        <h3>🎯 Interbox 2025</h3>
        <p>${data.dadosAdicionais?.message || "Você tem uma notificação do Interbox 2025."}</p>
      </div>
      
      <p>Fique atento às próximas atualizações!</p>
    `;

    return emailTemplates.base(content, "Interbox 2025 - Notificação");
  },

  // Template para boas-vindas
  boasVindas: (data: any) => {
    const content = `
      <h2 style="color: #ec4899; margin-top: 0;">🎉 Bem-vindo ao Interbox 2025!</h2>
      
      <p>Olá <strong>${data.userName}</strong>,</p>
      
      <p>Seja bem-vindo ao maior evento de times da América Latina! 🏆</p>
      
      <div class="info-box">
        <h3>🚀 O que você pode fazer agora:</h3>
        <ul>
          <li>Explorar as funcionalidades do app</li>
          <li>Verificar as inscrições disponíveis</li>
          <li>Conectar-se com outros participantes</li>
          <li>Ficar por dentro das novidades</li>
        </ul>
      </div>
      
      <p>Estamos muito felizes em tê-lo conosco nesta jornada incrível!</p>
      
      <a href="https://interbox2025.com" class="button">Acessar o App</a>
    `;

    return emailTemplates.base(content, "Bem-vindo ao Interbox 2025");
  },
};

// Configurações de rate limiting para emails
export const emailRateLimit = {
  maxEmailsPerHour: 100,
  maxEmailsPerDay: 1000,
  cooldownPeriod: 60000, // 1 minuto entre emails para o mesmo usuário
};

// Validações de email
export const emailValidations = {
  // Regex para validar formato de email
  emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

  // Domínios permitidos (opcional)
  allowedDomains: [
    "gmail.com",
    "hotmail.com",
    "outlook.com",
    "yahoo.com",
    "icloud.com",
  ],

  // Tamanhos máximos
  maxSubjectLength: 100,
  maxBodyLength: 10000,
  maxRecipients: 10,
};
