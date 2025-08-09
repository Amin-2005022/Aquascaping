'use client'

import { useState, useEffect } from 'react'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { Badge } from '../../components/ui/badge'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { 
  Palette, 
  Package, 
  User, 
  LogOut, 
  Plus,
  Eye,
  Edit,
  Trash,
  Share,
  Sparkles,
  Download,
  Copy,
  RefreshCw,
  Calendar,
  Trash2,
  ShoppingCart
} from 'lucide-react'
import { AquariumAIAssistant } from '../../components/AquariumAIAssistant'
import { DesignPreview, DesignPreviewFallback } from '../../components/configurator/DesignPreview'

interface GeneratedImage {
  id: string
  url: string
  prompt: string
  style: string
  timestamp: Date
}

interface SavedDesign {
  id: string
  name: string
  description?: string
  totalPrice: number
  thumbnail?: string
  data: string
  createdAt: string
  updatedAt: string
  items: {
    id: string
    productId: string
    quantity: number
    position?: string
    rotation?: string
    scale?: string
    product: {
      id: string
      name: string
      price: number
      images: string
    }
  }[]
}

const aquariumStyles = [
  { value: 'natural', label: 'Natural Planted', description: 'Lush green plants with natural hardscape' },
  { value: 'dutch', label: 'Dutch Style', description: 'Colorful plant arrangements in terraces' },
  { value: 'iwagumi', label: 'Iwagumi', description: 'Minimalist stone-focused design' },
  { value: 'biotope', label: 'Biotope', description: 'Recreating natural habitat' },
  { value: 'reef', label: 'Coral Reef', description: 'Colorful coral reef scene' },
  { value: 'freshwater', label: 'Freshwater Community', description: 'Mixed freshwater fish community' },
]

const mockOrders = [
  {
    id: '1',
    orderNumber: 'AQ-2024-001',
    status: 'SHIPPED',
    totalAmount: 299.99,
    createdAt: '2024-01-16T10:30:00Z',
    estimatedDelivery: '2024-01-20',
    items: [
      { name: 'Dragon Stone', quantity: 2 },
      { name: 'Anubias Nana', quantity: 3 },
      { name: 'Custom Tank 60x40x35', quantity: 1 }
    ]
  },
  {
    id: '2',
    orderNumber: 'AQ-2024-002',
    status: 'PROCESSING',
    totalAmount: 185.50,
    createdAt: '2024-01-14T15:45:00Z',
    estimatedDelivery: '2024-01-22',
    items: [
      { name: 'Seiryu Stone', quantity: 1 },
      { name: 'Java Moss', quantity: 2 }
    ]
  }
]

