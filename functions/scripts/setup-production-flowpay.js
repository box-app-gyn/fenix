#!/usr/bin/env node

const {execSync} = require("child_process");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

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

async function setupProductionFlowPay() {
  console.log("🚀 Configuração da FlowPay para Produção");
  console.log("==================================================\n");

  try {
    // 1. Verificar configuração atual
    log("1. Verificando configuração atual...", "info");

    try {
      const currentConfig = execSync("firebase functions:config:get", {encoding: "utf8"});
      console.log("📋 Configuração atual:");
      console.log(currentConfig);
    } catch (error) {
      log("⚠️  Nenhuma configuração encontrada", "warning");
    }

    // 2. Configurar API Key da FlowPay
    log("\n2. Configurando API Key da FlowPay...", "info");

    const currentApiKey = execSync("firebase functions:config:get flowpay.api_key", {encoding: "utf8"}).trim();
    console.log("🔑 API Key atual:", currentApiKey);

    const useCurrentKey = await question("Usar API Key atual? (s/n): ");

    let apiKey = currentApiKey;
    if (useCurrentKey.toLowerCase() !== "s") {
      apiKey = await question("Digite a nova API Key da FlowPay: ");
    }

    if (!apiKey) {
      log("❌ API Key é obrigatória", "error");
      return;
    }

    // 3. Configurar domínio da FlowPay
    log("\n3. Configurando domínio da FlowPay...", "info");

    const flowpayDomain = await question("Domínio da FlowPay (padrão: https://flowpay.com/api): ") || "https://flowpay.com/api";

    // 4. Configurar modo de operação
    log("\n4. Configurando modo de operação...", "info");

    console.log("Escolha o modo de operação:");
    console.log("1. Modo Real (usa API da FlowPay)");
    console.log("2. Modo Simulação (para testes sem pagamento real)");
    console.log("3. Modo Híbrido (real quando possível, simulação como fallback)");

    const mode = await question("Escolha o modo (1/2/3): ");

    let operationMode = "hybrid";
    if (mode === "1") operationMode = "real";
    else if (mode === "2") operationMode = "simulation";
    else operationMode = "hybrid";

    // 5. Configurar URLs
    log("\n5. Configurando URLs...", "info");

    const appUrl = await question("URL do app em produção (padrão: https://interbox-app-8d400.web.app): ") || "https://interbox-app-8d400.web.app";
    const successUrl = `${appUrl}/audiovisual/success`;
    const webhookUrl = "https://us-central1-interbox-app-8d400.cloudfunctions.net/webhookFlowPay";

    // 6. Aplicar configurações
    log("\n6. Aplicando configurações...", "info");

    const configs = {
      "flowpay.api_key": apiKey,
      "flowpay.domain": flowpayDomain,
      "flowpay.mode": operationMode,
      "app.url": appUrl,
      "flowpay.success_url": successUrl,
      "flowpay.webhook_url": webhookUrl,
    };

    for (const [key, value] of Object.entries(configs)) {
      try {
        execSync(`firebase functions:config:set ${key}="${value}"`, {stdio: "pipe"});
        log(`✅ ${key} configurado`, "success");
      } catch (error) {
        log(`❌ Erro ao configurar ${key}: ${error.message}`, "error");
      }
    }

    // 7. Build e deploy das functions
    log("\n7. Fazendo build e deploy das functions...", "info");

    try {
      execSync("npm run build", {stdio: "inherit"});
      log("✅ Build das functions concluído", "success");

      execSync("firebase deploy --only functions", {stdio: "inherit"});
      log("✅ Deploy das functions concluído", "success");
    } catch (error) {
      log(`❌ Erro no deploy: ${error.message}`, "error");
    }

    // 8. Teste da configuração
    log("\n8. Testando configuração...", "info");

    const testConfig = await question("Fazer teste da configuração? (s/n): ");

    if (testConfig.toLowerCase() === "s") {
      try {
        execSync("node scripts/test-flowpay-function.js", {stdio: "inherit"});
        log("✅ Teste concluído com sucesso", "success");
      } catch (error) {
        log(`⚠️  Teste falhou: ${error.message}`, "warning");
      }
    }

    // 9. Resumo final
    log("\n🎉 Configuração concluída!", "success");
    console.log("==================================================");
    log("📋 Resumo da configuração:", "info");
    console.log(`🔑 API Key: ${apiKey.substring(0, 10)}...`);
    console.log(`🌐 Domínio: ${flowpayDomain}`);
    console.log(`🎯 Modo: ${operationMode}`);
    console.log(`🔗 App URL: ${appUrl}`);
    console.log(`✅ Success URL: ${successUrl}`);
    console.log(`🔗 Webhook URL: ${webhookUrl}`);

    log("\n🚀 Sistema pronto para produção!", "success");

    if (operationMode === "simulation") {
      log("⚠️  ATENÇÃO: Sistema em modo de simulação", "warning");
      log("Os pagamentos serão simulados para testes", "warning");
    } else if (operationMode === "hybrid") {
      log("⚠️  ATENÇÃO: Sistema em modo híbrido", "warning");
      log("Tentará usar API real, com fallback para simulação", "warning");
    } else {
      log("✅ Sistema configurado para pagamentos reais", "success");
    }
  } catch (error) {
    log(`💥 Erro durante configuração: ${error.message}`, "error");
  } finally {
    rl.close();
  }
}

// Executar configuração
setupProductionFlowPay();
