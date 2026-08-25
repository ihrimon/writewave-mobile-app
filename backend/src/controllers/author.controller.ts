import { Response } from 'express';
import { Types } from 'mongoose';

import { AuthRequest } from '../middleware/auth.middleware';
import { Article } from '../models/Article';
import { Follow } from '../models/Follow';
import { User } from '../models/User';

export async function getAuthor(req: AuthRequest, res: Response) {
  const { id } = req.params;
  if (typeof id !== 'string' || !Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: 'Invalid author id' });
    return;
  }

  const author = await User.findById(id).lean();
  if (!author) {
    res.status(404).json({ message: 'Author not found' });
    return;
  }

  const [articleCount, followerCount, followingCount, isFollowedByMe] = await Promise.all([
    Article.countDocuments({ authorId: id }),
    Follow.countDocuments({ followingId: id }),
    Follow.countDocuments({ followerId: id }),
    req.userId
      ? Follow.exists({ followerId: req.userId, followingId: id })
      : Promise.resolve(null),
  ]);

  res.json({
    author: {
      id: String(author._id),
      name: author.name,
      avatarUrl: author.avatarUrl,
      bio: author.bio,
      articleCount,
      followerCount,
      followingCount,
      isFollowedByMe: Boolean(isFollowedByMe),
    },
  });
}

export async function toggleFollow(req: AuthRequest, res: Response) {
  const { id } = req.params;
  if (typeof id !== 'string' || !Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: 'Invalid author id' });
    return;
  }

  if (id === req.userId) {
    res.status(400).json({ message: 'You cannot follow yourself' });
    return;
  }

  const authorExists = await User.exists({ _id: id });
  if (!authorExists) {
    res.status(404).json({ message: 'Author not found' });
    return;
  }

  const existing = await Follow.findOne({ followerId: req.userId, followingId: id });
  let following: boolean;
  if (existing) {
    await existing.deleteOne();
    following = false;
  } else {
    await Follow.create({ followerId: req.userId, followingId: id });
    following = true;
  }

  const followerCount = await Follow.countDocuments({ followingId: id });

  res.json({ following, followerCount });
}
