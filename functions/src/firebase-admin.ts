// ============================================================================
// FIREBASE ADMIN - INICIALIZAÇÃO CENTRALIZADA
// ============================================================================

import * as admin from 'firebase-admin';

// Inicializar Firebase Admin se não estiver inicializado
if (!admin.apps.length) {
  admin.initializeApp();
}

// Exportar instâncias para uso em outros arquivos
export const db = admin.firestore();
export { admin }; 