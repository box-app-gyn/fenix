"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailService = exports.EmailService = void 0;
const nodemailer = __importStar(require("nodemailer"));
const logger_1 = require("../utils/logger");
const email_1 = require("../config/email");
// Cache para rate limiting
const emailRateLimitCache = new Map();
// Classe principal do serviço de email
class EmailService {
    constructor() {
        this.isInitialized = false;
        this.initializeTransporter();
    }
    // Inicializar transporter
    async initializeTransporter() {
        try {
            // Tentar Gmail primeiro
            if (email_1.emailConfig.gmail.auth.user && email_1.emailConfig.gmail.auth.pass) {
                this.transporter = nodemailer.createTransport(email_1.emailConfig.gmail);
                await this.transporter.verify();
                this.isInitialized = true;
                console.log("✅ Transporter Gmail inicializado");
                return;
            }
            // Fallback para SendGrid ou outros provedores
            if (email_1.emailConfig.sendgrid.apiKey) {
                this.transporter = nodemailer.createTransport({
                    host: "smtp.sendgrid.net",
                    port: 587,
                    secure: false,
                    auth: {
                        user: "apikey",
                        pass: email_1.emailConfig.sendgrid.apiKey,
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
        }
        catch (error) {
            console.error("❌ Erro ao inicializar transporter:", error);
            throw error;
        }
    }
    // Verificar rate limiting
    checkRateLimit(email) {
        const now = Date.now();
        const key = `email_${email}`;
        const data = emailRateLimitCache.get(key);
        if (!data || now > data.resetTime) {
            emailRateLimitCache.set(key, {
                count: 1,
                resetTime: now + email_1.emailRateLimit.cooldownPeriod,
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
    validateEmail(email) {
        if (!email_1.emailValidations.emailRegex.test(email)) {
            return false;
        }
        // Verificar domínio permitido (opcional)
        const domain = email.split("@")[1];
        if (email_1.emailValidations.allowedDomains.length > 0 &&
            !email_1.emailValidations.allowedDomains.includes(domain)) {
            return false;
        }
        return true;
    }
    // Enviar email com retry
    async sendEmail(options, retries = 0) {
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
                    logger_1.logger.warn("Rate limit excedido para email", { email }, contextData);
                    return {
                        success: false,
                        error: "Rate limit excedido",
                        retries,
                    };
                }
            }
            // Preparar opções do email
            const mailOptions = {
                from: options.from || email_1.emailConfig.general.from,
                to: validEmails.join(", "),
                subject: options.subject.substring(0, email_1.emailValidations.maxSubjectLength),
                html: options.html.substring(0, email_1.emailValidations.maxBodyLength),
                text: options.text,
                replyTo: options.replyTo || email_1.emailConfig.general.replyTo,
                attachments: options.attachments,
            };
            // Enviar email
            const info = await this.transporter.sendMail(mailOptions);
            logger_1.logger.business("Email enviado com sucesso", {
                messageId: info.messageId,
                to: validEmails,
                subject: options.subject,
            }, contextData);
            return {
                success: true,
                messageId: info.messageId,
                retries,
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
            // Tentar novamente se ainda não excedeu o número máximo de tentativas
            if (retries < email_1.emailConfig.general.maxRetries) {
                logger_1.logger.warn("Tentativa de envio de email falhou, tentando novamente", {
                    error: errorMessage,
                    retries: retries + 1,
                }, contextData);
                // Aguardar antes de tentar novamente
                await new Promise((resolve) => setTimeout(resolve, email_1.emailConfig.general.retryDelay));
                return this.sendEmail(options, retries + 1);
            }
            logger_1.logger.error("Falha ao enviar email após todas as tentativas", {
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
    async sendTemplateEmail(templateName, data, to) {
        const contextData = { functionName: "EmailService.sendTemplateEmail" };
        try {
            // Verificar se o template existe
            if (!email_1.emailTemplates[templateName]) {
                throw new Error(`Template '${templateName}' não encontrado`);
            }
            // Gerar HTML do template
            const html = email_1.emailTemplates[templateName](data, "Interbox 2025");
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
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
            logger_1.logger.error("Erro ao enviar email com template", {
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
    async sendConfirmationEmail(data) {
        return this.sendTemplateEmail("pedido", data, data.userEmail);
    }
    // Enviar email de status audiovisual
    async sendAudiovisualStatusEmail(data) {
        return this.sendTemplateEmail("audiovisual", data, data.userEmail);
    }
    // Enviar email de notificação
    async sendNotificationEmail(data) {
        return this.sendTemplateEmail("admin", data, data.userEmail);
    }
    // Enviar email de boas-vindas
    async sendWelcomeEmail(data) {
        return this.sendTemplateEmail("boasVindas", data, data.userEmail);
    }
    // Verificar status do serviço
    async checkHealth() {
        try {
            if (!this.isInitialized) {
                await this.initializeTransporter();
            }
            await this.transporter.verify();
            return true;
        }
        catch (error) {
            logger_1.logger.error("Serviço de email não está saudável", {
                error: error instanceof Error ? error.message : "Erro desconhecido",
            });
            return false;
        }
    }
    // Limpar cache de rate limiting
    clearRateLimitCache() {
        emailRateLimitCache.clear();
        logger_1.logger.info("Cache de rate limiting limpo");
    }
}
exports.EmailService = EmailService;
// Instância singleton do serviço
exports.emailService = new EmailService();
//# sourceMappingURL=emailService.js.map