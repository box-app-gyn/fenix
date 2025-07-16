import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';
import Footer from '../components/Footer';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../lib/firebase';

// Componente de Loading Screen otimizado
const LoadingScreen = ({ message = 'Conectando com NEØ...' }: { message?: string }) => (
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
  const [loginState, setLoginState] = useState<'idle' | 'redirect' | 'register' | 'access'>('idle');
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  // Estados para cadastro
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerLoading, setRegisterLoading] = useState(false);
  // Estados para login
  const [accessEmail, setAccessEmail] = useState('');
  const [accessPassword, setAccessPassword] = useState('');
  const [accessLoading, setAccessLoading] = useState(false);

  console.log('🔍 LoginPage - Estado atual:', { loading, loginState });

  const handleLogin = async () => {
    setLoginState('redirect');
    setShowError(false);
    setErrorMessage('');

    try {
      await login();
      setShowSuccess(true);
      // O redirecionamento será feito automaticamente pelo useAuth
    } catch (error: any) {
      console.error('Erro no login:', error);

      // Definir mensagem de erro específica
      let message = 'Erro ao fazer login. Tente novamente.';
      if (error.code === 'auth/operation-not-allowed') {
        message = 'Login com Google não está habilitado. Entre em contato com o suporte.';
      } else if (error.code === 'auth/invalid-api-key') {
        message = 'Erro de configuração. Entre em contato com o suporte.';
      }

      setErrorMessage(message);
      setShowError(true);
      setLoginState('idle');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowError(false);
    setErrorMessage('');
    setRegisterLoading(true);
    // Validação básica
    if (!registerName.trim()) {
      setErrorMessage('Digite seu nome completo.');
      setShowError(true);
      setRegisterLoading(false);
      return;
    }
    if (!registerEmail.includes('@')) {
      setErrorMessage('Digite um e-mail válido.');
      setShowError(true);
      setRegisterLoading(false);
      return;
    }
    if (registerPassword.length < 6) {
      setErrorMessage('A senha deve ter pelo menos 6 caracteres.');
      setShowError(true);
      setRegisterLoading(false);
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        registerEmail,
        registerPassword,
      );
      await updateProfile(userCredential.user, { displayName: registerName });
      setShowSuccess(true);
      setLoginState('idle');
      // O fluxo de login automático será feito pelo onAuthStateChanged
    } catch (error: any) {
      let message = 'Erro ao cadastrar. Tente novamente.';
      if (error.code === 'auth/email-already-in-use') {
        message = 'Este e-mail já está em uso.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'E-mail inválido.';
      } else if (error.code === 'auth/weak-password') {
        message = 'Senha muito fraca.';
      }
      setErrorMessage(message);
      setShowError(true);
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowError(false);
    setErrorMessage('');
    setAccessLoading(true);
    if (!accessEmail.includes('@')) {
      setErrorMessage('Digite um e-mail válido.');
      setShowError(true);
      setAccessLoading(false);
      return;
    }
    if (accessPassword.length < 6) {
      setErrorMessage('A senha deve ter pelo menos 6 caracteres.');
      setShowError(true);
      setAccessLoading(false);
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, accessEmail, accessPassword);
      setShowSuccess(true);
      setLoginState('idle');
      // O fluxo de login automático será feito pelo onAuthStateChanged
    } catch (error: any) {
      let message = 'E-mail ou senha incorretos.';
      if (error.code === 'auth/user-not-found') {
        message = 'Usuário não encontrado.';
      } else if (error.code === 'auth/wrong-password') {
        message = 'Senha incorreta.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'E-mail inválido.';
      }
      setErrorMessage(message);
      setShowError(true);
    } finally {
      setAccessLoading(false);
    }
  };

  const getButtonText = () => {
    switch (loginState) {
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

  if (loading) {
    return <LoadingScreen message="Conectando com NEØ..." />;
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Background com imagem principal */}
      <div
        className="flex-1 relative flex items-center justify-center"
        style={{
          backgroundImage: 'url(/images/bg_main.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Overlay gradiente */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/80"></div>

        {/* Conteúdo principal */}
        <div className="relative z-10 text-center space-y-8 max-w-md mx-auto px-4">
          {/* Alertas */}
          {showError && errorMessage && (
            <ErrorAlert
              error={errorMessage}
              onDismiss={() => setShowError(false)}
            />
          )}

          {showSuccess && (
            <SuccessAlert message="Acesso/Cadastro/Login realizado com sucesso!" />
          )}

          <div className="space-y-4">
            <img
              src="/logos/oficial_logo.png"
              alt="INTERBOX Logo"
              className="mx-auto max-w-xs"
            />
            <p className="text-gray-300 text-lg">
              ᴄᴏᴍᴘᴇᴛɪçãᴏ. ᴄᴏᴍᴜɴɪᴅᴀᴅᴇ. ᴘʀᴏᴘóꜱɪᴛᴏ.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20 space-y-4">
            {/* Botão Google */}
            <button
              onClick={handleLogin}
              disabled={loginState !== 'idle' || loading}
              className="w-full bg-gradient-to-r from-pink-600 to-blue-600 hover:from-pink-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 px-8 py-4 rounded-xl text-white text-lg font-semibold transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center space-x-3"
            >
              {getButtonIcon()}
              <span>{getButtonText()}</span>
            </button>
            {/* Botão Acessar com E-mail */}
            <button
              onClick={() => setLoginState(loginState === 'access' ? 'idle' : 'access')}
              disabled={loginState === 'redirect' || loading}
              className="w-full bg-gradient-to-r from-blue-600 to-gray-700 hover:from-blue-700 hover:to-black px-8 py-4 rounded-xl text-white text-lg font-semibold transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl mt-2 flex items-center justify-center space-x-3"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" /></svg>
              <span>{loginState === 'access' ? 'Voltar' : 'Acessar com E-mail'}</span>
            </button>
            {/* Botão Cadastro com E-mail */}
            <button
              onClick={() => setLoginState(loginState === 'register' ? 'idle' : 'register')}
              disabled={loginState === 'redirect' || loading}
              className="w-full bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black px-8 py-4 rounded-xl text-white text-lg font-semibold transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl mt-2 flex items-center justify-center space-x-3"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12H8m4-4v8" /></svg>
              <span>{loginState === 'register' ? 'Voltar' : 'Cadastrar com E-mail'}</span>
            </button>
            {/* Formulário de login (Acessar) */}
            {loginState === 'access' && (
              <form onSubmit={handleAccess} className="space-y-4 mt-4 text-left">
                <input
                  type="email"
                  placeholder="E-mail"
                  value={accessEmail}
                  onChange={(e) => setAccessEmail(e.target.value)}
                  className="input bg-white/80 text-gray-900 placeholder-gray-500"
                  required
                />
                <input
                  type="password"
                  placeholder="Senha"
                  value={accessPassword}
                  onChange={(e) => setAccessPassword(e.target.value)}
                  className="input bg-white/80 text-gray-900 placeholder-gray-500"
                  required
                  minLength={6}
                />
                <button
                  type="submit"
                  disabled={accessLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-gray-700 hover:from-blue-700 hover:to-black px-8 py-3 rounded-xl text-white text-lg font-semibold transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:from-gray-400 disabled:to-gray-500 disabled:scale-100 disabled:shadow-none"
                >
                  {accessLoading ? 'Acessando...' : 'Acessar'}
                </button>
              </form>
            )}
            {/* Formulário de cadastro */}
            {loginState === 'register' && (
              <form onSubmit={handleRegister} className="space-y-4 mt-4 text-left">
                <input
                  type="text"
                  placeholder="Nome completo"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  className="input bg-white/80 text-gray-900 placeholder-gray-500"
                  autoFocus
                  required
                />
                <input
                  type="email"
                  placeholder="E-mail"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  className="input bg-white/80 text-gray-900 placeholder-gray-500"
                  required
                />
                <input
                  type="password"
                  placeholder="Senha (mín. 6 caracteres)"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  className="input bg-white/80 text-gray-900 placeholder-gray-500"
                  required
                  minLength={6}
                />
                <button
                  type="submit"
                  disabled={registerLoading}
                  className="w-full bg-gradient-to-r from-pink-600 to-blue-600 hover:from-pink-700 hover:to-blue-700 px-8 py-3 rounded-xl text-white text-lg font-semibold transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:from-gray-400 disabled:to-gray-500 disabled:scale-100 disabled:shadow-none"
                >
                  {registerLoading ? 'Cadastrando...' : 'Cadastrar'}
                </button>
              </form>
            )}
            {/* Indicador de estado login Google */}
            {loginState === 'redirect' && (
              <div className="mt-4 text-center">
                <div className="flex items-center justify-center gap-2 text-white/60 text-sm">
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>
                    {loginState === 'redirect' && 'Processando login...'}
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className="text-sm text-gray-400 space-y-2">
            <p>Faça login, acesse ou cadastre-se para acessar o ecossistema Interbox 2025</p>
            {loginState === 'redirect' && (
              <p className="text-xs text-blue-300">
                🔄 Redirecionando para o Google...
              </p>
            )}
            <p className="text-xs">Você será redirecionado para o Google e retornará automaticamente</p>
          </div>

          {/* Botão de debug removido para produção */}
        </div>
      </div>

      <Footer />
    </div>
  );
}
