// Utilitários para gerenciamento de cache e atualizações

export const clearAppCache = async (): Promise<void> => {
  try {
    console.log('🧹 Iniciando limpeza de cache...');
    
    // Limpar cache do navegador
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => {
          console.log(`🗑️ Removendo cache: ${cacheName}`);
          return caches.delete(cacheName);
        })
      );
    }
    
    // Limpar storage local
    if ('localStorage' in window) {
      localStorage.clear();
      console.log('🗑️ LocalStorage limpo');
    }
    
    // Limpar session storage
    if ('sessionStorage' in window) {
      sessionStorage.clear();
      console.log('🗑️ SessionStorage limpo');
    }
    
    // Atualizar service worker
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        console.log('🔄 Atualizando service worker...');
        await registration.update();
        
        // Forçar skip waiting
        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
      }
    }
    
    console.log('✅ Cache limpo com sucesso');
  } catch (error) {
    console.error('❌ Erro ao limpar cache:', error);
    throw error;
  }
};

export const checkForUpdates = async (): Promise<boolean> => {
  try {
    if (!('serviceWorker' in navigator)) {
      return false;
    }
    
    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration) {
      return false;
    }
    
    // Verificar se há atualização disponível
    await registration.update();
    
    return !!registration.waiting;
  } catch (error) {
    console.error('❌ Erro ao verificar atualizações:', error);
    return false;
  }
};

export const forceReload = (): void => {
  // Adicionar timestamp para forçar reload
  const url = new URL(window.location.href);
  url.searchParams.set('_t', Date.now().toString());
  window.location.href = url.toString();
};

export const detectCacheIssues = async (): Promise<{
  hasIssues: boolean;
  issues: string[];
}> => {
  const issues: string[] = [];
  
  try {
    // Verificar se há service worker registrado
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (!registration) {
        issues.push('Service Worker não registrado');
      }
    }
    
    // Verificar se há caches antigos
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      const oldCaches = cacheNames.filter(name => !name.includes('cerrado-interbox-v2'));
      if (oldCaches.length > 0) {
        issues.push(`Caches antigos encontrados: ${oldCaches.join(', ')}`);
      }
    }
    
    // Verificar se o arquivo JS atual está sendo carregado
    const currentScript = document.querySelector('script[src*="index-"]')?.getAttribute('src');
    if (!currentScript) {
      issues.push('Script principal não encontrado');
    }
    
    return {
      hasIssues: issues.length > 0,
      issues
    };
  } catch (error) {
    console.error('❌ Erro ao detectar problemas de cache:', error);
    return {
      hasIssues: true,
      issues: ['Erro ao verificar cache']
    };
  }
};

export const clearCacheAndReload = async (): Promise<void> => {
  try {
    await clearAppCache();
    console.log('🔄 Recarregando página...');
    forceReload();
  } catch (error) {
    console.error('❌ Erro ao limpar cache e recarregar:', error);
    // Fallback: apenas recarregar
    forceReload();
  }
}; 