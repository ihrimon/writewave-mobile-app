import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createCommentRequest } from '../api/comments';

export function useCreateComment(articleId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (text: string) => createCommentRequest(articleId, text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', articleId] });
    },
  });
}
