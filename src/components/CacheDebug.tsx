import { useState, useEffect } from 'react';
import { clearAppCache, checkForUpdates, forceReload, detectCacheIssues, clearCacheAndReload } from '../utils/cacheUtils';
import { checkLoadIssues, detectSpecificIssues, LoadMonitor, LoadIssue } from '../utils/loadUtils';
import { logPWADebug, clearAllCaches, forceUpdateServiceWorker } from '../utils/pwaUtils';

export default function CacheDebug() {
  const [isVisible, setIsVisible] = useState(false);
  const [cacheInfo, setCacheInfo] = useState<any>({});
  const [cacheIssues, setCacheIssues] = useState<{ hasIssues: boolean; issues: string[] }>({ hasIssues: false, issues: [] });
  const [loadIssues, setLoadIssues] = useState<any>({});
  const [specificIssues, setSpecificIssues] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [loadMonitor, setLoadMonitor] = useState<LoadMonitor | null>(null);

  useEffect(() => {
    // Mostrar debug apenas em desenvolvimento ou com query param
    const urlParams = new URLSearchParams(window.location.search);
    const showDebug = urlParams.get('debug') === 'cache' || import.meta.env.DEV;
    setIsVisible(showDebug);

    if (showDebug) {
      // Inicializar monitor de carregamento
      const monitor = new LoadMonitor();
      setLoadMonitor(monitor);

      collectCacheInfo();
      checkCacheIssues();
      checkLoadIssuesInfo();
      checkSpecificIssues();

      // Atualizar informações periodicamente
      const interval = setInterval(() => {
        checkLoadIssuesInfo();
        checkSpecificIssues();
      }, 2000);

      return () => clearInterval(interval);
    }
  }, []);

  const collectCacheInfo = async () => {
    const info: any = {
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      currentScript: document.querySelector('script[src*="index-"]')?.getAttribute('src'),
      serviceWorker: 'serviceWorker' in navigator,
      caches: 'caches' in window,
      localStorage: 'localStorage' in window,
    };

    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      info.swRegistered = !!registration;
      info.swScope = registration?.scope;
      info.swWaiting = !!registration?.waiting;
      info.swInstalling = !!registration?.installing;
    }

    if ('caches' in window) {
      const cacheNames = await caches.keys();
      info.cacheNames = cacheNames;
      info.cacheCount = cacheNames.length;
    }

    setCacheInfo(info);
  };

  const checkCacheIssues = async () => {
    const issues = await detectCacheIssues();
    setCacheIssues(issues);
  };

  const checkLoadIssuesInfo = () => {
    if (loadMonitor) {
      const issues = checkLoadIssues();
      setLoadIssues(issues);
    }
  };

  const checkSpecificIssues = () => {
    const issues = detectSpecificIssues();
    setSpecificIssues(issues);
  };

  const handleClearCache = async () => {
    setLoading(true);
    try {
      await clearAppCache();
      await collectCacheInfo();
      await checkCacheIssues();
      alert('Cache limpo com sucesso!');
    } catch (error) {
      alert('Erro ao limpar cache: ' + error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckUpdates = async () => {
    setLoading(true);
    try {
      const hasUpdates = await checkForUpdates();
      alert(hasUpdates ? 'Atualizações verificadas' : 'Nenhuma atualização encontrada');
    } catch (error) {
      alert('Erro ao verificar atualizações: ' + error);
    } finally {
      setLoading(false);
    }
  };

  const handleForceReload = () => {
    forceReload();
  };

  const handleClearAndReload = async () => {
    setLoading(true);
    try {
      await clearCacheAndReload();
    } catch (error) {
      alert('Erro ao limpar cache e recarregar: ' + error);
      setLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg shadow-lg max-w-md z-50 max-h-96 overflow-y-auto">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold">🔧 Debug Completo</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>

      {/* Status dos Problemas */}
      {(cacheIssues.hasIssues || loadIssues.hasIssues || specificIssues.quirksMode) && (
        <div className="mb-3 p-2 bg-red-500/20 border border-red-500/30 rounded text-xs">
          <div className="font-bold text-red-300 mb-1">⚠️ Problemas Detectados:</div>
          <ul className="space-y-1">
            {cacheIssues.issues.map((issue: string, index: number) => (
              <li key={`cache-${index}`} className="text-red-200">• Cache: {issue}</li>
            ))}
            {loadIssues.issues?.map((issue: LoadIssue, index: number) => (
              <li key={`load-${index}`} className="text-red-200">• {issue.type}: {issue?.message ?? '—'}</li>
            ))}
            {specificIssues.quirksMode && (
              <li className="text-red-200">• Modo Quirks ativo</li>
            )}
            {specificIssues.layoutForced && (
              <li className="text-red-200">• Layout forçado detectado</li>
            )}
          </ul>
        </div>
      )}

      {/* Informações do Sistema */}
      <div className="mb-3 text-xs space-y-1">
        <div><strong>Script:</strong> {cacheInfo.currentScript?.split('/').pop() || 'N/A'}</div>
        <div><strong>SW:</strong> {cacheInfo.swRegistered ? '✅' : '❌'}</div>
        <div><strong>Caches:</strong> {cacheInfo.cacheCount || 0}</div>
        <div><strong>Tempo:</strong> {loadIssues.loadTime ? `${loadIssues.loadTime}ms` : 'N/A'}</div>
        <div><strong>Quirks:</strong> {specificIssues.quirksMode ? '❌' : '✅'}</div>
        <div><strong>CSP:</strong> {specificIssues.hasCSP ? '✅' : '❌'}</div>
      </div>

      {/* Recomendações */}
      {loadIssues.recommendations && loadIssues.recommendations.length > 0 && (
        <div className="mb-3 p-2 bg-yellow-500/20 border border-yellow-500/30 rounded text-xs">
          <div className="font-bold text-yellow-300 mb-1">💡 Recomendações:</div>
          <ul className="space-y-1">
            {loadIssues.recommendations.map((rec: string, index: number) => (
              <li key={index} className="text-yellow-200">• {rec}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Botões de Ação */}
      <div className="space-y-2">
        <button
          onClick={handleClearCache}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white text-xs py-1 px-2 rounded"
        >
          {loading ? '⏳' : '🧹'} Limpar Cache
        </button>

        <button
          onClick={handleCheckUpdates}
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white text-xs py-1 px-2 rounded"
        >
          {loading ? '⏳' : '🔄'} Verificar Atualizações
        </button>

        <button
          onClick={handleClearAndReload}
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white text-xs py-1 px-2 rounded"
        >
          {loading ? '⏳' : '💥'} Limpar + Recarregar
        </button>

        <button
          onClick={handleForceReload}
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white text-xs py-1 px-2 rounded"
        >
          🔄 Forçar Reload
        </button>



        <button
          onClick={async () => {
            setLoading(true);
            try {
              await logPWADebug();
            } finally {
              setLoading(false);
            }
          }}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 text-white text-xs py-1 px-2 rounded"
        >
          {loading ? '⏳' : '🔧'} Debug PWA
        </button>

        <button
          onClick={async () => {
            setLoading(true);
            try {
              await clearAllCaches();
              await collectCacheInfo();
            } finally {
              setLoading(false);
            }
          }}
          disabled={loading}
          className="w-full bg-pink-600 hover:bg-pink-700 disabled:bg-gray-600 text-white text-xs py-1 px-2 rounded"
        >
          {loading ? '⏳' : '🗑️'} Limpar SW Cache
        </button>

        <button
          onClick={async () => {
            setLoading(true);
            try {
              await forceUpdateServiceWorker();
            } finally {
              setLoading(false);
            }
          }}
          disabled={loading}
          className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-gray-600 text-white text-xs py-1 px-2 rounded"
        >
          {loading ? '⏳' : '⚡'} Atualizar SW
        </button>
      </div>

      {/* Logs em Tempo Real */}
      <details className="mt-3">
        <summary className="text-xs cursor-pointer hover:text-gray-300">
          📋 Ver Logs Detalhados
        </summary>
        <div className="mt-2 text-xs bg-gray-800 p-2 rounded max-h-32 overflow-y-auto">
          <pre className="whitespace-pre-wrap">
            {JSON.stringify({
              cache: cacheInfo,
              loadIssues: loadIssues,
              specificIssues: specificIssues,
            }, null, 2)}
          </pre>
        </div>
      </details>
    </div>
  );
}
