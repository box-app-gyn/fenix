import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from './useAuth';

export const useUserJourney = () => {
  const { user, loading } = useAuth() as any; // 👈 IGNORA TIPAGEM PRA FUNCIONAR
  const navigate = useNavigate();

  useEffect(() => {
    if (loading || !user) return;

    if (user?.primeiraVez) {
      navigate('/intro', { replace: true });
      return;
    }

    if (!user?.categoria || !user?.profileComplete) {
      navigate('/cadastro', { replace: true });
      return;
    }

    if (user?.mostrarIntro) {
      navigate('/intro', { replace: true });
    } else {
      navigate('/home', { replace: true });
    }
  }, [user, loading, navigate]);
};
