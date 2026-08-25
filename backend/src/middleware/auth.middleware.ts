import { NextFunction, Request, Response } from 'express';

import { verifyToken } from '../utils/jwt';

export interface AuthRequest extends Request {
  userId?: string;
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Authorization token missing' });
    return;
  }

  const token = header.slice('Bearer '.length);
  try {
    const payload = verifyToken(token);
    req.userId = payload.userId;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}

// পাবলিক রুটে (যেমন article detail) ব্যবহার হয়, যেখানে লগইন ছাড়াও দেখা যায় কিন্তু
// লগইন থাকলে অতিরিক্ত তথ্য (যেমন isLiked) দেখাতে হয়। টোকেন না থাকলে বা invalid হলেও
// request block করে না — শুধু req.userId সেট হয় না।
export function optionalAuth(req: AuthRequest, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) {
    const token = header.slice('Bearer '.length);
    try {
      const payload = verifyToken(token);
      req.userId = payload.userId;
    } catch {
      // invalid/expired token — logged-out হিসেবে ট্রিট করা হবে, ব্লক করা হবে না
    }
  }
  next();
}
