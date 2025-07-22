const _CACHE_NAME = 'interbox-cache-v1.3.0';
const STATIC_CACHE = 'interbox-static-v1.3.0';
const DYNAMIC_CACHE = 'interbox-dynamic-v1.3.0';
const RUNTIME_CACHE = 'interbox-runtime-v1.3.0';

// Configurações de cache
const CACHE_CONFIG = {
  STATIC_MAX_AGE: 7 * 24 * 60 * 60 * 1000, // 7 dias
  DYNAMIC_MAX_AGE: 24 * 60 * 60 * 1000,     // 1 dia
  RUNTIME_MAX_AGE: 60 * 60 * 1000,          // 1 hora
  CLEANUP_AGE: 30 * 24 * 60 * 60 * 1000,    // 30 dias
};

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/apple-touch-icon.png',
  '/favicon-16x16.png',
  '/favicon-32x32.png',
  '/favicon-192x192.png',
  '/favicon-512x512.png',
  '/logos/logo_circulo.png',
  '/images/bg_main.png',
  '/images/bg_rounded.png',
  '/images/twolines.png',
  '/images/pngtree-light-gray-old-paper.png',
  '/logos/oficial_logo.png',
  '/logos/nome_hrz.png',
  '/offline.html',
];

// URLs que NUNCA devem ser cacheadas (Firebase Auth, APIs críticas)
const NEVER_CACHE = [
  /^https:\/\/(firebase|identitytoolkit|securetoken|accounts|apis)\.googleapis\.com/,
  /^https:\/\/firestore\.googleapis\.com/,
  /^https:\/\/storage\.googleapis\.com/,
  /^https:\/\/www\.google-analytics\.com/,
  /^https:\/\/analytics\.google\.com/,
  /^https:\/\/googletagmanager\.com/,
  /^https:\/\/www\.googletagmanager\.com/,
];

// URLs que devem sempre usar Network First (dados dinâmicos)
const NETWORK_FIRST = [
  /^https:\/\/api\./,
  /^https:\/\/functions\./,
  /^https:\/\/us-central1-/,
  /^https:\/\/us-east1-/,
];

// URLs que devem usar Cache First (assets estáticos)
const CACHE_FIRST = [
  /\.(png|jpg|jpeg|gif|svg|ico|webp)$/,
  /\.(css|js)$/,
  /\.(woff|woff2|ttf|eot)$/,
  /^https:\/\/fonts\.googleapis\.com/,
  /^https:\/\/fonts\.gstatic\.com/,
];

// Instala e faz precache
self.addEventListener('install', (event) => {
  console.log('⚙️ Instalando SW v1.3.0 e fazendo precache...');
  
  event.waitUntil(
    Promise.all([
      // Precache de assets críticos (apenas se não estiver usando Workbox)
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('📦 Fazendo precache de', PRECACHE_URLS.length, 'assets...');
        return cache.addAll(PRECACHE_URLS).catch((error) => {
          console.warn('⚠️ Alguns assets não puderam ser cacheados:', error);
          // Continuar mesmo com erros
          return Promise.resolve();
        });
      }),
      // Preparar outros caches
      caches.open(DYNAMIC_CACHE),
      caches.open(RUNTIME_CACHE)
    ]).then(() => {
      console.log('✅ Precache concluído com sucesso');
    }).catch((error) => {
      console.error('❌ Erro no precache:', error);
    })
  );
  
  // Forçar ativação imediata
  self.skipWaiting();
});

// Ativação: limpa caches antigos e força atualização
self.addEventListener('activate', (event) => {
  console.log('🧹 Ativando SW v1.3.0 e limpando caches antigos...');
  
  event.waitUntil(
    Promise.all([
      // Limpar caches antigos
      caches.keys().then((names) => {
        const oldCaches = names.filter(name => 
          name !== STATIC_CACHE && 
          name !== DYNAMIC_CACHE && 
          name !== RUNTIME_CACHE
        );
        
        console.log('🗑️ Removendo caches antigos:', oldCaches);
        
        return Promise.all(
          oldCaches.map(name => {
            console.log('🗑️ Removendo cache:', name);
            return caches.delete(name);
          })
        );
      }),
      // Forçar atualização de todos os clients
      self.clients.claim().then(() => {
        console.log('👥 SW assumiu controle de todos os clients');
      }),
      // Limpar cache de assets antigos
      clearOldAssets()
    ]).then(() => {
      console.log('✅ Ativação do SW concluída');
    }).catch((error) => {
      console.error('❌ Erro na ativação do SW:', error);
    })
  );
});

