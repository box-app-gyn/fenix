import { onCall } from 'firebase-functions/v2/https';
import { db, admin } from './firebase-admin';

// ============================================================================
// VALIDAÇÕES
// ============================================================================

/**
 * Valida dados do formulário audiovisual
 */
function validateAudiovisualData(data: any): boolean {
  return !!(
    data.userEmail &&
    data.userName &&
    data.tipo &&
    data.experiencia &&
    data.portfolio &&
    data.telefone
  );
}

/**
 * Verifica se já existe inscrição para o email
 */
async function checkExistingAudiovisual(email: string): Promise<boolean> {
  const existing = await db
    .collection("audiovisual")
    .where("userEmail", "==", email)
    .limit(1)
    .get();
  
  return !existing.empty;
}

// ============================================================================
// FUNÇÕES PRINCIPAIS
// ============================================================================

/**
 * Cria checkout na FlowPay para inscrição audiovisual
 */
export const criarCheckoutFlowPay = onCall(async (request) => {
  const data = request.data as any;
  
  const contextData = {
    functionName: "criarCheckoutFlowPay",
    userId: request.auth?.uid,
  };

  try {
    // Verificar autenticação
    if (!request.auth) {
      console.log("Tentativa de checkout não autenticada", contextData);
      throw new Error("Usuário não autenticado");
    }

    // Validar dados
    if (!validateAudiovisualData(data)) {
      throw new Error("Dados incompletos");
    }

    // Verificar se já existe inscrição
    const existing = await checkExistingAudiovisual(data.userEmail);
    if (existing) {
      throw new Error("Já existe uma inscrição para este email");
    }

    // Configurações da FlowPay
    const flowpayConfig = {
      amount: 2990, // R$ 29,90 em centavos
      currency: "BRL",
      description: "Inscrição Audiovisual - CERRADØ INTERBOX 2025",
      externalId: `audiovisual_${Date.now()}_${request.auth.uid}`,
      customer: {
        name: data.userName,
        email: data.userEmail,
        phone: data.telefone,
      },
      items: [
        {
          name: "Inscrição Audiovisual",
          description: `Candidatura para ${data.tipo} - CERRADØ INTERBOX 2025`,
          quantity: 1,
          unitAmount: 2990,
        },
      ],
      redirectUrl: "https://interbox-app-8d400.web.app/audiovisual/success",
      webhookUrl: "https://us-central1-interbox-app-8d400.cloudfunctions.net/webhookFlowPay",
    };

    // Criar checkout na FlowPay
    const flowpayResponse = await fetch(
      "https://api.flowpay.com.br/v1/orders",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.FLOWPAY_API_KEY}`,
          "X-Idempotency-Key": flowpayConfig.externalId,
        },
        body: JSON.stringify(flowpayConfig),
      }
    );

    if (!flowpayResponse.ok) {
      const errorData = await flowpayResponse.json();
      console.error("Erro ao criar checkout FlowPay", {
        error: errorData,
        userEmail: data.userEmail,
        status: flowpayResponse.status,
        contextData,
      });
      throw new Error("Erro ao criar checkout");
    }

    const checkoutData = await flowpayResponse.json();

    // Salvar dados do checkout no Firestore
    const checkoutRef = db.collection("audiovisual_checkouts").doc();
    await checkoutRef.set({
      userId: request.auth.uid,
      userEmail: data.userEmail,
      userName: data.userName,
      flowpayOrderId: checkoutData.id,
      externalId: flowpayConfig.externalId,
      amount: flowpayConfig.amount,
      status: "pending",
      audiovisualData: data,
      checkoutUrl: checkoutData.checkoutUrl,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log("Checkout FlowPay criado", {
      checkoutId: checkoutRef.id,
      flowpayOrderId: checkoutData.id,
      userEmail: data.userEmail,
      amount: flowpayConfig.amount,
      contextData,
    });

    return {
      success: true,
      checkoutId: checkoutRef.id,
      flowpayOrderId: checkoutData.id,
      checkoutUrl: checkoutData.checkoutUrl,
      amount: flowpayConfig.amount,
    };
  } catch (error: any) {
    console.error("Erro ao criar checkout FlowPay", {
      error: error.message,
      userEmail: data.userEmail,
      contextData,
    });
    throw error;
  }
});

/**
 * Webhook para processar retornos da FlowPay
 */
export const webhookFlowPay = onCall(async (request) => {
  const webhookData = request.data as any;
  
  const contextData = {
    functionName: "webhookFlowPay",
    orderId: webhookData?.id,
  };

  try {
    console.log("Webhook FlowPay recebido", {
      event: webhookData?.event,
      orderId: webhookData?.id,
      status: webhookData?.status,
      contextData,
    });

    // Processar evento baseado no tipo
    switch (webhookData.event) {
      case 'order.paid':
        await processPaymentSuccess(webhookData);
        break;
      case 'order.cancelled':
        await processPaymentCancelled(webhookData);
        break;
      case 'order.expired':
        await processPaymentExpired(webhookData);
        break;
      default:
        console.log("Evento não processado", {
          event: webhookData.event,
          contextData,
        });
    }

    return { success: true };
  } catch (error: any) {
    console.error("Erro ao processar webhook FlowPay", {
      error: error.message,
      orderId: webhookData?.id,
      contextData,
    });
    throw error;
  }
});

// ============================================================================
// FUNÇÕES AUXILIARES
// ============================================================================

/**
 * Processa pagamento aprovado
 */
async function processPaymentSuccess(webhookData: any) {
  const contextData = {
    functionName: "processPaymentSuccess",
    orderId: webhookData.id,
  };

  try {
    // Buscar checkout no Firestore
    const checkoutQuery = await db
      .collection("audiovisual_checkouts")
      .where("flowpayOrderId", "==", webhookData.id)
      .limit(1)
      .get();

    if (checkoutQuery.empty) {
      console.error("Checkout não encontrado para pagamento aprovado", {
        orderId: webhookData.id,
        contextData,
      });
      return;
    }

    const checkoutDoc = checkoutQuery.docs[0];
    const checkoutData = checkoutDoc.data();

    // Atualizar status do checkout
    await checkoutDoc.ref.update({
      status: "paid",
      paidAt: admin.firestore.FieldValue.serverTimestamp(),
      paymentData: webhookData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Criar inscrição audiovisual
    const audiovisualData = checkoutData.audiovisualData;
    const inscricaoRef = db.collection("audiovisual").doc();

    // Estruturar dados conforme interface TypeScript
    const inscricaoData = {
      userId: checkoutData.userId,
      userEmail: audiovisualData.userEmail,
      nome: audiovisualData.userName, // ✅ Campo correto
      telefone: audiovisualData.telefone,
      tipo: audiovisualData.tipo,
      comentariosOutro: audiovisualData.comentariosOutro || '', // ✅ Campo de comentários para "outro"
      portfolio: {
        urls: audiovisualData.portfolio ? [audiovisualData.portfolio] : [], // ✅ Array de URLs
        descricao: audiovisualData.portfolio || '', // ✅ Descrição do portfólio
        experiencia: audiovisualData.experiencia || '', // ✅ Experiência
        equipamentos: audiovisualData.equipamentos ? audiovisualData.equipamentos.split(',').map(e => e.trim()) : [], // ✅ Array de equipamentos
        especialidades: audiovisualData.especialidades ? audiovisualData.especialidades.split(',').map(e => e.trim()) : [], // ✅ Array de especialidades
      },
      termosAceitos: true, // ✅ Sempre true após pagamento
      termosAceitosEm: admin.firestore.FieldValue.serverTimestamp(), // ✅ Timestamp
      status: "pending", // ✅ Status inicial
      payment: {
        status: "paid",
        flowpayOrderId: webhookData.id,
        amount: checkoutData.amount,
        paidAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      checkoutId: checkoutDoc.id,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await inscricaoRef.set(inscricaoData);

    console.log("Inscrição audiovisual confirmada após pagamento", {
      inscricaoId: inscricaoRef.id,
      checkoutId: checkoutDoc.id,
      orderId: webhookData.id,
      userEmail: audiovisualData.userEmail,
      contextData,
    });
  } catch (error: any) {
    console.error("Erro ao processar pagamento aprovado", {
      error: error.message,
      orderId: webhookData.id,
      contextData,
    });
    throw error;
  }
}

/**
 * Processa pagamento cancelado
 */
async function processPaymentCancelled(webhookData: any) {
  const contextData = {
    functionName: "processPaymentCancelled",
    orderId: webhookData.id,
  };

  try {
    // Buscar checkout no Firestore
    const checkoutQuery = await db
      .collection("audiovisual_checkouts")
      .where("flowpayOrderId", "==", webhookData.id)
      .limit(1)
      .get();

    if (!checkoutQuery.empty) {
      const checkoutDoc = checkoutQuery.docs[0];
      await checkoutDoc.ref.update({
        status: "cancelled",
        cancelledAt: admin.firestore.FieldValue.serverTimestamp(),
        paymentData: webhookData,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log("Checkout cancelado", {
        checkoutId: checkoutDoc.id,
        orderId: webhookData.id,
        contextData,
      });
    }
  } catch (error: any) {
    console.error("Erro ao processar pagamento cancelado", {
      error: error.message,
      orderId: webhookData.id,
      contextData,
    });
    throw error;
  }
}

/**
 * Processa pagamento expirado
 */
async function processPaymentExpired(webhookData: any) {
  const contextData = {
    functionName: "processPaymentExpired",
    orderId: webhookData.id,
  };

  try {
    // Buscar checkout no Firestore
    const checkoutQuery = await db
      .collection("audiovisual_checkouts")
      .where("flowpayOrderId", "==", webhookData.id)
      .limit(1)
      .get();

    if (!checkoutQuery.empty) {
      const checkoutDoc = checkoutQuery.docs[0];
      await checkoutDoc.ref.update({
        status: "expired",
        expiredAt: admin.firestore.FieldValue.serverTimestamp(),
        paymentData: webhookData,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log("Checkout expirado", {
        checkoutId: checkoutDoc.id,
        orderId: webhookData.id,
        contextData,
      });
    }
  } catch (error: any) {
    console.error("Erro ao processar pagamento expirado", {
      error: error.message,
      orderId: webhookData.id,
      contextData,
    });
    throw error;
  }
} 