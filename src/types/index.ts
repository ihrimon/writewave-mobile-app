export interface User {
  id: string;
  name: string;
  email: string;
  authProvider: 'manual' | 'google';
  avatarUrl?: string;
  bio?: string;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  coverImage?: string;
  category: string;
  tags: string[];
  authorId: string;
  likeCount: number;
  createdAt: string;
}

export interface Comment {
  id: string;
  articleId: string;
  authorId: string;
  text: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
