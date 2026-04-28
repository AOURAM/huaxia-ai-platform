import { AnimatePresence, motion } from 'motion/react';
import { Home, Search, Sparkles } from 'lucide-react';
import { useState } from 'react';

import { searchPosts } from '@/api/posts';
import { CreatePostCard } from '@/features/feed/components/CreatePostCard';
import { TopPostsPanel } from '@/features/feed/components/TopPostsPanel';
import { useAllPosts } from '@/features/feed/hooks/useAllPosts';
import { PostList } from '@/shared/components/post/PostList';
import type { Post } from '@/types/post';

const tabs = ['For You', 'Latest', 'AI Categorized'] as const;

type FeedTab = (typeof tabs)[number];

function getVisiblePosts(posts: Post[], activeTab: FeedTab) {
  if (activeTab === 'Latest') {
    return [...posts].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  }

  if (activeTab === 'AI Categorized') {
    return posts.filter(
      (post) => post.category || post.summary || (post.tags && post.tags.length > 0),
    );
  }

  return posts;
}

export function HomeFeedPage() {
  const { data: posts = [], isLoading, isError } = useAllPosts();

  const [activeTab, setActiveTab] = useState<FeedTab>('For You');
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Post[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const sourcePosts = searchResults ?? posts;
  const visiblePosts = getVisiblePosts(sourcePosts, activeTab);

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
      setSearchError('Search failed. The backend search or embedding service may be unavailable.');
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSearchResults(null);
    setSearchError(null);
  };

  return (
    <div className="min-h-screen bg-brand-surface">
      <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 gap-8 px-4 py-8 md:px-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <main className="min-w-0 space-y-8">
          <section>
            <p className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-brand-primary">
              <Home className="h-4 w-4" />
              Home
            </p>

            <h1 className="font-serif text-4xl font-bold text-brand-on-surface md:text-5xl">
              Student knowledge feed
            </h1>

            <p className="mt-3 max-w-3xl text-base leading-7 text-brand-on-surface/65">
              Search, ask, and share practical information about studying and living in China.
            </p>
          </section>

          <section className="rounded-xl border border-brand-outline bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3 rounded-full bg-brand-neutral-soft px-5 py-4">
              <Search className="h-5 w-5 text-brand-on-surface/35" />

              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    handleSearch();
                  }
                }}
                placeholder="Search posts by meaning, topic, city, university, or daily problem..."
                className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-brand-on-surface/40"
              />

              <button
                type="button"
                onClick={handleSearch}
                disabled={isSearching}
                className="text-sm font-bold text-brand-primary disabled:opacity-60"
              >
                {isSearching ? 'Searching...' : 'Search'}
              </button>
            </div>

            {searchError ? (
              <div className="mt-4 rounded-lg border border-brand-danger/20 bg-brand-danger/10 p-4 text-sm font-semibold text-brand-danger">
                {searchError}
              </div>
            ) : null}

            {searchResults ? (
              <div className="mt-4 flex items-center justify-between gap-4 text-sm text-brand-on-surface/60">
                <span className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-brand-primary" />
                  Showing search results for “{query}”.
                </span>

                <button
                  type="button"
                  onClick={clearSearch}
                  className="font-bold text-brand-primary"
                >
                  Clear
                </button>
              </div>
            ) : null}
          </section>

          <CreatePostCard />

          <section>
            <div className="sticky top-16 z-40 flex overflow-x-auto border-b border-brand-outline bg-brand-surface pt-2">
              {tabs.map((tab) => {
                const active = activeTab === tab;

                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`relative whitespace-nowrap px-6 py-4 text-sm font-bold tracking-wide transition ${
                      active
                        ? 'text-brand-primary'
                        : 'text-brand-on-surface/55 hover:text-brand-on-surface'
                    }`}
                  >
                    {tab}

                    {active ? (
                      <motion.div
                        layoutId="homeActiveTab"
                        className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full bg-brand-primary"
                      />
                    ) : null}
                  </button>
                );
              })}
            </div>

            {isLoading ? (
              <div className="mt-6 rounded-xl border border-brand-outline bg-white p-10 text-center text-brand-on-surface/60">
                Loading posts...
              </div>
            ) : null}

            {isError ? (
              <div className="mt-6 rounded-xl border border-brand-danger/20 bg-brand-danger/10 p-10 text-center text-brand-danger">
                Could not load posts. Check the backend server.
              </div>
            ) : null}

            {!isLoading && !isError && visiblePosts.length === 0 ? (
              <div className="mt-6 rounded-xl border border-dashed border-brand-outline bg-white p-10 text-center">
                <h3 className="mb-2 font-serif text-2xl font-bold">
                  {searchResults ? 'No matching posts' : 'No posts yet'}
                </h3>

                <p className="text-brand-on-surface/60">
                  {searchResults
                    ? 'Clear the search or try a different natural-language query.'
                    : 'Create the first discussion above.'}
                </p>
              </div>
            ) : null}

            {!isLoading && !isError && visiblePosts.length > 0 ? (
              <div className="mt-6">
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={`${searchResults ? 'search' : 'feed'}-${activeTab}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                  >
                    <PostList posts={visiblePosts} />
                  </motion.div>
                </AnimatePresence>
              </div>
            ) : null}
          </section>
        </main>

        <TopPostsPanel />
      </div>
    </div>
  );
}