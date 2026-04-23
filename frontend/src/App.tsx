import { QueryProvider } from '@/app/providers/QueryProvider';
import { AuthProvider } from '@/app/providers/AuthProvider';
import { AppRouter } from '@/app/router';

export default function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </QueryProvider>
  );
}