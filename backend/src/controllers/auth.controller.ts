import bcrypt from 'bcrypt';
import { Response } from 'express';
import { z } from 'zod';

import { AuthRequest } from '../middleware/auth.middleware';
import { IUser, User } from '../models/User';
import { signToken } from '../utils/jwt';

const SALT_ROUNDS = 10;

function toPublicUser(user: IUser) {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    bio: user.bio,
  };
}

const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.string().trim().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function register(req: AuthRequest, res: Response) {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.issues[0].message });
    return;
  }
  const { name, email, password } = parsed.data;

  const existing = await User.findOne({ email });
  if (existing) {
    res.status(409).json({ message: 'An account with this email already exists' });
    return;
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({ name, email, passwordHash });

  const token = signToken({ userId: String(user._id) });
  res.status(201).json({ token, user: toPublicUser(user) });
}

const loginSchema = z.object({
  email: z.string().trim().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

export async function login(req: AuthRequest, res: Response) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.issues[0].message });
    return;
  }
  const { email, password } = parsed.data;

  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user) {
    res.status(401).json({ message: 'Invalid email or password' });
    return;
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    res.status(401).json({ message: 'Invalid email or password' });
    return;
  }

  const token = signToken({ userId: String(user._id) });
  res.json({ token, user: toPublicUser(user) });
}

export async function me(req: AuthRequest, res: Response) {
  const user = await User.findById(req.userId);
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  res.json({ user: toPublicUser(user) });
}
