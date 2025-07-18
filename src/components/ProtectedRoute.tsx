import React from 'react';
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

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return <LoadingScreen message="Verificando autenticação..." />;
  }

  // Se não requer autenticação, renderiza normalmente
  if (!requireAuth) {
    return <>{children}</>;
  }

  // Se requer autenticação mas não há usuário, redireciona para login
  if (!user) {
    console.log('🚫 ProtectedRoute: Usuário não autenticado, redirecionando para:', redirectTo);
    return <Navigate to={redirectTo} replace />;
  }

  // Se requer perfil completo mas o perfil não está completo
  if (requireProfile && !user.profileComplete) {
    console.log('⚠️ ProtectedRoute: Perfil incompleto, redirecionando para setup');
    return <Navigate to="/setup-profile" replace />;
  }

  // Se requer admin mas o usuário não é admin
  if (requireAdmin && user.role !== 'admin') {
    console.log('🚫 ProtectedRoute: Acesso negado - requer admin, redirecionando para /');
    return <Navigate to="/" replace />;
  }

  // Se requer dev mas o usuário não é dev
  if (requireDev && user.role !== 'dev') {
    console.log('🚫 ProtectedRoute: Acesso negado - requer dev, redirecionando para /');
    return <Navigate to="/" replace />;
  }

  // Se requer marketing mas o usuário não é marketing
  if (requireMarketing && user.role !== 'marketing') {
    console.log('🚫 ProtectedRoute: Acesso negado - requer marketing, redirecionando para /');
    return <Navigate to="/" replace />;
  }

  // Todas as verificações passaram, renderizar o conteúdo
  console.log('✅ ProtectedRoute: Acesso permitido');
  return <>{children}</>;
}
