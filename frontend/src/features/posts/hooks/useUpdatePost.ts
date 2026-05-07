import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updatePost, type UpdatePostPayload } from '@/api/posts';
import { queryKeys } from '@/constants/queryKeys';

interface UseUpdatePostArgs {
  postId: number;
}

export function useUpdatePost({ postId }: UseUpdatePostArgs) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdatePostPayload) => updatePost(postId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['post-detail', postId] });
      await queryClient.invalidateQueries({ queryKey: queryKeys.posts });
      await queryClient.invalidateQueries({ queryKey: queryKeys.personalizedFeed });
      await queryClient.invalidateQueries({ queryKey: queryKeys.topPosts });
    },
  });
}