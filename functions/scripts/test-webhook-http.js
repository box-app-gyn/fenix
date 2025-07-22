#!/usr/bin/env node

const fetch = require("node-fetch");

/**
 * Script para testar o webhook FlowPay via HTTP
 */
async function testWebhookHTTP() {
  console.log("🧪 Testando webhook FlowPay via HTTP...");
  console.log("==================================================\n");

  try {
    // 1. Dados do webhook de teste
    console.log("📊 Passo 1: Preparando dados do webhook...");

    const webhookData = {
      event: "order.paid",
      id: `test_webhook_${Date.now()}`,
      status: "paid",
      amount: 2990,
      currency: "BRL",
      customer: {
        name: "Usuário Teste Webhook",
        email: "teste.webhook@exemplo.com",
        phone: "(11) 99999-9999",
      },
      payment: {
        method: "credit_card",
        status: "approved",
        paidAt: new Date().toISOString(),
        transactionId: `txn_${Date.now()}`,
      },
      items: [
        {
          name: "Inscrição Audiovisual",
          description: "Candidatura para fotógrafo - CERRADO INTERBØX 2025",
          quantity: 1,
          unitAmount: 2990,
        },
      ],
      metadata: {
        externalId: `test_webhook_${Date.now()}`,
        test: true,
        source: "http_test_script",
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log("✅ Dados do webhook preparados");
    console.log("📋 Order ID:", webhookData.id);
    console.log("💰 Valor:", webhookData.amount / 100, "BRL");
    console.log("📧 Email:", webhookData.customer.email);

    // 2. URL do webhook (ajuste conforme necessário)
    const webhookUrl = "https://us-central1-interbox-app-8d400.cloudfunctions.net/webhookFlowPay";

    console.log("\n🌐 Passo 2: Enviando webhook para:", webhookUrl);

    // 3. Fazer requisição POST para o webhook
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "FlowPay-Webhook-Test/1.0",
        "X-FlowPay-Signature": "test_signature", // Assinatura de teste
      },
      body: JSON.stringify(webhookData),
    });

    console.log("📊 Status da resposta:", response.status);
    console.log("📊 Status Text:", response.statusText);
    console.log("📊 Headers:", Object.fromEntries(response.headers.entries()));

    // 4. Processar resposta
    if (response.ok) {
      const responseData = await response.text();
      console.log("✅ Webhook processado com sucesso!");
      console.log("📋 Resposta:", responseData);
    } else {
      const errorData = await response.text();
      console.error("❌ Erro ao processar webhook");
      console.error("📋 Erro:", errorData);
    }

    // 5. Testar diferentes tipos de eventos
    console.log("\n🔄 Passo 3: Testando diferentes tipos de eventos...");

    const eventTypes = ["order.paid", "order.cancelled", "order.expired"];

    for (const eventType of eventTypes) {
      console.log(`\n📡 Testando evento: ${eventType}`);

      const testData = {
        ...webhookData,
        event: eventType,
        id: `test_${eventType}_${Date.now()}`,
        status: eventType === "order.paid" ? "paid" : eventType.split(".")[1],
      };

      try {
        const eventResponse = await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "FlowPay-Webhook-Test/1.0",
          },
          body: JSON.stringify(testData),
        });

        console.log(`📊 ${eventType}: ${eventResponse.status} ${eventResponse.statusText}`);
      } catch (error) {
        console.error(`❌ ${eventType}: ${error.message}`);
      }
    }

    console.log("\n🎉 Teste do webhook via HTTP concluído!");
    console.log("==================================================");
  } catch (error) {
    console.error("💥 Erro durante o teste:", error);
    console.error("📋 Stack trace:", error.stack);
  }
}

/**
 * Testar webhook com dados reais (se disponível)
 */
async function testWebhookWithRealData() {
  console.log("🧪 Testando webhook com dados reais...");
  console.log("==================================================\n");

  try {
    // Solicitar dados do usuário
    const readline = require("readline");
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const question = (query) => new Promise((resolve) => rl.question(query, resolve));

    console.log("📝 Insira os dados para o teste:");

    const orderId = await question("Order ID: ");
    const customerName = await question("Nome do cliente: ");
    const customerEmail = await question("Email do cliente: ");
    const amount = await question("Valor (em centavos, ex: 2990): ");

    rl.close();

    const webhookData = {
      event: "order.paid",
      id: orderId,
      status: "paid",
      amount: parseInt(amount),
      currency: "BRL",
      customer: {
        name: customerName,
        email: customerEmail,
      },
      payment: {
        method: "credit_card",
        status: "approved",
        paidAt: new Date().toISOString(),
      },
      metadata: {
        test: false,
        source: "real_data_test",
      },
    };

    console.log("\n📋 Dados do webhook:", webhookData);

    const webhookUrl = "https://us-central1-interbox-app-8d400.cloudfunctions.net/webhookFlowPay";

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "FlowPay-Webhook-Test/1.0",
      },
      body: JSON.stringify(webhookData),
    });

    console.log("📊 Status:", response.status);
    console.log("📊 Resposta:", await response.text());
  } catch (error) {
    console.error("💥 Erro:", error);
  }
}

// Executar baseado nos argumentos
const args = process.argv.slice(2);

if (args.includes("--real")) {
  testWebhookWithRealData();
} else {
  testWebhookHTTP();
}

module.exports = {
  testWebhookHTTP,
  testWebhookWithRealData,
};
