import { Flame } from 'lucide-react';

import { formatPageName } from '@/lib/formatters';
import { useTopPosts } from '@/features/feed/hooks/useTopPosts';

export function TopPostsPanel() {
  const { data, isLoading, isError } = useTopPosts();

  return (
    <aside className="hidden w-80 shrink-0 space-y-6 lg:block">
      <section className="sticky top-24 rounded-xl border border-brand-outline bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center gap-2 border-b border-brand-outline/40 pb-4">
          <Flame className="h-5 w-5 text-brand-primary" />
          <h3 className="font-serif text-xl font-bold">Top discussions</h3>
        </div>

        {isLoading ? (
          <p className="text-sm text-brand-on-surface/60">Loading top posts...</p>
        ) : null}

        {isError ? (
          <p className="text-sm text-brand-danger">Could not load top posts.</p>
        ) : null}

        <div className="space-y-5">
          {data?.results.map((post) => (
            <div key={post.id} className="group cursor-pointer">
              <div className="mb-1 text-[11px] font-bold uppercase tracking-wider text-brand-on-surface/45">
                {formatPageName(post.page_name)} • {post.content_type}
              </div>
              <h4 className="text-sm font-bold leading-snug text-brand-on-surface transition group-hover:text-brand-primary">
                {post.title}
              </h4>
              <p className="mt-1 text-xs text-brand-on-surface/55">
                {post.likes_count} likes • score {post.top_score}
              </p>
            </div>
          ))}
        </div>
      </section>
    </aside>
  );
}