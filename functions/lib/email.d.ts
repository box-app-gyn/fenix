import * as functions from "firebase-functions";
interface EmailData {
    userEmail: string;
    userName: string;
    tipo: "pedido" | "audiovisual" | "admin";
    dadosAdicionais?: Record<string, any>;
}
export declare const enviaEmailConfirmacao: functions.https.CallableFunction<any, Promise<{
    success: boolean;
    message: string;
    subject: string;
    messageId: string | undefined;
}>, unknown>;
export declare const enviaEmailBoasVindas: (data: EmailData) => Promise<void>;
export declare const enviaEmailNotificacao: (userEmail: string, userName: string, message: string) => Promise<void>;
export {};
//# sourceMappingURL=email.d.ts.map