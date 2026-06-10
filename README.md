# Newsera

A premium news aggregator that pulls headlines from trusted sources in real time and
presents them in a fast, editorial reading experience — with accounts, bookmarks, a
personal dashboard, and Google / email sign-in.

**Live:** https://newsera-vert.vercel.app

---

## Features

- **Curated home feed** — a featured hero, a trending carousel, business briefs, an
  analysis spotlight, and a paginated "Latest Updates" feed.
- **Instant filtering & search** — category tabs and full-text search powered by
  TanStack Query; previous results stay on screen while the next load resolves (no
  skeleton flash), and visited tabs are served from cache.
- **Category sections** — `/category/[slug]` for World, Business, Technology, Science,
  Health, and Sports.
- **Rich article pages** — editorial typography, AI-style key takeaways, source
  attribution, and related / recommended reading. Thin source text is enriched into a
  complete, clearly-framed brief that always links back to the original publisher.
- **Accounts** — email/password registration with email verification, Google OAuth,
  plus forgot / reset password flows.
- **Personal dashboard** — saved articles, reading history, and personalized
  suggestions.
- **Optimistic everywhere** — bookmarking, saving, filtering, and form submissions all
  update the UI instantly, with rollback on failure. Bookmark state is persisted
  client-side for a flash-free first paint.
- **Light / dark theme**, responsive layout, and route-level loading skeletons for
  seamless navigation.

## Tech stack

| Area | Choice |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org) (App Router, React 19) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | PostgreSQL via [Prisma 7](https://www.prisma.io) (`@prisma/adapter-pg`) |
| Auth | [Auth.js / NextAuth v5](https://authjs.dev) — Google + Credentials |
| Client state | [Zustand](https://zustand-demo.pmnd.rs) (bookmarks, saved list) |
| Data fetching | [TanStack Query](https://tanstack.com/query) (feed) |
| Email | [Brevo](https://www.brevo.com) (transactional) |
| News source | [Currents API](https://currentsapi.services) |
| Validation | Zod · Passwords hashed with bcrypt |
| Hosting | Vercel |

## Project structure

```
app/                     App Router routes
  _components/           Shared UI (header, feed, bookmark button, forms…)
  api/                   Route handlers (articles feed, auth, sync cron)
  article/[slug]/        Article reader
  category/[slug]/       Category sections
  dashboard/             Authenticated dashboard
  login · register · forgot-password · reset-password · verify-email
lib/
  auth/                  Auth.js config, DAL (requireUser), verification
  data/                  Server data access (articles, dashboard)
  api/                   Currents API client
  content/               Category classifier + article enrichment
  actions/               Server actions (auth, bookmarks, preferences)
  email/                 Brevo client + templates
  db.ts · env.ts · utils.ts · categories.ts
store/                   Zustand stores (bookmark, saved)
prisma/                  schema.prisma + seed
scripts/                 sync.ts (ingest) · reclassify.ts
docs/                    AUTH_SETUP.md (Google OAuth guide)
```

## Getting started

### Prerequisites

- Node.js 20+
- A PostgreSQL database (a [Supabase](https://supabase.com) project works out of the box)

### 1. Install

```bash
npm install
```

`postinstall` runs `prisma generate` automatically.

### 2. Configure environment

Copy the template and fill in your values:

```bash
cp .env.example .env
```

| Variable | Required | Description |
| --- | --- | --- |
| `DATABASE_URL` | ✅ | Pooled Postgres connection string (used by the app) |
| `DIRECT_URL` | ✅ | Direct (non-pooled) connection, used by Prisma migrations |
| `AUTH_SECRET` | ✅ | Auth.js session secret — generate with `npx auth secret` |
| `AUTH_URL` | — | Only set if the OAuth callback origin is detected wrong (proxy/custom domain) |
| `AUTH_GOOGLE_ID` | — | Google OAuth client ID (enables Google sign-in when set with the secret) |
| `AUTH_GOOGLE_SECRET` | — | Google OAuth client secret |
| `CURRENTS_API_KEY` | — | Enables news ingestion via `npm run sync` |
| `CRON_SECRET` | — | Bearer token required by the `/api/sync` route |
| `BREVO_API_KEY` | — | Enables verification / password-reset emails |
| `EMAIL_FROM` · `EMAIL_FROM_NAME` | — | Sender identity (defaults provided) |
| `NEXT_PUBLIC_SITE_URL` | — | Canonical site origin for metadata/links (default `http://localhost:3000`) |

Optional integrations degrade gracefully: Google sign-in only appears when both Google
vars are set, and email verification is skipped when `BREVO_API_KEY` is absent.

> **Google sign-in:** see [`docs/AUTH_SETUP.md`](docs/AUTH_SETUP.md) for the exact
> redirect URIs to register (the dev server is pinned to port **3000** so the callback
> `http://localhost:3000/api/auth/callback/google` stays stable).

### 3. Set up the database

```bash
npm run db:push     # apply the Prisma schema to your database
npm run seed        # optional: seed starter data
```

### 4. (Optional) Ingest live news

```bash
npm run sync        # pull fresh articles from the Currents API
```

### 5. Run

```bash
npm run dev
```

Open **http://localhost:3000**. (The port is fixed at 3000 — if it's already in use,
the dev server will exit rather than drift to another port, to keep the OAuth callback
valid.)

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server on port 3000 |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | ESLint |
| `npm run db:push` | Push the Prisma schema to the database |
| `npm run db:migrate` | Create/apply a dev migration |
| `npm run db:studio` | Open Prisma Studio |
| `npm run seed` | Seed the database |
| `npm run sync` | Ingest articles from the Currents API |
| `npm run reclassify` | Re-run category classification on stored articles |

## Data model

Prisma models (`prisma/schema.prisma`): `User`, `Account`, `Session`,
`VerificationToken`, `Category`, `Article`, `Bookmark`, `ReadingHistory`,
`UserPreferences`, and `FeaturedArticle` (drives the home hero / analysis slots).

## News ingestion

`scripts/sync.ts` fetches the latest stories per category from the Currents API,
de-duplicates headlines, classifies each into a canonical category, and upserts them.
Run it manually with `npm run sync`, or trigger the `/api/sync` route handler (guarded
by `CRON_SECRET`) on a schedule.

## Deployment

Deployed on **Vercel** with automatic production deploys from the `main` branch. Set the
same environment variables in the Vercel project, and register the production OAuth
redirect URI (`https://<your-domain>/api/auth/callback/google`). The database index and
schema are applied via `prisma db push` / migrations against your production database.
