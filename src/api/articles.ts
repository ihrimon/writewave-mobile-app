import apiClient from './client';
import { ArticleDetail, ArticleListResponse } from '../types';

export interface ArticleFilters {
  category?: string;
  tag?: string;
  search?: string;
}

export async function listArticlesRequest(
  page: number,
  limit = 10,
  filters: ArticleFilters = {}
): Promise<ArticleListResponse> {
  const { data } = await apiClient.get<ArticleListResponse>('/articles', {
    params: { page, limit, ...filters },
  });
  return data;
}

export async function getArticleRequest(id: string): Promise<ArticleDetail> {
  const { data } = await apiClient.get<{ article: ArticleDetail }>(`/articles/${id}`);
  return data.article;
}
