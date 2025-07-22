import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { useAuth } from './hooks/useAuth';
import { FirebaseErrorBoundary } from './components/FirebaseErrorBoundary';
import LoadingScreen from './components/LoadingScreen';
import ProtectedRoute from './components/ProtectedRoute';
import FirebaseTest from './components/FirebaseTest';
import FirebaseDiagnostic from './components/FirebaseDiagnostic';
import PWAStandaloneTest from './components/PWAStandaloneTest';

// Componentes PWA
import PWASplash from './components/PWASplash';
import PWALoading from './components/PWALoading';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import PWAUpdatePrompt from './components/PWAUpdatePrompt';
import PWAOfflineIndicator from './components/PWAOfflineIndicator';

const LoginPage = lazy(() => import('./pages/Login'));
const Home = lazy(() => import('./pages/index'));
const Sobre = lazy(() => import('./pages/Sobre'));
const Hub = lazy(() => import('./pages/Hub'));
const Audiovisual = lazy(() => import('./pages/Audiovisual'));
const Perfil = lazy(() => import('./pages/Perfil'));
const DashboardEvento = lazy(() => import('./pages/DashboardEvento'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const DevDashboard = lazy(() => import('./pages/DevDashboard'));
const MarketingDashboard = lazy(() => import('./pages/MarketingDashboard'));

function App() {
  const { loading } = useAuth();

  const router = createBrowserRouter(
    [
      {
        path: '/login',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <LoginPage />
          </Suspense>
        ),
      },
      {
        path: '/',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: '/home',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: '/sobre',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <Sobre />
          </Suspense>
        ),
      },
      {
        path: '/hub',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingScreen />}>
              <Hub />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: '/audiovisual',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <Audiovisual />
          </Suspense>
        ),
      },
      {
        path: '/perfil',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingScreen />}>
              <Perfil />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: '/dashboard-evento',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingScreen />}>
              <DashboardEvento />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: '/admin',
        element: (
          <ProtectedRoute requireAdmin={true}>
            <Suspense fallback={<LoadingScreen />}>
              <AdminDashboard />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: '/dev',
        element: (
          <ProtectedRoute requireAdmin={true}>
            <Suspense fallback={<LoadingScreen />}>
              <DevDashboard />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: '/marketing',
        element: (
          <ProtectedRoute requireAdmin={true}>
            <Suspense fallback={<LoadingScreen />}>
              <MarketingDashboard />
            </Suspense>
          </ProtectedRoute>
        ),
      },
    ]
  );

  if (loading) return <LoadingScreen />;

  return (
    <FirebaseErrorBoundary>
      {/* Componentes PWA com estados reais */}
      <PWASplash />
      <PWALoading />
      <PWAInstallPrompt />
      <PWAUpdatePrompt />
      <PWAOfflineIndicator />
      
      {/* App principal */}
      <RouterProvider router={router} />
      
      {/* Componentes de teste apenas em desenvolvimento */}
      {import.meta.env.DEV && (
        <>
          <FirebaseTest />
          <FirebaseDiagnostic />
          <PWAStandaloneTest />
        </>
      )}
    </FirebaseErrorBoundary>
  );
}

export default App;
