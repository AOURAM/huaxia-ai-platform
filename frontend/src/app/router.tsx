import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { OnboardingGate } from '@/app/guards/OnboardingGate';
import { ProtectedRoute } from '@/app/guards/ProtectedRoute';
import { AppLayout } from '@/app/layouts/AppLayout';
import { PublicLayout } from '@/app/layouts/PublicLayout';
import { ROUTES } from '@/constants/routes';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { RegisterPage } from '@/features/auth/pages/RegisterPage';
import { CitiesPage } from '@/features/cities/pages/CitiesPage';
import { CulturePage } from '@/features/culture/pages/CulturePage';
import { DailyLifePage } from '@/features/daily-life/pages/DailyLifePage';
import { HomeFeedPage } from '@/features/feed/pages/HomeFeedPage';
import { LandingPage } from '@/features/landing/pages/LandingPage';
import { OnboardingPage } from '@/features/onboarding/pages/OnboardingPage';
import { EditPostPage } from '@/features/posts/pages/EditPostPage';
import { PostDetailPage } from '@/features/posts/pages/PostDetailPage';
import { ProfilePage } from '@/features/profile/pages/ProfilePage';
import { SettingsPage } from '@/features/settings/pages/SettingsPage';
import { UniversitiesPage } from '@/features/universities/pages/UniversitiesPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={ROUTES.landing}
          element={
            <PublicLayout>
              <LandingPage />
            </PublicLayout>
          }
        />

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
              <OnboardingGate>
                <AppLayout>
                  <HomeFeedPage />
                </AppLayout>
              </OnboardingGate>
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.cities}
          element={
            <ProtectedRoute>
              <OnboardingGate>
                <AppLayout>
                  <CitiesPage />
                </AppLayout>
              </OnboardingGate>
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.universities}
          element={
            <ProtectedRoute>
              <OnboardingGate>
                <AppLayout>
                  <UniversitiesPage />
                </AppLayout>
              </OnboardingGate>
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.culture}
          element={
            <ProtectedRoute>
              <OnboardingGate>
                <AppLayout>
                  <CulturePage />
                </AppLayout>
              </OnboardingGate>
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.dailyLife}
          element={
            <ProtectedRoute>
              <OnboardingGate>
                <AppLayout>
                  <DailyLifePage />
                </AppLayout>
              </OnboardingGate>
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.profile}
          element={
            <ProtectedRoute>
              <OnboardingGate>
                <AppLayout>
                  <ProfilePage />
                </AppLayout>
              </OnboardingGate>
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.settings}
          element={
            <ProtectedRoute>
              <OnboardingGate>
                <AppLayout>
                  <SettingsPage />
                </AppLayout>
              </OnboardingGate>
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.postDetail}
          element={
            <ProtectedRoute>
              <OnboardingGate>
                <AppLayout>
                  <PostDetailPage />
                </AppLayout>
              </OnboardingGate>
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.postEdit}
          element={
            <ProtectedRoute>
              <OnboardingGate>
                <AppLayout>
                  <EditPostPage />
                </AppLayout>
              </OnboardingGate>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}