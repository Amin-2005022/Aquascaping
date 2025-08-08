# AquaScaping - 3D Aquarium Designer & E-commerce Platform

A full-stack e-commerce web application where aquascaping enthusiasts can design custom aquariums in an interactive 3D environment and purchase the exact physical setup.

## 🌟 Features

### Core Features
- **3D Aquarium Designer**: Real-time 3D configurator using Three.js and React Three Fiber
- **Interactive Product Catalog**: Browse and add rocks, plants, fish, and equipment
- **Live Pricing**: Real-time price updates as you design
- **Tank Customization**: Adjust dimensions, glass type, and cabinet colors
- **Save & Share Designs**: Save your creations and share with the community
- **Complete E-commerce**: Full checkout flow with Stripe integration
- **Admin Dashboard**: Manage products, orders, and inventory
- **User Accounts**: Authentication with design history and order tracking

### Technical Features
- **Next.js 14** with App Router and Server Components
- **TypeScript** for full type safety
- **Three.js & React Three Fiber** for 3D rendering
- **PostgreSQL** with Prisma ORM
- **NextAuth.js** for authentication
- **Stripe** for payments
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Zustand** for state management
- **React Query** for data fetching

## 🏗️ Architecture

### Frontend Stack
- **Next.js 14** - React framework with App Router
- **React 18** - UI library with concurrent features
- **TypeScript** - Type-safe JavaScript
- **Three.js** - 3D graphics library
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for React Three Fiber
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Zustand** - Lightweight state management
- **React Query** - Server state management

### Backend Stack
- **Next.js API Routes** - Serverless API endpoints
- **PostgreSQL** - Relational database
- **Prisma ORM** - Type-safe database client
- **NextAuth.js** - Authentication library
- **Stripe** - Payment processing
- **bcryptjs** - Password hashing

### Database Schema
```prisma
// Core entities
- User (authentication & profiles)
- Product (catalog items)
- Category (product organization)
- Design (3D configurations)
- Order (purchase transactions)
- DesignItem (products in designs)
- OrderItem (products in orders)
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database
- Stripe account (for payments)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd aquascaping
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env.local` file with:
```env
# Database
DATABASE_URL="postgresql://myuser:amin1234@localhost:5432/aquascaping"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_key"
STRIPE_SECRET_KEY="sk_test_your_stripe_secret"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"

# File Storage (optional)
AWS_ACCESS_KEY_ID="your_access_key"
AWS_SECRET_ACCESS_KEY="your_secret_key"
AWS_S3_BUCKET="aquascaping-assets"
```

4. **Set up the database**
```bash
# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# Seed with sample data
npm run db:seed
```

5. **Start the development server**
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📱 Usage

### For Customers
1. **Browse the homepage** to learn about the platform
2. **Sign up/Login** to access the designer
3. **Open the 3D Configurator** to start designing
4. **Customize your tank** - adjust size, glass type, cabinet color
5. **Add products** - drag and drop rocks, plants, fish into your design
6. **See live pricing** updates as you design
7. **Save your design** to your profile
8. **Checkout** with Stripe for secure payments
9. **Track your order** in the dashboard

### For Administrators
1. **Access admin dashboard** at `/admin`
2. **Manage products** - add, edit, update inventory
3. **Process orders** - view, update status, fulfill orders
4. **Monitor analytics** - track sales, popular products
5. **Manage users** - view customer accounts

## 🎨 3D Configurator Features

### Tank Configuration
- **Adjustable dimensions** (width: 30-150cm, height: 25-80cm, depth: 20-60cm)
- **Glass types**: Standard, Low-iron (+30%), Tempered (+50%)
- **Cabinet colors**: Multiple color options
- **Real-time price calculation**

### Product Placement
- **Drag and drop** interface for adding products
- **3D positioning** with snap-to-grid
- **Rotation and scaling** controls
- **Product categories**: Hardscape, Plants, Livestock, Equipment
- **Visual feedback** for selected items

### Rendering Features
- **Realistic materials** with transparency for glass/water
- **Dynamic lighting** with ambient and directional lights
- **Orbit controls** for camera movement
- **Grid helpers** for precise placement
- **Responsive canvas** that adapts to screen size

## 🛒 E-commerce Features

