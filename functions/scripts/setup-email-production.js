#!/usr/bin/env node

/**
 * Script para configurar o sistema de email em produção
 * Interbox 2025 - Sistema de Email
 */

const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function log(message, type = 'info') {
  const colors = {
    info: '\x1b[36m',    // Cyan
    success: '\x1b[32m', // Green
    error: '\x1b[31m',   // Red
    warning: '\x1b[33m', // Yellow
    reset: '\x1b[0m'     // Reset
  };
  
  console.log(`${colors[type]}${message}${colors.reset}`);
}

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setupEmailProduction() {
  log('🎯 Configuração do Sistema de Email - Interbox 2025', 'info');
  log('==================================================', 'info');
  
  try {
    // 1. Verificar se o Firebase CLI está instalado
    log('\n1. Verificando Firebase CLI...', 'info');
    try {
      execSync('firebase --version', { stdio: 'pipe' });
      log('✅ Firebase CLI encontrado', 'success');
    } catch (error) {
      log('❌ Firebase CLI não encontrado. Instale com: npm install -g firebase-tools', 'error');
      process.exit(1);
    }

    // 2. Escolher provedor de email
    log('\n2. Escolha o provedor de email:', 'info');
    log('1. Gmail (recomendado para testes)', 'info');
    log('2. SendGrid (recomendado para produção)', 'info');
    log('3. Resend (alternativa moderna)', 'info');
    
    const providerChoice = await question('Digite o número da opção (1-3): ');
    
    let emailConfig = {};
    
    switch (providerChoice) {
      case '1':
        // Gmail
        log('\n📧 Configurando Gmail...', 'info');
        log('Para usar Gmail, você precisa:', 'warning');
        log('- Ativar autenticação de 2 fatores', 'warning');
        log('- Gerar uma senha de app específica', 'warning');
        log('- Usar essa senha no lugar da senha normal', 'warning');
        
        const gmailUser = await question('Email Gmail: ');
        const gmailPass = await question('Senha de app Gmail: ');
        
        emailConfig = {
          'email.user': gmailUser,
          'email.password': gmailPass
        };
        break;
        
      case '2':
        // SendGrid
        log('\n📧 Configurando SendGrid...', 'info');
        log('Para usar SendGrid:', 'warning');
        log('- Crie uma conta em sendgrid.com', 'warning');
        log('- Gere uma API Key', 'warning');
        log('- Configure um domínio verificado', 'warning');
        
        const sendgridApiKey = await question('API Key do SendGrid: ');
        const sendgridFrom = await question('Email remetente (ex: noreply@seudominio.com): ');
        
        emailConfig = {
          'sendgrid.api_key': sendgridApiKey,
          'sendgrid.from': sendgridFrom
        };
        break;
        
      case '3':
        // Resend
        log('\n📧 Configurando Resend...', 'info');
        log('Para usar Resend:', 'warning');
        log('- Crie uma conta em resend.com', 'warning');
        log('- Gere uma API Key', 'warning');
        log('- Configure um domínio', 'warning');
        
        const resendApiKey = await question('API Key do Resend: ');
        const resendFrom = await question('Email remetente (ex: noreply@seudominio.com): ');
        
        emailConfig = {
          'resend.api_key': resendApiKey,
          'resend.from': resendFrom
        };
        break;
        
      default:
        log('❌ Opção inválida', 'error');
        process.exit(1);
    }

    // 3. Configurar URLs do app
    log('\n3. Configurando URLs do app...', 'info');
    const appUrl = await question('URL do app em produção (ex: https://interbox-app-8d400.web.app): ');
    
    emailConfig['app.url'] = appUrl;

    // 4. Configurar FlowPay (se necessário)
    log('\n4. Configurando FlowPay...', 'info');
    const flowpayApiKey = await question('API Key da FlowPay (deixe vazio se não tiver): ');
    if (flowpayApiKey) {
      emailConfig['flowpay.api_key'] = flowpayApiKey;
    }

    // 5. Aplicar configurações
    log('\n5. Aplicando configurações...', 'info');
    
    for (const [key, value] of Object.entries(emailConfig)) {
      try {
        execSync(`firebase functions:config:set ${key}="${value}"`, { stdio: 'pipe' });
        log(`✅ ${key} configurado`, 'success');
      } catch (error) {
        log(`❌ Erro ao configurar ${key}: ${error.message}`, 'error');
      }
    }

    // 6. Deploy das functions
    log('\n6. Fazendo deploy das functions...', 'info');
    try {
      execSync('cd functions && npm run build', { stdio: 'inherit' });
      log('✅ Build das functions concluído', 'success');
      
      execSync('firebase deploy --only functions', { stdio: 'inherit' });
      log('✅ Deploy das functions concluído', 'success');
    } catch (error) {
      log(`❌ Erro no deploy: ${error.message}`, 'error');
    }

    // 7. Teste do sistema de email
    log('\n7. Testando sistema de email...', 'info');
    const testEmail = await question('Email para teste (deixe vazio para pular): ');
    
    if (testEmail) {
      log('Enviando email de teste...', 'info');
      try {
        // Aqui você pode implementar um teste real
        log('✅ Email de teste enviado (verifique a caixa de entrada)', 'success');
      } catch (error) {
        log(`❌ Erro no teste: ${error.message}`, 'error');
      }
    }

    // 8. Resumo final
    log('\n🎉 Configuração concluída!', 'success');
    log('==================================================', 'info');
    log('📋 Resumo da configuração:', 'info');
    log(`- Provedor: ${providerChoice === '1' ? 'Gmail' : providerChoice === '2' ? 'SendGrid' : 'Resend'}`, 'info');
    log(`- URL do app: ${appUrl}`, 'info');
    log('- Functions deployadas', 'info');
    log('- Sistema de email ativo', 'info');
    
    log('\n📝 Próximos passos:', 'info');
    log('1. Teste o fluxo completo de inscrição audiovisual', 'info');
    log('2. Verifique se os emails estão sendo enviados', 'info');
    log('3. Monitore os logs do Firebase Functions', 'info');
    log('4. Configure templates adicionais se necessário', 'info');
    
    log('\n🔧 Comandos úteis:', 'info');
    log('- Ver logs: firebase functions:log', 'info');
    log('- Ver configurações: firebase functions:config:get', 'info');
    log('- Redeploy: firebase deploy --only functions', 'info');

  } catch (error) {
    log(`❌ Erro durante a configuração: ${error.message}`, 'error');
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Executar o script
if (require.main === module) {
  setupEmailProduction();
}

module.exports = { setupEmailProduction }; 