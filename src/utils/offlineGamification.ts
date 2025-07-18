import { usePWA } from '../hooks/usePWA';

export interface OfflineAction {
  id?: number;
  type: string;
  data: any;
  timestamp: number;
  sessionId: string;
  userId: string;
  synced?: boolean;
}

export interface GamificationAction {
  type: 'token_earned' | 'achievement_unlocked' | 'level_up' | 'streak_updated' | 'challenge_completed';
  amount?: number;
  achievement?: string;
  level?: string;
  streak?: number;
  challenge?: string;
  metadata?: any;
}

export class OfflineGamification {
  private static instance: OfflineGamification;
  private pwaHook: any;

  private constructor() {}

  static getInstance(): OfflineGamification {
    if (!OfflineGamification.instance) {
      OfflineGamification.instance = new OfflineGamification();
    }
    return OfflineGamification.instance;
  }

  setPWAHook(pwaHook: any) {
    this.pwaHook = pwaHook;
  }

  /**
   * Salvar ação offline para sincronizar depois
   */
  async saveOfflineAction(action: string, data: any): Promise<void> {
    try {
      const actionData: OfflineAction = {
        type: action,
        data,
        timestamp: Date.now(),
        sessionId: this.getSessionId(),
        userId: this.getUserId(),
        synced: false,
      };

      await this.saveToIndexedDB('offlineActions', actionData);
      
      // Track analytics
      this.pwaHook?.trackEvent('offline_action_saved', {
        action,
        timestamp: Date.now(),
      });

      console.log('✅ Ação offline salva:', action);
    } catch (error) {
      console.error('❌ Erro ao salvar ação offline:', error);
      throw error;
    }
  }

  /**
   * Salvar ação de gamificação offline
   */
  async saveGamificationAction(action: GamificationAction): Promise<void> {
    try {
      const gamificationData = {
        ...action,
        timestamp: Date.now(),
        sessionId: this.getSessionId(),
        userId: this.getUserId(),
        synced: false,
      };

      await this.saveToIndexedDB('gamificationActions', gamificationData);
      
      // Track analytics
      this.pwaHook?.trackEvent('gamification_action_offline', {
        type: action.type,
        timestamp: Date.now(),
      });

      console.log('✅ Ação de gamificação offline salva:', action.type);
    } catch (error) {
      console.error('❌ Erro ao salvar gamificação offline:', error);
      throw error;
    }
  }

