import * as functions from 'firebase-functions';
export declare const testFunction: functions.https.CallableFunction<any, Promise<{
    success: boolean;
    message: string;
    userId: any;
}>, unknown>;
export declare const criarInscricaoTime: functions.https.HttpsFunction;
export declare const validaAudiovisual: functions.https.CallableFunction<any, Promise<{
    success: boolean;
    audiovisualId: any;
    aprovado: any;
}>, unknown>;
export declare const openpixWebhook: functions.https.HttpsFunction;
export declare const enviarEmailBoasVindas: functions.https.CallableFunction<any, Promise<{
    success: boolean;
    message: string;
}>, unknown>;
//# sourceMappingURL=index.d.ts.map