import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';

interface Metrics {
  pageLoadTime: number;
  authLoadTime: number;
  currentRoute: string;
  userAgent: string;
  screenSize: string;
  connectionType: string;
  timestamp: string;
}

export default function UserExperienceMetrics() {
  const { user, loading } = useAuth();
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Só mostrar em desenvolvimento ou com query param
    const urlParams = new URLSearchParams(window.location.search);
    const showMetrics = urlParams.get('debug') === 'metrics' || import.meta.env.DEV;
    setIsVisible(showMetrics);

    if (!showMetrics) return;

    const startTime = performance.now();
    const authStartTime = performance.now();

    const updateMetrics = () => {
      const pageLoadTime = performance.now() - startTime;
      const authLoadTime = loading ? performance.now() - authStartTime : 0;

      const newMetrics: Metrics = {
        pageLoadTime: Math.round(pageLoadTime),
        authLoadTime: Math.round(authLoadTime),
        currentRoute: window.location.pathname,
        userAgent: navigator.userAgent,
        screenSize: `${window.innerWidth}x${window.innerHeight}`,
        connectionType: (navigator as any).connection?.effectiveType || 'unknown',
        timestamp: new Date().toISOString(),
      };

      setMetrics(newMetrics);

      // Log para console
      console.log('📊 Métricas de UX:', newMetrics);
    };

    // Atualizar métricas quando loading mudar
    if (!loading) {
      updateMetrics();
    }

    // Atualizar a cada 5 segundos
    const interval = setInterval(updateMetrics, 5000);

    return () => clearInterval(interval);
  }, [loading]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 bg-black/90 text-white p-4 rounded-lg shadow-lg max-w-sm z-50 text-xs">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold">📊 UX Metrics</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>

      {metrics && (
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>⏱️ Page Load:</span>
            <span className={metrics.pageLoadTime > 3000 ? 'text-red-400' : 'text-green-400'}>
              {metrics.pageLoadTime}ms
            </span>
          </div>
          
          <div className="flex justify-between">
            <span>🔐 Auth Load:</span>
            <span className={metrics.authLoadTime > 5000 ? 'text-red-400' : 'text-green-400'}>
              {loading ? 'Loading...' : `${metrics.authLoadTime}ms`}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span>📍 Route:</span>
            <span className="text-blue-400">{metrics.currentRoute}</span>
          </div>
          
          <div className="flex justify-between">
            <span>📱 Screen:</span>
            <span>{metrics.screenSize}</span>
          </div>
          
          <div className="flex justify-between">
            <span>🌐 Connection:</span>
            <span>{metrics.connectionType}</span>
          </div>
          
          <div className="flex justify-between">
            <span>👤 User:</span>
            <span className={user ? 'text-green-400' : 'text-gray-400'}>
              {user ? 'Logged In' : 'Not Logged'}
            </span>
          </div>
        </div>
      )}

      <div className="mt-3 pt-2 border-t border-gray-700">
        <button
          onClick={() => {
            if (metrics) {
              console.log('📊 Métricas completas:', metrics);
              navigator.clipboard.writeText(JSON.stringify(metrics, null, 2));
              alert('Métricas copiadas para clipboard!');
            }
          }}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 px-2 rounded"
        >
          📋 Copiar Métricas
        </button>
      </div>
    </div>
  );
} 