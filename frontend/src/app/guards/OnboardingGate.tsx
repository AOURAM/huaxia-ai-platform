import { type PropsWithChildren, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { getOnboarding } from '@/api/onboarding';
import { ROUTES } from '@/constants/routes';
import { ApiError } from '@/lib/http';

type OnboardingStatus = 'checking' | 'required' | 'complete';

export function OnboardingGate({ children }: PropsWithChildren) {
  const location = useLocation();
  const [status, setStatus] = useState<OnboardingStatus>('checking');

  useEffect(() => {
    let isMounted = true;

    const checkOnboarding = async () => {
      try {
        const onboarding = await getOnboarding();

        if (!isMounted) {
          return;
        }

        setStatus(onboarding.completed || onboarding.skipped ? 'complete' : 'required');
      } catch (error) {
        if (!isMounted) {
          return;
        }

        if (error instanceof ApiError && error.status === 404) {
          setStatus('required');
          return;
        }

        /*
          Do not destroy the app if the onboarding check fails because of a temporary backend issue.
          Auth is already handled by ProtectedRoute. This only controls the first-time onboarding flow.
        */
        setStatus('complete');
      }
    };

    void checkOnboarding();

    return () => {
      isMounted = false;
    };
  }, [location.pathname]);

  if (status === 'checking') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-surface px-6 text-brand-on-surface">
        <div className="rounded-2xl border border-brand-outline/50 bg-white/75 px-6 py-5 text-center shadow-sm">
          <p className="text-sm font-black text-brand-primary">Loading Huaxia...</p>
          <p className="mt-1 text-sm font-semibold text-brand-on-surface/55">
            Checking your onboarding status
          </p>
        </div>
      </div>
    );
  }

  if (status === 'required') {
    return <Navigate to={ROUTES.onboarding} replace state={{ from: location }} />;
  }

  return <>{children}</>;
}