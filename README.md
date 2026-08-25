# WriteWave

WriteWave is a community news and article publishing platform — anyone can register, write articles, read, like, comment, and follow other authors.

## Structure

This is a monorepo containing two independent projects:

```
writewave-blog-app/
  mobile/    React Native (Expo) app — the user-facing mobile client
  backend/   Express + MongoDB API server
```

## Tech Stack

- **Mobile:** React Native, Expo (SDK 54, managed workflow), Expo Router, TypeScript, NativeWind (Tailwind), Zustand, TanStack Query, Axios
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT auth, Zod validation
- **Media:** Cloudinary (unsigned client-side upload)

## Features

- Email/password authentication (JWT)
- Article feed with category and tag filtering, search
- Article create/edit with cover image upload
- Like, comment, and author follow
- Author profile pages
- Offline detection, dark mode

## Getting Started

### Backend

```bash
cd backend
npm install
```

Create a `.env` file (see `.env.example`) with:

- `PORT` — defaults to `4000`
- `MONGODB_URI` — a MongoDB connection string (Atlas or local)
- `JWT_SECRET` — a random secret string for signing auth tokens
- `CORS_ORIGIN` — `*` is fine for mobile-only clients

```bash
npm run dev
```

### Mobile

```bash
cd mobile
npm install
```

Create a `.env` file (see `.env.example`) with:

- `EXPO_PUBLIC_API_URL` — the backend's URL (e.g. `http://<your-LAN-IP>:4000/api` when testing on a physical device over Wi-Fi)
- `EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME` — from your Cloudinary dashboard
- `EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET` — an unsigned upload preset from Cloudinary

```bash
npx expo start
```

Scan the QR code with the **Expo Go** app on your phone (same Wi-Fi network as your computer).
