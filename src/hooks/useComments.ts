import { useInfiniteQuery } from '@tanstack/react-query';

import { listCommentsRequest } from '../api/comments';

export function useComments(articleId: string) {
  return useInfiniteQuery({
    queryKey: ['comments', articleId],
    queryFn: ({ pageParam }) => listCommentsRequest(articleId, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
    enabled: Boolean(articleId),
  });
}
