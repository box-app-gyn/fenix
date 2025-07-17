#!/usr/bin/env node

const { updateTempoRealConfig, syncDataFromCollections } = require('./updateTempoRealConfig');

/**
 * Script simplificado para executar a atualização da configuração
 * Este é o script principal que deve ser executado
 */
async function executarAtualizacao() {
  console.log('🚀 Iniciando Atualização da Configuração Tempo Real');
  console.log('==================================================\n');

  try {
    // 1. Atualizar configuração
    console.log('📊 Passo 1: Atualizando estrutura da configuração...');
    await updateTempoRealConfig();
    
    // 2. Sincronizar dados
    console.log('🔄 Passo 2: Sincronizando dados das coleções...');
    await syncDataFromCollections();
    
    console.log('\n🎉 Atualização concluída com sucesso!');
    console.log('✅ Configuração tempo_real está pronta para uso');
    console.log('📊 Dados sincronizados das coleções');
    console.log('🎯 Componente TempoReal funcionando corretamente');
    
  } catch (error) {
    console.error('💥 Erro durante a atualização:', error);
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  executarAtualizacao();
}

module.exports = { executarAtualizacao }; 