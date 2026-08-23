import { useInfiniteQuery } from '@tanstack/react-query';

import { listArticlesRequest } from '../api/articles';

export function useArticles() {
  return useInfiniteQuery({
    queryKey: ['articles'],
    queryFn: ({ pageParam }) => listArticlesRequest(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
  });
}
