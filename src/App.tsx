import { createBrowserRouter, RouterProvider, useParams, Navigate, Outlet } from 'react-router-dom';
import { useState, useEffect, lazy, Suspense, useCallback, useMemo } from 'react';
import { useAuth } from './hooks/useAuth';
import { useMobile } from './hooks/useMobile';
import { usePWA } from './hooks/usePWA';
import { useOfflineGamification } from './utils/offlineGamification';
import Header from './components/Header';
import Footer from './components/Footer';
import { FirebaseErrorBoundary } from './components/FirebaseErrorBoundary';
import LoadingScreen from './components/LoadingScreen';
import ProtectedRoute from './components/ProtectedRoute';
import { useRoleRedirect } from './hooks/useRoleRedirect';

// Lazy load de páginas com prefetch strategy
const LoginPage = lazy(() => import('./pages/Login'));
const Home = lazy(() => import('./pages/index'));
const GamifiedLeaderboard = lazy(() => import('./components/GamifiedLeaderboard'));
const SobrePage = lazy(() => import('./pages/Sobre'));
const Termos = lazy(() => import('./pages/Termos'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminPainel = lazy(() => import('./pages/AdminPainel'));
const DashboardEvento = lazy(() => import('./pages/DashboardEvento'));
const DevDashboard = lazy(() => import('./pages/DevDashboard'));
const MarketingDashboard = lazy(() => import('./pages/MarketingDashboard'));
const Audiovisual = lazy(() => import('./pages/Audiovisual'));
const AudiovisualForm = lazy(() => import('./pages/audiovisual/form'));
const AudiovisualPayment = lazy(() => import('./pages/audiovisual/payment'));
const AudiovisualSuccess = lazy(() => import('./pages/audiovisual/success'));
const LinkShortenerPage = lazy(() => import('./pages/LinkShortenerPage'));
const LinkRedirect = lazy(() => import('./components/LinkRedirect'));
const ReferralLanding = lazy(() => import('./pages/ReferralLanding'));
const Perfil = lazy(() => import('./pages/Perfil'));
const CadastroAtleta = lazy(() => import('./pages/CadastroAtleta'));
const CadastroJurado = lazy(() => import('./pages/CadastroJurado'));
const CadastroMidia = lazy(() => import('./pages/CadastroMidia'));
const CadastroEspectador = lazy(() => import('./pages/CadastroEspectador'));
const SetupProfile = lazy(() => import('./pages/SetupProfile'));
const SelecaoTipoCadastro = lazy(() => import('./pages/SelecaoTipoCadastro'));
const Hub = lazy(() => import('./pages/Hub'));

// Lazy load de componentes PWA
const VideoIntro = lazy(() => import('./components/VideoIntro'));
const PWAInstallPrompt = lazy(() => import('./components/PWAInstallPrompt'));
const PWAUpdatePrompt = lazy(() => import('./components/PWAUpdatePrompt'));
const CookieBanner = lazy(() => import('./components/CookieBanner'));
const DesktopWarning = lazy(() => import('./components/DesktopWarning'));
const CNHUpload = lazy(() => import('./components/CNHUpload'));

// Tipos TypeScript para PWA
interface OfflineStats {
  pendingActions: number;
  pendingGamification: number;
  lastSync: number | null;
}

interface PWAConnectionStatus {
  isOnline: boolean;
  networkType: string;
  effectiveType: string;
  downlink: number;
  rtt: number;
}

// Componente de status de conexão PWA otimizado
const PWAConnectionBar = ({ isOnline, offlineStats }: { isOnline: boolean; offlineStats: OfflineStats }) => {
  const [connectionInfo, setConnectionInfo] = useState<PWAConnectionStatus>({
    isOnline,
    networkType: 'unknown',
    effectiveType: 'unknown',
    downlink: 0,
    rtt: 0
  });

  useEffect(() => {
    const updateConnectionInfo = () => {
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      
      setConnectionInfo({
        isOnline: navigator.onLine,
        networkType: connection?.type || 'unknown',
        effectiveType: connection?.effectiveType || 'unknown',
        downlink: connection?.downlink || 0,
        rtt: connection?.rtt || 0
      });
    };

    updateConnectionInfo();
    
    const handleOnline = () => updateConnectionInfo();
    const handleOffline = () => updateConnectionInfo();
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Monitor connection changes
    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', updateConnectionInfo);
    }
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (connection) {
        connection.removeEventListener('change', updateConnectionInfo);
      }
    };
  }, []);

  if (!connectionInfo.isOnline) {
    return (
      <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-center py-2 px-4 z-[9999] shadow-lg">
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-pulse">📡</div>
          <span className="text-sm font-medium">
            Modo offline - {offlineStats.pendingActions} ações pendentes
          </span>
        </div>
      </div>
    );
  }

  if (offlineStats.pendingActions > 0) {
    return (
      <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-center py-2 px-4 z-[9999] shadow-lg">
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin">🔄</div>
          <span className="text-sm font-medium">
            Sincronizando {offlineStats.pendingActions} ações offline...
          </span>
        </div>
      </div>
    );
  }

  // Mostrar qualidade da conexão em desenvolvimento
  if (process.env.NODE_ENV === 'development' && connectionInfo.effectiveType) {
    return (
      <div className="fixed bottom-4 right-4 bg-black/80 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm z-[9999]">
        {connectionInfo.effectiveType} • {connectionInfo.downlink}Mbps
      </div>
    );
  }

  return null;
};

