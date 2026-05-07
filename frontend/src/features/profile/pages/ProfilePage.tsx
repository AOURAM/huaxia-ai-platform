import {
  CalendarDays,
  Check,
  LogOut,
  Mail,
  MessageSquareText,
  Pencil,
  RefreshCcw,
  Save,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useAllPosts } from '@/features/feed/hooks/useAllPosts';
import {
  useCurrentUser,
  useUpdateCurrentUser,
} from '@/features/profile/hooks/useCurrentUser';
import { ApiError } from '@/lib/http';
import { PostList } from '@/shared/components/post/PostList';
import type { AvatarStyle, GenderValue, User } from '@/types/user';

interface ProfileFormState {
  username: string;
  bio: string;
  gender: GenderValue | '';
  avatar_style: AvatarStyle;
  avatar_seed: string;
}

const avatarStyles: Array<{
  value: AvatarStyle;
  label: string;
}> = [
  { value: 'adventurer', label: 'Adventurer' },
  { value: 'avataaars', label: 'Avataaars' },
  { value: 'bottts', label: 'Bottts' },
  { value: 'lorelei', label: 'Lorelei' },
  { value: 'thumbs', label: 'Thumbs' },
  { value: 'personas', label: 'Personas' },
  { value: 'initials', label: 'Initials' },
];

const genderOptions: Array<{
  value: GenderValue;
  label: string;
}> = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
  { value: 'non_binary', label: 'Non-binary' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
];

function formatJoinDate(dateValue?: string) {
  if (!dateValue) {
    return 'Recently joined';
  }

  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateValue));
}

function formatGender(gender?: GenderValue | null) {
  if (!gender) {
    return 'Not set';
  }

  const option = genderOptions.find((item) => item.value === gender);
  return option?.label ?? 'Not set';
}

function getDefaultAvatarSeed(user?: User | null) {
  if (!user) {
    return 'huaxia-user';
  }

  return user.avatar_seed || `user-${user.id}`;
}

function getDefaultAvatarStyle(user?: User | null): AvatarStyle {
  return user?.avatar_style || 'adventurer';
}

function buildInitialFormState(user?: User | null): ProfileFormState {
  return {
    username: user?.username ?? '',
    bio: user?.bio ?? '',
    gender: user?.gender ?? '',
    avatar_style: getDefaultAvatarStyle(user),
    avatar_seed: getDefaultAvatarSeed(user),
  };
}

function hashString(value: string) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }

  return Math.abs(hash);
}

function getInitials(username: string) {
  const cleanUsername = username.trim();

  if (!cleanUsername) {
    return 'HX';
  }

  const words = cleanUsername.split(/\s+/).filter(Boolean);

  if (words.length >= 2) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }

  return cleanUsername.slice(0, 2).toUpperCase();
}

interface LocalAvatarProps {
  username: string;
  style: AvatarStyle;
  seed: string;
  size?: 'lg' | 'xl';
}

