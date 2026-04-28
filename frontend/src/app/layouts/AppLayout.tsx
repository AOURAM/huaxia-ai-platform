import type { PropsWithChildren } from 'react';

import { Header } from '@/shared/components/navigation/Header';

export function AppLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-brand-surface text-brand-on-surface">
      <Header />
      {children}
    </div>
  );
}