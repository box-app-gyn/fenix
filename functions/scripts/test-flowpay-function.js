const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Inicializar Firebase Admin (usando configuração padrão do Functions)
initializeApp();

const db = getFirestore();

async function testFlowPayFunction() {
  console.log('🧪 Testando função criarCheckoutFlowPay...\n');

  // Dados de teste
  const testData = {
    userEmail: 'teste@interbox.com.br',
    userName: 'Teste Audiovisual',
    tipo: 'Fotógrafo',
    experiencia: '5 anos',
    portfolio: 'https://portfolio.com',
    telefone: '(62) 99999-9999',
    equipamentos: 'Canon EOS R5, 24-70mm f/2.8',
    especialidades: 'Esportes, Eventos',
    comentariosOutro: ''
  };

  // Simular request da função
  const mockRequest = {
    auth: {
      uid: 'test-user-id'
    },
    data: testData
  };

  try {
    console.log('📋 Dados de teste:', testData);
    console.log('🔑 FLOWPAY_API_KEY configurada:', !!process.env.FLOWPAY_API_KEY);
    
    if (!process.env.FLOWPAY_API_KEY) {
      console.log('⚠️  FLOWPAY_API_KEY não configurada - será usado modo de simulação');
    }

    // Testar validação de dados
    console.log('\n✅ Validando dados...');
    const isValid = validateAudiovisualData(testData);
    console.log('Dados válidos:', isValid);

    // Testar verificação de inscrição existente
    console.log('\n🔍 Verificando inscrição existente...');
    const existing = await checkExistingAudiovisual(testData.userEmail);
    console.log('Inscrição já existe:', existing);

    // Simular criação de checkout
    console.log('\n💳 Simulando criação de checkout...');
    
    if (!process.env.FLOWPAY_API_KEY) {
      // Modo de simulação
      const simulatedCheckoutId = `sim_${Date.now()}_${mockRequest.auth.uid}`;
      const simulatedCheckoutUrl = "https://interbox-app-8d400.web.app/audiovisual/success?order_id=simulated&status=paid";
      
      const checkoutRef = db.collection("audiovisual_checkouts").doc();
      await checkoutRef.set({
        userId: mockRequest.auth.uid,
        userEmail: testData.userEmail,
        userName: testData.userName,
        flowpayOrderId: simulatedCheckoutId,
        externalId: `sim_audiovisual_${Date.now()}_${mockRequest.auth.uid}`,
        amount: 2990,
        status: "pending",
        audiovisualData: testData,
        checkoutUrl: simulatedCheckoutUrl,
        isSimulated: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log('✅ Checkout simulado criado com sucesso!');
      console.log('📄 ID do documento:', checkoutRef.id);
      console.log('🔗 URL de checkout:', simulatedCheckoutUrl);
      console.log('💰 Valor:', 'R$ 29,90');
      
      return {
        success: true,
        checkoutId: checkoutRef.id,
        flowpayOrderId: simulatedCheckoutId,
        checkoutUrl: simulatedCheckoutUrl,
        amount: 2990,
        isSimulated: true,
      };
    } else {
      console.log('🔗 Testando API real da FlowPay...');
      // Aqui você pode adicionar teste real da API se necessário
    }

  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Funções auxiliares (copiadas da função original)
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

async function checkExistingAudiovisual(email) {
  const existing = await db
    .collection("audiovisual")
    .where("userEmail", "==", email)
    .limit(1)
    .get();
  
  return !existing.empty;
}

// Executar teste
testFlowPayFunction()
  .then(result => {
    if (result) {
      console.log('\n🎉 Teste concluído com sucesso!');
      console.log('Resultado:', result);
    }
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Erro fatal no teste:', error);
    process.exit(1);
  }); 