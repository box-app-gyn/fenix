import { onCall } from "firebase-functions/v2/https";
import { db, admin } from "./firebase-admin";

interface ValidaAudiovisualData {
  audiovisualId: string;
  adminId: string;
  aprovado: boolean;
}

export const validaAudiovisual = onCall(async (request) => {
  const data = request.data as ValidaAudiovisualData;
  
  const contextData = {
    functionName: "validaAudiovisual",
    userId: request.auth?.uid,
  };

  try {
    // Verificar autenticação
    if (!request.auth) {
      console.log("Tentativa de validação não autenticada", contextData);
      throw new Error("Usuário não autenticado");
    }

    // Verificar se é admin
    const userDoc = await db.collection("users").doc(request.auth.uid).get();
    const userData = userDoc.data();
    
    if (!userData || userData.role !== "admin") {
      throw new Error("Acesso negado");
    }

    // Atualizar status da inscrição
    await db.collection("audiovisual").doc(data.audiovisualId).update({
      status: data.aprovado ? "approved" : "rejected",
      validatedBy: request.auth.uid,
      validatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log("Inscrição audiovisual validada", {
      audiovisualId: data.audiovisualId,
      aprovado: data.aprovado,
      contextData,
    });

    return {
      success: true,
      audiovisualId: data.audiovisualId,
      aprovado: data.aprovado,
    };
  } catch (error: any) {
    console.error("Erro ao validar inscrição audiovisual", {
      error: error.message,
      audiovisualId: data.audiovisualId,
      contextData,
    });
    throw error;
  }
});

/**
 * Migra dados audiovisuais antigos para o novo formato
 */
export const migrarAudiovisual = onCall(async (request) => {
  const contextData = {
    functionName: "migrarAudiovisual",
    userId: request.auth?.uid,
  };

  try {
    // Verificar autenticação
    if (!request.auth) {
      throw new Error("Usuário não autenticado");
    }

    // Verificar se é admin
    const userDoc = await db.collection("users").doc(request.auth.uid).get();
    const userData = userDoc.data();
    
    if (!userData || userData.role !== "admin") {
      throw new Error("Acesso negado");
    }

    // Buscar todos os documentos audiovisuais
    const audiovisualSnapshot = await db.collection("audiovisual").get();
    let migratedCount = 0;
    let errors = [];

    for (const doc of audiovisualSnapshot.docs) {
      try {
        const data = doc.data();
        
        // Verificar se já está no formato novo
        if (data.portfolio && typeof data.portfolio === 'object' && data.portfolio.urls) {
          console.log(`Documento ${doc.id} já está no formato novo`);
          continue;
        }

        // Migrar dados antigos para novo formato
        const updatedData: any = {
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        // Migrar nome (userName -> nome)
        if (data.userName && !data.nome) {
          updatedData.nome = data.userName;
        }

                 // Migrar portfolio
         if (!data.portfolio || typeof data.portfolio !== 'object') {
           updatedData.portfolio = {
             urls: data.urls || [],
             descricao: data.descricao || '',
             experiencia: data.experiencia || '',
             equipamentos: data.equipamentos || [],
             especialidades: data.especialidades || [],
           };
         }

         // Migrar comentários para "outro"
         if (data.tipo === 'outro' && !data.comentariosOutro) {
           updatedData.comentariosOutro = data.descricao || 'Não especificado';
         }

        // Migrar termos aceitos
        if (data.termosAceitos === undefined) {
          updatedData.termosAceitos = true;
          updatedData.termosAceitosEm = data.createdAt || admin.firestore.FieldValue.serverTimestamp();
        }

        // Aplicar atualizações
        if (Object.keys(updatedData).length > 1) { // Mais que apenas updatedAt
          await doc.ref.update(updatedData);
          migratedCount++;
          console.log(`Documento ${doc.id} migrado com sucesso`);
        }
      } catch (error: any) {
        console.error(`Erro ao migrar documento ${doc.id}:`, error.message);
        errors.push({ docId: doc.id, error: error.message });
      }
    }

    console.log("Migração audiovisual concluída", {
      totalDocuments: audiovisualSnapshot.size,
      migratedCount,
      errors: errors.length,
      contextData,
    });

    return {
      success: true,
      totalDocuments: audiovisualSnapshot.size,
      migratedCount,
      errors,
    };
  } catch (error: any) {
    console.error("Erro ao migrar audiovisual", {
      error: error.message,
      contextData,
    });
    throw error;
  }
});

// Função auxiliar para enviar email (será implementada em emails.ts)
async function enviaEmailConfirmacao(data: any) {
  // Implementação será movida para emails.ts
  console.log("Enviando email de confirmação:", data);
}
