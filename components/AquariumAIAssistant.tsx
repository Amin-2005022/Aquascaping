'use client'

import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Badge } from './ui/badge'
import { Loader2, Sparkles, Download, Copy, RefreshCw, Trash2 } from 'lucide-react'
import { useSession } from 'next-auth/react'

interface GeneratedImage {
  id: string
  url: string
  prompt: string
  style: string
  timestamp: Date
}

const aquariumStyles = [
  { value: 'natural', label: 'Natural Planted', description: 'Lush green plants with natural hardscape' },
  { value: 'dutch', label: 'Dutch Style', description: 'Colorful plant arrangements in terraces' },
  { value: 'iwagumi', label: 'Iwagumi', description: 'Minimalist stone-focused design' },
  { value: 'biotope', label: 'Biotope', description: 'Recreating natural habitat' },
  { value: 'reef', label: 'Coral Reef', description: 'Colorful coral reef scene' },
  { value: 'freshwater', label: 'Freshwater Community', description: 'Mixed freshwater fish community' },
]

const commonObjects = [
  'driftwood', 'dragon stone', 'seiryu stone', 'anubias', 'java moss', 'cryptocoryne',
  'neon tetras', 'betta fish', 'angelfish', 'coral', 'live rock', 'sand substrate',
  'gravel substrate', 'LED lighting', 'bubbler', 'heater', 'filter'
]

const promptSuggestions = [
  "A peaceful community tank with schooling neon tetras, lush green plants, and natural driftwood",
  "Minimalist iwagumi style with carefully placed stones and carpeting plants",
  "Vibrant Dutch aquascape with terraced colorful plants and pristine maintenance",
  "Natural biotope recreating Amazon river with native fish and authentic decor",
  "Coral reef aquarium with colorful corals, live rock, and tropical marine fish",
  "Zen-inspired planted tank with moss-covered rocks and gentle lighting"
]

