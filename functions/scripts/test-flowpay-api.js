#!/usr/bin/env node

const fetch = require('node-fetch');

/**
 * Script para testar a API da FlowPay diretamente
 */
async function testFlowPayAPI() {
  console.log("🧪 Testando API FlowPay diretamente...");
  console.log("==================================================\n");

  try {
    // 1. Verificar se a API key está configurada
    console.log("🔑 Passo 1: Verificando configuração da API...");

    const apiKey = process.env.FLOWPAY_API_KEY;
    if (!apiKey) {
      console.log("❌ FLOWPAY_API_KEY não configurada");
      console.log("💡 Configure a variável de ambiente ou use o modo de simulação");
      return;
    }

    console.log("✅ API Key configurada");
    console.log("📊 Tamanho da chave:", apiKey.length, "caracteres");

    // 2. Testar conectividade com a API
    console.log("\n🌐 Passo 2: Testando conectividade com a API...");

    const healthResponse = await fetch("https://api.flowpay.com.br/v1/health", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    console.log("📊 Status da API:", healthResponse.status);
    console.log("📊 API acessível:", healthResponse.ok);

    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log("📋 Dados da API:", healthData);
    }

    // 3. Criar checkout de teste
    console.log("\n💳 Passo 3: Criando checkout de teste...");

    const testOrderData = {
      amount: 2990, // R$ 29,90 em centavos
      currency: "BRL",
      description: "Teste - Inscrição Audiovisual - CERRADØ INTERBOX 2025",
      externalId: `test_api_${Date.now()}`,
      customer: {
        name: "Usuário Teste API",
        email: "teste.api@exemplo.com",
        phone: "(11) 99999-9999",
      },
      items: [
        {
          name: "Inscrição Audiovisual (Teste)",
          description: "Candidatura para fotógrafo - CERRADØ INTERBOX 2025",
          quantity: 1,
          unitAmount: 2990,
        },
      ],
      redirectUrl: "https://interbox-app-8d400.web.app/audiovisual/success?test=true",
      webhookUrl: "https://us-central1-interbox-app-8d400.cloudfunctions.net/webhookFlowPay",
      metadata: {
        test: true,
        source: "api_test_script",
      },
    };

    console.log("📋 Dados do pedido:", {
      externalId: testOrderData.externalId,
      amount: testOrderData.amount / 100,
      customer: testOrderData.customer.name,
    });

    // 4. Fazer requisição para criar pedido
    console.log("\n📤 Passo 4: Enviando requisição para criar pedido...");

    const orderResponse = await fetch("https://api.flowpay.com.br/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "X-Idempotency-Key": testOrderData.externalId,
      },
      body: JSON.stringify(testOrderData),
    });

    console.log("📊 Status da resposta:", orderResponse.status);
    console.log("📊 Resposta OK:", orderResponse.ok);

    if (orderResponse.ok) {
      const orderData = await orderResponse.json();
      console.log("✅ Pedido criado com sucesso!");
      console.log("📋 Order ID:", orderData.id);
      console.log("🔗 Checkout URL:", orderData.checkoutUrl);
      console.log("💰 Valor:", orderData.amount / 100, "BRL");
      console.log("📊 Status:", orderData.status);

      // 5. Testar webhook manualmente
      console.log("\n🔄 Passo 5: Testando webhook manualmente...");

      const webhookData = {
        event: "order.paid",
        id: orderData.id,
        status: "paid",
        amount: orderData.amount,
        currency: orderData.currency,
        customer: orderData.customer,
        payment: {
          method: "credit_card",
          status: "approved",
          paidAt: new Date().toISOString(),
        },
        metadata: {
          ...orderData.metadata,
          test_webhook: true,
        },
      };

      console.log("📋 Dados do webhook:", {
        event: webhookData.event,
        orderId: webhookData.id,
        status: webhookData.status,
      });

      // 6. Simular envio do webhook (opcional)
      const shouldTestWebhook = process.argv.includes("--webhook");
      if (shouldTestWebhook) {
        console.log("\n📡 Enviando webhook para função...");
        
        // Aqui você pode chamar a função webhookFlowPay diretamente
        // ou fazer uma requisição HTTP para o endpoint
        console.log("ℹ️ Para testar o webhook, chame a função webhookFlowPay com os dados acima");
      }

      // 7. Informações para teste manual
      console.log("\n📋 Passo 6: Informações para teste manual...");
      console.log("🔗 URL do checkout:", orderData.checkoutUrl);
      console.log("📋 Order ID para webhook:", orderData.id);
      console.log("💰 Valor para verificar:", orderData.amount / 100, "BRL");

    } else {
      const errorData = await orderResponse.json();
      console.error("❌ Erro ao criar pedido:", errorData);
      console.error("📊 Status:", orderResponse.status);
      console.error("📊 Status Text:", orderResponse.statusText);
    }

    console.log("\n🎉 Teste da API FlowPay concluído!");
    console.log("==================================================");

  } catch (error) {
    console.error("💥 Erro durante o teste:", error);
    console.error("📋 Stack trace:", error.stack);
  }
}

/**
 * Testar apenas a conectividade
 */
async function testConnectivity() {
  console.log("🧪 Testando conectividade com FlowPay...");
  console.log("==================================================\n");

  try {
    const apiKey = process.env.FLOWPAY_API_KEY;
    if (!apiKey) {
      console.log("❌ FLOWPAY_API_KEY não configurada");
      return;
    }

    const response = await fetch("https://api.flowpay.com.br/v1/health", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
      },
    });

    console.log("📊 Status:", response.status);
    console.log("📊 OK:", response.ok);
    console.log("📊 Headers:", Object.fromEntries(response.headers.entries()));

    if (response.ok) {
      const data = await response.json();
      console.log("✅ API acessível");
      console.log("📋 Resposta:", data);
    } else {
      console.log("❌ API não acessível");
    }

  } catch (error) {
    console.error("💥 Erro de conectividade:", error.message);
  }
}

// Executar baseado nos argumentos
const args = process.argv.slice(2);

if (args.includes("--connectivity")) {
  testConnectivity();
} else {
  testFlowPayAPI();
}

module.exports = {
  testFlowPayAPI,
  testConnectivity,
}; 