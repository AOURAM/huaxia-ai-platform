import { useQuery } from '@tanstack/react-query';

import { getPersonalizedFeed } from '@/api/posts';
import { queryKeys } from '@/constants/queryKeys';

export function useAllPosts() {
  return useQuery({
    queryKey: queryKeys.posts,
    queryFn: getPersonalizedFeed,
  });
}