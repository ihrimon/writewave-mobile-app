import { Response } from 'express';
import { Types } from 'mongoose';
import { z } from 'zod';

import { AuthRequest } from '../middleware/auth.middleware';
import { Article } from '../models/Article';
import { Comment } from '../models/Comment';

interface PopulatedCommentAuthor {
  _id: Types.ObjectId;
  name: string;
  avatarUrl?: string;
}

const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

function serializeComment(comment: {
  _id: Types.ObjectId;
  text: string;
  createdAt: Date;
  authorId: PopulatedCommentAuthor;
}) {
  return {
    id: String(comment._id),
    text: comment.text,
    createdAt: comment.createdAt,
    author: {
      id: String(comment.authorId._id),
      name: comment.authorId.name,
      avatarUrl: comment.authorId.avatarUrl,
    },
  };
}

export async function listComments(req: AuthRequest, res: Response) {
  const { id: articleId } = req.params;
  if (typeof articleId !== 'string' || !Types.ObjectId.isValid(articleId)) {
    res.status(400).json({ message: 'Invalid article id' });
    return;
  }

  const parsed = listQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.issues[0].message });
    return;
  }
  const { page, limit } = parsed.data;

  const articleExists = await Article.exists({ _id: articleId });
  if (!articleExists) {
    res.status(404).json({ message: 'Article not found' });
    return;
  }

  const [comments, totalCount] = await Promise.all([
    Comment.find({ articleId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate<{ authorId: PopulatedCommentAuthor }>('authorId', 'name avatarUrl')
      .lean(),
    Comment.countDocuments({ articleId }),
  ]);

  res.json({
    comments: comments.map(serializeComment),
    page,
    hasMore: page * limit < totalCount,
  });
}

const createCommentSchema = z.object({
  text: z.string().trim().min(1, 'Comment cannot be empty').max(1000, 'Comment is too long'),
});

export async function createComment(req: AuthRequest, res: Response) {
  const { id: articleId } = req.params;
  if (typeof articleId !== 'string' || !Types.ObjectId.isValid(articleId)) {
    res.status(400).json({ message: 'Invalid article id' });
    return;
  }

  const parsed = createCommentSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.issues[0].message });
    return;
  }

  const articleExists = await Article.exists({ _id: articleId });
  if (!articleExists) {
    res.status(404).json({ message: 'Article not found' });
    return;
  }

  const comment = await Comment.create({
    articleId,
    authorId: req.userId,
    text: parsed.data.text,
  });
  const populated = await comment.populate<{ authorId: PopulatedCommentAuthor }>(
    'authorId',
    'name avatarUrl'
  );

  res.status(201).json({ comment: serializeComment(populated) });
}
