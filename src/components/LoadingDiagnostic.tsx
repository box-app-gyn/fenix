import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';

interface DiagnosticInfo {
  authState: string;
  firebaseStatus: string;
  networkStatus: string;
  cacheStatus: string;
  swStatus: string;
  timestamp: string;
}

export default function LoadingDiagnostic() {
  const { user, loading } = useAuth();
  const [diagnostic, setDiagnostic] = useState<DiagnosticInfo | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Só mostrar em desenvolvimento ou com query param
    const urlParams = new URLSearchParams(window.location.search);
    const showDiagnostic = urlParams.get('debug') === 'loading' || import.meta.env.DEV;
    setIsVisible(showDiagnostic);

    if (!showDiagnostic) return;

    const runDiagnostic = async () => {
      const info: DiagnosticInfo = {
        authState: loading ? 'Loading...' : (user ? 'Authenticated' : 'Not Authenticated'),
        firebaseStatus: 'Checking...',
        networkStatus: navigator.onLine ? 'Online' : 'Offline',
        cacheStatus: 'Checking...',
        swStatus: 'Checking...',
        timestamp: new Date().toISOString(),
      };

      // Verificar Firebase
      try {
        if (typeof window !== 'undefined' && (window as any).firebase) {
          info.firebaseStatus = 'Available';
        } else {
          info.firebaseStatus = 'Not Available';
        }
      } catch (error) {
        info.firebaseStatus = 'Error';
      }

      // Verificar Service Worker
      try {
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.getRegistration();
          info.swStatus = registration ? 'Active' : 'Not Registered';
        } else {
          info.swStatus = 'Not Supported';
        }
      } catch (error) {
        info.swStatus = 'Error';
      }

      // Verificar Cache
      try {
        if ('caches' in window) {
          const cacheNames = await caches.keys();
          info.cacheStatus = `${cacheNames.length} caches found`;
        } else {
          info.cacheStatus = 'Not Supported';
        }
      } catch (error) {
        info.cacheStatus = 'Error';
      }

      setDiagnostic(info);
      console.log('🔍 Loading Diagnostic:', info);
    };

    runDiagnostic();
    const interval = setInterval(runDiagnostic, 3000);

    return () => clearInterval(interval);
  }, [user, loading]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 bg-black/90 text-white p-4 rounded-lg shadow-lg max-w-sm z-50 text-xs">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold">🔍 Loading Diagnostic</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>

      {diagnostic && (
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>🔐 Auth:</span>
            <span className={
              diagnostic.authState === 'Authenticated' ? 'text-green-400' :
              diagnostic.authState === 'Loading...' ? 'text-yellow-400' :
              'text-gray-400'
            }>
              {diagnostic.authState}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span>🔥 Firebase:</span>
            <span className={
              diagnostic.firebaseStatus === 'Available' ? 'text-green-400' :
              diagnostic.firebaseStatus === 'Error' ? 'text-red-400' :
              'text-yellow-400'
            }>
              {diagnostic.firebaseStatus}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span>🌐 Network:</span>
            <span className={
              diagnostic.networkStatus === 'Online' ? 'text-green-400' : 'text-red-400'
            }>
              {diagnostic.networkStatus}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span>🗄️ Cache:</span>
            <span className="text-blue-400">{diagnostic.cacheStatus}</span>
          </div>
          
          <div className="flex justify-between">
            <span>⚙️ SW:</span>
            <span className={
              diagnostic.swStatus === 'Active' ? 'text-green-400' :
              diagnostic.swStatus === 'Error' ? 'text-red-400' :
              'text-yellow-400'
            }>
              {diagnostic.swStatus}
            </span>
          </div>
        </div>
      )}

      <div className="mt-3 pt-2 border-t border-gray-700 space-y-1">
        <button
          onClick={() => {
            localStorage.clear();
            sessionStorage.clear();
            window.location.reload();
          }}
          className="w-full bg-red-600 hover:bg-red-700 text-white text-xs py-1 px-2 rounded"
        >
          🧹 Clear All & Reload
        </button>
        
        <button
          onClick={() => {
            if ('serviceWorker' in navigator) {
              navigator.serviceWorker.getRegistrations().then(registrations => {
                registrations.forEach(registration => registration.unregister());
                window.location.reload();
              });
            }
          }}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white text-xs py-1 px-2 rounded"
        >
          🔄 Unregister SW & Reload
        </button>
      </div>
    </div>
  );
} 