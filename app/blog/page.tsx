'use client'

import { useState } from 'react'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import Link from 'next/link'
import { 
  Droplets, 
  Search, 
  BookOpen, 
  User, 
  Calendar, 
  Clock, 
  ArrowLeft,
  ArrowRight,
  Tag,
  TrendingUp
} from 'lucide-react'

// Mock blog data
const mockBlogPosts = [
  {
    id: '1',
    title: 'The Complete Guide to Dutch Style Aquascaping',
    excerpt: 'Learn the fundamentals of Dutch aquascaping, from plant selection to maintenance routines that will keep your tank thriving.',
    content: '',
    author: 'Dr. Sarah Chen',
    authorBio: 'Marine Biologist and Aquascaping Expert',
    publishedAt: '2024-01-15T10:30:00Z',
    readTime: 8,
    category: 'Style Guides',
    tags: ['dutch', 'plants', 'advanced', 'maintenance'],
    featured: true,
    image: '/images/blog/dutch-guide.jpg'
  },
  {
    id: '2',
    title: '10 Common Beginner Mistakes in Aquascaping',
    excerpt: 'Avoid these pitfalls when starting your aquascaping journey. Learn from the most common mistakes new aquascapers make.',
    content: '',
    author: 'Mike Rodriguez',
    authorBio: 'Professional Aquascaper, 15+ years experience',
    publishedAt: '2024-01-12T14:20:00Z',
    readTime: 6,
    category: 'Beginner Tips',
    tags: ['beginner', 'mistakes', 'tips', 'setup'],
    featured: false,
    image: '/images/blog/beginner-mistakes.jpg'
  },
  {
    id: '3',
    title: 'Choosing the Right Lighting for Your Planted Tank',
    excerpt: 'Understanding the relationship between light intensity, spectrum, and plant growth for optimal aquascaping results.',
    content: '',
    author: 'Emma Thompson',
    authorBio: 'Lighting Specialist and Plant Enthusiast',
    publishedAt: '2024-01-10T09:15:00Z',
    readTime: 10,
    category: 'Equipment',
    tags: ['lighting', 'plants', 'equipment', 'technical'],
    featured: true,
    image: '/images/blog/lighting-guide.jpg'
  },
  {
    id: '4',
    title: 'Creating Natural Hardscapes with Dragon Stone',
    excerpt: 'Master the art of hardscaping with Dragon Stone. Learn composition techniques and placement strategies.',
    content: '',
    author: 'Takeshi Amano Jr.',
    authorBio: 'Hardscaping Artist and Designer',
    publishedAt: '2024-01-08T16:45:00Z',
    readTime: 7,
    category: 'Hardscaping',
    tags: ['hardscape', 'dragon-stone', 'composition', 'design'],
    featured: false,
    image: '/images/blog/dragon-stone.jpg'
  },
  {
    id: '5',
    title: 'Water Parameters: The Foundation of Success',
    excerpt: 'Understanding and maintaining proper water parameters is crucial for both plant health and fish welfare.',
    content: '',
    author: 'Dr. Lisa Park',
    authorBio: 'Aquatic Chemistry Specialist',
    publishedAt: '2024-01-05T11:30:00Z',
    readTime: 12,
    category: 'Water Chemistry',
    tags: ['water-parameters', 'chemistry', 'maintenance', 'health'],
    featured: true,
    image: '/images/blog/water-parameters.jpg'
  },
  {
    id: '6',
    title: 'Seasonal Maintenance Calendar for Aquascapers',
    excerpt: 'A comprehensive guide to year-round aquarium maintenance, with seasonal tips and schedules.',
    content: '',
    author: 'Carlos Silva',
    authorBio: 'Aquarium Maintenance Professional',
    publishedAt: '2024-01-03T13:20:00Z',
    readTime: 5,
    category: 'Maintenance',
    tags: ['maintenance', 'schedule', 'seasonal', 'care'],
    featured: false,
    image: '/images/blog/maintenance-calendar.jpg'
  }
]

