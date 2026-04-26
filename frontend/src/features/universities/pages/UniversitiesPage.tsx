import { GraduationCap, Search, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';

import { searchPosts } from '@/api/posts';
import { CreatePostCard } from '@/features/feed/components/CreatePostCard';
import { TopPostsPanel } from '@/features/feed/components/TopPostsPanel';
import { useAllPosts } from '@/features/feed/hooks/useAllPosts';
import { PostList } from '@/shared/components/post/PostList';
import type { Post, SearchPost } from '@/types/post';

export function UniversitiesPage() {
  const { data: allPosts = [], isLoading, isError } = useAllPosts();

  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchPost[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const universityPosts = useMemo(
    () => allPosts.filter((post: Post) => post.page_name === 'universities'),
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
    <main className="grid grid-cols-1 gap-8 xl:grid-cols-[1fr_320px]">
      <section className="space-y-6">
        <div className="rounded-[2rem] border border-brand-outline bg-white p-8 shadow-sm">
          <div className="mb-4 flex items-center gap-3 text-sm font-black uppercase tracking-[0.25em] text-brand-primary">
            <GraduationCap className="h-5 w-5" />
            Universities
          </div>

          <h1 className="max-w-3xl text-4xl font-black tracking-tight text-brand-on-surface md:text-5xl">
            University life in China
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-brand-on-surface/65">
            Ask questions, share admission experiences, compare campuses, and help other international students understand Chinese universities.
          </p>

          <div className="mt-6 flex items-center gap-2 rounded-2xl border border-brand-outline bg-brand-neutral-soft px-4 py-3">
            <Search className="h-5 w-5 text-brand-on-surface/45" />

            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  handleSearch();
                }
              }}
              placeholder="Search university posts, campus life, admission tips..."
              className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-brand-on-surface/40"
            />

            <button
              type="button"
              onClick={handleSearch}
              disabled={isSearching}
              className="rounded-xl bg-brand-primary px-5 py-2.5 text-xs font-black text-white transition hover:bg-brand-primary-hover disabled:opacity-60"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </div>

          {searchError ? (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {searchError}
            </div>
          ) : null}

          {searchResults ? (
            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-brand-on-surface/55">
              <Sparkles className="h-4 w-4 text-brand-primary" />
              Showing university search results for “{query}”
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setSearchResults(null);
                  setSearchError(null);
                }}
                className="ml-2 text-brand-primary underline"
              >
                Clear
              </button>
            </div>
          ) : null}
        </div>

        <CreatePostCard pageName="universities" />

        <div className="rounded-[2rem] border border-brand-outline bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="text-xl font-black text-brand-on-surface">
              University discussions
            </h2>
            <p className="text-sm text-brand-on-surface/55">
              Real Huaxia posts about admission, campus life, study, and university experience.
            </p>
          </div>

          {isLoading ? (
            <p className="rounded-2xl bg-brand-neutral-soft p-5 text-sm font-semibold text-brand-on-surface/60">
              Loading university posts...
            </p>
          ) : null}

          {isError ? (
            <p className="rounded-2xl bg-red-50 p-5 text-sm font-semibold text-red-700">
              Could not load posts. Check the backend server.
            </p>
          ) : null}

          {!isLoading && !isError ? <PostList posts={visiblePosts} /> : null}
        </div>
      </section>

      <aside className="hidden xl:block">
        <TopPostsPanel />
      </aside>
    </main>
  );
}