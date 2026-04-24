import { ThumbsDown, ThumbsUp } from 'lucide-react';

interface ReactionBarProps {
  likes: number;
  dislikes: number;
  onReact: (reaction: 'like' | 'dislike') => void;
  isPending?: boolean;
}

export function ReactionBar({ likes, dislikes, onReact, isPending = false }: ReactionBarProps) {
  return (
    <div className="flex items-center gap-4 border-t border-brand-outline/50 pt-4">
      <button
        type="button"
        disabled={isPending}
        onClick={() => onReact('like')}
        className="flex items-center gap-2 text-sm font-bold text-brand-on-surface/60 transition hover:text-brand-primary disabled:opacity-50"
      >
        <ThumbsUp className="h-5 w-5" />
        {likes}
      </button>

      <button
        type="button"
        disabled={isPending}
        onClick={() => onReact('dislike')}
        className="flex items-center gap-2 text-sm font-bold text-brand-on-surface/60 transition hover:text-brand-danger disabled:opacity-50"
      >
        <ThumbsDown className="h-5 w-5" />
        {dislikes}
      </button>
    </div>
  );
}