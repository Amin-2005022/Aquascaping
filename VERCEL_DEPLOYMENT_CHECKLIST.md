# Vercel Deployment Checklist and Troubleshooting Guide

## Pre-Deployment Checklist

### Local Environment Verification
- [ ] Application runs correctly in local development environment
- [ ] All API routes work locally when tested with `/test-api-endpoints.sh`
- [ ] Database schema is synchronized and all tables are accessible
- [ ] ESLint issues are resolved and build succeeds without errors

### Environment Variables
- [ ] All required environment variables are set in Vercel project settings
- [ ] `DATABASE_URL` is correctly formatted with valid credentials
- [ ] `NEXTAUTH_URL` is set to the Vercel deployment URL
- [ ] `NEXTAUTH_SECRET` is properly generated and set

### Database Preparation
- [ ] Database is properly provisioned and accessible
- [ ] Database server allows connections from Vercel's IP ranges
- [ ] Tables are created with proper schema matching Prisma models
- [ ] For Supabase, consider using connection pooling URL

### Build Configuration
- [ ] `vercel.json` is configured with correct build command
- [ ] `package.json` includes `vercel-build` script with Prisma setup
- [ ] Next.js configuration is optimized for production

## Deployment Process

1. Commit all changes to your repository
2. Push to the deployment branch
3. Verify Vercel automatic deployment or manually trigger deployment
4. Monitor build logs for any errors
5. Check for successful function creation in deployment details

## Post-Deployment Verification

Run the diagnostic test script against your Vercel deployment:

```bash
./test-api-endpoints.sh https://your-app.vercel.app
```

Verify each endpoint individually:

- [ ] `/api/diagnostic` - Basic API functionality
- [ ] `/api/debug-connection` - Database connectivity
- [ ] `/api/debug-db` - Database table structure
- [ ] `/api/debug-design` - Design table access
- [ ] `/api/debug-comprehensive` - Full system check
- [ ] `/api/designs` - Actual API endpoint (requires authentication)

## Common Issues and Solutions

### 404 Errors on API Routes

**Possible Causes:**
- API routes not properly deployed as Vercel functions
- Route naming or structure issues
- Middleware blocking access

**Solutions:**
- Check Vercel function logs
- Verify route file naming conventions
- Update middleware to allow diagnostic endpoints

### Database Connection Failures

**Possible Causes:**
- Incorrect `DATABASE_URL` format or credentials
- Network restrictions blocking Vercel connections
- Connection pool exhaustion in serverless environment

**Solutions:**
- Verify database URL and credentials
- Check network access permissions
- Implement connection pooling

### Schema Synchronization Issues

**Possible Causes:**
- Prisma schema not synchronized with database
- Tables missing or have incorrect structure
- Case sensitivity issues with table names

**Solutions:**
- Ensure build process includes `prisma db push`
- Manually check table structure in database
- Verify case sensitivity matches between schema and database

## Troubleshooting Steps

1. **Identify the problem area:**
   - Is it API route access?
   - Database connection?
   - Schema synchronization?
   - Authentication?

2. **Use diagnostic endpoints:**
   - Start with `/api/diagnostic` (no DB dependency)
   - Then `/api/debug-connection` (DB connection)
   - Then specific table checks with `/api/debug-design`

3. **Check Vercel logs:**
   - Function invocation logs
   - Build logs
   - Error messages

4. **Verify environment:**
   - Environment variables are set correctly
   - Database is accessible from Vercel
   - Schema matches Prisma models

## Quick Fixes for Common Issues

### Fix for "Cannot find module '@prisma/client'"
```
"postinstall": "prisma generate"
```

### Fix for Schema Synchronization
```
"vercel-build": "prisma generate && prisma db push && next build"
```

### Fix for Connection Pool Exhaustion
Use connection pooling URL format:
```
postgresql://username:password@pooled-host:port/database?connection_limit=5
```

### Fix for API Route 404 Errors
Check middleware.ts to ensure it's not blocking access to diagnostic endpoints.

## Additional Resources

- [Vercel Deployment Documentation](https://vercel.com/docs/concepts/deployments/overview)
- [Prisma with Serverless Functions](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
- [Next.js on Vercel](https://nextjs.org/docs/deployment)
- [Database Connection Pooling](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management#serverless-environments-faas)

## Support Resources

- [Vercel Support](https://vercel.com/support)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
