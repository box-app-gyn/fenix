import * as functions from 'firebase-functions';
interface EmailData {
    userEmail: string;
    userName: string;
    tipo: string;
    inscricaoId?: string;
}
export declare const enviaEmailConfirmacao: functions.https.CallableFunction<any, any, unknown>;
export declare const enviaEmailBoasVindas: (data: EmailData) => Promise<void>;
export {};
//# sourceMappingURL=emails.d.ts.map