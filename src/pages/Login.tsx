import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const { login, loading } = useAuth();

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
    <div className="h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center space-y-8 max-w-md mx-auto px-4">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            INTERBOX
          </h1>
          <p className="text-gray-300 text-lg">
            Plataforma de gamificação e audiovisual
          </p>
        </div>
        
        <button
          onClick={login}
          className="w-full bg-gradient-to-r from-pink-600 to-purple-600 px-8 py-4 rounded-lg text-white text-lg font-semibold hover:from-pink-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Entrar com Google
        </button>
        
        <p className="text-sm text-gray-400">
          Faça login para acessar o sistema completo
        </p>
      </div>
    </div>
  );
} 