const admin = require("firebase-admin");

// Inicializar Firebase Admin se não estiver inicializado
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

/**
 * Script para popular dados iniciais da coleção config
 * Especificamente para config/tempo_real usado pelo componente TempoReal
 */
async function seedConfigData() {
  try {
    console.log("🌱 Iniciando seed dos dados de configuração...");

    // Verificar se o documento já existe
    const configDoc = await db.collection("config").doc("tempo_real").get();
    
    if (configDoc.exists) {
      console.log("⚠️ Documento config/tempo_real já existe. Atualizando estrutura...");
      return await updateExistingConfig();
    }

    // Dados iniciais para config/tempo_real
    const tempoRealData = {
      // 📊 ESTATÍSTICAS GERAIS
      stats: {
        totalUsers: 0,
        totalTokens: 0,
        totalActions: 0,
        activeUsers: 0,
        newUsersToday: 0,
        newUsersWeek: 0,
        newUsersMonth: 0,
      },
      
      // 🎯 GAMIFICAÇÃO - Tokens $BOX
      boxTokens: {
        totalSupply: 1000000, // 1M tokens totais
        circulatingSupply: 0,
        burnedTokens: 0,
        averageBalance: 0,
        topHolders: [],
        recentTransactions: [],
        dailyVolume: 0,
        weeklyVolume: 0,
        monthlyVolume: 0,
      },
      
      // 🏆 RANKING E LÍDERES
      leaderboard: {
        topUsers: [],
        topEarners: [],
        topSpenders: [],
        mostActive: [],
        bestStreaks: [],
        referralLeaders: [],
      },
      
      // 📈 MÉTRICAS EM TEMPO REAL
      realtime: {
        onlineUsers: 0,
        activeSessions: 0,
        lastUpdate: admin.firestore.FieldValue.serverTimestamp(),
        peakUsers: 0,
        peakTime: null,
        averageSessionTime: 0,
      },
      
      // 🎮 AÇÕES E EVENTOS
      actions: {
        totalActions: 0,
        actionsToday: 0,
        actionsWeek: 0,
        actionsMonth: 0,
        popularActions: [],
        recentActions: [],
      },
      
      // 🏅 CONQUISTAS E BADGES
      achievements: {
        totalAchievements: 0,
        achievementsUnlocked: 0,
        popularAchievements: [],
        recentUnlocks: [],
      },
      
      // 🔗 REFERRALS E COMUNIDADE
      referrals: {
        totalReferrals: 0,
        activeReferrals: 0,
        referralTokens: 0,
        topReferrers: [],
      },
      
      // 📊 CONFIGURAÇÕES DO SISTEMA
      system: {
        version: "1.0.0",
        lastMaintenance: admin.firestore.FieldValue.serverTimestamp(),
        maintenanceMode: false,
        features: {
          gamification: true,
          referrals: true,
          leaderboard: true,
          achievements: true,
        },
      },

      // 🎯 Dados específicos do evento (compatível com componente TempoReal)
      ingressos: {
        status: 'em_breve',
        dataAbertura: '2025-07-13T00:00:00-03:00',
        loteAtual: 1,
        vagasRestantes: 500,
        precoAtual: 394.95,
        precoProximoLote: 444.95,
        dataProximoLote: '2025-07-25',
        categoriaAtiva: 'Scale',
        vagasCategoria: 80,
        totalTimes: 0,
        limiteLote: 120,
      },

      indicacoes: {
        total: 0,
        hoje: 0,
      },

      fotografos: {
        total: 0,
        aprovados: 0,
      },

      // 🎯 Sistema de Tokens $BOX (compatível com componente TempoReal)
      token: {
        box: {
          total: 0,
          media: 0,
          holders: 0,
          marketCap: 0,
        },
      },

      // 🎯 Controle de exibição na home
      mostrarNaHome: {
        ingressos: true,
        token: true,
        indicacoes: false,
        fotografos: false,
      },
      
      // 🕒 TIMESTAMPS
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    // Criar documento config/tempo_real
    await db.collection("config").doc("tempo_real").set(tempoRealData);
    
    console.log("✅ Dados de configuração criados com sucesso!");
    console.log("📊 Documento: config/tempo_real");
    console.log("🎯 Tokens $BOX configurados");
    console.log("🏆 Sistema de ranking inicializado");
    console.log("📈 Métricas em tempo real ativas");
    console.log("🎫 Dados do evento configurados");
    
    return { success: true, message: "Configuração inicializada com sucesso" };
    
  } catch (error) {
    console.error("❌ Erro ao criar dados de configuração:", error);
    throw error;
  }
}

/**
 * Atualizar configuração existente com novos campos
 */
async function updateExistingConfig() {
  try {
    console.log("🔄 Atualizando configuração existente...");
    
    const currentData = (await db.collection("config").doc("tempo_real").get()).data();
    
    // Adicionar campos que podem estar faltando
    const updates = {
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    // Adicionar campos de ingressos se não existirem
    if (!currentData.ingressos) {
      updates.ingressos = {
        status: 'em_breve',
        dataAbertura: '2025-07-13T00:00:00-03:00',
        loteAtual: 1,
        vagasRestantes: 500,
        precoAtual: 394.95,
        precoProximoLote: 444.95,
        dataProximoLote: '2025-07-25',
        categoriaAtiva: 'Scale',
        vagasCategoria: 80,
        totalTimes: 0,
        limiteLote: 120,
      };
    }

    // Adicionar campos de indicacoes se não existirem
    if (!currentData.indicacoes) {
      updates.indicacoes = {
        total: 0,
        hoje: 0,
      };
    }

    // Adicionar campos de fotografos se não existirem
    if (!currentData.fotografos) {
      updates.fotografos = {
        total: 0,
        aprovados: 0,
      };
    }

    // Adicionar campos de token se não existirem
    if (!currentData.token) {
      updates.token = {
        box: {
          total: 0,
          media: 0,
          holders: 0,
          marketCap: 0,
        },
      };
    }

    // Adicionar campos de mostrarNaHome se não existirem
    if (!currentData.mostrarNaHome) {
      updates.mostrarNaHome = {
        ingressos: true,
        token: true,
        indicacoes: false,
        fotografos: false,
      };
    }

    // Aplicar atualizações
    if (Object.keys(updates).length > 1) { // Mais que apenas updatedAt
      await db.collection("config").doc("tempo_real").update(updates);
      console.log("✅ Configuração atualizada com sucesso!");
      console.log("📊 Campos adicionados:", Object.keys(updates).filter(key => key !== 'updatedAt'));
    } else {
      console.log("✅ Configuração já está atualizada!");
    }
    
    return { success: true, message: "Configuração atualizada com sucesso" };
    
  } catch (error) {
    console.error("❌ Erro ao atualizar configuração:", error);
    throw error;
  }
}

/**
 * Função para verificar se os dados já existem
 */
async function checkConfigExists() {
  try {
    const configDoc = await db.collection("config").doc("tempo_real").get();
    return configDoc.exists;
  } catch (error) {
    console.error("Erro ao verificar configuração:", error);
    return false;
  }
}

/**
 * Função para sincronizar dados de outras coleções
 */
async function syncDataFromCollections() {
  try {
    console.log("🔄 Sincronizando dados de outras coleções...");

    // Sincronizar dados de usuários
    const usersSnapshot = await db.collection("users").get();
    const totalUsers = usersSnapshot.size;
    
    // Sincronizar dados de times
    const teamsSnapshot = await db.collection("teams").get();
    const totalTimes = teamsSnapshot.size;
    
    // Sincronizar dados de audiovisual
    const audiovisualSnapshot = await db.collection("audiovisual").get();
    const totalFotografos = audiovisualSnapshot.size;
    const aprovadosFotografos = audiovisualSnapshot.docs.filter(doc => 
      doc.data().status === 'aprovado'
    ).length;

    // Atualizar dados sincronizados
    await db.collection("config").doc("tempo_real").update({
      "stats.totalUsers": totalUsers,
      "ingressos.totalTimes": totalTimes,
      "fotografos.total": totalFotografos,
      "fotografos.aprovados": aprovadosFotografos,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log("✅ Dados sincronizados com sucesso!");
    console.log(`- Usuários: ${totalUsers}`);
    console.log(`- Times: ${totalTimes}`);
    console.log(`- Fotógrafos: ${totalFotografos} (${aprovadosFotografos} aprovados)`);
    
    return true;
  } catch (error) {
    console.error("❌ Erro ao sincronizar dados:", error);
    return false;
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  seedConfigData()
    .then(() => syncDataFromCollections())
    .then(() => {
      console.log("🎉 Processo de seed concluído!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Erro no processo:", error);
      process.exit(1);
    });
}

module.exports = {
  seedConfigData,
  updateExistingConfig,
  checkConfigExists,
  syncDataFromCollections,
}; 