// backup-firestore.js
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

// Inicializar Firebase Admin
try {
  initializeApp();
} catch (error) {
  console.log('Firebase Admin já inicializado');
}

const db = getFirestore();

async function backupCollection(collectionName) {
  console.log(`📦 Fazendo backup da coleção: ${collectionName}`);
  
  const snapshot = await db.collection(collectionName).get();
  const documents = [];
  
  snapshot.forEach(doc => {
    documents.push({
      id: doc.id,
      data: doc.data()
    });
  });
  
  return documents;
}

async function backupFirestore() {
  try {
    const collections = ['users', 'teams', 'times', 'convites_times', 'categorias', 'lotes', 'sistema', 'estatisticas'];
    const backup = {};
    
    // Criar diretório de backup
    const backupDir = './firestore-backup';
    mkdirSync(backupDir, { recursive: true });
    
    for (const collectionName of collections) {
      try {
        backup[collectionName] = await backupCollection(collectionName);
        console.log(`✅ ${collectionName}: ${backup[collectionName].length} documentos`);
      } catch (error) {
        console.log(`⚠️  ${collectionName}: Erro - ${error.message}`);
        backup[collectionName] = [];
      }
    }
    
    // Salvar backup
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = join(backupDir, `firestore-backup-${timestamp}.json`);
    
    writeFileSync(backupFile, JSON.stringify(backup, null, 2));
    console.log(`💾 Backup salvo em: ${backupFile}`);
    
    // Estatísticas
    const totalDocs = Object.values(backup).reduce((sum, docs) => sum + docs.length, 0);
    console.log(`📊 Total de documentos: ${totalDocs}`);
    
  } catch (error) {
    console.error('❌ Erro no backup:', error);
  }
}

backupFirestore(); 