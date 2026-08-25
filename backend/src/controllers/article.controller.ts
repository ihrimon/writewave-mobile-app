import { Response } from 'express';
import { QueryFilter, Types } from 'mongoose';
import { z } from 'zod';

import { AuthRequest } from '../middleware/auth.middleware';
import { Article, IArticle } from '../models/Article';
import { Like } from '../models/Like';

const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  category: z.string().trim().min(1).optional(),
  tag: z.string().trim().min(1).optional(),
  search: z.string().trim().min(1).optional(),
  authorId: z
    .string()
    .trim()
    .refine((v) => Types.ObjectId.isValid(v), 'Invalid authorId')
    .optional(),
});

function excerptOf(content: string, length = 150): string {
  const trimmed = content.trim();
  return trimmed.length > length ? `${trimmed.slice(0, length).trim()}…` : trimmed;
}

interface PopulatedAuthor {
  _id: Types.ObjectId;
  name: string;
  avatarUrl?: string;
  bio?: string;
}

interface ArticleWithPopulatedAuthor {
  _id: Types.ObjectId;
  title: string;
  content: string;
  coverImage?: string;
  category: string;
  tags: string[];
  likeCount: number;
  createdAt: Date;
  authorId: PopulatedAuthor;
}

function serializeArticleDetail(article: ArticleWithPopulatedAuthor) {
  return {
    id: String(article._id),
    title: article.title,
    content: article.content,
    coverImage: article.coverImage,
    category: article.category,
    tags: article.tags,
    likeCount: article.likeCount,
    createdAt: article.createdAt,
    author: {
      id: String(article.authorId._id),
      name: article.authorId.name,
      avatarUrl: article.authorId.avatarUrl,
      bio: article.authorId.bio,
    },
  };
}

const articleInputSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters'),
  content: z.string().trim().min(10, 'Content must be at least 10 characters'),
  category: z.string().trim().min(1, 'Category is required'),
  tags: z.array(z.string().trim().min(1)).max(10).default([]),
  coverImage: z.string().trim().url('coverImage must be a valid URL').optional(),
});

export async function listArticles(req: AuthRequest, res: Response) {
  const parsed = listQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.issues[0].message });
    return;
  }
  const { page, limit, category, tag, search, authorId } = parsed.data;

  const filter: QueryFilter<IArticle> = {};
  if (category) filter.category = category;
  if (tag) filter.tags = tag;
  if (search) filter.$text = { $search: search };
  if (authorId) filter.authorId = new Types.ObjectId(authorId);

  let query = Article.find(filter);
  query = search
    ? query.select({ score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' } })
    : query.sort({ createdAt: -1 });

  const [articles, totalCount] = await Promise.all([
    query
      .skip((page - 1) * limit)
      .limit(limit)
      .populate<{ authorId: PopulatedAuthor }>('authorId', 'name avatarUrl')
      .lean(),
    Article.countDocuments(filter),
  ]);

  const items = articles.map((article) => ({
    id: String(article._id),
    title: article.title,
    excerpt: excerptOf(article.content),
    coverImage: article.coverImage,
    category: article.category,
    tags: article.tags,
    likeCount: article.likeCount,
    createdAt: article.createdAt,
    author: {
      id: String(article.authorId._id),
      name: article.authorId.name,
      avatarUrl: article.authorId.avatarUrl,
    },
  }));

  res.json({
    articles: items,
    page,
    hasMore: page * limit < totalCount,
  });
}

export async function getArticle(req: AuthRequest, res: Response) {
  const { id } = req.params;
  if (typeof id !== 'string' || !Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: 'Invalid article id' });
    return;
  }

  const article = await Article.findById(id)
    .populate<{ authorId: PopulatedAuthor }>('authorId', 'name avatarUrl bio')
    .lean();

  if (!article) {
    res.status(404).json({ message: 'Article not found' });
    return;
  }

  const isLiked = req.userId
    ? Boolean(await Like.exists({ userId: req.userId, articleId: id }))
    : false;

  res.json({ article: { ...serializeArticleDetail(article), isLiked } });
}

export async function toggleLike(req: AuthRequest, res: Response) {
  const { id } = req.params;
  if (typeof id !== 'string' || !Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: 'Invalid article id' });
    return;
  }

  const article = await Article.findById(id);
  if (!article) {
    res.status(404).json({ message: 'Article not found' });
    return;
  }

  const existing = await Like.findOne({ userId: req.userId, articleId: id });
  let liked: boolean;
  if (existing) {
    await existing.deleteOne();
    article.likeCount = Math.max(0, article.likeCount - 1);
    liked = false;
  } else {
    await Like.create({ userId: req.userId, articleId: id });
    article.likeCount += 1;
    liked = true;
  }
  await article.save();

  res.json({ liked, likeCount: article.likeCount });
}

export async function createArticle(req: AuthRequest, res: Response) {
  const parsed = articleInputSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.issues[0].message });
    return;
  }

  const article = await Article.create({
    ...parsed.data,
    authorId: req.userId,
  });
  const populated = await article.populate<{ authorId: PopulatedAuthor }>(
    'authorId',
    'name avatarUrl bio'
  );

  res.status(201).json({ article: serializeArticleDetail(populated) });
}

export async function updateArticle(req: AuthRequest, res: Response) {
  const { id } = req.params;
  if (typeof id !== 'string' || !Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: 'Invalid article id' });
    return;
  }

  const parsed = articleInputSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.issues[0].message });
    return;
  }

  const article = await Article.findById(id);
  if (!article) {
    res.status(404).json({ message: 'Article not found' });
    return;
  }

  if (article.authorId.toString() !== req.userId) {
    res.status(403).json({ message: 'You can only edit your own articles' });
    return;
  }

  article.set(parsed.data);
  await article.save();
  const populated = await article.populate<{ authorId: PopulatedAuthor }>(
    'authorId',
    'name avatarUrl bio'
  );

  res.json({ article: serializeArticleDetail(populated) });
}
