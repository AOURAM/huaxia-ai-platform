import { Edit3, MessageCircle, Trash2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

import { deletePost, reactToPost } from '@/api/posts';
import { buildPostDetailRoute, buildPostEditRoute } from '@/constants/routes';
import { queryKeys } from '@/constants/queryKeys';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { formatDate, formatPageName } from '@/lib/formatters';
import type { Post } from '@/types/post';
import { CategoryBadge } from '@/shared/components/post/CategoryBadge';
import { ContentTypeBadge } from '@/shared/components/post/ContentTypeBadge';
import { PostImage } from '@/shared/components/post/PostImage';
import { ReactionBar } from '@/shared/components/post/ReactionBar';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const isOwner = user?.id === post.user_id;

  const reactionMutation = useMutation({
    mutationFn: (reaction: 'like' | 'dislike') => reactToPost(post.id, reaction),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.posts });
      await queryClient.invalidateQueries({ queryKey: queryKeys.personalizedFeed });
      await queryClient.invalidateQueries({ queryKey: queryKeys.topPosts });
      await queryClient.invalidateQueries({ queryKey: ['post-detail', post.id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deletePost(post.id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.posts });
      await queryClient.invalidateQueries({ queryKey: queryKeys.personalizedFeed });
      await queryClient.invalidateQueries({ queryKey: queryKeys.topPosts });
    },
  });

  const handleDelete = () => {
    const confirmed = window.confirm(
      'Delete this post? This action cannot be undone.',
    );

    if (!confirmed) return;

    deleteMutation.mutate();
  };

  return (
    <article className="overflow-hidden rounded-2xl border border-brand-outline bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <PostImage imageUrl={post.image_url} title={post.title} />

      <div className="space-y-4 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <CategoryBadge category={post.category_id} />
            <ContentTypeBadge type={post.content_type} />
            <span className="rounded-full border border-brand-outline px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-brand-on-surface/55">
              {formatPageName(post.page_name)}
            </span>
          </div>

          {isOwner ? (
            <div className="flex items-center gap-2">
              <Link
                to={buildPostEditRoute(post.id)}
                className="inline-flex items-center gap-1.5 rounded-full border border-brand-outline px-3 py-1.5 text-[11px] font-black uppercase tracking-wide text-brand-on-surface/55 transition hover:border-brand-primary hover:text-brand-primary"
              >
                <Edit3 className="h-3.5 w-3.5" />
                Edit
              </Link>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="inline-flex items-center gap-1.5 rounded-full border border-brand-danger/30 px-3 py-1.5 text-[11px] font-black uppercase tracking-wide text-brand-danger transition hover:bg-brand-danger/10 disabled:opacity-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                {deleteMutation.isPending ? 'Deleting' : 'Delete'}
              </button>
            </div>
          ) : null}
        </div>

        <div>
          <div className="mb-2 text-xs font-semibold text-brand-on-surface/45">
            User #{post.user_id} • {formatDate(post.created_at)}
          </div>

          <Link to={buildPostDetailRoute(post.id)} className="group">
            <h2 className="line-clamp-2 font-serif text-2xl font-bold leading-tight text-brand-on-surface transition group-hover:text-brand-primary">
              {post.title}
            </h2>
          </Link>
        </div>

        <p className="line-clamp-3 text-sm leading-relaxed text-brand-on-surface/65">
          {post.summary || post.content}
        </p>

        {post.tags && post.tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-brand-neutral-soft px-3 py-1 text-[11px] font-semibold text-brand-on-surface/55"
              >
                #{tag}
              </span>
            ))}
          </div>
        ) : null}

        {deleteMutation.isError ? (
          <div className="rounded-xl border border-brand-danger/20 bg-brand-danger/10 p-3 text-xs font-bold text-brand-danger">
            Could not delete this post. Make sure you are the owner.
          </div>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-brand-outline pt-4">
          <ReactionBar
            likes={post.likes_count}
            dislikes={post.dislikes_count}
            isPending={reactionMutation.isPending}
            onReact={(reaction) => reactionMutation.mutate(reaction)}
          />

          <Link
            to={buildPostDetailRoute(post.id)}
            className="inline-flex items-center gap-2 rounded-xl border border-brand-primary/20 px-4 py-2 text-xs font-bold uppercase tracking-wider text-brand-primary transition hover:bg-brand-primary/5"
          >
            <MessageCircle className="h-4 w-4" />
            Open discussion
          </Link>
        </div>
      </div>
    </article>
  );
}