'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowRight, Droplets, Fish, Palette, Zap } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard')
    }
  }, [status, router])
  
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Droplets className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-gray-900">AquaScaping</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/configurator" className="text-gray-600 hover:text-primary">
              3D Designer
            </Link>
            <Link href="/shop" className="text-gray-600 hover:text-primary">
              Shop
            </Link>
            <Link href="/gallery" className="text-gray-600 hover:text-primary">
              Gallery
            </Link>
            <Link href="/blog" className="text-gray-600 hover:text-primary">
              Blog
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-primary">
              Contact
            </Link>
            <Link href="/auth/signin">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Design Your Dream
            <span className="text-primary block">Aquarium in 3D</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Create stunning aquascapes with our interactive 3D designer. Choose from hundreds of plants, 
            rocks, driftwood, and fish. Get real-time pricing and have your custom setup delivered to your door.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/configurator">
              <Button size="lg" className="text-lg px-8 py-4">
                Start Designing <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/gallery">
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                View Gallery
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose AquaScaping?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card>
              <CardHeader>
                <Palette className="h-10 w-10 text-primary mb-2" />
                <CardTitle>3D Design Studio</CardTitle>
                <CardDescription>
                  Design in real-time 3D with drag-and-drop simplicity. See exactly how your aquarium will look.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Zap className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Instant Pricing</CardTitle>
                <CardDescription>
                  Get real-time price updates as you design. No surprises, transparent pricing for every component.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Fish className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Expert Curation</CardTitle>
                <CardDescription>
                  All our plants, fish, and equipment are carefully selected by aquascaping professionals.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Droplets className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Complete Setup</CardTitle>
                <CardDescription>
                  Everything you need arrives ready to set up. Detailed instructions and ongoing support included.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Design in 3D</h3>
              <p className="text-gray-600">
                Use our intuitive 3D designer to create your perfect aquascape. Drag and drop elements, 
                adjust lighting, and see real-time previews.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Review & Order</h3>
              <p className="text-gray-600">
                Review your design, get instant pricing, and place your order. 
                We&apos;ll prepare everything exactly as you designed it.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Receive & Enjoy</h3>
              <p className="text-gray-600">
                Your complete aquarium setup arrives ready to install. 
                Follow our guides and start enjoying your underwater masterpiece.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Create Your Masterpiece?
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-8">
            Join thousands of aquascaping enthusiasts who&apos;ve brought their visions to life.
          </p>
          <Link href="/configurator">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
              Start Your Design Journey
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Droplets className="h-6 w-6" />
                <span className="text-lg font-semibold">AquaScaping</span>
              </div>
              <p className="text-gray-400">
                Creating beautiful underwater worlds, one aquarium at a time.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/configurator" className="hover:text-white">3D Designer</Link></li>
                <li><Link href="/gallery" className="hover:text-white">Gallery</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link href="/guides" className="hover:text-white">Setup Guides</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AquaScaping. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
