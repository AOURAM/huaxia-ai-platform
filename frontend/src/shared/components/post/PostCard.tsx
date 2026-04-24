import { MessageCircle, MoreHorizontal } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

import { reactToPost } from '@/api/posts';
import { buildPostDetailRoute } from '@/constants/routes';
import { queryKeys } from '@/constants/queryKeys';
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
  const queryClient = useQueryClient();

  const reactionMutation = useMutation({
    mutationFn: (reaction: 'like' | 'dislike') => reactToPost(post.id, reaction),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.posts });
      await queryClient.invalidateQueries({ queryKey: queryKeys.topPosts });
      await queryClient.invalidateQueries({ queryKey: ['post-detail', post.id] });
    },
  });

  return (
    <article className="group rounded-xl border border-brand-outline bg-white p-6 shadow-sm transition hover:border-brand-primary/40">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <span className="font-bold text-brand-on-surface">User #{post.user_id}</span>
            <span className="text-xs text-brand-on-surface/45">• {formatDate(post.created_at)}</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-brand-neutral-soft px-3 py-1 text-xs font-bold text-brand-on-surface/65">
              {formatPageName(post.page_name)}
            </span>
            <ContentTypeBadge type={post.content_type} />
            <CategoryBadge category={post.category} />
          </div>
        </div>

        <button
          type="button"
          className="rounded-full p-2 text-brand-on-surface/45 transition hover:bg-brand-neutral-soft hover:text-brand-on-surface"
        >
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      <Link to={buildPostDetailRoute(post.id)} className="block">
        <h2 className="mb-3 font-serif text-2xl font-bold leading-tight text-brand-on-surface transition group-hover:text-brand-primary">
          {post.title}
        </h2>

        <p className="mb-4 line-clamp-3 leading-relaxed text-brand-on-surface/70">
          {post.summary || post.content}
        </p>

        <PostImage imageUrl={post.image_url} title={post.title} />
      </Link>

      {post.tags && post.tags.length > 0 ? (
        <div className="mb-5 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-brand-outline bg-brand-neutral-soft px-3 py-1 text-xs font-semibold text-brand-on-surface/70"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-4">
        <ReactionBar
          likes={post.likes_count}
          dislikes={post.dislikes_count}
          isPending={reactionMutation.isPending}
          onReact={(reaction) => reactionMutation.mutate(reaction)}
        />

        <Link
          to={buildPostDetailRoute(post.id)}
          className="flex items-center gap-2 border-t border-brand-outline/50 pt-4 text-sm font-bold text-brand-on-surface/50 transition hover:text-brand-primary"
        >
          <MessageCircle className="h-5 w-5" />
          Open discussion
        </Link>
      </div>
    </article>
  );
}