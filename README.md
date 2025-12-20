# TrustWala Bazaar

Pakistan's Most Trusted AI-Enriched Marketplace - A complete buy/sell platform for mobiles, laptops, electronics, cars, tractors, and more.

## 🚀 Features

### Core Features
- **AI-Powered Recommendations**: Personalized product suggestions
- **Fraud Detection & Verification**: CNIC, video verification, AI-powered safety
- **Voice & Visual Search**: Search using voice (Urdu/English) or upload images
- **Trust Score System**: AI-calculated trust scores for sellers and products
- **Video Reviews & Comparisons**: Embedded YouTube/TikTok/Instagram videos
- **AI Aggregated Reviews**: Summarized pros/cons with text-to-speech
- **PTA Compliance Check**: Mobile device verification
- **Real-time Chat**: Live negotiation with AI assistant
- **Escrow Protection**: Secure payment handling
- **Accessibility**: Simple mode, voice navigation, Urdu support

### Technical Stack
- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **UI**: Tailwind CSS + shadcn/ui components
- **State Management**: Zustand
- **Backend**: NestJS (TypeScript) - separate API server
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Clerk
- **AI Integration**: Vercel AI SDK + Groq/OpenAI
- **Real-time**: Socket.io
- **Maps**: Google Maps API
- **Storage**: Supabase Storage / AWS S3
- **PWA**: Service Workers + IndexedDB

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd trust_wala_bazaar
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file:
   ```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth/login
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth/signup
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/home
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/home

   # Database
   DATABASE_URL=postgresql://user:password@localhost:5432/trustwala_bazaar

   # AI Services
   OPENAI_API_KEY=your_openai_key
   GROQ_API_KEY=your_groq_key

   # Storage
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key

   # Google Maps
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key

   # App URL
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Set up the database**
   ```bash
   # Run Prisma migrations (when backend is set up)
   npx prisma migrate dev
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
trust_wala_bazaar/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── home/              # Dashboard/home page
│   ├── search/            # Search page
│   ├── products/          # Product detail pages
│   ├── listings/          # Create listing pages
│   └── ...
├── components/            # React components
│   ├── ui/                # shadcn/ui components
│   ├── layout/            # Layout components (Header, Sidebar, etc.)
│   ├── features/          # Feature components (Voice search, AI chat, etc.)
│   ├── product/           # Product-related components
│   └── ...
├── lib/                   # Utilities and helpers
│   ├── store/             # Zustand stores
│   └── utils.ts           # Utility functions
├── public/                # Static assets
└── backend/               # NestJS backend (separate)
```

## 🎨 Design System

### Colors
- **Primary Green**: `#00A651` - Trust, growth
- **Accent Orange**: `#FF6B00` - Energy, deals
- **Success**: `#10B981`
- **Warning**: `#F59E0B`
- **Error**: `#EF4444`

### Typography
- **Headings**: Inter/Poppins
- **Body**: Inter/System
- **Urdu**: Noto Nastaliq Urdu

## 🔐 Authentication

This project uses Clerk for authentication. Set up your Clerk account at [clerk.com](https://clerk.com) and add your keys to `.env.local`.

## 🤖 AI Features

### AI Chat Assistant
- Context-aware product assistance
- Urdu and English support
- Voice input/output

### AI Recommendations
- Personalized product suggestions
- Based on browsing history and preferences

### AI Price Analyzer
- Market price comparisons
- Fair price suggestions
- Confidence scores

### Fraud Detection
- AI-powered risk assessment
- Pattern recognition
- Automated flagging

## 📱 PWA Support

The app is a Progressive Web App (PWA) with:
- Offline support via Service Workers
- Installable on mobile devices
- IndexedDB for offline data storage

## 🌐 Internationalization

Supports:
- English (default)
- Urdu (RTL layout)
- Regional languages (future)

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Manual Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Start production server:
   ```bash
   npm start
   ```

## 📝 Backend Setup

The backend is a separate NestJS application. See `backend/README.md` for setup instructions.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Design inspiration from Daraz.pk and modern e-commerce platforms
- shadcn/ui for beautiful, accessible components
- Clerk for authentication
- Vercel for hosting and AI SDK

## 📞 Support

For support, email support@trustwalabazaar.com or open an issue on GitHub.

---

Built with ❤️ for Pakistan 🇵🇰

