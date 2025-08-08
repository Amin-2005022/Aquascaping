import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AquaScaping - Design Your Dream Aquarium',
  description: 'Create custom aquariums, aquascapes, and terrariums in 3D and get them delivered to your door.',
  keywords: 'aquarium, aquascaping, terrarium, 3D design, fish tank, custom aquarium',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
