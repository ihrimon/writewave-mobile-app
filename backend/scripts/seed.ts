import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

import { env } from '../src/config/env';
import { Article } from '../src/models/Article';
import { User } from '../src/models/User';

const SAMPLE_ARTICLES = [
  { title: 'Getting Started with React Native', category: 'Technology', tags: ['react-native', 'mobile'] },
  { title: 'Why TypeScript Catches Bugs Before Runtime', category: 'Technology', tags: ['typescript'] },
  { title: 'Understanding MongoDB Indexes', category: 'Technology', tags: ['mongodb', 'database'] },
  { title: 'A Beginner Guide to Local Football Leagues', category: 'Sports', tags: ['football'] },
  { title: 'Cricket World Cup: What to Expect This Year', category: 'Sports', tags: ['cricket'] },
  { title: 'How Local Elections Shape City Policy', category: 'Politics', tags: ['local-government'] },
  { title: 'Understanding the Budget Session', category: 'Politics', tags: ['budget'] },
  { title: '5 Habits for Better Sleep', category: 'Health', tags: ['sleep', 'wellness'] },
  { title: 'Why Walking 30 Minutes a Day Matters', category: 'Health', tags: ['fitness'] },
  { title: 'Community Gardens and Mental Health', category: 'Health', tags: ['community'] },
  { title: 'Building Your First REST API', category: 'Technology', tags: ['backend', 'express'] },
  { title: 'What Makes a City Walkable', category: 'Politics', tags: ['urban-planning'] },
];

async function seed() {
  await mongoose.connect(env.MONGODB_URI);
  console.log('Connected to MongoDB for seeding');

  const email = 'demo@writewave.dev';
  let user = await User.findOne({ email });
  if (!user) {
    const passwordHash = await bcrypt.hash('password123', 10);
    user = await User.create({
      name: 'Demo Writer',
      email,
      passwordHash,
      bio: 'WriteWave-এর demo/seed অ্যাকাউন্ট, লোকাল ডেভেলপমেন্টে ব্যবহারের জন্য',
    });
    console.log(`Created demo user: ${email} / password123`);
  } else {
    console.log(`Demo user already exists: ${email}`);
  }

  await Article.deleteMany({ authorId: user._id });

  for (const sample of SAMPLE_ARTICLES) {
    await Article.create({
      title: sample.title,
      content: `${sample.title}\n\nThis is placeholder seed content for local development and testing. `.repeat(
        8
      ),
      category: sample.category,
      tags: sample.tags,
      authorId: user._id,
    });
  }

  console.log(`Seeded ${SAMPLE_ARTICLES.length} articles for ${email}`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
