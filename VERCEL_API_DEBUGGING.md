# Debugging API Routes and Database Issues on Vercel

This guide provides a comprehensive approach to identify and resolve common issues with Next.js API routes and database connections when deploying to Vercel.

## New Diagnostic Tools

We've added several API endpoints to help diagnose issues:

1. `/api/diagnostic` - Basic API functionality without database dependencies
2. `/api/debug-connection` - Database connectivity test with detailed diagnostics
3. `/api/debug-comprehensive` - Full database, schema, and table checks
4. `/api/debug-db` - Database tables and structure information
5. `/api/debug-design` - Design table-specific checks

You can test these endpoints using the included scripts:
- Bash/Unix: `./test-api-endpoints.sh https://your-vercel-app.com`
- Windows: `test-api-endpoints.bat https://your-vercel-app.com`

## Common Issues and Solutions

### 1. API Routes Return 404 Errors

If your API routes work locally but return 404 in Vercel production:

#### Possible Causes:
- API route format issues in Next.js App Router
- Vercel function deployment problems
- Caching or routing configuration issues
- Environment-specific differences between local and Vercel

#### Solutions:
- Verify route naming and structure matches App Router conventions (`route.ts` files)
- Check Vercel deployment logs for function generation errors
- Use the `/api/diagnostic` endpoint to test basic API route functionality
- Ensure your Vercel output directory contains the API functions
- Try adding a `.vercelignore` file to exclude unnecessary files

### 2. Database Connection Failures

If your API routes are found but database operations fail:

#### Possible Causes:
- Missing or incorrect `DATABASE_URL` in Vercel environment variables
- Database server firewall or network restrictions
- Connection pool exhaustion in serverless environment
- SSL/TLS configuration issues
- Authentication problems with the database

#### Solutions:
- Verify the `DATABASE_URL` is correctly set in Vercel Project Settings
- Ensure database provider (Supabase, etc.) allows connections from Vercel's IP ranges
- Implement connection pooling (highly recommended for serverless environments)
- Check if your database requires SSL/TLS and configure it properly
- Use the `/api/debug-connection` endpoint to get detailed connection diagnostics

### 3. Schema and Model Synchronization Issues

If database connects but operations fail:

#### Possible Causes:
- Prisma schema is not synchronized with the database
- Missing tables or columns
- Case sensitivity issues (especially in PostgreSQL)
- Invalid references or constraints

#### Solutions:
- Add `prisma db push` to your build script (already included in `vercel-build`)
- Run migrations explicitly during deployment
- Check table case sensitivity (PostgreSQL uses lowercase by default)
- Use the `/api/debug-db` endpoint to inspect the database structure
- Compare local vs. production database schemas

## Step-by-Step Debugging Process

1. **Deploy your application to Vercel**

2. **Test Basic API Functionality**
   ```
   curl https://your-app.vercel.app/api/diagnostic
   ```
   - This tests if API routes work without database dependencies
   - If this fails, you have routing or function deployment issues

3. **Test Database Connectivity**
   ```
   curl https://your-app.vercel.app/api/debug-connection
   ```
   - This checks database connection and configuration
   - Look for specific error messages in the response

4. **Verify Schema and Tables**
   ```
   curl https://your-app.vercel.app/api/debug-db
   ```
   - This lists tables and schema information
   - Verify tables needed by your application exist

5. **Check Design Table Specifically**
   ```
   curl https://your-app.vercel.app/api/debug-design
   ```
   - Tests the Design table access specifically
   - Provides model and table structure information

6. **Run Full Diagnostic Suite**
   ```
   ./test-api-endpoints.sh https://your-app.vercel.app
   ```
   - This tests all diagnostic endpoints and actual API routes
   - Compare local vs. production results

## Production Environment Configuration

### Important Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_URL`: Your application URL
- `NEXTAUTH_SECRET`: Secret for Next-Auth
- Any other service-specific variables (Stripe, etc.)

### Recommended Vercel Settings
1. **Enable Database Connection Pooling**
   - For Supabase, use the connection pooling URL format
   - This prevents connection exhaustion in serverless functions

2. **Set Framework Preset to Next.js**
   - This ensures proper configuration for Next.js projects

3. **Customize Build Command**
   - Our project already uses `npm run vercel-build` which includes:
     ```
     prisma generate && prisma db push && next build
     ```

4. **Set Node.js Version**
   - Use Node.js 18.x or newer for best compatibility

## Additional Resources

- [Vercel Troubleshooting Guide](https://vercel.com/docs/help#development-troubleshooting)
- [Prisma with Serverless Deployments](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
- [Next.js on Vercel](https://nextjs.org/docs/deployment)
