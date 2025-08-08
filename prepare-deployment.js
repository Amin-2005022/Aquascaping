const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Preparing for deployment...');

// 1. Create migrations directory if it doesn't exist
const migrationsDir = path.join(__dirname, 'prisma', 'migrations');
if (!fs.existsSync(migrationsDir)) {
  fs.mkdirSync(migrationsDir, { recursive: true });
  console.log('✅ Created migrations directory');
}

// 2. Set environment to production for database operations
process.env.NODE_ENV = 'production';

// 3. Copy production env to .env for Prisma to use
try {
  const envProduction = fs.readFileSync('.env.production', 'utf8');
  fs.writeFileSync('.env', envProduction);
  console.log('✅ Copied production environment variables');
} catch (error) {
  console.error('❌ Error copying environment variables:', error.message);
  process.exit(1);
}

// 4. Generate Prisma client
try {
  console.log('🔄 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma client generated');
} catch (error) {
  console.error('❌ Error generating Prisma client:', error.message);
  process.exit(1);
}

// 5. Create OtpCode table in PostgreSQL
try {
  console.log('🔄 Setting up OTP table in PostgreSQL...');
  execSync('node prisma/setup-otp-table-postgres.js', { stdio: 'inherit' });
  console.log('✅ OTP table created');
} catch (error) {
  console.error('❌ Error creating OTP table:', error.message);
  // Continue despite error as the table might already exist
}

console.log('✅ Deployment preparation completed successfully!');
