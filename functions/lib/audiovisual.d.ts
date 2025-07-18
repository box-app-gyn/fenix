export declare const validaAudiovisual: import("firebase-functions/v2/https").CallableFunction<any, Promise<{
    success: boolean;
    audiovisualId: string;
    aprovado: boolean;
}>, unknown>;
/**
 * Migra dados audiovisuais antigos para o novo formato
 */
export declare const migrarAudiovisual: import("firebase-functions/v2/https").CallableFunction<any, Promise<{
    success: boolean;
    totalDocuments: number;
    migratedCount: number;
    errors: {
        docId: string;
        error: any;
    }[];
}>, unknown>;
//# sourceMappingURL=audiovisual.d.ts.map