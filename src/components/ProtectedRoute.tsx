import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingScreen from './LoadingScreen';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireProfile?: boolean;
  requireAdmin?: boolean;
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  requireAuth = true, 
  requireProfile = false,
  requireAdmin = false,
  redirectTo = '/'
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen message="Verificando autenticação..." />;
  }

  // Se não requer autenticação, renderiza normalmente
  if (!requireAuth) {
    return <>{children}</>;
  }

  // Se requer autenticação mas não há usuário, redireciona para login
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  // Se requer perfil completo mas o perfil não está completo
  if (requireProfile && !user.profileComplete) {
    return <Navigate to="/setup-profile" replace />;
  }

  // Se requer admin mas o usuário não é admin
  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
} 