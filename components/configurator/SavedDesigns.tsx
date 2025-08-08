'use client'

import { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { useConfiguratorStore } from '../../lib/stores/configurator'
import { Trash2, Edit, Eye, Calendar, Package } from 'lucide-react'
import { DesignPreview, DesignPreviewFallback } from './DesignPreview'

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

interface SavedDesignsProps {
  isOpen: boolean
  onClose: () => void
  onLoadDesign?: (design: SavedDesign) => void
}

export function SavedDesigns({ isOpen, onClose, onLoadDesign }: SavedDesignsProps) {
  const [designs, setDesigns] = useState<SavedDesign[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const { loadConfiguration, clearConfiguration } = useConfiguratorStore()

  // Fetch saved designs
  const fetchDesigns = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/designs')
      if (!response.ok) {
        throw new Error('Failed to fetch designs')
      }
      const data = await response.json()
      setDesigns(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load designs')
    } finally {
      setLoading(false)
    }
  }

  // Delete a design
  const deleteDesign = async (designId: string) => {
    try {
      const response = await fetch(`/api/designs/${designId}`, {
        method: 'DELETE'
      })
      if (!response.ok) {
        throw new Error('Failed to delete design')
      }
      // Refresh the list
      fetchDesigns()
      setDeleteConfirm(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete design')
    }
  }

  // Load a design for editing
  const handleLoadDesign = async (design: SavedDesign) => {
    try {
      // Parse the design data
      const designData = JSON.parse(design.data)
      
      // Convert the design format to configurator format
      const configuratorData = {
        items: design.items.map(item => ({
          id: item.id,
          productId: item.productId,
          name: item.product.name,
          price: item.product.price,
          position: item.position ? JSON.parse(item.position) : { x: 0, y: 1, z: 0 },
          rotation: item.rotation ? JSON.parse(item.rotation) : { x: 0, y: 0, z: 0 },
          scale: item.scale ? JSON.parse(item.scale) : { x: 1, y: 1, z: 1 }
        })),
        tankConfig: designData.tankConfig || {
          width: 60,
          height: 40,
          depth: 35,
          glassType: 'standard',
          cabinetColor: '#8B4513'
        }
      }
      
      // Load the configuration
      loadConfiguration(configuratorData)
      
      // Call the callback if provided
      if (onLoadDesign) {
        onLoadDesign(design)
      }
      
      // Close the modal
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load design')
    }
  }

  // Filter designs based on search query
  const filteredDesigns = designs.filter(design =>
    design.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (design.description && design.description.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Format currency
  const formatPrice = (price: number) => {
    return `$${(price / 100).toFixed(2)}`
  }

  useEffect(() => {
    if (isOpen) {
      fetchDesigns()
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full h-[90vh] flex flex-col overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-200 p-6 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">My Saved Designs</h2>
              <p className="text-sm text-gray-600">Load and edit your aquarium designs</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white shadow-md hover:shadow-lg hover:bg-gray-50 transition-all duration-200 flex items-center justify-center text-gray-500 hover:text-gray-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search and Actions */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <Input
                type="text"
                placeholder="Search designs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 text-sm border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <Button
              onClick={() => {
                clearConfiguration()
                onClose()
              }}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>New Design</span>
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading your designs...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Error Loading Designs</h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <Button onClick={fetchDesigns} variant="outline">
                  Try Again
                </Button>
              </div>
            </div>
          ) : filteredDesigns.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  {searchQuery ? 'No matching designs' : 'No saved designs'}
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchQuery 
                    ? `No designs match "${searchQuery}". Try a different search term.`
                    : 'Start creating your first aquarium design!'
                  }
                </p>
                <Button
                  onClick={() => {
                    clearConfiguration()
                    onClose()
                  }}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  Create New Design
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-6 overflow-y-auto h-full">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDesigns.map((design) => (
                  <Card key={design.id} className="hover:shadow-xl transition-all duration-300 border-gray-200 hover:border-purple-300 overflow-hidden">
                    {/* 3D Preview */}
                    <div className="relative">
                      <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-purple-50 overflow-hidden">
                        <DesignPreview 
                          items={design.items}
                          className="w-full h-full"
                          width={300}
                          height={200}
                        />
                      </div>
                      {/* Overlay with action when hovered */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Button
                          onClick={() => handleLoadDesign(design)}
                          className="bg-white/90 hover:bg-white text-gray-800 backdrop-blur-sm"
                          size="sm"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Open Design
                        </Button>
                      </div>
                      
                      {/* Price badge */}
                      <div className="absolute top-3 left-3">
                        <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-semibold text-purple-600">
                          {formatPrice(design.totalPrice)}
                        </div>
                      </div>
                      
                      {/* Items count */}
                      <div className="absolute top-3 right-3">
                        <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700">
                          {design.items.length} items
                        </div>
                      </div>
                    </div>
                    
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg font-bold text-gray-800 line-clamp-1">
                            {design.name}
                          </CardTitle>
                          {design.description && (
                            <CardDescription className="mt-1 line-clamp-2">
                              {design.description}
                            </CardDescription>
                          )}
                        </div>
                        <div className="flex items-center space-x-1 ml-2">
                          <button
                            onClick={() => setDeleteConfirm(design.id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete design"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-1 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(design.updatedAt)}</span>
                          </div>
                        </div>
                        
                        {/* Items preview */}
                        <div className="text-sm text-gray-600">
                          <p className="font-medium mb-1">Components:</p>
                          <div className="flex flex-wrap gap-1">
                            {design.items.slice(0, 3).map((item, index) => (
                              <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                {item.product.name}
                              </span>
                            ))}
                            {design.items.length > 3 && (
                              <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded text-xs">
                                +{design.items.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex space-x-2 pt-2">
                          <Button
                            onClick={() => handleLoadDesign(design)}
                            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-sm"
                            size="sm"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit Design
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4 z-10">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Delete Design</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this design? This action cannot be undone.
                </p>
                <div className="flex space-x-3">
                  <Button
                    onClick={() => setDeleteConfirm(null)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => deleteDesign(deleteConfirm)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
