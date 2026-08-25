import mongoose from 'mongoose';

import app from './app';
import { env } from './config/env';
import { Article } from './models/Article';
import { Comment } from './models/Comment';
import { Follow } from './models/Follow';
import { Like } from './models/Like';
import { User } from './models/User';

async function start() {
  await mongoose.connect(env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // প্রতিটা মডেলের ইনডেক্স (Article-এর text index, Like/Follow-এর unique compound index)
  // বিল্ড হওয়া পর্যন্ত অপেক্ষা করে, যাতে সার্ভার রিকোয়েস্ট নেওয়া শুরু করার আগেই সবগুলো
  // ইনডেক্স-নির্ভর গ্যারান্টি (unique constraint, $text search) কার্যকর থাকে।
  await Promise.all([User.init(), Article.init(), Comment.init(), Like.init(), Follow.init()]);

  app.listen(env.PORT, () => {
    console.log(`WriteWave backend running on port ${env.PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
