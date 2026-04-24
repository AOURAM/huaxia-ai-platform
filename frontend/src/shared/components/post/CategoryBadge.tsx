import { Sparkles } from 'lucide-react';

interface CategoryBadgeProps {
  category: string | null;
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-brand-outline bg-brand-neutral-soft px-3 py-1 text-xs font-bold text-brand-primary">
      <Sparkles className="h-3.5 w-3.5" />
      {category || 'AI pending'}
    </span>
  );
}