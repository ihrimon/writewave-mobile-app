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
// GET /api/articles/:id (Phase 3) একটা আলাদা, পূর্ণ শেপ রিটার্ন করবে (ArticleDetail টাইপ তখন যোগ হবে)।
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
