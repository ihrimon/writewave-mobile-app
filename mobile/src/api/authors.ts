import apiClient from './client';
import { AuthorProfile } from '../types';

export async function getAuthorRequest(id: string): Promise<AuthorProfile> {
  const { data } = await apiClient.get<{ author: AuthorProfile }>(`/authors/${id}`);
  return data.author;
}

export interface FollowResponse {
  following: boolean;
  followerCount: number;
}

export async function followAuthorRequest(id: string): Promise<FollowResponse> {
  const { data } = await apiClient.post<FollowResponse>(`/authors/${id}/follow`);
  return data;
}
