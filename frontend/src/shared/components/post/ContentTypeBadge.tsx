import { formatContentType } from '@/lib/formatters';

interface ContentTypeBadgeProps {
  type: string;
}

export function ContentTypeBadge({ type }: ContentTypeBadgeProps) {
  return (
    <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-brand-on-surface/65 ring-1 ring-brand-outline">
      {formatContentType(type)}
    </span>
  );
}