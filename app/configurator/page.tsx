'use client'

import { Suspense, useState, useEffect } from 'react'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { ThreeDConfigurator } from '../../components/configurator/ThreeDConfigurator'
import { ObjectPreview } from '../../components/configurator/ObjectPreview'
import { ObjectControls } from '../../components/configurator/ObjectControls'
import { ModelGallery } from '../../components/configurator/ModelGallery'
import { SavedDesigns } from '../../components/configurator/SavedDesigns'
import { useConfiguratorStore } from '../../lib/stores/configurator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { Slider } from '../../components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { ErrorBoundary } from '../../components/ErrorBoundary'
import Link from 'next/link'
import { ArrowLeft, Save, Share, ShoppingCart, Grid3x3, Package } from 'lucide-react'
import { Vector3, Euler } from 'three'

// Mock product data - Updated with your new models
const mockProducts = {
  hardscape: [
    { id: '1', name: 'Dragon Stone', price: 2500, category: 'rocks' },
    { id: '2', name: 'Seiryu Stone', price: 3000, category: 'rocks' },
    { id: '4', name: 'Lava Rock', price: 2000, category: 'rocks' },
    { id: '5', name: 'Ohko Stone', price: 3500, category: 'rocks' },
    { id: '6', name: 'Petrified Wood', price: 4500, category: 'rocks' },
    { id: '19', name: 'Synthetic Rock', price: 2800, category: 'rocks' },
  ],
  wood: [
    { id: '3', name: 'Spider Wood', price: 4000, category: 'driftwood' },
    { id: '16', name: 'Driftwood', price: 3500, category: 'driftwood' },
    { id: '17', name: 'Drift Wood', price: 3800, category: 'driftwood' },
    { id: '20', name: 'Real Aquarium Wood', price: 5500, category: 'driftwood' },
  ],
  plants: [
    { id: '7', name: 'Anubias Nana', price: 1500, category: 'plants' },
    { id: '8', name: 'Java Moss', price: 1200, category: 'plants' },
    { id: '9', name: 'Amazon Sword', price: 1800, category: 'plants' },
    { id: '10', name: 'Java Fern', price: 1600, category: 'plants' },
    { id: '11', name: 'Cabomba', price: 1400, category: 'plants' },
  ],
  livestock: [
    { id: '12', name: 'Neon Tetra (6pk)', price: 2400, category: 'fish' },
    { id: '13', name: 'Betta Fish', price: 2500, category: 'fish' },
    { id: '14', name: 'Blue Betta', price: 2800, category: 'fish' },
    { id: '15', name: 'Goldfish', price: 1500, category: 'fish' },
  ],
  decoration: [
    { id: '18', name: 'Aquarium Vase', price: 4500, category: 'decoration' },
  ]
}

