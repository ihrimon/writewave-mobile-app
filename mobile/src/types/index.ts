export interface User {
  id: string;
  name: string;
  email: string;
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

// GET /api/articles/:id-এর শেপ — পুরো content, author.bio, ও isLiked (auth থাকলে)-সহ।
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
  isLiked: boolean;
}

export interface Comment {
  id: string;
  text: string;
  createdAt: string;
  author: ArticleAuthor;
}

export interface CommentListResponse {
  comments: Comment[];
  page: number;
  hasMore: boolean;
}

export interface AuthorProfile {
  id: string;
  name: string;
  avatarUrl?: string;
  bio?: string;
  articleCount: number;
  followerCount: number;
  followingCount: number;
  isFollowedByMe: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}
