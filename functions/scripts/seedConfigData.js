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
    
    return { success: true, message: "Configuração inicializada com sucesso" };
    
  } catch (error) {
    console.error("❌ Erro ao criar dados de configuração:", error);
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
 * Função principal para executar o seed
 */
async function main() {
  try {
    const exists = await checkConfigExists();
    
    if (exists) {
      console.log("⚠️  Configuração já existe. Sobrescrevendo...");
    }
    
    await seedConfigData();
    console.log("🎉 Seed concluído com sucesso!");
    
  } catch (error) {
    console.error("💥 Erro no seed:", error);
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main();
}

module.exports = {
  seedConfigData,
  checkConfigExists,
  main,
}; 