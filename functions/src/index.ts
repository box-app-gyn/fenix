// ============================================================================
// FIREBASE FUNCTIONS - INDEX
// ============================================================================

import * as functions from 'firebase-functions';
import { db, admin } from './firebase-admin';

// ============================================================================
// FUNÇÕES ESSENCIAIS
// ============================================================================

// Função simples de teste
export const testFunction = functions.https.onCall(async (data, context: any) => {
  try {
    if (!context?.auth) {
      throw new Error('Usuário não autenticado');
    }

    return {
      success: true,
      message: 'Função de teste funcionando!',
      userId: context.auth.uid,
    };
  } catch (error) {
    console.error('Erro na função de teste:', error);
    throw error;
  }
});

// Função para criar inscrição de time

export const criarInscricaoTime = functions.https.onRequest(async (req, res) => {
  try {
    const { userId, timeData } = req.body

    if (!userId || !timeData) {
      res.status(400).json({ success: false, msg: 'Dados incompletos' })
      return
    }

    const inscricaoRef = await db.collection('inscricoes_times').add({
      userId,
      ...timeData,
      status: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    })

    console.log('Inscrição de time criada:', {
      inscricaoId: inscricaoRef.id,
      categoria: timeData.categoria,
    })

    res.status(200).json({ success: true, inscricaoId: inscricaoRef.id })
  } catch (error) {
    console.error('Erro ao criar inscrição de time:', error)
    res.status(500).json({ success: false, msg: 'Erro interno' })
  }
})

// Função para validar audiovisual
export const validaAudiovisual = functions.https.onCall(async (data: any, context: any) => {
  try {
    if (!context?.auth) {
      throw new Error('Usuário não autenticado');
    }

    const { audiovisualId, adminId, aprovado, motivoRejeicao } = data;

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

// Webhook OpenPix (HTTP function)
export const openpixWebhook = functions.https.onRequest(async (req, res) => {
  // Configurar CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  // Responder a requisições OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  // Apenas aceitar POST
  if (req.method !== 'POST') {
    res.status(405).send('Method not allowed');
    return;
  }

  try {
    console.log('Webhook OpenPix recebido:', req.body);
    
    // Processar webhook aqui
    const { charge } = req.body;
    
    if (charge && charge.status === 'COMPLETED') {
      // Atualizar status do pagamento no Firestore
      await db.collection('pagamentos').doc(charge.correlationID).update({
        status: 'completed',
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        webhookData: req.body
      });
      
      console.log('Pagamento processado com sucesso:', charge.correlationID);
    }
    
    res.status(200).send('OK');
  } catch (error) {
    console.error('Erro no webhook OpenPix:', error);
    res.status(500).send('Internal Server Error');
  }
});

// ============================================================================
// FUNÇÕES DE EMAIL
// ============================================================================

// Função para enviar email de boas-vindas
export const enviarEmailBoasVindas = functions.https.onCall(async (data: any, context: any) => {
  try {
    if (!context?.auth) {
      throw new Error('Usuário não autenticado');
    }

    const { userId } = data;
    
    // Buscar dados do usuário
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      throw new Error('Usuário não encontrado');
    }

    const userData = userDoc.data();
    
    // Aqui você implementaria o envio do email
    console.log('Enviando email de boas-vindas para:', userData?.email);
    
    return { success: true, message: 'Email de boas-vindas enviado' };
  } catch (error) {
    console.error('Erro ao enviar email de boas-vindas:', error);
    throw error;
  }
}); 