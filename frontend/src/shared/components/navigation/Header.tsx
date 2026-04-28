import { LogOut, Settings, UserCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/features/auth/hooks/useAuth';

const navItems = [
  {
    label: 'Home',
    to: ROUTES.home,
  },
  {
    label: 'Cities',
    to: ROUTES.cities,
  },
  {
    label: 'Universities',
    to: ROUTES.universities,
  },
  {
    label: 'Culture',
    to: ROUTES.culture,
  },
  {
    label: 'Daily Life',
    to: ROUTES.dailyLife,
  },
];

function isActivePath(currentPath: string, routePath: string) {
  if (routePath === ROUTES.home) {
    return currentPath === ROUTES.home;
  }

  return currentPath === routePath || currentPath.startsWith(`${routePath}/`);
}

export function Header() {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 border-b border-brand-outline bg-brand-surface/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-4 md:px-6">
        <Link to={ROUTES.home} className="font-serif text-2xl font-bold text-brand-primary">
          Huaxia
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => {
            const active = isActivePath(location.pathname, item.to);

            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex h-16 items-center border-b-2 text-sm font-bold transition ${
                  active
                    ? 'border-brand-primary text-brand-primary'
                    : 'border-transparent text-brand-on-surface/60 hover:text-brand-primary'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={ROUTES.settings}
            className={`rounded-full p-2 transition hover:bg-brand-neutral-soft ${
              isActivePath(location.pathname, ROUTES.settings)
                ? 'text-brand-primary'
                : 'text-brand-on-surface/55 hover:text-brand-primary'
            }`}
            title="Settings"
            aria-label="Settings"
          >
            <Settings className="h-5 w-5" />
          </Link>

          <Link
            to={ROUTES.profile}
            className={`rounded-full p-2 transition hover:bg-brand-neutral-soft ${
              isActivePath(location.pathname, ROUTES.profile)
                ? 'text-brand-primary'
                : 'text-brand-on-surface/55 hover:text-brand-primary'
            }`}
            title="Profile"
            aria-label="Profile"
          >
            <UserCircle className="h-6 w-6" />
          </Link>

          <button
            type="button"
            onClick={logout}
            className="rounded-full p-2 text-brand-on-surface/55 transition hover:bg-brand-neutral-soft hover:text-brand-danger"
            title="Sign out"
            aria-label="Sign out"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </nav>
  );
}