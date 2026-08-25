import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ArticleInput, updateArticleRequest } from '../api/articles';

export function useUpdateArticle(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ArticleInput) => updateArticleRequest(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      queryClient.invalidateQueries({ queryKey: ['article', id] });
    },
  });
}
