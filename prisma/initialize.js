// This script initializes the database with the current schema
const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');
const fs = require('fs');

async function initializePrisma() {
  console.log('Initializing Prisma for first deployment...');
  
  // Check if we're using production environment
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (isProduction) {
    console.log('Using production environment...');
    // Load environment variables from .env.production
    if (fs.existsSync('.env.production')) {
      const envFile = fs.readFileSync('.env.production', 'utf8');
      const envVars = envFile.split('\n').filter(line => line.trim() !== '' && !line.startsWith('#'));
      
      for (const line of envVars) {
        const [key, value] = line.split('=');
        if (key && value) {
          process.env[key] = value.replace(/^["']|["']$/g, ''); // Remove quotes if present
        }
      }
    }
  }
  
  const prisma = new PrismaClient();
  
  try {
    // Test the connection
    await prisma.$connect();
    console.log('Connected to the database successfully!');
    
    // Push the schema to the database
    console.log('Pushing schema to the database...');
    execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
    
    // Generate Prisma client
    console.log('Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    
    console.log('Prisma initialization completed successfully!');
  } catch (error) {
    console.error('Error initializing Prisma:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

initializePrisma();
