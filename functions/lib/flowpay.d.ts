/**
 * Cria checkout na FlowPay para inscrição audiovisual
 */
export declare const criarCheckoutFlowPay: import("firebase-functions/v2/https").CallableFunction<any, Promise<{
    success: boolean;
    checkoutId: string;
    flowpayOrderId: any;
    checkoutUrl: any;
    amount: number;
}>, unknown>;
/**
 * Webhook para processar retornos da FlowPay
 */
export declare const webhookFlowPay: import("firebase-functions/v2/https").CallableFunction<any, Promise<{
    success: boolean;
}>, unknown>;
//# sourceMappingURL=flowpay.d.ts.map