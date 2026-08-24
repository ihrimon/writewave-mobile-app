import { useMutation, useQueryClient } from '@tanstack/react-query';

import { followAuthorRequest } from '../api/authors';
import { AuthorProfile } from '../types';

export function useFollowAuthor(id: string) {
  const queryClient = useQueryClient();
  const queryKey = ['author', id];

  return useMutation({
    mutationFn: () => followAuthorRequest(id),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<AuthorProfile>(queryKey);
      if (previous) {
        queryClient.setQueryData<AuthorProfile>(queryKey, {
          ...previous,
          isFollowedByMe: !previous.isFollowedByMe,
          followerCount: previous.isFollowedByMe
            ? previous.followerCount - 1
            : previous.followerCount + 1,
        });
      }
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
