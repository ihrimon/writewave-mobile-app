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

export interface ArticleInput {
  title: string;
  content: string;
  category: string;
  tags: string[];
  coverImage?: string;
}

export async function createArticleRequest(input: ArticleInput): Promise<ArticleDetail> {
  const { data } = await apiClient.post<{ article: ArticleDetail }>('/articles', input);
  return data.article;
}

export async function updateArticleRequest(
  id: string,
  input: ArticleInput
): Promise<ArticleDetail> {
  const { data } = await apiClient.put<{ article: ArticleDetail }>(`/articles/${id}`, input);
  return data.article;
}
