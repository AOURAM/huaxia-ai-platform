import { useQuery } from '@tanstack/react-query';

import { getTopPosts } from '@/api/posts';
import { queryKeys } from '@/constants/queryKeys';

export function useTopPosts() {
  return useQuery({
    queryKey: queryKeys.topPosts,
    queryFn: () => getTopPosts(5),
  });
}