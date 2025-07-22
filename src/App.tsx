import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { useAuth } from './hooks/useAuth';
import { FirebaseErrorBoundary } from './components/FirebaseErrorBoundary';
import LoadingScreen from './components/LoadingScreen';
import ProtectedRoute from './components/ProtectedRoute';

const LoginPage = lazy(() => import('./pages/Login'));
const Home = lazy(() => import('./pages/index'));
const Sobre = lazy(() => import('./pages/Sobre'));
const Hub = lazy(() => import('./pages/Hub'));
const Audiovisual = lazy(() => import('./pages/Audiovisual'));
const Perfil = lazy(() => import('./pages/Perfil'));
const DashboardEvento = lazy(() => import('./pages/DashboardEvento'));

function App() {
  const { user, loading } = useAuth();

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
    ],
    {
      future: {
        v7_relativeSplatPath: true,
      },
    }
  );

  if (loading) return <LoadingScreen />;

  return (
    <FirebaseErrorBoundary>
      <RouterProvider router={router} />
    </FirebaseErrorBoundary>
  );
}

export default App;
