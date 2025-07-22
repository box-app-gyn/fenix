import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { useAuth } from './hooks/useAuth';
import { FirebaseErrorBoundary } from './components/FirebaseErrorBoundary';
import LoadingScreen from './components/LoadingScreen';
import ProtectedRoute from './components/ProtectedRoute';
import JourneyRedirect from './components/JourneyRedirect';


// Componentes PWA
import PWASplash from './components/PWASplash';
import PWALoading from './components/PWALoading';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import PWAUpdatePrompt from './components/PWAUpdatePrompt';
import PWAOfflineIndicator from './components/PWAOfflineIndicator';

// Dev Components (lazy load only in dev)
const FirebaseTest = lazy(() => import('./components/FirebaseTest'));
const FirebaseDiagnostic = lazy(() => import('./components/FirebaseDiagnostic'));
const PWAStandaloneTest = lazy(() => import('./components/PWAStandaloneTest'));

// Pages - lazy loading otimizado
const LoginPage = lazy(() => import('./pages/Login'));
const Home = lazy(() => import('./pages/index'));
const Sobre = lazy(() => import('./pages/Sobre'));
const Hub = lazy(() => import('./pages/Hub'));
const Audiovisual = lazy(() => import('./pages/Audiovisual'));
const Perfil = lazy(() => import('./pages/Perfil'));
const DashboardEvento = lazy(() => import('./pages/DashboardEvento'));

// Admin dashboards - preload crítico
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const DevDashboard = lazy(() => import('./pages/DevDashboard'));
const MarketingDashboard = lazy(() => import('./pages/MarketingDashboard'));

// Auth-aware router factory
const createAuthRouter = (isAuthenticated: boolean) => createBrowserRouter([
  {
    path: '/login',
    element: isAuthenticated ? <Navigate to="/hub" replace /> : (
      <Suspense fallback={<LoadingScreen />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: '/', // 🔥 AQUI É ONDE A JORNADA COMEÇA
    element: (
      <ProtectedRoute>
        <JourneyRedirect />
      </ProtectedRoute>
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
    path: '/audiovisual',
    element: (
      <Suspense fallback={<LoadingScreen />}>
        <Audiovisual />
      </Suspense>
    ),
  },
  // Protected Routes
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
  // Admin Routes com roles específicas
  {
    path: '/admin',
    element: (
      <ProtectedRoute requiredRole="admin">
        <Suspense fallback={<LoadingScreen />}>
          <AdminDashboard />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/dev',
    element: (
      <ProtectedRoute requiredRole="dev">
        <Suspense fallback={<LoadingScreen />}>
          <DevDashboard />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/marketing',
    element: (
      <ProtectedRoute requiredRole="marketing">
        <Suspense fallback={<LoadingScreen />}>
          <MarketingDashboard />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  // Catch-all 404
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

function App() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <FirebaseErrorBoundary>
        <PWASplash />
        <PWAOfflineIndicator />
        <LoadingScreen />
      </FirebaseErrorBoundary>
    );
  }

  const router = createAuthRouter(isAuthenticated);

  return (
    <FirebaseErrorBoundary>
      <PWASplash />
      <PWALoading />
      <PWAInstallPrompt />
      <PWAUpdatePrompt />
      <PWAOfflineIndicator />
      
      <RouterProvider router={router} />

      <ProtectedRoute>
      <JourneyRedirect />
    </ProtectedRoute>
      
      {import.meta.env.DEV && (
        <Suspense fallback={null}>
          <FirebaseTest />
          <FirebaseDiagnostic />
          <PWAStandaloneTest />
        </Suspense>
      )}
    </FirebaseErrorBoundary>
  );
}

export default App;
