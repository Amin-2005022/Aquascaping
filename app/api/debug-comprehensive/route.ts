import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

// Helper function to safely try database operations
async function trySafe<T>(operation: () => Promise<T>, operationName: string): Promise<{success: boolean, result?: T, error?: any}> {
  try {
    const result = await operation()
    return { success: true, result }
  } catch (error) {
    console.error(`Error in ${operationName}:`, error)
    return { success: false, error: { message: (error as Error).message, stack: (error as Error).stack } }
  }
}

// Define the type for the results object
interface DiagnosticResults {
  timestamp: string;
  environment: string | undefined;
  vercelDeployment: boolean;
  apiRoute: {
    status: string;
    message: string;
  };
  databaseConnection: {
    success: boolean;
    result?: { connected: boolean };
    error?: any;
  };
  dbDetails: {
    url: string;
  };
  prismaModels?: {
    success: boolean;
    result?: string[];
    error?: any;
  };
  tableStructure?: {
    success: boolean;
    result?: any;
    error?: any;
  };
  designTableTest?: {
    success: boolean;
    result?: any;
    error?: any;
  };
  userTableTest?: {
    success: boolean;
    result?: any;
    error?: any;
  };
  simpleQueryTest?: {
    success: boolean;
    result?: any;
    error?: any;
  };
}

export async function GET() {
  // Start with basic environment info
  const results: DiagnosticResults = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    vercelDeployment: !!process.env.VERCEL,
    apiRoute: {
      status: 'reachable',
      message: 'This API route is correctly being executed'
    },
    databaseConnection: await trySafe(
      async () => {
        const result = await prisma.$queryRaw`SELECT 1 as connected`
        return { connected: !!result }
      },
      'database connection test'
    ),
    dbDetails: {
      url: process.env.DATABASE_URL ? 
        `${process.env.DATABASE_URL.split('://')[0]}://${process.env.DATABASE_URL.split('@')[1]?.split('/')[0] || '[redacted]'}` : 
        'Not set'
    }
  }

  // Check Prisma models
  results.prismaModels = await trySafe(
    async () => {
      return Object.keys(prisma).filter(key => 
        !key.startsWith('$') && 
        !key.startsWith('_') &&
        typeof prisma[key as keyof typeof prisma] === 'object'
      )
    },
    'prisma models check'
  )

  // Check database tables
  results.tableStructure = await trySafe(
    async () => {
      return await prisma.$queryRaw`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `
    },
    'table structure check'
  )

  // Test Design table specifically
  results.designTableTest = await trySafe(
    async () => {
      try {
        const designCount = await prisma.design.count()
        return { exists: true, count: designCount }
      } catch (e) {
        // Check if table exists but can't be queried via Prisma
        const tableExists = await prisma.$queryRaw`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'Design'
          ) as exists
        `
        return { exists: (tableExists as any)[0]?.exists || false, error: (e as Error).message }
      }
    },
    'design table test'
  )

  // Test User table
  results.userTableTest = await trySafe(
    async () => {
      try {
        const userCount = await prisma.user.count()
        return { exists: true, count: userCount }
      } catch (e) {
        return { exists: false, error: (e as Error).message }
      }
    },
    'user table test'
  )

  // Try a simple raw query as fallback
  results.simpleQueryTest = await trySafe(
    async () => {
      return await prisma.$queryRaw`SELECT current_database() as database, current_user as user`
    },
    'simple query test'
  )

  return NextResponse.json(results)
}
