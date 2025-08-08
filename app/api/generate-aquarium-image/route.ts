import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { text, variations = 1 } = await request.json()

    if (!text) {
      return NextResponse.json(
        { error: 'Text prompt is required' },
        { status: 400 }
      )
    }

    // Enhanced prompt for better aquarium images
    const enhancedPrompt = `${text}, professional aquarium photography, crystal clear water, vibrant colors, high resolution, detailed underwater scene, no watermarks, clean composition`

    console.log('Generating image with prompt:', enhancedPrompt)

    // Generate multiple variations if requested
    const imagePromises = []
    for (let i = 0; i < Math.min(variations, 4); i++) {
      // Use different seeds for variations
      const seed = Math.floor(Math.random() * 1000000)
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?width=1024&height=768&model=flux&seed=${seed}&enhance=true`
      imagePromises.push(imageUrl)
    }

    // For single image, return DeepAI compatible format
    if (variations === 1) {
      const imageUrl = imagePromises[0]
      console.log('Image generated successfully:', imageUrl)
      
      return NextResponse.json({
        output_url: imageUrl,
        status: 'success'
      })
    }

    // For multiple variations
    return NextResponse.json({
      images: imagePromises,
      status: 'success'
    })
  } catch (error) {
    console.error('Error generating image:', error)
    return NextResponse.json(
      { 
        error: 'Failed to generate image. Please try again.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
