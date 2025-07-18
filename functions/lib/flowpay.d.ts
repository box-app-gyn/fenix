/**
 * Cria checkout na FlowPay para inscrição audiovisual
 */
export declare const criarCheckoutFlowPay: import("firebase-functions/v2/https").CallableFunction<any, Promise<{
    success: boolean;
    checkoutId: string;
    flowpayOrderId: string;
    checkoutUrl: string;
    amount: number;
    isSimulated: boolean;
    openpixChargeId?: undefined;
    qrCode?: undefined;
    pixKey?: undefined;
} | {
    success: boolean;
    checkoutId: string;
    openpixChargeId: any;
    qrCode: any;
    pixKey: any;
    amount: number;
    flowpayOrderId?: undefined;
    checkoutUrl?: undefined;
    isSimulated?: undefined;
}>, unknown>;
/**
 * Webhook para processar retornos da OpenPix
 */
export declare const openpixWebhook: import("firebase-functions/lib/v1/cloud-functions").HttpsFunction;
//# sourceMappingURL=flowpay.d.ts.map