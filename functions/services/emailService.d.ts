import { emailTemplates } from "../config/email";
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
export declare class EmailService {
  private transporter;
  private isInitialized;
  constructor();
  private initializeTransporter;
  private checkRateLimit;
  private validateEmail;
  sendEmail(options: EmailOptions, retries?: number): Promise<EmailResult>;
  sendTemplateEmail(templateName: keyof typeof emailTemplates, data: any, to: string | string[]): Promise<EmailResult>;
  sendConfirmationEmail(data: any): Promise<EmailResult>;
  sendAudiovisualStatusEmail(data: any): Promise<EmailResult>;
  sendNotificationEmail(data: any): Promise<EmailResult>;
  sendWelcomeEmail(data: any): Promise<EmailResult>;
  checkHealth(): Promise<boolean>;
  clearRateLimitCache(): void;
}
export declare const emailService: EmailService;
export {};
// # sourceMappingURL=emailService.d.ts.map
