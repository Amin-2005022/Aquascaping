import { prisma } from './prisma'
import { randomUUID } from 'crypto'

export const otpService = {
  // Generate and store an OTP for an email
  async generateOtp(email: string): Promise<string> {
    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    
    // Set expiry to 10 minutes from now
    const expires = new Date()
    expires.setMinutes(expires.getMinutes() + 10)
    
    // Delete any existing OTP for this email
    await prisma.$executeRaw`
      DELETE FROM "OtpCode" WHERE "email" = ${email}
    `
    
    // Store the new OTP
    await prisma.$executeRaw`
      INSERT INTO "OtpCode" ("id", "email", "otp", "expires", "createdAt")
      VALUES (${randomUUID()}, ${email}, ${otp}, ${expires.toISOString()}, ${new Date().toISOString()})
    `
    
    return otp
  },
  
  // Verify an OTP for an email
  async verifyOtp(email: string, otpToVerify: string): Promise<boolean> {
    // Get the latest OTP for this email
    const result = await prisma.$queryRaw<{ id: string, otp: string, expires: Date }[]>`
      SELECT "id", "otp", "expires" FROM "OtpCode"
      WHERE "email" = ${email}
      ORDER BY "createdAt" DESC
      LIMIT 1
    `
    
    if (result.length === 0) {
      console.log(`No OTP found for email: ${email}`)
      return false
    }
    
    const { id, otp, expires } = result[0]
    
    // Check if OTP is expired
    if (new Date() > expires) {
      console.log(`OTP expired for email: ${email}`)
      // Clean up expired OTP
      await prisma.$executeRaw`DELETE FROM "OtpCode" WHERE "id" = ${id}`
      return false
    }
    
    // Check if OTP matches
    const isValid = otp === otpToVerify
    console.log(`OTP validation for ${email}: ${isValid ? 'success' : 'failed'}`)
    
    if (isValid) {
      // Clean up used OTP
      await prisma.$executeRaw`DELETE FROM "OtpCode" WHERE "id" = ${id}`
    }
    
    return isValid
  },
  
  // Clean up expired OTPs (should be called periodically)
  async cleanupExpiredOtps(): Promise<number> {
    const result = await prisma.$executeRaw`
      DELETE FROM "OtpCode" WHERE "expires" < ${new Date().toISOString()}
    `
    return Number(result)
  }
}
