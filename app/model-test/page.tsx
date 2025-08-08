'use client'

import { ModelLoader } from '../../components/configurator/ModelLoader'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Suspense } from 'react'

export default function ModelTest() {
  return (
    <div className="w-full h-screen">
      <h1 className="text-2xl font-bold p-4">Model Loading Test</h1>
      <div className="w-full h-96 bg-gray-100">
        <Canvas camera={{ position: [5, 5, 5] }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          
          <Suspense fallback={null}>
            {/* Test the 3D models you have */}
            <ModelLoader 
              productId="dragon-stone"
              position={[-3, 0, 0]}
              rotation={[0, 0, 0]}
              scale={[1, 1, 1]}
              isSelected={false}
            />
            
            <ModelLoader 
              productId="seiryu-stone"
              position={[0, 0, 0]}
              rotation={[0, 0, 0]}
              scale={[1, 1, 1]}
              isSelected={false}
            />
            
            <ModelLoader 
              productId="spider-wood"
              position={[3, 0, 0]}
              rotation={[0, 0, 0]}
              scale={[1, 1, 1]}
              isSelected={false}
            />
            
            {/* Test models that don't exist (should show enhanced fallbacks) */}
            <ModelLoader 
              productId="anubias-nana"
              position={[-3, 0, 3]}
              rotation={[0, 0, 0]}
              scale={[1, 1, 1]}
              isSelected={false}
            />
            
            <ModelLoader 
              productId="neon-tetra"
              position={[0, 2, 3]}
              rotation={[0, 0, 0]}
              scale={[1, 1, 1]}
              isSelected={false}
            />
          </Suspense>
          
          <OrbitControls />
        </Canvas>
      </div>
      
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-2">Expected Results:</h2>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Dragon Stone (left back):</strong> Should load rock_b.glb model</li>
          <li><strong>Seiryu Stone (center back):</strong> Should load rock.glb model</li>
          <li><strong>Spider Wood (right back):</strong> Should load ruined_rock_fence.glb model</li>
          <li><strong>Anubias Plant (left front):</strong> Should show enhanced animated plant</li>
          <li><strong>Neon Tetra (center front, elevated):</strong> Should show enhanced animated fish school</li>
        </ul>
        <p className="mt-4 text-sm text-gray-600">
          Check browser console (F12) for loading logs and any errors.
        </p>
      </div>
    </div>
  )
}
