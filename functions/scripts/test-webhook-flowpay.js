#!/usr/bin/env node

const {initializeApp} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");

// Inicializar Firebase Admin
const serviceAccount = require("../serviceAccountKey.json");
initializeApp({
  credential: require("firebase-admin").credential.cert(serviceAccount),
});

const db = getFirestore();

/**
 * Script para testar o webhook FlowPay
 */
async function testWebhookFlowPay() {
  console.log("🧪 Testando webhook FlowPay...");
  console.log("==================================================\n");

  try {
    // 1. Criar dados de teste
    console.log("📊 Passo 1: Criando dados de teste...");

    const testCheckoutData = {
      userId: "test_user_123",
      userEmail: "teste@exemplo.com",
      userName: "Usuário Teste",
      flowpayOrderId: `test_order_${Date.now()}`,
      externalId: `test_audiovisual_${Date.now()}`,
      amount: 2990,
      status: "pending",
      audiovisualData: {
        userEmail: "teste@exemplo.com",
        userName: "Usuário Teste",
        telefone: "(11) 99999-9999",
        tipo: "fotografo",
        experiencia: "5 anos",
        portfolio: "https://exemplo.com/portfolio",
        equipamentos: "Canon EOS R5, Drone DJI",
        especialidades: "Fotografia esportiva, Vídeo",
        disponibilidade: "Integral",
        motivacao: "Quero participar do evento",
        cidade: "São Paulo",
        estado: "SP",
        comentariosOutro: "",
      },
      checkoutUrl: "https://exemplo.com/checkout",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // 2. Salvar checkout de teste no Firestore
    console.log("💾 Passo 2: Salvando checkout de teste no Firestore...");

    const checkoutRef = db.collection("audiovisual_checkouts").doc();
    await checkoutRef.set(testCheckoutData);

    console.log("✅ Checkout de teste salvo com ID:", checkoutRef.id);

    // 3. Simular dados do webhook FlowPay
    console.log("\n🌐 Passo 3: Simulando dados do webhook FlowPay...");

    const webhookData = {
      event: "order.paid",
      id: testCheckoutData.flowpayOrderId,
      status: "paid",
      amount: 2990,
      currency: "BRL",
      customer: {
        name: testCheckoutData.userName,
        email: testCheckoutData.userEmail,
      },
      payment: {
        method: "credit_card",
        status: "approved",
        paidAt: new Date().toISOString(),
      },
      metadata: {
        externalId: testCheckoutData.externalId,
      },
    };

    console.log("✅ Dados do webhook criados");
    console.log("📋 Order ID:", webhookData.id);
    console.log("💰 Valor:", webhookData.amount / 100, "BRL");

    // 4. Simular processamento do webhook
    console.log("\n⚙️ Passo 4: Simulando processamento do webhook...");

    // Buscar checkout no Firestore
    const checkoutQuery = await db
        .collection("audiovisual_checkouts")
        .where("flowpayOrderId", "==", webhookData.id)
        .limit(1)
        .get();

    if (checkoutQuery.empty) {
      throw new Error("Checkout não encontrado");
    }

    const checkoutDoc = checkoutQuery.docs[0];
    const checkoutData = checkoutDoc.data();

    console.log("✅ Checkout encontrado no Firestore");

    // 5. Atualizar status do checkout
    console.log("\n📝 Passo 5: Atualizando status do checkout...");

    await checkoutDoc.ref.update({
      status: "paid",
      paidAt: new Date(),
      paymentData: webhookData,
      updatedAt: new Date(),
    });

    console.log("✅ Status do checkout atualizado para 'paid'");

    // 6. Criar inscrição audiovisual
    console.log("\n📋 Passo 6: Criando inscrição audiovisual...");

    const inscricaoRef = db.collection("audiovisual").doc();
    const inscricaoData = {
      userId: checkoutData.userId,
      userEmail: checkoutData.userEmail,
      userName: checkoutData.userName,
      telefone: checkoutData.audiovisualData.telefone,
      tipo: checkoutData.audiovisualData.tipo,
      experiencia: checkoutData.audiovisualData.experiencia,
      portfolio: checkoutData.audiovisualData.portfolio,
      equipamentos: checkoutData.audiovisualData.equipamentos,
      especialidades: checkoutData.audiovisualData.especialidades,
      disponibilidade: checkoutData.audiovisualData.disponibilidade,
      motivacao: checkoutData.audiovisualData.motivacao,
      cidade: checkoutData.audiovisualData.cidade,
      estado: checkoutData.audiovisualData.estado,
      comentariosOutro: checkoutData.audiovisualData.comentariosOutro,
      status: "approved",
      payment: {
        required: true,
        amount: checkoutData.amount,
        status: "paid",
        paidAt: new Date(),
        flowpayOrderId: checkoutData.flowpayOrderId,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await inscricaoRef.set(inscricaoData);

    console.log("✅ Inscrição audiovisual criada com ID:", inscricaoRef.id);

    // 7. Verificar resultados
    console.log("\n🔍 Passo 7: Verificando resultados...");

    const finalCheckout = await checkoutDoc.ref.get();
    const finalInscricao = await inscricaoRef.get();

    console.log("📊 Status do checkout:", finalCheckout.data().status);
    console.log("📊 Status da inscrição:", finalInscricao.data().status);
    console.log("📊 Pagamento:", finalInscricao.data().payment.status);

    // 8. Limpeza (opcional)
    console.log("\n🧹 Passo 8: Limpeza dos dados de teste...");

    const shouldCleanup = process.argv.includes("--cleanup");
    if (shouldCleanup) {
      await checkoutDoc.ref.delete();
      await inscricaoRef.delete();
      console.log("✅ Dados de teste removidos");
    } else {
      console.log("ℹ️ Dados de teste mantidos (use --cleanup para remover)");
    }

    console.log("\n🎉 Teste do webhook concluído com sucesso!");
    console.log("==================================================");
    console.log("📋 Checkout ID:", checkoutDoc.id);
    console.log("📋 Inscrição ID:", inscricaoRef.id);
    console.log("💰 Valor pago:", webhookData.amount / 100, "BRL");
    console.log("📧 Email:", testCheckoutData.userEmail);
  } catch (error) {
    console.error("💥 Erro durante o teste:", error);
    console.error("📋 Stack trace:", error.stack);
  }
}

/**
 * Testar webhook de pagamento cancelado
 */
async function testWebhookCancelled() {
  console.log("🧪 Testando webhook FlowPay (cancelado)...");
  console.log("==================================================\n");

  try {
    const webhookData = {
      event: "order.cancelled",
      id: `test_cancelled_${Date.now()}`,
      status: "cancelled",
      amount: 2990,
      currency: "BRL",
      customer: {
        name: "Usuário Teste",
        email: "teste@exemplo.com",
      },
      metadata: {
        externalId: `test_cancelled_${Date.now()}`,
      },
    };

    console.log("✅ Webhook de cancelamento simulado");
    console.log("📋 Order ID:", webhookData.id);
    console.log("❌ Status: Cancelled");
  } catch (error) {
    console.error("💥 Erro durante o teste de cancelamento:", error);
  }
}

/**
 * Testar webhook de pagamento expirado
 */
async function testWebhookExpired() {
  console.log("🧪 Testando webhook FlowPay (expirado)...");
  console.log("==================================================\n");

  try {
    const webhookData = {
      event: "order.expired",
      id: `test_expired_${Date.now()}`,
      status: "expired",
      amount: 2990,
      currency: "BRL",
      customer: {
        name: "Usuário Teste",
        email: "teste@exemplo.com",
      },
      metadata: {
        externalId: `test_expired_${Date.now()}`,
      },
    };

    console.log("✅ Webhook de expiração simulado");
    console.log("📋 Order ID:", webhookData.id);
    console.log("⏰ Status: Expired");
  } catch (error) {
    console.error("💥 Erro durante o teste de expiração:", error);
  }
}

// Executar baseado nos argumentos
const args = process.argv.slice(2);

if (args.includes("--cancelled")) {
  testWebhookCancelled();
} else if (args.includes("--expired")) {
  testWebhookExpired();
} else {
  testWebhookFlowPay();
}

module.exports = {
  testWebhookFlowPay,
  testWebhookCancelled,
  testWebhookExpired,
};
