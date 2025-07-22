// src/components/SmartAuthGuard.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingScreen from './LoadingScreen';

interface SmartAuthGuardProps {
  children: React.ReactNode;
}

export default function SmartAuthGuard({ children }: SmartAuthGuardProps) {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <LoadingScreen message="Verificando acesso..." />;
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
