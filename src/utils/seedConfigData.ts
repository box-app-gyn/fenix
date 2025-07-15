import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface TempoRealConfig {
  ingressos: {
    status: 'em_breve' | 'disponivel' | 'esgotado';
    dataAbertura?: string;
    loteAtual?: number;
    vagasRestantes?: number;
  };
  indicacoes: {
    total: number;
    hoje: number;
  };
  fotografos: {
    total: number;
    aprovados: number;
  };
  // 🎯 ATUALIZADO: Sistema de Tokens $BOX
  token: {
    box: {
      total: number;    // Total distribuído de $BOX
      media: number;    // Média de $BOX por usuário
      holders: number;  // Número de holders
      marketCap?: number; // Market cap simulado
    };
  };
  mostrarNaHome: {
    ingressos: boolean;
    token: boolean;     // Alterado de 'xp' para 'token'
    indicacoes: boolean;
    fotografos: boolean;
  };
}

const initialConfigData: TempoRealConfig = {
  ingressos: {
    status: 'em_breve',
    dataAbertura: '2025-07-13T00:00:00-03:00',
    loteAtual: 1,
    vagasRestantes: 500
  },
  indicacoes: {
    total: 0,
    hoje: 0
  },
  fotografos: {
    total: 0,
    aprovados: 0
  },
  // 🎯 Dados iniciais do token $BOX
  token: {
    box: {
      total: 0,           // Total distribuído
      media: 0,           // Média por usuário
      holders: 0,         // Número de holders
      marketCap: 0        // Market cap simulado
    }
  },
  mostrarNaHome: {
    ingressos: true,
    token: true,          // Alterado de 'xp' para 'token'
    indicacoes: false,    // ❌ Removido da home
    fotografos: false     // ❌ Removido da home
  }
};

export const seedConfigData = async () => {
  try {
    console.log('🌱 Iniciando seed dos dados de configuração...');
    
    // Criar documento config/tempo_real
    await setDoc(doc(db, 'config', 'tempo_real'), {
      ...initialConfigData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    console.log('✅ Configuração tempo_real criada com sucesso!');
    console.log('📊 Dados iniciais:');
    console.log('- Ingressos: Em breve (abertura: 13/07/2025)');
    console.log('- Vagas restantes: 500');
    console.log('- Mostrar na home: Apenas ingressos e tokens $BOX');
    console.log('- Token $BOX: 0 distribuído, 0 holders');
    
    return true;
  } catch (error) {
    console.error('❌ Erro ao criar configuração:', error);
    return false;
  }
};

// Função para atualizar dados específicos
export const updateTempoRealData = async (updates: Partial<TempoRealConfig>) => {
  try {
    console.log('🔄 Atualizando dados de tempo real...');
    
    await setDoc(doc(db, 'config', 'tempo_real'), {
      ...updates,
      updatedAt: serverTimestamp()
    }, { merge: true });
    
    console.log('✅ Dados atualizados com sucesso!');
    return true;
  } catch (error) {
    console.error('❌ Erro ao atualizar dados:', error);
    return false;
  }
};

// Funções específicas para atualizar métricas
export const updateIngressosStatus = async (status: 'em_breve' | 'disponivel' | 'esgotado', vagasRestantes?: number) => {
  return updateTempoRealData({
    ingressos: {
      status,
      vagasRestantes: vagasRestantes || 0
    }
  });
};

export const updateIndicacoes = async (total: number, hoje: number) => {
  return updateTempoRealData({
    indicacoes: { total, hoje }
  });
};

export const updateFotografos = async (total: number, aprovados: number) => {
  return updateTempoRealData({
    fotografos: { total, aprovados }
  });
};

// 🎯 Funções específicas para tokens $BOX
export const updateTokenBox = async (total: number, media: number, holders: number, marketCap?: number) => {
  return updateTempoRealData({
    token: {
      box: {
        total,
        media,
        holders,
        marketCap: marketCap || 0
      }
    }
  });
};

export const updateMostrarNaHome = async (config: {
  ingressos?: boolean;
  token?: boolean;        // Alterado de 'xp' para 'token'
  indicacoes?: boolean;
  fotografos?: boolean;
}) => {
  return updateTempoRealData({
    mostrarNaHome: {
      ingressos: config.ingressos ?? true,
      token: config.token ?? true,
      indicacoes: config.indicacoes ?? false,
      fotografos: config.fotografos ?? false
    }
  });
}; 