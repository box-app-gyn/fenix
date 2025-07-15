import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { logger } from '../utils/logger';

const db = admin.firestore();

interface CriarInscricaoTimeData {
  userId: string;
  timeData: {
    nome: string;
    categoria: string;
    lote: number;
    integrantes: string[];
  };
}

export const criarInscricaoTime = functions.https.onCall(async (data: CriarInscricaoTimeData, context) => {
  const contextData = { 
    functionName: 'criarInscricaoTime', 
    userId: context.auth?.uid 
  };

  try {
    // Verificar autenticação
    if (!context.auth) {
      logger.security('Tentativa de inscrição não autenticada', {}, contextData);
      throw new functions.https.HttpsError('unauthenticated', 'Usuário não autenticado');
    }

    const { userId, timeData } = data;

    // Verificar se o usuário é o dono da inscrição
    if (context.auth.uid !== userId) {
      logger.security('Tentativa de inscrição por usuário não autorizado', { userId }, contextData);
      throw new functions.https.HttpsError('permission-denied', 'Usuário não autorizado');
    }

    // Criar inscrição do time
    const inscricaoRef = await db.collection('inscricoes_times').add({
      userId,
      ...timeData,
      status: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    logger.business('Inscrição de time criada', { 
      inscricaoId: inscricaoRef.id, 
      categoria: timeData.categoria 
    }, contextData);

    return { 
      success: true, 
      inscricaoId: inscricaoRef.id 
    };

  } catch (error: any) {
    logger.error('Erro ao criar inscrição de time', { 
      error: error.message, 
      userId: data.userId 
    }, contextData);
    throw error;
  }
}); 