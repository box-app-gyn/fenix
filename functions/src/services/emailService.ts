import * as nodemailer from "nodemailer";
import * as functions from "firebase-functions";
import { logger } from "../utils/logger";
import { emailConfig, emailTemplates, emailRateLimit, emailValidations } from "../config/email";

// Tipos para o serviço de email
interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
  attachments?: Array<{
    filename: string;
    content: string | Buffer;
    contentType?: string;
  }>;
}

interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  retries?: number;
}

// Cache para rate limiting
const emailRateLimitCache = new Map<string, { count: number; resetTime: number }>();

// Classe principal do serviço de email
export class EmailService {
  private transporter!: nodemailer.Transporter;
  private isInitialized = false;

  constructor() {
    this.initializeTransporter();
  }

  // Inicializar transporter
  private async initializeTransporter(): Promise<void> {
    try {
      // Tentar Gmail primeiro
      if (emailConfig.gmail.auth.user && emailConfig.gmail.auth.pass) {
        this.transporter = nodemailer.createTransport(emailConfig.gmail);
        await this.transporter.verify();
        this.isInitialized = true;
        console.log("✅ Transporter Gmail inicializado");
        return;
      }

      // Fallback para SendGrid ou outros provedores
      if (emailConfig.sendgrid.apiKey) {
        this.transporter = nodemailer.createTransport({
          host: "smtp.sendgrid.net",
          port: 587,
          secure: false,
          auth: {
            user: "apikey",
            pass: emailConfig.sendgrid.apiKey,
          },
        });
        await this.transporter.verify();
        this.isInitialized = true;
        console.log("✅ Transporter SendGrid inicializado");
        return;
      }

      // Transporter de teste para desenvolvimento
      this.transporter = nodemailer.createTransport({
        host: "localhost",
        port: 1025,
        secure: false,
        ignoreTLS: true,
      });
      this.isInitialized = true;
      console.log("✅ Transporter de teste inicializado");
    } catch (error) {
      console.error("❌ Erro ao inicializar transporter:", error);
      throw error;
    }
  }

  // Verificar rate limiting
  private checkRateLimit(email: string): boolean {
    const now = Date.now();
    const key = `email_${email}`;
    const data = emailRateLimitCache.get(key);

    if (!data || now > data.resetTime) {
      emailRateLimitCache.set(key, {
        count: 1,
        resetTime: now + emailRateLimit.cooldownPeriod,
      });
      return true;
    }

    if (data.count >= 5) { // Máximo 5 emails por minuto por usuário
      return false;
    }

    data.count++;
    return true;
  }

  // Validar email
  private validateEmail(email: string): boolean {
    if (!emailValidations.emailRegex.test(email)) {
      return false;
    }

    // Verificar domínio permitido (opcional)
    const domain = email.split("@")[1];
    if (emailValidations.allowedDomains.length > 0 &&
        !emailValidations.allowedDomains.includes(domain)) {
      return false;
    }

    return true;
  }

  // Enviar email com retry
  public async sendEmail(options: EmailOptions, retries = 0): Promise<EmailResult> {
    const contextData = { functionName: "EmailService.sendEmail" };

    try {
      // Verificar se o transporter está inicializado
      if (!this.isInitialized) {
        await this.initializeTransporter();
      }

      // Validar emails
      const emails = Array.isArray(options.to) ? options.to : [options.to];
      const validEmails = emails.filter((email) => this.validateEmail(email));

      if (validEmails.length === 0) {
        throw new Error("Nenhum email válido fornecido");
      }

      // Verificar rate limiting
      for (const email of validEmails) {
        if (!this.checkRateLimit(email)) {
          logger.warn("Rate limit excedido para email", { email }, contextData);
          return {
            success: false,
            error: "Rate limit excedido",
            retries,
          };
        }
      }

      // Preparar opções do email
      const mailOptions = {
        from: options.from || emailConfig.general.from,
        to: validEmails.join(", "),
        subject: options.subject.substring(0, emailValidations.maxSubjectLength),
        html: options.html.substring(0, emailValidations.maxBodyLength),
        text: options.text,
        replyTo: options.replyTo || emailConfig.general.replyTo,
        attachments: options.attachments,
      };

      // Enviar email
      const info = await this.transporter.sendMail(mailOptions);

      logger.business("Email enviado com sucesso", {
        messageId: info.messageId,
        to: validEmails,
        subject: options.subject,
      }, contextData);

      return {
        success: true,
        messageId: info.messageId,
        retries,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";

      // Tentar novamente se ainda não excedeu o número máximo de tentativas
      if (retries < emailConfig.general.maxRetries) {
        logger.warn("Tentativa de envio de email falhou, tentando novamente", {
          error: errorMessage,
          retries: retries + 1,
        }, contextData);

        // Aguardar antes de tentar novamente
        await new Promise((resolve) => setTimeout(resolve, emailConfig.general.retryDelay));

        return this.sendEmail(options, retries + 1);
      }

      logger.error("Falha ao enviar email após todas as tentativas", {
        error: errorMessage,
        retries,
        to: options.to,
      }, contextData);

      return {
        success: false,
        error: errorMessage,
        retries,
      };
    }
  }

  // Enviar email usando template
  public async sendTemplateEmail(
      templateName: keyof typeof emailTemplates,
      data: any,
      to: string | string[],
  ): Promise<EmailResult> {
    const contextData = { functionName: "EmailService.sendTemplateEmail" };

    try {
      // Verificar se o template existe
      if (!emailTemplates[templateName]) {
        throw new Error(`Template '${templateName}' não encontrado`);
      }

      // Gerar HTML do template
      const html = emailTemplates[templateName](data, "Interbox 2025");

      // Determinar assunto baseado no template
      let subject = "INTERBØX 2025";
      switch (templateName) {
        case "pedido":
          subject = "Pedido Confirmado - INTERBØX 2025";
          break;
        case "audiovisual":
          subject = "Status da Inscrição - INTERBØX 2025";
          break;
        case "admin":
          subject = "Notificação - INTERBØX 2025";
          break;
        case "boasVindas":
          subject = "Bem-vindo ao INTERBØX 2025";
          break;
      }

      // Enviar email
      return await this.sendEmail({
        to,
        subject,
        html,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      logger.error("Erro ao enviar email com template", {
        error: errorMessage,
        template: templateName,
        to,
      }, contextData);

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  // Enviar email de confirmação
  public async sendConfirmationEmail(data: any): Promise<EmailResult> {
    return this.sendTemplateEmail("pedido", data, data.userEmail);
  }

  // Enviar email de status audiovisual
  public async sendAudiovisualStatusEmail(data: any): Promise<EmailResult> {
    return this.sendTemplateEmail("audiovisual", data, data.userEmail);
  }

  // Enviar email de notificação
  public async sendNotificationEmail(data: any): Promise<EmailResult> {
    return this.sendTemplateEmail("admin", data, data.userEmail);
  }

  // Enviar email de boas-vindas
  public async sendWelcomeEmail(data: any): Promise<EmailResult> {
    return this.sendTemplateEmail("boasVindas", data, data.userEmail);
  }

  // Verificar status do serviço
  public async checkHealth(): Promise<boolean> {
    try {
      if (!this.isInitialized) {
        await this.initializeTransporter();
      }
      await this.transporter.verify();
      return true;
    } catch (error) {
      logger.error("Serviço de email não está saudável", {
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
      return false;
    }
  }

  // Limpar cache de rate limiting
  public clearRateLimitCache(): void {
    emailRateLimitCache.clear();
    logger.info("Cache de rate limiting limpo");
  }
}

// Instância singleton do serviço
export const emailService = new EmailService();
