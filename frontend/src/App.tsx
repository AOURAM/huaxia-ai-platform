import { QueryProvider } from '@/app/providers/QueryProvider';
import { AuthProvider } from '@/app/providers/AuthProvider';
import { AppRouter } from '@/app/router';
import { ThemeProvider } from '@/features/settings/context/ThemeProvider';

export default function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <ThemeProvider>
          <AppRouter />
        </ThemeProvider>
      </AuthProvider>
    </QueryProvider>
  );
}