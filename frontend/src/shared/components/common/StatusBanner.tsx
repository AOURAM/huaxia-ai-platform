import { cn } from '@/lib/utils';

interface StatusBannerProps {
  tone: 'error' | 'success' | 'info';
  message: string;
}

export function StatusBanner({ tone, message }: StatusBannerProps) {
  const toneClasses = {
    error: 'border-brand-danger/20 bg-brand-danger/10 text-brand-danger',
    success: 'border-brand-success/20 bg-brand-success/10 text-brand-success',
    info: 'border-brand-outline bg-brand-neutral-soft text-brand-on-surface/80',
  } as const;

  return (
    <div
      className={cn('rounded-xl border px-4 py-3 text-sm font-medium', toneClasses[tone])}
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
}