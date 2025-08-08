import { PrismaClient } from '@prisma/client'

// Extend Prisma schema with a new model for OTP codes
// Run this script manually, or add the model to schema.prisma and run migration

const prisma = new PrismaClient()

async function main() {
  try {
    // Check if VerificationToken table exists and has necessary fields
    console.log('Setting up OTP database storage...')
    
    // Create schema using raw SQL (SQLite specific)
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "OtpCode" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "email" TEXT NOT NULL,
        "otp" TEXT NOT NULL,
        "expires" DATETIME NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `
    
    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS "OtpCode_email_idx" ON "OtpCode"("email")
    `
    
    console.log('OTP database storage is ready')
  } catch (error) {
    console.error('Error setting up OTP database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
