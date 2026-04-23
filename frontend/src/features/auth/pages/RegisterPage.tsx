import { Navigate } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';
import { RegisterForm } from '@/features/auth/components/RegisterForm';
import { useAuth } from '@/features/auth/hooks/useAuth';

export function RegisterPage() {
  const { isAuthenticated, isBootstrapping } = useAuth();

  if (!isBootstrapping && isAuthenticated) {
    return <Navigate to={ROUTES.home} replace />;
  }

  return <RegisterForm />;
}