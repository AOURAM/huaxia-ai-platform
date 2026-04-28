import {
  BookOpenCheck,
  Bus,
  CreditCard,
  HeartPulse,
  Home,
  Search,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Utensils,
} from 'lucide-react';
import { useMemo, useState } from 'react';

import { searchPosts } from '@/api/posts';
import { CreatePostCard } from '@/features/feed/components/CreatePostCard';
import { TopPostsPanel } from '@/features/feed/components/TopPostsPanel';
import { useAllPosts } from '@/features/feed/hooks/useAllPosts';
import { PostList } from '@/shared/components/post/PostList';
import type { ContentType, Post } from '@/types/post';

type DiscussionFilter = 'all' | Extract<ContentType, 'question' | 'guide' | 'experience' | 'tip'>;

const discussionTabs: Array<{
  label: string;
  value: DiscussionFilter;
}> = [
  { label: 'All', value: 'all' },
  { label: 'Questions', value: 'question' },
  { label: 'Guides', value: 'guide' },
  { label: 'Experiences', value: 'experience' },
  { label: 'Tips', value: 'tip' },
];

const dailyLifeTopics = [
  {
    title: 'Housing',
    description: 'Dormitories, renting rooms, deposits, roommates, and move-in problems.',
    icon: Home,
    searchHint: 'housing dorm rent deposit',
  },
  {
    title: 'Payments',
    description: 'Alipay, WeChat Pay, bank cards, cash, refunds, and payment problems.',
    icon: CreditCard,
    searchHint: 'Alipay WeChat Pay bank card',
  },
  {
    title: 'Transport',
    description: 'Metro cards, buses, trains, taxis, bike sharing, and travel apps.',
    icon: Bus,
    searchHint: 'metro bus train taxi bike',
  },
  {
    title: 'Healthcare',
    description: 'Hospitals, pharmacies, insurance, registration, and emergency help.',
    icon: HeartPulse,
    searchHint: 'hospital pharmacy insurance emergency',
  },
  {
    title: 'SIM & Internet',
    description: 'Phone numbers, mobile data, campus Wi-Fi, VPN issues, and apps.',
    icon: Smartphone,
    searchHint: 'SIM card internet mobile data Wi-Fi',
  },
  {
    title: 'Food & Delivery',
    description: 'Canteens, delivery apps, grocery shopping, halal food, and eating out.',
    icon: Utensils,
    searchHint: 'food delivery canteen grocery halal',
  },
];

const survivalChecklist = [
  'Set up phone number and mobile data',
  'Connect Alipay or WeChat Pay',
  'Understand campus transport routes',
  'Save university emergency contact',
  'Find nearby hospital and pharmacy',
  'Learn delivery address format',
];

function getTabCount(posts: Post[], filter: DiscussionFilter) {
  if (filter === 'all') {
    return posts.length;
  }

  return posts.filter((post) => post.content_type === filter).length;
}

