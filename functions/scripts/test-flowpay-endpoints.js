#!/usr/bin/env node

const {initializeApp} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");

// Inicializar Firebase Admin
initializeApp();
const db = getFirestore();

async function testFlowPayEndpoints() {
  console.log("🔍 Testando endpoints da FlowPay...\n");

  const baseDomain = "https://flowpay.com/api";
  const apiKey = process.env.FLOWPAY_API_KEY || "Client_Id_d14a8e82-1ab7-4dee-a1a5-6d86c3781ccb";

  const possibleEndpoints = [
    "/v1/orders",
    "/v1/order",
    "/v1/checkout",
    "/v1/payment",
    "/v1/transactions",
    "/v1/charge",
    "/orders",
    "/order",
    "/checkout",
    "/payment",
    "/transactions",
    "/charge",
  ];

  console.log("🔑 API Key:", apiKey);
  console.log("🌐 Base Domain:", baseDomain);
  console.log("🔍 Testando endpoints...\n");

  for (const endpoint of possibleEndpoints) {
    try {
      console.log(`🔍 Testando: ${baseDomain}${endpoint}`);

      // Testar GET primeiro
      const getResponse = await fetch(`${baseDomain}${endpoint}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(5000),
      });

      console.log(`📊 GET ${endpoint} - Status: ${getResponse.status}`);

      // Testar POST
      const testData = {
        amount: 2990,
        currency: "BRL",
        description: "Teste de Endpoint",
        externalId: `test_endpoint_${Date.now()}`,
        customer: {
          name: "Teste Endpoint",
          email: "teste@endpoint.com",
          phone: "(11) 99999-9999",
        },
        items: [
          {
            name: "Teste",
            description: "Teste de endpoint",
            quantity: 1,
            unitAmount: 2990,
          },
        ],
        redirectUrl: "https://interbox-app-8d400.web.app/audiovisual/success",
        webhookUrl: "https://us-central1-interbox-app-8d400.cloudfunctions.net/webhookFlowPay",
      };

      const postResponse = await fetch(`${baseDomain}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
          "X-Idempotency-Key": testData.externalId,
        },
        body: JSON.stringify(testData),
        signal: AbortSignal.timeout(10000),
      });

      console.log(`📊 POST ${endpoint} - Status: ${postResponse.status}`);

      if (postResponse.ok) {
        const responseData = await postResponse.json();
        console.log(`🎉 ENDPOINT FUNCIONANDO: ${endpoint}`);
        console.log("✅ Resposta:", JSON.stringify(responseData, null, 2));

        // Salvar no Firestore
        const checkoutRef = db.collection("audiovisual_checkouts").doc();
        await checkoutRef.set({
          userId: "endpoint-test",
          userEmail: testData.customer.email,
          userName: testData.customer.name,
          flowpayOrderId: responseData.id || "unknown",
          externalId: testData.externalId,
          amount: testData.amount,
          status: "pending",
          audiovisualData: testData,
          checkoutUrl: responseData.checkoutUrl || responseData.url || "unknown",
          isEndpointTest: true,
          endpoint: endpoint,
          response: responseData,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        console.log("✅ Dados salvos no Firestore:", checkoutRef.id);
        return endpoint;
      } else {
        const errorText = await postResponse.text();
        console.log(`❌ POST ${endpoint} - Erro: ${errorText}`);
      }
    } catch (error) {
      console.log(`❌ ${endpoint} - Erro: ${error.message}`);
    }
  }

  console.log("\n❌ Nenhum endpoint funcionou para POST!");
  console.log("🔍 Vamos testar outros métodos...");

  // Testar outros métodos HTTP
  const methods = ["PUT", "PATCH"];
  const testEndpoint = "/v1/orders";

  for (const method of methods) {
    try {
      console.log(`🔍 Testando ${method}: ${baseDomain}${testEndpoint}`);

      const response = await fetch(`${baseDomain}${testEndpoint}`, {
        method: method,
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: method !== "GET" ? JSON.stringify({test: true}) : undefined,
        signal: AbortSignal.timeout(5000),
      });

      console.log(`📊 ${method} ${testEndpoint} - Status: ${response.status}`);
    } catch (error) {
      console.log(`❌ ${method} ${testEndpoint} - Erro: ${error.message}`);
    }
  }

  return null;
}

// Executar teste
testFlowPayEndpoints()
    .then((endpoint) => {
      if (endpoint) {
        console.log("\n🎯 ENDPOINT CORRETO ENCONTRADO:", endpoint);
        console.log("✅ Atualize o código para usar este endpoint!");
      } else {
        console.log("\n💥 Nenhum endpoint funcionou");
        console.log("📞 Verifique a documentação da FlowPay");
      }
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Erro fatal:", error);
      process.exit(1);
    });
