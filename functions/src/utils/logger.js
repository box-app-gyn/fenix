"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
exports.createRequestContext = exports.logger = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const db = admin.firestore();
// Função para criar contexto de requisição
function createRequestContext(req = null) {
  return {
    functionName: "unknown",
    userId: "unknown",
    requestId: req ? req.headers["x-request-id"] || "unknown" : "unknown",
    ip: req ? req.ip || "unknown" : "unknown",
    userAgent: req ? req.headers["user-agent"] || "unknown" : "unknown",
    timestamp: new Date().toISOString(),
  };
}
exports.createRequestContext = createRequestContext;
class Logger {
  constructor() {
    this.logLevel = process.env.LOG_LEVEL || "info";
  }
  // Log de informações gerais
  info(message, data = {}, context = {}) {
    this.log("info", message, data, context);
  }
  // Log de sucesso/negócio
  business(message, data = {}, context = {}) {
    this.log("business", message, data, context);
  }
  // Log de segurança
  security(message, data = {}, context = {}) {
    this.log("security", message, data, context);
  }
  // Log de erro
  error(message, data = {}, context = {}) {
    this.log("error", message, data, context);
  }
  // Log de warning
  warn(message, data = {}, context = {}) {
    this.log("warn", message, data, context);
  }
  // Método principal de logging
  async log(level, message, data = {}, context = {}) {
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
  performance(operation, duration, data = {}, context = {}) {
    this.log("performance", `${operation} completed in ${duration}ms`, {duration, ...data}, context);
  }
  // Log de acesso
  access(method, path, userId, ip, userAgent, statusCode, duration) {
    this.log("access", `${method} ${path}`, {
      method,
      path,
      userId,
      ip,
      userAgent,
      statusCode,
      duration,
    }, {functionName: "http"});
  }
}
exports.logger = new Logger();
