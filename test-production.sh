#!/bin/bash
# For Windows, use this in Git Bash or WSL

# Copy production env vars to .env for local testing
cp .env.production .env

# Generate Prisma client with production database
npx prisma generate

# Push schema to production database
npx prisma db push

# Run the application in production mode
npm run build
npm start
