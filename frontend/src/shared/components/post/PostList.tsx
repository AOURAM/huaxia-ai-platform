import type { Post } from '@/types/post';
import { PostCard } from '@/shared/components/post/PostCard';

interface PostListProps {
  posts: Post[];
}

export function PostList({ posts }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-brand-outline bg-white p-10 text-center">
        <h3 className="mb-2 font-serif text-2xl font-bold">No posts yet</h3>
        <p className="text-brand-on-surface/60">
          Create the first useful post for international students in China.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}