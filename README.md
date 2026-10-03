# TrustWala Bazaar

Pakistan-focused marketplace with trust and AI built in.

## Features

- AI chat assistant, fraud checks, and price suggestions
- Visual search and voice search (Urdu / English)
- Seller verification (CNIC + video)
- Trust scores, nearby shops map, and buyer–seller messaging
- Cart, checkout, listings, and offline-friendly PWA shell
- Clerk auth with a demo login fallback

## Technologies

- **Frontend / API:** Next.js 15, React, TypeScript, Tailwind, shadcn/ui
- **Database:** PostgreSQL + Prisma
- **AI:** OpenAI / Gemini
- **Auth:** Clerk (optional)
- **Maps:** Leaflet + OpenStreetMap
- **Deploy:** Vercel + Neon

## How to start

```bash
git clone https://github.com/dawoodjaved/trust-wala-bazaar.git
cd trust-wala-bazaar
npm install
cp .env.example .env.local
# Add DATABASE_URL, JWT_SECRET, and an AI key (GEMINI_API_KEY or OPENAI_API_KEY)

npx prisma migrate deploy
npm run prisma:seed   # optional demo data
npm run dev           # http://localhost:3010
```

Leave `NEXT_PUBLIC_API_URL` empty so the app uses same-origin `/api` routes.

## License

MIT
