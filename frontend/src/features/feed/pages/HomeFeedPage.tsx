import { AnimatePresence, motion } from 'motion/react';
import { Home, Search, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getAllPosts, getPersonalizedFeed, searchPosts } from '@/api/posts';
import { CreatePostCard } from '@/features/feed/components/CreatePostCard';
import { TopPostsPanel } from '@/features/feed/components/TopPostsPanel';
import { PostList } from '@/shared/components/post/PostList';
import { queryKeys } from '@/constants/queryKeys';
import type { Post } from '@/types/post';

const tabs = ['For You', 'Latest', 'AI Categorized'] as const;

type FeedTab = (typeof tabs)[number];

function getAiCategorizedPosts(posts: Post[]) {
  return posts.filter(
    (post) => post.category_id || post.summary || (post.tags && post.tags.length > 0),
  );
}

function getLatestPosts(posts: Post[]) {
  return [...posts].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}

export function HomeFeedPage() {
  const [activeTab, setActiveTab] = useState<FeedTab>('For You');
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Post[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const personalizedFeedQuery = useQuery({
    queryKey: queryKeys.personalizedFeed,
    queryFn: getPersonalizedFeed,
  });

  const allPostsQuery = useQuery({
    queryKey: queryKeys.posts,
    queryFn: getAllPosts,
  });

  const allPosts = allPostsQuery.data ?? [];
  const personalizedPosts = personalizedFeedQuery.data ?? [];

  const tabPosts =
    activeTab === 'For You'
      ? personalizedPosts
      : activeTab === 'Latest'
        ? getLatestPosts(allPosts)
        : getAiCategorizedPosts(allPosts);

  const visiblePosts = searchResults ?? tabPosts;

  const isLoading =
    activeTab === 'For You'
      ? personalizedFeedQuery.isLoading
      : allPostsQuery.isLoading;

  const isError =
    activeTab === 'For You'
      ? personalizedFeedQuery.isError
      : allPostsQuery.isError;

  const handleSearch = async () => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setSearchResults(null);
      setSearchError(null);
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      const response = await searchPosts({
        query: trimmedQuery,
        limit: 20,
      });

      setSearchResults(response.results);
    } catch {
      setSearchError(
        'Search failed. The backend search or embedding service may be unavailable.',
      );
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSearchResults(null);
    setSearchError(null);
  };

  const currentTabDescription =
    activeTab === 'For You'
      ? 'Posts ranked from your onboarding interests and activity signals.'
      : activeTab === 'Latest'
        ? 'Newest discussions from the whole Huaxia community.'
        : 'Posts that already have AI category, summary, or tag metadata.';

  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-6 py-8 lg:grid-cols-[minmax(0,1fr)_340px]">
      <section className="min-w-0 space-y-8">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-brand-outline bg-white p-6 shadow-sm"
        >
          <div className="mb-5 flex items-center gap-3 text-sm font-black uppercase tracking-[0.2em] text-brand-primary">
            <Home className="h-5 w-5" />
            Home
          </div>

          <h1 className="font-serif text-4xl font-black text-brand-on-surface">
            Student knowledge feed
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-brand-on-surface/60">
            Search, ask, and share practical information about studying and living in China.
          </p>

          <div className="mt-6 flex overflow-hidden rounded-2xl border border-brand-outline bg-brand-neutral-soft">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  void handleSearch();
                }
              }}
              placeholder="Search posts by meaning, topic, city, university, or daily problem..."
              className="min-w-0 flex-1 bg-transparent px-5 py-4 text-sm font-semibold text-brand-on-surface outline-none placeholder:text-brand-on-surface/40"
            />

            <button
              type="button"
              onClick={() => void handleSearch()}
              disabled={isSearching}
              className="flex items-center gap-2 bg-brand-primary px-6 py-4 text-xs font-black uppercase tracking-widest text-white transition hover:bg-brand-primary-hover disabled:opacity-60"
            >
              <Search className="h-4 w-4" />
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </div>

          {searchError ? (
            <div className="mt-4 rounded-xl border border-brand-danger/20 bg-brand-danger/10 p-4 text-sm font-bold text-brand-danger">
              {searchError}
            </div>
          ) : null}

          {searchResults ? (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4 text-sm font-bold text-brand-primary">
              <span>Showing search results for “{query}”.</span>
              <button
                type="button"
                onClick={clearSearch}
                className="rounded-lg border border-brand-primary/20 px-3 py-1 text-xs uppercase tracking-wider transition hover:bg-brand-primary/10"
              >
                Clear
              </button>
            </div>
          ) : null}
        </motion.section>

        <CreatePostCard />

        <section className="overflow-hidden rounded-3xl border border-brand-outline bg-white shadow-sm">
          <div className="flex overflow-x-auto border-b border-brand-outline bg-brand-surface">
            {tabs.map((tab) => {
              const active = activeTab === tab;

              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab);
                    setSearchResults(null);
                    setSearchError(null);
                  }}
                  className={`relative whitespace-nowrap px-8 py-5 text-sm font-black tracking-wide transition ${
                    active
                      ? 'text-brand-primary'
                      : 'text-brand-on-surface/55 hover:text-brand-on-surface'
                  }`}
                >
                  {tab}
                  {active ? (
                    <motion.span
                      layoutId="feed-tab-indicator"
                      className="absolute inset-x-4 bottom-0 h-1 rounded-full bg-brand-primary"
                    />
                  ) : null}
                </button>
              );
            })}
          </div>

          <div className="border-b border-brand-outline bg-white px-6 py-4">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-brand-on-surface/45">
              <Sparkles className="h-4 w-4 text-brand-primary" />
              {searchResults ? 'Search results' : activeTab}
            </div>
            <p className="mt-1 text-sm text-brand-on-surface/55">
              {searchResults
                ? 'Search ignores tab filters and returns the most relevant matching posts.'
                : currentTabDescription}
            </p>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="rounded-2xl border border-dashed border-brand-outline bg-brand-neutral-soft p-8 text-center text-sm font-bold text-brand-on-surface/55">
                Loading posts...
              </div>
            ) : null}

            {isError ? (
              <div className="rounded-2xl border border-brand-danger/20 bg-brand-danger/10 p-8 text-center text-sm font-bold text-brand-danger">
                Could not load posts. Check the backend server.
              </div>
            ) : null}

            {!isLoading && !isError && visiblePosts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-brand-outline bg-brand-neutral-soft p-10 text-center">
                <h3 className="font-serif text-2xl font-black text-brand-on-surface">
                  {searchResults ? 'No matching posts' : 'No posts yet'}
                </h3>
                <p className="mt-2 text-sm text-brand-on-surface/55">
                  {searchResults
                    ? 'Clear the search or try a different natural-language query.'
                    : activeTab === 'For You'
                      ? 'Complete onboarding or create posts that match your interests.'
                      : 'Create the first discussion above.'}
                </p>
              </div>
            ) : null}

            {!isLoading && !isError && visiblePosts.length > 0 ? (
              <AnimatePresence mode="popLayout">
                <PostList posts={visiblePosts} />
              </AnimatePresence>
            ) : null}
          </div>
        </section>
      </section>

      <aside className="space-y-8">
        <TopPostsPanel />
      </aside>
    </main>
  );
}