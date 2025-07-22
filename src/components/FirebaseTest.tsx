import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function FirebaseTest() {
  const { user, loading, login, logout } = useAuth();
  const [testResults, setTestResults] = useState<any>(null);
  const [isTesting, setIsTesting] = useState(false);

  const runDiagnostic = async () => {
    setIsTesting(true);
    try {
      // Simular diagnóstico
      const results = {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        isLocalhost: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
        hasServiceWorker: 'serviceWorker' in navigator,
        isStandalone: window.matchMedia('(display-mode: standalone)').matches,
        authState: {
          loading,
          user: user ? { email: user.email, uid: user.uid } : null,
        },
        suggestions: [] as string[],
      };

      // Adicionar sugestões baseadas no estado
      if (results.isLocalhost) {
        results.suggestions.push('Verificar domínios autorizados no Firebase Console');
        results.suggestions.push('Adicionar localhost e 127.0.0.1 aos domínios autorizados');
      }

      if (results.hasServiceWorker) {
        results.suggestions.push('Service Worker ativo - usar redirect em vez de popup');
      }

      if (results.isStandalone) {
        results.suggestions.push('App em modo PWA - verificar configurações OAuth');
      }

      if (!user && !loading) {
        results.suggestions.push('Usuário não logado - testar login manual');
      }

      setTestResults(results);
    } catch (error) {
      console.error('Erro no diagnóstico:', error);
      setTestResults({ error: error instanceof Error ? error.message : 'Erro desconhecido' });
    } finally {
      setIsTesting(false);
    }
  };

  const testLogin = async () => {
    try {
      console.log('🔄 Testando login...');
      await login();
    } catch (error) {
      console.error('❌ Erro no teste de login:', error);
    }
  };

  const testLogout = async () => {
    try {
      console.log('🔄 Testando logout...');
      await logout();
    } catch (error) {
      console.error('❌ Erro no teste de logout:', error);
    }
  };

  useEffect(() => {
    // Executar diagnóstico automaticamente
    runDiagnostic();
  }, [user, loading]);

  return (
    <div className="fixed top-4 right-4 bg-white/95 backdrop-blur-lg rounded-lg shadow-lg border border-gray-200 p-4 max-w-md z-50">
      <h3 className="text-lg font-bold text-gray-900 mb-3">🔍 Firebase Test</h3>
      
      <div className="space-y-3">
        {/* Status */}
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${loading ? 'bg-yellow-500' : user ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm font-medium">
            {loading ? 'Carregando...' : user ? 'Logado' : 'Não logado'}
          </span>
        </div>

        {user && (
          <div className="text-sm text-gray-600">
            <p>Email: {user.email}</p>
            <p>UID: {user.uid?.substring(0, 8)}...</p>
          </div>
        )}

        {/* Botões de teste */}
        <div className="flex space-x-2">
          <button
            onClick={testLogin}
            disabled={loading || !!user}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Testar Login
          </button>
          <button
            onClick={testLogout}
            disabled={loading || !user}
            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50"
          >
            Testar Logout
          </button>
          <button
            onClick={runDiagnostic}
            disabled={isTesting}
            className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 disabled:opacity-50"
          >
            {isTesting ? 'Testando...' : 'Diagnóstico'}
          </button>
        </div>

        {/* Resultados do diagnóstico */}
        {testResults && (
          <div className="mt-3 p-3 bg-gray-50 rounded text-xs">
            <h4 className="font-semibold mb-2">📊 Diagnóstico:</h4>
            <div className="space-y-1">
              <p><strong>URL:</strong> {testResults.url}</p>
              <p><strong>Localhost:</strong> {testResults.isLocalhost ? '✅' : '❌'}</p>
              <p><strong>Service Worker:</strong> {testResults.hasServiceWorker ? '✅' : '❌'}</p>
              <p><strong>PWA Standalone:</strong> {testResults.isStandalone ? '✅' : '❌'}</p>
            </div>

            {testResults.suggestions && testResults.suggestions.length > 0 && (
              <div className="mt-2">
                <h5 className="font-semibold text-orange-600">💡 Sugestões:</h5>
                <ul className="list-disc list-inside space-y-1 text-orange-600">
                  {testResults.suggestions.map((suggestion: string, index: number) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Comandos do console */}
        <div className="mt-3 p-3 bg-blue-50 rounded text-xs">
          <h4 className="font-semibold mb-2">🖥️ Comandos Console:</h4>
          <div className="space-y-1 font-mono">
            <p><code>window.loginWithGoogle()</code></p>
            <p><code>window.loginWithPopup()</code></p>
            <p><code>window.checkAuthState()</code></p>
            <p><code>window.firebase.diagnose()</code></p>
          </div>
        </div>
      </div>
    </div>
  );
} 