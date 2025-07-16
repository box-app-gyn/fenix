import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

const db = admin.firestore();

// Função para criar contexto de requisição
export function createRequestContext(req: any = null) {
  return {
    functionName: "unknown",
    userId: "unknown",
    requestId: req ? req.headers["x-request-id"] || "unknown" : "unknown",
    ip: req ? req.ip || "unknown" : "unknown",
    userAgent: req ? req.headers["user-agent"] || "unknown" : "unknown",
    timestamp: new Date().toISOString(),
  };
}

export interface LogContext {
  functionName?: string;
  userId?: string;
  requestId?: string;
  ip?: string;
  userAgent?: string;
  timestamp?: string;
}

class Logger {
  private logLevel: string;

  constructor() {
    this.logLevel = process.env.LOG_LEVEL || "info";
  }

  // Log de informações gerais
  info(message: string, data: any = {}, context: LogContext = {}) {
    this.log("info", message, data, context);
  }

  // Log de sucesso/negócio
  business(message: string, data: any = {}, context: LogContext = {}) {
    this.log("business", message, data, context);
  }

  // Log de segurança
  security(message: string, data: any = {}, context: LogContext = {}) {
    this.log("security", message, data, context);
  }

  // Log de erro
  error(message: string, data: any = {}, context: LogContext = {}) {
    this.log("error", message, data, context);
  }

  // Log de warning
  warn(message: string, data: any = {}, context: LogContext = {}) {
    this.log("warn", message, data, context);
  }

  // Método principal de logging
  async log(level: string, message: string, data: any = {}, context: LogContext = {}) {
    const timestamp = new Date();
    const logEntry = {
      level,
      message,
      data,
      context,
      timestamp,
      functionName: context.functionName || "unknown",
      userId: context.userId || "unknown",
      requestId: context.requestId || "unknown",
    };

    // Log no console do Firebase Functions
    console.log(JSON.stringify(logEntry));

    // Salvar no Firestore para auditoria (apenas logs importantes)
    if (["security", "error", "business"].includes(level)) {
      try {
        await db.collection("systemLogs").add({
          ...logEntry,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      } catch (error) {
        console.error("Erro ao salvar log no Firestore:", error);
      }
    }

    // Log específico para segurança
    if (level === "security") {
      try {
        await db.collection("securityLogs").add({
          ...logEntry,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      } catch (error) {
        console.error("Erro ao salvar log de segurança:", error);
      }
    }
  }

  // Log de performance
  performance(operation: string, duration: number, data: any = {}, context: LogContext = {}) {
    this.log("performance", `${operation} completed in ${duration}ms`, { duration, ...data }, context);
  }

  // Log de acesso
  access(method: string, path: string, userId: string, ip: string, userAgent: string, statusCode: number, duration: number) {
    this.log("access", `${method} ${path}`, {
      method,
      path,
      userId,
      ip,
      userAgent,
      statusCode,
      duration,
    }, { functionName: "http" });
  }
}

export const logger = new Logger(); 