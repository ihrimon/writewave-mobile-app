import apiClient from './client';
import { ArticleListResponse } from '../types';

export async function listArticlesRequest(page: number, limit = 10): Promise<ArticleListResponse> {
  const { data } = await apiClient.get<ArticleListResponse>('/articles', {
    params: { page, limit },
  });
  return data;
}
