// ============================================================================
// FIREBASE FUNCTIONS - INDEX
// ============================================================================

// Importar funções existentes
export * from './teams';
export * from './pedidos';
export * from './audiovisual';
export * from './audiovisual-inscricao';

// Dashboard API - Removida para simplificar

// ============================================================================
// FUNÇÕES LEGADAS (mantidas para compatibilidade)
// ============================================================================

import { onCall } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';

// Inicializar Firebase Admin se não estiver inicializado
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// Função simples de teste
export const testFunction = onCall(async (request) => {
  try {
    if (!request.auth) {
      throw new Error('Usuário não autenticado');
    }

    return {
      success: true,
      message: 'Função de teste funcionando!',
      userId: request.auth.uid,
    };
  } catch (error) {
    console.error('Erro na função de teste:', error);
    throw error;
  }
});

// Função para criar inscrição de time
export const criarInscricaoTime = onCall(async (request) => {
  try {
    if (!request.auth) {
      throw new Error('Usuário não autenticado');
    }

    const { userId, timeData } = request.data;

    // Verificar se o usuário é o dono da inscrição
    if (request.auth.uid !== userId) {
      throw new Error('Usuário não autorizado');
    }

    // Criar inscrição do time
    const inscricaoRef = await db.collection('inscricoes_times').add({
      userId,
      ...timeData,
      status: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log('Inscrição de time criada:', {
      inscricaoId: inscricaoRef.id,
      categoria: timeData.categoria,
    });
    return { success: true, inscricaoId: inscricaoRef.id };
  } catch (error) {
    console.error('Erro ao criar inscrição de time:', error);
    throw error;
  }
});

// Função para validar audiovisual
export const validaAudiovisual = onCall(async (request) => {
  try {
    if (!request.auth) {
      throw new Error('Usuário não autenticado');
    }

    const { audiovisualId, adminId, aprovado, motivoRejeicao } = request.data;

    // Verificar se é admin
    const adminUser = await db.collection('users').doc(adminId).get();
    if (!adminUser.exists ||
        (adminUser.data()?.role !== 'admin')) {
      throw new Error('Apenas admins podem validar profissionais audiovisuais');
    }

    // Buscar profissional audiovisual
    const audiovisualRef = db.collection('audiovisual').doc(audiovisualId);
    const audiovisualDoc = await audiovisualRef.get();

    if (!audiovisualDoc.exists) {
      throw new Error('Profissional audiovisual não encontrado');
    }

    const audiovisualData = audiovisualDoc.data();
    const tipo = (audiovisualData && audiovisualData.tipo) || 'fotografo';

    // Atualizar status
    const updateData: any = {
      status: aprovado ? 'approved' : 'rejected',
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (aprovado) {
      updateData.aprovadoPor = adminId;
      updateData.aprovadoEm = admin.firestore.FieldValue.serverTimestamp();
    } else {
      updateData.rejeitadoPor = adminId;
      updateData.rejeitadoEm = admin.firestore.FieldValue.serverTimestamp();
      updateData.motivoRejeicao = motivoRejeicao || 'Não especificado';
    }

    await audiovisualRef.update(updateData);

    // Atualizar role do usuário se aprovado
    if (aprovado && audiovisualData && audiovisualData.userId) {
      await db.collection('users').doc(audiovisualData.userId).update({
        role: tipo,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    console.log('Profissional audiovisual validado:', {
      audiovisualId,
      aprovado,
      tipo,
    });
    return { success: true, audiovisualId, aprovado };
  } catch (error) {
    console.error('Erro ao validar profissional audiovisual:', error);
    throw error;
  }
});

// ============================================================================
// EXPORTAÇÕES PARA COMPATIBILIDADE
// ============================================================================

// Exportar todas as funções para o sistema de build do Firebase
export default {
  // Funções legadas
  testFunction,
  criarInscricaoTime,
  validaAudiovisual,
  
  // Funções do dashboard (exportadas automaticamente via export *)
}; 