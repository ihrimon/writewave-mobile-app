import cors from 'cors';
import express from 'express';

import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import articleRoutes from './routes/article.routes';
import authorRoutes from './routes/author.routes';
import authRoutes from './routes/auth.routes';

const app = express();

app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/authors', authorRoutes);

app.use(errorHandler);

export default app;
