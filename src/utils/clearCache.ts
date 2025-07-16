export const clearCacheAndReload = async () => {
  try {
    console.log('🧹 Limpando cache e service worker...');

    // Limpar cache do service worker
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
        console.log('✅ Service worker desregistrado');
      }
    }

    // Limpar cache do navegador
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName)),
      );
      console.log('✅ Cache do navegador limpo');
    }

    // Limpar localStorage e sessionStorage
    localStorage.clear();
    sessionStorage.clear();
    console.log('✅ Storage limpo');

    // Forçar reload
    console.log('🔄 Recarregando página...');
    window.location.reload();
  } catch (error) {
    console.error('❌ Erro ao limpar cache:', error);
    // Mesmo com erro, tenta recarregar
    window.location.reload();
  }
};

export const forceReload = () => {
  console.log('🔄 Forçando reload da página...');
  window.location.reload();
};
