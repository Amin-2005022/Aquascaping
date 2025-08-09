# 🚀 Quick Fix Guide for Vercel API 404 Issues

This guide provides the fastest steps to resolve the current 404 errors on API routes in your Vercel deployment.

## 1. Verify Vercel Environment Variables

First, check that all required environment variables are properly set in Vercel:

1. Go to your Vercel dashboard
2. Select your Aquascaping project
3. Go to "Settings" > "Environment Variables"
4. Verify that `DATABASE_URL` is set correctly with the PostgreSQL connection string
5. Ensure all other required variables from `.env.production` are present

## 2. Check Database Connection String Format

Ensure your `DATABASE_URL` has the correct format:

```
postgresql://username:password@host:port/database
```

If you're using Supabase, consider using the connection pooling URL instead:

```
postgresql://postgres.[project-ref]:[password]@[project-ref].pooler.supabase.co:6543/postgres
```

## 3. Run Database Diagnostics

Deploy the application with the new diagnostic endpoints and test them:

```bash
# Test all API endpoints
./test-api-endpoints.sh https://your-app.vercel.app
```

Pay special attention to the output from:
- `/api/diagnostic` - Works without database access
- `/api/debug-connection` - Shows database connection issues
- `/api/debug-db` - Displays available tables

## 4. Fix Common Issues

Based on diagnostic results, apply these fixes:

### Database Connection Fails

1. Update your Vercel environment variable `DATABASE_URL`
2. Ensure your database server allows connections from Vercel IPs
3. For Supabase, check if the project is active and not paused

### Tables Missing

1. Force a schema push during build by running a redeploy
2. Ensure your Vercel project is using the `vercel-build` script:
   ```
   prisma generate && prisma db push && next build
   ```

### API Routes Not Found

1. Check Vercel Function logs in deployment details
2. Verify all route files are properly formatted as `route.ts`
3. Try clearing Vercel's cache and redeploying

## 5. Redeploying with Forced Setup

To perform a clean deployment with forced database setup:

1. Go to Vercel dashboard
2. Select your project
3. Go to "Settings" > "General"
4. Scroll down to "Build & Development Settings"
5. Ensure "Framework Preset" is set to "Next.js"
6. Set "Build Command" to:
   ```
   npm run prepare-deploy && npm run vercel-build
   ```
7. Click "Save"
8. Go to "Deployments" tab
9. Click "Redeploy" on your latest deployment

## 6. Check Function Logs

After redeployment, check the function logs:

1. Go to your latest deployment
2. Click on "Functions"
3. Find any API routes with issues
4. Check the logs for specific error messages

## 7. Test Each Endpoint Individually

Test each API endpoint individually to isolate issues:

```bash
curl -v https://your-app.vercel.app/api/diagnostic
curl -v https://your-app.vercel.app/api/debug-connection
curl -v https://your-app.vercel.app/api/debug-db
curl -v https://your-app.vercel.app/api/designs
```

The `-v` flag will show detailed request and response information.

## 8. Verify Database Schema

If database connection works but API operations fail, verify the schema:

```bash
# Connect to your database using a tool like psql or a database client
# Then list all tables
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

# Check if Design table exists with correct columns
SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'Design';
```

## Need More Help?

Refer to the detailed documentation:
- [VERCEL_API_DEBUGGING.md](./VERCEL_API_DEBUGGING.md) - Comprehensive debugging guide
- [VERCEL_DATABASE_TROUBLESHOOTING.md](./VERCEL_DATABASE_TROUBLESHOOTING.md) - Database specific issues
