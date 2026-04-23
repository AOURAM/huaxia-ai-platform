import { useAuth } from '@/features/auth/hooks/useAuth';
import { Button } from '@/shared/components/common/Button';

export function HomeFeedPage() {
  const { user, logout } = useAuth();

  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <div className="max-w-lg rounded-3xl border border-brand-outline bg-white p-8 shadow-sm">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-brand-primary">Authenticated</p>
        <h1 className="mb-3 font-serif text-4xl">Welcome, {user?.username}</h1>
        <p className="mb-6 text-brand-on-surface/70">
          Login is wired to the real backend. Replace this stub with the actual feed next.
        </p>
        <Button onClick={logout}>Sign out</Button>
      </div>
    </main>
  );
}