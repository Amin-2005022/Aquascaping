import { NextResponse } from 'next/server'

/**
 * This is a minimal diagnostic API endpoint that doesn't rely on Prisma
 * or database connectivity. This helps determine if the issue is with 
 * the API route mechanism itself or with database connectivity.
 * 
 * NOTE: This endpoint is public and doesn't require authentication
 * for diagnostic purposes.
 */
export async function GET() {
  try {
    const diagnosticInfo = {
      status: 'API route working',
      timestamp: new Date().toISOString(),
      environment: {
        nodeEnv: process.env.NODE_ENV,
        isVercel: typeof process.env.VERCEL !== 'undefined',
        vercelEnv: process.env.VERCEL_ENV || 'Not specified',
        region: process.env.VERCEL_REGION || 'Not specified'
      },
      databaseUrlFormat: process.env.DATABASE_URL ? 
        `Format check: ${checkDatabaseUrlFormat(process.env.DATABASE_URL)}` : 
        'DATABASE_URL not defined',
      runtimeInfo: {
        nodeVersion: process.version,
        platform: process.platform,
        memoryUsage: process.memoryUsage()
      },
      headers: Object.fromEntries([
        ...Array.from(new Headers().entries()),
        ['user-agent', 'redacted for privacy']
      ])
    }

    return NextResponse.json(diagnosticInfo)
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: (error as Error).message,
      stack: (error as Error).stack
    }, { status: 500 })
  }
}

/**
 * Checks if a database URL follows the expected format without exposing credentials
 */
function checkDatabaseUrlFormat(url: string): string {
  try {
    // Example: postgresql://username:password@host:port/database
    const urlPattern = /^(postgresql|mysql|mongodb):\/\/[^:]+:[^@]+@[^:]+:[0-9]+\/[^?]+(\?.*)?$/
    
    if (!urlPattern.test(url)) {
      return 'URL does not match expected format'
    }

    const parts = url.split(':')
    const protocol = parts[0]
    
    // Check for query parameters
    const hasQueryParams = url.includes('?')
    
    // Count segments
    const segments = url.split('/').length
    
    // Return diagnostic info without exposing credentials
    return `Valid ${protocol} URL with ${segments} segments${hasQueryParams ? ' and query parameters' : ''}`
  } catch (e) {
    return `Error analyzing URL: ${(e as Error).message}`
  }
}