// Estratégia de cache inteligente otimizada para PWA
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Skip non-GET requests
  if (req.method !== 'GET') return;

  // Verificar se é um asset do Workbox (deixar o Workbox lidar)
  if (url.pathname.includes('workbox-') || url.pathname.includes('__WB_REVISION__')) {
    return; // Deixar o Workbox lidar com seus próprios assets
  }

  // Log para debugging (apenas em desenvolvimento)
  if (self.location.hostname === 'localhost') {
    console.log('🌐 SW interceptando:', req.url);
  }

  // Firebase Auth e APIs críticas - SEMPRE network only
  if (NEVER_CACHE.some(pattern => pattern.test(url.href))) {
    if (self.location.hostname === 'localhost') {
      console.log('🚫 Network Only (Firebase):', req.url);
    }
    event.respondWith(networkOnly(req));
    return;
  }

  // Dados dinâmicos - Network First
  if (NETWORK_FIRST.some(pattern => pattern.test(url.href))) {
    if (self.location.hostname === 'localhost') {
      console.log('🌐 Network First (API):', req.url);
    }
    event.respondWith(networkFirst(req, RUNTIME_CACHE));
    return;
  }

  // Assets estáticos - Cache First com versioning
  if (CACHE_FIRST.some(pattern => pattern.test(url.href)) ||
      req.destination === 'image' || 
      req.destination === 'font' || 
      req.destination === 'style' ||
      req.destination === 'script' ||
      url.pathname.includes('/assets/') ||
      url.pathname.includes('/logos/') ||
      url.pathname.includes('/images/')) {
    
    if (self.location.hostname === 'localhost') {
      console.log('💾 Cache First (Asset):', req.url);
    }
    event.respondWith(cacheFirstWithVersioning(req, STATIC_CACHE));
    return;
  }

  // HTML - Network First com fallback para index.html
  if (req.destination === 'document') {
    if (self.location.hostname === 'localhost') {
      console.log('📄 Network First (HTML):', req.url);
    }
    event.respondWith(networkFirstWithFallback(req, DYNAMIC_CACHE));
    return;
  }

  // API calls - Network First
  if (url.pathname.includes('/api/') || url.pathname.includes('/functions/')) {
    if (self.location.hostname === 'localhost') {
      console.log('🌐 Network First (API):', req.url);
    }
    event.respondWith(networkFirst(req, RUNTIME_CACHE));
    return;
  }

  // Default - Cache First
  if (self.location.hostname === 'localhost') {
    console.log('💾 Cache First (Default):', req.url);
  }
  event.respondWith(cacheFirst(req, DYNAMIC_CACHE));
});

// Cache First Strategy com versioning
async function cacheFirstWithVersioning(req, cacheName) {
  const cached = await caches.match(req);
  if (cached) {
    // Verificar se o cache não está muito antigo
    const cacheTime = cached.headers.get('sw-cache-time');
    const maxAge = cacheName === STATIC_CACHE ? CACHE_CONFIG.STATIC_MAX_AGE : CACHE_CONFIG.DYNAMIC_MAX_AGE;
    
    if (cacheTime && (Date.now() - parseInt(cacheTime)) < maxAge) {
      if (self.location.hostname === 'localhost') {
        console.log('💾 Cache hit:', req.url);
      }
      return cached;
    } else {
      if (self.location.hostname === 'localhost') {
        console.log('⏰ Cache expirado:', req.url);
      }
    }
  }
  
  try {
    const res = await fetch(req);
    if (res.ok) {
      const cache = await caches.open(cacheName);
      // Adicionar timestamp ao cache
      const clonedRes = res.clone();
      const headers = new Headers(clonedRes.headers);
      headers.set('sw-cache-time', Date.now().toString());
      
      const cachedResponse = new Response(await clonedRes.arrayBuffer(), {
        status: clonedRes.status,
        statusText: clonedRes.statusText,
        headers: headers
      });
      
      cache.put(req, cachedResponse);
    }
    return res;
  } catch (err) {
    console.warn('⚠️ Cache first falhou:', req.url);
    return cached || new Response('Offline', { status: 503 });
  }
}

// Network First Strategy com fallback inteligente
async function networkFirstWithFallback(req, cacheName) {
  try {
    const res = await fetch(req);
    if (res.ok) {
      const cache = await caches.open(cacheName);
      cache.put(req, res.clone());
    }
    return res;
  } catch (err) {
    const cached = await caches.match(req);
    if (cached) return cached;
    
    // Fallback para index.html em caso de erro de rota
    if (req.destination === 'document') {
      const fallback = await caches.match('/index.html');
      if (fallback) return fallback;
    }
    
    return new Response('Offline', { status: 503 });
  }
}