// Componente de layout principal otimizado para PWA
function MainLayout() {
  useRoleRedirect();
  
  const {
    isOnline,
    cacheCriticalData,
    syncInBackground,
    syncAnalytics,
    requestNotificationPermission,
    trackEvent,
    isInstallable,
    isInstalled,
  } = usePWA();
  
  const {
    syncOfflineActions,
    hasPendingActions,
    getOfflineStats,
  } = useOfflineGamification();

  const [offlineStats, setOfflineStats] = useState<OfflineStats>({
    pendingActions: 0,
    pendingGamification: 0,
    lastSync: null,
  });

  // Estados PWA específicos
  const [pwaInitialized, setPWAInitialized] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  // Função para atualizar estatísticas offline com debounce
  const updateOfflineStats = useCallback(async () => {
    try {
      const stats = await getOfflineStats();
      setOfflineStats(prevStats => {
        // Só atualizar se realmente mudou
        if (JSON.stringify(prevStats) !== JSON.stringify(stats)) {
          return stats;
        }
        return prevStats;
      });
    } catch (error) {
      console.error('❌ Erro ao verificar estatísticas offline:', error);
    }
  }, [getOfflineStats]);

  // PWA Initialization com retry logic
  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 3;
    
    const initializePWA = async () => {
      try {
        console.log('🚀 Inicializando PWA...');
        
        // Preload critical resources
        await cacheCriticalData();
        
        // Request notification permission after user interaction
        const requestPermissionDelayed = setTimeout(async () => {
          if (Notification.permission === 'default') {
            await requestNotificationPermission();
          }
        }, 5000);
        
        // Track initialization
        trackEvent('pwa_initialized', {
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
          online: navigator.onLine,
          isInstallable,
          isInstalled,
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight,
          },
          screen: {
            width: window.screen.width,
            height: window.screen.height,
          },
        });
        
        setPWAInitialized(true);
        console.log('✅ PWA inicializada com sucesso!');
        
        return () => clearTimeout(requestPermissionDelayed);
      } catch (error) {
        console.error('❌ Erro ao inicializar PWA:', error);
        
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`🔄 Tentando novamente... (${retryCount}/${maxRetries})`);
          setTimeout(initializePWA, 2000 * retryCount);
        }
      }
    };

    if (!pwaInitialized) {
      initializePWA();
    }
  }, [
    cacheCriticalData,
    requestNotificationPermission,
    trackEvent,
    isInstallable,
    isInstalled,
    pwaInitialized
  ]);

  // Background sync quando conexão é restaurada
  useEffect(() => {
    let syncInProgress = false;
    
    const handleConnectionRestored = async () => {
      if (syncInProgress || !isOnline) return;
      
      syncInProgress = true;
      const syncStartTime = Date.now();
      
      try {
        console.log('🌐 Conexão restaurada - iniciando sincronização...');
        
        const hasPending = await hasPendingActions();
        
        if (hasPending) {
          console.log('🔄 Sincronizando dados offline...');
          
          // Executar sincronizações em paralelo
          const syncPromises = [
            syncOfflineActions(),
            syncInBackground(),
            syncAnalytics()
          ];
          
          await Promise.allSettled(syncPromises);
          
          const syncDuration = Date.now() - syncStartTime;
          console.log(`✅ Sincronização concluída em ${syncDuration}ms`);
        }
        
        await updateOfflineStats();
        setLastSyncTime(new Date());
        
        trackEvent('connection_restored', {
          timestamp: Date.now(),
          syncDuration: Date.now() - syncStartTime,
          pendingActions: offlineStats.pendingActions,
          pendingGamification: offlineStats.pendingGamification,
        });
        
      } catch (error) {
        console.error('❌ Erro na sincronização:', error);
        
        trackEvent('sync_error', {
          timestamp: Date.now(),
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      } finally {
        syncInProgress = false;
      }
    };

    if (isOnline && pwaInitialized) {
      handleConnectionRestored();
    }
  }, [
    isOnline,
    pwaInitialized,
    hasPendingActions,
    syncOfflineActions,
    syncInBackground,
    syncAnalytics,
    updateOfflineStats,
    trackEvent,
    offlineStats.pendingActions,
    offlineStats.pendingGamification
  ]);

  // Periodic stats update com interval adaptativo
  useEffect(() => {
    const getUpdateInterval = () => {
      if (!isOnline) return 60000; // 1 minuto offline
      if (offlineStats.pendingActions > 0) return 10000; // 10s com ações pendentes
      return 30000; // 30s normal
    };
    
    const updateStats = () => {
      updateOfflineStats();
      setTimeout(updateStats, getUpdateInterval());
    };
    
    const initialTimeout = setTimeout(updateStats, 1000);
    
    return () => clearTimeout(initialTimeout);
  }, [updateOfflineStats, isOnline, offlineStats.pendingActions]);

  // Prefetch de recursos críticos
  useEffect(() => {
    if (pwaInitialized && isOnline) {
      // Prefetch páginas mais acessadas
      const prefetchPages = [
        () => import('./pages/index'),
        () => import('./pages/Hub'),
        () => import('./pages/Perfil'),
      ];
      
      prefetchPages.forEach(prefetch => {
        setTimeout(() => prefetch().catch(() => {}), 2000);
      });
    }
  }, [pwaInitialized, isOnline]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col antialiased">
      <PWAConnectionBar isOnline={isOnline} offlineStats={offlineStats} />
      
      <Header />
      
      <main className="flex-1 relative">
        <Outlet />
        
        {/* PWA Loading Overlay */}
        {!pwaInitialized && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-[9998]">
            <div className="bg-white rounded-lg p-6 shadow-xl">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">Inicializando PWA...</p>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
      
      {/* PWA Components */}
      <Suspense fallback={null}>
        <PWAInstallPrompt />
      </Suspense>
      <Suspense fallback={null}>
        <PWAUpdatePrompt />
      </Suspense>
      <Suspense fallback={null}>
        <CookieBanner />
      </Suspense>
      
      {/* Debug Info (Development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 bg-black/80 text-white text-xs p-2 rounded backdrop-blur-sm z-[9999] max-w-xs">
          <div>PWA: {pwaInitialized ? '✅' : '⏳'}</div>
          <div>Online: {isOnline ? '🟢' : '🔴'}</div>
          <div>Pending: {offlineStats.pendingActions}</div>
          {lastSyncTime && (
            <div>Last Sync: {lastSyncTime.toLocaleTimeString()}</div>
          )}
        </div>
      )}
    </div>
  );
}

// Componente otimizado para redirecionamento de links
const LinkRedirectWrapper = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  
  if (!shortCode) {
    return <Navigate to="/home" replace />;
  }
  
  return <LinkRedirect shortCode={shortCode} />;
};

// Componente para gerenciar avisos de desktop com PWA
const DesktopWarningHandler = ({ isMobile, isTablet }: { isMobile: boolean; isTablet: boolean }) => {
  const currentPath = window.location.pathname;
  
  const routeConfig = useMemo(() => {
    const adminRoutes = new Set([
      '/admin',
      '/dev',
      '/marketing',
      '/admin-painel',
      '/dashboard-evento'
    ]);
    
    const userRoutes = new Set([
      '/',
      '/home',
      '/hub',
      '/leaderboard',
      '/perfil',
      '/audiovisual',
      '/sobre',
      '/termos',
      '/links',
      '/selecao-cadastro',
      '/cadastro-atleta',
      '/cadastro-jurado',
      '/cadastro-midialouca',
      '/cadastro-curioso',
      '/setup-profile',
      '/audiovisual/form',
      '/audiovisual/payment',
      '/audiovisual/success',
      '/interbox/audiovisual/confirmacao'
    ]);
    
    return {
      isAdmin: adminRoutes.has(currentPath),
      isUser: userRoutes.has(currentPath) || currentPath.startsWith('/l/'),
    };
  }, [currentPath]);

  // Não mostrar aviso em dispositivos móveis
  if (isMobile || isTablet) return null;

  if (routeConfig.isAdmin) {
    return (
      <Suspense fallback={null}>
        <DesktopWarning allowAdminAccess={true} />
      </Suspense>
    );
  }

  if (routeConfig.isUser) {
    return (
      <Suspense fallback={null}>
        <DesktopWarning allowAdminAccess={false} />
      </Suspense>
    );
  }

  return null;
};

// Componente principal da aplicação
function App() {
  const { user, loading } = useAuth();
  const { isMobile, isTablet } = useMobile();
  
  // Estados para componentes especiais
  const [showVideoIntro, setShowVideoIntro] = useState(false);
  const [showCNHUpload, setShowCNHUpload] = useState(false);

  // Log de desenvolvimento
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 App State:', {
        userAuthenticated: !!user,
        loading,
        userId: user?.uid,
        userRole: user?.role,
        device: { isMobile, isTablet },
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
      });
    }
  }, [user, loading, isMobile, isTablet]);

  // Gerenciar vinheta de abertura com verificação de data
  useEffect(() => {
    if (!user) {
      setShowVideoIntro(false);
      return;
    }

    const today = new Date().toDateString();
    const lastVideoDate = localStorage.getItem('lastVideoDate');
    const shouldShowVideo = lastVideoDate !== today;

    if (process.env.NODE_ENV === 'development') {
      console.log('🎬 Video Intro Decision:', {
        user: user.email,
        today,
        lastVideoDate,
        shouldShow: shouldShowVideo,
      });
    }

    setShowVideoIntro(shouldShowVideo);
  }, [user]);

  // Gerenciar upload de CNH para admins
  useEffect(() => {
    if (user?.role === 'admin') {
      const cnhUploaded = localStorage.getItem('adminCNHUploaded');
      setShowCNHUpload(!cnhUploaded);
    } else {
      setShowCNHUpload(false);
    }
  }, [user?.role]);

  // Handlers otimizados
  const handleVideoComplete = useCallback(() => {
    console.log('🎬 Video concluído');
    localStorage.setItem('lastVideoDate', new Date().toDateString());
    setShowVideoIntro(false);
  }, []);

  const handleCNHUploadComplete = useCallback(() => {
    console.log('📄 CNH upload concluído');
    localStorage.setItem('adminCNHUploaded', 'true');
    setShowCNHUpload(false);
  }, []);

  // Router memoizado com lazy loading otimizado
  const router = useMemo(() => {
    return createBrowserRouter([
      // Rotas públicas
      {
        path: "/login",
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <LoginPage />
          </Suspense>
        ),
      },
      {
        path: "/l/:shortCode",
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <LinkRedirectWrapper />
          </Suspense>
        ),
      },
      {
        path: "/ref/:referralCode",
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <ReferralLanding />
          </Suspense>
        ),
      },
      
      // Rotas protegidas
      {
        path: "/",
        element: <MainLayout />,
        children: [
          {
            path: "",
            element: user ? (
              <Navigate to="/home" replace />
            ) : (
              <Suspense fallback={<LoadingScreen />}>
                <LoginPage />
              </Suspense>
            ),
          },
          { 
            path: "home", 
            element: (
              <ProtectedRoute>
                <Suspense fallback={<LoadingScreen />}>
                  <Home />
                </Suspense>
              </ProtectedRoute>
            ) 
          },
          { 
            path: "hub", 
            element: (
              <ProtectedRoute>
                <Suspense fallback={<LoadingScreen />}>
                  <Hub />
                </Suspense>
              </ProtectedRoute>
            ) 
          },
          { 
            path: "leaderboard", 
            element: (
              <ProtectedRoute>
                <Suspense fallback={<LoadingScreen />}>
                  <GamifiedLeaderboard />
                </Suspense>
              </ProtectedRoute>
            ) 
          },
          { 
            path: "sobre", 
            element: (
              <ProtectedRoute>
                <Suspense fallback={<LoadingScreen />}>
                  <SobrePage />
                </Suspense>
              </ProtectedRoute>
            ) 
          },
          { 
            path: "termos", 
            element: (
              <ProtectedRoute>
                <Suspense fallback={<LoadingScreen />}>
                  <Termos />
                </Suspense>
              </ProtectedRoute>
            ) 
          },
          { 
            path: "admin", 
            element: (
              <ProtectedRoute requireProfile={true} requireAdmin={true}>
                <Suspense fallback={<LoadingScreen />}>
                  <AdminDashboard />
                </Suspense>
              </ProtectedRoute>
            ) 
          },
          { 
            path: "admin-painel", 
            element: (
              <ProtectedRoute requireProfile={true} requireAdmin={true}>
                <Suspense fallback={<LoadingScreen />}>
                  <AdminPainel />
                </Suspense>
              </ProtectedRoute>
            ) 
          },
          { 
            path: "dashboard-evento", 
            element: (
              <ProtectedRoute requireProfile={true}>
                <Suspense fallback={<LoadingScreen />}>
                  <DashboardEvento />
                </Suspense>
              </ProtectedRoute>
            ) 
          },
          { 
            path: "dev", 
            element: (
              <ProtectedRoute requireProfile={true} requireDev={true}>
                <Suspense fallback={<LoadingScreen />}>
                  <DevDashboard />
                </Suspense>
              </ProtectedRoute>
            ) 
          },
          { 
            path: "marketing", 
            element: (
              <ProtectedRoute requireProfile={true} requireMarketing={true}>
                <Suspense fallback={<LoadingScreen />}>
                  <MarketingDashboard />
                </Suspense>
              </ProtectedRoute>
            ) 
          },
          { 
            path: "audiovisual", 
            element: (
              <ProtectedRoute>
                <Suspense fallback={<LoadingScreen />}>
                  <Audiovisual />
                </Suspense>
              </ProtectedRoute>
            ) 
          },
          { 
            path: "audiovisual/form", 
            element: (
              <ProtectedRoute>
                <Suspense fallback={<LoadingScreen />}>
                  <AudiovisualForm />
                </Suspense>
              </ProtectedRoute>
            ) 
          },
          { 
            path: "audiovisual/payment", 
            element: (
              <ProtectedRoute>
                <Suspense fallback={<LoadingScreen />}>
                  <AudiovisualPayment />
                </Suspense>
              </ProtectedRoute>
            ) 
          },
          { 
            path: "audiovisual/success", 
            element: (
              <ProtectedRoute>
                <Suspense fallback={<LoadingScreen />}>
                  <AudiovisualSuccess />
                </Suspense>
              </ProtectedRoute>
            ) 
          },
          { 
            path: "interbox/audiovisual/confirmacao", 
            element: (
              <ProtectedRoute>
                <Suspense fallback={<LoadingScreen />}>
                  <AudiovisualSuccess />
                </Suspense>
              </ProtectedRoute>
            ) 
          },
          { 
            path: "links", 
            element: (
              <ProtectedRoute>
                <Suspense fallback={<LoadingScreen />}>
                  <LinkShortenerPage />
                </Suspense>
              </ProtectedRoute>
            ) 
          },
          { 
            path: "selecao-cadastro", 
            element: (
              <ProtectedRoute>
                <Suspense fallback={<LoadingScreen />}>
                  <SelecaoTipoCadastro />
                </Suspense>
              </ProtectedRoute>
            ) 
          },
          { 
            path: "cadastro-atleta", 
            element: (
              <ProtectedRoute>
                <Suspense fallback={<LoadingScreen />}>
                  <CadastroAtleta />
                </Suspense>
              </ProtectedRoute>
            ) 
          },
          { 
            path: "cadastro-jurado", 
            element: (
              <ProtectedRoute>
                <Suspense fallback={<LoadingScreen />}>
                  <CadastroJurado />
                </Suspense>
              </ProtectedRoute>
            ) 
          },
          { 
            path: "cadastro-midialouca", 
            element: (
              <ProtectedRoute>
                <Suspense fallback={<LoadingScreen />}>
                  <CadastroMidia />
                </Suspense>
              </ProtectedRoute>
            ) 
          },
          { 
            path: "cadastro-curioso", 
            element: (
              <ProtectedRoute>
                <Suspense fallback={<LoadingScreen />}>
                  <CadastroEspectador />
                </Suspense>
              </ProtectedRoute>
            ) 
          },
          { 
            path: "setup-profile", 
            element: (
              <ProtectedRoute>
                <Suspense fallback={<LoadingScreen />}>
                  <SetupProfile />
                </Suspense>
              </ProtectedRoute>
            ) 
          },
          { 
            path: "perfil", 
            element: (
              <ProtectedRoute>
                <Suspense fallback={<LoadingScreen />}>
                  <Perfil />
                </Suspense>
              </ProtectedRoute>
            ) 
          },
        ],
      },
      
      // Fallback
      {
        path: "*",
        element: user ? <Navigate to="/home" replace /> : <Navigate to="/" replace />,
      },
    ], {
      future: {
        v7_relativeSplatPath: true,
      },
    });
  }, [user]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <FirebaseErrorBoundary>
      <RouterProvider router={router} />
      
      {/* Video Intro */}
      {showVideoIntro && (
        <Suspense fallback={<LoadingScreen />}>
          <VideoIntro onComplete={handleVideoComplete} />
        </Suspense>
      )}

      {/* CNH Upload */}
      {showCNHUpload && user?.uid && (
        <Suspense fallback={<LoadingScreen />}>
          <CNHUpload onComplete={handleCNHUploadComplete} userId={user.uid} />
        </Suspense>
      )}

      {/* Desktop Warning */}
      <DesktopWarningHandler isMobile={isMobile} isTablet={isTablet} />
    </FirebaseErrorBoundary>
  );
}

export default App;
