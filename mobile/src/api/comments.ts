import apiClient from './client';
import { Comment, CommentListResponse } from '../types';

export async function listCommentsRequest(
  articleId: string,
  page = 1,
  limit = 20
): Promise<CommentListResponse> {
  const { data } = await apiClient.get<CommentListResponse>(`/articles/${articleId}/comments`, {
    params: { page, limit },
  });
  return data;
}

export async function createCommentRequest(articleId: string, text: string): Promise<Comment> {
  const { data } = await apiClient.post<{ comment: Comment }>(
    `/articles/${articleId}/comments`,
    { text }
  );
  return data.comment;
}