// Cache First Strategy
async function cacheFirst(req, cacheName) {
  const cached = await caches.match(req);
  if (cached) return cached;
  
  try {
    const res = await fetch(req);
    if (res.ok) {
      const cache = await caches.open(cacheName);
      cache.put(req, res.clone());
    }
    return res;
  } catch (err) {
    console.warn('⚠️ Cache first falhou:', req.url);
    return new Response('Offline', { status: 503 });
  }
}

// Network First Strategy
async function networkFirst(req, cacheName) {
  try {
    const res = await fetch(req);
    if (res.ok) {
      const cache = await caches.open(cacheName);
      cache.put(req, res.clone());
    }
    return res;
  } catch (err) {
    const cached = await caches.match(req);
    if (cached) return cached;
    
    return new Response('Offline', { status: 503 });
  }
}

// Network Only Strategy
async function networkOnly(req) {
  try {
    return await fetch(req);
  } catch (err) {
    console.warn('⚠️ Network only falhou:', req.url);
    return new Response('Offline', { status: 503 });
  }
}

// Limpar assets antigos
async function clearOldAssets() {
  try {
    console.log('🧹 Iniciando limpeza de assets antigos...');
    
    const cacheNames = [STATIC_CACHE, DYNAMIC_CACHE, RUNTIME_CACHE];
    let totalCleaned = 0;
    
    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const requests = await cache.keys();
      
      for (const request of requests) {
        const response = await cache.match(request);
        if (response) {
          const cacheTime = response.headers.get('sw-cache-time');
          if (cacheTime && (Date.now() - parseInt(cacheTime)) > CACHE_CONFIG.CLEANUP_AGE) {
            await cache.delete(request);
            totalCleaned++;
            
            if (self.location.hostname === 'localhost') {
              console.log('🗑️ Limpou asset antigo:', request.url);
            }
          }
        }
      }
    }
    
    console.log(`🧹 Limpeza concluída: ${totalCleaned} assets removidos`);
  } catch (error) {
    console.warn('⚠️ Erro ao limpar assets antigos:', error);
  }
}

// Background sync para atualizações
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  console.log('🔄 Executando background sync...');
  // Implementar lógica de sync quando necessário
}

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Nova notificação do CERRADØ!',
    icon: '/logos/logo_circulo.png',
    badge: '/logos/logo_circulo.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver mais',
        icon: '/logos/logo_circulo.png'
      },
      {
        action: 'close',
        title: 'Fechar',
        icon: '/logos/logo_circulo.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('CERRADØ INTERBOX 2025', options)
  );
});

// Notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      self.clients.openWindow('/hub')
    );
  }
});

// Interceptar mensagens do cliente
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('⏭️ Pulando espera do SW...');
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    console.log('🧹 Limpeza de cache solicitada...');
    event.waitUntil(clearAllCaches());
  }
  
  if (event.data && event.data.type === 'GET_CACHE_STATS') {
    console.log('📊 Estatísticas de cache solicitadas...');
    event.waitUntil(getCacheStats().then(stats => {
      event.ports[0].postMessage(stats);
    }));
  }
});

// Obter estatísticas do cache
async function getCacheStats() {
  try {
    const cacheNames = [STATIC_CACHE, DYNAMIC_CACHE, RUNTIME_CACHE];
    const stats = {
      totalEntries: 0,
      totalSize: 0,
      caches: {}
    };
    
    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const requests = await cache.keys();
      const entries = [];
      
      for (const request of requests) {
        const response = await cache.match(request);
        if (response) {
          const cacheTime = response.headers.get('sw-cache-time');
          const size = response.headers.get('content-length') || 0;
          
          entries.push({
            url: request.url,
            size: parseInt(size),
            cachedAt: cacheTime ? new Date(parseInt(cacheTime)).toISOString() : null,
            age: cacheTime ? Date.now() - parseInt(cacheTime) : null
          });
          
          stats.totalEntries++;
          stats.totalSize += parseInt(size);
        }
      }
      
      stats.caches[cacheName] = {
        entries: entries.length,
        size: entries.reduce((sum, entry) => sum + entry.size, 0),
        items: entries
      };
    }
    
    return stats;
  } catch (error) {
    console.error('❌ Erro ao obter estatísticas do cache:', error);
    return { error: error.message };
  }
}

// Limpar todos os caches
async function clearAllCaches() {
  try {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map(cacheName => caches.delete(cacheName))
    );
    console.log('🧹 Todos os caches foram limpos');
  } catch (error) {
    console.error('❌ Erro ao limpar caches:', error);
  }
}
