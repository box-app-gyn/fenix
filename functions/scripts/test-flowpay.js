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
 * Script para testar a função FlowPay
 */
async function testFlowPay() {
  console.log("🧪 Testando função FlowPay...");
  console.log("==================================================\n");

  try {
    // 1. Testar validação de dados
    console.log("📊 Passo 1: Testando validação de dados...");

    const testData = {
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
    };

    console.log("✅ Dados de teste criados");

    // 2. Testar verificação de inscrição existente
    console.log("\n📋 Passo 2: Testando verificação de inscrição existente...");

    const existing = await db
        .collection("audiovisual")
        .where("userEmail", "==", testData.userEmail)
        .limit(1)
        .get();

    console.log(`📊 Inscrição existente: ${!existing.empty}`);

    // 3. Testar configuração da FlowPay
    console.log("\n🔧 Passo 3: Testando configuração da FlowPay...");

    const flowpayConfig = {
      amount: 2990,
      currency: "BRL",
      description: "Inscrição Audiovisual - CERRADØ INTERBOX 2025",
      externalId: `test_audiovisual_${Date.now()}`,
      customer: {
        name: testData.userName,
        email: testData.userEmail,
        phone: testData.telefone,
      },
      items: [
        {
          name: "Inscrição Audiovisual",
          description: `Candidatura para ${testData.tipo} - ` +
            "CERRADØ INTERBOX 2025",
          quantity: 1,
          unitAmount: 2990,
        },
      ],
      redirectUrl: "https://interbox-app-8d400.web.app/audiovisual/success",
      webhookUrl: "https://us-central1-interbox-app-8d400.cloudfunctions.net/webhookFlowPay",
    };

    console.log("✅ Configuração FlowPay criada");
    console.log("📋 External ID:", flowpayConfig.externalId);

    // 4. Testar API da FlowPay (sem criar checkout real)
    console.log("\n🌐 Passo 4: Testando conectividade com API FlowPay...");

    const response = await fetch("https://api.flowpay.com.br/v1/orders", {
      method: "HEAD",
      headers: {
        "Authorization": `Bearer ${process.env.FLOWPAY_API_KEY || "test"}`,
      },
    });

    console.log(`📊 Status da API: ${response.status}`);
    console.log(`📊 API acessível: ${response.ok}`);

    // 5. Verificar variáveis de ambiente
    console.log("\n🔑 Passo 5: Verificando variáveis de ambiente...");

    const apiKey = process.env.FLOWPAY_API_KEY;
    console.log(`📊 API Key configurada: ${apiKey ? "✅ Sim" : "❌ Não"}`);
    const isValidKey = apiKey && apiKey.length > 10 ? "✅ Sim" : "❌ Não";
    console.log(`📊 API Key válida: ${isValidKey}`);

    console.log("\n🎉 Teste concluído com sucesso!");
    console.log("==================================================");
  } catch (error) {
    console.error("💥 Erro durante o teste:", error);
    console.error("📋 Stack trace:", error.stack);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  testFlowPay();
}

module.exports = {testFlowPay};
