import apiClient from './client';
import { ArticleDetail, ArticleListResponse } from '../types';

export async function listArticlesRequest(page: number, limit = 10): Promise<ArticleListResponse> {
  const { data } = await apiClient.get<ArticleListResponse>('/articles', {
    params: { page, limit },
  });
  return data;
}

export async function getArticleRequest(id: string): Promise<ArticleDetail> {
  const { data } = await apiClient.get<{ article: ArticleDetail }>(`/articles/${id}`);
  return data.article;
}
