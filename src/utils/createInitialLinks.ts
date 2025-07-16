import { addDoc, collection, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { generateShortUrl } from '../types/linkShortener';

// Links iniciais para o App Fenix
const INITIAL_LINKS = [
  {
    originalUrl: 'https://www.brasilgamesscoreboard.com.br/checkout/77e9f9d6-f194-4bc5-bc83-6311699c68a9',
    shortCode: 'ingresso2025',
    title: 'Comprar Ingresso - CERRADO INTERBØX 2025',
    description: 'Link oficial para compra de ingressos do CERRADO INTERBØX 2025',
    category: 'ingresso' as const,
    isPublic: true,
    isActive: true,
  },
  {
    originalUrl: 'https://chat.whatsapp.com/FHTqm0l36kc7RWYWMw1Kiz',
    shortCode: 'comunidade',
    title: 'Comunidade WhatsApp - CERRADO INTERBØX',
    description: 'Entre na comunidade oficial do WhatsApp do CERRADO INTERBØX 2025',
    category: 'comunidade' as const,
    isPublic: true,
    isActive: true,
  },
  {
    originalUrl: 'https://www.instagram.com/cerradointerbox',
    shortCode: 'instagram',
    title: 'Instagram - CERRADO INTERBØX',
    description: 'Siga o CERRADO INTERBØX no Instagram para novidades',
    category: 'midia' as const,
    isPublic: true,
    isActive: true,
  },
  {
    originalUrl: 'https://www.facebook.com/cerradointerbox',
    shortCode: 'facebook',
    title: 'Facebook - CERRADO INTERBØX',
    description: 'Curta a página do CERRADO INTERBØX no Facebook',
    category: 'midia' as const,
    isPublic: true,
    isActive: true,
  },
  {
    originalUrl: 'https://www.youtube.com/@cerradointerbox',
    shortCode: 'youtube',
    title: 'YouTube - CERRADO INTERBØX',
    description: 'Inscreva-se no canal do YouTube do CERRADO INTERBØX',
    category: 'midia' as const,
    isPublic: true,
    isActive: true,
  },
];

export const createInitialLinks = async (adminUserId: string) => {
  try {
    console.log('🔄 Criando links iniciais...');

    for (const linkData of INITIAL_LINKS) {
      // Verificar se o link já existe
      const existingLink = await getDocs(
        query(collection(db, 'shortLinks'), where('shortCode', '==', linkData.shortCode))
      );

      if (!existingLink.empty) {
        console.log(`⚠️ Link ${linkData.shortCode} já existe, pulando...`);
        continue;
      }

      // Criar novo link
      const newLink = {
        ...linkData,
        shortUrl: generateShortUrl(linkData.shortCode),
        clickCount: 0,
        uniqueVisitors: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: adminUserId,
        analytics: {
          totalClicks: 0,
          clicksByDate: {},
          clicksByHour: {},
          clicksByDevice: {},
          clicksByCountry: {},
        }
      };

      await addDoc(collection(db, 'shortLinks'), newLink);
      console.log(`✅ Link criado: ${linkData.shortCode} -> ${linkData.originalUrl}`);
    }

    console.log('🎉 Links iniciais criados com sucesso!');
    return true;
  } catch (error) {
    console.error('❌ Erro ao criar links iniciais:', error);
    return false;
  }
};

// Função para criar link único
export const createSingleLink = async (
  adminUserId: string,
  originalUrl: string,
  shortCode: string,
  title?: string,
  description?: string,
  category: 'evento' | 'ingresso' | 'comunidade' | 'midia' | 'admin' | 'outro' = 'outro'
) => {
  try {
    // Verificar se o link já existe
    const existingLink = await getDocs(
      query(collection(db, 'shortLinks'), where('shortCode', '==', shortCode))
    );

    if (!existingLink.empty) {
      console.log(`⚠️ Link ${shortCode} já existe`);
      return false;
    }

    // Criar novo link
    const newLink = {
      originalUrl,
      shortCode,
      shortUrl: generateShortUrl(shortCode),
      title: title || `Link ${shortCode}`,
      description: description || `Link encurtado para ${originalUrl}`,
      category,
      isPublic: true,
      isActive: true,
      clickCount: 0,
      uniqueVisitors: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: adminUserId,
      analytics: {
        totalClicks: 0,
        clicksByDate: {},
        clicksByHour: {},
        clicksByDevice: {},
        clicksByCountry: {},
      }
    };

    await addDoc(collection(db, 'shortLinks'), newLink);
    console.log(`✅ Link criado: ${shortCode} -> ${originalUrl}`);
    return true;
  } catch (error) {
    console.error('❌ Erro ao criar link:', error);
    return false;
  }
}; 