### Product Management
- **Rich product catalog** with images, descriptions, specifications
- **Category organization** for easy browsing
- **Inventory tracking** with low-stock alerts
- **3D model integration** for realistic previews

### Shopping & Checkout
- **Real-time cart updates** with live pricing
- **Secure payments** via Stripe
- **Order management** with status tracking
- **Email notifications** for order updates
- **Shipping calculation** integration ready

### User Experience
- **Responsive design** works on all devices
- **Fast loading** with optimized images and code splitting
- **SEO optimized** pages for better discoverability
- **Accessibility** features following WCAG guidelines

## 🔧 API Endpoints

### Products
- `GET /api/products` - List all products
- `GET /api/products/[id]` - Get product details
- `POST /api/products` - Create product (admin)
- `PUT /api/products/[id]` - Update product (admin)
- `DELETE /api/products/[id]` - Delete product (admin)

### Designs
- `GET /api/designs` - User's designs
- `POST /api/designs` - Save new design
- `PUT /api/designs/[id]` - Update design
- `DELETE /api/designs/[id]` - Delete design

### Orders
- `GET /api/orders` - User's orders
- `POST /api/orders` - Create new order
- `PUT /api/orders/[id]` - Update order status (admin)

### Payments
- `POST /api/payments/create-payment-intent` - Create Stripe payment

## 🏃‍♂️ Development

### Project Structure
```
aquascaping/
├── app/                    # Next.js 14 app directory
│   ├── (auth)/            # Authentication pages
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   ├── configurator/      # 3D designer page
│   ├── dashboard/         # User dashboard
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── configurator/     # 3D configurator components
├── lib/                  # Utility libraries
│   ├── stores/           # Zustand state stores
│   ├── prisma.ts         # Database client
│   └── utils.ts          # Helper functions
├── prisma/               # Database schema & migrations
├── public/               # Static assets
└── types/                # TypeScript type definitions
```

### Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Run database migrations
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed database with sample data
```

### Key Components

#### 3D Configurator (`components/configurator/`)
- `ThreeDConfigurator.tsx` - Main 3D canvas component
- `AquariumTank.tsx` - Tank geometry and materials
- `ProductLibrary.tsx` - Product selection interface
- `ConfiguratorControls.tsx` - Camera and scene controls

#### State Management (`lib/stores/`)
- `configurator.ts` - 3D scene state with Zustand
- Manages tank configuration, product placement, pricing

#### Database (`prisma/`)
- `schema.prisma` - Database schema definition
- `seed.ts` - Sample data for development

## 🔒 Security Features

- **Authentication** with NextAuth.js and JWT tokens
- **Authorization** middleware for protected routes
- **Password hashing** with bcryptjs
- **SQL injection protection** with Prisma ORM
- **CORS protection** and security headers
- **Environment variable** management for sensitive data

## 🚢 Deployment

### Environment Setup
1. Set up PostgreSQL database (local or cloud)
2. Configure Stripe account and webhooks
3. Set up file storage (AWS S3 or similar)
4. Update environment variables for production

### Build & Deploy
```bash
npm run build
npm run start
```

The application is ready for deployment on:
- **Vercel** (recommended for Next.js)
- **Railway** or **Heroku** with PostgreSQL
- **Docker** containers
- **VPS** with PM2 process manager

## 🎯 Future Enhancements

### Planned Features
- **AR Preview** - View tanks in your room using WebXR
- **AI Assistant** - Smart recommendations for compatible species
- **Community Gallery** - Public design sharing with likes/comments
- **Subscription Plans** - Monthly maintenance kit deliveries
- **Mobile App** - React Native version for iOS/Android
- **Advanced 3D Models** - More detailed product representations
- **Video Tutorials** - Integrated setup and care guides

### Technical Improvements
- **Performance optimization** with React 18 concurrent features
- **PWA capabilities** for offline browsing
- **Real-time collaboration** on designs
- **Advanced analytics** dashboard
- **Multi-language support** with i18n
- **Advanced search** with filters and sorting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Three.js** community for excellent 3D library
- **React Three Fiber** for React integration
- **Prisma** for the amazing ORM
- **Next.js** team for the fantastic framework
- **Tailwind CSS** for utility-first styling
- Aquascaping community for inspiration

---

**AquaScaping** - Bringing your underwater visions to life! 🐠🌱