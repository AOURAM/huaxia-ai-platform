import type { PropsWithChildren } from 'react';

export function AppLayout({ children }: PropsWithChildren) {
  return <div className="min-h-screen bg-brand-surface text-brand-on-surface">{children}</div>;
}