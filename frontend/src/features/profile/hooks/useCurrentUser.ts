import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getCurrentUser, updateCurrentUser } from '@/api/users';
import type { UserUpdatePayload } from '@/types/user';

const currentUserQueryKey = ['current-user'] as const;

export function useCurrentUser() {
  return useQuery({
    queryKey: currentUserQueryKey,
    queryFn: () => getCurrentUser(),
  });
}

export function useUpdateCurrentUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UserUpdatePayload) => updateCurrentUser(payload),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(currentUserQueryKey, updatedUser);
    },
  });
}