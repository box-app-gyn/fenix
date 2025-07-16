export declare function createRequestContext(req?: any): {
    functionName: string;
    userId: string;
    requestId: any;
    ip: any;
    userAgent: any;
    timestamp: string;
};
export interface LogContext {
    functionName?: string;
    userId?: string;
    requestId?: string;
    ip?: string;
    userAgent?: string;
    timestamp?: string;
}
declare class Logger {
    private logLevel;
    constructor();
    info(message: string, data?: any, context?: LogContext): void;
    business(message: string, data?: any, context?: LogContext): void;
    security(message: string, data?: any, context?: LogContext): void;
    error(message: string, data?: any, context?: LogContext): void;
    warn(message: string, data?: any, context?: LogContext): void;
    log(level: string, message: string, data?: any, context?: LogContext): Promise<void>;
    performance(operation: string, duration: number, data?: any, context?: LogContext): void;
    access(method: string, path: string, userId: string, ip: string, userAgent: string, statusCode: number, duration: number): void;
}
export declare const logger: Logger;
export {};
//# sourceMappingURL=logger.d.ts.map