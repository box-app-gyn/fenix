import { BrowserRouter as Router, Routes, Route, useParams, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { useMobile } from './hooks/useMobile';
import LoginPage from './pages/Login';
import Header from './components/Header';
import Footer from './components/Footer';
import { FirebaseErrorBoundary } from './components/FirebaseErrorBoundary';
import TempoReal from './components/TempoReal';
import GamifiedLeaderboard from './components/GamifiedLeaderboard';
import Sobre from './components/Sobre';
import AdminDashboard from './pages/AdminDashboard';
import AdminPainel from './pages/AdminPainel';
import DashboardEvento from './pages/DashboardEvento';
import Audiovisual from './pages/Audiovisual';
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
import LoginTest from './components/LoginTest';

function App() {
  const { user, loading } = useAuth();
  const { isMobile, isTablet } = useMobile();
  const [showVideoIntro, setShowVideoIntro] = useState(true);

  console.log('🔍 App.tsx - Estado atual:', { 
    user: !!user, 
    loading, 
    userId: user?.uid,
    isMobile,
    isTablet 
  });

  // Mostrar vinheta de abertura apenas na primeira visita
  useEffect(() => {
    const hasSeenIntro = localStorage.getItem('hasSeenIntro');
    if (hasSeenIntro) {
      setShowVideoIntro(false);
    }
  }, []);

  const handleVideoComplete = () => {
    localStorage.setItem('hasSeenIntro', 'true');
    setShowVideoIntro(false);
  };

  // Se não é mobile nem tablet, mostrar aviso de desktop
  if (!isMobile && !isTablet) {
    return <DesktopWarning />;
  }

  if (showVideoIntro) {
    return <VideoIntro onComplete={handleVideoComplete} />;
  }

  if (loading) {
    console.log('⏳ App.tsx - Mostrando LoadingScreen');
    return <LoadingScreen message="Conectando com Firebase..." />;
  }

  // Se não está logado, mostrar página de login
  if (!user) {
    return (
      <>
        <LoginPage />
        <CacheDebug />
        <CookieBanner />
        <LoginTest />
      </>
    );
  }

  // Se está logado mas não tem perfil completo, mostrar setup
  if (!user.profileComplete) {
    return (
      <FirebaseErrorBoundary>
        <SetupProfile />
      </FirebaseErrorBoundary>
    );
  }

  return (
    <FirebaseErrorBoundary>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              {/* Rota pública - redireciona para hub se logado */}
              <Route path="/" element={
                <ProtectedRoute requireAuth={false}>
                  <Navigate to="/hub" replace />
                </ProtectedRoute>
              } />

              {/* Rotas protegidas */}
              <Route path="/hub" element={
                <ProtectedRoute>
                  <Hub />
                </ProtectedRoute>
              } />
              
              <Route path="/tempo-real" element={
                <ProtectedRoute>
                  <TempoReal />
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
                <ProtectedRoute requireProfile={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/admin-painel" element={
                <ProtectedRoute requireProfile={true}>
                  <AdminPainel />
                </ProtectedRoute>
              } />
              
              <Route path="/dashboard-evento" element={
                <ProtectedRoute requireProfile={true}>
                  <DashboardEvento />
                </ProtectedRoute>
              } />
              
              <Route path="/audiovisual" element={
                <ProtectedRoute>
                  <Audiovisual />
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
              <Route path="*" element={<Navigate to="/hub" replace />} />
            </Routes>
          </main>
          <Footer />
          <PWAInstallPrompt />
          <PWAUpdatePrompt />
          <CacheDebug />
          <CookieBanner />
        </div>
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