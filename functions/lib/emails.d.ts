interface EmailData {
    userEmail: string;
    userName: string;
    tipo: string;
}
export declare const enviaEmailConfirmacao: import("firebase-functions/v2/https").CallableFunction<any, Promise<{
    success: boolean;
    message: string;
}>, unknown>;
export declare const enviaEmailBoasVindas: (data: EmailData) => Promise<void>;
export {};
//# sourceMappingURL=emails.d.ts.map