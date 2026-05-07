import { LogOut, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useCurrentUser } from '@/features/profile/hooks/useCurrentUser';
import type { AvatarStyle, User } from '@/types/user';

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

function hashString(value: string) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }

  return Math.abs(hash);
}

function getInitials(username?: string | null) {
  const cleanUsername = username?.trim();

  if (!cleanUsername) {
    return 'HX';
  }

  const words = cleanUsername.split(/\s+/).filter(Boolean);

  if (words.length >= 2) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }

  return cleanUsername.slice(0, 2).toUpperCase();
}

function getAvatarStyle(user?: User | null): AvatarStyle {
  return user?.avatar_style || 'adventurer';
}

function getAvatarSeed(user?: User | null) {
  if (!user) {
    return 'huaxia-user';
  }

  return user.avatar_seed || `user-${user.id}`;
}

interface HeaderAvatarProps {
  user?: User | null;
}

function HeaderAvatar({ user }: HeaderAvatarProps) {
  const username = user?.username ?? 'Huaxia user';
  const style = getAvatarStyle(user);
  const seed = getAvatarSeed(user);
  const hash = hashString(`${style}-${seed}-${username}`);
  const initials = getInitials(username);

  const eyeShape = hash % 2 === 0 ? 'rounded-full' : 'rounded-sm';

  if (style === 'initials') {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-outline bg-brand-primary font-black text-white">
        {initials}
      </div>
    );
  }

  if (style === 'bottts') {
    return (
      <div className="relative h-10 w-10 overflow-hidden rounded-full border border-brand-outline bg-brand-neutral-soft">
        <div className="absolute left-1/2 top-2 h-2 w-5 -translate-x-1/2 rounded-full border border-brand-primary bg-white" />
        <div className="absolute left-3 top-5 h-1.5 w-1.5 rounded-full bg-brand-primary" />
        <div className="absolute right-3 top-5 h-1.5 w-1.5 rounded-full bg-brand-primary" />
        <div className="absolute bottom-2 left-1/2 h-1 w-4 -translate-x-1/2 rounded-full bg-brand-primary" />
      </div>
    );
  }

  if (style === 'thumbs') {
    return (
      <div className="relative h-10 w-10 overflow-hidden rounded-full border border-brand-outline bg-white">
        <div className="absolute inset-1.5 rounded-full bg-brand-neutral-soft" />
        <div className="absolute left-1/2 top-2 h-4 w-4 -translate-x-1/2 rounded-full bg-brand-primary" />
        <div className="absolute bottom-1 left-1/2 h-4 w-7 -translate-x-1/2 rounded-t-full bg-brand-primary/80" />
      </div>
    );
  }

  if (style === 'personas') {
    return (
      <div className="relative h-10 w-10 overflow-hidden rounded-full border border-brand-outline bg-brand-neutral-soft">
        <div className="absolute left-1/2 top-2 h-5 w-5 -translate-x-1/2 rounded-full bg-white" />
        <div className="absolute bottom-0 left-1/2 h-5 w-8 -translate-x-1/2 rounded-t-full bg-brand-primary" />
        <div className="absolute left-[14px] top-[18px] h-1 w-1 rounded-full bg-brand-on-surface" />
        <div className="absolute right-[14px] top-[18px] h-1 w-1 rounded-full bg-brand-on-surface" />
      </div>
    );
  }

  if (style === 'lorelei') {
    return (
      <div className="relative h-10 w-10 overflow-hidden rounded-full border border-brand-outline bg-white">
        <div className="absolute left-1/2 top-1 h-8 w-8 -translate-x-1/2 rounded-full bg-brand-primary/15" />
        <div className="absolute left-1/2 top-2 h-5 w-7 -translate-x-1/2 rounded-t-full bg-brand-primary" />
        <div className="absolute left-1/2 top-4 h-5 w-6 -translate-x-1/2 rounded-full bg-brand-neutral-soft" />
        <div className="absolute left-[14px] top-[21px] h-1 w-1 rounded-full bg-brand-on-surface" />
        <div className="absolute right-[14px] top-[21px] h-1 w-1 rounded-full bg-brand-on-surface" />
      </div>
    );
  }

  if (style === 'avataaars') {
    return (
      <div className="relative h-10 w-10 overflow-hidden rounded-full border border-brand-outline bg-brand-neutral-soft">
        <div className="absolute left-1/2 top-1 h-4 w-8 -translate-x-1/2 rounded-t-full bg-brand-on-surface" />
        <div className="absolute left-1/2 top-3 h-6 w-6 -translate-x-1/2 rounded-full bg-white" />
        <div className={`absolute left-[14px] top-[19px] h-1 w-1 ${eyeShape} bg-brand-on-surface`} />
        <div className={`absolute right-[14px] top-[19px] h-1 w-1 ${eyeShape} bg-brand-on-surface`} />
        <div className="absolute bottom-2 left-1/2 h-1 w-4 -translate-x-1/2 rounded-full bg-brand-primary" />
      </div>
    );
  }

  return (
    <div className="relative h-10 w-10 overflow-hidden rounded-full border border-brand-outline bg-brand-neutral-soft">
      <div className="absolute inset-1 rounded-full border border-brand-primary/30" />
      <div className="absolute left-1/2 top-2 h-5 w-5 -translate-x-1/2 rounded-full bg-white" />
      <div className="absolute bottom-1 left-1/2 h-4 w-8 -translate-x-1/2 rounded-t-full bg-brand-primary/80" />
      <div className="absolute left-[14px] top-[18px] h-1 w-1 rounded-full bg-brand-on-surface" />
      <div className="absolute right-[14px] top-[18px] h-1 w-1 rounded-full bg-brand-on-surface" />
    </div>
  );
}

export function Header() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { data: freshUser } = useCurrentUser();

  const displayUser = freshUser ?? user;

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
            className="transition hover:opacity-80"
            title={displayUser?.username ?? 'Profile'}
          >
            <HeaderAvatar user={displayUser} />
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