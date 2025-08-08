#!/bin/bash

# AquaScaping Project Setup Script
echo "🌊 Setting up AquaScaping project..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if PostgreSQL is running
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL not found. Please install PostgreSQL and make sure it's running."
    echo "   You can use Docker: docker run --name aquascaping-db -e POSTGRES_PASSWORD=amin1234 -d -p 5432:5432 postgres"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📋 Creating .env.local file..."
    cp .env.example .env.local 2>/dev/null || cat > .env.local << 'EOF'
# Database
DATABASE_URL="postgresql://myuser:amin1234@localhost:5432/aquascaping"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"

# Stripe (Get these from https://dashboard.stripe.com/apikeys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key"
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"

# File Upload (AWS S3 or compatible)
AWS_ACCESS_KEY_ID="your_access_key"
AWS_SECRET_ACCESS_KEY="your_secret_key"
AWS_REGION="us-east-1"  
AWS_S3_BUCKET="aquascaping-assets"

# Shipping API (optional)
SHIPPO_API_TOKEN="your_shippo_token"
EOF
    echo "✅ Created .env.local - Please update with your actual credentials"
else
    echo "✅ .env.local already exists"
fi

# Generate Prisma client
echo "🗄️  Generating Prisma client..."
npx prisma generate

# Push database schema
echo "🗄️  Setting up database schema..."
npx prisma db push

# Seed database
echo "🌱 Seeding database with sample data..."
npm run db:seed

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Update .env.local with your actual database and API credentials"
echo "   2. Set up PostgreSQL database if not already done"
echo "   3. Create a Stripe account and add your API keys"
echo "   4. Run 'npm run dev' to start the development server"
echo ""
echo "🚀 Then visit http://localhost:3000 to see your application!"
echo ""
echo "👤 Demo accounts:"
echo "   Admin: admin@aquascaping.com"  
echo "   User:  demo@aquascaping.com"
echo "   (No password required for demo)"
