import { createBrowserRouter, RouterProvider, useParams, Navigate, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { useMobile } from './hooks/useMobile';
import { usePWA } from './hooks/usePWA';
import { useOfflineGamification } from './utils/offlineGamification';
import LoginPage from './pages/Login';
import Home from './pages/index';
import Header from './components/Header';
import Footer from './components/Footer';
import { FirebaseErrorBoundary } from './components/FirebaseErrorBoundary';

import GamifiedLeaderboard from './components/GamifiedLeaderboard';
import SobrePage from './pages/Sobre';
import Termos from './pages/Termos';
import AdminDashboard from './pages/AdminDashboard';
import AdminPainel from './pages/AdminPainel';
import DashboardEvento from './pages/DashboardEvento';
import DevDashboard from './pages/DevDashboard';
import MarketingDashboard from './pages/MarketingDashboard';
import Audiovisual from './pages/Audiovisual';
import AudiovisualForm from './pages/audiovisual/form';
import AudiovisualPayment from './pages/audiovisual/payment';
import AudiovisualSuccess from './pages/audiovisual/success';
import LinkShortenerPage from './pages/LinkShortenerPage';
import LinkRedirect from './components/LinkRedirect';
import ReferralLanding from './pages/ReferralLanding';
import ClusterPage from './pages/ClusterPage';
import Perfil from './pages/Perfil';
import CadastroAtleta from './pages/CadastroAtleta';
import CadastroJurado from './pages/CadastroJurado';
import CadastroMidia from './pages/CadastroMidia';
import CadastroEspectador from './pages/CadastroEspectador';
import SetupProfile from './pages/SetupProfile';
import SelecaoTipoCadastro from './pages/SelecaoTipoCadastro';
import Hub from './pages/Hub';
import VideoIntro from './components/VideoIntro';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import PWAUpdatePrompt from './components/PWAUpdatePrompt';
import CacheDebug from './components/CacheDebug';
import CookieBanner from './components/CookieBanner';
import LoadingScreen from './components/LoadingScreen';
import DesktopWarning from './components/DesktopWarning';
import ProtectedRoute from './components/ProtectedRoute';
import CNHUpload from './components/CNHUpload';
import { useRoleRedirect } from './hooks/useRoleRedirect';


// Componente de layout principal que inclui Header, Footer e outros componentes
function MainLayout() {
  useRoleRedirect();
  
  // PWA hooks
  const {
    isOnline,
    cacheCriticalData,
    syncInBackground,
    syncAnalytics,
    requestNotificationPermission,
    trackEvent,
  } = usePWA();
  
  const {
    syncOfflineActions,
    hasPendingActions,
    getOfflineStats,
  } = useOfflineGamification();

  const [offlineStats, setOfflineStats] = useState({
    pendingActions: 0,
    pendingGamification: 0,
    lastSync: null as number | null,
  });

  // Inicialização PWA
  useEffect(() => {
    const initializePWA = async () => {
      try {
        // Cachear dados críticos
        await cacheCriticalData();
        
        // Solicitar permissão de notificação
        if (Notification.permission === 'default') {
          setTimeout(async () => {
            await requestNotificationPermission();
          }, 5000); // 5 segundos após carregamento
        }
        
        // Track inicialização
        trackEvent('app_initialized', {
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
          online: navigator.onLine,
        });
        
        console.log('🚀 PWA inicializada com sucesso!');
      } catch (error) {
        console.error('❌ Erro ao inicializar PWA:', error);
      }
    };

    initializePWA();
  }, [cacheCriticalData, requestNotificationPermission, trackEvent]);

  // Monitorar mudanças de conectividade
  useEffect(() => {
    const handleOnline = async () => {
      console.log('🌐 Conexão restaurada - sincronizando dados...');
      
      try {
        // Verificar se há ações offline pendentes
        const hasPending = await hasPendingActions();
        if (hasPending) {
          console.log('🔄 Sincronizando ações offline...');
          await syncOfflineActions();
          await syncInBackground();
          await syncAnalytics();
        }
        
        // Atualizar estatísticas
        const stats = await getOfflineStats();
        setOfflineStats(stats);
        
        trackEvent('connection_restored', {
          timestamp: Date.now(),
          pendingActions: stats.pendingActions,
          pendingGamification: stats.pendingGamification,
        });
      } catch (error) {
        console.error('❌ Erro ao sincronizar dados:', error);
      }
    };

    if (isOnline) {
      handleOnline();
    }
  }, [isOnline, syncOfflineActions, syncInBackground, syncAnalytics, hasPendingActions, getOfflineStats, trackEvent]);

  // Verificar estatísticas offline periodicamente
  useEffect(() => {
    const checkOfflineStats = async () => {
      try {
        const stats = await getOfflineStats();
        setOfflineStats(stats);
      } catch (error) {
        console.error('❌ Erro ao verificar estatísticas offline:', error);
      }
    };

    checkOfflineStats();
    const interval = setInterval(checkOfflineStats, 30000); // 30s
    
    return () => clearInterval(interval);
  }, [getOfflineStats]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Indicador de status offline */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-black text-center py-2 px-4 z-50">
          <span className="text-sm font-medium">
            📡 Modo offline - {offlineStats.pendingActions} ações pendentes
          </span>
        </div>
      )}

      {/* Indicador de ações offline pendentes */}
      {isOnline && offlineStats.pendingActions > 0 && (
        <div className="fixed top-0 left-0 right-0 bg-blue-500 text-white text-center py-2 px-4 z-50">
          <span className="text-sm font-medium">
            🔄 Sincronizando {offlineStats.pendingActions} ações offline...
          </span>
        </div>
      )}

      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <PWAInstallPrompt />
      <PWAUpdatePrompt />
      <CacheDebug />
      <CookieBanner />

    </div>
  );
}

