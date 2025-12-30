# Bataa's Honey - Premium Mongolian Honey E-Commerce Platform

A full-stack Next.js application with MongoDB for managing a honey e-commerce business with AI-powered features and Mongolian payment integration.

## Features

### User Features
- 🍯 Browse and purchase premium Mongolian honey products
- 🤖 AI-powered shopping assistant (chat & image analysis)
- 💳 Mongolian payment methods (QPay, Khan Bank)
- 📱 Fully responsive design
- 🔐 Secure authentication system
- 🛒 Shopping cart with checkout
- 📦 Order tracking

### Admin Features
- 📊 Dashboard with analytics
- 📦 Product management (CRUD)
- 📝 Content management (blog, recipes, education)
- 💰 Free and premium content tiers
- 🛒 Order management
- 👥 User management

### AI Features
- 💬 Intelligent chatbot for product recommendations
- 📷 Honey quality analysis from images
- 🎯 Personalized product suggestions
- 🌐 Bilingual support (Mongolian/English)

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: MongoDB
- **Authentication**: JWT with bcrypt
- **AI**: Vercel AI SDK
- **Styling**: Tailwind CSS + shadcn/ui
- **Payment**: QPay, Khan Bank API integration

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB database (local or MongoDB Atlas)
- OpenAI API key (for AI features)

### Installation

1. **Download the project** from v0 using the "Download ZIP" option in the top-right menu, or use the shadcn CLI.

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the root directory:
   ```env
   # MongoDB
   MONGODB_URI=mongodb://localhost:27017/bataas_honey
   
   # Authentication
   JWT_SECRET=your-super-secret-jwt-key-change-this
   
   # AI (Optional - for AI features)
   OPENAI_API_KEY=your-openai-api-key
   
   # Payment (Optional - for payment features)
   QPAY_USERNAME=your-qpay-username
   QPAY_PASSWORD=your-qpay-password
   QPAY_INVOICE_CODE=your-invoice-code
   QPAY_API_URL=https://merchant.qpay.mn/v2
   
   KHANBANK_MERCHANT_ID=your-merchant-id
   KHANBANK_SECRET=your-secret
   
   # Base URL
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open** [http://localhost:3000](http://localhost:3000)

### Setting Up MongoDB

#### Option 1: Local MongoDB
1. Install MongoDB Community Server
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/bataas_honey`

#### Option 2: MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Add it to `.env.local`

### Creating an Admin User

Run this in MongoDB shell or Compass:
```javascript
db.users.insertOne({
  email: "admin@bataashoney.mn",
  password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.EQDJxFJXgPpPeG", // password: admin123
  name: "Admin",
  role: "admin",
  subscriptionStatus: "premium",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

Default admin credentials:
- Email: admin@bataashoney.mn
- Password: admin123

## Project Structure

```
├── app/
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── products/      # Product CRUD
│   │   ├── content/       # Content management
│   │   ├── orders/        # Order management
│   │   ├── payment/       # Payment integration
│   │   └── ai/            # AI features
│   ├── admin/             # Admin dashboard
│   ├── products/          # Products page
│   ├── cart/              # Shopping cart
│   ├── ai-assistant/      # AI assistant page
│   ├── login/             # Login page
│   └── register/          # Registration page
├── components/            # React components
├── contexts/              # React contexts
├── lib/                   # Utilities and models
│   ├── models/            # MongoDB models
│   ├── mongodb.ts         # Database connection
│   └── auth.ts            # Authentication utilities
└── public/                # Static assets
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - List products
- `POST /api/products` - Create product (admin)
- `GET /api/products/[id]` - Get product
- `PUT /api/products/[id]` - Update product (admin)
- `DELETE /api/products/[id]` - Delete product (admin)

### Content
- `GET /api/content` - List content
- `POST /api/content` - Create content (admin)

### Orders
- `GET /api/orders` - List orders
- `POST /api/orders` - Create order

### Payment
- `POST /api/payment/qpay` - Create QPay invoice
- `POST /api/payment/khanbank` - Create Khan Bank payment

### AI
- `POST /api/ai/chat` - Chat with AI assistant
- `POST /api/ai/recommend` - Get AI recommendations
- `POST /api/ai/analyze-image` - Analyze honey image

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

### Other Platforms
The app can be deployed to any platform supporting Next.js (Railway, Render, AWS, etc.)

## License

MIT License - Feel free to use for your bachelor's degree project!

## Support

For issues or questions, please open an issue on GitHub.
