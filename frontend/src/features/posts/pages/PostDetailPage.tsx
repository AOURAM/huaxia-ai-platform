import { useMemo, useState, type FormEvent } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  Cpu,
  Loader2,
  MessageCircle,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { createComment } from '@/api/comments';
import { getPostDetail, reactToPost, resolveImageUrl } from '@/api/posts';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useCurrentUser } from '@/features/profile/hooks/useCurrentUser';
import { formatContentType, formatDate, formatPageName } from '@/lib/formatters';
import { CategoryBadge } from '@/shared/components/post/CategoryBadge';
import { ContentTypeBadge } from '@/shared/components/post/ContentTypeBadge';
import { LocalUserAvatar } from '@/shared/components/user/LocalUserAvatar';

export function PostDetailPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { user } = useAuth();
  const { data: freshUser } = useCurrentUser();
  const displayUser = freshUser ?? user;

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

  const isCurrentUserAuthor = Boolean(
    displayUser && post && displayUser.id === post.user_id,
  );

  const authorUser = isCurrentUserAuthor ? displayUser : null;
  const authorName = authorUser?.username ?? 'Student Member';

const contentParagraphs = useMemo(() => {
  if (!post?.content) {
    return [];
  }

  return post.content
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => {
      if (!paragraph) return false;

      return !/^(page_name|content_type|category|category_id|tags)\s*:/i.test(paragraph);
    });
}, [post?.content]);

  const safeTags = Array.isArray(post?.tags) ? post.tags : [];

  const handleSubmitComment = (event: FormEvent) => {
    event.preventDefault();

    if (!comment.trim() || commentMutation.isPending) {
      return;
    }

    commentMutation.mutate();
  };

  if (!Number.isFinite(numericPostId) || numericPostId <= 0) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="font-serif text-4xl font-black text-brand-on-surface">
          Invalid post
        </h1>
        <p className="mt-3 text-sm text-brand-on-surface/60">
          This post link is not valid.
        </p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-6 rounded-xl bg-brand-primary px-6 py-3 font-bold text-white transition hover:bg-brand-primary-hover"
        >
          Back
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      {postDetailQuery.isLoading ? (
        <div className="rounded-3xl border border-brand-outline bg-white p-10 text-center text-sm font-bold text-brand-on-surface/55">
          Loading post detail...
        </div>
      ) : null}

      {postDetailQuery.isError ? (
        <div className="rounded-3xl border border-brand-danger/20 bg-brand-danger/10 p-10 text-center">
          <h1 className="font-serif text-3xl font-black text-brand-danger">
            Could not load this post
          </h1>
          <p className="mt-3 text-sm text-brand-danger/75">
            Check that the backend is running and that your session token is valid.
          </p>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mt-6 rounded-xl bg-brand-primary px-6 py-3 font-bold text-white transition hover:bg-brand-primary-hover"
          >
            Back
          </button>
        </div>
      ) : null}

      {post ? (
        <div className="grid gap-8 lg:grid-cols-12">
          <motion.article
            className="lg:col-span-8"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-brand-on-surface/55 transition hover:text-brand-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            {imageUrl ? (
              <div className="mb-8 overflow-hidden rounded-3xl border border-brand-outline bg-white shadow-sm">
                <img
                  src={imageUrl}
                  alt={post.title}
                  className="h-[360px] w-full object-cover"
                />
              </div>
            ) : null}

            <section className="rounded-3xl border border-brand-outline bg-white p-8 shadow-sm">
              <div className="mb-5 text-xs font-black uppercase tracking-[0.25em] text-brand-primary">
                {formatPageName(post.page_name)} • {formatContentType(post.content_type)}
              </div>

              <h1 className="font-serif text-5xl font-black leading-tight text-brand-on-surface">
                {post.title}
              </h1>

              <div className="mt-8 flex items-center gap-4">
<LocalUserAvatar
  user={authorUser}
  userId={post.user_id}
  username={authorUser?.username ?? null}
  avatarStyle={authorUser ? undefined : 'initials'}
  size="lg"
/>

                <div>
                  <p className="font-bold text-brand-on-surface">{authorName}</p>
                  <p className="text-sm text-brand-on-surface/55">
                    Posted {formatDate(post.created_at)}
                  </p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                <ContentTypeBadge type={post.content_type} />
                <span className="rounded-full bg-brand-neutral-soft px-4 py-2 text-xs font-bold text-brand-on-surface/65">
                  {formatPageName(post.page_name)}
                </span>
                <CategoryBadge category={post.category_id} />
              </div>

              <div className="mt-10 rounded-2xl border border-brand-outline bg-brand-surface p-6">
                <div className="mb-5 flex items-center gap-2 text-xs font-black uppercase tracking-[0.25em] text-brand-primary">
                  <Cpu className="h-4 w-4" />
                  AI Summary
                </div>

                <p className="text-base leading-relaxed text-brand-on-surface/75">
                  {post.summary || 'No summary available.'}
                </p>
              </div>

              <div className="prose prose-neutral mt-10 max-w-none">
                {contentParagraphs.length > 0 ? (
                  contentParagraphs.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="text-base leading-8 text-brand-on-surface/80"
                    >
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p className="text-base leading-8 text-brand-on-surface/80">
                    {post.content}
                  </p>
                )}
              </div>

{safeTags.length > 0 ? (
  <div className="mt-8 flex flex-wrap gap-2">
    {safeTags.map((tag) => (
      <span
        key={tag}
        className="inline-flex items-center rounded-full bg-brand-neutral-soft px-3 py-1.5 text-xs font-black text-brand-on-surface/50"
      >
        #{tag}
      </span>
    ))}
  </div>
) : null}

              <div className="mt-10 flex flex-wrap gap-3 border-t border-brand-outline pt-6">
                <button
                  type="button"
                  disabled={reactionMutation.isPending}
                  onClick={() => reactionMutation.mutate('like')}
                  className={`inline-flex items-center gap-2.5 rounded-xl border px-5 py-2.5 text-sm font-bold transition active:scale-95 disabled:opacity-60 ${
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
                  className={`inline-flex items-center gap-2.5 rounded-xl border px-5 py-2.5 text-sm font-bold transition active:scale-95 disabled:opacity-60 ${
                    detail?.user_reaction === 'dislike'
                      ? 'border-brand-danger bg-brand-danger text-white'
                      : 'border-brand-outline bg-white text-brand-on-surface/65 hover:border-brand-danger hover:text-brand-danger'
                  }`}
                >
                  <ThumbsDown className="h-5 w-5" />
                  {post.dislikes_count}
                </button>
              </div>
            </section>

            <section className="mt-8 rounded-3xl border border-brand-outline bg-white p-8 shadow-sm">
              <h2 className="mb-6 font-serif text-3xl font-black text-brand-on-surface">
                Discussion ({detail?.total_comments ?? 0})
              </h2>

              <form onSubmit={handleSubmitComment} className="space-y-4">
                <textarea
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  className="min-h-[140px] w-full resize-none rounded-2xl border border-brand-outline bg-brand-neutral-soft p-5 text-sm text-brand-on-surface outline-none transition placeholder:text-brand-on-surface/40 focus:border-brand-primary focus:bg-white focus:ring-1 focus:ring-brand-primary"
                  placeholder="Add a useful comment for other international students..."
                />

                {commentMutation.isError ? (
                  <div className="rounded-xl border border-brand-danger/20 bg-brand-danger/10 p-4 text-sm font-semibold text-brand-danger">
                    Could not post your comment. Check the backend and try again.
                  </div>
                ) : null}

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={commentMutation.isPending || !comment.trim()}
                    className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-8 py-3 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-brand-primary-hover disabled:opacity-60"
                  >
                    {commentMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : null}
                    Post comment
                  </button>
                </div>
              </form>

              <div className="mt-8 space-y-6">
                <AnimatePresence>
                  {detail?.comments.length ? (
                    detail.comments.map((item) => (
                      <motion.article
                        key={item.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-2xl border border-brand-outline bg-brand-neutral-soft p-5"
                      >
                        <div className="flex gap-4">
                          <LocalUserAvatar username={item.username} size="sm" />

                          <div className="min-w-0 flex-1">
                            <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                              <span className="font-bold text-brand-on-surface">
                                {item.username}
                              </span>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-on-surface/40">
                                {formatDate(item.created_at)}
                              </span>
                            </div>

                            <p className="text-sm leading-relaxed text-brand-on-surface/75">
                              {item.content}
                            </p>
                          </div>
                        </div>
                      </motion.article>
                    ))
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-2xl border border-dashed border-brand-outline bg-brand-neutral-soft p-8 text-center"
                    >
                      <MessageCircle className="mx-auto mb-3 h-8 w-8 text-brand-primary/60" />
                      <h3 className="font-serif text-xl font-bold text-brand-on-surface">
                        No comments yet
                      </h3>
                      <p className="mt-1 text-sm text-brand-on-surface/55">
                        Be the first to add useful information.
                      </p>
                    </motion.div>
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
            <section className="rounded-2xl border border-brand-outline bg-white p-8 shadow-sm">
              <h3 className="mb-6 border-b border-brand-outline pb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-on-surface/45">
                Post metadata
              </h3>

              <ul className="space-y-4 text-sm">
                <li className="flex items-center justify-between gap-4">
                  <span className="text-brand-on-surface/55">Section</span>
                  <span className="font-bold text-brand-on-surface">
                    {formatPageName(post.page_name)}
                  </span>
                </li>

                <li className="flex items-center justify-between gap-4">
                  <span className="text-brand-on-surface/55">Type</span>
                  <span className="font-bold text-brand-on-surface">
                    {formatContentType(post.content_type)}
                  </span>
                </li>

                <li className="flex items-center justify-between gap-4">
                  <span className="text-brand-on-surface/55">Comments</span>
                  <span className="font-bold text-brand-on-surface">
                    {detail?.total_comments ?? 0}
                  </span>
                </li>

                <li className="flex items-center justify-between gap-4">
                  <span className="text-brand-on-surface/55">AI Category</span>
                  <span className="font-bold text-brand-primary">
                    {post.category_id || 'Pending'}
                  </span>
                </li>
              </ul>
            </section>

            <section className="rounded-2xl border border-brand-outline bg-white p-8 shadow-sm">
              <h3 className="mb-6 border-b border-brand-outline pb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-on-surface/45">
                Related posts
              </h3>

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
                        <h4 className="line-clamp-2 text-sm font-bold leading-snug text-brand-on-surface transition group-hover:text-brand-primary">
                          {item.title}
                        </h4>

                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-on-surface/40">
                          {formatPageName(item.page_name)} • score{' '}
                          {item.recommendation_score.toFixed(2)}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm leading-relaxed text-brand-on-surface/55">
                  No related posts yet. This will improve as more posts are created in
                  the same section.
                </p>
              )}

              <Link
                to={ROUTES.home}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border border-brand-primary/20 py-3 text-xs font-black uppercase tracking-widest text-brand-primary transition hover:bg-brand-primary/5"
              >
                Back to feed
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </section>

            <section className="relative overflow-hidden rounded-2xl bg-brand-primary p-10 text-center shadow-2xl shadow-brand-primary/20">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.14),transparent)]" />

              <div className="relative">
                <Sparkles className="mx-auto mb-6 h-10 w-10 text-white/50" />

                <h3 className="mb-3 font-serif text-xl font-bold text-white">
                  Help Huaxia grow
                </h3>

                <p className="mb-8 text-xs leading-relaxed text-white/70">
                  Share practical student experiences so semantic search can return
                  better answers.
                </p>

                <Link
                  to={ROUTES.home}
                  className="block rounded-xl bg-white py-3.5 text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary transition hover:bg-brand-neutral-soft active:scale-95"
                >
                  Create another post
                </Link>
              </div>
            </section>
          </motion.aside>
        </div>
      ) : null}
    </main>
  );
}