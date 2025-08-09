import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function GET() {
  try {
    // Check if Design table exists
    const designTableExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'Design'
      ) as exists
    `
    
    // Try to count designs
    let designCount = null
    try {
      designCount = await prisma.design.count()
    } catch (e: any) {
      // If this fails, we'll pass the error message
      designCount = { error: e.message }
    }
    
    return NextResponse.json({ 
      designTableExists,
      designCount,
      prismaModelNames: Object.keys(prisma).filter(key => 
        !key.startsWith('$') && 
        !key.startsWith('_') && 
        typeof prisma[key as keyof typeof prisma] === 'object'
      )
    })
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}
