import { BrowserRouter as Router, Routes, Route, useParams, Navigate } from 'react-router-dom';
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

// Componente interno que usa o hook dentro do contexto do Router
function AppContent() {
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
        <Routes>
          {/* Rota principal - redireciona para home se logado */}
          <Route path="/" element={
            <ProtectedRoute>
              <Navigate to="/home" replace />
            </ProtectedRoute>
          } />

          {/* Rota home - página principal protegida */}
          <Route path="/home" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />

          {/* Rotas protegidas */}
          <Route path="/hub" element={
            <ProtectedRoute>
              <Hub />
            </ProtectedRoute>
          } />

          <Route path="/leaderboard" element={
            <ProtectedRoute>
              <GamifiedLeaderboard />
            </ProtectedRoute>
          } />

          <Route path="/sobre" element={
            <ProtectedRoute>
              <SobrePage />
            </ProtectedRoute>
          } />

          <Route path="/termos" element={
            <ProtectedRoute>
              <Termos />
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute requireProfile={true} requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          <Route path="/admin-painel" element={
            <ProtectedRoute requireProfile={true} requireAdmin={true}>
              <AdminPainel />
            </ProtectedRoute>
          } />

          <Route path="/dashboard-evento" element={
            <ProtectedRoute requireProfile={true}>
              <DashboardEvento />
            </ProtectedRoute>
          } />

          <Route path="/dev" element={
            <ProtectedRoute requireProfile={true} requireDev={true}>
              <DevDashboard />
            </ProtectedRoute>
          } />

          <Route path="/marketing" element={
            <ProtectedRoute requireProfile={true} requireMarketing={true}>
              <MarketingDashboard />
            </ProtectedRoute>
          } />

          <Route path="/audiovisual" element={
            <ProtectedRoute>
              <Audiovisual />
            </ProtectedRoute>
          } />

          <Route path="/audiovisual/form" element={
            <ProtectedRoute>
              <AudiovisualForm />
            </ProtectedRoute>
          } />

          <Route path="/interbox/audiovisual/confirmacao" element={
            <ProtectedRoute>
              <AudiovisualSuccess />
            </ProtectedRoute>
          } />

          <Route path="/links" element={
            <ProtectedRoute>
              <LinkShortenerPage />
            </ProtectedRoute>
          } />

          <Route path="/l/:shortCode" element={
            <ProtectedRoute>
              <LinkRedirectWrapper />
            </ProtectedRoute>
          } />

          <Route path="/selecao-cadastro" element={
            <ProtectedRoute>
              <SelecaoTipoCadastro />
            </ProtectedRoute>
          } />

          <Route path="/cadastro-atleta" element={
            <ProtectedRoute>
              <CadastroAtleta />
            </ProtectedRoute>
          } />

          <Route path="/cadastro-jurado" element={
            <ProtectedRoute>
              <CadastroJurado />
            </ProtectedRoute>
          } />

          <Route path="/cadastro-midialouca" element={
            <ProtectedRoute>
              <CadastroMidia />
            </ProtectedRoute>
          } />

          <Route path="/cadastro-curioso" element={
            <ProtectedRoute>
              <CadastroEspectador />
            </ProtectedRoute>
          } />

          <Route path="/setup-profile" element={
            <ProtectedRoute>
              <SetupProfile />
            </ProtectedRoute>
          } />

          <Route path="/perfil" element={
            <ProtectedRoute>
              <Perfil />
            </ProtectedRoute>
          } />

          <Route path="/cluster" element={
            <ProtectedRoute>
              <ClusterPage />
            </ProtectedRoute>
          } />

          {/* Rota de fallback */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
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

  // Se não está logado, mostrar página de login
  if (!user) {
    return (
      <FirebaseErrorBoundary>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/audiovisual" element={<Audiovisual />} />
              <Route path="/audiovisual/form" element={<AudiovisualForm />} />
              <Route path="/audiovisual/success" element={<AudiovisualSuccess />} />
              <Route path="/l/:shortCode" element={<LinkRedirectWrapper />} />
              <Route path="/ref/:referralCode" element={<ReferralLanding />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
            <CookieBanner />
          </div>
        </Router>
      </FirebaseErrorBoundary>
    );
  }

  // Se está logado mas não tem perfil completo, mostrar setup
  if (user && !user.profileComplete) {
    return (
      <FirebaseErrorBoundary>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/setup-profile" element={<SetupProfile />} />
              <Route path="*" element={<Navigate to="/setup-profile" replace />} />
            </Routes>
          </div>
        </Router>
      </FirebaseErrorBoundary>
    );
  }

  // App principal com todas as funcionalidades
  return (
    <FirebaseErrorBoundary>
      <Router>
        <div className="min-h-screen bg-gray-50">
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

          {/* App Content */}
          <AppContent />
        </div>
      </Router>
    </FirebaseErrorBoundary>
  );
}

function LinkRedirectWrapper() {
  const { shortCode } = useParams();
  return <LinkRedirect shortCode={shortCode || ''} />;
}

export default App;
