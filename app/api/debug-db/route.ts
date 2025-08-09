import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function GET() {
  try {
    // Test database connection
    const testQuery = await prisma.$queryRaw`SELECT 1 as alive`
    
    // List all tables
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `
    
    return NextResponse.json({ 
      status: 'connected',
      tables,
      env: {
        dbUrl: process.env.DATABASE_URL?.substring(0, 15) + '...' // Only show beginning for security
      }
    })
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}
