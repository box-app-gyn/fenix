import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { logger } from '../utils/logger';

const db = admin.firestore();

interface ChatMessage {
  userId: string;
  userName: string;
  message: string;
  timestamp: admin.firestore.Timestamp;
}

interface ChatSession {
  sessionId: string;
  participants: string[];
  createdAt: admin.firestore.Timestamp;
}

export const sendMessage = functions.https.onCall(async (data: { sessionId: string; message: string }, context) => {
  const contextData = { 
    functionName: 'sendMessage', 
    userId: context.auth?.uid 
  };

  try {
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'Usuário não autenticado');
    }

    const { sessionId, message } = data;
    
    // Buscar dados do usuário
    const userDoc = await db.collection('users').doc(context.auth.uid).get();
    const userData = userDoc.data();
    
    const chatMessage: ChatMessage = {
      userId: context.auth.uid,
      userName: userData?.displayName || userData?.email || 'Usuário',
      message,
      timestamp: admin.firestore.Timestamp.now(),
    };

    await db.collection('chat_sessions').doc(sessionId).collection('messages').add(chatMessage);

    return { success: true };

  } catch (error: any) {
    logger.error('Erro ao enviar mensagem', { error: error.message }, contextData);
    throw error;
  }
});

export const getChatHistory = functions.https.onCall(async (data: { sessionId: string; limit?: number }, context) => {
  const contextData = { 
    functionName: 'getChatHistory', 
    userId: context.auth?.uid 
  };

  try {
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'Usuário não autenticado');
    }

    const { sessionId, limit = 50 } = data;
    
    const messagesSnapshot = await db
      .collection('chat_sessions').doc(sessionId).collection('messages')
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .get();

    const messages = messagesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return { messages: messages.reverse() };

  } catch (error: any) {
    logger.error('Erro ao buscar histórico do chat', { error: error.message }, contextData);
    throw error;
  }
});

export const saveFeedback = functions.https.onCall(async (data: { sessionId: string; feedback: string; rating: number }, context) => {
  const contextData = { 
    functionName: 'saveFeedback', 
    userId: context.auth?.uid 
  };

  try {
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'Usuário não autenticado');
    }

    const { sessionId, feedback, rating } = data;
    
    await db.collection('feedback').add({
      sessionId,
      userId: context.auth.uid,
      feedback,
      rating,
      timestamp: admin.firestore.Timestamp.now(),
    });

    return { success: true };

  } catch (error: any) {
    logger.error('Erro ao salvar feedback', { error: error.message }, contextData);
    throw error;
  }
});

export const createSession = functions.https.onCall(async (data: { participants: string[] }, context) => {
  const contextData = { 
    functionName: 'createSession', 
    userId: context.auth?.uid 
  };

  try {
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'Usuário não autenticado');
    }

    const { participants } = data;
    
    const sessionRef = await db.collection('chat_sessions').add({
      participants: [...participants, context.auth.uid],
      createdAt: admin.firestore.Timestamp.now(),
      createdBy: context.auth.uid,
    });

    return { sessionId: sessionRef.id };

  } catch (error: any) {
    logger.error('Erro ao criar sessão de chat', { error: error.message }, contextData);
    throw error;
  }
});

export const pollMessages = functions.https.onCall(async (data: { sessionId: string; lastMessageId?: string }, context) => {
  const contextData = { 
    functionName: 'pollMessages', 
    userId: context.auth?.uid 
  };

  try {
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'Usuário não autenticado');
    }

    const { sessionId, lastMessageId } = data;
    
    let query = db
      .collection('chat_sessions').doc(sessionId).collection('messages')
      .orderBy('timestamp', 'desc')
      .limit(10);

    if (lastMessageId) {
      const lastMessage = await db
        .collection('chat_sessions').doc(sessionId).collection('messages')
        .doc(lastMessageId).get();
      
      if (lastMessage.exists) {
        query = query.startAfter(lastMessage);
      }
    }

    const messagesSnapshot = await query.get();
    const messages = messagesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return { messages: messages.reverse() };

  } catch (error: any) {
    logger.error('Erro ao buscar novas mensagens', { error: error.message }, contextData);
    throw error;
  }
}); 