export function DailyLifePage() {
  const { data: allPosts = [], isLoading, isError } = useAllPosts();

  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Post[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<DiscussionFilter>('all');

  const dailyLifePosts = useMemo(
    () => allPosts.filter((post) => post.page_name === 'daily_life'),
    [allPosts],
  );

  const sourcePosts = searchResults ?? dailyLifePosts;

  const visiblePosts = useMemo(() => {
    if (activeTab === 'all') {
      return sourcePosts;
    }

    return sourcePosts.filter((post) => post.content_type === activeTab);
  }, [activeTab, sourcePosts]);

  const handleSearch = async (overrideQuery?: string) => {
    const searchQuery = (overrideQuery ?? query).trim();

    if (!searchQuery) {
      setSearchResults(null);
      setSearchError(null);
      return;
    }

    setQuery(searchQuery);
    setIsSearching(true);
    setSearchError(null);

    try {
      const response = await searchPosts({
        query: searchQuery,
        page_name: 'daily_life',
        limit: 20,
      });

      setSearchResults(response.results);
      setActiveTab('all');
    } catch {
      setSearchError('Search failed. Check that your backend is running.');
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSearchResults(null);
    setSearchError(null);
    setActiveTab('all');
  };

  return (
    <div className="min-h-screen bg-brand-surface">
      <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 gap-8 px-4 py-8 md:px-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <main className="min-w-0 space-y-8">
          <section className="space-y-6">
            <div>
              <p className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-brand-primary">
                <ShoppingBag className="h-4 w-4" />
                Daily Life
              </p>

              <h1 className="font-serif text-4xl font-bold text-brand-on-surface md:text-5xl">
                Practical student life in China
              </h1>

              <p className="mt-3 max-w-3xl text-base leading-7 text-brand-on-surface/65">
                Find real student advice about housing, payments, transport, healthcare, food,
                delivery apps, SIM cards, and the small daily problems that waste time when you are
                new in China.
              </p>
            </div>

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
                  placeholder="Search daily life posts, payment apps, transport, hospitals, SIM cards..."
                  className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-brand-on-surface/40"
                />

                <button
                  type="button"
                  onClick={() => handleSearch()}
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
                    Showing daily life search results for “{query}”.
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

            <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {dailyLifeTopics.map((topic) => {
                const Icon = topic.icon;

                return (
                  <button
                    key={topic.title}
                    type="button"
                    onClick={() => handleSearch(topic.searchHint)}
                    className="rounded-xl border border-brand-outline bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-brand-primary hover:shadow-md"
                  >
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-neutral-soft text-brand-primary">
                      <Icon className="h-5 w-5" />
                    </div>

                    <h2 className="font-serif text-xl font-bold text-brand-on-surface">
                      {topic.title}
                    </h2>

                    <p className="mt-2 text-sm leading-relaxed text-brand-on-surface/60">
                      {topic.description}
                    </p>

                    <p className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-brand-primary">
                      Search topic
                    </p>
                  </button>
                );
              })}
            </section>

            <CreatePostCard pageName="daily_life" />
          </section>

          <section>
            <div className="mb-5">
              <h2 className="font-serif text-3xl font-bold">Daily life discussions</h2>
              <p className="text-sm text-brand-on-surface/60">
                Real Huaxia posts about daily survival, student services, payments, food, transport,
                and practical campus life.
              </p>
            </div>

            <div className="sticky top-16 z-40 flex overflow-x-auto border-b border-brand-outline bg-brand-surface pt-2">
              {discussionTabs.map((tab) => {
                const isActive = activeTab === tab.value;

                return (
                  <button
                    key={tab.value}
                    type="button"
                    onClick={() => setActiveTab(tab.value)}
                    className={`relative whitespace-nowrap px-6 py-4 text-sm font-bold tracking-wide transition ${
                      isActive
                        ? 'text-brand-primary'
                        : 'text-brand-on-surface/55 hover:text-brand-on-surface'
                    }`}
                  >
                    {tab.label} ({getTabCount(sourcePosts, tab.value)})

                    {isActive ? (
                      <span className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full bg-brand-primary" />
                    ) : null}
                  </button>
                );
              })}
            </div>

            {isLoading ? (
              <div className="mt-6 rounded-xl border border-brand-outline bg-white p-10 text-center text-brand-on-surface/60">
                Loading daily life posts...
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
                  {searchResults ? 'No matching daily life posts' : 'No daily life posts yet'}
                </h3>

                <p className="text-brand-on-surface/60">
                  {searchResults
                    ? 'Clear the search, choose another tab, or try a different daily life question.'
                    : 'Create the first daily life discussion above.'}
                </p>
              </div>
            ) : null}

            {!isLoading && !isError && visiblePosts.length > 0 ? (
              <div className="mt-6">
                <PostList posts={visiblePosts} />
              </div>
            ) : null}
          </section>
        </main>

        <aside className="hidden w-80 shrink-0 space-y-6 xl:block">
          <section className="rounded-2xl border border-brand-outline bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-2 border-b border-brand-outline/40 pb-4">
              <BookOpenCheck className="h-5 w-5 text-brand-primary" />

              <div>
                <h3 className="font-serif text-xl font-bold text-brand-on-surface">
                  New student checklist
                </h3>

                <p className="text-xs font-semibold text-brand-on-surface/50">
                  Essentials before daily life gets messy.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {survivalChecklist.map((item, index) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-xl border border-brand-outline bg-brand-neutral-soft p-3"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-black text-brand-primary">
                    {index + 1}
                  </div>

                  <p className="text-sm font-semibold leading-relaxed text-brand-on-surface/65">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <TopPostsPanel />
        </aside>
      </div>
    </div>
  );
}