import { useState } from 'react';
import { MapPin, Search } from 'lucide-react';

import { CityMap } from '@/features/cities/components/CityMap';
import { useCities, useCityPosts } from '@/features/cities/hooks/useCities';
import { CreatePostCard } from '@/features/feed/components/CreatePostCard';
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
  const [query, setQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedCitySlug, setSelectedCitySlug] = useState<string | null>(null);

  const {
    data: cities = [],
    isLoading: citiesLoading,
    isError: citiesError,
  } = useCities(selectedRegion, query);

  const selectedCity =
    cities.find((city) => city.slug === selectedCitySlug) ?? cities[0] ?? null;

  const {
    data: cityPosts = [],
    isLoading: postsLoading,
    isError: postsError,
  } = useCityPosts(selectedCity?.slug);

  return (
    <div className="min-h-screen bg-brand-surface">
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
                onChange={(event) => {
                  setQuery(event.target.value);
                  setSelectedCitySlug(null);
                }}
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
                    onClick={() => {
                      setSelectedRegion(filter.value);
                      setSelectedCitySlug(null);
                    }}
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

        {citiesLoading ? (
          <div className="rounded-xl border border-brand-outline bg-white p-10 text-center text-brand-on-surface/60">
            Loading cities...
          </div>
        ) : null}

        {citiesError ? (
          <div className="rounded-xl border border-brand-danger/20 bg-brand-danger/10 p-10 text-center text-brand-danger">
            Could not load cities. Check the backend server.
          </div>
        ) : null}

        {!citiesLoading && !citiesError && cities.length === 0 ? (
          <div className="rounded-xl border border-dashed border-brand-outline bg-white p-10 text-center">
            <h2 className="mb-2 font-serif text-3xl font-bold">No cities found</h2>

            <p className="text-brand-on-surface/60">
              Add cities from Swagger using <strong>POST /cities/</strong>.
            </p>
          </div>
        ) : null}

        {!citiesLoading && !citiesError && selectedCity ? (
          <>
            <section className="grid grid-cols-1 gap-8 lg:grid-cols-[1.6fr_0.9fr]">
              <div className="overflow-hidden rounded-2xl border border-brand-outline bg-white shadow-sm">
                <div className="border-b border-brand-outline px-6 py-4">
                  <h2 className="font-serif text-2xl font-bold">Interactive Cultural Map</h2>

                  <p className="mt-1 text-sm text-brand-on-surface/60">
                    Select a city marker to view its details and related discussions.
                  </p>
                </div>

                <div className="overflow-hidden bg-[#eef2f3]">
                  <CityMap
                    cities={cities}
                    selectedCity={selectedCity}
                    onSelectCity={setSelectedCitySlug}
                  />
                </div>
              </div>

              <aside className="overflow-hidden rounded-2xl border border-brand-outline bg-white shadow-sm">
                <div className="relative h-48 overflow-hidden bg-brand-neutral-soft">
                  {selectedCity.image_url ? (
                    <img
                      src={selectedCity.image_url}
                      alt={selectedCity.name}
                      className="h-full w-full object-cover"
                    />
                  ) : null}

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
                  </div>

                  <p className="text-base leading-relaxed text-brand-on-surface/75">
                    {selectedCity.description}
                  </p>

                  {selectedCity.student_summary ? (
                    <div className="rounded-xl border border-brand-outline bg-white p-4">
                      <h3 className="mb-2 text-sm font-bold text-brand-on-surface">
                        Student summary
                      </h3>

                      <p className="text-sm leading-relaxed text-brand-on-surface/60">
                        {selectedCity.student_summary}
                      </p>
                    </div>
                  ) : null}

                  <div className="rounded-xl border border-brand-outline bg-brand-neutral-soft p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-bold text-brand-primary">
                      <MapPin className="h-4 w-4" />
                      Province / Region
                    </div>

                    <p className="text-sm text-brand-on-surface/70">
                      {selectedCity.province} · {selectedCity.region.toUpperCase()}
                    </p>

                    {selectedCity.cost_level ? (
                      <p className="mt-2 text-sm text-brand-on-surface/70">
                        Cost level: <strong>{selectedCity.cost_level}</strong>
                      </p>
                    ) : null}
                  </div>

                  {selectedCity.popular_universities.length > 0 ? (
                    <div className="rounded-xl border border-brand-outline bg-white p-4">
                      <h3 className="mb-3 text-sm font-bold text-brand-on-surface">
                        Popular universities
                      </h3>

                      <ul className="space-y-2 text-sm text-brand-on-surface/65">
                        {selectedCity.popular_universities.map((university) => (
                          <li key={university}>• {university}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {selectedCity.highlights.length > 0 ? (
                    <div className="rounded-xl border border-brand-outline bg-white p-4">
                      <h3 className="mb-3 text-sm font-bold text-brand-on-surface">
                        Highlights
                      </h3>

                      <div className="flex flex-wrap gap-2">
                        {selectedCity.highlights.map((highlight) => (
                          <span
                            key={highlight}
                            className="rounded-full bg-brand-neutral-soft px-3 py-1 text-xs font-semibold text-brand-on-surface/70"
                          >
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              </aside>
            </section>

            <section className="mt-8">
              <CreatePostCard pageName="cities" cityId={selectedCity.id} />
            </section>

            <section className="mt-8">
              <div className="mb-5">
                <h2 className="font-serif text-3xl font-bold">
                  {selectedCity.name} discussions
                </h2>

                <p className="text-sm text-brand-on-surface/60">
                  Posts connected to this city using your backend city_id relation.
                </p>
              </div>

              {postsLoading ? (
                <div className="rounded-xl border border-brand-outline bg-white p-8 text-center text-brand-on-surface/60">
                  Loading city posts...
                </div>
              ) : null}

              {postsError ? (
                <div className="rounded-xl border border-brand-danger/20 bg-brand-danger/10 p-8 text-center text-brand-danger">
                  Could not load city posts. Check the backend.
                </div>
              ) : null}

              {!postsLoading && !postsError && cityPosts.length === 0 ? (
                <div className="rounded-xl border border-dashed border-brand-outline bg-white p-10 text-center">
                  <h3 className="mb-2 font-serif text-2xl font-bold">
                    No posts for {selectedCity.name} yet
                  </h3>

                  <p className="text-brand-on-surface/60">
                    Create the first city-specific discussion above.
                  </p>
                </div>
              ) : null}

              {!postsLoading && !postsError && cityPosts.length > 0 ? (
                <PostList posts={cityPosts} />
              ) : null}
            </section>
          </>
        ) : null}
      </main>
    </div>
  );
}