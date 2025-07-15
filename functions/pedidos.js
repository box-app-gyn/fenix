"use strict";
const __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  let desc = Object.getOwnPropertyDescriptor(m, k);
  if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
    desc = {enumerable: true, get: function() {
      return m[k];
    }};
  }
  Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
}));
const __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
  Object.defineProperty(o, "default", {enumerable: true, value: v});
}) : function(o, v) {
  o["default"] = v;
});
const __importStar = (this && this.__importStar) || (function() {
  let ownKeys = function(o) {
    ownKeys = Object.getOwnPropertyNames || function(o) {
      const ar = [];
      for (const k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
      return ar;
    };
    return ownKeys(o);
  };
  return function(mod) {
    if (mod && mod.__esModule) return mod;
    const result = {};
    if (mod != null) for (let k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
    __setModuleDefault(result, mod);
    return result;
  };
})();
Object.defineProperty(exports, "__esModule", {value: true});
exports.criarInscricaoTime = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const logger_1 = require("../utils/logger");
const db = admin.firestore();
exports.criarInscricaoTime = functions.https.onCall(async (data, context) => {
  let _a;
  const contextData = {
    functionName: "criarInscricaoTime",
    userId: (_a = context.auth) === null || _a === void 0 ? void 0 : _a.uid,
  };
  try {
    // Verificar autenticação
    if (!context.auth) {
      logger_1.logger.security("Tentativa de inscrição não autenticada", {}, contextData);
      throw new functions.https.HttpsError("unauthenticated", "Usuário não autenticado");
    }
    const {userId, timeData} = data;
    // Verificar se o usuário é o dono da inscrição
    if (context.auth.uid !== userId) {
      logger_1.logger.security("Tentativa de inscrição por usuário não autorizado", {userId}, contextData);
      throw new functions.https.HttpsError("permission-denied", "Usuário não autorizado");
    }
    // Criar inscrição do time
    const inscricaoRef = await db.collection("inscricoes_times").add(Object.assign(Object.assign({userId}, timeData), {status: "pending", createdAt: admin.firestore.FieldValue.serverTimestamp(), updatedAt: admin.firestore.FieldValue.serverTimestamp()}));
    logger_1.logger.business("Inscrição de time criada", {
      inscricaoId: inscricaoRef.id,
      categoria: timeData.categoria,
    }, contextData);
    return {
      success: true,
      inscricaoId: inscricaoRef.id,
    };
  } catch (error) {
    logger_1.logger.error("Erro ao criar inscrição de time", {
      error: error.message,
      userId: data.userId,
    }, contextData);
    throw error;
  }
});
// # sourceMappingURL=pedidos.js.map
