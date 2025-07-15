const admin = require("firebase-admin");
const fs = require("fs");

// Caminho do seu arquivo de credenciais do Firebase
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

// Lista de usuários exemplo
const users = [
  {
    uid: "user1",
    name: "Enrique Mello",
    email: "enrique@cerrado.com",
    boxBalance: 250,
    boxEarnedTotal: 500,
  },
  {
    uid: "user2",
    name: "Murylo",
    email: "murylo@interbox.com",
    boxBalance: 120,
    boxEarnedTotal: 200,
  }
];

async function seed() {
  const timestamp = new Date().toISOString();
  for (const user of users) {
    await db.collection("users").doc(user.uid).set({
      name: user.name,
      email: user.email,
      boxBalance: user.boxBalance,
      boxEarnedTotal: user.boxEarnedTotal,
      boxLastUpdate: timestamp
    });

    await db.collection("box_rewards").add({
      userId: user.uid,
      amount: user.boxBalance,
      reason: "Seed inicial",
      timestamp: timestamp,
      ref: "bootstrap"
    });

    console.log(`✅ Usuário ${user.name} registrado com ${user.boxBalance} $BOX`);
  }

  await db.collection("box_stats").doc("global").set({
    totalDistributed: users.reduce((acc, u) => acc + u.boxBalance, 0),
    totalUsers: users.length,
    averagePerUser: users.reduce((acc, u) => acc + u.boxBalance, 0) / users.length,
    updatedAt: timestamp
  });

  console.log("✅ Seed completo com estatísticas atualizadas.");
}

seed().catch(console.error);