@echo off
echo 🌊 Setting up AquaScaping project...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

REM Check if .env.local exists
if not exist .env.local (
    echo 📋 Creating .env.local file...
    (
        echo # Database
        echo DATABASE_URL="postgresql://myuser:amin1234@localhost:5432/aquascaping"
        echo.
        echo # NextAuth
        echo NEXTAUTH_URL="http://localhost:3000"
        echo NEXTAUTH_SECRET="your-secret-key-here-change-in-production"
        echo.
        echo # Stripe ^(Get these from https://dashboard.stripe.com/apikeys^)
        echo NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key"
        echo STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
        echo STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"
        echo.
        echo # File Upload ^(AWS S3 or compatible^)
        echo AWS_ACCESS_KEY_ID="your_access_key"
        echo AWS_SECRET_ACCESS_KEY="your_secret_key"
        echo AWS_REGION="us-east-1"
        echo AWS_S3_BUCKET="aquascaping-assets"
        echo.
        echo # Shipping API ^(optional^)
        echo SHIPPO_API_TOKEN="your_shippo_token"
    ) > .env.local
    echo ✅ Created .env.local - Please update with your actual credentials
) else (
    echo ✅ .env.local already exists
)

REM Generate Prisma client
echo 🗄️  Generating Prisma client...
call npx prisma generate

REM Push database schema
echo 🗄️  Setting up database schema...
call npx prisma db push

REM Seed database
echo 🌱 Seeding database with sample data...
call npm run db:seed

echo.
echo 🎉 Setup complete!
echo.
echo 📝 Next steps:
echo    1. Update .env.local with your actual database and API credentials
echo    2. Set up PostgreSQL database if not already done
echo    3. Create a Stripe account and add your API keys
echo    4. Run 'npm run dev' to start the development server
echo.
echo 🚀 Then visit http://localhost:3000 to see your application!
echo.
echo 👤 Demo accounts:
echo    Admin: admin@aquascaping.com
echo    User:  demo@aquascaping.com
echo    ^(No password required for demo^)
echo.
pause
