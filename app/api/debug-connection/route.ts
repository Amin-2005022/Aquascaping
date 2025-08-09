import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

// Define types for better type safety
interface DebugInfo {
  environment: string | undefined;
  databaseUrl: string;
  vercelEnv: string;
  timestamp: string;
  serverInfo: {
    nodeVersion: string;
    platform: string;
    arch: string;
  };
  dbConnectionTest: any;
  prismaModels: string[] | null;
  prismaModelDetails: Record<string, any>;
  tables: any;
  errorDetails: {
    message: string;
    name: string;
    code?: string;
    stack?: string;
  } | null;
}

export async function GET() {
  const debugInfo: DebugInfo = {
    environment: process.env.NODE_ENV,
    databaseUrl: process.env.DATABASE_URL ? 
      `${process.env.DATABASE_URL.split('://')[0]}://*****` : 
      'Not defined',
    vercelEnv: process.env.VERCEL_ENV || 'Not a Vercel environment',
    timestamp: new Date().toISOString(),
    serverInfo: {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch
    },
    dbConnectionTest: null,
    prismaModels: null,
    prismaModelDetails: {},
    tables: null,
    errorDetails: null
  }

  try {
    // Test database connection with timeout
    const connectionPromise = prisma.$queryRaw`SELECT 1 as alive`
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database connection timeout after 5 seconds')), 5000)
    )
    
    debugInfo.dbConnectionTest = await Promise.race([
      connectionPromise,
      timeoutPromise
    ])

    // Get available models from Prisma client
    debugInfo.prismaModels = Object.keys(prisma).filter(key => 
      !key.startsWith('$') && 
      !key.startsWith('_') &&
      typeof prisma[key as keyof typeof prisma] === 'object'
    )

    // Try to get table information
    debugInfo.tables = await prisma.$queryRaw`
      SELECT table_name, table_schema
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `

    // Check for specific critical models
    const modelTests = ['Design', 'Product', 'User', 'Order']
    
    for (const model of modelTests) {
      const modelName = model.toLowerCase()
      try {
        // @ts-ignore - Dynamic access to prisma models
        const count = await prisma[modelName].count()
        debugInfo.prismaModelDetails[model] = { exists: true, count }
      } catch (e: any) {
        debugInfo.prismaModelDetails[model] = { 
          exists: false, 
          error: e.message,
          code: e.code
        }
      }
    }

    return NextResponse.json(debugInfo)
  } catch (error: any) {
    debugInfo.errorDetails = {
      message: error.message,
      name: error.name,
      code: error.code,
      stack: error.stack
    }
    
    return NextResponse.json(debugInfo, { status: 500 })
  }
}
