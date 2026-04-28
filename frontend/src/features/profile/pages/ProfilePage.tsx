import {
  CalendarDays,
  LogOut,
  Mail,
  MessageSquareText,
  ShieldCheck,
  UserCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useAllPosts } from '@/features/feed/hooks/useAllPosts';
import { useCurrentUser } from '@/features/profile/hooks/useCurrentUser';
import { PostList } from '@/shared/components/post/PostList';

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

export function ProfilePage() {
  const { logout } = useAuth();
  const { data: user, isLoading: isUserLoading, isError: isUserError } = useCurrentUser();
  const { data: allPosts = [], isLoading: arePostsLoading, isError: arePostsError } = useAllPosts();

  const userPosts = user ? allPosts.filter((post) => post.user_id === user.id) : [];

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
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-5">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-brand-outline bg-brand-neutral-soft text-brand-primary">
                    <UserCircle className="h-12 w-12" />
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
                  </div>
                </div>

                <button
                  type="button"
                  onClick={logout}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-outline bg-brand-neutral-soft px-5 py-3 text-sm font-bold text-brand-on-surface/65 transition hover:border-brand-danger hover:text-brand-danger"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>

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