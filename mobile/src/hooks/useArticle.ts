import { useQuery } from '@tanstack/react-query';

import { getArticleRequest } from '../api/articles';

export function useArticle(id: string) {
  return useQuery({
    queryKey: ['article', id],
    queryFn: () => getArticleRequest(id),
    enabled: Boolean(id),
  });
}
