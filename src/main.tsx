import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Função melhorada para aguardar carregamento das folhas de estilo
const waitForStylesheets = (): Promise<void> => {
  return new Promise((resolve) => {
    let attempts = 0;
    const maxAttempts = 200; // 10 segundos máximo (50ms * 200)
    
    const checkStylesheets = () => {
      attempts++;
      
      try {
        const stylesheets = Array.from(document.styleSheets);
        const allLoaded = stylesheets.every(sheet => {
          try {
            // Verificar se a folha está carregada
            return sheet.cssRules.length > 0 || sheet.href === null;
          } catch (e) {
            // Se não consegue acessar cssRules, a folha ainda está carregando
            return false;
          }
        });
        
        if (allLoaded || attempts >= maxAttempts) {
          console.log(`✅ Folhas de estilo carregadas (tentativas: ${attempts})`);
          resolve();
        } else {
          // Aguardar um pouco e verificar novamente
          setTimeout(checkStylesheets, 50);
        }
      } catch (error) {
        console.warn('⚠️ Erro ao verificar folhas de estilo:', error);
        if (attempts >= maxAttempts) {
          console.log('⏰ Timeout ao carregar folhas de estilo - continuando...');
          resolve();
        } else {
          setTimeout(checkStylesheets, 50);
        }
      }
    };
    
    // Aguardar DOM estar pronto
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', checkStylesheets);
    } else {
      checkStylesheets();
    }
  });
};

// Função para remover loading fallback
const removeLoadingFallback = () => {
  const fallback = document.getElementById('loading-fallback');
  if (fallback) {
    fallback.style.opacity = '0';
    setTimeout(() => {
      fallback.style.display = 'none';
    }, 300);
  }
};

// Função principal de inicialização
const initializeApp = async () => {
  try {
    console.log('🔄 Iniciando carregamento da aplicação...');
    
    // Aguardar folhas de estilo carregarem com timeout
    const stylesheetPromise = waitForStylesheets();
    const timeoutPromise = new Promise(resolve => setTimeout(resolve, 5000));
    
    await Promise.race([stylesheetPromise, timeoutPromise]);
    
    // Remover loading fallback
    removeLoadingFallback();
    
    // Registro robusto do Service Worker
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', { 
          scope: '/',
          updateViaCache: 'none' // Força verificação de atualizações
        });
        
        console.log('✅ Service Worker registrado:', registration);
        
        // Verificar atualizações periodicamente
        registration.addEventListener('updatefound', () => {
          console.log('🔄 Nova versão do Service Worker encontrada');
        });
        
        // Forçar atualização se necessário
        registration.update();
        
      } catch (error) {
        console.error('❌ Erro ao registrar Service Worker:', error);
      }
    }
    
    // Renderizar aplicação
    const root = document.getElementById('root');
    if (root) {
      ReactDOM.createRoot(root).render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      );
      console.log('✅ Aplicação renderizada com sucesso');
    } else {
      throw new Error('Elemento root não encontrado');
    }
    
  } catch (error) {
    console.error('❌ Erro ao inicializar aplicação:', error);
    
    // Remover loading fallback mesmo com erro
    removeLoadingFallback();
    
    // Fallback: tentar renderizar mesmo com erro
    const root = document.getElementById('root');
    if (root) {
      ReactDOM.createRoot(root).render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      );
    }
  }
};

// Inicializar aplicação
initializeApp(); 