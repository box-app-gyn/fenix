import React, { useMemo } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingScreen from './LoadingScreen';

type UserRole = 'publico' | 'admin' | 'dev' | 'marketing';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireProfile?: boolean;
  requiredRole?: UserRole;
  allowedRoles?: UserRole[];
  requireAdmin?: boolean; // Deprecated - usar requiredRole
  requireDev?: boolean; // Deprecated - usar requiredRole  
  requireMarketing?: boolean; // Deprecated - usar requiredRole
  redirectTo?: string;
  fallbackMessage?: string;
}

export default function ProtectedRoute({
  children,
  requireAuth = true,
  requireProfile = false,
  requiredRole,
  allowedRoles,
  requireAdmin = false,
  requireDev = false,
  requireMarketing = false,
  redirectTo,
  fallbackMessage = "Verificando autenticação...",
}: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Determina redirect dinâmico baseado na situação
  const dynamicRedirectTo = useMemo(() => {
    if (redirectTo) return redirectTo;
    
    // Se não está autenticado, vai para login com state para voltar
    if (!isAuthenticated) {
      return `/login?redirect=${encodeURIComponent(location.pathname + location.search)}`;
    }
    
    // Se é problema de role/permission, vai para home
    return '/home';
  }, [redirectTo, isAuthenticated, location]);

  // Memoiza verificação de roles para performance
  const roleCheck = useMemo(() => {
    if (!user) return { hasAccess: false, reason: 'no_user' };

    // Backward compatibility com props antigas
    if (requireAdmin && user.role !== 'admin') {
      return { hasAccess: false, reason: 'require_admin' };
    }
    if (requireDev && user.role !== 'dev') {
      return { hasAccess: false, reason: 'require_dev' };
    }
    if (requireMarketing && user.role !== 'marketing') {
      return { hasAccess: false, reason: 'require_marketing' };
    }

    // Nova lógica com requiredRole
    if (requiredRole && user.role !== requiredRole) {
      return { hasAccess: false, reason: `require_${requiredRole}` };
    }

    // Nova lógica com allowedRoles (mais flexível)
    if (allowedRoles && !allowedRoles.includes(user.role as UserRole)) {
      return { hasAccess: false, reason: `not_in_allowed_roles` };
    }

    return { hasAccess: true, reason: 'authorized' };
  }, [user, requireAdmin, requireDev, requireMarketing, requiredRole, allowedRoles]);

  // Loading state com timeout de segurança
  if (loading) {
    return <LoadingScreen message={fallbackMessage} />;
  }

  // Se não requer autenticação, renderiza normalmente
  if (!requireAuth) {
    return <>{children}</>;
  }

  // Verificação de autenticação
  if (!isAuthenticated || !user) {
    console.log('🚫 ProtectedRoute: Usuário não autenticado', {
      path: location.pathname,
      redirectTo: dynamicRedirectTo
    });
    return <Navigate 
      to={dynamicRedirectTo} 
      replace 
      state={{ from: location.pathname }} 
    />;
  }

  // Verificação de perfil completo
  if (requireProfile && !user.profileComplete) {
    console.log('⚠️ ProtectedRoute: Perfil incompleto', {
      user: user.email,
      path: location.pathname
    });
    return <Navigate 
      to="/setup-profile" 
      replace 
      state={{ from: location.pathname }} 
    />;
  }

  // Verificação de roles
  if (!roleCheck.hasAccess) {
    console.log('🚫 ProtectedRoute: Acesso negado', {
      user: user.email,
      userRole: user.role,
      reason: roleCheck.reason,
      path: location.pathname,
      redirectTo: dynamicRedirectTo
    });
    
    return <Navigate 
      to={dynamicRedirectTo} 
      replace 
      state={{ 
        from: location.pathname,
        error: 'insufficient_permissions',
        requiredRole: requiredRole || (requireAdmin ? 'admin' : requireDev ? 'dev' : 'marketing')
      }} 
    />;
  }

  // Verificação adicional para usuários inativos
  if (user.isActive === false) {
    console.log('🚫 ProtectedRoute: Usuário inativo', {
      user: user.email,
      path: location.pathname
    });
    return <Navigate 
      to="/account-suspended" 
      replace 
      state={{ from: location.pathname }} 
    />;
  }

  // Todas as verificações passaram
  console.log('✅ ProtectedRoute: Acesso autorizado', {
    user: user.email,
    role: user.role,
    path: location.pathname,
    profileComplete: user.profileComplete
  });

  return <>{children}</>;
}

// Hook auxiliar para componentes que precisam verificar permissões
export function usePermissions() {
  const { user } = useAuth();

  return {
    isAdmin: user?.role === 'admin',
    isDev: user?.role === 'dev',
    isMarketing: user?.role === 'marketing',
    isPublic: user?.role === 'publico',
    hasRole: (role: UserRole) => user?.role === role,
    hasAnyRole: (roles: UserRole[]) => roles.includes(user?.role as UserRole),
    canAccess: (requiredRole: UserRole) => {
      if (!user) return false;
      // Admin tem acesso a tudo
      if (user.role === 'admin') return true;
      return user.role === requiredRole;
    }
  };
}