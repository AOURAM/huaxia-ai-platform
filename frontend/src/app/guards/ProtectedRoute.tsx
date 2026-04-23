import type { PropsWithChildren } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/features/auth/hooks/useAuth';

export function ProtectedRoute({ children }: PropsWithChildren) {
  const location = useLocation();
  const { isAuthenticated, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}