export declare const emailConfig: {
    gmail: {
        service: string;
        auth: {
            user: any;
            pass: any;
        };
    };
    sendgrid: {
        apiKey: any;
        from: any;
    };
    resend: {
        apiKey: any;
        from: any;
    };
    general: {
        from: string;
        replyTo: string;
        maxRetries: number;
        retryDelay: number;
    };
};
export declare const emailTemplates: {
    base: (content: string, title: string) => string;
    pedido: (data: any) => string;
    audiovisual: (data: any) => string;
    admin: (data: any) => string;
    boasVindas: (data: any) => string;
};
export declare const emailRateLimit: {
    maxEmailsPerHour: number;
    maxEmailsPerDay: number;
    cooldownPeriod: number;
};
export declare const emailValidations: {
    emailRegex: RegExp;
    allowedDomains: string[];
    maxSubjectLength: number;
    maxBodyLength: number;
    maxRecipients: number;
};
//# sourceMappingURL=email.d.ts.map