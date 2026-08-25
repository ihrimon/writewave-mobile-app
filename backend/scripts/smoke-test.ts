process.env.JWT_SECRET = 'smoke-test-secret';

import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';

let passed = 0;
let failed = 0;

function check(label: string, condition: boolean) {
  if (condition) {
    console.log(`  ok  - ${label}`);
    passed++;
  } else {
    console.log(`  FAIL - ${label}`);
    failed++;
  }
}

async function main() {
  const mongod = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongod.getUri();

  const { default: app } = await import('../src/app');
  const { Article } = await import('../src/models/Article');
  const { User } = await import('../src/models/User');
  const { Comment } = await import('../src/models/Comment');
  const { Like } = await import('../src/models/Like');
  const { Follow } = await import('../src/models/Follow');
  await mongoose.connect(process.env.MONGODB_URI);
  // প্রতিটা মডেলের ইনডেক্স বিল্ড হওয়া পর্যন্ত অপেক্ষা করে (Article-এর text index, Like/Follow-এর unique index)
  await Promise.all([User.init(), Article.init(), Comment.init(), Like.init(), Follow.init()]);

  const registerRes = await request(app).post('/api/auth/register').send({
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
  });
  check('register → 201', registerRes.status === 201);
  check('register → returns token', typeof registerRes.body.token === 'string');
  check(
    'register → passwordHash never exposed',
    registerRes.body.user.passwordHash === undefined
  );

  const dupRes = await request(app).post('/api/auth/register').send({
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
  });
  check('duplicate email register → 409', dupRes.status === 409);

  const badRes = await request(app).post('/api/auth/register').send({
    name: 'a',
    email: 'not-an-email',
    password: '123',
  });
  check('invalid register body → 400', badRes.status === 400);

  const wrongLoginRes = await request(app).post('/api/auth/login').send({
    email: 'test@example.com',
    password: 'wrongpassword',
  });
  check('login wrong password → 401', wrongLoginRes.status === 401);

  const loginRes = await request(app).post('/api/auth/login').send({
    email: 'test@example.com',
    password: 'password123',
  });
  check('login correct password → 200', loginRes.status === 200);
  const token = loginRes.body.token as string;

  const meNoTokenRes = await request(app).get('/api/auth/me');
  check('/me without token → 401', meNoTokenRes.status === 401);

  const meRes = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`);
  check('/me with valid token → 200', meRes.status === 200);
  check('/me returns correct email', meRes.body.user.email === 'test@example.com');

  const meBadTokenRes = await request(app)
    .get('/api/auth/me')
    .set('Authorization', 'Bearer garbage');
  check('/me with garbage token → 401', meBadTokenRes.status === 401);

  // দ্বিতীয় ইউজার — "other user"-এর প্রয়োজন এমন টেস্টে (ownership 403, follow) ব্যবহার হবে
  const secondRegisterRes = await request(app).post('/api/auth/register').send({
    name: 'Second User',
    email: 'second@example.com',
    password: 'password123',
  });
  check('second user register → 201', secondRegisterRes.status === 201);
  const otherUserToken = secondRegisterRes.body.token as string;

  // --- Phase 2: Feed / GET /api/articles ---
  const authorId = registerRes.body.user.id as string;
  const totalArticles = 15;
  for (let i = 0; i < totalArticles; i++) {
    await Article.create({
      title: `Test Article ${i + 1}`,
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(5),
      category: i % 2 === 0 ? 'Technology' : 'Sports',
      tags: ['test'],
      authorId,
    });
  }

  const page1Res = await request(app).get('/api/articles').query({ page: 1, limit: 10 });
  check('GET /articles page 1 → 200', page1Res.status === 200);
  check('GET /articles page 1 → 10 items', page1Res.body.articles.length === 10);
  check('GET /articles page 1 → hasMore true', page1Res.body.hasMore === true);

  const page2Res = await request(app).get('/api/articles').query({ page: 2, limit: 10 });
  check('GET /articles page 2 → 5 items', page2Res.body.articles.length === 5);
  check('GET /articles page 2 → hasMore false', page2Res.body.hasMore === false);

  const newest = page1Res.body.articles[0];
  check('articles → sorted newest first', newest.title === `Test Article ${totalArticles}`);
  check('articles → author populated (name)', newest.author.name === 'Test User');
  check('articles → author populated (id matches)', newest.author.id === authorId);
  check(
    'articles → excerpt truncated to ~150 chars',
    typeof newest.excerpt === 'string' && newest.excerpt.length <= 151
  );
  check('articles → author never leaks passwordHash', newest.author.passwordHash === undefined);

  const invalidPageRes = await request(app).get('/api/articles').query({ page: 0 });
  check('GET /articles invalid page → 400', invalidPageRes.status === 400);

  const invalidLimitRes = await request(app).get('/api/articles').query({ limit: 100 });
  check('GET /articles limit over max → 400', invalidLimitRes.status === 400);

  // --- Phase 3: Article Detail / GET /api/articles/:id ---
  await User.findByIdAndUpdate(authorId, { bio: 'A test author bio' });

  const detailRes = await request(app).get(`/api/articles/${newest.id}`);
  check('GET /articles/:id → 200', detailRes.status === 200);
  check('GET /articles/:id → correct title', detailRes.body.article.title === newest.title);
  check(
    'GET /articles/:id → full content, longer than the list excerpt',
    detailRes.body.article.content.length > newest.excerpt.length
  );
  check('GET /articles/:id → no excerpt field (full content instead)', !('excerpt' in detailRes.body.article));
  check(
    'GET /articles/:id → author bio comes through correctly',
    detailRes.body.article.author.bio === 'A test author bio'
  );
  check(
    'GET /articles/:id → author never leaks passwordHash',
    detailRes.body.article.author.passwordHash === undefined
  );

  const malformedIdRes = await request(app).get('/api/articles/not-a-valid-id');
  check('GET /articles/:id malformed id → 400', malformedIdRes.status === 400);

  const nonExistentIdRes = await request(app).get(
    `/api/articles/${new mongoose.Types.ObjectId().toString()}`
  );
  check('GET /articles/:id non-existent id → 404', nonExistentIdRes.status === 404);

  // --- Phase 4: Filtering & Search ---
  await Article.create({
    title: 'Exploring Quantum Computing Basics',
    content: 'Quantum computers exploit superposition and entanglement to process information.',
    category: 'Technology',
    tags: ['quantum', 'physics'],
    authorId,
  });
  await Article.create({
    title: 'Local Team Wins Championship',
    content: 'The home football club secured a historic win in the final match of the season.',
    category: 'Sports',
    tags: ['football', 'championship'],
    authorId,
  });

  const categoryRes = await request(app)
    .get('/api/articles')
    .query({ category: 'Sports', limit: 50 });
  check('GET /articles?category=Sports → 200', categoryRes.status === 200);
  check(
    'GET /articles?category=Sports → only Sports articles returned',
    categoryRes.body.articles.length > 0 &&
      categoryRes.body.articles.every((a: { category: string }) => a.category === 'Sports')
  );

  const tagRes = await request(app).get('/api/articles').query({ tag: 'quantum' });
  check('GET /articles?tag=quantum → exactly 1 result', tagRes.body.articles.length === 1);
  check(
    'GET /articles?tag=quantum → correct article',
    tagRes.body.articles[0].title === 'Exploring Quantum Computing Basics'
  );

  const searchRes = await request(app).get('/api/articles').query({ search: 'championship' });
  check(
    'GET /articles?search=championship → finds the match',
    searchRes.body.articles.some(
      (a: { title: string }) => a.title === 'Local Team Wins Championship'
    )
  );

  const searchNoMatchRes = await request(app)
    .get('/api/articles')
    .query({ search: 'nonexistentxyztermzzz' });
  check(
    'GET /articles?search= with no match → empty array',
    searchNoMatchRes.body.articles.length === 0
  );

  const emptyCategoryRes = await request(app).get('/api/articles').query({ category: '' });
  check('GET /articles?category= (empty string) → 400', emptyCategoryRes.status === 400);

  // --- Phase 5: Create/Edit Article ---
  const noAuthCreateRes = await request(app).post('/api/articles').send({
    title: 'Should Not Be Created',
    content: 'This request has no Authorization header.',
    category: 'Technology',
  });
  check('POST /articles without auth → 401', noAuthCreateRes.status === 401);

  const createRes = await request(app)
    .post('/api/articles')
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: 'My First WriteWave Article',
      content: 'This is the full body of my very first article on WriteWave.',
      category: 'Technology',
      tags: ['intro', 'writewave'],
    });
  check('POST /articles → 201', createRes.status === 201);
  check('POST /articles → correct title', createRes.body.article.title === 'My First WriteWave Article');
  check('POST /articles → author is the requester', createRes.body.article.author.id === authorId);
  check('POST /articles → likeCount starts at 0', createRes.body.article.likeCount === 0);

  const createdArticleId = createRes.body.article.id as string;

  const invalidCreateRes = await request(app)
    .post('/api/articles')
    .set('Authorization', `Bearer ${token}`)
    .send({ title: 'ab', content: 'too short', category: 'Technology' });
  check('POST /articles invalid body (short title) → 400', invalidCreateRes.status === 400);

  const updateRes = await request(app)
    .put(`/api/articles/${createdArticleId}`)
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: 'My First WriteWave Article (Updated)',
      content: 'This is the full body of my very first article on WriteWave.',
      category: 'Technology',
      tags: ['intro', 'writewave', 'edited'],
    });
  check('PUT /articles/:id (own article) → 200', updateRes.status === 200);
  check(
    'PUT /articles/:id → title actually updated',
    updateRes.body.article.title === 'My First WriteWave Article (Updated)'
  );
  check(
    'PUT /articles/:id → tags actually updated',
    updateRes.body.article.tags.includes('edited')
  );

  const forbiddenUpdateRes = await request(app)
    .put(`/api/articles/${createdArticleId}`)
    .set('Authorization', `Bearer ${otherUserToken}`)
    .send({
      title: 'Hijacked Title',
      content: 'Trying to edit someone else’s article.',
      category: 'Technology',
    });
  check('PUT /articles/:id by non-owner → 403', forbiddenUpdateRes.status === 403);

  const noAuthUpdateRes = await request(app).put(`/api/articles/${createdArticleId}`).send({
    title: 'No Auth Update',
    content: 'This request has no Authorization header.',
    category: 'Technology',
  });
  check('PUT /articles/:id without auth → 401', noAuthUpdateRes.status === 401);

  const updateNonExistentRes = await request(app)
    .put(`/api/articles/${new mongoose.Types.ObjectId().toString()}`)
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: 'Does Not Exist',
      content: 'This article id does not exist in the database.',
      category: 'Technology',
    });
  check('PUT /articles/:id non-existent id → 404', updateNonExistentRes.status === 404);

  // --- Phase 6: Engagement — Like ---
  const noAuthLikeRes = await request(app).post(`/api/articles/${createdArticleId}/like`);
  check('POST /articles/:id/like without auth → 401', noAuthLikeRes.status === 401);

  const likeRes = await request(app)
    .post(`/api/articles/${createdArticleId}/like`)
    .set('Authorization', `Bearer ${token}`);
  check('POST /articles/:id/like → 200', likeRes.status === 200);
  check('POST /articles/:id/like → liked true', likeRes.body.liked === true);
  check('POST /articles/:id/like → likeCount 1', likeRes.body.likeCount === 1);

  const detailAfterLikeRes = await request(app)
    .get(`/api/articles/${createdArticleId}`)
    .set('Authorization', `Bearer ${token}`);
  check('GET /articles/:id (liked, with token) → isLiked true', detailAfterLikeRes.body.article.isLiked === true);

  const detailNoAuthRes = await request(app).get(`/api/articles/${createdArticleId}`);
  check(
    'GET /articles/:id (liked, no token) → isLiked false',
    detailNoAuthRes.body.article.isLiked === false
  );

  const unlikeRes = await request(app)
    .post(`/api/articles/${createdArticleId}/like`)
    .set('Authorization', `Bearer ${token}`);
  check('POST /articles/:id/like again → toggles off (liked false)', unlikeRes.body.liked === false);
  check('POST /articles/:id/like again → likeCount back to 0', unlikeRes.body.likeCount === 0);

  const likeNonExistentRes = await request(app)
    .post(`/api/articles/${new mongoose.Types.ObjectId().toString()}/like`)
    .set('Authorization', `Bearer ${token}`);
  check('POST /articles/:id/like non-existent id → 404', likeNonExistentRes.status === 404);

  // --- Phase 6: Engagement — Comments ---
  const emptyCommentsRes = await request(app).get(`/api/articles/${createdArticleId}/comments`);
  check('GET /articles/:id/comments (empty) → 200', emptyCommentsRes.status === 200);
  check('GET /articles/:id/comments (empty) → empty array', emptyCommentsRes.body.comments.length === 0);

  const noAuthCommentRes = await request(app)
    .post(`/api/articles/${createdArticleId}/comments`)
    .send({ text: 'Should not be posted' });
  check('POST /articles/:id/comments without auth → 401', noAuthCommentRes.status === 401);

  const createCommentRes = await request(app)
    .post(`/api/articles/${createdArticleId}/comments`)
    .set('Authorization', `Bearer ${token}`)
    .send({ text: 'Great article, thanks for sharing!' });
  check('POST /articles/:id/comments → 201', createCommentRes.status === 201);
  check(
    'POST /articles/:id/comments → correct text',
    createCommentRes.body.comment.text === 'Great article, thanks for sharing!'
  );
  check('POST /articles/:id/comments → correct author', createCommentRes.body.comment.author.id === authorId);

  const emptyCommentRes = await request(app)
    .post(`/api/articles/${createdArticleId}/comments`)
    .set('Authorization', `Bearer ${token}`)
    .send({ text: '   ' });
  check('POST /articles/:id/comments empty text → 400', emptyCommentRes.status === 400);

  const commentsAfterPostRes = await request(app).get(`/api/articles/${createdArticleId}/comments`);
  check('GET /articles/:id/comments → 1 comment now', commentsAfterPostRes.body.comments.length === 1);

  const commentsNonExistentRes = await request(app).get(
    `/api/articles/${new mongoose.Types.ObjectId().toString()}/comments`
  );
  check('GET /articles/:id/comments non-existent article → 404', commentsNonExistentRes.status === 404);

  // --- Phase 6: Engagement — Author profile & Follow ---
  const authorProfileRes = await request(app).get(`/api/authors/${authorId}`);
  check('GET /authors/:id → 200', authorProfileRes.status === 200);
  check('GET /authors/:id → articleCount > 0', authorProfileRes.body.author.articleCount > 0);
  check('GET /authors/:id → followerCount starts at 0', authorProfileRes.body.author.followerCount === 0);
  check('GET /authors/:id → isFollowedByMe false (no auth)', authorProfileRes.body.author.isFollowedByMe === false);

  const invalidAuthorRes = await request(app).get('/api/authors/not-a-valid-id');
  check('GET /authors/:id malformed id → 400', invalidAuthorRes.status === 400);

  const nonExistentAuthorRes = await request(app).get(
    `/api/authors/${new mongoose.Types.ObjectId().toString()}`
  );
  check('GET /authors/:id non-existent id → 404', nonExistentAuthorRes.status === 404);

  const selfFollowRes = await request(app)
    .post(`/api/authors/${authorId}/follow`)
    .set('Authorization', `Bearer ${token}`);
  check('POST /authors/:id/follow self → 400', selfFollowRes.status === 400);

  const noAuthFollowRes = await request(app).post(`/api/authors/${authorId}/follow`);
  check('POST /authors/:id/follow without auth → 401', noAuthFollowRes.status === 401);

  const followRes = await request(app)
    .post(`/api/authors/${authorId}/follow`)
    .set('Authorization', `Bearer ${otherUserToken}`);
  check('POST /authors/:id/follow → 200', followRes.status === 200);
  check('POST /authors/:id/follow → following true', followRes.body.following === true);
  check('POST /authors/:id/follow → followerCount 1', followRes.body.followerCount === 1);

  const authorProfileAfterFollowRes = await request(app)
    .get(`/api/authors/${authorId}`)
    .set('Authorization', `Bearer ${otherUserToken}`);
  check(
    'GET /authors/:id (as follower) → isFollowedByMe true',
    authorProfileAfterFollowRes.body.author.isFollowedByMe === true
  );
  check(
    'GET /authors/:id (as follower) → followerCount 1',
    authorProfileAfterFollowRes.body.author.followerCount === 1
  );

  const unfollowRes = await request(app)
    .post(`/api/authors/${authorId}/follow`)
    .set('Authorization', `Bearer ${otherUserToken}`);
  check('POST /authors/:id/follow again → toggles off (following false)', unfollowRes.body.following === false);
  check('POST /authors/:id/follow again → followerCount back to 0', unfollowRes.body.followerCount === 0);

  const followNonExistentRes = await request(app)
    .post(`/api/authors/${new mongoose.Types.ObjectId().toString()}/follow`)
    .set('Authorization', `Bearer ${otherUserToken}`);
  check('POST /authors/:id/follow non-existent author → 404', followNonExistentRes.status === 404);

  await mongoose.disconnect();
  await mongod.stop();

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
