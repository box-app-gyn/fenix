import { BrowserRouter as Router, Routes, Route, useParams, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { useMobile } from './hooks/useMobile';
import LoginPage from './pages/Login';
import Home from './pages/index';
import Header from './components/Header';
import Footer from './components/Footer';
import { FirebaseErrorBoundary } from './components/FirebaseErrorBoundary';

import GamifiedLeaderboard from './components/GamifiedLeaderboard';
import Sobre from './components/Sobre';
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
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
              <Sobre />
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

  const handleVideoComplete = () => {
    // Marcar que viu o vídeo hoje
    const today = new Date().toDateString();
    localStorage.setItem('lastVideoDate', today);
    console.log('✅ Video Intro Completed:', { user: user?.email, date: today });
    setShowVideoIntro(false);
  };

  // Verificar se está tentando acessar um dashboard administrativo ou formulário audiovisual
  const isAdminRoute = window.location.pathname === '/admin'
                      || window.location.pathname === '/dev'
                      || window.location.pathname === '/marketing'
                      || window.location.pathname === '/admin-painel'
                      || window.location.pathname === '/dashboard-evento'
                      || window.location.pathname === '/audiovisual/form';

  // Se não é mobile nem tablet, mostrar aviso de desktop
  if (!isMobile && !isTablet) {
    if (window.location.pathname === '/audiovisual/form') {
      // Para formulário audiovisual, mostrar versão específica
      return <DesktopWarning isAudiovisualForm={true} />;
    } else if (isAdminRoute) {
      // Para rotas administrativas, mostrar versão que permite acesso
      return <DesktopWarning allowAdminAccess={true} />;
    } else {
      // Para outras rotas, mostrar aviso de acesso mobile exclusivo
      return <DesktopWarning allowAdminAccess={false} />;
    }
  }

  if (loading) {
    console.log('⏳ App.tsx - Mostrando LoadingScreen');
    return <LoadingScreen message="Conectando com Firebase..." />;
  }

  // Verificar se admin precisa fazer upload de CNH
  if (user && user.adminVerification?.required && !showCNHUpload) {
    setShowCNHUpload(true);
  }

  // Mostrar upload de CNH se necessário
  if (user && showCNHUpload && user.adminVerification?.required) {
    return (
      <CNHUpload
        userId={user.uid}
        onComplete={() => {
          setShowCNHUpload(false);
          // Recarregar dados do usuário
          window.location.reload();
        }}
      />
    );
  }

  // Mostrar vídeo de intro apenas para usuários logados no primeiro acesso do dia
  if (user && showVideoIntro) {
    return <VideoIntro onComplete={handleVideoComplete} />;
  }

  // Se não está logado, redirecionar para login
  if (!user) {
    return (
      <>
        <Router>
          <Routes>
            {/* Redirecionar tudo para login se não estiver logado */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/home" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/hub" element={<Navigate to="/login" replace />} />
            <Route path="/leaderboard" element={<Navigate to="/login" replace />} />
            <Route path="/sobre" element={<Navigate to="/login" replace />} />
            <Route path="/admin" element={<Navigate to="/login" replace />} />
            <Route path="/admin-painel" element={<Navigate to="/login" replace />} />
            <Route path="/dashboard-evento" element={<Navigate to="/login" replace />} />
            <Route path="/dev" element={<Navigate to="/login" replace />} />
            <Route path="/marketing" element={<Navigate to="/login" replace />} />
            <Route path="/audiovisual" element={<Navigate to="/login" replace />} />
            <Route path="/links" element={<Navigate to="/login" replace />} />
            <Route path="/l/:shortCode" element={<LinkRedirectWrapper />} />
            <Route path="/selecao-cadastro" element={<Navigate to="/login" replace />} />
            <Route path="/cadastro-atleta" element={<Navigate to="/login" replace />} />
            <Route path="/cadastro-jurado" element={<Navigate to="/login" replace />} />
            <Route path="/cadastro-midialouca" element={<Navigate to="/login" replace />} />
            <Route path="/cadastro-curioso" element={<Navigate to="/login" replace />} />
            <Route path="/setup-profile" element={<Navigate to="/login" replace />} />
            <Route path="/perfil" element={<Navigate to="/login" replace />} />
            <Route path="/cluster" element={<Navigate to="/login" replace />} />

            {/* Fallback para login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
        <CacheDebug />
        <CookieBanner />
      </>
    );
  }

  // O hook useRoleRedirect agora controla o fluxo de redirecionamento
  // Não precisamos mais da lógica hardcoded aqui

  return (
    <FirebaseErrorBoundary>
      <Router>
        <AppContent />
      </Router>
    </FirebaseErrorBoundary>
  );
}

// Wrapper para LinkRedirect que extrai o shortCode dos parâmetros da URL
function LinkRedirectWrapper() {
  const { shortCode } = useParams();
  return shortCode ? <LinkRedirect shortCode={shortCode} /> : null;
}

export default App;
