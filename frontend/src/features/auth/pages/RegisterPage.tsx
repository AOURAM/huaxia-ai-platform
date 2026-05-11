import { Navigate } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';
import { RegisterForm } from '@/features/auth/components/RegisterForm';
import { useAuth } from '@/features/auth/hooks/useAuth';

export function RegisterPage() {
  const { isAuthenticated, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-neutral-soft text-sm font-bold text-brand-on-surface/55">
        Loading...
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={ROUTES.onboarding} replace />;
  }

  return <RegisterForm />;
}