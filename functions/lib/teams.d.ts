export declare const enviarConviteTime: import("firebase-functions/v2/https").CallableFunction<any, Promise<{
    success: boolean;
    conviteId: string;
}>, unknown>;
export declare const responderConviteTime: import("firebase-functions/v2/https").CallableFunction<any, Promise<{
    success: boolean;
    resposta: "accept" | "reject";
}>, unknown>;
export declare const listarConvitesTime: import("firebase-functions/v2/https").CallableFunction<any, Promise<{
    success: boolean;
    convites: {
        id: string;
    }[];
}>, unknown>;
export declare const cancelarConviteTime: import("firebase-functions/v2/https").CallableFunction<any, Promise<{
    success: boolean;
}>, unknown>;
//# sourceMappingURL=teams.d.ts.map