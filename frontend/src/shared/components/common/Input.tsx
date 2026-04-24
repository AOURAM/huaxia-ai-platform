import type { InputHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | null;
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      {label ? (
        <label className="ml-1 text-sm font-medium text-brand-on-surface/70">
          {label}
        </label>
      ) : null}

      <input
        className={cn(
          'rounded-xl border border-brand-outline bg-white px-4 py-3 outline-none transition-all placeholder:text-brand-on-surface/35',
          'focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20',
          error ? 'border-brand-danger focus:border-brand-danger focus:ring-brand-danger/20' : '',
          className,
        )}
        {...props}
      />

      {error ? <span className="ml-1 text-xs text-brand-danger">{error}</span> : null}
    </div>
  );
}