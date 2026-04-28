import { Flame } from 'lucide-react';
import { Link } from 'react-router-dom';

import { buildPostDetailRoute } from '@/constants/routes';
import { useTopPosts } from '@/features/feed/hooks/useTopPosts';
import { formatPageName } from '@/lib/formatters';

export function TopPostsPanel() {
  const { data, isLoading, isError } = useTopPosts();

  const topPosts = data?.results ?? [];

  return (
    <aside className="hidden w-80 shrink-0 xl:block">
      <section className="sticky top-24 rounded-xl border border-brand-outline bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center gap-2 border-b border-brand-outline/40 pb-4">
          <Flame className="h-5 w-5 text-brand-primary" />
          <h3 className="font-serif text-xl font-bold text-brand-on-surface">
            Top discussions
          </h3>
        </div>

        {isLoading ? (
          <p className="text-sm text-brand-on-surface/60">Loading top posts...</p>
        ) : null}

        {isError ? (
          <p className="text-sm text-brand-danger">Could not load top posts.</p>
        ) : null}

        {!isLoading && !isError && topPosts.length === 0 ? (
          <p className="text-sm text-brand-on-surface/60">No top discussions yet.</p>
        ) : null}

        {!isLoading && !isError && topPosts.length > 0 ? (
          <div className="space-y-5">
            {topPosts.map((post) => (
              <Link
                key={post.id}
                to={buildPostDetailRoute(post.id)}
                className="group block rounded-xl p-2 transition hover:bg-brand-neutral-soft"
              >
                <div className="mb-1 text-[11px] font-bold uppercase tracking-wider text-brand-on-surface/45">
                  {formatPageName(post.page_name)} • {post.content_type}
                </div>

                <h4 className="text-sm font-bold leading-snug text-brand-on-surface transition group-hover:text-brand-primary">
                  {post.title}
                </h4>

                <p className="mt-1 text-xs text-brand-on-surface/55">
                  {post.likes_count} likes • score {post.top_score}
                </p>
              </Link>
            ))}
          </div>
        ) : null}
      </section>
    </aside>
  );
}