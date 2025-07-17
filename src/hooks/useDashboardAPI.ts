import { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, query, where, orderBy, limit, onSnapshot, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './useAuth';

// ============================================================================
// INTERFACES SIMPLIFICADAS
// ============================================================================

interface DashboardStats {
  users: {
    total: number;
    active: number;
    newToday: number;
    byRole: Record<string, number>;
  };
  teams: {
    total: number;
    confirmed: number;
    pending: number;
    byCategory: Record<string, number>;
  };
  audiovisual: {
    total: number;
    approved: number;
    pending: number;
  };
  financial: {
    totalRevenue: number;
    totalOrders: number;
  };
  realtime: {
    onlineUsers: number;
    lastUpdate: Date;
  };
}

interface UserData {
  uid: string;
  email: string;
  displayName: string;
  role: string;
  createdAt: Date;
  isActive: boolean;
}

interface TeamData {
  id: string;
  nome: string;
  status: string;
  categoria: string;
  valorInscricao: number;
  createdAt: Date;
}

interface AudiovisualData {
  id: string;
  nome: string;
  tipo: string;
  status: string;
  createdAt: Date;
}

// ============================================================================
// HOOK PRINCIPAL SIMPLIFICADO
// ============================================================================

export function useDashboardAPI() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ============================================================================
  // FUNÇÕES AUXILIARES
  // ============================================================================

  const handleError = useCallback((error: any) => {
    console.error('Erro na API do Dashboard:', error);
    const message = error?.message || 'Erro desconhecido';
    setError(message);
    return message;
  }, []);

  const convertTimestamp = useCallback((timestamp: any): Date => {
    if (timestamp?.toDate) {
      return timestamp.toDate();
    }
    return new Date(timestamp);
  }, []);

  // ============================================================================
  // FUNÇÕES PRINCIPAIS
  // ============================================================================

  /**
   * Busca estatísticas básicas do dashboard
   */
  const getDashboardStats = useCallback(async (): Promise<DashboardStats | null> => {
    if (!user) {
      setError('Usuário não autenticado');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      // Buscar dados em paralelo
      const [usersSnapshot, teamsSnapshot, audiovisualSnapshot, ordersSnapshot, configDoc] = await Promise.all([
        getDocs(collection(db, 'users')),
        getDocs(collection(db, 'teams')),
        getDocs(collection(db, 'audiovisual')),
        getDocs(collection(db, 'pedidos')),
        doc(db, 'config', 'tempo_real').get()
      ]);

      // Calcular estatísticas de usuários
      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      
      let totalUsers = 0;
      let activeUsers = 0;
      let newToday = 0;
      const byRole: Record<string, number> = {};

      usersSnapshot.forEach(doc => {
        const userData = doc.data();
        totalUsers++;
        
        if (userData.isActive) activeUsers++;
        
        const createdAt = convertTimestamp(userData.createdAt);
        if (createdAt >= oneDayAgo) newToday++;
        
        const role = userData.role || 'user';
        byRole[role] = (byRole[role] || 0) + 1;
      });

      // Calcular estatísticas de times
      let totalTeams = 0;
      let confirmedTeams = 0;
      let pendingTeams = 0;
      const byCategory: Record<string, number> = {};

      teamsSnapshot.forEach(doc => {
        const teamData = doc.data();
        totalTeams++;
        
        if (teamData.status === 'confirmado') confirmedTeams++;
        else if (teamData.status === 'incomplete' || teamData.status === 'complete') pendingTeams++;
        
        const categoria = teamData.categoria || 'N/A';
        byCategory[categoria] = (byCategory[categoria] || 0) + 1;
      });

      // Calcular estatísticas de audiovisual
      let totalAudiovisual = 0;
      let approvedAudiovisual = 0;
      let pendingAudiovisual = 0;

      audiovisualSnapshot.forEach(doc => {
        const audiovisualData = doc.data();
        totalAudiovisual++;
        
        if (audiovisualData.status === 'aprovado') approvedAudiovisual++;
        else if (audiovisualData.status === 'pendente') pendingAudiovisual++;
      });

      // Calcular estatísticas financeiras
      let totalRevenue = 0;
      let totalOrders = 0;

      ordersSnapshot.forEach(doc => {
        const orderData = doc.data();
        totalOrders++;
        
        if (orderData.status === 'pago') {
          totalRevenue += orderData.valorTotal || 0;
        }
      });

      // Dados em tempo real
      const configData = configDoc.data();
      const realtime = {
        onlineUsers: configData?.realtime?.onlineUsers || 0,
        lastUpdate: convertTimestamp(configData?.realtime?.lastUpdate || now)
      };

      const stats: DashboardStats = {
        users: {
          total: totalUsers,
          active: activeUsers,
          newToday,
          byRole
        },
        teams: {
          total: totalTeams,
          confirmed: confirmedTeams,
          pending: pendingTeams,
          byCategory
        },
        audiovisual: {
          total: totalAudiovisual,
          approved: approvedAudiovisual,
          pending: pendingAudiovisual
        },
        financial: {
          totalRevenue,
          totalOrders
        },
        realtime
      };

      return stats;

    } catch (error: any) {
      handleError(error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, handleError, convertTimestamp]);

  /**
   * Busca dados de usuários
   */
  const getUsersData = useCallback(async (params?: {
    limit?: number;
    role?: string;
    status?: 'active' | 'inactive';
  }): Promise<UserData[] | null> => {
    if (!user) {
      setError('Usuário não autenticado');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      let q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
      
      if (params?.role) {
        q = query(q, where('role', '==', params.role));
      }
      
      if (params?.status) {
        q = query(q, where('isActive', '==', params.status === 'active'));
      }
      
      if (params?.limit) {
        q = query(q, limit(params.limit));
      }

      const snapshot = await getDocs(q);
      
      const users: UserData[] = snapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data(),
        createdAt: convertTimestamp(doc.data().createdAt)
      } as UserData));

      return users;

    } catch (error: any) {
      handleError(error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, handleError, convertTimestamp]);

  /**
   * Busca dados de times
   */
  const getTeamsData = useCallback(async (params?: {
    limit?: number;
    status?: string;
    categoria?: string;
  }): Promise<TeamData[] | null> => {
    if (!user) {
      setError('Usuário não autenticado');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      let q = query(collection(db, 'teams'), orderBy('createdAt', 'desc'));
      
      if (params?.status) {
        q = query(q, where('status', '==', params.status));
      }
      
      if (params?.categoria) {
        q = query(q, where('categoria', '==', params.categoria));
      }
      
      if (params?.limit) {
        q = query(q, limit(params.limit));
      }

      const snapshot = await getDocs(q);
      
      const teams: TeamData[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: convertTimestamp(doc.data().createdAt)
      } as TeamData));

      return teams;

    } catch (error: any) {
      handleError(error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, handleError, convertTimestamp]);

  /**
   * Busca dados de audiovisual
   */
  const getAudiovisualData = useCallback(async (params?: {
    limit?: number;
    status?: string;
    tipo?: string;
  }): Promise<AudiovisualData[] | null> => {
    if (!user) {
      setError('Usuário não autenticado');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      let q = query(collection(db, 'audiovisual'), orderBy('createdAt', 'desc'));
      
      if (params?.status) {
        q = query(q, where('status', '==', params.status));
      }
      
      if (params?.tipo) {
        q = query(q, where('tipo', '==', params.tipo));
      }
      
      if (params?.limit) {
        q = query(q, limit(params.limit));
      }

      const snapshot = await getDocs(q);
      
      const audiovisual: AudiovisualData[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: convertTimestamp(doc.data().createdAt)
      } as AudiovisualData));

      return audiovisual;

    } catch (error: any) {
      handleError(error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, handleError, convertTimestamp]);

  // ============================================================================
  // HOOKS ESPECÍFICOS SIMPLIFICADOS
  // ============================================================================

  /**
   * Hook para estatísticas com auto-refresh
   */
  const useDashboardStats = (autoRefresh = false, refreshInterval = 30000) => {
    const [stats, setStats] = useState<DashboardStats | null>(null);

    const fetchStats = useCallback(async () => {
      const data = await getDashboardStats();
      if (data) {
        setStats(data);
      }
    }, [getDashboardStats]);

    useEffect(() => {
      fetchStats();

      if (autoRefresh) {
        const interval = setInterval(fetchStats, refreshInterval);
        return () => clearInterval(interval);
      }
    }, [fetchStats, autoRefresh, refreshInterval]);

    return { stats, refetch: fetchStats, loading, error };
  };

  /**
   * Hook para dados de usuários
   */
  const useUsersData = (params?: {
    limit?: number;
    role?: string;
    status?: 'active' | 'inactive';
  }) => {
    const [users, setUsers] = useState<UserData[]>([]);

    const fetchUsers = useCallback(async () => {
      const data = await getUsersData(params);
      if (data) {
        setUsers(data);
      }
    }, [getUsersData, params]);

    useEffect(() => {
      fetchUsers();
    }, [fetchUsers]);

    return { users, refetch: fetchUsers, loading, error };
  };

  /**
   * Hook para dados de times
   */
  const useTeamsData = (params?: {
    limit?: number;
    status?: string;
    categoria?: string;
  }) => {
    const [teams, setTeams] = useState<TeamData[]>([]);

    const fetchTeams = useCallback(async () => {
      const data = await getTeamsData(params);
      if (data) {
        setTeams(data);
      }
    }, [getTeamsData, params]);

    useEffect(() => {
      fetchTeams();
    }, [fetchTeams]);

    return { teams, refetch: fetchTeams, loading, error };
  };

  /**
   * Hook para dados de audiovisual
   */
  const useAudiovisualData = (params?: {
    limit?: number;
    status?: string;
    tipo?: string;
  }) => {
    const [audiovisual, setAudiovisual] = useState<AudiovisualData[]>([]);

    const fetchAudiovisual = useCallback(async () => {
      const data = await getAudiovisualData(params);
      if (data) {
        setAudiovisual(data);
      }
    }, [getAudiovisualData, params]);

    useEffect(() => {
      fetchAudiovisual();
    }, [fetchAudiovisual]);

    return { audiovisual, refetch: fetchAudiovisual, loading, error };
  };

  return {
    // Estados
    loading,
    error,
    
    // Funções principais
    getDashboardStats,
    getUsersData,
    getTeamsData,
    getAudiovisualData,
    
    // Hooks específicos
    useDashboardStats,
    useUsersData,
    useTeamsData,
    useAudiovisualData,
  };
} 