export function AquariumAIAssistant() {
  const [prompt, setPrompt] = useState('')
  const [selectedStyle, setSelectedStyle] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([])
  const [error, setError] = useState('')
  const [selectedObjects, setSelectedObjects] = useState<string[]>([])
  const [copySuccess, setCopySuccess] = useState('')
  const { data: session } = useSession()
  
  // Get storage key based on user email
  const getStorageKey = () => {
    const userEmail = session?.user?.email
    return userEmail ? `aquarium-ai-images-${userEmail}` : 'aquarium-ai-images'
  }

  // Load saved images from localStorage on component mount
  useEffect(() => {
    const storageKey = getStorageKey()
    const savedImages = localStorage.getItem(storageKey)
    if (savedImages) {
      try {
        const parsedImages = JSON.parse(savedImages)
        setGeneratedImages(parsedImages.map((img: any) => ({
          ...img,
          timestamp: new Date(img.timestamp)
        })))
      } catch (error) {
        console.error('Error loading saved images:', error)
      }
    }
  }, [session])

  // Save images to localStorage whenever generatedImages changes
  useEffect(() => {
    const storageKey = getStorageKey()
    if (generatedImages.length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(generatedImages))
    }
  }, [generatedImages, session])

  const generatePrompt = () => {
    const styleInfo = aquariumStyles.find(s => s.value === selectedStyle)
    const objectsText = selectedObjects.length > 0 ? ` featuring ${selectedObjects.join(', ')}` : ''
    
    const enhancedPrompt = `Professional aquarium photography, ${styleInfo?.description || 'beautiful aquascape'}${objectsText}, ${prompt}, crystal clear water, professional lighting, high resolution, detailed, vibrant colors, underwater scene, aquascaping, fish tank, no surface visible, completely underwater view`
    
    return enhancedPrompt
  }

  const generateImage = async () => {
    if (!prompt.trim()) {
      setError('Please enter a description for your aquarium')
      return
    }

    setIsGenerating(true)
    setError('')

    try {
      const enhancedPrompt = generatePrompt()
      
      const response = await fetch('/api/generate-aquarium-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: enhancedPrompt,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image')
      }
      
      if (data.output_url) {
        const newImage: GeneratedImage = {
          id: Date.now().toString(),
          url: data.output_url,
          prompt: enhancedPrompt,
          style: selectedStyle,
          timestamp: new Date()
        }
        
        setGeneratedImages(prev => [newImage, ...prev])
        
        // Show success message
        setError('')
      } else {
        throw new Error('No image URL returned from API')
      }
    } catch (err) {
      console.error('Error generating image:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate image. Please try again.'
      
      // Check for common API errors
      if (errorMessage.includes('429')) {
        setError('Rate limit reached. Please wait a moment before generating another image.')
      } else if (errorMessage.includes('401')) {
        setError('API authentication failed. Please contact support.')
      } else {
        setError(errorMessage)
      }
    } finally {
      setIsGenerating(false)
    }
  }

  const toggleObject = (object: string) => {
    setSelectedObjects(prev => 
      prev.includes(object) 
        ? prev.filter(o => o !== object)
        : [...prev, object]
    )
  }

  const regenerateImage = async (originalPrompt: string) => {
    setIsGenerating(true)
    setError('')

    try {
      const response = await fetch('/api/generate-aquarium-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: originalPrompt,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to regenerate image')
      }
      
      if (data.output_url) {
        const newImage: GeneratedImage = {
          id: Date.now().toString(),
          url: data.output_url,
          prompt: originalPrompt,
          style: selectedStyle,
          timestamp: new Date()
        }
        
        setGeneratedImages(prev => [newImage, ...prev])
        setError('')
      } else {
        throw new Error('No image URL returned from API')
      }
    } catch (err) {
      console.error('Error regenerating image:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to regenerate image. Please try again.'
      setError(errorMessage)
    } finally {
      setIsGenerating(false)
    }
  }

  const copyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt)
    setCopySuccess('Prompt copied to clipboard!')
    setTimeout(() => setCopySuccess(''), 2000)
  }

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

  const clearAllImages = () => {
    setGeneratedImages([])
    localStorage.removeItem(getStorageKey())
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 xl:grid-cols-3 gap-6 h-[calc(100vh-280px)] min-h-[600px]">
      {/* Left Panel - Instructions & Controls (2/5 on lg, 1/3 on xl) */}
      <div className="lg:col-span-2 xl:col-span-1 space-y-4 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <Card className="h-fit border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Sparkles className="h-5 w-5 text-purple-600" />
              </div>
              AI Aquarium Designer
            </CardTitle>
            <CardDescription className="text-base leading-relaxed">
              Describe your dream aquarium and let AI create a visual concept for you.
              <br />
              <span className="inline-flex items-center gap-1 text-green-600 text-sm font-medium mt-2 bg-green-50 px-2 py-1 rounded-full">
                <Sparkles className="h-3 w-3" />
                Powered by free, open-source AI - unlimited generations!
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Style Selection */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700">Aquarium Style</label>
              <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                <SelectTrigger className="h-12 border-2 hover:border-purple-200 transition-colors">
                  <SelectValue placeholder="Choose an aquarium style" />
                </SelectTrigger>
                <SelectContent>
                  {aquariumStyles.map((style) => (
                    <SelectItem key={style.value} value={style.value} className="py-3">
                      <div>
                        <div className="font-medium">{style.label}</div>
                        <div className="text-xs text-gray-500">{style.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Common Objects */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700">Include These Objects (Optional)</label>
              <div className="max-h-36 overflow-y-auto p-3 border-2 border-dashed border-gray-200 rounded-lg hover:border-purple-200 transition-colors">
                <div className="flex flex-wrap gap-2">
                  {commonObjects.map((object) => (
                    <Badge
                      key={object}
                      variant={selectedObjects.includes(object) ? "default" : "outline"}
                      className="cursor-pointer hover:bg-primary/80 transition-all duration-200 hover:scale-105"
                      onClick={() => toggleObject(object)}
                    >
                      {object}
                    </Badge>
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-500">Click on items to include them in your aquarium design</p>
            </div>

            {/* Custom Description */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700">Custom Description</label>
              <Textarea
                placeholder="Describe your aquarium vision... e.g., 'A peaceful community tank with schooling fish, dense green plants, and natural driftwood creating caves and hiding spots'"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                className="resize-none border-2 hover:border-purple-200 focus:border-purple-400 transition-colors"
              />
              
              {/* Prompt Suggestions */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-600">Quick suggestions (click to use):</p>
                <div className="max-h-28 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-gray-300">
                  {promptSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setPrompt(suggestion)}
                      className="text-xs bg-gradient-to-r from-gray-50 to-gray-100 hover:from-purple-50 hover:to-purple-100 px-3 py-2 rounded-lg transition-all duration-200 text-left w-full block border hover:border-purple-200 hover:shadow-sm"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Error and Success Messages */}
            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            )}
            
            {copySuccess && (
              <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded-r-lg">
                <p className="text-sm text-green-700 font-medium">{copySuccess}</p>
              </div>
            )}

            {/* Generate Button */}
            <Button 
              onClick={generateImage} 
              disabled={isGenerating || !prompt.trim()}
              className="w-full h-14 text-base font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                  Generating Magic...
                </>
              ) : (
                <>
                  <Sparkles className="mr-3 h-5 w-5" />
                  Generate Aquarium Image
                </>
              )}
            </Button>
            
            {/* Usage Tips */}
            <div className="p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border border-blue-200 rounded-xl">
              <h4 className="text-sm font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <div className="p-1 bg-blue-100 rounded">
                  <Sparkles className="h-3 w-3 text-blue-600" />
                </div>
                Pro Tips for Better Results:
              </h4>
              <ul className="text-xs text-blue-700 space-y-1.5 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Be specific about fish species, plant types, and decorations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Mention lighting conditions (bright, dim, natural)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Include water clarity and substrate type</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Describe the overall mood (peaceful, vibrant, natural)</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Panel - Generated Images (3/5 on lg, 2/3 on xl) */}
      <div className="lg:col-span-3 xl:col-span-2 flex flex-col h-full">
        <div className="flex items-center justify-between mb-6 flex-shrink-0">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">Generated Images</h3>
            <p className="text-gray-600 mt-1">Your AI-generated aquarium concepts</p>
          </div>
          {generatedImages.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllImages}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 transition-all duration-200"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All ({generatedImages.length})
            </Button>
          )}
        </div>

        {/* Images Grid with Scroll */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {generatedImages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-12">
              <div className="w-40 h-40 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mb-8 shadow-lg">
                <Sparkles className="h-20 w-20 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-4">No images generated yet</h3>
              <p className="text-gray-500 max-w-lg leading-relaxed text-lg">
                Fill out the form on the left and click <strong>&quot;Generate Aquarium Image&quot;</strong> to create your first AI concept!
              </p>
              <div className="mt-8 flex items-center gap-3 text-base text-gray-400">
                <Sparkles className="h-5 w-5" />
                <span>Free • Unlimited • No signup required</span>
              </div>
            </div>
          ) : (
            <div className="space-y-6 pb-4">
              {generatedImages.map((image, index) => (
                <div key={image.id} className="bg-white rounded-xl shadow-lg overflow-hidden border hover:shadow-xl transition-all duration-300">
                  <div className="relative group">
                    <img
                      src={image.url}
                      alt="Generated aquarium"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-aquarium.svg'
                      }}
                    />
                    {/* Image Controls Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-6">
                      <div className="flex space-x-3">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => downloadImage(image.url, `aquarium-${image.id}.jpg`)}
                          title="Download image"
                          className="bg-white/95 hover:bg-white backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => copyPrompt(image.prompt)}
                          title="Copy prompt"
                          className="bg-white/95 hover:bg-white backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => regenerateImage(image.prompt)}
                          disabled={isGenerating}
                          title="Generate variation"
                          className="bg-white/95 hover:bg-white backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                          <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                          Recreate
                        </Button>
                      </div>
                    </div>
                    
                    {/* Image Number Badge */}
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                      #{generatedImages.length - index}
                    </div>
                  </div>
                  
                  {/* Image Metadata */}
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                        {aquariumStyles.find(s => s.value === image.style)?.label || 'Custom Style'}
                      </Badge>
                      <span className="text-sm text-gray-500 font-medium">
                        {image.timestamp.toLocaleString()}
                      </span>
                    </div>
                    
                    {/* Collapsible Prompt */}
                    <details className="text-sm">
                      <summary className="cursor-pointer text-gray-700 hover:text-gray-900 font-medium flex items-center gap-2 py-2 hover:bg-gray-50 px-2 rounded-lg transition-colors">
                        <span>View prompt details</span>
                        <Copy className="h-3 w-3" />
                      </summary>
                      <div className="mt-3 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border">
                        <p className="text-xs text-gray-700 leading-relaxed mb-3">
                          {image.prompt}
                        </p>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setPrompt(image.prompt.split(',')[0])} // Use base prompt
                          className="h-8 px-3 text-xs bg-white hover:bg-purple-50 border border-gray-200 hover:border-purple-200 transition-all duration-200"
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Use as template
                        </Button>
                      </div>
                    </details>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
