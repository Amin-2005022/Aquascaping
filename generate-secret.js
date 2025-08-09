// Generate a secure random string for NEXTAUTH_SECRET
const crypto = require('crypto');

// Generate a random string (32 bytes = 256 bits, converted to base64)
const secret = crypto.randomBytes(32).toString('base64');

console.log('Use the following value for your NEXTAUTH_SECRET environment variable:');
console.log('\n' + secret + '\n');
console.log('Add this to your Vercel environment variables in the project settings.');