function SavedDesignCard({ design }: { design: GeneratedImage }) {
  const downloadImage = async (url: string, filename: string) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      console.error('Error downloading image:', error)
    }
  }

  const copyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt)
  }

  const getStyleLabel = (styleValue: string) => {
    return aquariumStyles.find(s => s.value === styleValue)?.label || 'Custom Style'
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="aspect-video relative overflow-hidden">
        <img
          src={design.url}
          alt="AI Generated Aquarium Design"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder-aquarium.svg'
          }}
        />
        {/* Overlay with controls */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-4">
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => downloadImage(design.url, `aquarium-design-${design.id}.jpg`)}
              className="bg-white/95 hover:bg-white backdrop-blur-sm"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => copyPrompt(design.prompt)}
              className="bg-white/95 hover:bg-white backdrop-blur-sm"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/95 hover:bg-white backdrop-blur-sm"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Style badge */}
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-white/90 text-gray-800 backdrop-blur-sm">
            {getStyleLabel(design.style)}
          </Badge>
        </div>
      </div>
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-1">
              AI Design #{design.id.slice(-4)}
            </CardTitle>
            <CardDescription className="line-clamp-2 mt-1">
              {design.prompt.split(',').slice(0, 3).join(', ')}...
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-1" />
            {new Date(design.timestamp).toLocaleDateString()}
          </div>
          <div className="flex space-x-2">
            <Link href={`/configurator?inspiration=${design.id}`}>
              <Button size="sm" variant="outline">
                <Edit className="h-4 w-4 mr-1" />
                Recreate
              </Button>
            </Link>
            <Button size="sm">
              <Share className="h-4 w-4 mr-1" />
              Share
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ConfiguratorDesignCard({ design }: { design: SavedDesign }) {
  const deleteDesign = async (designId: string) => {
    try {
      const response = await fetch(`/api/designs/${designId}`, {
        method: 'DELETE'
      })
      if (!response.ok) {
        throw new Error('Failed to delete design')
      }
      // Refresh the page to update the designs list
      window.location.reload()
    } catch (error) {
      console.error('Error deleting design:', error)
    }
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="aspect-video relative overflow-hidden">
        {/* 3D Preview */}
        <div className="w-full h-full">
          <DesignPreview 
            items={design.items}
            className="w-full h-full rounded-t-lg"
            width={400}
            height={240}
          />
        </div>
        
        {/* Overlay with controls */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-4">
          <div className="flex space-x-2">
            <Link href={`/configurator?design=${design.id}`}>
              <Button
                size="sm"
                variant="secondary"
                className="bg-white/95 hover:bg-white backdrop-blur-sm"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </Link>
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/95 hover:bg-white backdrop-blur-sm"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => deleteDesign(design.id)}
              className="bg-white/95 hover:bg-white backdrop-blur-sm text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Price badge */}
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-white/90 text-gray-800 backdrop-blur-sm">
            ৳{design.totalPrice.toFixed(2)}
          </Badge>
        </div>
        
        {/* Items count badge */}
        <div className="absolute top-3 right-3">
          <Badge variant="outline" className="bg-white/90 text-gray-700 backdrop-blur-sm border-gray-300">
            {design.items.length} items
          </Badge>
        </div>
      </div>
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-1">
              {design.name}
            </CardTitle>
            <CardDescription className="line-clamp-2 mt-1">
              {design.description || `Custom aquarium design with ${design.items.map(item => item.product.name).slice(0, 2).join(', ')}${design.items.length > 2 ? ` and ${design.items.length - 2} more` : ''}`}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-1" />
            {new Date(design.createdAt).toLocaleDateString()}
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-primary">
              ৳{design.totalPrice.toFixed(2)}
            </p>
          </div>
        </div>
        
        {/* Items preview */}
        <div className="mb-4">
          <p className="text-xs font-medium text-gray-600 mb-2">Components ({design.items.length}):</p>
          <div className="flex flex-wrap gap-1">
            {design.items.slice(0, 3).map((item, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {item.product.name}
              </Badge>
            ))}
            {design.items.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{design.items.length - 3} more
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Link href={`/configurator?design=${design.id}`} className="flex-1">
            <Button size="sm" className="w-full">
              <Edit className="h-4 w-4 mr-1" />
              Edit Design
            </Button>
          </Link>
          <Button size="sm" variant="outline">
            <ShoppingCart className="h-4 w-4 mr-1" />
            Order
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function OrderCard({ order }: { order: any }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800'
      case 'PROCESSING': return 'bg-purple-100 text-purple-800'
      case 'SHIPPED': return 'bg-green-100 text-green-800'
      case 'DELIVERED': return 'bg-green-100 text-green-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
            <CardDescription>
              Ordered on {new Date(order.createdAt).toLocaleDateString()}
            </CardDescription>
          </div>
          <div className="text-right">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
              {order.status}
            </span>
            <p className="text-lg font-semibold mt-1">
              ${order.totalAmount.toFixed(2)}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <h4 className="font-medium">Items:</h4>
          {order.items.map((item: any, index: number) => (
            <div key={index} className="flex justify-between text-sm">
              <span>{item.name}</span>
              <span>×{item.quantity}</span>
            </div>
          ))}
          {order.status === 'SHIPPED' && (
            <p className="text-sm text-green-600 mt-2">
              Expected delivery: {order.estimatedDelivery}
            </p>
          )}
        </div>
        <div className="flex space-x-2 mt-4">
          <Button size="sm" variant="outline">
            View Details
          </Button>
          <Button size="sm" variant="outline">
            Track Package
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState('designs')
  const [savedDesigns, setSavedDesigns] = useState<GeneratedImage[]>([])
  const [configuratorDesigns, setConfiguratorDesigns] = useState<SavedDesign[]>([])
  const [userOrders, setUserOrders] = useState<any[]>([])
  const [loadingConfigurator, setLoadingConfigurator] = useState(false)
  const [loadingOrders, setLoadingOrders] = useState(false)

  // Load saved AI designs from localStorage
  useEffect(() => {
    if (!session?.user?.email) return
    
    const userEmail = session.user.email
    const storageKey = `aquarium-ai-images-${userEmail}`
    
    const loadSavedDesigns = () => {
      const savedImages = localStorage.getItem(storageKey)
      if (savedImages) {
        try {
          const parsedImages = JSON.parse(savedImages)
          setSavedDesigns(parsedImages.map((img: any) => ({
            ...img,
            timestamp: new Date(img.timestamp)
          })))
        } catch (error) {
          console.error('Error loading saved designs:', error)
        }
      }
    }

    loadSavedDesigns()

    // Listen for storage changes to update designs when new ones are created
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === storageKey) {
        loadSavedDesigns()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    
    // Also poll for changes since localStorage events don't fire in same tab
    const interval = setInterval(loadSavedDesigns, 2000)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [session])

  // Load 3D configurator designs from API
  useEffect(() => {
    const loadConfiguratorDesigns = async () => {
      if (!session) return
      
      setLoadingConfigurator(true)
      try {
        const response = await fetch('/api/designs')
        if (response.ok) {
          const designs = await response.json()
          setConfiguratorDesigns(designs)
        } else if (response.status !== 401) {
          console.error('Failed to load configurator designs')
        }
      } catch (error) {
        console.error('Error loading configurator designs:', error)
      } finally {
        setLoadingConfigurator(false)
      }
    }

    loadConfiguratorDesigns()
  }, [session])
  
  // Load user orders from API
  useEffect(() => {
    const loadUserOrders = async () => {
      if (!session) return
      
      setLoadingOrders(true)
      try {
        const response = await fetch('/api/orders')
        if (response.ok) {
          const orders = await response.json()
          setUserOrders(orders)
        } else if (response.status !== 401) {
          console.error('Failed to load user orders')
        }
      } catch (error) {
        console.error('Error loading user orders:', error)
      } finally {
        setLoadingOrders(false)
      }
    }
    
    loadUserOrders()
  }, [session])

  const clearAllDesigns = () => {
    localStorage.removeItem('aquarium-ai-images')
    setSavedDesigns([])
  }

  const totalDesigns = savedDesigns.length + configuratorDesigns.length

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in</h1>
          <Link href="/auth/signin">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b flex-shrink-0">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold">
            AquaScaping
          </Link>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Welcome, {session.user?.name || session.user?.email}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut()}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 flex-1 flex flex-col">
        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-6 mb-8 flex-shrink-0">
          <Link href="/configurator">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="flex items-center p-6">
                <div className="p-3 bg-primary/10 rounded-lg mr-4">
                  <Palette className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Design New Tank</h3>
                  <p className="text-sm text-gray-600">
                    Create a new aquascape design
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Card 
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setActiveTab('ai-assistant')}
          >
            <CardContent className="flex items-center p-6">
              <div className="p-3 bg-purple-100 rounded-lg mr-4">
                <Sparkles className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold">AI Assistant</h3>
                <p className="text-sm text-gray-600">
                  Generate aquarium concepts
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="flex items-center p-6">
              <div className="p-3 bg-blue-100 rounded-lg mr-4">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Browse Products</h3>
                <p className="text-sm text-gray-600">
                  Explore our catalog
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="flex items-center p-6">
              <div className="p-3 bg-green-100 rounded-lg mr-4">
                <User className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">Profile Settings</h3>
                <p className="text-sm text-gray-600">
                  Manage your account
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 flex-1 flex flex-col">
          <TabsList>
            <TabsTrigger value="designs">My Designs ({totalDesigns})</TabsTrigger>
            <TabsTrigger value="ai-assistant">
              <Sparkles className="h-4 w-4 mr-2" />
              AI Assistant
            </TabsTrigger>
            <TabsTrigger value="orders">My Orders ({userOrders.length})</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="designs">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">My Designs</h2>
                  <p className="text-gray-600 mt-1">
                    Your collection of AI-generated concepts and 3D aquascape designs
                  </p>
                </div>
                <div className="flex space-x-3">
                  {savedDesigns.length > 0 && (
                    <Button
                      variant="outline"
                      onClick={clearAllDesigns}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear AI ({savedDesigns.length})
                    </Button>
                  )}
                  <Link href="/configurator">
                    <Button variant="outline">
                      <Package className="h-4 w-4 mr-2" />
                      3D Designer
                    </Button>
                  </Link>
                  <Button onClick={() => setActiveTab('ai-assistant')}>
                    <Sparkles className="h-4 w-4 mr-2" />
                    AI Assistant
                  </Button>
                </div>
              </div>
              
              {totalDesigns === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mb-6">
                    <Sparkles className="h-12 w-12 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-3">No designs yet</h3>
                  <p className="text-gray-500 max-w-md leading-relaxed mb-6">
                    Start creating amazing aquarium designs! Use our AI assistant for instant concepts 
                    or the 3D configurator for detailed planning.
                  </p>
                  <div className="flex space-x-3">
                    <Button onClick={() => setActiveTab('ai-assistant')} size="lg">
                      <Sparkles className="h-5 w-5 mr-2" />
                      AI Assistant
                    </Button>
                    <Link href="/configurator">
                      <Button variant="outline" size="lg">
                        <Package className="h-5 w-5 mr-2" />
                        3D Designer
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* AI Generated Designs Section */}
                  {savedDesigns.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                          <Sparkles className="h-5 w-5 text-purple-500" />
                          AI Generated Concepts ({savedDesigns.length})
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setActiveTab('ai-assistant')}
                          className="text-purple-600 hover:text-purple-700"
                        >
                          Create More
                        </Button>
                      </div>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {savedDesigns.map((design) => (
                          <SavedDesignCard key={design.id} design={design} />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* 3D Configurator Designs Section */}
                  {configuratorDesigns.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                          <Package className="h-5 w-5 text-blue-500" />
                          3D Configurator Designs ({configuratorDesigns.length})
                        </h3>
                        <Link href="/configurator">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-700"
                          >
                            Create More
                          </Button>
                        </Link>
                      </div>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {configuratorDesigns.map((design) => (
                          <ConfiguratorDesignCard key={design.id} design={design} />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Loading state for configurator designs */}
                  {loadingConfigurator && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <Package className="h-5 w-5 text-blue-500" />
                        Loading 3D Designs...
                      </h3>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                          <Card key={i} className="animate-pulse">
                            <div className="aspect-video bg-gray-200 rounded-t-lg"></div>
                            <CardHeader>
                              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                              <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
                            </CardHeader>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="ai-assistant" className="h-full">
            <div className="space-y-6 h-full">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-purple-500" />
                    AI Aquarium Assistant
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Describe your dream aquarium and get AI-generated concepts to inspire your design
                  </p>
                </div>
              </div>
              
              <div className="h-full">
                <AquariumAIAssistant />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">My Orders</h2>
              
              {loadingOrders ? (
                <div className="flex justify-center items-center py-20">
                  <div className="flex flex-col items-center">
                    <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
                    <p className="text-gray-500">Loading your orders...</p>
                  </div>
                </div>
              ) : userOrders.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                  <p className="text-gray-500 mb-6">
                    You haven&apos;t placed any orders yet. Start by designing your aquarium and making a purchase.
                  </p>
                  <Button asChild>
                    <Link href="/shop">Browse Shop</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {userOrders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Manage your account settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <p className="text-sm text-gray-600 mt-1">
                      {session.user?.email}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Name</label>
                    <p className="text-sm text-gray-600 mt-1">
                      {session.user?.name || 'Not set'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Account Type</label>
                    <p className="text-sm text-gray-600 mt-1">
                      {(session.user as any)?.role || 'Standard User'}
                    </p>
                  </div>
                </div>
                
                <div className="border-t pt-6 mt-4">
                  <h3 className="font-medium mb-4">Account Statistics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <p className="text-2xl font-bold text-blue-600">{configuratorDesigns.length}</p>
                      <p className="text-sm text-gray-600">Designs</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <p className="text-2xl font-bold text-green-600">{userOrders.length}</p>
                      <p className="text-sm text-gray-600">Orders</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg text-center">
                      <p className="text-2xl font-bold text-purple-600">{savedDesigns.length}</p>
                      <p className="text-sm text-gray-600">AI Concepts</p>
                    </div>
                    <div className="bg-amber-50 p-4 rounded-lg text-center">
                      <p className="text-2xl font-bold text-amber-600">
                        {userOrders.reduce((total, order) => total + (order.totalAmount || 0), 0).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">Total Spent (৳)</p>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-6">
                  <h3 className="font-medium mb-4">Account Actions</h3>
                  <div className="flex space-x-4">
                    <Button variant="outline">Update Profile</Button>
                    <Button variant="outline" className="text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200">
                      Reset Password
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
