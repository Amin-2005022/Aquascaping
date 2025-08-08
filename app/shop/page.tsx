'use client'

import { useState } from 'react'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import Link from 'next/link'
import { 
  Search, 
  Filter, 
  ShoppingCart, 
  Heart, 
  Star, 
  ArrowLeft,
  Grid,
  List,
  Package,
  Leaf,
  Mountain,
  Lightbulb
} from 'lucide-react'

// Mock product data
const mockProducts = [
  {
    id: '1',
    name: 'Dragon Stone Medium',
    description: 'Natural limestone formation perfect for creating dramatic hardscapes',
    price: 24.99,
    originalPrice: 29.99,
    image: '/images/products/dragon-stone.jpg',
    category: 'Hardscape',
    subcategory: 'Stones',
    rating: 4.8,
    reviews: 124,
    inStock: true,
    tags: ['natural', 'hardscape', 'popular'],
    featured: true
  },
  {
    id: '2',
    name: 'Java Moss',
    description: 'Hardy aquatic moss perfect for beginners and natural aquascaping',
    price: 12.99,
    originalPrice: null,
    image: '/images/products/java-moss.jpg',
    category: 'Plants',
    subcategory: 'Mosses',
    rating: 4.6,
    reviews: 89,
    inStock: true,
    tags: ['beginner', 'moss', 'easy-care'],
    featured: false
  },
  {
    id: '3',
    name: 'LED Aquarium Light Pro',
    description: 'Full spectrum LED lighting system with programmable timer',
    price: 149.99,
    originalPrice: 179.99,
    image: '/images/products/led-light.jpg',
    category: 'Equipment',
    subcategory: 'Lighting',
    rating: 4.9,
    reviews: 203,
    inStock: true,
    tags: ['led', 'programmable', 'full-spectrum'],
    featured: true
  },
  {
    id: '4',
    name: 'Driftwood Spider Wood',
    description: 'Unique spider wood piece perfect for creating natural aquascapes',
    price: 34.99,
    originalPrice: null,
    image: '/images/products/spider-wood.jpg',
    category: 'Hardscape',
    subcategory: 'Driftwood',
    rating: 4.7,
    reviews: 67,
    inStock: false,
    tags: ['driftwood', 'unique', 'natural'],
    featured: false
  },
  {
    id: '5',
    name: 'Aquascaping Substrate',
    description: 'Premium nutrient-rich substrate for planted aquariums',
    price: 39.99,
    originalPrice: 44.99,
    image: '/images/products/substrate.jpg',
    category: 'Substrate',
    subcategory: 'Planted',
    rating: 4.5,
    reviews: 156,
    inStock: true,
    tags: ['nutrient-rich', 'planted', 'premium'],
    featured: false
  },
  {
    id: '6',
    name: 'Anubias Nana',
    description: 'Popular slow-growing plant perfect for low-light aquariums',
    price: 18.99,
    originalPrice: null,
    image: '/images/products/anubias.jpg',
    category: 'Plants',
    subcategory: 'Anubias',
    rating: 4.8,
    reviews: 198,
    inStock: true,
    tags: ['low-light', 'slow-growing', 'popular'],
    featured: true
  }
]

const categories = [
  { id: 'all', name: 'All Products', icon: Package },
  { id: 'plants', name: 'Plants', icon: Leaf },
  { id: 'hardscape', name: 'Hardscape', icon: Mountain },
  { id: 'equipment', name: 'Equipment', icon: Lightbulb },
  { id: 'substrate', name: 'Substrate', icon: Package }
]

function ProductCard({ product, viewMode }: { product: any, viewMode: 'grid' | 'list' }) {
  const [isWishlisted, setIsWishlisted] = useState(false)

  if (viewMode === 'list') {
    return (
      <Card className="hover:shadow-lg transition-shadow">
        <div className="flex">
          <div className="w-48 h-48 bg-gradient-to-br from-blue-100 via-green-100 to-cyan-100 flex items-center justify-center">
            <Package className="h-12 w-12 text-gray-400" />
          </div>
          <div className="flex-1 p-6">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                <p className="text-gray-600 text-sm">{product.category} • {product.subcategory}</p>
              </div>
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`p-2 rounded-full hover:bg-gray-100 ${
                  isWishlisted ? 'text-red-500' : 'text-gray-400'
                }`}
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>
            
            <p className="text-gray-600 mb-3 line-clamp-2">{product.description}</p>
            
            <div className="flex items-center space-x-2 mb-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating) 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-primary">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-500 line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="relative">
        <div className="aspect-square bg-gradient-to-br from-blue-100 via-green-100 to-cyan-100 flex items-center justify-center">
          <Package className="h-12 w-12 text-gray-400" />
        </div>
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col space-y-1">
          {product.featured && (
            <span className="bg-primary text-white px-2 py-1 rounded text-xs font-medium">
              Featured
            </span>
          )}
          {product.originalPrice && (
            <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
              Sale
            </span>
          )}
        </div>
        
        {/* Wishlist button */}
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className={`absolute top-2 right-2 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors ${
            isWishlisted ? 'text-red-500' : 'text-gray-600'
          }`}
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>
        
        {/* Stock status */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              Out of Stock
            </span>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
          <p className="text-xs text-gray-500">{product.category} • {product.subcategory}</p>
        </div>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center space-x-2 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(product.rating) 
                    ? 'text-yellow-400 fill-current' 
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">
            {product.rating} ({product.reviews})
          </span>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1">
            <span className="text-lg font-bold text-primary">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
        </div>
        
        <Button
          className="w-full"
          size="sm"
          disabled={!product.inStock}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </CardContent>
    </Card>
  )
}

export default function ShopPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('featured')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  
  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || 
                           product.category.toLowerCase() === selectedCategory
    
    return matchesSearch && matchesCategory
  })
  
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'rating':
        return b.rating - a.rating
      case 'name':
        return a.name.localeCompare(b.name)
      default: // featured
        return b.featured ? 1 : -1
    }
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
                <Package className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-semibold">Shop</h1>
              </div>
            </div>
            <Link href="/cart">
              <Button>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Cart (0)
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Premium Aquascaping Supplies
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to create stunning aquascapes. From natural hardscape materials 
            to cutting-edge equipment and healthy aquatic plants.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search products, categories, or brands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
          <TabsList className="grid grid-cols-5 w-full max-w-2xl mx-auto">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <TabsTrigger key={category.id} value={category.id} className="flex items-center space-x-2">
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{category.name}</span>
                </TabsTrigger>
              )
            })}
          </TabsList>
        </Tabs>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Showing {sortedProducts.length} of {mockProducts.length} products
            {searchQuery && (
              <span> for &ldquo;<strong>{searchQuery}</strong>&rdquo;</span>
            )}
          </p>
        </div>

        {/* Products Grid/List */}
        <div className={
          viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
        }>
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} viewMode={viewMode} />
          ))}
        </div>

        {/* Empty State */}
        {sortedProducts.length === 0 && (
          <div className="text-center py-16">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your search or filters to find what you&apos;re looking for.
            </p>
            <Button onClick={() => {
              setSearchQuery('')
              setSelectedCategory('all')
            }}>
              Clear Filters
            </Button>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-16 py-12 bg-white rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Need Help Choosing Products?
          </h2>
          <p className="text-gray-600 mb-6">
            Use our 3D configurator to visualize your aquascape and get personalized product recommendations.
          </p>
          <Link href="/configurator">
            <Button size="lg">
              Try Our 3D Designer
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
