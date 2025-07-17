export * from './teams';
export * from './pedidos';
export * from './audiovisual';
export * from './audiovisual-inscricao';
export declare const testFunction: import("firebase-functions/v2/https").CallableFunction<any, Promise<{
    success: boolean;
    message: string;
    userId: string;
}>, unknown>;
export declare const criarInscricaoTime: import("firebase-functions/v2/https").CallableFunction<any, Promise<{
    success: boolean;
    inscricaoId: string;
}>, unknown>;
export declare const validaAudiovisual: import("firebase-functions/v2/https").CallableFunction<any, Promise<{
    success: boolean;
    audiovisualId: any;
    aprovado: any;
}>, unknown>;
declare const _default: {
    testFunction: import("firebase-functions/v2/https").CallableFunction<any, Promise<{
        success: boolean;
        message: string;
        userId: string;
    }>, unknown>;
    criarInscricaoTime: import("firebase-functions/v2/https").CallableFunction<any, Promise<{
        success: boolean;
        inscricaoId: string;
    }>, unknown>;
    validaAudiovisual: import("firebase-functions/v2/https").CallableFunction<any, Promise<{
        success: boolean;
        audiovisualId: any;
        aprovado: any;
    }>, unknown>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map