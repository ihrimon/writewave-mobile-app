export interface User {
  id: string;
  name: string;
  email: string;
  authProvider: 'manual' | 'google';
  avatarUrl?: string;
  bio?: string;
}

export interface ArticleAuthor {
  id: string;
  name: string;
  avatarUrl?: string;
}

// GET /api/articles list-এর শেপ — excerpt আছে, পুরো content নেই (bandwidth বাঁচাতে)।
export interface ArticleSummary {
  id: string;
  title: string;
  excerpt: string;
  coverImage?: string;
  category: string;
  tags: string[];
  likeCount: number;
  createdAt: string;
  author: ArticleAuthor;
}

export interface ArticleListResponse {
  articles: ArticleSummary[];
  page: number;
  hasMore: boolean;
}

// GET /api/articles/:id-এর শেপ — পুরো content, author.bio-সহ।
export interface ArticleDetail {
  id: string;
  title: string;
  content: string;
  coverImage?: string;
  category: string;
  tags: string[];
  likeCount: number;
  createdAt: string;
  author: ArticleAuthor & { bio?: string };
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
