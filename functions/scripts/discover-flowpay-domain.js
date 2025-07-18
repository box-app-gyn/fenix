#!/usr/bin/env node

const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Inicializar Firebase Admin
initializeApp();
const db = getFirestore();

async function discoverFlowPayDomain() {
  console.log('🔍 Descobrindo domínio correto da FlowPay...\n');

  const possibleDomains = [
    'https://api.flowpay.com.br',
    'https://api.flowpay.com',
    'https://flowpay.com.br/api',
    'https://flowpay.com/api',
    'https://api.flowpay.io',
    'https://flowpay.io/api',
    'https://api.flowpay.net',
    'https://flowpay.net/api',
    'https://api.flowpay.app',
    'https://flowpay.app/api',
  ];

  const apiKey = process.env.FLOWPAY_API_KEY || 'Client_Id_d14a8e82-1ab7-4dee-a1a5-6d86c3781ccb';

  console.log('🔑 API Key:', apiKey);
  console.log('🌐 Testando domínios possíveis...\n');

  for (const domain of possibleDomains) {
    try {
      console.log(`🔍 Testando: ${domain}/v1/health`);
      
      const response = await fetch(`${domain}/v1/health`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        // Timeout de 5 segundos
        signal: AbortSignal.timeout(5000)
      });

      console.log(`✅ ${domain} - Status: ${response.status}`);
      
      if (response.ok) {
        console.log(`🎉 DOMÍNIO ENCONTRADO: ${domain}`);
        console.log('✅ Este é o domínio correto da FlowPay!');
        
        // Testar criação de checkout
        console.log('\n💳 Testando criação de checkout...');
        
        const testData = {
          amount: 2990,
          currency: "BRL",
          description: "Teste de Conectividade",
          externalId: `test_discovery_${Date.now()}`,
          customer: {
            name: "Teste Discovery",
            email: "teste@discovery.com",
            phone: "(11) 99999-9999",
          },
          items: [
            {
              name: "Teste",
              description: "Teste de conectividade",
              quantity: 1,
              unitAmount: 2990,
            },
          ],
          redirectUrl: "https://interbox-app-8d400.web.app/audiovisual/success",
          webhookUrl: "https://us-central1-interbox-app-8d400.cloudfunctions.net/webhookFlowPay",
        };

        const checkoutResponse = await fetch(`${domain}/v1/orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'X-Idempotency-Key': testData.externalId,
          },
          body: JSON.stringify(testData),
          signal: AbortSignal.timeout(10000)
        });

        console.log(`📊 Status do checkout: ${checkoutResponse.status}`);
        
        if (checkoutResponse.ok) {
          const checkoutData = await checkoutResponse.json();
          console.log('🎉 Checkout criado com sucesso!');
          console.log('📄 ID:', checkoutData.id);
          console.log('🔗 URL:', checkoutData.checkoutUrl);
          
          // Salvar no Firestore
          const checkoutRef = db.collection("audiovisual_checkouts").doc();
          await checkoutRef.set({
            userId: 'discovery-test',
            userEmail: testData.customer.email,
            userName: testData.customer.name,
            flowpayOrderId: checkoutData.id,
            externalId: testData.externalId,
            amount: testData.amount,
            status: "pending",
            audiovisualData: testData,
            checkoutUrl: checkoutData.checkoutUrl,
            isDiscoveryTest: true,
            domain: domain,
            createdAt: new Date(),
            updatedAt: new Date(),
          });

          console.log('✅ Dados salvos no Firestore:', checkoutRef.id);
        } else {
          const errorData = await checkoutResponse.text();
          console.log('⚠️  Erro no checkout:', errorData);
        }

        return domain;
      } else {
        console.log(`❌ ${domain} - Status: ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ ${domain} - Erro: ${error.message}`);
    }
  }

  console.log('\n❌ Nenhum domínio funcionou!');
  console.log('🔍 Possíveis causas:');
  console.log('1. API key inválida ou expirada');
  console.log('2. Domínio da FlowPay mudou');
  console.log('3. Problema de conectividade');
  console.log('4. FlowPay pode estar fora do ar');
  
  return null;
}

// Executar descoberta
discoverFlowPayDomain()
  .then(domain => {
    if (domain) {
      console.log('\n🎯 DOMÍNIO CORRETO ENCONTRADO:', domain);
      console.log('✅ Atualize o código para usar este domínio!');
    } else {
      console.log('\n💥 Nenhum domínio funcionou');
      console.log('📞 Entre em contato com o suporte da FlowPay');
    }
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Erro fatal:', error);
    process.exit(1);
  }); 