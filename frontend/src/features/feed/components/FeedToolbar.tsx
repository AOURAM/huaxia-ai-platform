import { Search, SlidersHorizontal } from 'lucide-react';
import type { FormEvent } from 'react';

interface FeedToolbarProps {
  query: string;
  onQueryChange: (value: string) => void;
  onSearch: () => void;
  isSearching: boolean;
}

export function FeedToolbar({ query, onQueryChange, onSearch, isSearching }: FeedToolbarProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-on-surface/45" />

      <input
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Search student questions, city tips, university life..."
        className="w-full rounded-xl border border-brand-outline bg-brand-neutral-soft py-4 pl-12 pr-14 outline-none transition focus:border-brand-primary focus:bg-white focus:ring-2 focus:ring-brand-primary/10"
      />

      <button
        type="submit"
        disabled={isSearching}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-white p-2 text-brand-on-surface/60 transition hover:text-brand-primary disabled:opacity-50"
      >
        <SlidersHorizontal className="h-5 w-5" />
      </button>
    </form>
  );
}