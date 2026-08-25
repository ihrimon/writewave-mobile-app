import { Router } from 'express';

import {
  createArticle,
  getArticle,
  listArticles,
  toggleLike,
  updateArticle,
} from '../controllers/article.controller';
import { createComment, listComments } from '../controllers/comment.controller';
import { optionalAuth, requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.get('/', listArticles);
router.get('/:id', optionalAuth, getArticle);
router.post('/', requireAuth, createArticle);
router.put('/:id', requireAuth, updateArticle);
router.post('/:id/like', requireAuth, toggleLike);
router.get('/:id/comments', listComments);
router.post('/:id/comments', requireAuth, createComment);

export default router;
