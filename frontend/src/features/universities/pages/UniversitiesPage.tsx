import { Bell, GraduationCap, LogOut, Search, UserCircle } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { searchPosts } from '@/api/posts';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { CreatePostCard } from '@/features/feed/components/CreatePostCard';
import { TopPostsPanel } from '@/features/feed/components/TopPostsPanel';
import { useAllPosts } from '@/features/feed/hooks/useAllPosts';
import { PostList } from '@/shared/components/post/PostList';
import type { Post } from '@/types/post';

export function UniversitiesPage() {
  const { logout } = useAuth();
  const { data: allPosts = [], isLoading, isError } = useAllPosts();

  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Post[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const universityPosts = useMemo(
    () => allPosts.filter((post) => post.page_name === 'universities'),
    [allPosts],
  );

  const visiblePosts = searchResults ?? universityPosts;

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
        page_name: 'universities',
        limit: 20,
      });

      setSearchResults(response.results);
    } catch {
      setSearchError('Search failed. Check that your backend is running.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-surface">
      <nav className="sticky top-0 z-50 border-b border-brand-outline bg-brand-surface/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-4 md:px-6">
          <Link to={ROUTES.home} className="font-serif text-2xl font-bold text-brand-primary">
            Huaxia
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <Link
              to={ROUTES.home}
              className="flex h-16 items-center border-b-2 border-transparent text-sm font-bold text-brand-on-surface/60 transition hover:text-brand-primary"
            >
              Home
            </Link>

            <Link
              to={ROUTES.cities}
              className="flex h-16 items-center border-b-2 border-transparent text-sm font-bold text-brand-on-surface/60 transition hover:text-brand-primary"
            >
              Cities
            </Link>

            <Link
              to={ROUTES.universities}
              className="flex h-16 items-center border-b-2 border-brand-primary text-sm font-bold text-brand-primary"
            >
              Universities
            </Link>

            <button
              type="button"
              className="flex h-16 items-center border-b-2 border-transparent text-sm font-bold text-brand-on-surface/60"
            >
              Culture
            </button>

            <button
              type="button"
              className="flex h-16 items-center border-b-2 border-transparent text-sm font-bold text-brand-on-surface/60"
            >
              Daily Life
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-full p-2 text-brand-primary transition hover:bg-brand-neutral-soft"
            >
              <Search className="h-5 w-5" />
            </button>

            <button
              type="button"
              className="rounded-full p-2 text-brand-primary transition hover:bg-brand-neutral-soft"
            >
              <Bell className="h-5 w-5" />
            </button>

            <button
              type="button"
              className="rounded-full p-2 text-brand-primary transition hover:bg-brand-neutral-soft"
            >
              <UserCircle className="h-6 w-6" />
            </button>

            <button
              type="button"
              onClick={logout}
              className="rounded-full p-2 text-brand-on-surface/55 transition hover:bg-brand-neutral-soft hover:text-brand-danger"
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
                <GraduationCap className="h-4 w-4" />
                Universities
              </p>

              <h1 className="font-serif text-4xl font-bold text-brand-on-surface">
                University life in China
              </h1>

              <p className="mt-2 max-w-2xl text-brand-on-surface/65">
                Ask questions, share admission experiences, compare campuses, and help other
                international students understand Chinese universities.
              </p>
            </div>

            <div className="rounded-xl border border-brand-outline bg-white p-4 shadow-sm">
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
                  placeholder="Search university posts, admission tips, campus life..."
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
                <div className="mt-4 flex items-center justify-between text-sm text-brand-on-surface/60">
                  <span>Showing university search results for “{query}”.</span>

                  <button
                    type="button"
                    onClick={() => {
                      setQuery('');
                      setSearchResults(null);
                      setSearchError(null);
                    }}
                    className="font-bold text-brand-primary"
                  >
                    Clear
                  </button>
                </div>
              ) : null}
            </div>

            <CreatePostCard pageName="universities" />
          </section>

          <section>
            <div className="mb-5">
              <h2 className="font-serif text-3xl font-bold">University discussions</h2>
              <p className="text-sm text-brand-on-surface/60">
                Real Huaxia posts about admission, campus life, study, and university experience.
              </p>
            </div>

            {isLoading ? (
              <div className="rounded-xl border border-brand-outline bg-white p-10 text-center text-brand-on-surface/60">
                Loading university posts...
              </div>
            ) : null}

            {isError ? (
              <div className="rounded-xl border border-brand-danger/20 bg-brand-danger/10 p-10 text-center text-brand-danger">
                Could not load posts. Check the backend server.
              </div>
            ) : null}

            {!isLoading && !isError && visiblePosts.length === 0 ? (
              <div className="rounded-xl border border-dashed border-brand-outline bg-white p-10 text-center">
                <h3 className="mb-2 font-serif text-2xl font-bold">
                  No university posts yet
                </h3>
                <p className="text-brand-on-surface/60">
                  Create the first university discussion above.
                </p>
              </div>
            ) : null}

            {!isLoading && !isError && visiblePosts.length > 0 ? (
              <PostList posts={visiblePosts} />
            ) : null}
          </section>
        </main>

        <TopPostsPanel />
      </div>
    </div>
  );
}