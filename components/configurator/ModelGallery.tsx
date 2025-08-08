'use client'

import { useState, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Vector3, Euler } from 'three'
import { ModelLoader } from './ModelLoader'
import { useConfiguratorStore } from '../../lib/stores/configurator'
import { Input } from '../ui/input'

// Model categories with all available models
const ModelCategories = {
  hardscape: {
    name: 'Hardscape (Rocks)',
    models: [
      { id: '1', name: 'Dragon Stone', modelId: 'dragon-stone' },
      { id: '2', name: 'Seiryu Stone', modelId: 'seiryu-stone' },
      { id: '4', name: 'Lava Rock', modelId: 'lava-rock' },
      { id: '5', name: 'Ohko Stone', modelId: 'ohko-stone' },
      { id: '6', name: 'Petrified Wood', modelId: 'petrified-wood' },
      { id: '19', name: 'Synthetic Rock', modelId: 'synthetic-rock' },
      { id: 'ruined-rock', name: 'Ruined Rock', modelId: 'ruined-rock' }
    ]
  },
  wood: {
    name: 'Wood & Driftwood',
    models: [
      { id: '3', name: 'Spider Wood', modelId: 'spider-wood' },
      { id: '16', name: 'Driftwood', modelId: 'driftwood' },
      { id: '17', name: 'Drift Wood', modelId: 'drift-wood' },
      { id: 'driftwood-trunk', name: 'Driftwood Trunk', modelId: 'driftwood-trunk' },
      { id: '20', name: 'Real Aquarium Wood', modelId: 'aquarium-wood' },
      { id: 'drift-wood-dee', name: 'Drift Wood (Dee Why)', modelId: 'drift-wood-dee' }
    ]
  },
  plants: {
    name: 'Aquatic Plants',
    models: [
      { id: '7', name: 'Anubias Nana', modelId: 'anubias-nana' },
      { id: '8', name: 'Java Moss', modelId: 'java-moss' },
      { id: '9', name: 'Amazon Sword', modelId: 'amazon-sword' },
      { id: '10', name: 'Java Fern', modelId: 'java-fern' },
      { id: '11', name: 'Cabomba', modelId: 'cabomba' }
    ]
  },
  livestock: {
    name: 'Fish & Livestock',
    models: [
      { id: '12', name: 'Neon Tetra', modelId: 'neon-tetra' },
      { id: '13', name: 'Betta Fish', modelId: 'betta' },
      { id: '14', name: 'Blue Betta', modelId: 'blue-betta' },
      { id: '15', name: 'Goldfish', modelId: 'goldfish' }
    ]
  },
  decoration: {
    name: 'Decorations',
    models: [
      { id: '18', name: 'Aquarium Vase', modelId: 'aquarium-vase' }
    ]
  }
}

interface ModelPreviewProps {
  model: { id: string; name: string; modelId: string }
  onAddToTank: (model: any) => void
}

function ModelPreview({ model, onAddToTank }: ModelPreviewProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div 
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] border border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 3D Preview */}
      <div className="h-56 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <Canvas 
          camera={{ position: [3, 3, 3], fov: 45 }}
          onCreated={() => setIsLoading(false)}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 5]} intensity={1.2} />
          <directionalLight position={[-5, 5, -5]} intensity={0.4} />
          <Suspense fallback={null}>
            <ModelLoader
              productId={model.id}
              position={[0, 0, 0]}
              rotation={[0, 0, 0]}
              scale={[1, 1, 1]}
              isSelected={false}
            />
          </Suspense>
          <OrbitControls 
            enablePan={false} 
            enableZoom={true} 
            autoRotate={true}
            autoRotateSpeed={isHovered ? 4 : 2}
            minDistance={2}
            maxDistance={8}
          />
        </Canvas>
        
        {/* Overlay Info */}
        <div className={`absolute top-3 left-3 transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-70'}`}>
          <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 text-xs font-medium text-gray-700">
            ID: {model.id}
          </div>
        </div>
        
        {/* Quick Action Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute bottom-3 left-3 right-3">
            <div className="text-white text-sm font-medium mb-2 opacity-90">
              Click and drag to rotate
            </div>
          </div>
        </div>
      </div>
      
      {/* Model Info */}
      <div className="p-5">
        <div className="mb-4">
          <h3 className="font-bold text-gray-800 mb-1 text-lg leading-tight">{model.name}</h3>
        </div>
        
        <button
          onClick={() => onAddToTank(model)}
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Add to Tank</span>
        </button>
      </div>
    </div>
  )
}

