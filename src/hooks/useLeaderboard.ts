import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export function useLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setLoading(true);
        try {
          const snapshot = await getDocs(collection(db, 'gamification_leaderboard'));
          setLeaderboard(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
          setError(null);
        } catch (err: any) {
          setError(err.message);
        }
        setLoading(false);
      } else {
        setLeaderboard([]);
        setLoading(false);
        setError('Usuário não autenticado');
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return { leaderboard, loading, error };
} 