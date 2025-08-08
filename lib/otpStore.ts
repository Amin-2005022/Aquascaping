// Store OTPs temporarily using a global variable
// In production, you should use a database or Redis
// This works only for development with a single server instance
declare global {
  var otpStoreGlobal: Map<string, { otp: string; expires: Date }>;
}

// Initialize global OTP store if it doesn't exist
if (!global.otpStoreGlobal) {
  global.otpStoreGlobal = new Map<string, { otp: string; expires: Date }>();
}

export const otpStore = global.otpStoreGlobal;