function LocalAvatar({
  username,
  style,
  seed,
  size = 'xl',
}: LocalAvatarProps) {
  const hash = hashString(`${style}-${seed}-${username}`);
  const initials = getInitials(username);

  const sizeClass = size === 'xl' ? 'h-28 w-28 text-3xl' : 'h-24 w-24 text-2xl';

  const faceOffset = hash % 3;
  const eyeShape = hash % 2 === 0 ? 'rounded-full' : 'rounded-sm';
  const mouthWidth = hash % 2 === 0 ? 'w-8' : 'w-5';

  if (style === 'initials') {
    return (
      <div
        className={`${sizeClass} flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-brand-outline bg-brand-primary font-serif font-black text-white shadow-sm`}
      >
        {initials}
      </div>
    );
  }

  if (style === 'bottts') {
    return (
      <div
        className={`${sizeClass} relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-brand-outline bg-brand-neutral-soft shadow-sm`}
      >
        <div className="absolute top-5 h-4 w-12 rounded-full border border-brand-primary bg-white" />
        <div className="absolute left-5 top-10 h-3 w-3 rounded-full bg-brand-primary" />
        <div className="absolute right-5 top-10 h-3 w-3 rounded-full bg-brand-primary" />
        <div className="absolute bottom-6 h-2 w-10 rounded-full bg-brand-primary/80" />
        <div className="absolute bottom-2 text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary">
          bot
        </div>
      </div>
    );
  }

  if (style === 'thumbs') {
    return (
      <div
        className={`${sizeClass} relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-brand-outline bg-white shadow-sm`}
      >
        <div className="absolute inset-3 rounded-full bg-brand-neutral-soft" />
        <div className="absolute top-6 h-9 w-9 rounded-full bg-brand-primary/90" />
        <div className="absolute bottom-5 h-8 w-16 rounded-t-full bg-brand-primary/80" />
        <span className="relative z-10 mt-2 font-serif font-black text-white">
          {initials[0]}
        </span>
      </div>
    );
  }

  if (style === 'personas') {
    return (
      <div
        className={`${sizeClass} relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-brand-outline bg-brand-neutral-soft shadow-sm`}
      >
        <div className="absolute top-5 h-14 w-14 rounded-full bg-white" />
        <div className="absolute bottom-3 h-12 w-20 rounded-t-full bg-brand-primary" />
        <div className="absolute left-10 top-11 h-2 w-2 rounded-full bg-brand-on-surface" />
        <div className="absolute right-10 top-11 h-2 w-2 rounded-full bg-brand-on-surface" />
        <div className="absolute top-16 h-1 w-8 rounded-full bg-brand-primary" />
      </div>
    );
  }

  if (style === 'lorelei') {
    return (
      <div
        className={`${sizeClass} relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-brand-outline bg-white shadow-sm`}
      >
        <div className="absolute top-4 h-20 w-20 rounded-full bg-brand-primary/15" />
        <div className="absolute top-7 h-12 w-16 rounded-t-full bg-brand-primary" />
        <div className="absolute top-12 h-10 w-12 rounded-full bg-brand-neutral-soft" />
        <div className="absolute left-10 top-15 h-2 w-2 rounded-full bg-brand-on-surface" />
        <div className="absolute right-10 top-15 h-2 w-2 rounded-full bg-brand-on-surface" />
      </div>
    );
  }

  if (style === 'avataaars') {
    return (
      <div
        className={`${sizeClass} relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-brand-outline bg-brand-neutral-soft shadow-sm`}
      >
        <div className="absolute top-4 h-9 w-20 rounded-t-full bg-brand-on-surface" />
        <div className="absolute top-10 h-14 w-14 rounded-full bg-white" />
        <div className={`absolute top-${faceOffset + 14} left-10 h-2 w-2 ${eyeShape} bg-brand-on-surface`} />
        <div className={`absolute top-${faceOffset + 14} right-10 h-2 w-2 ${eyeShape} bg-brand-on-surface`} />
        <div className={`absolute bottom-8 h-1 ${mouthWidth} rounded-full bg-brand-primary`} />
      </div>
    );
  }

  return (
    <div
      className={`${sizeClass} relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-brand-outline bg-brand-neutral-soft shadow-sm`}
    >
      <div className="absolute inset-3 rounded-full border border-brand-primary/30" />
      <div className="absolute top-6 h-11 w-11 rounded-full bg-white" />
      <div className="absolute bottom-4 h-10 w-20 rounded-t-full bg-brand-primary/80" />
      <div className="absolute left-10 top-12 h-2 w-2 rounded-full bg-brand-on-surface" />
      <div className="absolute right-10 top-12 h-2 w-2 rounded-full bg-brand-on-surface" />
      <div className="absolute top-17 h-1 w-8 rounded-full bg-brand-primary" />
    </div>
  );
}

