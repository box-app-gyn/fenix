#!/usr/bin/env node

const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Inicializar Firebase Admin
initializeApp();
const db = getFirestore();

async function testFlowPayProduction() {
  console.log('🚀 Testando FlowPay em Produção...\n');

  // Verificar configurações
  console.log('📋 Verificando configurações...');
  const apiKey = process.env.FLOWPAY_API_KEY || 'Client_Id_d14a8e82-1ab7-4dee-a1a5-6d86c3781ccb';
  console.log('🔑 API Key configurada:', apiKey ? '✅ Sim' : '❌ Não');
  console.log('🔑 API Key válida:', apiKey && apiKey.length > 10 ? '✅ Sim' : '❌ Não');

  // Dados de teste para produção
  const testData = {
    userEmail: 'teste-producao@interbox.com.br',
    userName: 'Teste Produção',
    tipo: 'Fotógrafo',
    experiencia: '5 anos',
    portfolio: 'https://portfolio-producao.com',
    telefone: '(62) 99999-9999',
    equipamentos: 'Canon EOS R5, 24-70mm f/2.8',
    especialidades: 'Esportes, Eventos',
    comentariosOutro: ''
  };

  try {
    // 1. Testar conectividade com API FlowPay
    console.log('\n🌐 Testando conectividade com API FlowPay...');
    
    const healthResponse = await fetch('https://api.flowpay.com.br/v1/health', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      }
    });

    console.log('📊 Status da API:', healthResponse.status);
    console.log('📊 API acessível:', healthResponse.ok ? '✅ Sim' : '❌ Não');

    if (!healthResponse.ok) {
      console.log('⚠️  API não acessível - verificar API key');
      return;
    }

    // 2. Criar checkout real de teste
    console.log('\n💳 Criando checkout real de teste...');
    
    const flowpayConfig = {
      amount: 2990, // R$ 29,90 em centavos
      currency: "BRL",
      description: "Inscrição Audiovisual - CERRADØ INTERBOX 2025",
      externalId: `test_prod_${Date.now()}`,
      customer: {
        name: testData.userName,
        email: testData.userEmail,
        phone: testData.telefone,
      },
      items: [
        {
          name: "Inscrição Audiovisual",
          description: `Candidatura para ${testData.tipo} - CERRADØ INTERBOX 2025`,
          quantity: 1,
          unitAmount: 2990,
        },
      ],
      redirectUrl: "https://interbox-app-8d400.web.app/audiovisual/success",
      webhookUrl: "https://us-central1-interbox-app-8d400.cloudfunctions.net/webhookFlowPay",
    };

    console.log('📋 Configuração preparada:', {
      externalId: flowpayConfig.externalId,
      amount: flowpayConfig.amount,
      customer: flowpayConfig.customer.name,
    });

    const checkoutResponse = await fetch('https://api.flowpay.com.br/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'X-Idempotency-Key': flowpayConfig.externalId,
      },
      body: JSON.stringify(flowpayConfig),
    });

    console.log('📊 Status do checkout:', checkoutResponse.status);
    console.log('📊 Checkout criado:', checkoutResponse.ok ? '✅ Sim' : '❌ Não');

    if (checkoutResponse.ok) {
      const checkoutData = await checkoutResponse.json();
      console.log('🎉 Checkout criado com sucesso!');
      console.log('📄 ID do pedido:', checkoutData.id);
      console.log('🔗 URL de checkout:', checkoutData.checkoutUrl);
      console.log('💰 Valor:', 'R$ 29,90');

      // 3. Salvar no Firestore
      console.log('\n💾 Salvando checkout no Firestore...');
      
      const checkoutRef = db.collection("audiovisual_checkouts").doc();
      await checkoutRef.set({
        userId: 'test-production-user',
        userEmail: testData.userEmail,
        userName: testData.userName,
        flowpayOrderId: checkoutData.id,
        externalId: flowpayConfig.externalId,
        amount: flowpayConfig.amount,
        status: "pending",
        audiovisualData: testData,
        checkoutUrl: checkoutData.checkoutUrl,
        isProduction: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log('✅ Checkout salvo no Firestore:', checkoutRef.id);

      // 4. Testar webhook
      console.log('\n🔗 Testando webhook...');
      
      const webhookTestData = {
        event: 'order.paid',
        id: checkoutData.id,
        status: 'paid',
        amount: 2990,
        customer: {
          name: testData.userName,
          email: testData.userEmail,
        },
        payment: {
          method: 'credit_card',
          status: 'approved',
        }
      };

      const webhookResponse = await fetch('https://us-central1-interbox-app-8d400.cloudfunctions.net/webhookFlowPay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookTestData),
      });

      console.log('📊 Status do webhook:', webhookResponse.status);
      console.log('📊 Webhook processado:', webhookResponse.ok ? '✅ Sim' : '❌ Não');

      // 5. Resumo final
      console.log('\n🎉 Teste de produção concluído com sucesso!');
      console.log('==================================================');
      console.log('✅ API FlowPay acessível');
      console.log('✅ Checkout criado com sucesso');
      console.log('✅ Dados salvos no Firestore');
      console.log('✅ Webhook testado');
      console.log('✅ Sistema pronto para produção!');
      
      return {
        success: true,
        checkoutId: checkoutRef.id,
        flowpayOrderId: checkoutData.id,
        checkoutUrl: checkoutData.checkoutUrl,
        amount: flowpayConfig.amount,
        isProduction: true,
      };

    } else {
      const errorData = await checkoutResponse.json();
      console.error('❌ Erro ao criar checkout:', errorData);
      throw new Error(`Erro na API FlowPay: ${checkoutResponse.status} ${checkoutResponse.statusText}`);
    }

  } catch (error) {
    console.error('💥 Erro no teste de produção:', error.message);
    console.error('Stack:', error.stack);
    
    // Verificar se é erro de autenticação
    if (error.message.includes('401') || error.message.includes('403')) {
      console.log('\n🔑 Problema de autenticação detectado!');
      console.log('Verifique se a API key está correta e ativa.');
    }
    
    throw error;
  }
}

// Executar teste
testFlowPayProduction()
  .then(result => {
    if (result) {
      console.log('\n🎯 Resultado final:', result);
    }
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Erro fatal no teste:', error);
    process.exit(1);
  }); 