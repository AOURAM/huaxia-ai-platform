import { Moon, Settings, Sun, UserCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';
import { useTheme, type AppearanceMode } from '@/features/settings/context/ThemeProvider';

const appearanceOptions: Array<{
  value: AppearanceMode;
  title: string;
  description: string;
  icon: typeof Sun;
}> = [
  {
    value: 'light',
    title: 'Light mode',
    description: 'Warm paper-like interface with Huaxia red accents.',
    icon: Sun,
  },
  {
    value: 'night',
    title: 'Night mode',
    description: 'Soft dark burgundy interface, not pure black, easier for late study sessions.',
    icon: Moon,
  },
];

export function SettingsPage() {
  const { appearance, setAppearance } = useTheme();

  return (
    <div className="min-h-screen bg-brand-surface">
      <main className="mx-auto w-full max-w-[1280px] space-y-8 px-4 py-8 md:px-6">
        <section className="rounded-3xl border border-brand-outline bg-white p-7 shadow-sm md:p-8">
          <p className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-brand-primary">
            <Settings className="h-4 w-4" />
            Settings
          </p>

          <h1 className="font-serif text-4xl font-bold text-brand-on-surface md:text-5xl">
            Appearance settings
          </h1>

          <p className="mt-3 max-w-2xl text-brand-on-surface/65">
            Choose how Huaxia looks while keeping the same red academic style and readable layout.
          </p>
        </section>

        <section className="rounded-2xl border border-brand-outline bg-white p-5 shadow-sm">
          <div className="mb-5 border-b border-brand-outline/60 pb-4">
            <h2 className="font-serif text-2xl font-bold text-brand-on-surface">
              Theme mode
            </h2>

            <p className="mt-1 text-sm text-brand-on-surface/60">
              This setting is saved in your browser.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {appearanceOptions.map((option) => {
              const Icon = option.icon;
              const active = appearance === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setAppearance(option.value)}
                  className={`rounded-2xl border p-5 text-left transition ${
                    active
                      ? 'border-brand-primary bg-brand-neutral-soft shadow-sm'
                      : 'border-brand-outline bg-white hover:border-brand-primary hover:bg-brand-neutral-soft'
                  }`}
                  aria-pressed={active}
                >
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                        active
                          ? 'bg-brand-primary text-white'
                          : 'bg-brand-neutral-soft text-brand-primary'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-wide ${
                        active
                          ? 'bg-brand-primary text-white'
                          : 'bg-brand-neutral-soft text-brand-on-surface/55'
                      }`}
                    >
                      {active ? 'Active' : 'Select'}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-brand-on-surface">
                    {option.title}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-brand-on-surface/60">
                    {option.description}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl border border-brand-outline bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-serif text-2xl font-bold text-brand-on-surface">
                Account settings
              </h2>

              <p className="mt-1 text-sm text-brand-on-surface/60">
                Profile details are shown on the user page.
              </p>
            </div>

            <Link
              to={ROUTES.profile}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-outline bg-brand-neutral-soft px-5 py-3 text-sm font-bold text-brand-primary transition hover:border-brand-primary"
            >
              <UserCircle className="h-5 w-5" />
              Open profile
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}