# Vercel Deployment Guide

Follow these steps to deploy your Aquascaping application on Vercel:

## 1. Push Your Code to GitHub

Ensure all your changes are committed and pushed to your GitHub repository.

```bash
git add .
git commit -m "Fix vercel.json for deployment"
git push
```

## 2. Set Up Vercel Project

1. Go to [Vercel](https://vercel.com) and sign up or log in
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure project settings:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run vercel-build`
   - Output Directory: .next
   - Install Command: `npm install`

## 3. Configure Environment Variables

Add the following environment variables in the Vercel project settings:

### Required Variables

- `NEXTAUTH_SECRET`: `S07GKTWqW3GgeIJaYE1jNFIfivwRrIOjvdZVx3PR0Uw=` (or generate your own)
- `NEXTAUTH_URL`: `https://your-project-name.vercel.app` (replace with your actual deployment URL)
- `DATABASE_URL`: `postgresql://postgres:eDTKfLyG8K5yPJ_@db.hbjsscknqlygbndovxdb.supabase.co:5432/postgres`

### Email Configuration (for OTP)

- `EMAIL_SERVER`: Your SMTP server settings (e.g., `smtp://username:password@smtp.example.com:587`)
- `EMAIL_FROM`: The email address to send from (e.g., `noreply@yourdomain.com`)

### Google OAuth (if using)

- `GOOGLE_CLIENT_ID`: Your Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Your Google OAuth client secret

### Stripe (if applicable)

- `STRIPE_SECRET_KEY`: Your Stripe secret key
- `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook secret
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key

## 4. Deploy Your Project

1. Click "Deploy"
2. Wait for the build to complete

## 5. First-Time Database Setup

After the first deployment, you may need to set up your database tables. 

### Option 1: Automatic Setup (Preferred)

The `vercel-build` script should handle this automatically with Prisma migrations.

### Option 2: Manual Setup (If needed)

If you encounter database issues, you can run the migration manually:

1. Go to Vercel dashboard → Settings → General → Deploy Hook
2. Create a new deploy hook, name it "Migrate Database"
3. Use this hook to trigger a new deployment after changing environment variables

## 6. Verify Deployment

1. Visit your deployed site
2. Test the authentication flow
3. Check that all features work correctly
4. Verify database connections

## Troubleshooting

### Database Connection Issues

If you encounter database connection issues:

1. Check your `DATABASE_URL` environment variable
2. Ensure your database allows connections from Vercel's IP addresses
3. Check Vercel logs for specific error messages

### Authentication Problems

If authentication doesn't work:

1. Verify `NEXTAUTH_SECRET` and `NEXTAUTH_URL` are set correctly
2. Check Google OAuth configuration if using Google login
3. Test OTP email functionality

### OTP Table Missing

If the OTP feature doesn't work:

1. SSH into your Supabase database or use their interface
2. Run the following SQL:

```sql
CREATE TABLE IF NOT EXISTS "OtpCode" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "email" TEXT NOT NULL,
  "otp" TEXT NOT NULL,
  "expires" TIMESTAMP NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "OtpCode_email_idx" ON "OtpCode"("email");
```