export function ModelGallery({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [selectedCategory, setSelectedCategory] = useState<string>('hardscape')
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const { addItem } = useConfiguratorStore()

  // Get all models for search functionality
  const allModels = Object.values(ModelCategories).flatMap(category => category.models)

  // Filter models based on search query
  const getFilteredModels = () => {
    if (!searchQuery) {
      return ModelCategories[selectedCategory as keyof typeof ModelCategories]?.models || []
    }
    
    // If searching, show results from all categories
    return allModels.filter(model => 
      model.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    
    if (query.length > 0) {
      const filteredSuggestions = allModels
        .filter(model => model.name.toLowerCase().includes(query.toLowerCase()))
        .map(model => model.name)
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

  const handleAddToTank = (model: any) => {
    try {
      // Add the model to the configurator store
      addItem({
        productId: model.id,
        name: model.name,
        price: 0,
        position: new Vector3(
          (Math.random() - 0.5) * 10, // Random X position
          1, // Y position above ground - increased from 0.5 to 1
          (Math.random() - 0.5) * 8   // Random Z position
        ),
        rotation: new Euler(0, Math.random() * Math.PI * 2, 0), // Random Y rotation
        scale: new Vector3(1, 1, 1)
      })
      
      console.log(`${model.name} added to aquarium successfully`)
      
      // Close the gallery after adding the item
      onClose()
    } catch (error) {
      console.error('Error adding item to tank:', error)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full h-[90vh] flex flex-col overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-gray-200 p-6 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Model Gallery</h2>
              <p className="text-sm text-gray-600">Choose from our collection of 3D aquarium models</p>
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

        <div className="flex flex-1 overflow-hidden">
          {/* Category Sidebar */}
          <div className="w-72 bg-gradient-to-b from-gray-50 to-white border-r border-gray-200 flex flex-col">
            <div className="p-6">
              <h3 className="font-bold text-gray-800 mb-4 text-lg">Categories</h3>
              
              {/* Search Input */}
              <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <Input
                  type="text"
                  placeholder="Search models..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => searchQuery && setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="w-full pl-10 pr-10 py-3 text-sm border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                />
                {/* Clear search button */}
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('')
                      setShowSuggestions(false)
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                {/* Search Suggestions */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-xl z-10 max-h-40 overflow-y-auto mt-2">
                    {suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="px-4 py-3 hover:bg-blue-50 cursor-pointer text-sm first:rounded-t-xl last:rounded-b-xl transition-colors"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Categories List */}
            <div className="flex-1 px-6 pb-6 space-y-2 overflow-y-auto">
              {Object.entries(ModelCategories).map(([key, category]) => (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedCategory(key)
                    setSearchQuery('') // Clear search when switching categories
                    setShowSuggestions(false)
                  }}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-200 group ${
                    selectedCategory === key && !searchQuery
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg transform scale-[1.02]'
                      : 'text-gray-700 hover:bg-white hover:shadow-md border border-transparent hover:border-gray-200'
                  }`}
                  disabled={!!searchQuery} // Disable category selection when searching
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className={`font-semibold ${selectedCategory === key && !searchQuery ? 'text-white' : 'text-gray-800'}`}>
                        {category.name}
                      </div>
                      <div className={`text-sm ${selectedCategory === key && !searchQuery ? 'text-blue-100' : 'text-gray-500'}`}>
                        {category.models.length} models
                      </div>
                    </div>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      selectedCategory === key && !searchQuery 
                        ? 'bg-white/20' 
                        : 'bg-gray-100 group-hover:bg-gray-200'
                    }`}>
                      <span className={`text-sm font-bold ${
                        selectedCategory === key && !searchQuery ? 'text-white' : 'text-gray-600'
                      }`}>
                        {category.models.length}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Models Grid */}
          <div className="flex-1 bg-gray-50 flex flex-col overflow-hidden">
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {getFilteredModels().map((model) => (
                  <ModelPreview
                    key={model.id}
                    model={model}
                    onAddToTank={handleAddToTank}
                  />
                ))}
                {getFilteredModels().length === 0 && (
                  <div className="col-span-full text-center py-16">
                    <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6M12 3v9.172a4 4 0 010 5.656V21" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No models found</h3>
                    <p className="text-gray-500 mb-6">
                      {searchQuery ? `No models match "${searchQuery}". Try a different search term.` : 'No models in this category'}
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('')
                        setSelectedCategory('hardscape')
                      }}
                      className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Browse All Models
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-gray-50 to-white border-t border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Interactive 3D previews</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Instant add to tank</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <span className="font-semibold text-gray-800">
                  {Object.values(ModelCategories).reduce((sum, cat) => sum + cat.models.length, 0)}
                </span> total models
              </div>
              <div className="h-4 w-px bg-gray-300"></div>
              <div className="text-sm text-gray-600">
                <span className="font-semibold text-gray-800">5</span> categories
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
