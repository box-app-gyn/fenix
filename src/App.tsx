import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import LoginPage from './pages/Login';
import Header from './components/Header';
import Footer from './components/Footer';
import { FirebaseErrorBoundary } from './components/FirebaseErrorBoundary';
import Hero from './components/Hero';
import TempoReal from './components/TempoReal';
import GamifiedLeaderboard from './components/GamifiedLeaderboard';
import CallToAction from './components/CallToAction';
import Sobre from './components/Sobre';
import AdminDashboard from './pages/AdminDashboard';
import Audiovisual from './pages/Audiovisual';
import LinkShortenerPage from './pages/LinkShortenerPage';
import LinkRedirect from './components/LinkRedirect';
import ClusterPage from './pages/ClusterPage';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <FirebaseErrorBoundary>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/hub" element={<HubPage />} />
              <Route path="/tempo-real" element={<TempoReal />} />
              <Route path="/leaderboard" element={<GamifiedLeaderboard />} />
              <Route path="/sobre" element={<Sobre />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/audiovisual" element={<Audiovisual />} />
              <Route path="/links" element={<LinkShortenerPage />} />
              <Route path="/l/:shortCode" element={<LinkRedirectWrapper />} />
              <Route path="/cadastro-atleta" element={<CadastroAtletaPage />} />
              <Route path="/cadastro-jurado" element={<CadastroJuradoPage />} />
              <Route path="/cadastro-midialouca" element={<CadastroMidiaPage />} />
              <Route path="/cadastro-curioso" element={<CadastroEspectadorPage />} />
              <Route path="/setup-profile" element={<SetupProfilePage />} />
              <Route path="/cluster" element={<ClusterPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </FirebaseErrorBoundary>
  );
}

// Página Principal
function HomePage() {
  return (
    <div className="min-h-screen">
      <Hero />
      <TempoReal />
      <GamifiedLeaderboard />
      <CallToAction />
      <Sobre />
    </div>
  );
}

// Hub Principal
function HubPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Hub Principal</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Tempo Real</h2>
          <p className="text-gray-600 mb-4">Acompanhe eventos em tempo real</p>
          <a href="/tempo-real" className="text-blue-600 hover:underline">Ver mais →</a>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Leaderboard</h2>
          <p className="text-gray-600 mb-4">Ranking gamificado dos participantes</p>
          <a href="/leaderboard" className="text-blue-600 hover:underline">Ver mais →</a>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Audiovisual</h2>
          <p className="text-gray-600 mb-4">Análise de conteúdo audiovisual</p>
          <a href="/audiovisual" className="text-blue-600 hover:underline">Ver mais →</a>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">🔗 Encurtador de Links</h2>
          <p className="text-gray-600 mb-4">Crie links curtos e acompanhe estatísticas</p>
          <a href="/links" className="text-blue-600 hover:underline">Ver mais →</a>
        </div>
      </div>
    </div>
  );
}

function CadastroAtletaPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Cadastro de Atleta</h1>
      <p className="text-center text-gray-600">Formulário de cadastro para atletas</p>
    </div>
  );
}

function CadastroJuradoPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Cadastro de Jurado</h1>
      <p className="text-center text-gray-600">Formulário de cadastro para jurados</p>
    </div>
  );
}

function CadastroMidiaPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Cadastro de Mídia</h1>
      <p className="text-center text-gray-600">Formulário de cadastro para mídia</p>
    </div>
  );
}

function CadastroEspectadorPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Cadastro de Espectador</h1>
      <p className="text-center text-gray-600">Formulário de cadastro para espectadores</p>
    </div>
  );
}

function SetupProfilePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Configurar Perfil</h1>
      <p className="text-center text-gray-600">Complete seu perfil</p>
    </div>
  );
}

// Wrapper para LinkRedirect que extrai o shortCode dos parâmetros da URL
function LinkRedirectWrapper() {
  const { shortCode } = useParams();
  return shortCode ? <LinkRedirect shortCode={shortCode} /> : null;
}

export default App; 