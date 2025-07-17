const admin = require("firebase-admin");

// Inicializar Firebase Admin se não estiver inicializado
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

/**
 * Script para atualizar e otimizar a configuração config/tempo_real
 * Sincroniza todos os dados e adiciona campos faltantes
 */
async function updateTempoRealConfig() {
  try {
    console.log("🔄 Iniciando atualização da configuração tempo_real...");

    // Verificar se o documento existe
    const configDoc = await db.collection("config").doc("tempo_real").get();
    
    if (!configDoc.exists) {
      console.log("❌ Documento config/tempo_real não encontrado. Criando...");
      await createInitialConfig();
      return;
    }

    const currentData = configDoc.data();
    console.log("📊 Dados atuais encontrados:", Object.keys(currentData));

    // 🎯 ESTRUTURA COMPLETA ATUALIZADA
    const updatedConfig = {
      // 📊 ESTATÍSTICAS GERAIS (mantém dados existentes)
      stats: {
        totalUsers: currentData.stats?.totalUsers || 0,
        totalTokens: currentData.stats?.totalTokens || 0,
        totalActions: currentData.stats?.totalActions || 0,
        activeUsers: currentData.stats?.activeUsers || 0,
        newUsersToday: currentData.stats?.newUsersToday || 0,
        newUsersWeek: currentData.stats?.newUsersWeek || 0,
        newUsersMonth: currentData.stats?.newUsersMonth || 0,
      },
      
      // 🎯 GAMIFICAÇÃO - Tokens $BOX (mantém dados existentes)
      boxTokens: {
        totalSupply: currentData.boxTokens?.totalSupply || 1000000,
        circulatingSupply: currentData.boxTokens?.circulatingSupply || 0,
        burnedTokens: currentData.boxTokens?.burnedTokens || 0,
        averageBalance: currentData.boxTokens?.averageBalance || 0,
        topHolders: currentData.boxTokens?.topHolders || [],
        recentTransactions: currentData.boxTokens?.recentTransactions || [],
        dailyVolume: currentData.boxTokens?.dailyVolume || 0,
        weeklyVolume: currentData.boxTokens?.weeklyVolume || 0,
        monthlyVolume: currentData.boxTokens?.monthlyVolume || 0,
      },
      
      // 🏆 RANKING E LÍDERES (mantém dados existentes)
      leaderboard: {
        topUsers: currentData.leaderboard?.topUsers || [],
        topEarners: currentData.leaderboard?.topEarners || [],
        topSpenders: currentData.leaderboard?.topSpenders || [],
        mostActive: currentData.leaderboard?.mostActive || [],
        bestStreaks: currentData.leaderboard?.bestStreaks || [],
        referralLeaders: currentData.leaderboard?.referralLeaders || [],
      },
      
      // 📈 MÉTRICAS EM TEMPO REAL (mantém dados existentes)
      realtime: {
        onlineUsers: currentData.realtime?.onlineUsers || 0,
        activeSessions: currentData.realtime?.activeSessions || 0,
        lastUpdate: admin.firestore.FieldValue.serverTimestamp(),
        peakUsers: currentData.realtime?.peakUsers || 0,
        peakTime: currentData.realtime?.peakTime || null,
        averageSessionTime: currentData.realtime?.averageSessionTime || 0,
      },
      
      // 🎮 AÇÕES E EVENTOS (mantém dados existentes)
      actions: {
        totalActions: currentData.actions?.totalActions || 0,
        actionsToday: currentData.actions?.actionsToday || 0,
        actionsWeek: currentData.actions?.actionsWeek || 0,
        actionsMonth: currentData.actions?.actionsMonth || 0,
        popularActions: currentData.actions?.popularActions || [],
        recentActions: currentData.actions?.recentActions || [],
      },
      
      // 🏅 CONQUISTAS E BADGES (mantém dados existentes)
      achievements: {
        totalAchievements: currentData.achievements?.totalAchievements || 0,
        achievementsUnlocked: currentData.achievements?.achievementsUnlocked || 0,
        popularAchievements: currentData.achievements?.popularAchievements || [],
        recentUnlocks: currentData.achievements?.recentUnlocks || [],
      },
      
      // 🔗 REFERRALS E COMUNIDADE (mantém dados existentes)
      referrals: {
        totalReferrals: currentData.referrals?.totalReferrals || 0,
        activeReferrals: currentData.referrals?.activeReferrals || 0,
        referralTokens: currentData.referrals?.referralTokens || 0,
        topReferrers: currentData.referrals?.topReferrers || [],
      },
      
      // 📊 CONFIGURAÇÕES DO SISTEMA (mantém dados existentes)
      system: {
        version: currentData.system?.version || "1.0.0",
        lastMaintenance: admin.firestore.FieldValue.serverTimestamp(),
        maintenanceMode: currentData.system?.maintenanceMode || false,
        features: {
          gamification: currentData.system?.features?.gamification ?? true,
          referrals: currentData.system?.features?.referrals ?? true,
          leaderboard: currentData.system?.features?.leaderboard ?? true,
          achievements: currentData.system?.features?.achievements ?? true,
        },
      },

      // 🎯 NOVOS CAMPOS: Dados específicos do evento
      ingressos: {
        status: currentData.ingressos?.status || 'em_breve',
        dataAbertura: currentData.ingressos?.dataAbertura || '2025-07-13T00:00:00-03:00',
        loteAtual: currentData.ingressos?.loteAtual || 1,
        vagasRestantes: currentData.ingressos?.vagasRestantes || 500,
        precoAtual: currentData.ingressos?.precoAtual || 394.95,
        precoProximoLote: currentData.ingressos?.precoProximoLote || 444.95,
        dataProximoLote: currentData.ingressos?.dataProximoLote || '2025-07-25',
        categoriaAtiva: currentData.ingressos?.categoriaAtiva || 'Scale',
        vagasCategoria: currentData.ingressos?.vagasCategoria || 80,
        totalTimes: currentData.ingressos?.totalTimes || 0,
        limiteLote: currentData.ingressos?.limiteLote || 120,
      },

      indicacoes: {
        total: currentData.indicacoes?.total || 0,
        hoje: currentData.indicacoes?.hoje || 0,
      },

      fotografos: {
        total: currentData.fotografos?.total || 0,
        aprovados: currentData.fotografos?.aprovados || 0,
      },

      // 🎯 Sistema de Tokens $BOX (compatível com componente TempoReal)
      token: {
        box: {
          total: currentData.token?.box?.total || 0,
          media: currentData.token?.box?.media || 0,
          holders: currentData.token?.box?.holders || 0,
          marketCap: currentData.token?.box?.marketCap || 0,
        },
      },

      // 🎯 Controle de exibição na home
      mostrarNaHome: {
        ingressos: currentData.mostrarNaHome?.ingressos ?? true,
        token: currentData.mostrarNaHome?.token ?? true,
        indicacoes: currentData.mostrarNaHome?.indicacoes ?? false,
        fotografos: currentData.mostrarNaHome?.fotografos ?? false,
      },
      
      // 🕒 TIMESTAMPS
      createdAt: currentData.createdAt || admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    // Atualizar documento com merge para preservar dados existentes
    await db.collection("config").doc("tempo_real").set(updatedConfig, { merge: true });
    
    console.log("✅ Configuração tempo_real atualizada com sucesso!");
    console.log("📊 Campos atualizados:");
    console.log("- ✅ Estatísticas gerais");
    console.log("- ✅ Tokens $BOX");
    console.log("- ✅ Ranking e líderes");
    console.log("- ✅ Métricas em tempo real");
    console.log("- ✅ Ações e eventos");
    console.log("- ✅ Conquistas e badges");
    console.log("- ✅ Referrals e comunidade");
    console.log("- ✅ Configurações do sistema");
    console.log("- ✅ Dados específicos do evento (ingressos, indicacoes, fotografos)");
    console.log("- ✅ Controle de exibição na home");
    
    return { success: true, message: "Configuração atualizada com sucesso" };
    
  } catch (error) {
    console.error("❌ Erro ao atualizar configuração:", error);
    throw error;
  }
}

/**
 * Criar configuração inicial se não existir
 */
async function createInitialConfig() {
  try {
    console.log("🌱 Criando configuração inicial...");

    const initialConfig = {
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
        totalSupply: 1000000,
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

      // 🎯 Dados específicos do evento
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

      // 🎯 Sistema de Tokens $BOX
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

    await db.collection("config").doc("tempo_real").set(initialConfig);
    console.log("✅ Configuração inicial criada com sucesso!");
    
    return { success: true, message: "Configuração inicial criada com sucesso" };
    
  } catch (error) {
    console.error("❌ Erro ao criar configuração inicial:", error);
    throw error;
  }
}

/**
 * Função para atualizar dados específicos
 */
async function updateSpecificData(path, value) {
  try {
    const updateData = {};
    updateData[path] = value;
    updateData.updatedAt = admin.firestore.FieldValue.serverTimestamp();
    
    await db.collection("config").doc("tempo_real").update(updateData);
    console.log(`✅ Campo ${path} atualizado com sucesso!`);
    
    return true;
  } catch (error) {
    console.error(`❌ Erro ao atualizar ${path}:`, error);
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
    await updateSpecificData("stats.totalUsers", totalUsers);
    await updateSpecificData("ingressos.totalTimes", totalTimes);
    await updateSpecificData("fotografos.total", totalFotografos);
    await updateSpecificData("fotografos.aprovados", aprovadosFotografos);

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
  updateTempoRealConfig()
    .then(() => syncDataFromCollections())
    .then(() => {
      console.log("🎉 Processo de atualização concluído!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Erro no processo:", error);
      process.exit(1);
    });
}

module.exports = {
  updateTempoRealConfig,
  createInitialConfig,
  updateSpecificData,
  syncDataFromCollections,
}; 