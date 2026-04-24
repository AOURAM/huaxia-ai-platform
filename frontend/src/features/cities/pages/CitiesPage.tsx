import { useMemo, useState } from 'react';
import { Bell, Filter, LogOut, MapPin, Search, UserCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

import { CHINA_CITIES } from '@/constants/chinaCities';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { CityMap } from '@/features/cities/components/CityMap';
import { useAllPosts } from '@/features/feed/hooks/useAllPosts';
import { PostList } from '@/shared/components/post/PostList';

const regionFilters = [
  { label: 'All Regions', value: 'all' },
  { label: 'North', value: 'north' },
  { label: 'South', value: 'south' },
  { label: 'Coastal', value: 'coastal' },
  { label: 'West', value: 'west' },
  { label: 'Central', value: 'central' },
];

export function CitiesPage() {
  const { logout } = useAuth();
  const { data: posts = [], isLoading, isError } = useAllPosts();

  const [query, setQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedCitySlug, setSelectedCitySlug] = useState('shanghai');

  const selectedCity =
    CHINA_CITIES.find((city) => city.slug === selectedCitySlug) ?? CHINA_CITIES[0];

  const filteredCities = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return CHINA_CITIES.filter((city) => {
      const matchesQuery =
        !normalizedQuery ||
        city.name.toLowerCase().includes(normalizedQuery) ||
        city.province.toLowerCase().includes(normalizedQuery) ||
        city.description.toLowerCase().includes(normalizedQuery) ||
        city.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery));

      const matchesRegion = selectedRegion === 'all' || city.region === selectedRegion;

      return matchesQuery && matchesRegion;
    });
  }, [query, selectedRegion]);

  const cityPosts = useMemo(() => {
    return posts.filter((post) => post.page_name === 'cities');
  }, [posts]);

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
              className="flex h-16 items-center border-b-2 border-brand-primary text-sm font-bold text-brand-primary"
            >
              Cities
            </Link>

            <button
              type="button"
              className="flex h-16 items-center border-b-2 border-transparent text-sm font-bold text-brand-on-surface/60"
            >
              Universities
            </button>

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

      <main className="mx-auto max-w-[1280px] px-4 py-10 md:px-6">
        <section className="mb-8">
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-brand-primary">
            Cities
          </p>

          <h1 className="font-serif text-4xl font-bold text-brand-on-surface md:text-5xl">
            Explore student life across Chinese cities
          </h1>

          <p className="mt-3 max-w-2xl text-brand-on-surface/65">
            Browse city-focused posts, compare locations, and discover practical student experiences
            shared by the Huaxia community.
          </p>
        </section>

        <section className="mb-8 rounded-xl border border-brand-outline bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-on-surface/35" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search cities, regions, or historical areas..."
                className="w-full rounded-full border border-transparent bg-brand-neutral-soft py-4 pl-14 pr-5 outline-none transition focus:border-brand-primary focus:bg-white"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {regionFilters.map((filter) => {
                const active = selectedRegion === filter.value;

                return (
                  <button
                    key={filter.value}
                    type="button"
                    onClick={() => setSelectedRegion(filter.value)}
                    className={`rounded-full border px-7 py-3 text-xs font-bold uppercase transition ${
                      active
                        ? 'border-brand-primary bg-brand-primary text-white shadow-md'
                        : 'border-brand-outline bg-white text-brand-on-surface/60 hover:border-brand-primary hover:text-brand-primary'
                    }`}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-8 lg:grid-cols-[1.6fr_0.9fr]">
          <div className="overflow-hidden rounded-2xl border border-brand-outline bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-brand-outline px-6 py-4">
              <h2 className="font-serif text-2xl font-bold">Cultural Map</h2>

              <button
                type="button"
                className="flex items-center gap-2 rounded-xl border border-brand-outline bg-brand-neutral-soft px-4 py-2 text-sm font-bold text-brand-on-surface/60"
              >
                <Filter className="h-4 w-4" />
                Filters
              </button>
            </div>

            <div className="overflow-hidden bg-[#eef2f3]">
              <CityMap
                cities={filteredCities}
                selectedCity={selectedCity}
                onSelectCity={setSelectedCitySlug}
              />
            </div>
          </div>

          <aside className="overflow-hidden rounded-2xl border border-brand-outline bg-white shadow-sm">
            <div className="relative h-48 overflow-hidden">
              <img
                src={selectedCity.imageUrl}
                alt={selectedCity.name}
                className="h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

              <h2 className="absolute bottom-5 left-6 font-serif text-4xl font-bold text-white">
                {selectedCity.name}
              </h2>
            </div>

            <div className="space-y-5 p-6">
              <div className="flex flex-wrap gap-2">
                {selectedCity.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-brand-neutral-soft px-4 py-2 text-xs font-bold uppercase text-brand-on-surface/65"
                  >
                    {tag}
                  </span>
                ))}

                <span className="rounded-full bg-brand-primary px-4 py-2 text-xs font-bold uppercase text-white">
                  AI insights available
                </span>
              </div>

              <p className="text-base leading-relaxed text-brand-on-surface/75">
                {selectedCity.description}
              </p>

              <div className="rounded-xl border border-brand-outline bg-brand-neutral-soft p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-bold text-brand-primary">
                  <MapPin className="h-4 w-4" />
                  Province / Region
                </div>

                <p className="text-sm text-brand-on-surface/70">
                  {selectedCity.province} · {selectedCity.region.toUpperCase()}
                </p>
              </div>

              <div className="rounded-xl border border-brand-outline bg-white p-4">
                <h3 className="mb-2 text-sm font-bold text-brand-on-surface">Student context</h3>
                <p className="text-sm leading-relaxed text-brand-on-surface/60">
                  This city information is currently static JSON. City-specific backend data can be
                  added later without breaking this page.
                </p>
              </div>
            </div>
          </aside>
        </section>

        <section className="mt-12">
          <div className="mb-5">
            <h2 className="font-serif text-3xl font-bold">City discussions</h2>
            <p className="text-sm text-brand-on-surface/60">
              Posts from the Cities section using your existing backend.
            </p>
          </div>

          {isLoading ? (
            <div className="rounded-xl border border-brand-outline bg-white p-8 text-center text-brand-on-surface/60">
              Loading city posts...
            </div>
          ) : null}

          {isError ? (
            <div className="rounded-xl border border-brand-danger/20 bg-brand-danger/10 p-8 text-center text-brand-danger">
              Could not load city posts. Check the backend.
            </div>
          ) : null}

          {!isLoading && !isError ? <PostList posts={cityPosts} /> : null}
        </section>
      </main>
    </div>
  );
}