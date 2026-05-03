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
  UserCircle,
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

function buildDiceBearAvatarUrl(style: AvatarStyle, seed: string) {
  const safeSeed = encodeURIComponent(seed.trim() || 'huaxia-user');

  return `https://api.dicebear.com/9.x/${style}/svg?seed=${safeSeed}&size=128&radius=50`;
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
  const [formState, setFormState] = useState<ProfileFormState>(() => buildInitialFormState(null));
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormState(buildInitialFormState(user));
    }
  }, [user]);

  const userPosts = user ? allPosts.filter((post) => post.user_id === user.id) : [];

  const avatarPreviewUrl = useMemo(() => {
    return buildDiceBearAvatarUrl(formState.avatar_style, formState.avatar_seed);
  }, [formState.avatar_seed, formState.avatar_style]);

  const visibleAvatarUrl = isEditing
    ? avatarPreviewUrl
    : user?.avatar_url || buildDiceBearAvatarUrl(getDefaultAvatarStyle(user), getDefaultAvatarSeed(user));

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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
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
    <div className="min-h-screen bg-brand-surface">
      <main className="mx-auto w-full max-w-[1280px] space-y-8 px-4 py-8 md:px-6">
        {isUserLoading ? (
          <section className="rounded-2xl border border-brand-outline bg-white p-10 text-center text-brand-on-surface/60 shadow-sm">
            Loading profile...
          </section>
        ) : null}

        {isUserError ? (
          <section className="rounded-2xl border border-brand-danger/20 bg-brand-danger/10 p-10 text-center text-brand-danger">
            Could not load your profile. Check that you are logged in.
          </section>
        ) : null}

        {!isUserLoading && !isUserError && user ? (
          <>
            <section className="rounded-3xl border border-brand-outline bg-white p-7 shadow-sm md:p-8">
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                  <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border border-brand-outline bg-brand-neutral-soft text-brand-primary">
                    {visibleAvatarUrl ? (
                      <img
                        src={visibleAvatarUrl}
                        alt={`${user.username} avatar`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <UserCircle className="h-14 w-14" />
                    )}
                  </div>

                  <div>
                    <p className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-brand-primary">
                      <ShieldCheck className="h-4 w-4" />
                      User profile
                    </p>

                    <h1 className="font-serif text-4xl font-bold text-brand-on-surface">
                      {user.username}
                    </h1>

                    <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-brand-on-surface/55">
                      <Mail className="h-4 w-4" />
                      {user.email}
                    </p>

                    <p className="mt-2 text-sm font-semibold text-brand-on-surface/55">
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
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-outline bg-brand-neutral-soft px-5 py-3 text-sm font-bold text-brand-on-surface/65 transition hover:border-brand-danger hover:text-brand-danger"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </div>

              {!isEditing ? (
                <div className="mt-8 rounded-2xl border border-brand-outline bg-brand-neutral-soft p-5">
                  <h2 className="mb-2 font-serif text-2xl font-bold text-brand-on-surface">
                    Bio
                  </h2>

                  <p className="leading-7 text-brand-on-surface/65">
                    {user.bio || 'No bio added yet. Edit your profile to introduce yourself.'}
                  </p>
                </div>
              ) : null}

              {successMessage ? (
                <div className="mt-6 flex items-center gap-2 rounded-xl border border-brand-success/20 bg-brand-success/10 p-4 text-sm font-bold text-brand-success">
                  <Check className="h-4 w-4" />
                  {successMessage}
                </div>
              ) : null}

              {isEditing ? (
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1.1fr]">
                    <section className="rounded-2xl border border-brand-outline bg-brand-neutral-soft p-5">
                      <h2 className="font-serif text-2xl font-bold text-brand-on-surface">
                        Avatar
                      </h2>

                      <p className="mt-1 text-sm text-brand-on-surface/60">
                        Choose a generated avatar style. No upload is needed.
                      </p>

                      <div className="mt-5 flex items-center gap-4">
                        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border border-brand-outline bg-white">
                          <img
                            src={avatarPreviewUrl}
                            alt="Avatar preview"
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={randomizeAvatarSeed}
                          className="inline-flex items-center gap-2 rounded-full border border-brand-outline bg-white px-4 py-2 text-sm font-bold text-brand-primary transition hover:border-brand-primary"
                        >
                          <RefreshCcw className="h-4 w-4" />
                          New avatar
                        </button>
                      </div>

                      <div className="mt-5 grid grid-cols-2 gap-2">
                        {avatarStyles.map((style) => {
                          const active = formState.avatar_style === style.value;

                          return (
                            <button
                              key={style.value}
                              type="button"
                              onClick={() => updateForm('avatar_style', style.value)}
                              className={`rounded-xl border px-3 py-2 text-sm font-bold transition ${
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

                    <section className="rounded-2xl border border-brand-outline bg-brand-neutral-soft p-5">
                      <h2 className="font-serif text-2xl font-bold text-brand-on-surface">
                        Profile details
                      </h2>

                      <div className="mt-5 space-y-4">
                        <label className="block">
                          <span className="mb-2 block text-sm font-bold text-brand-on-surface/65">
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
                          <span className="mb-2 block text-sm font-bold text-brand-on-surface/65">
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

                        <label className="block">
                          <span className="mb-2 block text-sm font-bold text-brand-on-surface/65">
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
                  </div>

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

                  <p className="font-serif text-xl font-bold text-brand-on-surface">Active</p>

                  <p className="mt-1 text-sm font-semibold text-brand-on-surface/55">
                    Session status
                  </p>
                </div>
              </div>
            </section>

            <section>
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