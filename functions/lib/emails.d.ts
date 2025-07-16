import * as functions from "firebase-functions";
interface EmailData {
    userEmail: string;
    userName: string;
    tipo: string;
    inscricaoId?: string;
}
export declare const enviaEmailConfirmacao: functions.HttpsFunction & functions.Runnable<any>;
export declare const enviaEmailBoasVindas: (data: EmailData) => Promise<void>;
export {};
//# sourceMappingURL=emails.d.ts.map