const categories = [
  'All Posts',
  'Beginner Tips',
  'Style Guides', 
  'Equipment',
  'Hardscaping',
  'Water Chemistry',
  'Maintenance'
]

function BlogCard({ post }: { post: any }) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="relative">
        {/* Placeholder for blog post image */}
        <div className="aspect-video bg-gradient-to-br from-blue-100 via-green-100 to-cyan-100 flex items-center justify-center">
          <BookOpen className="h-12 w-12 text-gray-400" />
        </div>
        
        {/* Featured badge */}
        {post.featured && (
          <div className="absolute top-3 left-3 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium">
            Featured
          </div>
        )}
        
        {/* Category badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
          {post.category}
        </div>
      </div>
      
      <CardHeader className="pb-3">
        <CardTitle className="text-xl leading-tight group-hover:text-primary transition-colors">
          <Link href={`/blog/${post.id}`}>
            {post.title}
          </Link>
        </CardTitle>
        <p className="text-gray-600 line-clamp-2 mt-2">
          {post.excerpt}
        </p>
        
        {/* Author and meta info */}
        <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-gray-500" />
            </div>
            <div>
              <p className="font-medium text-gray-700">{post.author}</p>
              <p className="text-xs">{post.authorBio}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{post.readTime} min</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {post.tags.map((tag: string) => (
            <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function FeaturedPost({ post }: { post: any }) {
  return (
    <Card className="overflow-hidden bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
      <div className="grid md:grid-cols-2 gap-6 p-6">
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span className="text-primary font-medium text-sm">Featured Article</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            <Link href={`/blog/${post.id}`} className="hover:text-primary transition-colors">
              {post.title}
            </Link>
          </h2>
          <p className="text-gray-600 mb-4 line-clamp-3">
            {post.excerpt}
          </p>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
            <div className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{post.readTime} min read</span>
            </div>
          </div>
          
          <Link href={`/blog/${post.id}`}>
            <Button>
              Read Article
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
        
        <div className="relative">
          <div className="aspect-video bg-gradient-to-br from-blue-100 via-green-100 to-cyan-100 rounded-lg flex items-center justify-center">
            <BookOpen className="h-16 w-16 text-gray-400" />
          </div>
        </div>
      </div>
    </Card>
  )
}

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Posts')
  
  const featuredPosts = mockBlogPosts.filter(post => post.featured)
  
  const filteredPosts = mockBlogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'All Posts' || post.category === selectedCategory
    
    return matchesSearch && matchesCategory
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
                <BookOpen className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-semibold">AquaScaping Blog</h1>
              </div>
            </div>
            <Link href="/configurator">
              <Button>
                Start Designing
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Learn & Master Aquascaping
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Expert guides, tips, and tutorials to help you create stunning aquascapes. 
            From beginner basics to advanced techniques.
          </p>
        </div>

        {/* Featured Article */}
        {featuredPosts.length > 0 && (
          <div className="mb-12">
            <FeaturedPost post={featuredPosts[0]} />
          </div>
        )}

        {/* Search and Category Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search articles, topics, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full md:w-auto">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 w-full md:w-auto">
              {categories.map((category) => (
                <TabsTrigger key={category} value={category} className="text-xs">
                  {category.replace(' ', '\n')}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredPosts.length} of {mockBlogPosts.length} articles
            {searchQuery && (
              <span> for &ldquo;<strong>{searchQuery}</strong>&rdquo;</span>
            )}
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No articles found</h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your search or category filter to find more content.
            </p>
            <Button onClick={() => {
              setSearchQuery('')
              setSelectedCategory('All Posts')
            }}>
              Clear Filters
            </Button>
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="text-center mt-16 py-12 bg-white rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Stay Updated with New Content
          </h2>
          <p className="text-gray-600 mb-6">
            Get the latest aquascaping tips and tutorials delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input 
              placeholder="Enter your email address" 
              type="email"
              className="flex-1"
            />
            <Button>
              Subscribe
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            No spam, unsubscribe anytime. We respect your privacy.
          </p>
        </div>
      </div>
    </div>
  )
}
