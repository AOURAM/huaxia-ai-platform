import type { AvatarStyle, User } from '@/types/user';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

interface LocalUserAvatarProps {
  user?: User | null;
  userId?: number | null;
  username?: string | null;
  avatarStyle?: AvatarStyle | null;
  avatarSeed?: string | null;
  size?: AvatarSize;
  className?: string;
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: 'h-10 w-10 text-xs',
  md: 'h-14 w-14 text-sm',
  lg: 'h-20 w-20 text-xl',
  xl: 'h-28 w-28 text-2xl',
};

function hashString(value: string) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }

  return Math.abs(hash);
}

function getInitials(username?: string | null, userId?: number | null) {
  const cleanUsername = username?.trim();

  if (cleanUsername) {
    const words = cleanUsername.split(/\s+/).filter(Boolean);

    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }

    return cleanUsername.slice(0, 2).toUpperCase();
  }

  if (userId !== null && userId !== undefined) {
    return `U${userId}`;
  }

  return 'HX';
}

function getStyle(
  user?: User | null,
  avatarStyle?: AvatarStyle | null,
): AvatarStyle {
  return avatarStyle || user?.avatar_style || 'adventurer';
}

function getSeed(user?: User | null, avatarSeed?: string | null) {
  if (avatarSeed) return avatarSeed;
  if (user?.avatar_seed) return user.avatar_seed;
  if (user?.id) return `user-${user.id}`;

  return 'huaxia-user';
}

