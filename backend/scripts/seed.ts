import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

import { env } from '../src/config/env';
import { Article } from '../src/models/Article';
import { User } from '../src/models/User';

const SAMPLE_ARTICLES = [
  {
    title: 'Getting Started with React Native',
    category: 'Technology',
    tags: ['react-native', 'mobile'],
    coverImage: 'https://picsum.photos/seed/writewave-react-native/800/500',
    content:
      'React Native lets you build native mobile apps for both Android and iOS from a single JavaScript/TypeScript codebase. Instead of rendering to the DOM like React does on the web, React Native renders to real native UI components, which is why apps built with it feel and perform like native apps rather than embedded web pages.\n\nTo get started, you need Node.js installed and can scaffold a new project with `npx create-expo-app`. Expo wraps React Native with a managed workflow that handles a lot of the native build complexity for you, so you can test your app instantly on a physical device using the Expo Go app, without installing Xcode or Android Studio first.\n\nOnce your project is running, the core building blocks are components like View, Text, and ScrollView, which map to native containers under the hood. Styling is done with a JavaScript object syntax similar to CSS, and navigation between screens is typically handled by a library such as Expo Router or React Navigation.',
  },
  {
    title: 'Why TypeScript Catches Bugs Before Runtime',
    category: 'Technology',
    tags: ['typescript'],
    coverImage: 'https://picsum.photos/seed/writewave-typescript/800/500',
    content:
      'JavaScript is a dynamically typed language, which means type errors — like calling a function with the wrong kind of argument, or accessing a property that does not exist — only surface when that exact line of code actually runs. In a large codebase, that often means the bug reaches a user before a developer ever sees it.\n\nTypeScript adds a static type system on top of JavaScript, checked entirely at compile time. Your editor can flag a mismatched type the moment you write it, long before the code is executed, and a build step will refuse to compile code with type errors at all.\n\nBeyond catching typos and mismatched arguments, TypeScript makes refactoring safer. Rename a field on a shared interface and the compiler will point to every single place that needs to be updated, instead of you discovering the missed spots one crash report at a time.',
  },
  {
    title: 'Understanding MongoDB Indexes',
    category: 'Technology',
    tags: ['mongodb', 'database'],
    coverImage: 'https://picsum.photos/seed/writewave-mongodb/800/500',
    content:
      'Without an index, MongoDB has to perform a collection scan to satisfy a query — checking every single document to see if it matches. That is fine for a few hundred rows, but on a collection with millions of documents, it turns a simple lookup into a slow, expensive operation.\n\nAn index is a separate, ordered data structure that stores the values of specific fields, allowing MongoDB to jump directly to matching documents instead of scanning everything. A well-placed index can turn a query that takes seconds into one that takes milliseconds.\n\nIndexes are not free, though — every index adds overhead to writes, since MongoDB has to update the index whenever a document changes, and each index consumes additional disk space. The practical approach is to index the fields you actually filter and sort on most often, such as a createdAt field for a feed sorted by recency, rather than indexing everything by default.',
  },
  {
    title: 'A Beginner Guide to Local Football Leagues',
    category: 'Sports',
    tags: ['football'],
    coverImage: 'https://picsum.photos/seed/writewave-football/800/500',
    content:
      'Local football leagues are often where the sport feels most alive — smaller crowds, community rivalries, and players who might be your neighbor during the week. Unlike top-tier professional leagues, most local leagues are organized around district or city associations, with promotion and relegation between tiers based on each season\'s performance.\n\nA typical season runs on a round-robin format, where every team plays every other team at least once, and points are awarded for wins and draws to determine the final standings. Many leagues also run a parallel knockout cup competition, which gives lower-ranked teams a real shot at a trophy even in a season where the league title is out of reach.\n\nFollowing a local league is a good way to spot talent early — many players who go on to represent bigger clubs or even national teams started out playing in exactly these kinds of community competitions.',
  },
  {
    title: 'Cricket World Cup: What to Expect This Year',
    category: 'Sports',
    tags: ['cricket'],
    coverImage: 'https://picsum.photos/seed/writewave-cricket/800/500',
    content:
      'Every edition of the Cricket World Cup brings its own storylines, but a few questions are always on fans\' minds heading into the tournament: which teams peaked at the right time, how the host conditions will favor batting or bowling, and whether an underdog can pull off an upset against one of the traditional powerhouses.\n\nPitch and weather conditions play an outsized role in cricket compared to most sports. A pitch that helps the ball spin will favor teams with strong spin bowlers, while a flat, dry pitch tends to produce high-scoring batting contests. Teams that build their squads around the expected conditions usually have an edge over teams that simply bring their best players regardless of surface.\n\nAs always, the group stage is where the tournament is often decided before the knockouts even begin — a single bad day against a lower-ranked side can be the difference between qualifying for the semifinals and going home early.',
  },
  {
    title: 'How Local Elections Shape City Policy',
    category: 'Politics',
    tags: ['local-government'],
    coverImage: 'https://picsum.photos/seed/writewave-local-elections/800/500',
    content:
      'National elections tend to dominate headlines, but the decisions that affect daily life most directly — road maintenance, waste collection, local schools, zoning rules — are usually made by city and district-level officials. Local elections determine exactly who holds that power, which is why turnout for them matters just as much as turnout for national votes, even though it is often far lower.\n\nCity council members and mayors typically set the budget priorities for local services, decide on zoning and development permits, and oversee local law enforcement policy. A change in local leadership can shift a city\'s priorities within a single term — from infrastructure-heavy spending to a focus on public housing, for example.\n\nBecause local elections often have a smaller pool of voters, individual votes tend to carry more relative weight than in national elections, and community organizing can have an outsized impact on the outcome.',
  },
  {
    title: 'Understanding the Budget Session',
    category: 'Politics',
    tags: ['budget'],
    coverImage: 'https://picsum.photos/seed/writewave-budget-session/800/500',
    content:
      'The budget session is the period in which a government formally reviews, debates, and approves how public funds will be raised and spent for the upcoming fiscal year. It typically opens with a budget speech laying out revenue projections, planned expenditures, and any new taxes or subsidies, followed by detailed discussion in committee before a final vote.\n\nMost budgets are split between allocations for existing obligations — like salaries, debt payments, and ongoing infrastructure projects — and new spending initiatives that reflect the government\'s current priorities, whether that is healthcare, education, or defense.\n\nFor ordinary citizens, the budget session is worth paying attention to because it directly determines things like tax rates, subsidy programs, and public sector hiring for the year ahead — decisions that are easy to overlook until they show up in a paycheck or a utility bill.',
  },
  {
    title: '5 Habits for Better Sleep',
    category: 'Health',
    tags: ['sleep', 'wellness'],
    coverImage: 'https://picsum.photos/seed/writewave-better-sleep/800/500',
    content:
      "Good sleep is less about a single trick and more about consistent habits repeated every day. Here are five that make a real difference.\n\n1. Keep a consistent sleep schedule, even on weekends — your body's internal clock adjusts to regularity, and constantly shifting it makes falling asleep harder.\n\n2. Cut back on screens for at least 30 minutes before bed. The blue light from phones and laptops suppresses melatonin, the hormone that signals to your body that it's time to sleep.\n\n3. Avoid caffeine in the afternoon — it has a longer half-life than most people expect, and a 3pm coffee can still be affecting you at 10pm.\n\n4. Keep your bedroom cool and dark. A slightly lower room temperature helps your body reach the internal temperature drop associated with deep sleep.\n\n5. Reserve your bed for sleep, not work or scrolling — this helps your brain associate the bed with rest rather than alertness.",
  },
  {
    title: 'Why Walking 30 Minutes a Day Matters',
    category: 'Health',
    tags: ['fitness'],
    coverImage: 'https://picsum.photos/seed/writewave-walking/800/500',
    content:
      "Walking is one of the most under-appreciated forms of exercise, largely because it does not feel like a workout. But 30 minutes of brisk walking a day is associated with meaningful reductions in cardiovascular disease risk, improved mood, and better blood sugar control, according to a wide body of research on moderate-intensity activity.\n\nUnlike high-intensity workouts, walking is low-impact, which means it is sustainable for almost everyone regardless of age or fitness level, and it carries a much lower injury risk than running or heavy resistance training. That sustainability is exactly why it tends to produce better long-term results than workout routines that are hard to stick with.\n\nYou do not need to do it all at once, either — three 10-minute walks spread across the day appear to offer very similar benefits to one continuous 30-minute walk, which makes it easy to fit into even a packed schedule.",
  },
  {
    title: 'Community Gardens and Mental Health',
    category: 'Health',
    tags: ['community'],
    coverImage: 'https://picsum.photos/seed/writewave-community-gardens/800/500',
    content:
      'Community gardens are often framed as a way to grow food, but their impact on mental health is just as significant. Tending a shared plot of land gives people a structured reason to spend time outdoors, and exposure to green space is consistently linked to lower reported stress and anxiety levels.\n\nBeyond the individual benefit, community gardens create a low-pressure setting for social interaction between neighbors who might otherwise never meet. That sense of connection to a local community has been shown to reduce feelings of isolation, particularly among older adults and people who have recently moved to a new area.\n\nThere is also a simple sense of accomplishment involved — watching a plant you tended grow and eventually produce food is a visible, tangible result in a way that a lot of modern work is not, and that kind of small, repeated success can meaningfully improve overall wellbeing.',
  },
  {
    title: 'Building Your First REST API',
    category: 'Technology',
    tags: ['backend', 'express'],
    coverImage: 'https://picsum.photos/seed/writewave-rest-api/800/500',
    content:
      'A REST API exposes your application\'s data and functionality over HTTP, using standard methods — GET to read data, POST to create it, PUT or PATCH to update it, and DELETE to remove it — applied to resource-based URLs like `/articles` or `/articles/:id`.\n\nWith Express, a minimal API starts with defining routes that map an HTTP method and path to a handler function, which reads the request, talks to a database, and sends back a response — typically as JSON. Middleware functions sit in front of your routes to handle cross-cutting concerns like parsing the request body, checking authentication tokens, or logging.\n\nAs the API grows, it is worth separating concerns into layers: routes define the URL structure, controllers hold the request/response logic, and models define how data is shaped and persisted. That separation makes it much easier to test each piece independently and to reason about where a bug is likely to be.',
  },
  {
    title: 'What Makes a City Walkable',
    category: 'Politics',
    tags: ['urban-planning'],
    coverImage: 'https://picsum.photos/seed/writewave-walkable-city/800/500',
    content:
      'A walkable city is one where daily needs — groceries, schools, transit, work — are reachable on foot within a reasonable distance, rather than requiring a car for every trip. Urban planners often use a rough benchmark of a 15-minute walk as the threshold for a neighborhood to be considered genuinely walkable.\n\nMixed-use zoning is one of the biggest factors: when residential buildings, shops, and offices are allowed in the same area instead of being strictly separated, distances between home and daily errands naturally shrink. Wide, well-maintained sidewalks, safe street crossings, and consistent shade or shelter also make a measurable difference in whether people actually choose to walk.\n\nWalkability is not just a lifestyle preference — cities with higher walkability scores tend to see lower rates of traffic congestion, better public health outcomes tied to increased daily activity, and often higher property values, which is why it has become a recurring theme in local zoning and transportation policy debates.',
  },
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
      content: sample.content,
      coverImage: sample.coverImage,
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
