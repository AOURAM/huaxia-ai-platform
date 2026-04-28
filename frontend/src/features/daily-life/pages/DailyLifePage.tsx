import {
  Bell,
  BookOpenCheck,
  Bus,
  CreditCard,
  HeartPulse,
  Home,
  LogOut,
  Search,
  ShoppingBag,
  Smartphone,
  Sparkles,
  UserCircle,
  Utensils,
} from 'lucide-react';
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

export function DailyLifePage() {
  const { logout } = useAuth();
  const { data: allPosts = [], isLoading, isError } = useAllPosts();

  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Post[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const dailyLifePosts = useMemo(
    () => allPosts.filter((post) => post.page_name === 'daily_life'),
    [allPosts],
  );

  const visiblePosts = searchResults ?? dailyLifePosts;

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
              className="flex h-16 items-center border-b-2 border-transparent text-sm font-bold text-brand-on-surface/60 transition hover:text-brand-primary"
            >
              Universities
            </Link>

            <Link
              to={ROUTES.culture}
              className="flex h-16 items-center border-b-2 border-transparent text-sm font-bold text-brand-on-surface/60 transition hover:text-brand-primary"
            >
              Culture
            </Link>

            <Link
              to={ROUTES.dailyLife}
              className="flex h-16 items-center border-b-2 border-brand-primary text-sm font-bold text-brand-primary"
            >
              Daily Life
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-full p-2 text-brand-primary transition hover:bg-brand-neutral-soft"
              title="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            <button
              type="button"
              className="rounded-full p-2 text-brand-primary transition hover:bg-brand-neutral-soft"
              title="Notifications"
            >
              <Bell className="h-5 w-5" />
            </button>

            <button
              type="button"
              className="rounded-full p-2 text-brand-primary transition hover:bg-brand-neutral-soft"
              title="Profile"
            >
              <UserCircle className="h-6 w-6" />
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
                <ShoppingBag className="h-4 w-4" />
                Daily Life
              </p>

              <h1 className="font-serif text-4xl font-bold text-brand-on-surface md:text-5xl">
                Practical student life in China
              </h1>

              <p className="mt-3 max-w-2xl text-brand-on-surface/65">
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
                <div className="mt-4 flex items-center justify-between text-sm text-brand-on-surface/60">
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-brand-primary" />
                    Showing daily life search results for “{query}”.
                  </span>

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
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-neutral-soft text-brand-primary">
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
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <h2 className="font-serif text-3xl font-bold">Daily life discussions</h2>
                <p className="text-sm text-brand-on-surface/60">
                  Real Huaxia posts about daily survival, student services, payments, food,
                  transport, and practical campus life.
                </p>
              </div>

              <div className="hidden items-center gap-2 rounded-full bg-brand-neutral-soft px-4 py-2 text-xs font-bold text-brand-primary md:flex">
                <BookOpenCheck className="h-4 w-4" />
                Practical knowledge
              </div>
            </div>

            {isLoading ? (
              <div className="rounded-xl border border-brand-outline bg-white p-10 text-center text-brand-on-surface/60">
                Loading daily life posts...
              </div>
            ) : null}

            {isError ? (
              <div className="rounded-xl border border-brand-danger/20 bg-brand-danger/10 p-10 text-center text-brand-danger">
                Could not load posts. Check the backend server.
              </div>
            ) : null}

            {!isLoading && !isError && visiblePosts.length === 0 ? (
              <div className="rounded-xl border border-dashed border-brand-outline bg-white p-10 text-center">
                <h3 className="mb-2 font-serif text-2xl font-bold">No daily life posts yet</h3>
                <p className="text-brand-on-surface/60">
                  Create the first daily life discussion above.
                </p>
              </div>
            ) : null}

            {!isLoading && !isError && visiblePosts.length > 0 ? (
              <PostList posts={visiblePosts} />
            ) : null}
          </section>
        </main>

        <aside className="hidden w-80 shrink-0 space-y-6 lg:block">
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