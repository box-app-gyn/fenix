#!/usr/bin/env node

const { updateTempoRealConfig, syncDataFromCollections } = require('./updateTempoRealConfig');
const { seedConfigData, updateExistingConfig } = require('./seedConfigData');

/**
 * Script de execução para atualizar configuração do tempo_real
 * Permite escolher entre diferentes opções
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'help';

  console.log('🚀 Script de Atualização da Configuração Tempo Real');
  console.log('==================================================\n');

  try {
    switch (command) {
      case 'update':
        console.log('🔄 Executando atualização completa...');
        await updateTempoRealConfig();
        await syncDataFromCollections();
        console.log('✅ Atualização completa concluída!');
        break;

      case 'seed':
        console.log('🌱 Executando seed inicial...');
        await seedConfigData();
        await syncDataFromCollections();
        console.log('✅ Seed inicial concluído!');
        break;

      case 'sync':
        console.log('🔄 Sincronizando dados das coleções...');
        await syncDataFromCollections();
        console.log('✅ Sincronização concluída!');
        break;

      case 'update-existing':
        console.log('🔄 Atualizando configuração existente...');
        await updateExistingConfig();
        await syncDataFromCollections();
        console.log('✅ Atualização de configuração existente concluída!');
        break;

      case 'help':
      default:
        console.log('📖 Comandos disponíveis:');
        console.log('');
        console.log('  update          - Atualização completa (recomendado)');
        console.log('  seed            - Seed inicial (se não existir)');
        console.log('  sync            - Apenas sincronizar dados das coleções');
        console.log('  update-existing - Atualizar configuração existente');
        console.log('  help            - Mostrar esta ajuda');
        console.log('');
        console.log('📝 Exemplos:');
        console.log('  node run-config-update.js update');
        console.log('  node run-config-update.js seed');
        console.log('  node run-config-update.js sync');
        console.log('');
        console.log('🎯 Recomendação: Use "update" para a primeira execução');
        break;
    }
  } catch (error) {
    console.error('💥 Erro durante a execução:', error);
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main();
}

module.exports = { main }; 