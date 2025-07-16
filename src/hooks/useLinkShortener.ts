import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  increment,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './useAuth';
import {
  ShortLink,
  ShortLinkCreate,
  ShortLinkUpdate,
  ShortLinkClick,
  ShortLinkStats,
  validateShortLink,
  sanitizeShortLinkData,
  generateShortCode,
  generateShortUrl,
  detectDevice,

  isLinkActive,
  isLinkExpired,
} from '../types/linkShortener';

export const useLinkShortener = () => {
  const { user } = useAuth();
  const [links, setLinks] = useState<ShortLink[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<ShortLinkStats | null>(null);

  // Buscar links do usuário
  const fetchUserLinks = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const q = query(
        collection(db, 'shortLinks'),
        where('createdBy', '==', user.uid),
        orderBy('createdAt', 'desc'),
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const linksData: ShortLink[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          linksData.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
            expiresAt: data.expiresAt?.toDate(),
            analytics: data.analytics || {
              totalClicks: 0,
              clicksByDate: {},
              clicksByHour: {},
              clicksByDevice: {},
              clicksByCountry: {},
            },
          } as ShortLink);
        });
        setLinks(linksData);
      });

      return unsubscribe;
    } catch (err) {
      setError('Erro ao carregar links');
      console.error('Erro ao buscar links:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Criar novo link
  const createLink = useCallback(async (linkData: ShortLinkCreate): Promise<ShortLink | null> => {
    if (!user) {
      setError('Usuário não autenticado');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      // Validar dados
      const validation = validateShortLink(linkData);
      if (!validation.isValid) {
        setError(validation.errors.join(', '));
        return null;
      }

      // Sanitizar dados
      const sanitizedData = sanitizeShortLinkData(linkData);

      // Gerar código curto
      let shortCode = sanitizedData.customCode || generateShortCode();

      // Verificar se código já existe
      if (!sanitizedData.customCode) {
        let attempts = 0;
        while (attempts < 10) {
          const existingLink = await getDocs(
            query(collection(db, 'shortLinks'), where('shortCode', '==', shortCode)),
          );

          if (existingLink.empty) break;
          shortCode = generateShortCode();
          attempts++;
        }
      }

      // Criar documento
      const newLink: Omit<ShortLink, 'id'> = {
        originalUrl: sanitizedData.originalUrl,
        shortCode,
        shortUrl: generateShortUrl(shortCode),
        title: sanitizedData.title,
        description: sanitizedData.description,
        tags: sanitizedData.tags,
        category: sanitizedData.category,
        isActive: true,
        isPublic: sanitizedData.isPublic ?? true,
        clickCount: 0,
        uniqueVisitors: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        expiresAt: sanitizedData.expiresAt,
        createdBy: user.uid,
        analytics: {
          totalClicks: 0,
          clicksByDate: {},
          clicksByHour: {},
          clicksByDevice: {},
          clicksByCountry: {},
        },
      };

      const docRef = await addDoc(collection(db, 'shortLinks'), {
        ...newLink,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      const createdLink: ShortLink = {
        id: docRef.id,
        ...newLink,
      };

      return createdLink;
    } catch (err) {
      setError('Erro ao criar link');
      console.error('Erro ao criar link:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Atualizar link
  const updateLink = useCallback(async (linkId: string, updates: ShortLinkUpdate): Promise<boolean> => {
    if (!user) {
      setError('Usuário não autenticado');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const linkRef = doc(db, 'shortLinks', linkId);
      const linkDoc = await getDoc(linkRef);

      if (!linkDoc.exists()) {
        setError('Link não encontrado');
        return false;
      }

      const linkData = linkDoc.data();
      if (linkData.createdBy !== user.uid) {
        setError('Sem permissão para editar este link');
        return false;
      }

      await updateDoc(linkRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });

      return true;
    } catch (err) {
      setError('Erro ao atualizar link');
      console.error('Erro ao atualizar link:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Deletar link
  const deleteLink = useCallback(async (linkId: string): Promise<boolean> => {
    if (!user) {
      setError('Usuário não autenticado');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const linkRef = doc(db, 'shortLinks', linkId);
      const linkDoc = await getDoc(linkRef);

      if (!linkDoc.exists()) {
        setError('Link não encontrado');
        return false;
      }

      const linkData = linkDoc.data();
      if (linkData.createdBy !== user.uid) {
        setError('Sem permissão para deletar este link');
        return false;
      }

      await deleteDoc(linkRef);
      return true;
    } catch (err) {
      setError('Erro ao deletar link');
      console.error('Erro ao deletar link:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Registrar clique
  const registerClick = useCallback(async (linkId: string): Promise<void> => {
    try {
      const linkRef = doc(db, 'shortLinks', linkId);

      // Obter dados do usuário
      const userAgent = navigator.userAgent;
      const referrer = document.referrer;
      const device = detectDevice(userAgent);

      // Criar registro de clique
      const clickData: Omit<ShortLinkClick, 'id'> = {
        shortLinkId: linkId,
        clickedAt: new Date(),
        userAgent,
        referrer,
        device,
        userId: user?.uid,
        sessionId: sessionStorage.getItem('sessionId') || crypto.randomUUID(),
      };

      // Salvar clique
      await addDoc(collection(db, 'shortLinkClicks'), {
        ...clickData,
        clickedAt: serverTimestamp(),
      });

      // Atualizar contadores do link
      await updateDoc(linkRef, {
        clickCount: increment(1),
        'analytics.totalClicks': increment(1),
        [`analytics.clicksByDate.${new Date().toISOString().split('T')[0]}`]: increment(1),
        [`analytics.clicksByHour.${new Date().getHours().toString().padStart(2, '0')}`]: increment(1),
        [`analytics.clicksByDevice.${device}`]: increment(1),
        'analytics.lastClickedAt': serverTimestamp(),
      });
    } catch (err) {
      console.error('Erro ao registrar clique:', err);
    }
  }, [user]);

  // Buscar link por código
  const getLinkByCode = useCallback(async (shortCode: string): Promise<ShortLink | null> => {
    try {
      const q = query(
        collection(db, 'shortLinks'),
        where('shortCode', '==', shortCode),
        where('isActive', '==', true),
      );

      const snapshot = await getDocs(q);
      if (snapshot.empty) return null;

      const doc = snapshot.docs[0];
      const data = doc.data();

      const link: ShortLink = {
        id: doc.id,
        originalUrl: data.originalUrl,
        shortCode: data.shortCode,
        shortUrl: data.shortUrl,
        title: data.title,
        description: data.description,
        tags: data.tags,
        category: data.category,
        isActive: data.isActive,
        isPublic: data.isPublic,
        clickCount: data.clickCount || 0,
        uniqueVisitors: data.uniqueVisitors || 0,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        expiresAt: data.expiresAt?.toDate(),
        createdBy: data.createdBy,
        metadata: data.metadata,
        analytics: data.analytics || {
          totalClicks: 0,
          clicksByDate: {},
          clicksByHour: {},
          clicksByDevice: {},
          clicksByCountry: {},
        },
      };

      // Verificar se link expirou
      if (isLinkExpired(link)) {
        return null;
      }

      return link;
    } catch (err) {
      console.error('Erro ao buscar link:', err);
      return null;
    }
  }, []);

  // Buscar estatísticas
  const fetchStats = useCallback(async () => {
    if (!user) return;

    try {
      const userLinks = await getDocs(
        query(
          collection(db, 'shortLinks'),
          where('createdBy', '==', user.uid),
        ),
      );

      const statsData: ShortLinkStats = {
        totalLinks: userLinks.size,
        totalClicks: 0,
        activeLinks: 0,
        expiredLinks: 0,
        topLinks: [],
        clicksByCategory: {},
        clicksByDate: {},
      };

      const topLinks: Array<{ id: string; title: string; clicks: number; shortUrl: string }> = [];

      userLinks.forEach((doc) => {
        const data = doc.data();
        const clicks = data.clickCount || 0;

        statsData.totalClicks += clicks;

        if (isLinkActive(data as ShortLink)) {
          statsData.activeLinks++;
        } else {
          statsData.expiredLinks++;
        }

        if (data.category) {
          statsData.clicksByCategory[data.category] = (statsData.clicksByCategory[data.category] || 0) + clicks;
        }

        topLinks.push({
          id: doc.id,
          title: data.title || 'Sem título',
          clicks,
          shortUrl: data.shortUrl,
        });
      });

      statsData.topLinks = topLinks
        .sort((a, b) => b.clicks - a.clicks)
        .slice(0, 5);

      setStats(statsData);
    } catch (err) {
      console.error('Erro ao buscar estatísticas:', err);
    }
  }, [user]);

  // Carregar dados iniciais
  useEffect(() => {
    if (user) {
      fetchUserLinks();
      fetchStats();
    }
  }, [user, fetchUserLinks, fetchStats]);

  return {
    links,
    loading,
    error,
    stats,
    createLink,
    updateLink,
    deleteLink,
    registerClick,
    getLinkByCode,
    fetchUserLinks,
    fetchStats,
  };
};
