#!/usr/bin/env node

/**
 * Script para configurar o sistema de email do Interbox 2025
 *
 * Uso:
 * node scripts/setup-email.js
 */

const {execSync} = require("child_process");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

/**
 * Faz uma pergunta ao usuário via linha de comando
 * @param {string} prompt - A pergunta a ser exibida
 * @return {Promise<string>} Resposta do usuário
 */
function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

/**
 * Exibe uma mensagem colorida no console
 * @param {string} message - Mensagem a ser exibida
 * @param {string} type - Tipo da mensagem (info, success, warning, error)
 */
function log(message, type = "info") {
  const colors = {
    info: "\x1b[36m", // Cyan
    success: "\x1b[32m", // Green
    warning: "\x1b[33m", // Yellow
    error: "\x1b[31m", // Red
    reset: "\x1b[0m", // Reset
  };

  console.log(`${colors[type]}${message}${colors.reset}`);
}

/**
 * Função principal para configurar o sistema de email
 */
async function setupEmail() {
  log("🎯 Configuração do Sistema de Email - Interbox 2025", "info");
  log("==================================================", "info");

  try {
    // Verificar se o Firebase CLI está instalado
    try {
      execSync("firebase --version", {stdio: "ignore"});
    } catch (error) {
      log("❌ Firebase CLI não encontrado. Instale com: " +
          "npm install -g firebase-tools", "error");
      process.exit(1);
    }

    // Verificar se está logado no Firebase
    try {
      execSync("firebase projects:list", {stdio: "ignore"});
    } catch (error) {
      log("❌ Não logado no Firebase. Execute: firebase login", "error");
      process.exit(1);
    }

    log("✅ Firebase CLI configurado", "success");

    // Escolher provedor de email
    log("\n📧 Escolha o provedor de email:", "info");
    log("1. Gmail (recomendado para desenvolvimento)", "info");
    log("2. SendGrid (recomendado para produção)", "info");
    log("3. Configurar ambos", "info");

    const providerChoice = await question("Digite sua escolha (1-3): ");

    if (providerChoice === "1" || providerChoice === "3") {
      await setupGmail();
    }

    if (providerChoice === "2" || providerChoice === "3") {
      await setupSendGrid();
    }

    // Configurar domínios permitidos
    await setupAllowedDomains();

    // Configurar templates
    await setupTemplates();

    log("\n✅ Configuração concluída com sucesso!", "success");
    log("\n📋 Próximos passos:", "info");
    log("1. Teste o sistema: npm run test:email", "info");
    log("2. Deploy das funções: firebase deploy --only functions", "info");
    log("3. Verifique os logs: firebase functions:log", "info");
  } catch (error) {
    log(`❌ Erro durante a configuração: ${error.message}`, "error");
    process.exit(1);
  } finally {
    rl.close();
  }
}

/**
 * Configura as credenciais do Gmail
 */
async function setupGmail() {
  log("\n📧 Configurando Gmail...", "info");

  const gmailUser = await question("Digite seu email Gmail: ");
  const gmailPassword = await question("Digite sua senha de app Gmail: ");

  if (!gmailUser || !gmailPassword) {
    log("❌ Email e senha são obrigatórios", "error");
    return;
  }

  try {
    execSync(`firebase functions:config:set email.user="${gmailUser}"`,
        {stdio: "ignore"});
    execSync(
        `firebase functions:config:set email.password="${gmailPassword}"`,
        {stdio: "ignore"},
    );

    log("✅ Configuração Gmail salva", "success");
    log("💡 Dica: Use senha de app, não sua senha principal do Gmail",
        "warning");
  } catch (error) {
    log(`❌ Erro ao configurar Gmail: ${error.message}`, "error");
  }
}

/**
 * Configura as credenciais do SendGrid
 */
async function setupSendGrid() {
  log("\n📧 Configurando SendGrid...", "info");

  const sendgridApiKey = await question("Digite sua API Key do SendGrid: ");
  const sendgridFrom = await question(
      "Digite o email remetente (ex: noreply@interbox2025.com): ");

  if (!sendgridApiKey || !sendgridFrom) {
    log("❌ API Key e email remetente são obrigatórios", "error");
    return;
  }

  try {
    execSync(
        `firebase functions:config:set sendgrid.api_key="${sendgridApiKey}"`,
        {stdio: "ignore"},
    );
    execSync(`firebase functions:config:set sendgrid.from="${sendgridFrom}"`,
        {stdio: "ignore"});

    log("✅ Configuração SendGrid salva", "success");
  } catch (error) {
    log(`❌ Erro ao configurar SendGrid: ${error.message}`, "error");
  }
}

/**
 * Configura domínios de email permitidos
 */
async function setupAllowedDomains() {
  log("\n🌐 Configurando domínios permitidos...", "info");

  const useRestriction = await question(
      "Deseja restringir domínios de email? (s/n): ",
  );

  if (useRestriction.toLowerCase() === "s") {
    const domains = await question(
        "Digite os domínios permitidos (separados por vírgula): ");

    if (domains) {
      const domainList = domains.split(",").map((d) => d.trim());
      log(`✅ Domínios configurados: ${domainList.join(", ")}`, "success");
      log("💡 Configure manualmente no arquivo config/email.ts", "warning");
    }
  } else {
    log("✅ Sem restrição de domínios", "success");
  }
}

/**
 * Configura templates de email
 */
async function setupTemplates() {
  log("\n📝 Configurando templates...", "info");

  log("✅ Templates padrão configurados:", "success");
  log("  - Pedido confirmado", "info");
  log("  - Status audiovisual", "info");
  log("  - Notificação admin", "info");
  log("  - Boas-vindas", "info");

  const customizeTemplates = await question(
      "Deseja personalizar os templates? (s/n): ",
  );

  if (customizeTemplates.toLowerCase() === "s") {
    log("💡 Edite os templates no arquivo config/email.ts", "warning");
    log(
        "💡 Use variáveis: ${data.userName}, ${data.userEmail}, etc.",
        "warning",
    );
  }
}

/**
 * Testa a configuração do sistema de email
 */
async function testEmailConfig() {
  log("\n🧪 Testando configuração...", "info");

  try {
    // Verificar configurações
    const config = execSync("firebase functions:config:get", {
      encoding: "utf8",
    });
    log("✅ Configurações carregadas", "success");

    // Verificar se há pelo menos um provedor configurado
    const configObj = JSON.parse(config);

    if (configObj.email || configObj.sendgrid) {
      log("✅ Pelo menos um provedor configurado", "success");
    } else {
      log("❌ Nenhum provedor configurado", "error");
    }
  } catch (error) {
    log(`❌ Erro ao testar configuração: ${error.message}`, "error");
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  setupEmail();
}

module.exports = {
  setupEmail,
  testEmailConfig,
};
