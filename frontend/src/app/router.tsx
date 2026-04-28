import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { ProtectedRoute } from '@/app/guards/ProtectedRoute';
import { AppLayout } from '@/app/layouts/AppLayout';
import { PublicLayout } from '@/app/layouts/PublicLayout';
import { ROUTES } from '@/constants/routes';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { RegisterPage } from '@/features/auth/pages/RegisterPage';
import { CitiesPage } from '@/features/cities/pages/CitiesPage';
import { HomeFeedPage } from '@/features/feed/pages/HomeFeedPage';
import { OnboardingPage } from '@/features/onboarding/pages/OnboardingPage';
import { PostDetailPage } from '@/features/posts/pages/PostDetailPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { UniversitiesPage } from '@/features/universities/pages/UniversitiesPage';
import { CulturePage } from '@/features/culture/pages/CulturePage';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={ROUTES.login} replace />} />

        <Route
          path={ROUTES.login}
          element={
            <PublicLayout>
              <LoginPage />
            </PublicLayout>
          }
        />

        <Route
          path={ROUTES.register}
          element={
            <PublicLayout>
              <RegisterPage />
            </PublicLayout>
          }
        />

        <Route
          path={ROUTES.onboarding}
          element={
            <ProtectedRoute>
              <OnboardingPage />
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.home}
          element={
            <ProtectedRoute>
              <AppLayout>
                <HomeFeedPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.cities}
          element={
            <ProtectedRoute>
              <AppLayout>
                <CitiesPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.universities}
          element={
            <ProtectedRoute>
              <AppLayout>
                <UniversitiesPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.culture}
          element={
          <ProtectedRoute>
          <AppLayout>
        <CulturePage />
      </AppLayout>
    </ProtectedRoute>
  }
/>
        <Route
          path={ROUTES.postDetail}
          element={
            <ProtectedRoute>
              <AppLayout>
                <PostDetailPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}