function App() {
  const { user, loading } = useAuth();
  const { isMobile, isTablet } = useMobile();
  const [showVideoIntro, setShowVideoIntro] = useState(true);
  const [showCNHUpload, setShowCNHUpload] = useState(false);

  console.log('🔍 App.tsx - Estado atual:', {
    user: !!user,
    loading,
    userId: user?.uid,
    isMobile,
    isTablet,
  });

  // Mostrar vinheta de abertura apenas no primeiro acesso do dia após login confirmado
  useEffect(() => {
    if (!user) {
      // Se não está logado, não mostrar vídeo
      setShowVideoIntro(false);
      return;
    }

    // Verificar se já viu o vídeo hoje
    const today = new Date().toDateString();
    const lastVideoDate = localStorage.getItem('lastVideoDate');
    const hasSeenVideoToday = lastVideoDate === today;

    console.log('🎬 Video Intro Check:', {
      user: user?.email,
      today,
      lastVideoDate,
      hasSeenVideoToday,
      willShow: !hasSeenVideoToday,
    });

    if (!hasSeenVideoToday) {
      // Primeiro acesso do dia - mostrar vídeo
      setShowVideoIntro(true);
    } else {
      // Já viu o vídeo hoje - não mostrar
      setShowVideoIntro(false);
    }
  }, [user]);

  // Verificar se precisa fazer upload da CNH (apenas para os 2 primeiros admins)
  useEffect(() => {
    if (user && user.role === 'admin') {
      const adminCNHUploaded = localStorage.getItem('adminCNHUploaded');
      if (!adminCNHUploaded) {
        setShowCNHUpload(true);
      }
    }
  }, [user]);

  const handleVideoComplete = () => {
    console.log('🎬 Video Intro - Completo');
    
    // Marcar que viu o vídeo hoje
    const today = new Date().toDateString();
    localStorage.setItem('lastVideoDate', today);
    
    setShowVideoIntro(false);
  };

  const handleCNHUploadComplete = () => {
    console.log('📄 CNH Upload - Completo');
    localStorage.setItem('adminCNHUploaded', 'true');
    setShowCNHUpload(false);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  // Router único com todas as rotas
  const router = createBrowserRouter([
    // Rotas públicas (acessíveis sem login)
    { path: "/", element: <LoginPage /> },
    { path: "/login", element: <LoginPage /> },
    { path: "/audiovisual", element: <Audiovisual /> },
    { path: "/audiovisual/form", element: <AudiovisualForm /> },
    { path: "/audiovisual/success", element: <AudiovisualSuccess /> },
    { path: "/l/:shortCode", element: <LinkRedirectWrapper /> },
    { path: "/ref/:referralCode", element: <ReferralLanding /> },
    
    // Rotas protegidas (requerem login)
    {
      path: "/",
      element: <MainLayout />,
      children: [
        { path: "home", element: <ProtectedRoute><Home /></ProtectedRoute> },
        { path: "hub", element: <ProtectedRoute><Hub /></ProtectedRoute> },
        { path: "leaderboard", element: <ProtectedRoute><GamifiedLeaderboard /></ProtectedRoute> },
        { path: "sobre", element: <ProtectedRoute><SobrePage /></ProtectedRoute> },
        { path: "termos", element: <ProtectedRoute><Termos /></ProtectedRoute> },
        { path: "admin", element: <ProtectedRoute requireProfile={true} requireAdmin={true}><AdminDashboard /></ProtectedRoute> },
        { path: "admin-painel", element: <ProtectedRoute requireProfile={true} requireAdmin={true}><AdminPainel /></ProtectedRoute> },
        { path: "dashboard-evento", element: <ProtectedRoute requireProfile={true}><DashboardEvento /></ProtectedRoute> },
        { path: "dev", element: <ProtectedRoute requireProfile={true} requireDev={true}><DevDashboard /></ProtectedRoute> },
        { path: "marketing", element: <ProtectedRoute requireProfile={true} requireMarketing={true}><MarketingDashboard /></ProtectedRoute> },
        { path: "audiovisual", element: <ProtectedRoute><Audiovisual /></ProtectedRoute> },
        { path: "audiovisual/form", element: <ProtectedRoute><AudiovisualForm /></ProtectedRoute> },
        { path: "audiovisual/payment", element: <ProtectedRoute><AudiovisualPayment /></ProtectedRoute> },
        { path: "interbox/audiovisual/confirmacao", element: <ProtectedRoute><AudiovisualSuccess /></ProtectedRoute> },
        { path: "links", element: <ProtectedRoute><LinkShortenerPage /></ProtectedRoute> },
        { path: "l/:shortCode", element: <ProtectedRoute><LinkRedirectWrapper /></ProtectedRoute> },
        { path: "selecao-cadastro", element: <ProtectedRoute><SelecaoTipoCadastro /></ProtectedRoute> },
        { path: "cadastro-atleta", element: <ProtectedRoute><CadastroAtleta /></ProtectedRoute> },
        { path: "cadastro-jurado", element: <ProtectedRoute><CadastroJurado /></ProtectedRoute> },
        { path: "cadastro-midialouca", element: <ProtectedRoute><CadastroMidia /></ProtectedRoute> },
        { path: "cadastro-curioso", element: <ProtectedRoute><CadastroEspectador /></ProtectedRoute> },
        { path: "setup-profile", element: <ProtectedRoute><SetupProfile /></ProtectedRoute> },
        { path: "perfil", element: <ProtectedRoute><Perfil /></ProtectedRoute> },
        { path: "cluster", element: <ProtectedRoute><ClusterPage /></ProtectedRoute> },
      ]
    },
    
    // Fallback - redirecionar para login se não logado, ou para hub se logado
    { 
      path: "*", 
      element: user ? <Navigate to="/hub" replace /> : <Navigate to="/" replace /> 
    },
  ], { 
    future: {
      v7_relativeSplatPath: true
    }
  });

  return (
    <FirebaseErrorBoundary>
      <RouterProvider router={router} />
      {/* Video Intro */}
      {showVideoIntro && (
        <VideoIntro onComplete={handleVideoComplete} />
      )}

      {/* CNH Upload para admins */}
      {showCNHUpload && (
        <CNHUpload onComplete={handleCNHUploadComplete} userId={user?.uid || ''} />
      )}

      {/* Desktop Warning */}
      {!isMobile && !isTablet && (
        <DesktopWarning />
      )}
    </FirebaseErrorBoundary>
  );
}

function LinkRedirectWrapper() {
  const { shortCode } = useParams();
  return <LinkRedirect shortCode={shortCode || ''} />;
}

export default App;
