'use client'

import React, { Suspense } from 'react'
import { useLoader } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { Box } from '@react-three/drei'
import { EnhancedModels } from './EnhancedModels'

// Model paths - you can add your own GLTF/GLB files here
const ModelPaths = {
  // Hardscape models (rocks)
  'dragon-stone': '/models/rock_b.glb',
  'seiryu-stone': '/models/rock.glb', 
  'lava-rock': '/models/beach_rock_formation_01.glb',
  'ohko-stone': '/models/sea_rock_free.glb',
  'petrified-wood': '/models/rock_17_free_rock_pack_vol.3.glb',
  'synthetic-rock': '/models/terrariumaquarium_synthetic_rock.glb',
  'ruined-rock': '/models/ruined_rock_fence.glb',
  
  // Wood models (new section)
  'spider-wood': '/models/moss_rock_02_rock_pack_vol.1.glb',
  'driftwood': '/models/driftwood.glb',
  'drift-wood': '/models/drift_wood.glb',
  'driftwood-trunk': '/models/k01__driftwood_trunk__free_sample.glb',
  'aquarium-wood': '/models/real_aquarium_wood_3d_scan.glb',
  'drift-wood-dee': '/models/drift_wood_from_dee_why.glb',
  
  // Plant models
  'anubias-nana': '/models/plants_anubias.glb',
  'java-moss': '/models/hydrilla.glb',
  'amazon-sword': '/models/lowpoly_marine_plant.glb',
  'java-fern': '/models/pond_weed.glb',
  'cabomba': '/models/underwater_plant_pack.glb',
  
  // Fish models
  'neon-tetra': '/models/neon_tetra_aquarium_fish.glb',
  'betta': '/models/betta_fish.glb',
  'blue-betta': '/models/blue_betta.glb',
  'goldfish': '/models/goldfish_variety_3.glb',
  
  // Equipment/Decoration
  'aquarium-vase': '/models/aquarium_vase.glb',
  
  // Numeric ID mappings for database products
  '1': '/models/rock_b.glb',                    // Dragon Stone
  '2': '/models/rock.glb',                      // Seiryu Stone  
  '3': '/models/moss_rock_02_rock_pack_vol.1.glb', // Spider Wood
  '4': '/models/beach_rock_formation_01.glb',   // Lava Rock
  '5': '/models/sea_rock_free.glb',             // Ohko Stone
  '6': '/models/rock_17_free_rock_pack_vol.3.glb', // Petrified Wood
  '7': '/models/plants_anubias.glb',            // Anubias Nana
  '8': '/models/hydrilla.glb',                  // Java Moss
  '9': '/models/lowpoly_marine_plant.glb',      // Amazon Sword
  '10': '/models/pond_weed.glb',                // Java Fern
  '11': '/models/underwater_plant_pack.glb',    // Cabomba
  '12': '/models/neon_tetra_aquarium_fish.glb', // Neon Tetra
  '13': '/models/betta_fish.glb',               // Betta Fish
  '14': '/models/blue_betta.glb',               // Blue Betta
  '15': '/models/goldfish_variety_3.glb',       // Goldfish
  '16': '/models/driftwood.glb',                // Driftwood
  '17': '/models/drift_wood.glb',               // Drift Wood
  '18': '/models/aquarium_vase.glb',            // Aquarium Vase
  '19': '/models/terrariumaquarium_synthetic_rock.glb', // Synthetic Rock
  '20': '/models/real_aquarium_wood_3d_scan.glb' // Real Aquarium Wood
}

// Memoized GLTF Model component to prevent unnecessary re-renders
const GLTFModel = React.memo(({ modelPath, position, rotation, scale, isSelected, onError }: any) => {
  console.log('Attempting to load model:', modelPath)
  
  // Always call useGLTF first - React Hooks must be called unconditionally
  let gltfResult: any
  let scene: any
  let hasError = false
  
  try {
    gltfResult = useGLTF(modelPath) as any
    scene = gltfResult?.scene
    
    if (!scene) {
      hasError = true
      console.error('No scene found in GLTF for:', modelPath)
    }
  } catch (loadError) {
    hasError = true
    console.error('Error loading GLTF model:', loadError)
    if (onError) onError(loadError)
  }
  
  if (hasError) {
    // Return fallback on error
    return (
      <Box args={[2, 2, 2]} position={position} rotation={rotation} scale={scale}>
        <meshStandardMaterial color="#ff6b6b" />
        {isSelected && (
          <Box args={[4, 0.1, 4]} position={[0, -2, 0]}>
            <meshStandardMaterial color="#ffff00" transparent opacity={0.3} />
          </Box>
        )}
      </Box>
    )
  }
  
  console.log('Model loaded successfully:', modelPath, scene)
  
  // Return the loaded model with safer cloning approach
  try {
    return (
      <group position={position} rotation={rotation} scale={scale}>
        <primitive 
          object={scene.clone()} 
          dispose={null}
        />
        {isSelected && (
          <Box args={[4, 0.1, 4]} position={[0, -2, 0]}>
            <meshStandardMaterial color="#ffff00" transparent opacity={0.3} />
          </Box>
        )}
      </group>
    )
  } catch (cloneError) {
    console.warn('Cloning failed, using original scene:', cloneError)
    // Fallback to using original scene if cloning fails
    return (
      <group position={position} rotation={rotation} scale={scale}>
        <primitive 
          object={scene} 
          dispose={null}
        />
        {isSelected && (
          <Box args={[4, 0.1, 4]} position={[0, -2, 0]}>
            <meshStandardMaterial color="#ffff00" transparent opacity={0.3} />
          </Box>
        )}
      </group>
    )
  }
})

