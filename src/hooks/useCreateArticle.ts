import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ArticleInput, createArticleRequest } from '../api/articles';

export function useCreateArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ArticleInput) => createArticleRequest(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
  });
}
