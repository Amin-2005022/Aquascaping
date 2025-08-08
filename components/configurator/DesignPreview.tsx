'use client'

import { useRef, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Box } from '@react-three/drei'
import { Vector3, Euler } from 'three'
import { ModelLoader } from './ModelLoader'

interface DesignItem {
  id: string
  productId: string
  position?: string
  rotation?: string
  scale?: string
  product: {
    name: string
  }
}

interface DesignPreviewProps {
  items: DesignItem[]
  className?: string
  width?: number
  height?: number
}

function PreviewItem({ item }: { item: DesignItem }) {
  const position = item.position ? JSON.parse(item.position) : { x: 0, y: 1, z: 0 }
  const rotation = item.rotation ? JSON.parse(item.rotation) : { x: 0, y: 0, z: 0 }
  const scale = item.scale ? JSON.parse(item.scale) : { x: 1, y: 1, z: 1 }

  return (
    <Suspense fallback={null}>
      <ModelLoader
        productId={item.productId}
        position={new Vector3(position.x, position.y, position.z)}
        rotation={new Euler(rotation.x, rotation.y, rotation.z)}
        scale={new Vector3(scale.x, scale.y, scale.z)}
        isSelected={false}
      />
    </Suspense>
  )
}

function TankStructure() {
  return (
    <group>
      {/* Tank bottom */}
      <Box args={[6, 0.1, 3.5]} position={[0, 0, 0]}>
        <meshPhysicalMaterial
          color="#e6f3ff"
          transparent
          opacity={0.1}
          transmission={0.8}
          roughness={0.1}
          thickness={0.5}
          ior={1.5}
        />
      </Box>
      
      {/* Tank walls - simplified for preview */}
      <Box args={[0.05, 4, 3.5]} position={[-3, 2, 0]}>
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.05}
          transmission={0.9}
          roughness={0.02}
          thickness={0.1}
          ior={1.5}
        />
      </Box>
      <Box args={[0.05, 4, 3.5]} position={[3, 2, 0]}>
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.05}
          transmission={0.9}
          roughness={0.02}
          thickness={0.1}
          ior={1.5}
        />
      </Box>
      <Box args={[6, 4, 0.05]} position={[0, 2, -1.75]}>
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.05}
          transmission={0.9}
          roughness={0.02}
          thickness={0.1}
          ior={1.5}
        />
      </Box>
      <Box args={[6, 4, 0.05]} position={[0, 2, 1.75]}>
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.05}
          transmission={0.9}
          roughness={0.02}
          thickness={0.1}
          ior={1.5}
        />
      </Box>
    </group>
  )
}

function AutoRotate() {
  const groupRef = useRef<any>()
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.1
    }
  })
  
  return (
    <group ref={groupRef}>
      <TankStructure />
    </group>
  )
}

export function DesignPreview({ items, className = "", width = 200, height = 150 }: DesignPreviewProps) {
  return (
    <div className={className} style={{ width, height }}>
      <Canvas
        camera={{ 
          position: [8, 6, 8], 
          fov: 50,
          near: 0.1,
          far: 1000
        }}
        style={{ background: 'linear-gradient(to bottom, #87CEEB, #E0F6FF)' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={0.8}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-10, -10, -10]} intensity={0.2} />
        
        <Suspense fallback={null}>
          <AutoRotate />
          {items.map((item) => (
            <PreviewItem key={item.id} item={item} />
          ))}
        </Suspense>
        
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableRotate={false}
          autoRotate
          autoRotateSpeed={1}
        />
      </Canvas>
    </div>
  )
}

// Fallback component for when 3D preview fails
export function DesignPreviewFallback({ items, className = "", width = 200, height = 150 }: DesignPreviewProps) {
  return (
    <div 
      className={`${className} bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-200`}
      style={{ width, height }}
    >
      <div className="text-center p-4">
        <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-2">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <p className="text-xs text-gray-600 font-medium">3D Design</p>
        <p className="text-xs text-gray-500">{items.length} items</p>
      </div>
    </div>
  )
}