export function LocalUserAvatar({
  user,
  userId,
  username,
  avatarStyle,
  avatarSeed,
  size = 'sm',
  className = '',
}: LocalUserAvatarProps) {
  const finalUsername = username ?? user?.username ?? null;
  const finalUserId = userId ?? user?.id ?? null;
  const style = getStyle(user, avatarStyle);
  const seed = getSeed(user, avatarSeed);
  const hash = hashString(`${style}-${seed}-${finalUsername ?? finalUserId ?? 'user'}`);
  const initials = getInitials(finalUsername, finalUserId);
  const eyeShape = hash % 2 === 0 ? 'rounded-full' : 'rounded-sm';

  if (style === 'initials') {
    return (
      <div
        className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-brand-outline bg-brand-primary font-black text-white ${sizeClasses[size]} ${className}`}
        title={finalUsername ?? `User #${finalUserId ?? ''}`}
      >
        {initials}
      </div>
    );
  }

  if (style === 'bottts') {
    return (
      <div
        className={`relative shrink-0 overflow-hidden rounded-full border border-brand-outline bg-brand-neutral-soft ${sizeClasses[size]} ${className}`}
        title={finalUsername ?? `User #${finalUserId ?? ''}`}
      >
        <div className="absolute left-1/2 top-[20%] h-[16%] w-[46%] -translate-x-1/2 rounded-full border border-brand-primary bg-white" />
        <div className="absolute left-[30%] top-[48%] h-[12%] w-[12%] rounded-full bg-brand-primary" />
        <div className="absolute right-[30%] top-[48%] h-[12%] w-[12%] rounded-full bg-brand-primary" />
        <div className="absolute bottom-[22%] left-1/2 h-[8%] w-[38%] -translate-x-1/2 rounded-full bg-brand-primary" />
      </div>
    );
  }

  if (style === 'thumbs') {
    return (
      <div
        className={`relative shrink-0 overflow-hidden rounded-full border border-brand-outline bg-white ${sizeClasses[size]} ${className}`}
        title={finalUsername ?? `User #${finalUserId ?? ''}`}
      >
        <div className="absolute inset-[12%] rounded-full bg-brand-neutral-soft" />
        <div className="absolute left-1/2 top-[18%] h-[36%] w-[36%] -translate-x-1/2 rounded-full bg-brand-primary" />
        <div className="absolute bottom-[6%] left-1/2 h-[38%] w-[70%] -translate-x-1/2 rounded-t-full bg-brand-primary/80" />
        <span className="absolute inset-x-0 bottom-[22%] text-center font-serif font-black text-white">
          {initials[0]}
        </span>
      </div>
    );
  }

  if (style === 'personas') {
    return (
      <div
        className={`relative shrink-0 overflow-hidden rounded-full border border-brand-outline bg-brand-neutral-soft ${sizeClasses[size]} ${className}`}
        title={finalUsername ?? `User #${finalUserId ?? ''}`}
      >
        <div className="absolute left-1/2 top-[18%] h-[46%] w-[46%] -translate-x-1/2 rounded-full bg-white" />
        <div className="absolute bottom-0 left-1/2 h-[44%] w-[76%] -translate-x-1/2 rounded-t-full bg-brand-primary" />
        <div className="absolute left-[36%] top-[46%] h-[7%] w-[7%] rounded-full bg-brand-on-surface" />
        <div className="absolute right-[36%] top-[46%] h-[7%] w-[7%] rounded-full bg-brand-on-surface" />
        <div className="absolute left-1/2 top-[62%] h-[5%] w-[26%] -translate-x-1/2 rounded-full bg-brand-primary" />
      </div>
    );
  }

  if (style === 'lorelei') {
    return (
      <div
        className={`relative shrink-0 overflow-hidden rounded-full border border-brand-outline bg-white ${sizeClasses[size]} ${className}`}
        title={finalUsername ?? `User #${finalUserId ?? ''}`}
      >
        <div className="absolute left-1/2 top-[8%] h-[76%] w-[76%] -translate-x-1/2 rounded-full bg-brand-primary/15" />
        <div className="absolute left-1/2 top-[18%] h-[42%] w-[62%] -translate-x-1/2 rounded-t-full bg-brand-primary" />
        <div className="absolute left-1/2 top-[38%] h-[38%] w-[46%] -translate-x-1/2 rounded-full bg-brand-neutral-soft" />
        <div className="absolute left-[38%] top-[54%] h-[6%] w-[6%] rounded-full bg-brand-on-surface" />
        <div className="absolute right-[38%] top-[54%] h-[6%] w-[6%] rounded-full bg-brand-on-surface" />
      </div>
    );
  }

  if (style === 'avataaars') {
    return (
      <div
        className={`relative shrink-0 overflow-hidden rounded-full border border-brand-outline bg-brand-neutral-soft ${sizeClasses[size]} ${className}`}
        title={finalUsername ?? `User #${finalUserId ?? ''}`}
      >
        <div className="absolute left-1/2 top-[8%] h-[28%] w-[70%] -translate-x-1/2 rounded-t-full bg-brand-on-surface" />
        <div className="absolute left-1/2 top-[28%] h-[50%] w-[50%] -translate-x-1/2 rounded-full bg-white" />
        <div className={`absolute left-[36%] top-[48%] h-[7%] w-[7%] ${eyeShape} bg-brand-on-surface`} />
        <div className={`absolute right-[36%] top-[48%] h-[7%] w-[7%] ${eyeShape} bg-brand-on-surface`} />
        <div className="absolute bottom-[18%] left-1/2 h-[5%] w-[28%] -translate-x-1/2 rounded-full bg-brand-primary" />
      </div>
    );
  }

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-full border border-brand-outline bg-brand-neutral-soft ${sizeClasses[size]} ${className}`}
      title={finalUsername ?? `User #${finalUserId ?? ''}`}
    >
      <div className="absolute inset-[12%] rounded-full border border-brand-primary/30" />
      <div className="absolute left-1/2 top-[20%] h-[42%] w-[42%] -translate-x-1/2 rounded-full bg-white" />
      <div className="absolute bottom-[4%] left-1/2 h-[38%] w-[74%] -translate-x-1/2 rounded-t-full bg-brand-primary/80" />
      <div className="absolute left-[36%] top-[46%] h-[7%] w-[7%] rounded-full bg-brand-on-surface" />
      <div className="absolute right-[36%] top-[46%] h-[7%] w-[7%] rounded-full bg-brand-on-surface" />
      <div className="absolute left-1/2 top-[62%] h-[5%] w-[26%] -translate-x-1/2 rounded-full bg-brand-primary" />
    </div>
  );
}