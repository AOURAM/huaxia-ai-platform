import {
  Bell,
  BookOpen,
  CalendarDays,
  Clock,
  Landmark,
  LogOut,
  MapPin,
  Music,
  Search,
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

interface CultureEvent {
  id: string;
  date: string;
  title: string;
  location: string;
  time: string;
  description: string;
  tag: string;
}

const culturalEvents: CultureEvent[] = [
  {
    id: 'tea-workshop',
    date: '2026-05-10',
    title: 'Tea Culture Workshop',
    location: 'International Student Center',
    time: '14:00',
    description:
      'Learn basic tea etiquette, serving steps, and useful vocabulary for daily life in China.',
    tag: 'Workshop',
  },
  {
    id: 'food-night',
    date: '2026-05-18',
    title: 'Regional Food Night',
    location: 'Campus Dining Hall',
    time: '18:30',
    description:
      'Students share experiences with Sichuan, Cantonese, Hubei, and northern Chinese food culture.',
    tag: 'Food',
  },
  {
    id: 'music-exchange',
    date: '2026-05-25',
    title: 'Chinese Music Exchange',
    location: 'Student Activity Room',
    time: '19:00',
    description:
      'A relaxed introduction to traditional instruments, campus clubs, and student performances.',
    tag: 'Music',
  },
];

const cultureTopics = [
  {
    title: 'Traditions',
    description: 'Festivals, etiquette, greetings, and customs international students meet in China.',
    icon: Landmark,
  },
  {
    title: 'Food Culture',
    description: 'Regional dishes, dining manners, canteen tips, and restaurant survival advice.',
    icon: Utensils,
  },
  {
    title: 'Arts & Language',
    description: 'Music, calligraphy, local expressions, and cultural learning outside the classroom.',
    icon: Music,
  },
];

const calendarYear = 2026;
const calendarMonthIndex = 4; // May

function formatEventMonth(dateValue: string) {
  return new Intl.DateTimeFormat('en', { month: 'short' }).format(new Date(dateValue));
}

function formatEventDay(dateValue: string) {
  return new Intl.DateTimeFormat('en', { day: '2-digit' }).format(new Date(dateValue));
}

function getCalendarDays(year: number, monthIndex: number) {
  const firstDate = new Date(year, monthIndex, 1);
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  // Convert JS Sunday-first index into Monday-first offset.
  const firstDay = firstDate.getDay();
  const mondayOffset = firstDay === 0 ? 6 : firstDay - 1;

  const emptyCells = Array.from({ length: mondayOffset }, (_, index) => ({
    key: `empty-${index}`,
    day: null as number | null,
  }));

  const dayCells = Array.from({ length: daysInMonth }, (_, index) => ({
    key: `day-${index + 1}`,
    day: index + 1,
  }));

  return [...emptyCells, ...dayCells];
}

function CultureEventsCalendar() {
  const [selectedEventId, setSelectedEventId] = useState(culturalEvents[0]?.id ?? '');

  const calendarCells = useMemo(() => getCalendarDays(calendarYear, calendarMonthIndex), []);

  const eventsByDay = useMemo(() => {
    const map = new Map<number, CultureEvent>();

    culturalEvents.forEach((event) => {
      map.set(new Date(event.date).getDate(), event);
    });

    return map;
  }, []);

  const selectedEvent =
    culturalEvents.find((event) => event.id === selectedEventId) ?? culturalEvents[0];

  return (
    <section className="rounded-2xl border border-brand-outline bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center gap-2 border-b border-brand-outline/40 pb-4">
        <CalendarDays className="h-5 w-5 text-brand-primary" />
        <div>
          <h3 className="font-serif text-xl font-bold text-brand-on-surface">
            Culture event calendar
          </h3>
          <p className="text-xs font-semibold text-brand-on-surface/50">
            Campus and community events for cultural discovery.
          </p>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h4 className="font-serif text-lg font-bold text-brand-on-surface">May 2026</h4>
        <span className="rounded-full bg-brand-neutral-soft px-3 py-1 text-[11px] font-black uppercase text-brand-primary">
          {culturalEvents.length} events
        </span>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold uppercase text-brand-on-surface/45">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-7 gap-1">
        {calendarCells.map((cell) => {
          if (!cell.day) {
            return <div key={cell.key} className="h-9" />;
          }

          const event = eventsByDay.get(cell.day);
          const active = event?.id === selectedEvent?.id;

          return (
            <button
              key={cell.key}
              type="button"
              onClick={() => {
                if (event) {
                  setSelectedEventId(event.id);
                }
              }}
              className={`relative flex h-9 items-center justify-center rounded-lg text-xs font-bold transition ${
                active
                  ? 'bg-brand-primary text-white shadow-sm'
                  : event
                    ? 'border border-brand-outline bg-brand-neutral-soft text-brand-primary hover:border-brand-primary'
                    : 'text-brand-on-surface/35 hover:bg-brand-neutral-soft'
              }`}
              aria-label={event ? `Open event ${event.title}` : `Day ${cell.day}`}
            >
              {cell.day}
              {event ? (
                <span
                  className={`absolute bottom-1 h-1 w-1 rounded-full ${
                    active ? 'bg-white' : 'bg-brand-primary'
                  }`}
                />
              ) : null}
            </button>
          );
        })}
      </div>

      {selectedEvent ? (
        <div className="mt-5 rounded-xl border border-brand-outline bg-brand-neutral-soft p-4">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl border border-brand-outline bg-white shadow-sm">
              <span className="text-[10px] font-black uppercase text-brand-primary">
                {formatEventMonth(selectedEvent.date)}
              </span>
              <span className="font-serif text-2xl font-bold leading-none text-brand-on-surface">
                {formatEventDay(selectedEvent.date)}
              </span>
            </div>

            <div>
              <span className="rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase text-brand-primary">
                {selectedEvent.tag}
              </span>
              <h4 className="mt-2 text-sm font-bold text-brand-on-surface">
                {selectedEvent.title}
              </h4>
            </div>
          </div>

          <div className="space-y-2 text-xs font-semibold text-brand-on-surface/55">
            <p className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-brand-primary" />
              {selectedEvent.location}
            </p>

            <p className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-brand-primary" />
              {selectedEvent.time}
            </p>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-brand-on-surface/65">
            {selectedEvent.description}
          </p>
        </div>
      ) : null}
    </section>
  );
}

export function CulturePage() {
  const { logout } = useAuth();
  const { data: allPosts = [], isLoading, isError } = useAllPosts();

  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Post[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const culturePosts = useMemo(
    () => allPosts.filter((post) => post.page_name === 'culture'),
    [allPosts],
  );

  const visiblePosts = searchResults ?? culturePosts;

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
        page_name: 'culture',
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
              className="flex h-16 items-center border-b-2 border-brand-primary text-sm font-bold text-brand-primary"
            >
              Culture
            </Link>

            <button
              type="button"
              className="flex h-16 items-center border-b-2 border-transparent text-sm font-bold text-brand-on-surface/40"
              title="Daily Life page is not wired yet"
            >
              Daily Life
            </button>
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
                <Landmark className="h-4 w-4" />
                Culture
              </p>

              <h1 className="font-serif text-4xl font-bold text-brand-on-surface md:text-5xl">
                Cultural life in China
              </h1>

              <p className="mt-3 max-w-2xl text-brand-on-surface/65">
                Share cultural observations, festival tips, language context, food experiences, and
                practical advice that helps international students understand life in China.
              </p>
            </div>

            <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {cultureTopics.map((topic) => {
                const Icon = topic.icon;

                return (
                  <article
                    key={topic.title}
                    className="rounded-xl border border-brand-outline bg-white p-5 shadow-sm"
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
                  </article>
                );
              })}
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
                  placeholder="Search culture posts, festivals, etiquette, food, language tips..."
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
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-brand-primary" />
                    Showing culture search results for “{query}”.
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

            <CreatePostCard pageName="culture" />
          </section>

          <section>
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <h2 className="font-serif text-3xl font-bold">Culture discussions</h2>
                <p className="text-sm text-brand-on-surface/60">
                  Real Huaxia posts about cultural adaptation, festivals, food, language, and local
                  customs.
                </p>
              </div>

              <div className="hidden items-center gap-2 rounded-full bg-brand-neutral-soft px-4 py-2 text-xs font-bold text-brand-primary md:flex">
                <BookOpen className="h-4 w-4" />
                Student knowledge
              </div>
            </div>

            {isLoading ? (
              <div className="rounded-xl border border-brand-outline bg-white p-10 text-center text-brand-on-surface/60">
                Loading culture posts...
              </div>
            ) : null}

            {isError ? (
              <div className="rounded-xl border border-brand-danger/20 bg-brand-danger/10 p-10 text-center text-brand-danger">
                Could not load posts. Check the backend server.
              </div>
            ) : null}

            {!isLoading && !isError && visiblePosts.length === 0 ? (
              <div className="rounded-xl border border-dashed border-brand-outline bg-white p-10 text-center">
                <h3 className="mb-2 font-serif text-2xl font-bold">No culture posts yet</h3>
                <p className="text-brand-on-surface/60">
                  Create the first culture discussion above.
                </p>
              </div>
            ) : null}

            {!isLoading && !isError && visiblePosts.length > 0 ? (
              <PostList posts={visiblePosts} />
            ) : null}
          </section>
        </main>

        <aside className="hidden w-80 shrink-0 space-y-6 lg:block">
          <CultureEventsCalendar />
          <TopPostsPanel />
        </aside>
      </div>
    </div>
  );
}