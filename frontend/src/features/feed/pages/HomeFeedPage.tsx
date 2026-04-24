import { AnimatePresence, motion } from 'motion/react';
import { Bell, Home, LogOut, UserCircle } from 'lucide-react';
import { useState } from 'react';

import { searchPosts } from '@/api/posts';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { CreatePostCard } from '@/features/feed/components/CreatePostCard';
import { FeedToolbar } from '@/features/feed/components/FeedToolbar';
import { TopPostsPanel } from '@/features/feed/components/TopPostsPanel';
import { useAllPosts } from '@/features/feed/hooks/useAllPosts';
import { PostList } from '@/shared/components/post/PostList';
import type { Post } from '@/types/post';

const tabs = ['For You', 'Latest', 'AI Categorized'];

export function HomeFeedPage() {
  const { user, logout } = useAuth();
  const { data: posts = [], isLoading, isError } = useAllPosts();

  const [activeTab, setActiveTab] = useState('For You');
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Post[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const visiblePosts = searchResults ?? posts;

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
      const response = await searchPosts({ query: trimmedQuery, limit: 20 });
      setSearchResults(response.results);
    } catch {
      setSearchError('Search failed. The backend search or embedding service may be unavailable.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-surface">
      <nav className="sticky top-0 z-50 border-b border-brand-outline bg-brand-surface/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-4 md:px-6">
          <div className="font-serif text-2xl font-bold text-brand-primary">Huaxia</div>

          <div className="hidden items-center gap-8 md:flex">
            {['Home', 'Cities', 'Universities', 'Culture', 'Daily Life'].map((item) => (
              <button
                key={item}
                type="button"
                className={`flex h-16 items-center border-b-2 text-sm font-bold transition ${
                  item === 'Home'
                    ? 'border-brand-primary text-brand-primary'
                    : 'border-transparent text-brand-on-surface/60 hover:text-brand-primary'
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button className="rounded-full p-2 text-brand-primary transition hover:bg-brand-neutral-soft">
              <Bell className="h-6 w-6" />
            </button>

            <button className="rounded-full p-2 text-brand-primary transition hover:bg-brand-neutral-soft">
              <UserCircle className="h-7 w-7" />
            </button>

            <button
              type="button"
              onClick={logout}
              className="rounded-full p-2 text-brand-on-surface/55 transition hover:bg-brand-neutral-soft hover:text-brand-danger"
              title="Sign out"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </nav>

      <div className="mx-auto flex w-full max-w-[1280px] items-start gap-8 px-4 py-8 md:px-6">
        <main className="min-w-0 flex-1 space-y-8">
          <section className="space-y-6">
            <div>
              <p className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-brand-primary">
                <Home className="h-4 w-4" />
                Welcome, {user?.username}
              </p>
              <h1 className="font-serif text-4xl font-bold text-brand-on-surface">
                Student knowledge feed
              </h1>
              <p className="mt-2 max-w-2xl text-brand-on-surface/65">
                Search, ask, and share practical information about studying and living in China.
              </p>
            </div>

            <FeedToolbar
              query={query}
              onQueryChange={setQuery}
              onSearch={handleSearch}
              isSearching={isSearching}
            />

            {searchError ? (
              <div className="rounded-lg border border-brand-danger/20 bg-brand-danger/10 p-4 text-sm font-semibold text-brand-danger">
                {searchError}
              </div>
            ) : null}

            <CreatePostCard />
          </section>

          <div className="sticky top-16 z-40 flex border-b border-brand-outline bg-brand-surface pt-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-6 py-4 text-sm font-bold tracking-wide transition ${
                  activeTab === tab
                    ? 'text-brand-primary'
                    : 'text-brand-on-surface/55 hover:text-brand-on-surface'
                }`}
              >
                {tab}
                {activeTab === tab ? (
                  <motion.div
                    layoutId="homeFeedActiveTab"
                    className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full bg-brand-primary"
                  />
                ) : null}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="rounded-xl border border-brand-outline bg-white p-10 text-center text-brand-on-surface/60">
              Loading posts...
            </div>
          ) : null}

          {isError ? (
            <div className="rounded-xl border border-brand-danger/20 bg-brand-danger/10 p-10 text-center text-brand-danger">
              Could not load posts. Check the backend server.
            </div>
          ) : null}

          {!isLoading && !isError ? (
            <AnimatePresence mode="popLayout">
              <motion.div
                key={searchResults ? 'search' : 'feed'}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
              >
                <PostList posts={visiblePosts} />
              </motion.div>
            </AnimatePresence>
          ) : null}
        </main>

        <TopPostsPanel />
      </div>
    </div>
  );
}