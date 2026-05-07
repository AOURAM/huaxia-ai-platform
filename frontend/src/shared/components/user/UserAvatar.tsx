import { useEffect, useMemo, useState } from 'react';

import type { AvatarStyle, User } from '@/types/user';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface UserAvatarProps {
  user?: Pick<User, 'id' | 'username' | 'avatar_url' | 'avatar_style' | 'avatar_seed'> | null;
  userId?: number | null;
  username?: string | null;
  imageUrl?: string | null;
  avatarStyle?: AvatarStyle | null;
  avatarSeed?: string | null;
  size?: AvatarSize;
  className?: string;
}

const sizeClasses: Record<AvatarSize, string> = {
  xs: 'h-7 w-7 text-[10px]',
  sm: 'h-10 w-10 text-xs',
  md: 'h-12 w-12 text-sm',
  lg: 'h-20 w-20 text-xl',
  xl: 'h-28 w-28 text-2xl',
};

function buildDiceBearUrl(style?: string | null, seed?: string | null) {
  if (!style || !seed) return null;

  const safeSeed = encodeURIComponent(seed.trim() || 'huaxia-user');
  return `https://api.dicebear.com/9.x/${style}/svg?seed=${safeSeed}&size=128&radius=50`;
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

  return 'U';
}

export function UserAvatar({
  user,
  userId,
  username,
  imageUrl,
  avatarStyle,
  avatarSeed,
  size = 'md',
  className = '',
}: UserAvatarProps) {
  const [imageFailed, setImageFailed] = useState(false);

  const finalUsername = username ?? user?.username ?? null;
  const finalUserId = userId ?? user?.id ?? null;

  const finalImageUrl = useMemo(() => {
    return (
      imageUrl ||
      user?.avatar_url ||
      buildDiceBearUrl(avatarStyle ?? user?.avatar_style, avatarSeed ?? user?.avatar_seed)
    );
  }, [
    avatarSeed,
    avatarStyle,
    imageUrl,
    user?.avatar_seed,
    user?.avatar_style,
    user?.avatar_url,
  ]);

  useEffect(() => {
    setImageFailed(false);
  }, [finalImageUrl]);

  const initials = getInitials(finalUsername, finalUserId);

  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-brand-outline bg-brand-neutral-soft font-black text-brand-primary ${sizeClasses[size]} ${className}`}
      title={finalUsername ?? (finalUserId ? `User #${finalUserId}` : 'User')}
    >
      {finalImageUrl && !imageFailed ? (
        <img
          src={finalImageUrl}
          alt={finalUsername ? `${finalUsername} avatar` : 'User avatar'}
          className="h-full w-full object-cover"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}