'use client'

import { useState } from 'react'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import Link from 'next/link'
import { 
  Droplets, 
  Search, 
  Filter, 
  Heart, 
  Eye, 
  User, 
  ArrowLeft,
  Palette,
  DollarSign
} from 'lucide-react'

// Mock gallery data
const mockGalleryDesigns = [
  {
    id: '1',
    name: 'Tropical Paradise',
    description: 'A lush planted tank with natural hardscape featuring Dragon Stone and various aquatic plants',
    thumbnail: '/images/gallery/tropical-paradise.jpg',
    totalPrice: 299.99,
    author: 'Alex Chen',
    authorAvatar: '/images/avatars/alex.jpg',
    likes: 245,
    views: 1420,
    tags: ['tropical', 'planted', 'beginner-friendly'],
    createdAt: '2024-01-15T10:30:00Z',
    featured: true
  },
  {
    id: '2',
    name: 'Zen Garden',
    description: 'Minimalist Japanese-inspired design with Seiryu stone and moss carpet',
    thumbnail: '/images/gallery/zen-garden.jpg',
    totalPrice: 185.50,
    author: 'Sarah Johnson',
    authorAvatar: '/images/avatars/sarah.jpg',
    likes: 189,
    views: 980,
    tags: ['minimalist', 'japanese', 'zen'],
    createdAt: '2024-01-12T14:20:00Z',
    featured: false
  },
  {
    id: '3',
    name: 'Dutch Style Masterpiece',
    description: 'Traditional Dutch aquascape with colorful stem plants and terraced layout',
    thumbnail: '/images/gallery/dutch-style.jpg',
    totalPrice: 425.75,
    author: 'Mike Schmidt',
    authorAvatar: '/images/avatars/mike.jpg',
    likes: 312,
    views: 2150,
    tags: ['dutch', 'advanced', 'colorful'],
    createdAt: '2024-01-10T09:15:00Z',
    featured: true
  },
  {
    id: '4',
    name: 'Iwagumi Serenity',
    description: 'Classic Iwagumi layout with perfect stone placement and carpet plants',
    thumbnail: '/images/gallery/iwagumi.jpg',
    totalPrice: 215.99,
    author: 'Emma Wilson',
    authorAvatar: '/images/avatars/emma.jpg',
    likes: 198,
    views: 1340,
    tags: ['iwagumi', 'classic', 'peaceful'],
    createdAt: '2024-01-08T16:45:00Z',
    featured: false
  },
  {
    id: '5',
    name: 'Amazon Biotope',
    description: 'Natural biotope recreating an Amazon river environment with authentic decor',
    thumbnail: '/images/gallery/amazon.jpg',
    totalPrice: 380.25,
    author: 'Carlos Rodriguez',
    authorAvatar: '/images/avatars/carlos.jpg',
    likes: 267,
    views: 1890,
    tags: ['biotope', 'amazon', 'natural'],
    createdAt: '2024-01-05T11:30:00Z',
    featured: true
  },
  {
    id: '6',
    name: 'Nano Paradise',
    description: 'Stunning nano tank design proving that small can be beautiful',
    thumbnail: '/images/gallery/nano.jpg',
    totalPrice: 125.50,
    author: 'Lisa Park',
    authorAvatar: '/images/avatars/lisa.jpg',
    likes: 156,
    views: 890,
    tags: ['nano', 'small', 'budget-friendly'],
    createdAt: '2024-01-03T13:20:00Z',
    featured: false
  }
]

