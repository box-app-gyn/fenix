// Script para corrigir problemas do Service Worker
console.log('🔧 Iniciando correção do Service Worker...');

// Limpar todos os caches
async function clearAllCaches() {
  if ('caches' in window) {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map(cacheName => {
        console.log('🗑️ Removendo cache:', cacheName);
        return caches.delete(cacheName);
      })
    );
  }
}

// Limpar localStorage e sessionStorage
function clearStorage() {
  console.log('🧹 Limpando storage...');
  localStorage.clear();
  sessionStorage.clear();
}

// Forçar atualização do Service Worker
async function forceSWUpdate() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        console.log('🔄 Forçando atualização do SW...');
        await registration.update();
        
        // Aguardar um pouco e então recarregar
        setTimeout(() => {
          console.log('🔄 Recarregando página...');
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error('❌ Erro ao atualizar SW:', error);
    }
  }
}

// Executar correções
async function fixServiceWorker() {
  console.log('🚀 Iniciando correções...');
  
  await clearAllCaches();
  clearStorage();
  await forceSWUpdate();
  
  console.log('✅ Correções aplicadas!');
}

// Executar se chamado diretamente
if (typeof window !== 'undefined') {
  fixServiceWorker();
}

module.exports = { fixServiceWorker }; 