function TankConfiguration() {
  const { tankConfig, setTankConfig } = useConfiguratorStore()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tank Configuration</CardTitle>
        <CardDescription>Customize your aquarium specifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Glass Type</label>
          <Select 
            value={tankConfig.glassType} 
            onValueChange={(value: any) => setTankConfig({ glassType: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard Glass</SelectItem>
              <SelectItem value="low-iron">Low Iron Glass (+30%)</SelectItem>
              <SelectItem value="tempered">Tempered Glass (+50%)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Cabinet Color</label>
          <div className="flex space-x-2">
            {['#8B4513', '#2F4F4F', '#000000', '#FFFFFF'].map((color) => (
              <button
                key={color}
                className={`w-8 h-8 rounded border-2 ${
                  tankConfig.cabinetColor === color ? 'border-primary' : 'border-gray-300'
                }`}
                style={{ backgroundColor: color }}
                onClick={() => setTankConfig({ cabinetColor: color })}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ProductLibrary() {
  const [pendingItem, setPendingItemLocal] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Get all product names for suggestions
  const allProducts = [
    ...mockProducts.hardscape,
    ...mockProducts.wood,
    ...mockProducts.plants,
    ...mockProducts.livestock,
    ...mockProducts.decoration
  ]

  // Filter products based on search query
  const getFilteredProducts = (products: any[]) => {
    if (!searchQuery) return products
    return products.filter(product => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    
    if (query.length > 0) {
      const filteredSuggestions = allProducts
        .filter(product => product.name.toLowerCase().includes(query.toLowerCase()))
        .map(product => product.name)
        .slice(0, 5) // Limit to 5 suggestions
      setSuggestions(filteredSuggestions)
      setShowSuggestions(true)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion)
    setShowSuggestions(false)
  }

  const handleAddItem = (product: any) => {
    // Set pending item for click-to-place
    setPendingItemLocal(product)
    window.dispatchEvent(new CustomEvent('setPendingItem', { detail: product }))
  }

  const handleDragStart = (e: React.DragEvent, product: any) => {
    // Set the drag data
    e.dataTransfer.setData('application/json', JSON.stringify(product))
    e.dataTransfer.effectAllowed = 'copy'
    
    // Create a custom drag image showing only the item preview
    const dragPreview = document.createElement('div')
    dragPreview.style.width = '60px'
    dragPreview.style.height = '60px'
    dragPreview.style.background = '#f9fafb'
    dragPreview.style.border = '2px solid #3b82f6'
    dragPreview.style.borderRadius = '8px'
    dragPreview.style.display = 'flex'
    dragPreview.style.alignItems = 'center'
    dragPreview.style.justifyContent = 'center'
    dragPreview.style.fontSize = '24px'
    dragPreview.style.position = 'absolute'
    dragPreview.style.top = '-1000px'
    dragPreview.textContent = '📦'
    
    document.body.appendChild(dragPreview)
    e.dataTransfer.setDragImage(dragPreview, 30, 30)
    
    // Clean up the drag preview after a short delay
    setTimeout(() => {
      document.body.removeChild(dragPreview)
    }, 0)
  }

  const ProductItem = ({ product }: { product: any }) => {
    const [isDragging, setIsDragging] = useState(false)
    
    const handleProductDragStart = (e: React.DragEvent) => {
      handleDragStart(e, product)
      setIsDragging(true)
    }
    
    const handleDragEnd = () => {
      setIsDragging(false)
    }
    
    return (
      <div 
        key={product.id} 
        className={`flex items-center gap-3 p-3 border rounded cursor-grab active:cursor-grabbing transition-all hover:shadow-md ${
          pendingItem?.id === product.id ? 'border-primary bg-primary/5' : 'hover:border-gray-300'
        } ${isDragging ? 'opacity-50 scale-95' : ''}`}
        draggable
        onDragStart={handleProductDragStart}
        onDragEnd={handleDragEnd}
        title={`Drag to place ${product.name} in the aquarium`}
      >
        <div className="w-12 h-12 rounded overflow-hidden bg-gray-50 relative">
          <ObjectPreview
            productId={product.id}
            name={product.name}
            isSelected={pendingItem?.id === product.id}
          />
          {/* Drag handle icon */}
          <div className="absolute top-1 right-1 opacity-60">
            <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
            </svg>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm truncate">{product.name}</h4>
          <p className="text-xs text-gray-500">৳{product.price}</p>
        </div>
      </div>
    )
  }

  // Listen for clearing pending item
  useEffect(() => {
    const handleClearPending = () => {
      setPendingItemLocal(null)
    }
    
    window.addEventListener('clearPendingItem', handleClearPending)
    return () => window.removeEventListener('clearPendingItem', handleClearPending)
  }, [])

  return (
    <Tabs defaultValue="hardscape" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="hardscape">Rocks</TabsTrigger>
        <TabsTrigger value="wood">Wood</TabsTrigger>
        <TabsTrigger value="plants">Plants</TabsTrigger>
        <TabsTrigger value="livestock">Fish</TabsTrigger>
        <TabsTrigger value="decoration">Decor</TabsTrigger>
      </TabsList>
      
      <div className="mt-4">
        {/* Search Input */}
        <div className="relative mb-4">
          <Input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => searchQuery && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="w-full pr-8"
          />
          {/* Clear search button */}
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('')
                setShowSuggestions(false)
              }}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          )}
          {/* Search Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-40 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>

        {pendingItem && (
          <div className="mb-4 p-3 bg-primary/10 border border-primary rounded">
            <p className="text-sm font-medium text-primary">
              Click in the tank to place {pendingItem.name}
            </p>
            <p className="text-xs text-primary/70 mt-1">
              Or drag and drop items directly onto the 3D view
            </p>
          </div>
        )}
        
        <TabsContent value="hardscape" className="space-y-3 mt-0">
          {getFilteredProducts(mockProducts.hardscape).map((product) => (
            <ProductItem key={product.id} product={product} />
          ))}
          {getFilteredProducts(mockProducts.hardscape).length === 0 && (
            <p className="text-gray-500 text-sm text-center py-4">No rocks found matching your search.</p>
          )}
        </TabsContent>
        
        <TabsContent value="wood" className="space-y-3 mt-0">
          {getFilteredProducts(mockProducts.wood).map((product) => (
            <ProductItem key={product.id} product={product} />
          ))}
          {getFilteredProducts(mockProducts.wood).length === 0 && (
            <p className="text-gray-500 text-sm text-center py-4">No wood found matching your search.</p>
          )}
        </TabsContent>
        
        <TabsContent value="plants" className="space-y-3 mt-0">
          {getFilteredProducts(mockProducts.plants).map((product) => (
            <ProductItem key={product.id} product={product} />
          ))}
          {getFilteredProducts(mockProducts.plants).length === 0 && (
            <p className="text-gray-500 text-sm text-center py-4">No plants found matching your search.</p>
          )}
        </TabsContent>
        
        <TabsContent value="livestock" className="space-y-3 mt-0">
          {getFilteredProducts(mockProducts.livestock).map((product) => (
            <ProductItem key={product.id} product={product} />
          ))}
          {getFilteredProducts(mockProducts.livestock).length === 0 && (
            <p className="text-gray-500 text-sm text-center py-4">No fish found matching your search.</p>
          )}
        </TabsContent>

        <TabsContent value="decoration" className="space-y-3 mt-0">
          {getFilteredProducts(mockProducts.decoration).map((product) => (
            <ProductItem key={product.id} product={product} />
          ))}
          {getFilteredProducts(mockProducts.decoration).length === 0 && (
            <p className="text-gray-500 text-sm text-center py-4">No decorations found matching your search.</p>
          )}
        </TabsContent>
      </div>
    </Tabs>
  )
}

function PricingSummary() {
  const { totalPrice, items, removeItem, selectedItem, setSelectedItem, exportConfiguration } = useConfiguratorStore()
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  // Save design handler
  const handleSaveDesign = async () => {
    if (items.length === 0) {
      setSaveMessage('Please add some items to your design before saving')
      setTimeout(() => setSaveMessage(''), 3000)
      return
    }

    setIsSaving(true)
    setSaveMessage('')

    try {
      const configuration = exportConfiguration()
      
      // Prepare the design data for the API
      const designData = {
        name: `Aquascape Design ${new Date().toLocaleDateString()}`,
        description: `Custom aquarium design with ${items.length} items`,
        data: JSON.stringify(configuration),
        totalPrice: totalPrice,
        isPublic: false,
        items: items.map((item: any) => ({
          productId: item.productId,
          quantity: 1,
          position: JSON.stringify({
            x: item.position.x,
            y: item.position.y,
            z: item.position.z
          }),
          rotation: JSON.stringify({
            x: item.rotation.x,
            y: item.rotation.y,
            z: item.rotation.z
          }),
          scale: JSON.stringify({
            x: item.scale.x,
            y: item.scale.y,
            z: item.scale.z
          })
        }))
      }

      const response = await fetch('/api/designs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(designData)
      })

      if (response.ok) {
        const savedDesign = await response.json()
        setSaveMessage(`Design saved successfully! Design ID: ${savedDesign.id.slice(0, 8)}`)
        console.log('Design saved:', savedDesign)
      } else if (response.status === 401) {
        setSaveMessage('Please sign in to save your design')
      } else {
        throw new Error('Failed to save design')
      }
    } catch (error) {
      console.error('Error saving design:', error)
      setSaveMessage('Failed to save design. Please try again.')
    }

    setIsSaving(false)
    setTimeout(() => setSaveMessage(''), 5000)
  }

  return (
    <Card className="h-[700px] flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle>Pricing Summary</CardTitle>
        <CardDescription>Real-time pricing for your design</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Tank & Cabinet</span>
            <span>৳294000.00</span>
          </div>
          {items.map((item) => (
            <div 
              key={item.id} 
              className={`flex justify-between text-sm p-2 rounded cursor-pointer hover:bg-gray-50 ${
                selectedItem === item.id ? 'bg-primary/10 border border-primary' : ''
              }`}
              onClick={() => setSelectedItem(selectedItem === item.id ? null : item.id)}
            >
              <div className="flex-1">
                <span>{item.name}</span>
                {selectedItem === item.id && (
                  <div className="mt-1">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={(e) => {
                        e.stopPropagation()
                        removeItem(item.id)
                      }}
                      className="text-xs px-2 py-1 h-6"
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </div>
              <span>৳{item.price.toFixed(2)}</span>
            </div>
          ))}
          <hr />
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>৳{(294000 + items.reduce((sum, item) => sum + item.price, 0)).toFixed(2)}</span>
          </div>
        </div>
        
        <div className="mt-6 space-y-2">
          <Button className="w-full">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={handleSaveDesign}
              disabled={isSaving}
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save Design'}
            </Button>
            <Button variant="outline" className="flex-1">
              <Share className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
          
          {/* Save message display */}
          {saveMessage && (
            <div className={`mt-2 p-2 rounded text-sm ${
              saveMessage.includes('success') 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : saveMessage.includes('sign in')
                ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {saveMessage}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default function ConfiguratorPage() {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const [isSavedDesignsOpen, setIsSavedDesignsOpen] = useState(false)
  const [isTankConfigOpen, setIsTankConfigOpen] = useState(false)
  const [isObjectControlsOpen, setIsObjectControlsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  
  const { 
    items, 
    tankConfig, 
    totalPrice, 
    selectedItem, 
    addItem, 
    removeItem,
    updateItem,
    setTankConfig,
    setSelectedItem,
    exportConfiguration
  } = useConfiguratorStore()

  // Save design handler
  const handleSaveDesign = async () => {
    if (items.length === 0) {
      setSaveMessage('Please add some items to your design before saving')
      setTimeout(() => setSaveMessage(''), 3000)
      return
    }

    setIsSaving(true)
    setSaveMessage('')

    try {
      const configuration = exportConfiguration()
      
      // Prepare the design data for the API
      const designData = {
        name: `Aquascape Design ${new Date().toLocaleDateString()}`,
        description: `Custom aquarium design with ${items.length} items`,
        data: JSON.stringify(configuration),
        totalPrice: totalPrice,
        isPublic: false,
        items: items.map((item: any) => ({
          productId: item.productId,
          quantity: 1,
          position: JSON.stringify({
            x: item.position.x,
            y: item.position.y,
            z: item.position.z
          }),
          rotation: JSON.stringify({
            x: item.rotation.x,
            y: item.rotation.y,
            z: item.rotation.z
          }),
          scale: JSON.stringify({
            x: item.scale.x,
            y: item.scale.y,
            z: item.scale.z
          })
        }))
      }

      const response = await fetch('/api/designs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(designData)
      })

      if (response.ok) {
        const savedDesign = await response.json()
        setSaveMessage(`Design saved successfully! Design ID: ${savedDesign.id.slice(0, 8)}`)
        console.log('Design saved:', savedDesign)
      } else if (response.status === 401) {
        setSaveMessage('Please sign in to save your design')
      } else {
        throw new Error('Failed to save design')
      }
    } catch (error) {
      console.error('Error saving design:', error)
      setSaveMessage('Failed to save design. Please try again.')
    }

    setIsSaving(false)
    setTimeout(() => setSaveMessage(''), 5000)
  }

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
              <h1 className="text-xl font-semibold">Aquarium Designer</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSavedDesignsOpen(true)}
              >
                <Package className="mr-2 h-4 w-4" />
                My Designs
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsTankConfigOpen(!isTankConfigOpen)}
              >
                Tank Size
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsGalleryOpen(true)}
              >
                <Grid3x3 className="mr-2 h-4 w-4" />
                Gallery
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsObjectControlsOpen(!isObjectControlsOpen)}
              >
                Controls
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSaveDesign}
              >
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
              <Button size="sm">Preview AR</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Save Message */}
      {saveMessage && (
        <div className="bg-blue-50 border-b border-blue-200 px-4 py-3">
          <div className="container mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm text-blue-700 font-medium">{saveMessage}</span>
              </div>
              <button
                onClick={() => setSaveMessage('')}
                className="text-blue-700 hover:text-blue-900"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Products */}
          <div className="lg:col-span-1">
            <Card className="h-[700px] flex flex-col">
              <CardHeader className="flex-shrink-0">
                <CardTitle>Product Library</CardTitle>
                <CardDescription>Drag items to your aquarium</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto">
                <ProductLibrary />
              </CardContent>
            </Card>
          </div>

          {/* Center - 3D Configurator */}
          <div className="lg:col-span-2">
            <Card className="h-[700px]">
              <CardContent className="p-0 h-full">
                <ErrorBoundary>
                  <Suspense fallback={<div className="flex items-center justify-center h-full">Loading...</div>}>
                    <ThreeDConfigurator />
                  </Suspense>
                </ErrorBoundary>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - Pricing */}
          <div className="lg:col-span-1">
            <PricingSummary />
          </div>
        </div>
      </div>

      {/* Modals */}
      <ModelGallery isOpen={isGalleryOpen} onClose={() => setIsGalleryOpen(false)} />
      <SavedDesigns 
        isOpen={isSavedDesignsOpen} 
        onClose={() => setIsSavedDesignsOpen(false)}
        onLoadDesign={(design) => {
          console.log('Design loaded:', design.name)
        }}
      />
      
      {/* Tank Configuration Modal */}
      {isTankConfigOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <Card className="w-full max-w-md m-4">
            <CardHeader>
              <CardTitle>Tank Configuration</CardTitle>
              <CardDescription>Customize your aquarium dimensions and style</CardDescription>
              <button
                onClick={() => setIsTankConfigOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Width (cm)</label>
                <Input
                  type="number"
                  value={tankConfig.width}
                  onChange={(e) => setTankConfig({ width: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Height (cm)</label>
                <Input
                  type="number"
                  value={tankConfig.height}
                  onChange={(e) => setTankConfig({ height: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Depth (cm)</label>
                <Input
                  type="number"
                  value={tankConfig.depth}
                  onChange={(e) => setTankConfig({ depth: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Glass Type</label>
                <Select
                  value={tankConfig.glassType}
                  onValueChange={(value) => setTankConfig({ glassType: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="low-iron">Low Iron (+30%)</SelectItem>
                    <SelectItem value="tempered">Tempered (+50%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Cabinet Color</label>
                <div className="flex gap-2 mt-2">
                  {['#8B4513', '#654321', '#2F1B14', '#000000'].map((color) => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded border-2 ${
                        tankConfig.cabinetColor === color ? 'border-primary' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setTankConfig({ cabinetColor: color })}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Object Controls Modal */}
      {isObjectControlsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <Card className="w-full max-w-md m-4">
            <CardHeader>
              <CardTitle>Object Controls</CardTitle>
              <CardDescription>Fine-tune selected objects</CardDescription>
              <button
                onClick={() => setIsObjectControlsOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </CardHeader>
            <CardContent>
              <ObjectControls />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
