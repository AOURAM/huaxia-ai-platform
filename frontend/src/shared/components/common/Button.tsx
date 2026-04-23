import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  icon?: LucideIcon;
  isLoading?: boolean;
  children: ReactNode;
}

export function Button({
  className,
  variant = 'primary',
  icon: Icon,
  children,
  isLoading = false,
  ...props
}: ButtonProps) {
  const variants: Record<ButtonVariant, string> = {
    primary: 'bg-brand-primary text-white hover:bg-brand-primary-hover shadow-sm',
    secondary: 'bg-brand-neutral-soft text-brand-on-surface hover:bg-brand-outline/20',
    outline: 'border border-brand-outline text-brand-on-surface hover:bg-brand-neutral-soft',
    ghost: 'text-brand-on-surface hover:bg-brand-neutral-soft',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60',
        variants[variant],
        className,
      )}
      {...props}
    >
      {Icon ? <Icon size={18} className={isLoading ? 'animate-spin' : undefined} /> : null}
      {children}
    </button>
  );
}