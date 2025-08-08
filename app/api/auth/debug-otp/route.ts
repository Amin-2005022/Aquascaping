import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

// This is a development-only endpoint for debugging OTP issues
// Should be removed in production
export async function GET(request: NextRequest) {
  // Only allow in development environment
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 })
  }
  
  // Get email from query parameter
  const email = request.nextUrl.searchParams.get('email')
  
  try {
    const otpCodes = await prisma.$queryRaw<any[]>`
      SELECT * FROM "OtpCode"
      ${email ? `WHERE "email" = ${email}` : ''}
      ORDER BY "createdAt" DESC
    `
    
    return NextResponse.json({
      count: otpCodes.length,
      otpCodes: otpCodes.map(code => ({
        ...code,
        // Mask OTP except for the first and last digit for security
        otp: code.otp.length > 2 
          ? `${code.otp[0]}****${code.otp[code.otp.length - 1]}`
          : '****'
      }))
    })
  } catch (error) {
    console.error('Error fetching OTP codes:', error)
    return NextResponse.json({ error: 'Failed to fetch OTP codes' }, { status: 500 })
  }
}
