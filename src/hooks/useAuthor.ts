import { useQuery } from '@tanstack/react-query';

import { getAuthorRequest } from '../api/authors';

export function useAuthor(id: string) {
  return useQuery({
    queryKey: ['author', id],
    queryFn: () => getAuthorRequest(id),
    enabled: Boolean(id),
  });
}