export function ModelLoader({ 
  productId, 
  position, 
  rotation, 
  scale, 
  isSelected 
}: {
  productId: string
  position: any
  rotation: any  
  scale: any
  isSelected: boolean
}) {
  const modelPath = ModelPaths[productId as keyof typeof ModelPaths]
  const FallbackComponent = EnhancedModels[productId as keyof typeof EnhancedModels]

  console.log('ModelLoader called with:', { productId, modelPath, hasFallback: !!FallbackComponent })

  // Try to load GLTF model first, with geometric fallback
  if (modelPath) {
    console.log('Using GLTF model path:', modelPath)
    return (
      <Suspense fallback={getGeometricFallback(productId, position, rotation, scale, isSelected)}>
        <GLTFModelWithFallback 
          modelPath={modelPath}
          position={position}
          rotation={rotation}
          scale={scale}
          isSelected={isSelected}
          FallbackComponent={FallbackComponent}
          productId={productId}
        />
      </Suspense>
    )
  }

  // Use enhanced model component if available
  if (FallbackComponent) {
    console.log('Using enhanced component for:', productId)
    return <FallbackComponent position={position} rotation={rotation} scale={scale} isSelected={isSelected} />
  }

  // Final fallback to geometric shapes
  console.log('Using geometric fallback for:', productId)
  return getGeometricFallback(productId, position, rotation, scale, isSelected)
}

// Helper function for geometric fallbacks
function getGeometricFallback(productId: string, position: any, rotation: any, scale: any, isSelected: boolean) {
  const numId = parseInt(productId)
  
  // Rocks (1-6, 19)
  if (numId <= 6 || numId === 19) {
    return (
      <Box args={[2, 1.5, 1.8]} position={position} rotation={rotation} scale={scale}>
        <meshStandardMaterial color="#8B7355" roughness={0.8} />
        {isSelected && (
          <Box args={[4, 0.1, 4]} position={[0, -2, 0]}>
            <meshStandardMaterial color="#ffff00" transparent opacity={0.3} />
          </Box>
        )}
      </Box>
    )
  }
  
  // Plants (7-11)
  if (numId >= 7 && numId <= 11) {
    return (
      <group position={position} rotation={rotation} scale={scale}>
        <Box args={[0.8, 2, 0.8]}>
          <meshStandardMaterial color="#2d5016" />
        </Box>
        <Box args={[1.2, 1.5, 1.2]} position={[0, 0.5, 0]}>
          <meshStandardMaterial color="#4a7c59" />
        </Box>
        {isSelected && (
          <Box args={[4, 0.1, 4]} position={[0, -2, 0]}>
            <meshStandardMaterial color="#ffff00" transparent opacity={0.3} />
          </Box>
        )}
      </group>
    )
  }
  
  // Fish (12-15)
  if (numId >= 12 && numId <= 15) {
    return (
      <group position={position} rotation={rotation} scale={scale}>
        <Box args={[1.5, 0.8, 0.4]}>
          <meshStandardMaterial color="#FF6B35" />
        </Box>
        <Box args={[0.3, 0.6, 0.1]} position={[0.8, 0, 0]}>
          <meshStandardMaterial color="#FF6B35" />
        </Box>
        {isSelected && (
          <Box args={[4, 0.1, 4]} position={[0, -2, 0]}>
            <meshStandardMaterial color="#ffff00" transparent opacity={0.3} />
          </Box>
        )}
      </group>
    )
  }
  
  // Wood (16, 17, 20)
  if (numId === 16 || numId === 17 || numId === 20) {
    return (
      <Box args={[3, 0.8, 0.8]} position={position} rotation={rotation} scale={scale}>
        <meshStandardMaterial color="#8B4513" roughness={0.9} />
        {isSelected && (
          <Box args={[4, 0.1, 4]} position={[0, -2, 0]}>
            <meshStandardMaterial color="#ffff00" transparent opacity={0.3} />
          </Box>
        )}
      </Box>
    )
  }
  
  // Decoration (18)
  if (numId === 18) {
    return (
      <Box args={[1.5, 2, 1.5]} position={position} rotation={rotation} scale={scale}>
        <meshStandardMaterial color="#4169E1" transparent opacity={0.7} />
        {isSelected && (
          <Box args={[4, 0.1, 4]} position={[0, -2, 0]}>
            <meshStandardMaterial color="#ffff00" transparent opacity={0.3} />
          </Box>
        )}
      </Box>
    )
  }
  
  // Default fallback
  return (
    <Box args={[1, 1, 1]} position={position} rotation={rotation} scale={scale}>
      <meshStandardMaterial color="#cccccc" />
      {isSelected && (
        <Box args={[4, 0.1, 4]} position={[0, -2, 0]}>
          <meshStandardMaterial color="#ffff00" transparent opacity={0.3} />
        </Box>
      )}
    </Box>
  )
}

function GLTFModelWithFallback({ modelPath, position, rotation, scale, isSelected, FallbackComponent, productId }: any) {
  return (
    <ErrorBoundary
      fallback={
        FallbackComponent ? 
          <FallbackComponent position={position} rotation={rotation} scale={scale} isSelected={isSelected} /> :
          getGeometricFallback(productId, position, rotation, scale, isSelected)
      }
    >
      <GLTFModel 
        modelPath={modelPath}
        position={position}
        rotation={rotation}
        scale={scale}
        isSelected={isSelected}
        productId={productId}
        onError={(error: any) => {
          console.error('Model loading failed, will use fallback:', error)
          // The ErrorBoundary will handle the fallback
        }}
      />
    </ErrorBoundary>
  )
}

// Simple Error Boundary for 3D models
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Model ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }

    return this.props.children
  }
}
