import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './useAuth';

export const useRoleRedirect = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAndRedirect = async () => {
      if (!user || loading) return;

      const docRef = doc(db, 'users', user.uid);
      const snap = await getDoc(docRef);
      const data = snap.data();

      if (!data?.profileComplete) {
        switch (data?.categoria) {
          case 'atleta':
            return navigate('/cadastro-atleta');
          case 'judge':
            return navigate('/cadastro-jurado');
          case 'midia':
            return navigate('/cadastro-midialouca');
          case 'espectador':
            return navigate('/cadastro-curioso');
          default:
            return navigate('/setup-profile');
        }
      }

      // Se já tá completo, vai pro Hub
      navigate('/hub');
    };

    if (!loading) checkAndRedirect();
  }, [user, loading, navigate]);
}; 