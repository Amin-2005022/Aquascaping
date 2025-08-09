'use client'

import { useState, useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { Droplets } from 'lucide-react'
import Link from 'next/link'

export default function SignUpPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState(1) // 1: initial form, 2: OTP verification
  const [isResendingOtp, setIsResendingOtp] = useState(false)
  const router = useRouter()
  const { status } = useSession()
  
  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard')
    }
  }, [status, router])

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setStep(2)
      } else {
        setError(data.error || 'Something went wrong')
      }
    } catch (error) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    setIsResendingOtp(true)
    setError('')

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Show success message
      } else {
        setError(data.error || 'Failed to resend verification code')
      }
    } catch (error) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsResendingOtp(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          otp,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        router.push('/auth/signin?message=Account created successfully. Please sign in.')
      } else {
        setError(data.error || 'Invalid verification code')
      }
    } catch (error) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 text-2xl font-bold">
            <Droplets className="h-8 w-8 text-primary" />
            <span>AquaScaping</span>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{step === 1 ? 'Create Account' : 'Verify Email'}</CardTitle>
            <CardDescription>
              {step === 1 
                ? 'Sign up to start designing your dream aquarium' 
                : 'Enter the verification code sent to your email'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 1 ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                {error && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
                    {error}
                  </div>
                )}
                
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Full Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Create a password (min. 6 characters)"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium">
                    Confirm Password
                  </label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Confirm your password"
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Processing...' : 'Continue'}
                </Button>
                
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or sign up with</span>
                  </div>
                </div>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                    <path fill="none" d="M1 1h22v22H1z" />
                  </svg>
                  Sign up with Google
                </Button>
                
                <div className="text-center text-sm">
                  <span className="text-gray-600">Already have an account? </span>
                  <Link href="/auth/signin" className="text-primary hover:underline">
                    Sign in
                  </Link>
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                {error && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
                    {error}
                  </div>
                )}
                
                <div className="bg-blue-50 p-4 rounded-md mb-4 text-sm">
                  <p>We&apos;ve sent a verification code to <strong>{email}</strong></p>
                  <p className="mt-1">Please check your inbox and enter the code below.</p>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="otp" className="text-sm font-medium">
                    Verification Code
                  </label>
                  <Input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    className="text-center tracking-widest text-lg"
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Verifying...' : 'Complete Sign Up'}
                </Button>
                
                <div className="text-center text-sm">
                  <button 
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isResendingOtp}
                    className="text-primary hover:underline"
                  >
                    {isResendingOtp ? 'Sending...' : 'Resend verification code'}
                  </button>
                </div>
                
                <div className="text-center text-sm mt-4">
                  <button 
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-gray-600 hover:underline"
                  >
                    Back to sign up
                  </button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
