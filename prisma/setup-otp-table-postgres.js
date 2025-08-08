import { PrismaClient } from '@prisma/client'

// Setup OTP table for PostgreSQL
const prisma = new PrismaClient()

async function main() {
  try {
    console.log('Setting up OTP database storage for PostgreSQL...')
    
    // Create schema using raw SQL (PostgreSQL specific)
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "OtpCode" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "email" TEXT NOT NULL,
        "otp" TEXT NOT NULL,
        "expires" TIMESTAMP NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `
    
    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS "OtpCode_email_idx" ON "OtpCode"("email")
    `
    
    console.log('OTP database storage is ready for PostgreSQL')
  } catch (error) {
    console.error('Error setting up OTP database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
