# Required Environment Variables for Vercel Deployment

Make sure to add these environment variables in Vercel dashboard:

## Authentication
- NEXTAUTH_SECRET (generate with: `openssl rand -base64 32`)
- NEXTAUTH_URL (will be set automatically by Vercel)

## Google OAuth (if using)
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET

## Email (for OTP)
- EMAIL_SERVER (SMTP settings)
- EMAIL_FROM

## Database
- DATABASE_URL (already set in .env.production)

## Stripe (if applicable)
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
