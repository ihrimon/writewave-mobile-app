import { useMutation, useQueryClient } from '@tanstack/react-query';

import { likeArticleRequest } from '../api/articles';
import { ArticleDetail } from '../types';

export function useLikeArticle(id: string) {
  const queryClient = useQueryClient();
  const queryKey = ['article', id];

  return useMutation({
    mutationFn: () => likeArticleRequest(id),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<ArticleDetail>(queryKey);
      if (previous) {
        queryClient.setQueryData<ArticleDetail>(queryKey, {
          ...previous,
          isLiked: !previous.isLiked,
          likeCount: previous.isLiked ? previous.likeCount - 1 : previous.likeCount + 1,
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