  /**
   * Sincronizar ações offline quando voltar online
   */
  async syncOfflineActions(): Promise<void> {
    try {
      const actions = await this.getOfflineActions();
      const gamificationActions = await this.getGamificationActions();
      
      if (actions.length === 0 && gamificationActions.length === 0) {
        console.log('ℹ️ Nenhuma ação offline para sincronizar');
        return;
      }

      console.log(`🔄 Sincronizando ${actions.length} ações offline...`);

      // Processar ações de gamificação primeiro
      for (const action of gamificationActions) {
        await this.processGamificationAction(action);
      }

      // Processar outras ações
      for (const action of actions) {
        await this.processOfflineAction(action);
      }

      // Limpar ações sincronizadas
      await this.clearSyncedActions();
      
      console.log('✅ Ações offline sincronizadas com sucesso!');
      
      // Track analytics
      this.pwaHook?.trackEvent('offline_actions_synced', {
        count: actions.length + gamificationActions.length,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error('❌ Erro ao sincronizar ações offline:', error);
      throw error;
    }
  }

  /**
   * Processar ação de gamificação específica
   */
  private async processGamificationAction(action: any): Promise<void> {
    try {
      switch (action.type) {
        case 'token_earned':
          await this.syncTokenEarned(action);
          break;
        case 'achievement_unlocked':
          await this.syncAchievementUnlocked(action);
          break;
        case 'level_up':
          await this.syncLevelUp(action);
          break;
        case 'streak_updated':
          await this.syncStreakUpdated(action);
          break;
        case 'challenge_completed':
          await this.syncChallengeCompleted(action);
          break;
        default:
          console.warn('⚠️ Tipo de gamificação desconhecido:', action.type);
      }
    } catch (error) {
      console.error(`❌ Erro ao processar gamificação ${action.type}:`, error);
    }
  }

  /**
   * Sincronizar tokens ganhos offline
   */
  private async syncTokenEarned(action: any): Promise<void> {
    // Implementar lógica para sincronizar tokens com Firebase
    console.log('💰 Sincronizando tokens ganhos:', action.amount);
    
    // Exemplo de implementação:
    // const userRef = doc(db, 'users', action.userId);
    // await updateDoc(userRef, {
    //   'gamification.tokens.box.balance': increment(action.amount),
    //   'gamification.tokens.box.totalEarned': increment(action.amount),
    //   'gamification.tokens.box.lastTransaction': serverTimestamp(),
    // });
  }

  /**
   * Sincronizar achievements desbloqueados offline
   */
  private async syncAchievementUnlocked(action: any): Promise<void> {
    console.log('🏆 Sincronizando achievement:', action.achievement);
    
    // Implementar lógica para sincronizar achievements
  }

  /**
   * Sincronizar level up offline
   */
  private async syncLevelUp(action: any): Promise<void> {
    console.log('📈 Sincronizando level up:', action.level);
    
    // Implementar lógica para sincronizar level
  }

  /**
   * Sincronizar streak atualizado offline
   */
  private async syncStreakUpdated(action: any): Promise<void> {
    console.log('🔥 Sincronizando streak:', action.streak);
    
    // Implementar lógica para sincronizar streak
  }

  /**
   * Sincronizar challenge completado offline
   */
  private async syncChallengeCompleted(action: any): Promise<void> {
    console.log('🎯 Sincronizando challenge:', action.challenge);
    
    // Implementar lógica para sincronizar challenge
  }

  /**
   * Processar ação offline genérica
   */
  private async processOfflineAction(action: OfflineAction): Promise<void> {
    try {
      switch (action.type) {
        case 'audiovisual_submission':
          await this.syncAudiovisualSubmission(action);
          break;
        case 'profile_update':
          await this.syncProfileUpdate(action);
          break;
        case 'form_submission':
          await this.syncFormSubmission(action);
          break;
        default:
          console.warn('⚠️ Tipo de ação desconhecido:', action.type);
      }
    } catch (error) {
      console.error(`❌ Erro ao processar ação ${action.type}:`, error);
    }
  }

  /**
   * Sincronizar submissão audiovisual offline
   */
  // eslint-disable-next-line no-unused-vars
  private async syncAudiovisualSubmission(_action: OfflineAction): Promise<void> {
    console.log('📹 Sincronizando submissão audiovisual offline');
    
    // Implementar lógica para enviar dados do formulário audiovisual
    // const { data } = _action;
    // await submitAudiovisualForm(data);
  }

  /**
   * Sincronizar atualização de perfil offline
   */
  // eslint-disable-next-line no-unused-vars
  private async syncProfileUpdate(_action: OfflineAction): Promise<void> {
    console.log('👤 Sincronizando atualização de perfil offline');
    
    // Implementar lógica para atualizar perfil
  }

  /**
   * Sincronizar submissão de formulário offline
   */
  // eslint-disable-next-line no-unused-vars
  private async syncFormSubmission(_action: OfflineAction): Promise<void> {
    console.log('📝 Sincronizando submissão de formulário offline');
    
    // Implementar lógica para enviar formulário
  }

  /**
   * Obter ações offline não sincronizadas
   */
  async getOfflineActions(): Promise<OfflineAction[]> {
    try {
      const db = await this.openDB();
      const transaction = db.transaction(['offlineActions'], 'readonly');
      const store = transaction.objectStore('offlineActions');
      const request = store.getAll();
      
      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          const actions = request.result || [];
          resolve(actions.filter((action: OfflineAction) => !action.synced));
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('❌ Erro ao obter ações offline:', error);
      return [];
    }
  }

  /**
   * Obter ações de gamificação offline
   */
  async getGamificationActions(): Promise<any[]> {
    try {
      const db = await this.openDB();
      const transaction = db.transaction(['gamificationActions'], 'readonly');
      const store = transaction.objectStore('gamificationActions');
      const request = store.getAll();
      
      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          const actions = request.result || [];
          resolve(actions.filter((action: any) => !action.synced));
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('❌ Erro ao obter gamificação offline:', error);
      return [];
    }
  }

  /**
   * Limpar ações já sincronizadas
   */
  async clearSyncedActions(): Promise<void> {
    try {
      const db = await this.openDB();
      
      // Limpar ações offline sincronizadas
      const offlineTransaction = db.transaction(['offlineActions'], 'readwrite');
      const offlineStore = offlineTransaction.objectStore('offlineActions');
      const offlineRequest = offlineStore.getAll();
      
      offlineRequest.onsuccess = () => {
        const offlineActions = offlineRequest.result || [];
        offlineActions.forEach((action: any) => {
          if (action.synced) {
            offlineStore.delete(action.id);
          }
        });
      };

      // Limpar gamificação sincronizada
      const gamificationTransaction = db.transaction(['gamificationActions'], 'readwrite');
      const gamificationStore = gamificationTransaction.objectStore('gamificationActions');
      const gamificationRequest = gamificationStore.getAll();
      
      gamificationRequest.onsuccess = () => {
        const gamificationActions = gamificationRequest.result || [];
        gamificationActions.forEach((action: any) => {
          if (action.synced) {
            gamificationStore.delete(action.id);
          }
        });
      };

      console.log('🗑️ Ações sincronizadas removidas');
    } catch (error) {
      console.error('❌ Erro ao limpar ações sincronizadas:', error);
    }
  }

  /**
   * Verificar se há ações offline pendentes
   */
  async hasPendingActions(): Promise<boolean> {
    try {
      const actions = await this.getOfflineActions();
      const gamificationActions = await this.getGamificationActions();
      
      return actions.length > 0 || gamificationActions.length > 0;
    } catch (error) {
      console.error('❌ Erro ao verificar ações pendentes:', error);
      return false;
    }
  }

  /**
   * Obter estatísticas de ações offline
   */
  async getOfflineStats(): Promise<{
    pendingActions: number;
    pendingGamification: number;
    lastSync: number | null;
  }> {
    try {
      const actions = await this.getOfflineActions();
      const gamificationActions = await this.getGamificationActions();
      const lastSync = localStorage.getItem('last_offline_sync');
      
      return {
        pendingActions: actions.length,
        pendingGamification: gamificationActions.length,
        lastSync: lastSync ? parseInt(lastSync) : null,
      };
    } catch (error) {
      console.error('❌ Erro ao obter estatísticas offline:', error);
      return {
        pendingActions: 0,
        pendingGamification: 0,
        lastSync: null,
      };
    }
  }

  // Funções auxiliares
  private getSessionId(): string {
    let sessionId = localStorage.getItem('interbox_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('interbox_session_id', sessionId);
    }
    return sessionId;
  }

  private getUserId(): string {
    return localStorage.getItem('interbox_user_id') || 'anonymous';
  }

  private async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('InterboxOfflineDB', 2); // Versão 2 para incluir gamificationActions
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Store para ações offline
        if (!db.objectStoreNames.contains('offlineActions')) {
          const actionStore = db.createObjectStore('offlineActions', { keyPath: 'id', autoIncrement: true });
          actionStore.createIndex('timestamp', 'timestamp', { unique: false });
          actionStore.createIndex('synced', 'synced', { unique: false });
        }
        
        // Store para gamificação
        if (!db.objectStoreNames.contains('gamificationActions')) {
          const gamificationStore = db.createObjectStore('gamificationActions', { keyPath: 'id', autoIncrement: true });
          gamificationStore.createIndex('timestamp', 'timestamp', { unique: false });
          gamificationStore.createIndex('synced', 'synced', { unique: false });
        }
        
        // Store para analytics
        if (!db.objectStoreNames.contains('analytics')) {
          const analyticsStore = db.createObjectStore('analytics', { keyPath: 'id', autoIncrement: true });
          analyticsStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  private async saveToIndexedDB(storeName: string, data: any): Promise<number> {
    const db = await this.openDB();
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.add(data);
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result as number);
      request.onerror = () => reject(request.error);
    });
  }
}

// Exportar instância singleton
export const offlineGamification = OfflineGamification.getInstance();

// Hook para usar gamificação offline
export const useOfflineGamification = () => {
  const pwaHook = usePWA();
  
  // Configurar PWA hook na instância
  offlineGamification.setPWAHook(pwaHook);

  return {
    saveOfflineAction: offlineGamification.saveOfflineAction.bind(offlineGamification),
    saveGamificationAction: offlineGamification.saveGamificationAction.bind(offlineGamification),
    syncOfflineActions: offlineGamification.syncOfflineActions.bind(offlineGamification),
    hasPendingActions: offlineGamification.hasPendingActions.bind(offlineGamification),
    getOfflineStats: offlineGamification.getOfflineStats.bind(offlineGamification),
  };
}; 