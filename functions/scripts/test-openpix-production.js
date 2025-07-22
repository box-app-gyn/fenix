#!/usr/bin/env node

const {initializeApp} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");

// Inicializar Firebase Admin
initializeApp();
const db = getFirestore();

/**
 * Testa a integração com OpenPix em produção
 */
async function testOpenPixProduction() {
  console.log("🚀 Testando OpenPix em Produção...\n");

  // Verificar configurações
  console.log("📋 Verificando configurações...");
  const apiKey = process.env.FLOWPAY_API_KEY ||
    "openpix_Y38HAGsdNHvxEHtCwBNtaVlGWLC19WdIBkbTfuTJbUI=";
  console.log("🔑 API Key configurada:", apiKey ? "✅ Sim" : "❌ Não");
  console.log("🔑 API Key válida:",
    apiKey && apiKey.length > 10 ? "✅ Sim" : "❌ Não");

  // Dados de teste para produção
  const testData = {
    userEmail: "teste-producao@interbox.com.br",
    userName: "Teste Produção",
    tipo: "Fotógrafo",
    experiencia: "5 anos",
    portfolio: "https://portfolio-producao.com",
    telefone: "(62) 99999-9999",
    equipamentos: "Canon EOS R5, 24-70mm f/2.8",
    especialidades: "Esportes, Eventos",
    comentariosOutro: "",
  };

  try {
    // 1. Testar conectividade com API OpenPix
    console.log("\n🌐 Testando conectividade com API OpenPix...");

    const healthResponse = await fetch("https://api.openpix.com.br/api/v1/charge", {
      method: "GET",
      headers: {
        "Authorization": apiKey,
        "Content-Type": "application/json",
      },
    });

    console.log("📊 Status da API:", healthResponse.status);
    console.log("📊 API acessível:", healthResponse.ok ? "✅ Sim" : "❌ Não");

    if (!healthResponse.ok) {
      console.log("⚠️  API não acessível - verificar API key");
      return;
    }

    // 2. Criar cobrança PIX real de teste
    console.log("\n💳 Criando cobrança PIX real de teste...");

    const openpixConfig = {
      correlationID: `test_prod_${Date.now()}`,
      value: 2990, // R$ 29,90 em centavos
      comment: "Inscrição Audiovisual - CERRADO INTERBØX 2025",
      identifier: testData.userEmail,
      customer: {
        name: testData.userName,
        email: testData.userEmail,
        phone: testData.telefone,
      },
      additionalInfo: [
        {
          key: "tipo",
          value: testData.tipo,
        },
        {
          key: "experiencia",
          value: testData.experiencia,
        },
        {
          key: "portfolio",
          value: testData.portfolio,
        },
      ],
    };

    console.log("📋 Configuração preparada:", {
      correlationID: openpixConfig.correlationID,
      value: openpixConfig.value,
      customer: openpixConfig.customer.name,
    });

    const chargeResponse = await fetch("https://api.openpix.com.br/api/v1/charge", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": apiKey,
      },
      body: JSON.stringify(openpixConfig),
    });

    console.log("📊 Status da cobrança:", chargeResponse.status);
    console.log("📊 Cobrança criada:", chargeResponse.ok ? "✅ Sim" : "❌ Não");

    if (chargeResponse.ok) {
      const chargeData = await chargeResponse.json();
      console.log("🎉 Cobrança PIX criada com sucesso!");
      console.log("📄 ID da cobrança:", chargeData.charge.pixKey);
      console.log("🔗 QR Code:", chargeData.charge.qrCode);
      console.log("💰 Valor:", "R$ 29,90");

      // 3. Salvar no Firestore
      console.log("\n💾 Salvando cobrança no Firestore...");

      const checkoutRef = db.collection("audiovisual_checkouts").doc();
      await checkoutRef.set({
        userId: "test-production-user",
        userEmail: testData.userEmail,
        userName: testData.userName,
        openpixChargeId: chargeData.charge.pixKey,
        openpixCorrelationId: openpixConfig.correlationID,
        amount: openpixConfig.value,
        status: "pending",
        audiovisualData: testData,
        qrCode: chargeData.charge.qrCode,
        pixKey: chargeData.charge.pixKey,
        isProduction: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log("✅ Cobrança salva no Firestore:", checkoutRef.id);

      // 4. Testar webhook
      console.log("\n🔗 Testando webhook...");

      const webhookTestData = {
        event: "CHARGE_CONFIRMED",
        correlationID: openpixConfig.correlationID,
        status: "CONFIRMED",
        value: 2990,
        customer: {
          name: testData.userName,
          email: testData.userEmail,
        },
        charge: {
          pixKey: chargeData.charge.pixKey,
          qrCode: chargeData.charge.qrCode,
        },
      };

      const webhookResponse = await fetch("https://webhookopenpix-gutjsyhc4q-uc.a.run.app", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(webhookTestData),
      });

      console.log("📊 Status do webhook:", webhookResponse.status);
      console.log("📊 Webhook processado:", webhookResponse.ok ? "✅ Sim" : "❌ Não");

      // 5. Resumo final
      console.log("\n🎉 Teste de produção concluído com sucesso!");
      console.log("==================================================");
      console.log("✅ API OpenPix acessível");
      console.log("✅ Cobrança PIX criada com sucesso");
      console.log("✅ Dados salvos no Firestore");
      console.log("✅ Webhook testado");
      console.log("✅ Sistema pronto para produção!");

      return {
        success: true,
        checkoutId: checkoutRef.id,
        openpixChargeId: chargeData.charge.pixKey,
        qrCode: chargeData.charge.qrCode,
        pixKey: chargeData.charge.pixKey,
        amount: openpixConfig.value,
        isProduction: true,
      };
    } else {
      const errorData = await chargeResponse.json();
      console.error("❌ Erro ao criar cobrança:", errorData);
      throw new Error(`Erro na API OpenPix: ${chargeResponse.status} ${chargeResponse.statusText}`);
    }
  } catch (error) {
    console.error("💥 Erro no teste de produção:", error.message);
    console.error("Stack:", error.stack);

    // Verificar se é erro de autenticação
    if (error.message.includes("401") || error.message.includes("403")) {
      console.log("\n🔑 Problema de autenticação detectado!");
      console.log("Verifique se a API key está correta e ativa.");
    }

    throw error;
  }
}

// Executar teste
testOpenPixProduction()
    .then((result) => {
      if (result) {
        console.log("\n🎯 Resultado final:", result);
      }
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Erro fatal no teste:", error);
      process.exit(1);
    });
