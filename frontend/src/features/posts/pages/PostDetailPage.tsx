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
  Tag,
  ThumbsDown,
  ThumbsUp,
  UserCircle,
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { createComment } from '@/api/comments';
import { getPostDetail, reactToPost, resolveImageUrl } from '@/api/posts';
import { ROUTES } from '@/constants/routes';
import { formatContentType, formatDate, formatPageName } from '@/lib/formatters';
import { CategoryBadge } from '@/shared/components/post/CategoryBadge';
import { ContentTypeBadge } from '@/shared/components/post/ContentTypeBadge';

export function PostDetailPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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
    if (!post?.content) {
      return [];
    }

    return post.content
      .split(/\n+/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);
  }, [post?.content]);

  const handleSubmitComment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!comment.trim() || commentMutation.isPending) {
      return;
    }

    commentMutation.mutate();
  };

  if (!Number.isFinite(numericPostId) || numericPostId <= 0) {
    return (
      <main className="min-h-screen bg-brand-surface px-4 py-10 md:px-6">
        <section className="mx-auto max-w-2xl rounded-2xl border border-brand-outline bg-white p-10 text-center shadow-sm">
          <h1 className="font-serif text-3xl font-bold text-brand-on-surface">Invalid post</h1>

          <p className="mt-3 text-brand-on-surface/60">
            This post link is not valid.
          </p>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mt-6 rounded-xl bg-brand-primary px-6 py-3 font-bold text-white transition hover:bg-brand-primary-hover"
          >
            Back
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-brand-surface px-4 py-8 md:px-6">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-8 lg:grid-cols-12">
        {postDetailQuery.isLoading ? (
          <section className="rounded-2xl border border-brand-outline bg-white p-10 text-center text-brand-on-surface/60 shadow-sm lg:col-span-12">
            Loading post detail...
          </section>
        ) : null}

        {postDetailQuery.isError ? (
          <section className="rounded-2xl border border-brand-danger/20 bg-brand-danger/10 p-10 text-center text-brand-danger lg:col-span-12">
            <h1 className="font-serif text-3xl font-bold">Could not load this post</h1>

            <p className="mt-3">
              Check that the backend is running and that your session token is valid.
            </p>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mt-6 rounded-xl bg-brand-primary px-6 py-3 font-bold text-white transition hover:bg-brand-primary-hover"
            >
              Back
            </button>
          </section>
        ) : null}

        {post ? (
          <>
            <motion.article
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8 lg:col-span-8"
            >
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 text-sm font-bold text-brand-on-surface/55 transition hover:text-brand-primary"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>

              <section className="overflow-hidden rounded-3xl border border-brand-outline bg-white shadow-sm">
                {imageUrl ? (
                  <div className="relative h-72 overflow-hidden bg-brand-neutral-soft md:h-[420px]">
                    <img
                      src={imageUrl}
                      alt={post.title}
                      className="h-full w-full object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-brand-on-surface/65 via-brand-on-surface/20 to-transparent" />

                    <div className="absolute bottom-6 left-6 right-6">
                      <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-white/75">
                        {formatPageName(post.page_name)} • {formatContentType(post.content_type)}
                      </p>

                      <h1 className="font-serif text-4xl font-bold leading-tight text-white md:text-5xl">
                        {post.title}
                      </h1>
                    </div>
                  </div>
                ) : (
                  <div className="p-7 md:p-8">
                    <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-brand-primary">
                      {formatPageName(post.page_name)} • {formatContentType(post.content_type)}
                    </p>

                    <h1 className="font-serif text-4xl font-bold leading-tight text-brand-on-surface md:text-5xl">
                      {post.title}
                    </h1>
                  </div>
                )}

                <div className="space-y-8 p-7 md:p-8">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-outline bg-brand-neutral-soft text-sm font-black text-brand-primary">
                      U{post.user_id}
                    </div>

                    <div>
                      <p className="text-sm font-bold text-brand-on-surface">
                        User #{post.user_id}
                      </p>

                      <p className="text-xs font-semibold text-brand-on-surface/45">
                        Posted {formatDate(post.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-brand-neutral-soft px-3 py-1 text-xs font-bold text-brand-on-surface/65">
                      {formatPageName(post.page_name)}
                    </span>

                    <ContentTypeBadge type={post.content_type} />
                    <CategoryBadge category={post.category} />
                  </div>

                  <section className="rounded-2xl border border-brand-outline bg-brand-neutral-soft p-5">
                    <div className="mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-brand-primary">
                      <Cpu className="h-4 w-4" />
                      AI Summary
                    </div>

                    <p className="leading-7 text-brand-on-surface/70">
                      {post.summary || 'AI summary is not available yet for this post.'}
                    </p>

                    {post.ai_analysis ? (
                      <div className="mt-4 rounded-xl border border-brand-outline bg-white p-4">
                        <p className="mb-1 text-xs font-black uppercase tracking-[0.16em] text-brand-on-surface/45">
                          AI Categorization Note
                        </p>

                        <p className="text-sm leading-6 text-brand-on-surface/65">
                          {post.ai_analysis}
                        </p>
                      </div>
                    ) : null}
                  </section>

                  <section className="space-y-5 text-lg leading-8 text-brand-on-surface/75">
                    {contentParagraphs.length > 0 ? (
                      contentParagraphs.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))
                    ) : (
                      <p>{post.content}</p>
                    )}
                  </section>

                  {post.tags && post.tags.length > 0 ? (
                    <section className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 rounded-full border border-brand-outline bg-brand-neutral-soft px-3 py-1 text-xs font-semibold text-brand-on-surface/70"
                        >
                          <Tag className="h-3.5 w-3.5 text-brand-primary" />
                          {tag}
                        </span>
                      ))}
                    </section>
                  ) : null}

                  <div className="flex flex-wrap gap-3 border-t border-brand-outline pt-6">
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
                      <ThumbsUp className="h-4 w-4" />
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
                      <ThumbsDown className="h-4 w-4" />
                      {post.dislikes_count}
                    </button>
                  </div>
                </div>
              </section>

              <section className="rounded-3xl border border-brand-outline bg-white p-7 shadow-sm md:p-8">
                <div className="mb-6 flex items-center justify-between gap-4 border-b border-brand-outline pb-4">
                  <h2 className="font-serif text-3xl font-bold text-brand-on-surface">
                    Discussion ({detail?.total_comments ?? 0})
                  </h2>

                  <MessageCircle className="h-6 w-6 text-brand-primary" />
                </div>

                <form className="space-y-4" onSubmit={handleSubmitComment}>
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
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-brand-outline bg-white text-xs font-black text-brand-primary">
                              {item.username.slice(0, 2).toUpperCase()}
                            </div>

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
                      {post.category || 'Pending'}
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
                    No related posts yet. This will improve as more posts are created in the same
                    section.
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
                    Share practical student experiences so semantic search can return better
                    answers.
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
          </>
        ) : null}
      </div>
    </main>
  );
}