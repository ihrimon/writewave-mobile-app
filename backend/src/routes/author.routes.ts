import { Router } from 'express';

import { getAuthor, toggleFollow } from '../controllers/author.controller';
import { optionalAuth, requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.get('/:id', optionalAuth, getAuthor);
router.post('/:id/follow', requireAuth, toggleFollow);

export default router;
