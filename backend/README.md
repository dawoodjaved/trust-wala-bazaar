# TrustWala Bazaar Backend API

NestJS backend for TrustWala Bazaar marketplace.

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

3. **Set up database**
   ```bash
   # Generate Prisma client
   npm run prisma:generate

   # Run migrations
   npm run prisma:migrate
   ```

4. **Start development server**
   ```bash
   npm run start:dev
   ```

## API Documentation

Once the server is running, visit:
- Swagger UI: http://localhost:3001/api/docs

## Endpoints

### Authentication
- `POST /api/auth/verify` - Verify Clerk token
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - List products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Search
- `GET /api/search?q=query` - Text search
- `POST /api/search/visual` - Visual search
- `POST /api/search/voice` - Voice search

### Messages
- `POST /api/messages` - Send message
- `GET /api/messages/conversation/:userId` - Get conversation
- WebSocket: Real-time messaging

### Categories
- `GET /api/categories` - List categories
- `GET /api/categories/:id` - Get category

### Reviews
- `GET /api/reviews/product/:productId` - Get product reviews
- `POST /api/reviews` - Create review

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/my-orders` - Get my orders

### Upload
- `POST /api/upload/image` - Upload image
- `POST /api/upload/video` - Upload video

## WebSocket

Connect to `ws://localhost:3001` for real-time messaging.

Events:
- `join-room` - Join conversation
- `send-message` - Send message
- `typing` - Typing indicator
- `new-message` - Receive new message
- `user-typing` - User typing event

## Database

Uses PostgreSQL with Prisma ORM.

Run migrations:
```bash
npm run prisma:migrate
```

Open Prisma Studio:
```bash
npm run prisma:studio
```

