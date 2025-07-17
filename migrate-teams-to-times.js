// migrate-teams-to-times.js
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Inicialize com configuração padrão (usa GOOGLE_APPLICATION_CREDENTIALS ou default)
try {
  initializeApp();
} catch (error) {
  // Se já foi inicializado, continua
  console.log('Firebase Admin já inicializado');
}

const db = getFirestore();

async function migrate() {
  try {
    const oldColl = db.collection('teams');
    const snapshot = await oldColl.get();

    console.log(`🧭 Encontrados ${snapshot.size} docs em 'teams'`);

    for (const doc of snapshot.docs) {
      const data = doc.data();
      const refNew = db.collection('times').doc(doc.id);
      await refNew.set(data, { merge: true });
      await doc.ref.delete();
      console.log(`Migrado: ${doc.id}`);
    }

    console.log('✅ Migração concluída.');
  } catch (error) {
    console.error('❌ Erro na migração:', error);
  }
}

migrate().catch(console.error);
