import { useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  limit,
  onSnapshot,
  serverTimestamp,
  QueryConstraint
} from 'firebase/firestore';
import { db } from '../lib/firebase';

// Tipos básicos
interface FirestoreDocument {
  id: string;
  [key: string]: any;
}

interface UseFirestoreOptions {
  realtime?: boolean;
  limit?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

// Hook para operações CRUD básicas
export function useFirestore<T extends FirestoreDocument>(
  collectionName: string,
  options: UseFirestoreOptions = {}
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar documentos
  const fetchDocuments = async (constraints: QueryConstraint[] = []) => {
    try {
      setLoading(true);
      setError(null);

      let q = query(collection(db, collectionName));
      
      // Aplicar constraints
      if (constraints.length > 0) {
        q = query(q, ...constraints);
      }

      // Aplicar ordenação
      if (options.orderBy) {
        q = query(q, orderBy(options.orderBy, options.orderDirection || 'desc'));
      }

      // Aplicar limite
      if (options.limit) {
        q = query(q, limit(options.limit));
      }

      const querySnapshot = await getDocs(q);
      const documents: T[] = [];
      
      querySnapshot.forEach((doc) => {
        documents.push({
          id: doc.id,
          ...doc.data()
        } as T);
      });

      setData(documents);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Erro ao buscar documentos:', err);
    } finally {
      setLoading(false);
    }
  };

  // Buscar documento por ID
  const fetchDocument = async (id: string): Promise<T | null> => {
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as T;
      }
      
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Erro ao buscar documento:', err);
      return null;
    }
  };

  // Adicionar documento
  const addDocument = async (documentData: Omit<T, 'id'>): Promise<string | null> => {
    try {
      setError(null);
      const docRef = await addDoc(collection(db, collectionName), {
        ...documentData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Erro ao adicionar documento:', err);
      return null;
    }
  };

  // Atualizar documento
  const updateDocument = async (id: string, updates: Partial<T>): Promise<boolean> => {
    try {
      setError(null);
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Erro ao atualizar documento:', err);
      return false;
    }
  };

  // Deletar documento
  const deleteDocument = async (id: string): Promise<boolean> => {
    try {
      setError(null);
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Erro ao deletar documento:', err);
      return false;
    }
  };

  // Buscar documentos em tempo real
  useEffect(() => {
    if (!options.realtime) return;

    let q = query(collection(db, collectionName));
    
    if (options.orderBy) {
      q = query(q, orderBy(options.orderBy, options.orderDirection || 'desc'));
    }

    if (options.limit) {
      q = query(q, limit(options.limit));
    }

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const documents: T[] = [];
        querySnapshot.forEach((doc) => {
          documents.push({
            id: doc.id,
            ...doc.data()
          } as T);
        });
        setData(documents);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
        console.error('Erro no listener em tempo real:', err);
      }
    );

    return () => unsubscribe();
  }, [collectionName, options.realtime, options.orderBy, options.orderDirection, options.limit]);

  return {
    data,
    loading,
    error,
    fetchDocuments,
    fetchDocument,
    addDocument,
    updateDocument,
    deleteDocument
  };
}

// Hook específico para usuários
export function useUsers() {
  return useFirestore('users', { realtime: true, orderBy: 'createdAt' });
}

// Hook específico para times
export function useTeams() {
  return useFirestore('teams', { realtime: true, orderBy: 'createdAt' });
}

// Hook específico para configurações
export function useConfig() {
  return useFirestore('config', { realtime: true });
} 