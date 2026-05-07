import { LogOut, Settings, UserCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/features/auth/hooks/useAuth';

const navItems = [
  { label: 'Home', to: ROUTES.home },
  { label: 'Cities', to: ROUTES.cities },
  { label: 'Universities', to: ROUTES.universities },
  { label: 'Culture', to: ROUTES.culture },
  { label: 'Daily Life', to: ROUTES.dailyLife },
];

function isActivePath(currentPath: string, routePath: string) {
  if (routePath === ROUTES.home) {
    return currentPath === ROUTES.home;
  }

  return currentPath === routePath || currentPath.startsWith(`${routePath}/`);
}

export function Header() {
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-brand-outline bg-brand-surface/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
        <Link
          to={ROUTES.home}
          className="font-serif text-3xl font-black tracking-tight text-brand-on-surface"
        >
          Huaxia
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => {
            const active = isActivePath(location.pathname, item.to);

            return (
              <Link
                key={item.to}
                to={item.to}
                className={`relative py-3 text-sm font-black transition ${
                  active
                    ? 'text-brand-on-surface'
                    : 'text-brand-on-surface/55 hover:text-brand-on-surface'
                }`}
              >
                {item.label}
                {active ? (
                  <span className="absolute inset-x-0 -bottom-4 h-0.5 rounded-full bg-brand-primary" />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            to={ROUTES.settings}
            aria-label="Settings"
            className="rounded-full p-2 text-brand-on-surface/55 transition hover:bg-brand-neutral-soft hover:text-brand-primary"
          >
            <Settings className="h-5 w-5" />
          </Link>

          <Link
            to={ROUTES.profile}
            aria-label="Profile"
            className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-brand-outline bg-brand-neutral-soft text-sm font-black text-brand-primary transition hover:border-brand-primary"
            title={user?.username ?? 'Profile'}
          >
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.username}
                className="h-full w-full object-cover"
              />
            ) : user?.username ? (
              user.username.slice(0, 2).toUpperCase()
            ) : (
              <UserCircle className="h-6 w-6" />
            )}
          </Link>

          <button
            type="button"
            onClick={logout}
            aria-label="Log out"
            className="rounded-full p-2 text-brand-on-surface/55 transition hover:bg-brand-neutral-soft hover:text-brand-danger"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}