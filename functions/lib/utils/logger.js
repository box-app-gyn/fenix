"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
exports.createRequestContext = createRequestContext;
const admin = __importStar(require("firebase-admin"));
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
                await db.collection("systemLogs").add(Object.assign(Object.assign({}, logEntry), { createdAt: admin.firestore.FieldValue.serverTimestamp() }));
            }
            catch (error) {
                console.error("Erro ao salvar log no Firestore:", error);
            }
        }
        // Log específico para segurança
        if (level === "security") {
            try {
                await db.collection("securityLogs").add(Object.assign(Object.assign({}, logEntry), { createdAt: admin.firestore.FieldValue.serverTimestamp() }));
            }
            catch (error) {
                console.error("Erro ao salvar log de segurança:", error);
            }
        }
    }
    // Log de performance
    performance(operation, duration, data = {}, context = {}) {
        this.log("performance", `${operation} completed in ${duration}ms`, Object.assign({ duration }, data), context);
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
        }, { functionName: "http" });
    }
}
exports.logger = new Logger();
//# sourceMappingURL=logger.js.map