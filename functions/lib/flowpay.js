"use strict";

const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Inicializar Firebase Admin se não estiver inicializado
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

/**
 * Valida dados do formulário audiovisual
 */
function validateAudiovisualData(data) {
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
async function checkExistingAudiovisual(email) {
  const existing = await db
    .collection("audiovisual")
    .where("userEmail", "==", email)
    .limit(1)
    .get();
  
  return !existing.empty;
}

/**
 * Cria checkout na FlowPay para inscrição audiovisual
 */
exports.criarCheckoutFlowPay = functions.https.onCall(
  async (data, context) => {
    const contextData = {
      functionName: "criarCheckoutFlowPay",
      userId: context.auth?.uid,
    };

    try {
      // Verificar autenticação
      if (!context.auth) {
        console.log("Tentativa de checkout não autenticada", contextData);
        throw new functions.https.HttpsError(
          "unauthenticated",
          "Usuário não autenticado"
        );
      }

      // Validar dados
      if (!validateAudiovisualData(data)) {
        throw new functions.https.HttpsError(
          "invalid-argument",
          "Dados incompletos"
        );
      }

      // Verificar se já existe inscrição
      const existing = await checkExistingAudiovisual(data.userEmail);
      if (existing) {
        throw new functions.https.HttpsError(
          "already-exists",
          "Já existe uma inscrição para este email"
        );
      }

      // Configurações da FlowPay
      const flowpayConfig = {
        amount: 2990, // R$ 29,90 em centavos
        currency: "BRL",
        description: "Inscrição Audiovisual - CERRADØ INTERBOX 2025",
        externalId: `audiovisual_${Date.now()}_${context.auth.uid}`,
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
        redirectUrl: `${
          functions.config().app?.url || "https://interbox-app-8d400.web.app"
        }/interbox/audiovisual/confirmacao`,
        webhookUrl: `${
          functions.config().app?.url || "https://interbox-app-8d400.web.app"
        }/api/webhooks/flowpay`,
      };

      // Criar checkout na FlowPay
      const flowpayResponse = await fetch(
        "https://api.flowpay.com.br/v1/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${functions.config().flowpay?.api_key}`,
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
        throw new functions.https.HttpsError(
          "internal",
          "Erro ao criar checkout"
        );
      }

      const checkoutData = await flowpayResponse.json();

      // Salvar dados do checkout no Firestore
      const checkoutRef = db.collection("audiovisual_checkouts").doc();
      await checkoutRef.set({
        userId: context.auth.uid,
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
    } catch (error) {
      console.error("Erro ao criar checkout FlowPay", {
        error: error.message,
        userEmail: data.userEmail,
        contextData,
      });
      throw error;
    }
  }
);

/**
 * Webhook para processar retornos da FlowPay
 */
exports.webhookFlowPay = functions.https.onRequest(
  async (req, res) => {
    const contextData = {
      functionName: "webhookFlowPay",
      method: req.method,
      headers: req.headers,
    };

    try {
      // Verificar se é POST
      if (req.method !== "POST") {
        console.log("Webhook FlowPay - Método não permitido", {
          method: req.method,
          contextData,
        });
        res.status(405).send("Method Not Allowed");
        return;
      }

      // Verificar assinatura do webhook (se configurada)
      const signature = req.headers["x-flowpay-signature"];
      if (signature) {
        // Implementar verificação de assinatura se necessário
        // const isValid = verifyFlowPaySignature(req.body, signature);
        // if (!isValid) {
        //   console.log("Webhook FlowPay - Assinatura inválida", contextData);
        //   res.status(401).send("Unauthorized");
        //   return;
        // }
      }

      const webhookData = req.body;
      console.log("Webhook FlowPay recebido", {
        orderId: webhookData.id,
        status: webhookData.status,
        externalId: webhookData.externalId,
        contextData,
      });

      // Processar diferentes tipos de evento
      switch (webhookData.event) {
        case "order.paid":
        case "CHARGE_COMPLETED":
          await processPaymentSuccess(webhookData);
          break;
        case "order.cancelled":
        case "CHARGE_CANCELLED":
          await processPaymentCancelled(webhookData);
          break;
        case "order.expired":
        case "CHARGE_EXPIRED":
          await processPaymentExpired(webhookData);
          break;
        default:
          console.log("Webhook FlowPay - Evento não processado", {
            event: webhookData.event,
            contextData,
          });
      }

      res.status(200).send("OK");
    } catch (error) {
      console.error("Erro ao processar webhook FlowPay", {
        error: error.message,
        body: req.body,
        contextData,
      });
      res.status(500).send("Internal Server Error");
    }
  }
);

/**
 * Processa pagamento aprovado
 */
async function processPaymentSuccess(webhookData) {
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

    await inscricaoRef.set({
      userId: checkoutData.userId,
      userEmail: audiovisualData.userEmail,
      userName: audiovisualData.userName,
      tipo: audiovisualData.tipo,
      experiencia: audiovisualData.experiencia,
      portfolio: audiovisualData.portfolio,
      telefone: audiovisualData.telefone,
      status: "pending",
      payment: {
        status: "paid",
        flowpayOrderId: webhookData.id,
        amount: checkoutData.amount,
        paidAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      checkoutId: checkoutDoc.id,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log("Inscrição audiovisual confirmada após pagamento", {
      inscricaoId: inscricaoRef.id,
      checkoutId: checkoutDoc.id,
      orderId: webhookData.id,
      userEmail: audiovisualData.userEmail,
      contextData,
    });

    // Enviar email de confirmação
    try {
      const emailData = {
        to: audiovisualData.userEmail,
        subject: "Inscrição Audiovisual Confirmada - CERRADØ INTERBOX 2025",
        template: "audiovisual_confirmation",
        data: {
          userName: audiovisualData.userName,
          tipo: audiovisualData.tipo,
          orderId: webhookData.id,
          amount: (checkoutData.amount / 100).toFixed(2),
        },
      };

      // Aqui você pode chamar sua função de envio de email
      // await sendEmail(emailData);
    } catch (emailError) {
      console.error("Erro ao enviar email de confirmação", {
        error: emailError.message,
        userEmail: audiovisualData.userEmail,
        contextData,
      });
    }
  } catch (error) {
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
async function processPaymentCancelled(webhookData) {
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
  } catch (error) {
    console.error("Erro ao processar pagamento cancelado", {
      error: error.message,
      orderId: webhookData.id,
      contextData,
    });
  }
}

/**
 * Processa pagamento expirado
 */
async function processPaymentExpired(webhookData) {
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
  } catch (error) {
    console.error("Erro ao processar pagamento expirado", {
      error: error.message,
      orderId: webhookData.id,
      contextData,
    });
  }
}
