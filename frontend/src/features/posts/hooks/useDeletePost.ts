import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deletePost } from '@/api/posts';
import { queryKeys } from '@/constants/queryKeys';

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePost,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.posts });
      await queryClient.invalidateQueries({ queryKey: queryKeys.personalizedFeed });
      await queryClient.invalidateQueries({ queryKey: queryKeys.topPosts });
    },
  });
}