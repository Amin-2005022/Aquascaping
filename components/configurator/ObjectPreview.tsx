'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Suspense } from 'react'
import { ModelLoader } from './ModelLoader'

interface ObjectPreviewProps {
  productId: string
  name: string
  isSelected?: boolean
}

export function ObjectPreview({ productId, name, isSelected = false }: ObjectPreviewProps) {
  return (
    <div className={`relative bg-gray-100 rounded-lg overflow-hidden transition-all duration-200 ${
      isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-200'
    }`}>
      {/* 3D Preview */}
      <div className="h-24 w-full">
        <Canvas camera={{ position: [3, 3, 3], fov: 50 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} />
          
          <Suspense fallback={null}>
            <ModelLoader
              productId={productId}
              position={[0, 0, 0]}
              rotation={[0, 0, 0]}
              scale={[0.8, 0.8, 0.8]}
              isSelected={false}
            />
          </Suspense>
          
          <OrbitControls 
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={2}
          />
        </Canvas>
      </div>
      
      {/* Object Name */}
      <div className="p-2">
        <p className={`text-xs font-medium text-center ${
          isSelected ? 'text-blue-700' : 'text-gray-700'
        }`}>
          {name}
        </p>
      </div>
      
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-1 right-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        </div>
      )}
    </div>
  )
}
