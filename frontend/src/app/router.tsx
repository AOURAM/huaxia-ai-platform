import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { ProtectedRoute } from '@/app/guards/ProtectedRoute';
import { AppLayout } from '@/app/layouts/AppLayout';
import { PublicLayout } from '@/app/layouts/PublicLayout';
import { ROUTES } from '@/constants/routes';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { RegisterPage } from '@/features/auth/pages/RegisterPage';
import { HomeFeedPage } from '@/features/feed/pages/HomeFeedPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

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
          path={ROUTES.home}
          element={
            <ProtectedRoute>
              <AppLayout>
                <HomeFeedPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}