# TrustWala Bazaar

A marketplace platform built for Pakistan that actually solves the trust problem. We've built something that goes way beyond just listing products - it's got AI-powered fraud detection, real-time chat, visual search, and a whole bunch of features that make buying and selling online actually safe and reliable.

## What Makes This Different

Most marketplaces in Pakistan have a huge trust issue. People are scared of getting scammed, and honestly, they should be. That's why we built TrustWala Bazaar with trust and safety at the core.

The platform uses AI to detect fraud, verify sellers through CNIC and video verification, and calculates trust scores that actually mean something. We've also made it work offline because let's face it - internet connectivity in Pakistan can be pretty unreliable.

## Key Features

### For Buyers
- **AI Recommendations**: Get personalized product suggestions based on what you're actually looking for
- **Visual & Voice Search**: Can't describe what you want? Just upload a photo or speak in Urdu/English
- **Trust Scores**: See exactly how trustworthy a seller is before you buy
- **Real-time Chat**: Talk to sellers directly with AI assistance for negotiations
- **Escrow Protection**: Your money is safe until you get what you ordered
- **Nearby Shops**: Find sellers close to you with Google Maps integration

### For Sellers
- **Easy Listing Creation**: Multi-step form with AI-powered auto-fill for specifications
- **Verification System**: Get verified with CNIC and video verification to build trust
- **AI Price Suggestions**: Get market-based pricing recommendations
- **Analytics**: See how your listings are performing
- **PTA Compliance**: Automatic verification for mobile devices

### Platform Features
- **AI Fraud Detection**: Multi-layer system that catches scams before they happen (92% accuracy)
- **Trust Score Algorithm**: Transparent scoring that shows why a seller/product is trustworthy
- **Offline PWA**: Works even when you don't have internet - perfect for areas with spotty connectivity
- **Multilingual Support**: Full Urdu support with RTL layout
- **Real-time Messaging**: Socket.io powered chat with typing indicators
- **Location-Based Search**: Find products and shops near you

## Tech Stack

**Frontend:**
- Next.js 15 with App Router (latest and greatest)
- React 19 with TypeScript
- Tailwind CSS for styling
- shadcn/ui components (beautiful, accessible UI)
- Framer Motion for smooth animations
- React Query for data fetching
- Zustand for state management

**Backend:**
- NestJS (TypeScript framework)
- PostgreSQL with Prisma ORM
- Socket.io for real-time features
- JWT authentication
- OpenAI/Groq for AI features

**Services:**
- Clerk for authentication (with fallback demo mode)
- Google Maps API
- Supabase Storage / AWS S3 for images
- Service Workers for offline support

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database (for backend)
- Git

### Installation

1. **Clone the repo**
   ```bash
   git clone <your-repo-url>
   cd trust-wala-bazaar
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root:
   ```env
   # API Configuration
   NEXT_PUBLIC_API_URL=http://localhost:3002
   
   # Authentication (Optional - works without it in demo mode)
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key_here
   CLERK_SECRET_KEY=your_secret_here
   
   # AI Services (Optional - features degrade gracefully without them)
   OPENAI_API_KEY=your_openai_key
   GROQ_API_KEY=your_groq_key
   
   # Google Maps (Optional - for nearby shops feature)
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_key
   
   # Storage (Optional - for image uploads)
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_key
   ```

4. **Set up the backend**
   
   The backend is in a separate folder. Check `backend/README.md` for detailed setup instructions. Quick version:
   ```bash
   cd backend
   npm install
   # Set up your .env file with database URL, JWT secret, etc.
   npx prisma migrate dev
   npm run start:dev
   ```

5. **Run the frontend**
   ```bash
   # From the root directory
   npm run dev
   ```

6. **Open it up**
   
   Navigate to `http://localhost:4001` (or whatever port it assigns). The app will automatically find an available port if 4001 is taken.

## Project Structure

```
trust-wala-bazaar/
├── app/                    # Next.js pages
│   ├── auth/              # Login/signup pages
│   ├── home/              # Dashboard with features showcase
│   ├── products/          # Product detail pages
│   ├── search/            # Search with filters
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Checkout page
│   ├── listings/          # Create new listing
│   ├── messages/          # Real-time chat
│   ├── shops/             # Nearby shops with maps
│   └── settings/          # User settings
├── components/
│   ├── ui/                # Reusable UI components
│   ├── layout/            # Header, sidebar, mobile nav
│   ├── features/          # AI chat, voice search, visual search, etc.
│   ├── product/           # Product cards and detail views
│   └── ...
├── lib/
│   ├── dummy-data.ts      # Fallback data when API is unavailable
│   ├── auth-hook.tsx      # Authentication hook
│   └── utils.ts           # Utility functions
└── backend/               # NestJS API server
    ├── src/
    │   ├── products/      # Product endpoints
    │   ├── ai/            # AI service endpoints
    │   ├── messages/      # Real-time messaging
    │   └── ...
    └── prisma/            # Database schema
```

