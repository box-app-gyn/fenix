import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

// Componente para testar o fluxo de login
export default function LoginTest() {
  const { user, loading, login } = useAuth();
  const [testResults, setTestResults] = useState<string[]>([]);

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const runLoginTest = async () => {
    addTestResult('🧪 Iniciando teste de login...');
    
    try {
      await login();
      addTestResult('✅ Login bem-sucedido');
    } catch (error: any) {
      addTestResult(`❌ Erro no login: ${error.code || error.message}`);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 backdrop-blur-sm text-white p-4 rounded-lg shadow-xl border border-white/20 max-w-sm">
      <h3 className="font-bold mb-2">🔧 Teste de Login</h3>
      
      <div className="space-y-2 mb-4">
        <div className="text-xs">
          <span className="text-gray-400">Status:</span> {loading ? '🔄 Carregando' : user ? '✅ Logado' : '❌ Deslogado'}
        </div>
        {user && (
          <div className="text-xs">
            <span className="text-gray-400">Usuário:</span> {user.displayName}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <button
          onClick={runLoginTest}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white text-xs px-3 py-2 rounded transition-colors"
        >
          Testar Login
        </button>
        
        <button
          onClick={clearResults}
          className="w-full bg-gray-600 hover:bg-gray-700 text-white text-xs px-3 py-2 rounded transition-colors"
        >
          Limpar Logs
        </button>
      </div>

      {testResults.length > 0 && (
        <div className="mt-4">
          <h4 className="text-xs font-bold mb-2">Logs:</h4>
          <div className="max-h-32 overflow-y-auto text-xs space-y-1">
            {testResults.map((result, index) => (
              <div key={index} className="text-gray-300">
                {result}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 