import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { FirestoreGamificationLeaderboard } from '../types/firestore';

export function useLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<FirestoreGamificationLeaderboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setLoading(true);
        try {
          // Buscar leaderboard ordenado por $BOX tokens (points)
          const leaderboardQuery = query(
            collection(db, 'gamification_leaderboard'),
            orderBy('points', 'desc'),
            limit(50),
          );

          const snapshot = await getDocs(leaderboardQuery);
          const leaderboardData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as FirestoreGamificationLeaderboard[];

          setLeaderboard(leaderboardData);
          setError(null);
        } catch (err: any) {
          console.error('Erro ao carregar leaderboard:', err);
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
