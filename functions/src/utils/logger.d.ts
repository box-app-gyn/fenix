export interface RequestContext {
  functionName: string;
  userId: string;
  requestId: string;
  ip: string;
  userAgent: string;
  timestamp: string;
}

export interface LogContext {
  functionName?: string;
  userId?: string;
  requestId?: string;
  ip?: string;
  userAgent?: string;
  timestamp?: string;
}

export class Logger {
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

export function createRequestContext(req?: any): RequestContext;
export const logger: Logger; 