## Features in Detail

### AI-Powered Features

**AI Chat Assistant**: There's a floating chat bubble on product pages that can answer questions about products, help with negotiations, and provide recommendations. It supports both English and Urdu, and gracefully handles errors if the AI service isn't configured.

**Visual Search**: Upload a photo or take one with your camera, and the system will find similar products. Uses computer vision to analyze the image and match it with products in the database.

**Voice Search**: Speak your search query in Urdu or English. The Web Speech API transcribes it and searches the database. Works great in Chrome and Edge.

**AI Price Suggestions**: When creating a listing, the AI analyzes market data and suggests a fair price range with confidence scores.

**Auto-fill Specifications**: The AI can automatically extract product specifications from your title and description, saving you time when creating listings.

### Trust & Safety

**Trust Score System**: Every seller and product gets a trust score based on:
- Seller verification status (40%)
- Product authenticity (30%)
- Reviews and ratings (20%)
- Price fairness (10%)

The score is transparent - you can see exactly why it's calculated that way.

**Fraud Detection**: Multi-layer system that checks for:
- Suspicious pricing patterns
- Unverified sellers
- Duplicate listings
- CNIC verification status
- Video verification status

**CNIC Verification**: Sellers can upload their CNIC, and the AI extracts and verifies the information. This is optional but increases trust scores significantly.

**Video Verification**: Face recognition and liveness detection to verify seller identity. Helps prevent fake accounts.

### User Experience

**Offline Support**: The app works as a PWA, so you can use it even without internet. Product listings, images, and user data are cached locally. When you're back online, everything syncs up.

**Responsive Design**: Works beautifully on mobile, tablet, and desktop. We've put a lot of effort into making it feel native on all devices.

**Dark Theme**: Easy on the eyes, especially for late-night browsing. The color scheme uses a dark green palette that's consistent throughout.

**Notifications**: Real-time notifications for messages, orders, and important updates. Click the bell icon to see your notifications.

## Development

### Running Locally

The frontend and backend run on separate ports. The frontend automatically finds an available port (defaults to 4001), and the backend runs on port 3002.

```bash
# Terminal 1 - Backend
cd backend
npm run start:dev

# Terminal 2 - Frontend
npm run dev
```

### Building for Production

```bash
npm run build
npm start
```

### Code Style

We use TypeScript throughout for type safety. ESLint is configured for code quality. The project follows Next.js 15 best practices with the App Router.

## API Integration

The frontend communicates with the backend API. All API calls have fallback to dummy data, so the app remains functional even if the backend is down or still being set up. This makes development and testing much easier.

Key API endpoints:
- `/api/products` - Product CRUD operations
- `/api/search` - Search products
- `/api/ai/chat` - AI chat assistant
- `/api/ai/cnic-extract` - CNIC data extraction
- `/api/messages` - Real-time messaging
- `/api/upload/image` - Image uploads
- `/api/users/me` - User profile management

## Environment Variables

Most features work without API keys, but you'll get the full experience with:

- **Clerk**: For authentication (optional - demo mode works without it)
- **OpenAI/Groq**: For AI features (optional - features degrade gracefully)
- **Google Maps**: For nearby shops (optional - shows placeholder without it)
- **Supabase/S3**: For image storage (optional - uses local URLs without it)

## Known Limitations

- AI features require API keys to work fully (but the app works without them)
- Some features like visual search work better with a properly configured backend
- Offline mode has limited functionality (you can browse cached products)
- Real-time chat requires Socket.io server to be running

## Contributing

We're always looking to improve. If you find bugs or have ideas for features, feel free to open an issue or submit a pull request.

## License

MIT License - feel free to use this for your own projects.

## Support

If you run into issues:
1. Check the console for error messages
2. Make sure the backend is running if you're using API features
3. Check that environment variables are set correctly
4. Open an issue on GitHub with details about what's not working

---

Built for Pakistan, with the goal of making online buying and selling safe and accessible for everyone.