export function ProfilePage() {
  const { logout } = useAuth();

  const {
    data: user,
    isLoading: isUserLoading,
    isError: isUserError,
  } = useCurrentUser();

  const {
    data: allPosts = [],
    isLoading: arePostsLoading,
    isError: arePostsError,
  } = useAllPosts();

  const updateProfileMutation = useUpdateCurrentUser();

  const [isEditing, setIsEditing] = useState(false);
  const [formState, setFormState] = useState(() => buildInitialFormState(null));
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormState(buildInitialFormState(user));
    }
  }, [user]);

  const userPosts = user ? allPosts.filter((post) => post.user_id === user.id) : [];

  const visibleAvatarState = useMemo(() => {
    if (isEditing) {
      return {
        username: formState.username,
        style: formState.avatar_style,
        seed: formState.avatar_seed,
      };
    }

    return {
      username: user?.username ?? '',
      style: getDefaultAvatarStyle(user),
      seed: getDefaultAvatarSeed(user),
    };
  }, [
    formState.avatar_seed,
    formState.avatar_style,
    formState.username,
    isEditing,
    user,
  ]);

  const updateForm = <K extends keyof ProfileFormState>(
    key: K,
    value: ProfileFormState[K],
  ) => {
    setSuccessMessage(null);
    setFormState((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const randomizeAvatarSeed = () => {
    if (!user) {
      return;
    }

    updateForm('avatar_seed', `user-${user.id}-${Date.now()}`);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSuccessMessage(null);
    setFormState(buildInitialFormState(user));
    updateProfileMutation.reset();
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!user || updateProfileMutation.isPending) {
      return;
    }

    const username = formState.username.trim();
    const avatarSeed = formState.avatar_seed.trim() || `user-${user.id}`;

    if (!username) {
      return;
    }

    updateProfileMutation.mutate(
      {
        username,
        bio: formState.bio.trim() || null,
        gender: formState.gender || null,
        avatar_style: formState.avatar_style,
        avatar_seed: avatarSeed,
      },
      {
        onSuccess: (updatedUser) => {
          setSuccessMessage('Profile updated successfully.');
          setIsEditing(false);
          setFormState(buildInitialFormState(updatedUser));
        },
      },
    );
  };

  const profileErrorMessage =
    updateProfileMutation.error instanceof ApiError
      ? updateProfileMutation.error.message
      : updateProfileMutation.isError
        ? 'Could not update your profile. Try again.'
        : null;

  return (
    <div className="min-h-screen bg-brand-neutral-soft">
      <main className="mx-auto max-w-6xl px-6 py-10">
        {isUserLoading ? (
          <div className="rounded-3xl border border-brand-outline bg-white p-10 text-center text-sm font-bold text-brand-on-surface/55">
            Loading profile...
          </div>
        ) : null}

        {isUserError ? (
          <div className="rounded-3xl border border-brand-danger/20 bg-brand-danger/10 p-10 text-center text-sm font-bold text-brand-danger">
            Could not load your profile. Check that you are logged in.
          </div>
        ) : null}

        {!isUserLoading && !isUserError && user ? (
          <>
            <section className="rounded-3xl border border-brand-outline bg-white p-8 shadow-sm">
              <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
                <div className="flex flex-col gap-6 md:flex-row md:items-center">
                  <LocalAvatar
                    username={visibleAvatarState.username}
                    style={visibleAvatarState.style}
                    seed={visibleAvatarState.seed}
                    size="xl"
                  />

                  <div>
                    <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.35em] text-brand-primary">
                      <ShieldCheck className="h-4 w-4" />
                      User profile
                    </div>

                    <h1 className="font-serif text-5xl font-black text-brand-on-surface">
                      {user.username}
                    </h1>

                    <div className="mt-4 flex items-center gap-2 text-sm font-bold text-brand-on-surface/55">
                      <Mail className="h-4 w-4" />
                      {user.email}
                    </div>

                    <p className="mt-3 text-sm font-bold text-brand-on-surface/55">
                      Gender: {formatGender(user.gender)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing((previous) => !previous);
                      setSuccessMessage(null);
                      updateProfileMutation.reset();
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-outline bg-brand-neutral-soft px-5 py-3 text-sm font-bold text-brand-primary transition hover:border-brand-primary"
                  >
                    {isEditing ? <X className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
                    {isEditing ? 'Close editor' : 'Edit profile'}
                  </button>

                  <button
                    type="button"
                    onClick={logout}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-outline bg-white px-5 py-3 text-sm font-bold text-brand-on-surface/65 transition hover:bg-brand-neutral-soft"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </div>

              {!isEditing ? (
                <div className="mt-8 rounded-2xl border border-brand-outline bg-brand-surface p-6">
                  <h2 className="font-serif text-2xl font-black text-brand-on-surface">
                    Bio
                  </h2>

                  <p className="mt-3 text-sm leading-relaxed text-brand-on-surface/60">
                    {user.bio || 'No bio added yet. Edit your profile to introduce yourself.'}
                  </p>
                </div>
              ) : null}

              {successMessage ? (
                <div className="mt-6 flex items-center gap-2 rounded-xl border border-brand-primary/20 bg-brand-primary/10 p-4 text-sm font-bold text-brand-primary">
                  <Check className="h-4 w-4" />
                  {successMessage}
                </div>
              ) : null}

              {isEditing ? (
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                  <section className="rounded-3xl border border-brand-outline bg-brand-surface p-6">
                    <h2 className="font-serif text-3xl font-black text-brand-on-surface">
                      Avatar
                    </h2>

                    <p className="mt-2 text-sm text-brand-on-surface/60">
                      Choose a generated avatar style. No upload is needed.
                    </p>

                    <div className="mt-7 flex flex-col gap-6 md:flex-row md:items-center">
                      <LocalAvatar
                        username={formState.username || user.username}
                        style={formState.avatar_style}
                        seed={formState.avatar_seed}
                        size="lg"
                      />

                      <button
                        type="button"
                        onClick={randomizeAvatarSeed}
                        className="inline-flex w-fit items-center justify-center gap-2 rounded-full border border-brand-outline bg-white px-5 py-3 text-sm font-bold text-brand-primary transition hover:border-brand-primary"
                      >
                        <RefreshCcw className="h-4 w-4" />
                        New avatar
                      </button>
                    </div>

                    <div className="mt-7 grid gap-3 sm:grid-cols-2">
                      {avatarStyles.map((style) => {
                        const active = formState.avatar_style === style.value;

                        return (
                          <button
                            key={style.value}
                            type="button"
                            onClick={() => updateForm('avatar_style', style.value)}
                            className={`rounded-xl border px-3 py-3 text-sm font-bold transition ${
                              active
                                ? 'border-brand-primary bg-brand-primary text-white'
                                : 'border-brand-outline bg-white text-brand-on-surface/65 hover:border-brand-primary hover:text-brand-primary'
                            }`}
                          >
                            {style.label}
                          </button>
                        );
                      })}
                    </div>
                  </section>

                  <section className="rounded-3xl border border-brand-outline bg-brand-surface p-6">
                    <h2 className="font-serif text-3xl font-black text-brand-on-surface">
                      Profile details
                    </h2>

                    <div className="mt-6 grid gap-5 md:grid-cols-2">
                      <label className="block">
                        <span className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-brand-on-surface/45">
                          Display name
                        </span>
                        <input
                          value={formState.username}
                          onChange={(event) => updateForm('username', event.target.value)}
                          className="w-full rounded-xl border border-brand-outline bg-white px-4 py-3 text-brand-on-surface outline-none transition placeholder:text-brand-on-surface/35 focus:border-brand-primary"
                          placeholder="Your display name"
                          required
                        />
                      </label>

                      <label className="block">
                        <span className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-brand-on-surface/45">
                          Gender
                        </span>
                        <select
                          value={formState.gender}
                          onChange={(event) =>
                            updateForm('gender', event.target.value as GenderValue | '')
                          }
                          className="w-full rounded-xl border border-brand-outline bg-white px-4 py-3 text-brand-on-surface outline-none transition focus:border-brand-primary"
                        >
                          <option value="">Not set</option>
                          {genderOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="block md:col-span-2">
                        <span className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-brand-on-surface/45">
                          Bio
                        </span>
                        <textarea
                          value={formState.bio}
                          onChange={(event) => updateForm('bio', event.target.value)}
                          className="min-h-[140px] w-full resize-none rounded-xl border border-brand-outline bg-white px-4 py-3 text-brand-on-surface outline-none transition placeholder:text-brand-on-surface/35 focus:border-brand-primary"
                          maxLength={500}
                          placeholder="Write a short introduction about yourself..."
                        />
                        <span className="mt-2 block text-right text-xs font-semibold text-brand-on-surface/45">
                          {formState.bio.length}/500
                        </span>
                      </label>
                    </div>
                  </section>

                  {profileErrorMessage ? (
                    <div className="rounded-xl border border-brand-danger/20 bg-brand-danger/10 p-4 text-sm font-semibold text-brand-danger">
                      {profileErrorMessage}
                    </div>
                  ) : null}

                  <div className="flex flex-wrap justify-end gap-3">
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-outline bg-white px-5 py-3 text-sm font-bold text-brand-on-surface/65 transition hover:bg-brand-neutral-soft"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={updateProfileMutation.isPending || !formState.username.trim()}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-primary px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-primary-hover disabled:opacity-60"
                    >
                      <Save className="h-4 w-4" />
                      {updateProfileMutation.isPending ? 'Saving...' : 'Save profile'}
                    </button>
                  </div>
                </form>
              ) : null}

              <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-brand-outline bg-brand-surface p-5">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-neutral-soft text-brand-primary">
                    <MessageSquareText className="h-5 w-5" />
                  </div>
                  <p className="font-serif text-3xl font-bold text-brand-primary">
                    {userPosts.length}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-brand-on-surface/55">
                    Posts created
                  </p>
                </div>

                <div className="rounded-2xl border border-brand-outline bg-brand-surface p-5">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-neutral-soft text-brand-primary">
                    <CalendarDays className="h-5 w-5" />
                  </div>
                  <p className="font-serif text-xl font-bold text-brand-on-surface">
                    {formatJoinDate(user.created_at)}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-brand-on-surface/55">
                    Account date
                  </p>
                </div>

                <div className="rounded-2xl border border-brand-outline bg-brand-surface p-5">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-neutral-soft text-brand-primary">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <p className="font-serif text-xl font-bold text-brand-on-surface">
                    Active
                  </p>
                  <p className="mt-1 text-sm font-semibold text-brand-on-surface/55">
                    Session status
                  </p>
                </div>
              </div>
            </section>

            <section className="mt-10">
              <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <h2 className="font-serif text-3xl font-bold text-brand-on-surface">
                    My discussions
                  </h2>
                  <p className="text-sm text-brand-on-surface/60">
                    Posts you created across Huaxia thematic pages.
                  </p>
                </div>

                <Link
                  to={ROUTES.home}
                  className="inline-flex items-center justify-center rounded-full border border-brand-outline bg-white px-5 py-3 text-sm font-bold text-brand-primary transition hover:bg-brand-neutral-soft"
                >
                  Back to feed
                </Link>
              </div>

              {arePostsLoading ? (
                <div className="rounded-xl border border-brand-outline bg-white p-10 text-center text-brand-on-surface/60">
                  Loading your posts...
                </div>
              ) : null}

              {arePostsError ? (
                <div className="rounded-xl border border-brand-danger/20 bg-brand-danger/10 p-10 text-center text-brand-danger">
                  Could not load your posts.
                </div>
              ) : null}

              {!arePostsLoading && !arePostsError && userPosts.length === 0 ? (
                <div className="rounded-xl border border-dashed border-brand-outline bg-white p-10 text-center">
                  <h3 className="mb-2 font-serif text-2xl font-bold">
                    You have not created posts yet
                  </h3>

                  <p className="mb-5 text-brand-on-surface/60">
                    Go to a thematic page and create your first discussion.
                  </p>

                  <div className="flex flex-wrap justify-center gap-3">
                    <Link
                      to={ROUTES.universities}
                      className="rounded-full border border-brand-outline bg-brand-neutral-soft px-4 py-2 text-sm font-bold text-brand-primary transition hover:border-brand-primary"
                    >
                      Universities
                    </Link>

                    <Link
                      to={ROUTES.culture}
                      className="rounded-full border border-brand-outline bg-brand-neutral-soft px-4 py-2 text-sm font-bold text-brand-primary transition hover:border-brand-primary"
                    >
                      Culture
                    </Link>

                    <Link
                      to={ROUTES.dailyLife}
                      className="rounded-full border border-brand-outline bg-brand-neutral-soft px-4 py-2 text-sm font-bold text-brand-primary transition hover:border-brand-primary"
                    >
                      Daily Life
                    </Link>
                  </div>
                </div>
              ) : null}

              {!arePostsLoading && !arePostsError && userPosts.length > 0 ? (
                <PostList posts={userPosts} />
              ) : null}
            </section>
          </>
        ) : null}
      </main>
    </div>
  );
}