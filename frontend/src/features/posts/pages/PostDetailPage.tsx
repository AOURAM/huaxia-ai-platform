import { useMemo, useState, type FormEvent } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowLeft,
  Bell,
  BookOpen,
  ChevronRight,
  Cpu,
  Loader2,
  LogOut,
  MessageCircle,
  Reply,
  Search,
  Sparkles,
  Tag,
  ThumbsDown,
  ThumbsUp,
  UserCircle,
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { createComment } from '@/api/comments';
import { getPostDetail, reactToPost, resolveImageUrl } from '@/api/posts';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { formatContentType, formatDate, formatPageName } from '@/lib/formatters';
import { CategoryBadge } from '@/shared/components/post/CategoryBadge';
import { ContentTypeBadge } from '@/shared/components/post/ContentTypeBadge';

export function PostDetailPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, logout } = useAuth();

  const numericPostId = Number(postId);
  const [comment, setComment] = useState('');

  const postDetailQuery = useQuery({
    queryKey: ['post-detail', numericPostId],
    queryFn: () => getPostDetail(numericPostId),
    enabled: Number.isFinite(numericPostId) && numericPostId > 0,
  });

  const reactionMutation = useMutation({
    mutationFn: (reaction: 'like' | 'dislike') => reactToPost(numericPostId, reaction),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['post-detail', numericPostId] });
      await queryClient.invalidateQueries({ queryKey: ['posts'] });
      await queryClient.invalidateQueries({ queryKey: ['posts', 'top'] });
    },
  });

  const commentMutation = useMutation({
    mutationFn: () => createComment(numericPostId, { content: comment.trim() }),
    onSuccess: async () => {
      setComment('');
      await queryClient.invalidateQueries({ queryKey: ['post-detail', numericPostId] });
    },
  });

  const detail = postDetailQuery.data;
  const post = detail?.post;
  const imageUrl = resolveImageUrl(post?.image_url ?? null);

  const contentParagraphs = useMemo(() => {
    if (!post?.content) return [];

    return post.content
      .split(/\n+/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);
  }, [post?.content]);

  const handleSubmitComment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!comment.trim()) return;

    commentMutation.mutate();
  };

  if (!Number.isFinite(numericPostId) || numericPostId <= 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-surface p-8">
        <div className="rounded-2xl border border-brand-outline bg-white p-8 text-center">
          <h1 className="mb-3 font-serif text-3xl font-bold">Invalid post</h1>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-xl bg-brand-primary px-6 py-3 font-bold text-white"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-surface">
      <nav className="sticky top-0 z-50 border-b border-brand-outline bg-brand-surface/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-4 md:px-6">
          <Link to={ROUTES.home} className="font-serif text-2xl font-bold text-brand-primary">
            Huaxia
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {['Home', 'Cities', 'Universities', 'Culture', 'Daily Life'].map((item) => (
              <button
                key={item}
                type="button"
                className={`flex h-16 items-center border-b-2 text-sm font-bold transition ${
                  item === 'Home'
                    ? 'border-brand-primary text-brand-primary'
                    : 'border-transparent text-brand-on-surface/60 hover:text-brand-primary'
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button className="rounded-full p-2 text-brand-primary transition hover:bg-brand-neutral-soft">
              <Search className="h-5 w-5" />
            </button>

            <button className="rounded-full p-2 text-brand-primary transition hover:bg-brand-neutral-soft">
              <Bell className="h-5 w-5" />
            </button>

            <button className="rounded-full p-2 text-brand-primary transition hover:bg-brand-neutral-soft">
              <UserCircle className="h-6 w-6" />
            </button>

            <button
              type="button"
              onClick={logout}
              className="rounded-full p-2 text-brand-on-surface/55 transition hover:bg-brand-neutral-soft hover:text-brand-danger"
              title="Sign out"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </nav>

      {postDetailQuery.isLoading ? (
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="flex items-center gap-3 rounded-2xl border border-brand-outline bg-white px-6 py-4 font-bold text-brand-on-surface/70">
            <Loader2 className="h-5 w-5 animate-spin text-brand-primary" />
            Loading post detail...
          </div>
        </div>
      ) : null}

      {postDetailQuery.isError ? (
        <div className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center px-6">
          <div className="rounded-2xl border border-brand-danger/20 bg-brand-danger/10 p-8 text-center text-brand-danger">
            <h1 className="mb-3 font-serif text-3xl font-bold">Could not load this post</h1>
            <p className="mb-6 text-sm">
              Check that the backend is running and that your session token is valid.
            </p>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-xl bg-brand-primary px-6 py-3 font-bold text-white"
            >
              Back
            </button>
          </div>
        </div>
      ) : null}

      {post ? (
        <main className="mx-auto grid w-full max-w-[1280px] grid-cols-1 gap-12 px-4 py-10 md:px-6 lg:grid-cols-12 lg:py-14">
          <motion.article
            className="lg:col-span-8"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-brand-on-surface/55 transition hover:text-brand-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            <header className="space-y-6">
              <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-on-surface/50">
                <Tag className="h-3.5 w-3.5 text-brand-primary" />
                <span>{formatPageName(post.page_name)}</span>
                <span className="mx-1 text-brand-outline">•</span>
                <span>{formatContentType(post.content_type)}</span>
              </div>

              <h1 className="font-serif text-4xl font-semibold leading-[1.08] tracking-tight text-brand-on-surface md:text-5xl lg:text-6xl">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-3 border-y border-brand-outline/40 py-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-brand-outline bg-brand-primary text-sm font-bold text-white">
                  U{post.user_id}
                </div>

                <div className="flex flex-col">
                  <span className="text-sm font-bold text-brand-on-surface">User #{post.user_id}</span>
                  <span className="text-xs text-brand-on-surface/55">
                    Posted {formatDate(post.created_at)}
                  </span>
                </div>

                <div className="ml-auto flex flex-wrap gap-2">
                  <ContentTypeBadge type={post.content_type} />
                  <CategoryBadge category={post.category} />
                </div>
              </div>
            </header>

            {imageUrl ? (
              <figure className="mt-10 overflow-hidden rounded-xl border border-brand-outline bg-white shadow-sm">
                <img
                  src={imageUrl}
                  alt={post.title}
                  className="max-h-[520px] w-full object-cover transition duration-700 hover:scale-[1.02]"
                />
                <figcaption className="border-t border-brand-outline/30 bg-white/70 px-4 py-3 text-center text-xs italic text-brand-on-surface/50">
                  Image uploaded by the post author.
                </figcaption>
              </figure>
            ) : null}

            <div className="mt-10 rounded-xl border-l-[6px] border-brand-primary bg-white p-8 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-lg bg-brand-primary/5 p-2">
                  <Cpu className="h-6 w-6 text-brand-primary" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-brand-primary">
                  AI Summary
                </h3>
              </div>

              <p className="leading-loose text-brand-on-surface/80">
                {post.summary || 'AI summary is not available yet for this post.'}
              </p>
            </div>

            {post.ai_analysis ? (
              <div className="mt-6 rounded-xl border border-brand-outline bg-brand-neutral-soft p-6">
                <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-primary">
                  <Sparkles className="h-4 w-4" />
                  AI Categorization Note
                </div>
                <p className="text-sm leading-relaxed text-brand-on-surface/70">{post.ai_analysis}</p>
              </div>
            ) : null}

            <div className="mt-10 space-y-6 text-lg leading-relaxed text-brand-on-surface/90">
              {contentParagraphs.length > 0 ? (
                contentParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
              ) : (
                <p>{post.content}</p>
              )}
            </div>

            {post.tags && post.tags.length > 0 ? (
              <div className="mt-12 flex flex-wrap gap-3 border-t border-brand-outline/30 pt-8">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-brand-outline bg-brand-neutral-soft px-4 py-1.5 text-[11px] font-bold text-brand-on-surface/65 transition hover:border-brand-primary hover:text-brand-primary"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="mt-10 flex flex-wrap items-center justify-between gap-6 py-6">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  disabled={reactionMutation.isPending}
                  onClick={() => reactionMutation.mutate('like')}
                  className={`flex items-center gap-2.5 rounded-xl border px-5 py-2.5 text-sm font-bold transition active:scale-95 disabled:opacity-60 ${
                    detail?.user_reaction === 'like'
                      ? 'border-brand-primary bg-brand-primary text-white'
                      : 'border-brand-outline bg-white text-brand-on-surface/65 hover:border-brand-primary hover:text-brand-primary'
                  }`}
                >
                  <ThumbsUp className="h-5 w-5" />
                  {post.likes_count}
                </button>

                <button
                  type="button"
                  disabled={reactionMutation.isPending}
                  onClick={() => reactionMutation.mutate('dislike')}
                  className={`flex items-center gap-2.5 rounded-xl border px-5 py-2.5 text-sm font-bold transition active:scale-95 disabled:opacity-60 ${
                    detail?.user_reaction === 'dislike'
                      ? 'border-brand-danger bg-brand-danger text-white'
                      : 'border-brand-outline bg-white text-brand-on-surface/65 hover:border-brand-danger hover:text-brand-danger'
                  }`}
                >
                  <ThumbsDown className="h-5 w-5" />
                  {post.dislikes_count}
                </button>
              </div>
            </div>

            <section className="mt-16 rounded-2xl border border-brand-outline bg-white/70 p-6 shadow-sm backdrop-blur md:p-10">
              <h3 className="mb-8 flex items-center gap-3 border-b border-brand-outline/30 pb-6 font-serif text-2xl font-semibold">
                Discussion
                <span className="text-lg text-brand-on-surface/40">({detail?.total_comments ?? 0})</span>
              </h3>

              <form onSubmit={handleSubmitComment} className="mb-12 space-y-4">
                <textarea
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  className="min-h-[140px] w-full resize-none rounded-xl border border-brand-outline bg-brand-neutral-soft/60 p-5 text-sm outline-none transition focus:border-brand-primary focus:bg-white focus:ring-1 focus:ring-brand-primary"
                  placeholder="Add a useful comment for other international students..."
                />

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={commentMutation.isPending || !comment.trim()}
                    className="flex items-center gap-2 rounded-xl bg-brand-primary px-8 py-3 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-brand-primary-hover disabled:opacity-60"
                  >
                    {commentMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    Post Comment
                  </button>
                </div>
              </form>

              <div className="space-y-8">
                <AnimatePresence>
                  {detail?.comments.length ? (
                    detail.comments.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-4"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand-outline bg-brand-neutral-soft text-xs font-bold text-brand-primary">
                          {item.username.slice(0, 2).toUpperCase()}
                        </div>

                        <div className="flex-1">
                          <div className="mb-1.5 flex items-center justify-between gap-4">
                            <span className="text-sm font-bold text-brand-on-surface">{item.username}</span>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-on-surface/40">
                              {formatDate(item.created_at)}
                            </span>
                          </div>

                          <p className="text-sm leading-relaxed text-brand-on-surface/80">{item.content}</p>

                          <button className="mt-3 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-brand-primary transition hover:text-brand-primary-hover">
                            <Reply className="h-3.5 w-3.5" />
                            Reply later
                          </button>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="rounded-xl border border-dashed border-brand-outline bg-brand-neutral-soft/50 p-8 text-center">
                      <MessageCircle className="mx-auto mb-3 h-8 w-8 text-brand-primary/50" />
                      <h4 className="font-serif text-xl font-bold">No comments yet</h4>
                      <p className="mt-1 text-sm text-brand-on-surface/55">
                        Be the first to add useful information.
                      </p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </section>
          </motion.article>

          <motion.aside
            className="space-y-8 lg:col-span-4"
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
          >
            <div className="rounded-2xl border border-brand-outline bg-white p-8 shadow-sm">
              <h4 className="mb-6 border-b border-brand-outline/30 pb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-on-surface/45">
                Post Metadata
              </h4>

              <ul className="space-y-4 text-sm">
                <li className="flex items-center justify-between">
                  <span className="text-brand-on-surface/55">Section</span>
                  <span className="font-bold">{formatPageName(post.page_name)}</span>
                </li>

                <li className="flex items-center justify-between">
                  <span className="text-brand-on-surface/55">Type</span>
                  <span className="font-bold">{formatContentType(post.content_type)}</span>
                </li>

                <li className="flex items-center justify-between">
                  <span className="text-brand-on-surface/55">Comments</span>
                  <span className="font-bold">{detail?.total_comments ?? 0}</span>
                </li>

                <li className="flex items-center justify-between">
                  <span className="text-brand-on-surface/55">AI Category</span>
                  <span className="font-bold text-brand-primary">{post.category || 'Pending'}</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-brand-outline bg-white p-8 shadow-sm">
              <h4 className="mb-6 border-b border-brand-outline/30 pb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-on-surface/45">
                Related Posts
              </h4>

              {detail?.recommendations.length ? (
                <div className="space-y-7">
                  {detail.recommendations.map((item) => (
                    <Link key={item.id} to={`/posts/${item.id}`} className="group flex gap-4">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-brand-outline bg-brand-neutral-soft">
                        {item.image_url ? (
                          <img
                            src={resolveImageUrl(item.image_url) ?? ''}
                            alt={item.title}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <BookOpen className="h-6 w-6 text-brand-primary/50" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1 space-y-1">
                        <h5 className="line-clamp-2 text-sm font-bold leading-snug text-brand-on-surface transition group-hover:text-brand-primary">
                          {item.title}
                        </h5>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-on-surface/40">
                          {formatPageName(item.page_name)} • score {item.recommendation_score.toFixed(2)}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm leading-relaxed text-brand-on-surface/55">
                  No related posts yet. This will improve as more posts are created in the same section.
                </p>
              )}

              <Link
                to={ROUTES.home}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border border-brand-primary/20 py-3 text-xs font-black uppercase tracking-widest text-brand-primary transition hover:bg-brand-primary/5"
              >
                Back
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-brand-primary p-10 text-center shadow-2xl shadow-brand-primary/20">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.14),transparent)]" />

              <Sparkles className="mx-auto mb-6 h-10 w-10 text-white/40" />

              <h4 className="mb-3 font-serif text-xl font-bold text-white">Help Huaxia grow</h4>
              <p className="mb-8 text-xs leading-relaxed text-white/65">
                Share practical student experiences so semantic search can return better answers.
              </p>

              <Link
                to={ROUTES.home}
                className="block rounded-xl bg-white py-3.5 text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary transition hover:bg-brand-neutral-soft active:scale-95"
              >
                Create another post
              </Link>
            </div>
          </motion.aside>
        </main>
      ) : null}
    </div>
  );
}