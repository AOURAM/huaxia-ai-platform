import { Navigate } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { useAuth } from '@/features/auth/hooks/useAuth';

export function LoginPage() {
  const { isAuthenticated, isBootstrapping } = useAuth();

  if (!isBootstrapping && isAuthenticated) {
    return <Navigate to={ROUTES.home} replace />;
  }

  return <LoginForm />;
}