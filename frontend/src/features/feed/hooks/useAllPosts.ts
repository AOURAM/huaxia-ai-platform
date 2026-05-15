import { useQuery } from '@tanstack/react-query';

import { getAllPosts } from '@/api/posts';
import { queryKeys } from '@/constants/queryKeys';
import type { Post } from '@/types/post';

export function useAllPosts() {
  return useQuery<Post[]>({
    queryKey: queryKeys.posts,
    queryFn: getAllPosts,
  });
}