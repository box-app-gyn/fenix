import * as functions from 'firebase-functions';
export declare const enviarConviteTime: functions.https.CallableFunction<any, any, unknown>;
export declare const responderConviteTime: functions.https.CallableFunction<any, any, unknown>;
export declare const listarConvitesUsuario: functions.https.CallableFunction<any, Promise<{
    invites: {
        id: string;
    }[];
}>, unknown>;
export declare const cancelarConviteTime: functions.https.CallableFunction<any, any, unknown>;
//# sourceMappingURL=teams.d.ts.map