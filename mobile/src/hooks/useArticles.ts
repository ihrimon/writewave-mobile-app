import { useInfiniteQuery } from '@tanstack/react-query';

import { ArticleFilters, listArticlesRequest } from '../api/articles';

export function useArticles(filters: ArticleFilters = {}, options: { enabled?: boolean } = {}) {
  return useInfiniteQuery({
    queryKey: ['articles', filters],
    queryFn: ({ pageParam }) => listArticlesRequest(pageParam, 10, filters),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
    enabled: options.enabled ?? true,
  });
}