function GalleryCard({ design, onLike }: { design: any, onLike: (id: string) => void }) {
  const [isLiked, setIsLiked] = useState(false)

  const handleLike = () => {
    setIsLiked(!isLiked)
    onLike(design.id)
  }

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="relative">
        {/* Placeholder for design thumbnail */}
        <div className="aspect-video bg-gradient-to-br from-blue-100 via-green-100 to-cyan-100 flex items-center justify-center">
          <Palette className="h-12 w-12 text-gray-400" />
        </div>
        
        {/* Featured badge */}
        {design.featured && (
          <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium">
            Featured
          </div>
        )}
        
        {/* Overlay with actions */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex space-x-2">
            <Button size="sm" variant="secondary">
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            <Link href={`/configurator?template=${design.id}`}>
              <Button size="sm">
                <Palette className="h-4 w-4 mr-1" />
                Remix
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg leading-tight">{design.name}</CardTitle>
            <CardDescription className="line-clamp-2 mt-1">
              {design.description}
            </CardDescription>
          </div>
        </div>
        
        {/* Author info */}
        <div className="flex items-center space-x-2 mt-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-gray-500" />
          </div>
          <div>
            <p className="text-sm font-medium">{design.author}</p>
            <p className="text-xs text-gray-500">
              {new Date(design.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {design.tags.map((tag: string) => (
            <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              #{tag}
            </span>
          ))}
        </div>
        
        {/* Stats and price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <button 
              className={`flex items-center space-x-1 hover:text-red-500 transition-colors ${
                isLiked ? 'text-red-500' : ''
              }`}
              onClick={handleLike}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
              <span>{design.likes + (isLiked ? 1 : 0)}</span>
            </button>
            <div className="flex items-center space-x-1">
              <Eye className="h-4 w-4" />
              <span>{design.views}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1 text-primary font-semibold">
            <DollarSign className="h-4 w-4" />
            <span>{design.totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function GalleryPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  
  const handleLike = (designId: string) => {
    // In a real app, this would make an API call
    console.log('Liked design:', designId)
  }

  const filteredDesigns = mockGalleryDesigns.filter(design => {
    const matchesSearch = design.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         design.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         design.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    if (selectedFilter === 'all') return matchesSearch
    if (selectedFilter === 'featured') return matchesSearch && design.featured
    if (selectedFilter === 'recent') return matchesSearch
    
    return matchesSearch && design.tags.includes(selectedFilter)
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Home</span>
              </Link>
              <div className="flex items-center space-x-2">
                <Droplets className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-semibold">Design Gallery</h1>
              </div>
            </div>
            <Link href="/configurator">
              <Button>
                <Palette className="h-4 w-4 mr-2" />
                Create Your Own
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Community Design Gallery
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover stunning aquascapes created by our community. Get inspired, learn new techniques, 
            and find the perfect design to remix for your own tank.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search designs, tags, or authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Tabs value={selectedFilter} onValueChange={setSelectedFilter} className="w-full md:w-auto">
            <TabsList className="grid grid-cols-2 md:grid-cols-6 w-full md:w-auto">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="featured">Featured</TabsTrigger>
              <TabsTrigger value="tropical">Tropical</TabsTrigger>
              <TabsTrigger value="minimalist">Minimal</TabsTrigger>
              <TabsTrigger value="dutch">Dutch</TabsTrigger>
              <TabsTrigger value="iwagumi">Iwagumi</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredDesigns.length} of {mockGalleryDesigns.length} designs
            {searchQuery && (
              <span> for &ldquo;<strong>{searchQuery}</strong>&rdquo;</span>
            )}
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDesigns.map((design) => (
            <GalleryCard key={design.id} design={design} onLike={handleLike} />
          ))}
        </div>

        {/* Empty State */}
        {filteredDesigns.length === 0 && (
          <div className="text-center py-16">
            <Palette className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No designs found</h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your search or filters to find more designs.
            </p>
            <Link href="/configurator">
              <Button>
                Create the First Design
              </Button>
            </Link>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-16 py-12 bg-white rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Create Your Own?
          </h2>
          <p className="text-gray-600 mb-6">
            Use our 3D designer to bring your aquascaping vision to life.
          </p>
          <Link href="/configurator">
            <Button size="lg">
              <Palette className="h-5 w-5 mr-2" />
              Start Designing
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
