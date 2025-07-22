import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const { user, login, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/home');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4">Bem-vindo ao InterBox</h1>
        <p className="text-gray-600 mb-6">Conecte-se para acessar sua conta</p>
        <button
          onClick={login}
          disabled={loading}
          className="bg-black text-white px-6 py-3 rounded-xl font-semibold transition hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Conectando...' : 'Entrar com Google'}
        </button>
      </div>
    </div>
  );
}
