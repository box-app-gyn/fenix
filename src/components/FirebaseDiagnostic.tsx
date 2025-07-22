import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { usePWA } from '../hooks/usePWA';

interface DiagnosticResult {
  timestamp: string;
  environment: {
    isLocalhost: boolean;
    isProduction: boolean;
    isDevelopment: boolean;
    hostname: string;
    port: string;
    protocol: string;
    userAgent: string;
  };
  firebase: {
    projectId: string;
    authDomain: string;
    apiKey: string;
    isConfigured: boolean;
  };
  auth: {
    isLoggedIn: boolean;
    userEmail?: string;
    userId?: string;
    authState: 'loading' | 'authenticated' | 'unauthenticated';
  };
  pwa: {
    isStandalone: boolean;
    hasServiceWorker: boolean;
    serviceWorkerActive: boolean;
    isInstallable: boolean;
    isInstalled: boolean;
  };
  connectivity: {
    isOnline: boolean;
    connectionType?: string;
    effectiveType?: string;
  };
  suggestions: string[];
  errors: string[];
}

export default function FirebaseDiagnostic() {
  const { user, loading } = useAuth();
  const pwa = usePWA();
  const [diagnostic, setDiagnostic] = useState<DiagnosticResult | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const runDiagnostic = async () => {
    const result: DiagnosticResult = {
      timestamp: new Date().toISOString(),
      environment: {
        isLocalhost: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
        isProduction: import.meta.env.PROD,
        isDevelopment: import.meta.env.DEV,
        hostname: window.location.hostname,
        port: window.location.port,
        protocol: window.location.protocol,
        userAgent: navigator.userAgent,
      },
      firebase: {
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'N/A',
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'N/A',
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY ? '✅ Configurado' : '❌ Não configurado',
        isConfigured: !!(import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_PROJECT_ID),
      },
      auth: {
        isLoggedIn: !!user,
        userEmail: user?.email || undefined,
        userId: user?.uid || undefined,
        authState: loading ? 'loading' : user ? 'authenticated' : 'unauthenticated',
      },
      pwa: {
        isStandalone: pwa.isStandalone,
        hasServiceWorker: pwa.hasServiceWorker,
        serviceWorkerActive: 'serviceWorker' in navigator && !!navigator.serviceWorker.controller,
        isInstallable: pwa.isInstallable,
        isInstalled: pwa.isInstalled,
      },
      connectivity: {
        isOnline: navigator.onLine,
        connectionType: (navigator as any).connection?.type,
        effectiveType: (navigator as any).connection?.effectiveType,
      },
      suggestions: [],
      errors: [],
    };

    // Gerar sugestões baseadas no diagnóstico
    if (result.environment.isLocalhost) {
      result.suggestions.push(
        '🌐 Para localhost, certifique-se de que o domínio está autorizado no Firebase Console',
        '   Vá em: Firebase Console > Authentication > Settings > Authorized domains',
        '   Adicione: localhost, 127.0.0.1'
      );
    }

    if (!result.firebase.isConfigured) {
      result.errors.push('❌ Firebase não configurado - verifique as environment variables');
    }

    if (result.pwa.hasServiceWorker && result.pwa.serviceWorkerActive) {
      result.suggestions.push('🔒 Service Worker ativo - login deve usar redirect, não popup');
    }

    if (!result.connectivity.isOnline) {
      result.suggestions.push('📡 Você está offline - algumas funcionalidades podem não funcionar');
    }

    if (result.auth.authState === 'unauthenticated' && !loading) {
      result.suggestions.push('👤 Usuário não logado - isso é normal para primeiro acesso');
    }

    setDiagnostic(result);
  };

  useEffect(() => {
    runDiagnostic();
  }, [user, loading, pwa]);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 left-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 hover:bg-blue-700 transition-colors"
      >
        🔍 Diagnóstico
      </button>
    );
  }

  if (!diagnostic) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">🔍 Diagnóstico Firebase</h2>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <div className="animate-pulse">Carregando diagnóstico...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">🔍 Diagnóstico Firebase</h2>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Environment */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">🌐 Ambiente</h3>
            <div className="space-y-1 text-sm">
              <div>Hostname: {diagnostic.environment.hostname}</div>
              <div>Porta: {diagnostic.environment.port}</div>
              <div>Protocolo: {diagnostic.environment.protocol}</div>
              <div>Modo: {diagnostic.environment.isDevelopment ? 'Desenvolvimento' : 'Produção'}</div>
              <div>Localhost: {diagnostic.environment.isLocalhost ? '✅ Sim' : '❌ Não'}</div>
            </div>
          </div>

          {/* Firebase */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">🔥 Firebase</h3>
            <div className="space-y-1 text-sm">
              <div>Project ID: {diagnostic.firebase.projectId}</div>
              <div>Auth Domain: {diagnostic.firebase.authDomain}</div>
              <div>API Key: {diagnostic.firebase.apiKey}</div>
              <div>Configurado: {diagnostic.firebase.isConfigured ? '✅ Sim' : '❌ Não'}</div>
            </div>
          </div>

          {/* Auth */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">🔐 Autenticação</h3>
            <div className="space-y-1 text-sm">
              <div>Status: {diagnostic.auth.authState}</div>
              <div>Logado: {diagnostic.auth.isLoggedIn ? '✅ Sim' : '❌ Não'}</div>
              {diagnostic.auth.userEmail && <div>Email: {diagnostic.auth.userEmail}</div>}
              {diagnostic.auth.userId && <div>UID: {diagnostic.auth.userId}</div>}
            </div>
          </div>

          {/* PWA */}
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">📱 PWA</h3>
            <div className="space-y-1 text-sm">
              <div>Standalone: {diagnostic.pwa.isStandalone ? '✅ Sim' : '❌ Não'}</div>
              <div>Service Worker: {diagnostic.pwa.hasServiceWorker ? '✅ Suportado' : '❌ Não suportado'}</div>
              <div>SW Ativo: {diagnostic.pwa.serviceWorkerActive ? '✅ Sim' : '❌ Não'}</div>
              <div>Instalável: {diagnostic.pwa.isInstallable ? '✅ Sim' : '❌ Não'}</div>
              <div>Instalado: {diagnostic.pwa.isInstalled ? '✅ Sim' : '❌ Não'}</div>
            </div>
          </div>

          {/* Connectivity */}
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">📡 Conectividade</h3>
            <div className="space-y-1 text-sm">
              <div>Online: {diagnostic.connectivity.isOnline ? '✅ Sim' : '❌ Não'}</div>
              {diagnostic.connectivity.connectionType && (
                <div>Tipo: {diagnostic.connectivity.connectionType}</div>
              )}
              {diagnostic.connectivity.effectiveType && (
                <div>Velocidade: {diagnostic.connectivity.effectiveType}</div>
              )}
            </div>
          </div>

          {/* User Agent */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">🤖 User Agent</h3>
            <div className="text-xs break-all">
              {diagnostic.environment.userAgent}
            </div>
          </div>
        </div>

        {/* Suggestions */}
        {diagnostic.suggestions.length > 0 && (
          <div className="mt-6 bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-blue-800">💡 Sugestões</h3>
            <ul className="space-y-1 text-sm text-blue-700">
              {diagnostic.suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Errors */}
        {diagnostic.errors.length > 0 && (
          <div className="mt-6 bg-red-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-red-800">❌ Erros</h3>
            <ul className="space-y-1 text-sm text-red-700">
              {diagnostic.errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex space-x-3">
          <button
            onClick={runDiagnostic}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            🔄 Atualizar Diagnóstico
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(JSON.stringify(diagnostic, null, 2));
            }}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            📋 Copiar JSON
          </button>
        </div>

        <div className="mt-4 text-xs text-gray-500">
          Última atualização: {new Date(diagnostic.timestamp).toLocaleString()}
        </div>
      </div>
    </div>
  );
} 