# Troubleshooting Database Connection Issues on Vercel

This guide provides steps to diagnose and fix common issues with database connectivity in Vercel deployments, particularly for Next.js API routes returning 404 errors.

## Diagnostic Tools

We've added several diagnostic endpoints to help identify the issue:

1. `/api/diagnostic` - Tests basic API route functionality without database dependencies
2. `/api/debug-connection` - Tests database connectivity with detailed error reporting
3. `/api/debug-comprehensive` - Comprehensive test of database, schema, and tables
4. `/api/debug-db` - Shows database tables and structure
5. `/api/debug-design` - Specifically tests the Design table access

## Common Issues and Solutions

### 1. API Routes Return 404 in Production

If your API routes work locally but return 404 in Vercel, check:

- **Vercel Functions**: Ensure functions are being created correctly during build.
  - Check the Vercel deployment logs for function creation.
  - Verify that `.vercel/output/functions` contains your API routes.

- **Route Handler Format**: Ensure you're using the App Router format correctly.
  - Confirm your routes use `export async function GET()` or other HTTP methods.
  - Make sure the route files are named `route.ts` or `route.js`.

### 2. Database Connection Issues

If your API routes are found but database operations fail:

- **Environment Variables**: Ensure `DATABASE_URL` is correctly set in Vercel.
  - Check the format: `postgresql://username:password@host:port/database`.
  - Double-check for special characters in passwords that might need URL encoding.

- **PostgreSQL Configuration**: Check your PostgreSQL service.
  - Ensure the database server allows connections from Vercel's IP ranges.
  - For Supabase, check if the project is active and connection pooling is configured.

- **Connection Pooling**: Consider using connection pooling for Serverless environments.
  - Update your `DATABASE_URL` to use the connection pooling URL if available.
  - For Supabase, use the connection pooling string instead of direct connection.

### 3. Schema Synchronization Issues

If the database connection works but queries fail:

- **Prisma Schema Sync**: Ensure your Prisma schema is in sync with the database.
  - Run `prisma db push` or `prisma migrate deploy` as part of your build.
  - Add a build step in `package.json` to handle migrations.

- **Table Existence**: Check if required tables exist.
  - Use the `/api/debug-db` endpoint to view available tables.
  - Verify that table names match your Prisma schema (case-sensitive).

### 4. Testing Process

To diagnose issues systematically:

1. Deploy your application to Vercel.
2. Run the diagnostic script: `./test-api-endpoints.sh https://your-app.vercel.app`
3. Check each endpoint response for clues about the issue.
4. Based on the failures, apply the appropriate fix from this guide.
5. Redeploy and test again.

## Deployment Checklist

- [ ] Database URL is correctly set in Vercel environment variables
- [ ] Database allows connections from Vercel
- [ ] Prisma schema is properly synchronized with the database
- [ ] All required tables exist in the database
- [ ] API routes are correctly formatted and deployed as Vercel functions
- [ ] Connection pooling is used for better performance in serverless environments

## Additional Vercel-Specific Tips

- Add a `postinstall` script to generate Prisma client: `"postinstall": "prisma generate"`
- Consider adding this to your `package.json` build script: `"build": "prisma generate && prisma migrate deploy && next build"`
- For debugging, enable more verbose Prisma logs by setting `DEBUG="prisma:*"` in your environment variables
