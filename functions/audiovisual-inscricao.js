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
exports.criarInscricaoAudiovisual = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const logger_1 = require("../utils/logger");
const db = admin.firestore();
function validateAudiovisualData(data) {
  return !!(data.userEmail &&
        data.userName &&
        data.tipo &&
        data.experiencia &&
        data.portfolio &&
        data.telefone);
}
async function checkExistingAudiovisual(email) {
  const existing = await db
      .collection("audiovisual")
      .where("userEmail", "==", email)
      .limit(1)
      .get();
  return !existing.empty;
}
exports.criarInscricaoAudiovisual = functions.https.onCall(async (data, context) => {
  let _a;
  const contextData = {
    functionName: "criarInscricaoAudiovisual",
    userId: (_a = context.auth) === null || _a === void 0 ? void 0 : _a.uid,
  };
  try {
    // Verificar autenticação
    if (!context.auth) {
      logger_1.logger.security("Tentativa de inscrição não autenticada", {}, contextData);
      throw new functions.https.HttpsError("unauthenticated", "Usuário não autenticado");
    }
    // Validar dados
    if (!validateAudiovisualData(data)) {
      throw new functions.https.HttpsError("invalid-argument", "Dados incompletos");
    }
    // Verificar se já existe inscrição
    const existing = await checkExistingAudiovisual(data.userEmail);
    if (existing) {
      throw new functions.https.HttpsError("already-exists", "Já existe uma inscrição para este email");
    }
    // Criar inscrição usando transação
    const result = await db.runTransaction(async (transaction) => {
      const inscricaoRef = db.collection("audiovisual").doc();
      const inscricaoData = {
        userId: context.auth.uid,
        userEmail: data.userEmail,
        userName: data.userName,
        tipo: data.tipo,
        experiencia: data.experiencia,
        portfolio: data.portfolio,
        telefone: data.telefone,
        status: "pending",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };
      transaction.set(inscricaoRef, inscricaoData);
      return inscricaoRef.id;
    });
    logger_1.logger.business("Inscrição audiovisual criada", {
      inscricaoId: result,
      tipo: data.tipo,
    }, contextData);
    return {
      success: true,
      inscricaoId: result,
    };
  } catch (error) {
    logger_1.logger.error("Erro ao criar inscrição audiovisual", {
      error: error.message,
      userEmail: data.userEmail,
    }, contextData);
    throw error;
  }
});
// # sourceMappingURL=audiovisual-inscricao.js.map
