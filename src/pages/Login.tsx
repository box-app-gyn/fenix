import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';

export default function LoginPage() {
  const { login, loading } = useAuth();
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    setErrorMessage('');
    try {
      await login();
    } catch (error: any) {
      if (error.code !== 'auth/popup-closed-by-user') {
        setErrorMessage('Erro ao fazer login. Tente novamente.');
      }
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="h-screen flex items-center justify-center text-white relative overflow-hidden"
      style={{
        backgroundImage: 'url(/images/bg_rounded.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="text-center space-y-8 max-w-md mx-auto px-4 relative z-10">
        <div className="space-y-4">
          <img 
            src="/logos/oficial_logo.png" 
            alt="INTERBOX Logo" 
            className="mx-auto max-w-xs"
          />
          <p className="text-gray-300 text-lg">
            O maior evento fitness do Brasil
          </p>
        </div>
        
        {errorMessage && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm">
            {errorMessage}
          </div>
        )}
        
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-gradient-to-r from-pink-600 to-purple-600 px-8 py-4 rounded-lg text-white text-lg font-semibold hover:from-pink-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Entrando...' : 'Entrar com Google'}
        </button>
        
        <p className="text-sm text-gray-400">
          Faça login para acessar o ecosistema CERRADO INTERBØX
        </p>
      </div>
    </div>
  );
} 