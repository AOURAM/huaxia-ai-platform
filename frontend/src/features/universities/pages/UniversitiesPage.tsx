import { GraduationCap, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

import { searchPosts } from '@/api/posts';
import { CreatePostCard } from '@/features/feed/components/CreatePostCard';
import { TopPostsPanel } from '@/features/feed/components/TopPostsPanel';
import { useAllPosts } from '@/features/feed/hooks/useAllPosts';
import { PostList } from '@/shared/components/post/PostList';
import type { Post } from '@/types/post';

export function UniversitiesPage() {
  const { data: allPosts = [], isLoading, isError } = useAllPosts();

  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Post[] | null>(null);

  const universityPosts = useMemo(
    () => allPosts.filter((post) => post.page_name === 'universities'),
    [allPosts]
  );

  const visiblePosts = searchResults ?? universityPosts;

  const handleSearch = async () => {
    if (!query.trim()) {
      setSearchResults(null);
      return;
    }

    try {
      const response = await searchPosts({
        query,
        page_name: 'universities',
      });

      setSearchResults(response.results);
    } catch {
      alert('Search failed');
    }
  };

  return (
    <main className="grid grid-cols-1 gap-8 xl:grid-cols-[1fr_320px]">
      <section className="space-y-6">
        <div className="rounded-2xl border bg-white p-6">
          <div className="flex items-center gap-2 text-sm font-bold text-brand-primary">
            <GraduationCap className="h-5 w-5" />
            Universities
          </div>

          <h1 className="text-3xl font-bold mt-2">
            University life in China
          </h1>

          <div className="mt-4 flex gap-2 border rounded-xl p-2">
            <Search className="h-5 w-5" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search university posts..."
              className="flex-1 outline-none"
            />
            <button onClick={handleSearch} className="text-sm font-bold">
              Search
            </button>
          </div>
        </div>

        <CreatePostCard pageName="universities" />

        <div className="rounded-2xl border bg-white p-4">
          {isLoading && <p>Loading...</p>}
          {isError && <p>Error loading posts</p>}
          {!isLoading && !isError && <PostList posts={visiblePosts} />}
        </div>
      </section>

      <aside className="hidden xl:block">
        <TopPostsPanel />
      </aside>
    </main>
  );
}