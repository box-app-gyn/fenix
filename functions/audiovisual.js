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
exports.validaAudiovisual = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const db = admin.firestore();
exports.validaAudiovisual = functions.https.onCall(async (data, context) => {
  let _a; let _b; let _c;
  const contextData = {
    functionName: "validaAudiovisual",
    userId: (_a = context === null || context === void 0 ? void 0 : context.auth) === null || _a === void 0 ? void 0 : _a.uid,
  };
  try {
    // Verificar autenticação
    if (!(context === null || context === void 0 ? void 0 : context.auth)) {
      console.log("Tentativa de acesso não autenticado", contextData);
      throw new functions.https.HttpsError("unauthenticated", "Usuário não autenticado");
    }
    const {audiovisualId, adminId, aprovado, motivoRejeicao} = data;
    // Verificar se é admin
    const adminUser = await db.collection("users").doc(adminId).get();
    if (!adminUser.exists || ((_b = adminUser.data()) === null || _b === void 0 ? void 0 : _b.role) !== "admin") {
      console.log("Tentativa de validação por não-admin", {adminId}, contextData);
      throw new functions.https.HttpsError("permission-denied", "Apenas admins podem validar profissionais audiovisuais");
    }
    // Buscar profissional audiovisual
    const audiovisualRef = db.collection("audiovisual").doc(audiovisualId);
    const audiovisualDoc = await audiovisualRef.get();
    if (!audiovisualDoc.exists) {
      throw new functions.https.HttpsError("not-found", "Profissional audiovisual não encontrado");
    }
    const audiovisualData = audiovisualDoc.data();
    const tipo = (audiovisualData === null || audiovisualData === void 0 ? void 0 : audiovisualData.tipo) || "fotografo";
    // Atualizar status do profissional audiovisual
    const updateData = {
      status: aprovado ? "approved" : "rejected",
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    if (aprovado) {
      updateData.aprovadoPor = adminId;
      updateData.aprovadoEm = admin.firestore.FieldValue.serverTimestamp();
    } else {
      updateData.rejeitadoPor = adminId;
      updateData.rejeitadoEm = admin.firestore.FieldValue.serverTimestamp();
      updateData.motivoRejeicao = motivoRejeicao || "Não especificado";
    }
    await audiovisualRef.update(updateData);
    // Atualizar role do usuário se aprovado
    if (aprovado) {
      await db.collection("users").doc(audiovisualData === null || audiovisualData === void 0 ? void 0 : audiovisualData.userId).update({
        role: tipo, // 'fotografo', 'videomaker', 'editor', etc.
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
    // Log da ação
    const logData = {
      adminId,
      adminEmail: (_c = adminUser.data()) === null || _c === void 0 ? void 0 : _c.email,
      acao: aprovado ? "aprovacao_audiovisual" : "rejeicao_audiovisual",
      targetId: audiovisualId,
      targetType: "audiovisual",
      detalhes: {
        tipo,
        aprovado,
        motivoRejeicao: motivoRejeicao || null,
      },
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    await db.collection("adminLogs").add(logData);
    console.log("Profissional audiovisual validado", {audiovisualId, aprovado, tipo}, contextData);
    return {success: true, audiovisualId, aprovado};
  } catch (error) {
    console.error("Erro ao validar profissional audiovisual", {
      error: error.message,
      audiovisualId: data.audiovisualId,
    }, contextData);
    throw error;
  }
});
// Função auxiliar para enviar email (será implementada em emails.ts)
async function enviaEmailConfirmacao(data) {
  // Implementação será movida para emails.ts
  console.log("Enviando email de confirmação:", data);
}
// # sourceMappingURL=audiovisual.js.map
