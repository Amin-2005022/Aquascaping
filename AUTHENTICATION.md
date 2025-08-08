# Authentication Setup

## Email and Google Authentication

This project uses NextAuth.js for authentication with the following methods:
- Email with OTP verification
- Google OAuth

## Setup Instructions

1. Copy the `.env.local.example` file to `.env.local`:
   ```
   cp .env.local.example .env.local
   ```

2. Configure Google OAuth:
   - Go to the [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Navigate to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Select "Web application" as the application type
   - Add your domain to Authorized JavaScript origins (e.g., `http://localhost:3000`)
   - Add your callback URL to Authorized redirect URIs (e.g., `http://localhost:3000/api/auth/callback/google`)
   - Copy the Client ID and Client Secret to your `.env.local` file

3. Configure Email for OTP:
   - For Gmail:
     - Enable 2-factor authentication on your Gmail account
     - Create an App Password: Go to your Google Account > Security > App Passwords
     - Select "Mail" and your device, then generate
     - Use this password in your `.env.local` file as `EMAIL_SERVER_PASSWORD`
   
   - For other email providers:
     - Update the `EMAIL_SERVER_HOST` and `EMAIL_SERVER_PORT` accordingly
     - Provide your email credentials

4. Generate a NextAuth Secret:
   - Run this command to generate a secure secret:
     ```
     openssl rand -base64 32
     ```
   - Copy the output to your `.env.local` file as `NEXTAUTH_SECRET`

5. Update the `NEXTAUTH_URL` to match your deployment URL (use `http://localhost:3000` for local development)

## Testing Authentication

- To test normal email signup with OTP verification:
  1. Go to `/auth/signup`
  2. Fill out the registration form
  3. Check your email for the OTP code
  4. Enter the code to complete registration

- To test Google sign-in:
  1. Go to `/auth/signin` or `/auth/signup`
  2. Click "Sign in with Google" or "Sign up with Google"
  3. Complete the Google authentication flow
