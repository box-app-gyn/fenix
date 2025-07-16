import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingScreen from './LoadingScreen';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireProfile?: boolean;
  requireAdmin?: boolean;
  requireDev?: boolean;
  requireMarketing?: boolean;
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  requireAuth = true,
  requireProfile = false,
  requireAdmin = false,
  requireDev = false,
  requireMarketing = false,
  redirectTo = '/',
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
  // NOTA: Não redirecionamos automaticamente aqui para permitir que useRoleRedirect controle o fluxo
  if (requireProfile && !user.profileComplete) {
    console.log('⚠️ ProtectedRoute: Perfil incompleto, mas permitindo renderização para useRoleRedirect controlar');
    // Retornamos children para permitir que o useRoleRedirect faça o redirecionamento apropriado
    return <>{children}</>;
  }

  // Se requer admin mas o usuário não é admin
  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Se requer dev mas o usuário não é dev
  if (requireDev && user.role !== 'dev') {
    return <Navigate to="/" replace />;
  }

  // Se requer marketing mas o usuário não é marketing
  if (requireMarketing && user.role !== 'marketing') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
