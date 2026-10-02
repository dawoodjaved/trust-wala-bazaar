# TrustWala Bazaar

A marketplace built for Pakistan with trust at the center — AI fraud checks, seller verification, real-time chat, and search that works the way people actually shop (photo, voice, or text in Urdu or English).

Most local marketplaces leave buyers guessing who’s legitimate. TrustWala Bazaar makes that visible: CNIC and video verification, transparent trust scores, escrow-minded checkout, and offline-friendly PWA behavior for spotty connections.

## What’s in the box

### Buyers
- Personalized recommendations and an AI chat assistant on product pages
- Visual search (upload or snap a photo) and voice search (Urdu / English)
- Trust scores before you buy, plus nearby shops on Leaflet + OpenStreetMap
- Real-time messaging with sellers

### Sellers
- Multi-step listing flow with AI-assisted specs and price hints
- CNIC extraction and video / liveness verification to raise trust
- PTA-oriented checks for mobile device listings

### Platform
- Multi-layer fraud signals (pricing, verification, duplicates)
- Clerk auth with a demo-login fallback when keys aren’t set
- NestJS API + Socket.io for chat; Next.js App Router UI with `/api` routes for several AI and data flows
- Optional Supabase (or local) uploads; works without most API keys for demos

## Tech stack

| Layer | Choices |
|--------|---------|
| Frontend | Next.js 15 (App Router), React 19, TypeScript, Tailwind, shadcn/ui, Framer Motion, React Query, Zustand |
| Backend | NestJS, Prisma, PostgreSQL, Socket.io, JWT |
| Auth | Clerk (optional) + demo mode |
| AI | Groq / Gemini / OpenAI (any one is enough for most flows) |
| Maps | Leaflet + OpenStreetMap (no paid maps key) |
| Deploy | Vercel (frontend) + Nest host (e.g. Render) + Neon Postgres |

## Getting started

**Prerequisites:** Node.js 18+, npm, PostgreSQL (Neon free tier works fine).

```bash
git clone https://github.com/dawoodjaved/trust-wala-bazaar.git
cd trust-wala-bazaar
npm install
cp .env.example .env.local   # fill in what you need
```

### Backend

```bash
cd backend
npm install
cp .env.example .env         # or point at the same DATABASE_URL / JWT_SECRET as root
npx prisma migrate deploy
npx prisma db seed           # optional demo catalog
npm run start:dev            # default API port from env (often 3001)
```

### Frontend

```bash
# from repo root
npm run dev
```

Open the URL Next prints (commonly `http://localhost:3000`). Point `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_SOCKET_URL` at the Nest server.

## Environment variables

Use `.env.example` as the template. Real values belong only in `.env.local` / host dashboards — those files are gitignored.

| Variable | Notes |
|----------|--------|
| `DATABASE_URL` | Postgres connection string |
| `JWT_SECRET` | Long random string |
| `NEXT_PUBLIC_API_URL` / `NEXT_PUBLIC_SOCKET_URL` / `PUBLIC_API_URL` | Public Nest base URL |
| `FRONTEND_URL` | CORS / redirects |
| `GROQ_API_KEY` or `GEMINI_API_KEY` / `OPENAI_API_KEY` | AI; optional |
| `NEXT_PUBLIC_CLERK_*` / `CLERK_SECRET_KEY` | Auth; optional (demo login without them) |
| `SUPABASE_URL` / `SUPABASE_ANON_KEY` | Uploads on ephemeral hosts |

Nearby shops do **not** need a Google Maps key.

## Deploy (free-tier friendly)

1. **Database** — Neon: create a project, set `DATABASE_URL`, run `prisma migrate deploy` (and seed if you want).
2. **API** — Deploy the `backend/` folder on Render or another Node host (`npm install && npx prisma generate && npm run build`, start with migrate + `start:prod`). Set `FRONTEND_URL`, `PUBLIC_API_URL`, `JWT_SECRET`, and AI keys.
3. **Frontend** — Vercel, root of this repo. Set `NEXT_PUBLIC_API_URL` / `NEXT_PUBLIC_SOCKET_URL` to the API URL; add Clerk keys if you use them.
4. Prefer **Supabase** storage on free PaaS — local disk uploads won’t survive restarts.

Cold starts on free Nest hosts are normal; keep the laptop + tunnel approach only for demos.

## Project layout

```
trust-wala-bazaar/
├── app/                 # Next.js pages + Route Handlers under app/api/
├── components/          # UI, features (AI chat, CNIC, visual/voice search, …)
├── lib/                 # auth helpers, catalog, server utilities, stores
├── prisma/              # shared schema / migrations (also under backend/)
├── public/              # static assets, PWA icons (uploads ignored)
└── backend/             # NestJS API, Prisma, Socket.io
```

## Notes

- Without AI keys the UI still runs; chat and verification features degrade gracefully.
- Real-time chat needs the Nest Socket.io process.
- Don’t commit `.env`, `.env.local`, or upload binaries — only placeholders in `.env.example`.

## License

MIT

---

Built for Pakistan — safer buying and selling, without the usual leap of faith.
