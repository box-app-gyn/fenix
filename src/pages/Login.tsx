import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';
import { clearCacheAndReload } from '../utils/clearCache';

// Componente de Loading Screen otimizado
const LoadingScreen = ({ message = "Carregando..." }) => (
  <div className="h-screen flex items-center justify-center bg-black text-white">
    <div className="text-center">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-pink-400 rounded-full animate-spin mx-auto"></div>
      </div>
      <p className="text-white/80 text-lg font-medium">{message}</p>
    </div>
  </div>
);

// Componente de Erro otimizado
const ErrorAlert = ({ error, onDismiss }: { error: string; onDismiss: () => void }) => (
  <div className="fixed top-4 left-4 right-4 z-50 bg-red-500/90 backdrop-blur-sm text-white p-4 rounded-lg shadow-lg animate-in slide-in-from-top duration-300">
    <div className="flex items-center gap-3">
      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span className="flex-1">{error}</span>
      <button 
        onClick={onDismiss}
        className="text-white/80 hover:text-white transition-colors"
      >
        ×
      </button>
    </div>
  </div>
);

// Componente de Sucesso otimizado
const SuccessAlert = ({ message }: { message: string }) => (
  <div className="fixed top-4 left-4 right-4 z-50 bg-green-500/90 backdrop-blur-sm text-white p-4 rounded-lg shadow-lg animate-in slide-in-from-top duration-300">
    <div className="flex items-center gap-3">
      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
      <span>{message}</span>
    </div>
  </div>
);

export default function LoginPage() {
  const { login, loading } = useAuth();
  const [loginState, setLoginState] = useState<'idle' | 'popup' | 'redirect'>('idle');
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  console.log('🔍 LoginPage - Estado atual:', { loading, loginState });

  const handleLogin = async () => {
    setLoginState('popup');
    setShowError(false);
    setErrorMessage('');
    
    try {
      await login();
      setLoginState('redirect');
      setShowSuccess(true);
      // O redirecionamento será feito automaticamente pelo useAuth
    } catch (error: any) {
      console.error('Erro no login:', error);
      
      // Se for erro de popup bloqueado, tentar redirect
      if (error.code === 'auth/popup-blocked' || 
          error.code === 'auth/popup-closed-by-user') {
        setLoginState('redirect');
        // O login já tentará redirect automaticamente
        return;
      }
      
      // Definir mensagem de erro específica
      let message = 'Erro ao fazer login. Tente novamente.';
      if (error.code === 'auth/operation-not-allowed') {
        message = 'Login com Google não está habilitado. Entre em contato com o suporte.';
      } else if (error.code === 'auth/invalid-api-key') {
        message = 'Erro de configuração. Entre em contato com o suporte.';
      } else if (error.code === 'auth/popup-blocked') {
        message = 'Popup bloqueado pelo navegador. Permita popups para este site e tente novamente.';
      } else if (error.code === 'auth/popup-closed-by-user') {
        message = 'Login cancelado. Tente novamente.';
      }
      
      setErrorMessage(message);
      setShowError(true);
      setLoginState('idle');
    }
  };

  const getButtonText = () => {
    switch (loginState) {
      case 'popup':
        return 'Abrindo popup...';
      case 'redirect':
        return 'Redirecionando...';
      default:
        return 'Entrar com Google';
    }
  };

  const getButtonIcon = () => {
    if (loginState !== 'idle') {
      return (
        <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      );
    }
    
    return (
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="currentColor"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="currentColor"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="currentColor"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
    );
  };

  const isButtonDisabled = loginState !== 'idle' || loading;

  if (loading) {
    return <LoadingScreen message="Conectando com Firebase..." />;
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
      {/* Alertas */}
      {showError && errorMessage && (
        <ErrorAlert 
          error={errorMessage} 
          onDismiss={() => setShowError(false)} 
        />
      )}
      
      {showSuccess && (
        <SuccessAlert message="Login realizado com sucesso!" />
      )}

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
        
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20">
          <button
            onClick={handleLogin}
            disabled={isButtonDisabled}
            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 px-8 py-4 rounded-xl text-white text-lg font-semibold transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center space-x-3"
          >
            {getButtonIcon()}
            <span>{getButtonText()}</span>
          </button>

          {/* Indicador de estado */}
          {loginState !== 'idle' && (
            <div className="mt-4 text-center">
              <div className="flex items-center justify-center gap-2 text-white/60 text-sm">
                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>
                  {loginState === 'popup' && 'Aguardando autorização...'}
                  {loginState === 'redirect' && 'Processando login...'}
                </span>
              </div>
            </div>
          )}
        </div>
        
        <div className="text-sm text-gray-400 space-y-2">
          <p>Faça login para acessar o ecosistema CERRADO INTERBØX</p>
          {loginState === 'popup' && (
            <p className="text-xs text-yellow-300">
              ⚠️ Se o popup não abrir, permita popups para este site
            </p>
          )}
          {loginState === 'redirect' && (
            <p className="text-xs text-blue-300">
              🔄 Redirecionando para o Google...
            </p>
          )}
          <p className="text-xs">Você será redirecionado para o Google e retornará automaticamente</p>
        </div>
        
        {/* Botão de debug para limpar cache */}
        <button
          onClick={clearCacheAndReload}
          className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          🔧 Limpar cache e recarregar
        </button>
      </div>
    </div>
  );
} 