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
    console.log("Iniciando criação de checkout FlowPay", {
      userEmail: data.userEmail,
      userName: data.userName,
      tipo: data.tipo,
      contextData,
    });

    // Verificar autenticação
    if (!request.auth) {
      console.log("Tentativa de checkout não autenticada", contextData);
      throw new Error("Usuário não autenticado");
    }

    // Verificar se a API key está configurada
    if (!process.env.FLOWPAY_API_KEY) {
      console.log("FLOWPAY_API_KEY não configurada - usando modo de simulação", contextData);
      
      // Modo de simulação para desenvolvimento/teste
      const simulatedCheckoutId = `sim_${Date.now()}_${request.auth.uid}`;
      const simulatedCheckoutUrl = "https://interbox-app-8d400.web.app/audiovisual/success?order_id=simulated&status=paid";
      
      // Salvar dados do checkout simulado no Firestore
      const checkoutRef = db.collection("audiovisual_checkouts").doc();
      await checkoutRef.set({
        userId: request.auth.uid,
        userEmail: data.userEmail,
        userName: data.userName,
        flowpayOrderId: simulatedCheckoutId,
        externalId: `sim_audiovisual_${Date.now()}_${request.auth.uid}`,
        amount: 2990,
        status: "pending",
        audiovisualData: data,
        checkoutUrl: simulatedCheckoutUrl,
        isSimulated: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log("Checkout simulado criado", {
        checkoutId: checkoutRef.id,
        simulatedOrderId: simulatedCheckoutId,
        userEmail: data.userEmail,
        contextData,
      });

      return {
        success: true,
        checkoutId: checkoutRef.id,
        flowpayOrderId: simulatedCheckoutId,
        checkoutUrl: simulatedCheckoutUrl,
        amount: 2990,
        isSimulated: true,
      };
    }

    // Validar dados com mais detalhes
    console.log("Validando dados do formulário", {
      userEmail: !!data.userEmail,
      userName: !!data.userName,
      tipo: !!data.tipo,
      experiencia: !!data.experiencia,
      portfolio: !!data.portfolio,
      telefone: !!data.telefone,
      contextData,
    });

    if (!validateAudiovisualData(data)) {
      console.error("Dados do formulário inválidos", {
        data: data,
        contextData,
      });
      throw new Error("Dados incompletos ou inválidos");
    }

    // Verificar se já existe inscrição
    const existing = await checkExistingAudiovisual(data.userEmail);
    if (existing) {
      console.log("Inscrição já existe para este email", {
        userEmail: data.userEmail,
        contextData,
      });
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

    console.log("Configuração FlowPay preparada", {
      externalId: flowpayConfig.externalId,
      amount: flowpayConfig.amount,
      contextData,
    });

    // Criar checkout na OpenPix
    const openpixResponse = await fetch(
      "https://api.openpix.com.br/api/v1/charge",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": process.env.FLOWPAY_API_KEY, // OpenPix usa a API key diretamente
        },
        body: JSON.stringify({
          correlationID: flowpayConfig.externalId,
          value: flowpayConfig.amount,
          comment: flowpayConfig.description,
          identifier: data.userEmail,
          customer: {
            name: data.userName,
            email: data.userEmail,
            phone: data.telefone,
          },
          additionalInfo: [
            {
              key: "tipo",
              value: data.tipo
            },
            {
              key: "experiencia", 
              value: data.experiencia
            },
            {
              key: "portfolio",
              value: data.portfolio
            }
          ]
        }),
      }
    );

    console.log("Resposta da OpenPix recebida", {
      status: openpixResponse.status,
      statusText: openpixResponse.statusText,
      contextData,
    });

    if (!openpixResponse.ok) {
      const errorData = await openpixResponse.json();
      console.error("Erro ao criar checkout OpenPix", {
        error: errorData,
        userEmail: data.userEmail,
        status: openpixResponse.status,
        statusText: openpixResponse.statusText,
        contextData,
      });
      throw new Error(`Erro ao criar checkout: ${openpixResponse.status} ${openpixResponse.statusText}`);
    }

    const checkoutData = await openpixResponse.json();

    console.log("Checkout OpenPix criado com sucesso", {
      openpixChargeId: checkoutData.charge.pixKey,
      qrCode: checkoutData.charge.qrCode,
      contextData,
    });

    // Salvar dados do checkout no Firestore
    const checkoutRef = db.collection("audiovisual_checkouts").doc();
    await checkoutRef.set({
      userId: request.auth.uid,
      userEmail: data.userEmail,
      userName: data.userName,
      openpixChargeId: checkoutData.charge.pixKey,
      openpixCorrelationId: flowpayConfig.externalId,
      amount: flowpayConfig.amount,
      status: "pending",
      audiovisualData: data,
      qrCode: checkoutData.charge.qrCode,
      pixKey: checkoutData.charge.pixKey,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log("Checkout salvo no Firestore", {
      checkoutId: checkoutRef.id,
      openpixChargeId: checkoutData.charge.pixKey,
      userEmail: data.userEmail,
      amount: flowpayConfig.amount,
      contextData,
    });

    return {
      success: true,
      checkoutId: checkoutRef.id,
      openpixChargeId: checkoutData.charge.pixKey,
      qrCode: checkoutData.charge.qrCode,
      pixKey: checkoutData.charge.pixKey,
      amount: flowpayConfig.amount,
    };
  } catch (error: any) {
    console.error("Erro ao criar checkout FlowPay", {
      error: error.message,
      errorStack: error.stack,
      userEmail: data?.userEmail,
      contextData,
    });
    
    // Retornar erro mais específico
    throw new Error(`Erro interno: ${error.message}`);
  }
});

/**
 * Webhook para processar retornos da OpenPix
 */
export const webhookOpenPix = onCall(async (request) => {
  const webhookData = request.data as any;
  
  const contextData = {
    functionName: "webhookOpenPix",
    correlationId: webhookData?.correlationID,
  };

  try {
    console.log("Webhook OpenPix recebido", {
      event: webhookData?.event,
      correlationId: webhookData?.correlationID,
      status: webhookData?.status,
      contextData,
    });

    // Processar evento baseado no tipo
    switch (webhookData.event) {
      case 'CHARGE_CONFIRMED':
        await processPaymentSuccess(webhookData);
        break;
      case 'CHARGE_EXPIRED':
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
    console.error("Erro ao processar webhook OpenPix", {
      error: error.message,
      correlationId: webhookData?.correlationID,
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
    correlationId: webhookData.correlationID,
  };

  try {
    // Buscar checkout no Firestore
    const checkoutQuery = await db
      .collection("audiovisual_checkouts")
      .where("openpixCorrelationId", "==", webhookData.correlationID)
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
        equipamentos: audiovisualData.equipamentos ? audiovisualData.equipamentos.split(',').map((e: string) => e.trim()) : [], // ✅ Array de equipamentos
        especialidades: audiovisualData.especialidades ? audiovisualData.especialidades.split(',').map((e: string) => e.trim()) : [], // ✅ Array de especialidades
      },
      termosAceitos: true, // ✅ Sempre true após pagamento
      termosAceitosEm: admin.firestore.FieldValue.serverTimestamp(), // ✅ Timestamp
      status: "pending", // ✅ Status inicial
      payment: {
        status: "paid",
        openpixChargeId: webhookData.correlationID,
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
      correlationId: webhookData.correlationID,
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