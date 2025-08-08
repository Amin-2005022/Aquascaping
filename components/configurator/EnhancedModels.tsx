'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Box, Sphere, Cylinder, Cone } from '@react-three/drei'
import * as THREE from 'three'

// Enhanced procedural models that look more realistic
export const EnhancedModels = {
  'dragon-stone': ({ position, rotation, scale, isSelected }: any) => (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Main rock body - irregular sphere */}
      <Sphere args={[1.5, 8, 6]}>
        <meshStandardMaterial 
          color={isSelected ? "#ff6b6b" : "#8B7355"} 
          roughness={0.95}
          metalness={0.05}
        />
      </Sphere>
      {/* Secondary rock formations */}
      <Sphere args={[1, 6, 4]} position={[0.8, 0.5, 0.3]}>
        <meshStandardMaterial 
          color={isSelected ? "#ff6b6b" : "#7A6B47"} 
          roughness={0.9}
        />
      </Sphere>
      <Sphere args={[0.7, 5, 3]} position={[-0.5, 0.3, 0.6]}>
        <meshStandardMaterial 
          color={isSelected ? "#ff6b6b" : "#6B5D3F"} 
          roughness={0.85}
        />
      </Sphere>
    </group>
  ),
  
  'seiryu-stone': ({ position, rotation, scale, isSelected }: any) => (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Main stone block with realistic proportions */}
      <Box args={[2.5, 1.8, 1.5]}>
        <meshStandardMaterial 
          color={isSelected ? "#ff6b6b" : "#6B7B8C"} 
          roughness={0.8}
          metalness={0.2}
        />
      </Box>
      {/* Layered stone effect */}
      <Box args={[2.2, 0.3, 1.3]} position={[0, 0.9, 0]}>
        <meshStandardMaterial 
          color={isSelected ? "#ff6b6b" : "#5A6B7C"} 
          roughness={0.9}
        />
      </Box>
      <Box args={[2.4, 0.2, 1.4]} position={[0, -0.8, 0]}>
        <meshStandardMaterial 
          color={isSelected ? "#ff6b6b" : "#4A5B6C"} 
          roughness={0.95}
        />
      </Box>
    </group>
  ),
  
  'spider-wood': ({ position, rotation, scale, isSelected }: any) => (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Main trunk */}
      <Cylinder args={[0.4, 0.5, 4]} rotation={[0, 0, Math.PI * 0.1]}>
        <meshStandardMaterial 
          color={isSelected ? "#ff6b6b" : "#8B4513"} 
          roughness={0.9}
        />
      </Cylinder>
      {/* Primary branches */}
      <Cylinder args={[0.25, 0.35, 2.5]} position={[1.2, 1.5, 0]} rotation={[0, 0, Math.PI * 0.4]}>
        <meshStandardMaterial 
          color={isSelected ? "#ff6b6b" : "#7A3F0F"} 
          roughness={0.85}
        />
      </Cylinder>
      <Cylinder args={[0.2, 0.25, 2]} position={[-1, 1.2, 0.3]} rotation={[0, 0, -Math.PI * 0.3]}>
        <meshStandardMaterial 
          color={isSelected ? "#ff6b6b" : "#6B350D"} 
          roughness={0.9}
        />
      </Cylinder>
      {/* Secondary branches */}
      <Cylinder args={[0.15, 0.2, 1.5]} position={[1.8, 2.5, -0.2]} rotation={[0, 0, Math.PI * 0.6]}>
        <meshStandardMaterial 
          color={isSelected ? "#ff6b6b" : "#5C2B0A"} 
          roughness={0.95}
        />
      </Cylinder>
      <Cylinder args={[0.1, 0.15, 1]} position={[-1.5, 2, 0.5]} rotation={[0, 0, -Math.PI * 0.5]}>
        <meshStandardMaterial 
          color={isSelected ? "#ff6b6b" : "#4E2208"} 
          roughness={0.95}
        />
      </Cylinder>
    </group>
  ),

  'anubias-nana': ({ position, rotation, scale, isSelected }: any) => {
    const AnubiasComponent = () => {
      const groupRef = useRef<THREE.Group>(null)
      
      // Gentle swaying animation
      useFrame((state) => {
        if (groupRef.current) {
          groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
          groupRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.3) * 0.05
        }
      })

      return (
        <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
          {/* Root system */}
          <Cylinder args={[0.3, 0.1, 0.5]} position={[0, -0.2, 0]}>
            <meshStandardMaterial 
              color={isSelected ? "#ff6b6b" : "#2D1B0F"} 
              roughness={0.9}
            />
          </Cylinder>
          {/* Main stem */}
          <Cylinder args={[0.08, 0.12, 1.5]} position={[0, 0.6, 0]}>
            <meshStandardMaterial 
              color={isSelected ? "#ff6b6b" : "#2D5016"} 
              roughness={0.7}
            />
          </Cylinder>
          {/* Leaves at different heights and angles */}
          {[
            { pos: [0.5, 1.2, 0.3] as [number, number, number], rot: [0, 0.5, 0.2] as [number, number, number], scale: [1.2, 0.1, 2] as [number, number, number] },
            { pos: [-0.4, 1.5, -0.2] as [number, number, number], rot: [0, -0.3, -0.1] as [number, number, number], scale: [1, 0.1, 1.8] as [number, number, number] },
            { pos: [0.2, 1.8, 0.6] as [number, number, number], rot: [0, 0.8, 0.3] as [number, number, number], scale: [0.9, 0.1, 1.6] as [number, number, number] },
            { pos: [-0.3, 2.1, 0.1] as [number, number, number], rot: [0, -0.6, -0.2] as [number, number, number], scale: [1.1, 0.1, 1.9] as [number, number, number] },
            { pos: [0.6, 2.4, -0.4] as [number, number, number], rot: [0, 1.2, 0.4] as [number, number, number], scale: [0.8, 0.1, 1.4] as [number, number, number] }
          ].map((leaf, i) => (
            <Sphere key={i} args={[0.8, 8, 4]} position={leaf.pos} rotation={leaf.rot} scale={leaf.scale}>
              <meshStandardMaterial 
                color={isSelected ? "#ff6b6b" : `hsl(120, 60%, ${25 + i * 2}%)`} 
                roughness={0.6}
                transparent
                opacity={0.9}
              />
            </Sphere>
          ))}
        </group>
      )
    }
    
    return <AnubiasComponent />
  },

  'java-moss': ({ position, rotation, scale, isSelected }: any) => (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Create more realistic moss clusters */}
      {Array.from({ length: 15 }, (_, i) => {
        const angle = (i / 15) * Math.PI * 2
        const radius = 1 + Math.random() * 0.5
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        const y = Math.random() * 0.3
        
        return (
          <Sphere 
            key={i}
            args={[0.2 + Math.random() * 0.15, 6, 4]} 
            position={[x, y, z]}
            scale={[1, 0.4 + Math.random() * 0.3, 1]}
          >
            <meshStandardMaterial 
              color={isSelected ? "#ff6b6b" : `hsl(${100 + Math.random() * 40}, 70%, ${30 + Math.random() * 20}%)`} 
              roughness={0.8}
              transparent
              opacity={0.8 + Math.random() * 0.2}
            />
          </Sphere>
        )
      })}
    </group>
  ),

  'neon-tetra': ({ position, rotation, scale, isSelected }: any) => {
    const TetraComponent = () => {
      const groupRef = useRef<THREE.Group>(null)
      
      // Swimming animation
      useFrame((state) => {
        if (groupRef.current) {
          groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.2
          groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.3
        }
      })

      return (
        <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
          {/* School of fish with more realistic spacing */}
          {Array.from({ length: 8 }, (_, i) => {
            const angle = (i / 8) * Math.PI * 2
            const radius = 1.5 + Math.sin(i) * 0.5
            const x = Math.cos(angle) * radius
            const z = Math.sin(angle) * radius
            const y = Math.sin(i * 0.5) * 0.3
            
            return (
              <group key={i} position={[x, y, z]} rotation={[0, angle + Math.PI/2, 0]}>
                {/* Fish body */}
                <Sphere args={[0.25, 8, 6]} scale={[2.5, 1, 1]}>
                  <meshStandardMaterial 
                    color={isSelected ? "#ff6b6b" : "#4169E1"} 
                    roughness={0.3}
                    metalness={0.1}
                  />
                </Sphere>
                {/* Tail */}
                <Cone args={[0.15, 0.4, 6]} position={[-0.4, 0, 0]} rotation={[0, 0, Math.PI/2]}>
                  <meshStandardMaterial 
                    color={isSelected ? "#ff6b6b" : "#1E90FF"} 
                    roughness={0.4}
                  />
                </Cone>
                {/* Dorsal fin */}
                <Box args={[0.1, 0.3, 0.05]} position={[0, 0.2, 0]}>
                  <meshStandardMaterial 
                    color={isSelected ? "#ff6b6b" : "#0066CC"} 
                    transparent
                    opacity={0.8}
                  />
                </Box>
              </group>
            )
          })}
        </group>
      )
    }
    
    return <TetraComponent />
  },

  'cherry-shrimp': ({ position, rotation, scale, isSelected }: any) => (
    <group position={position} rotation={rotation} scale={scale}>
      {Array.from({ length: 6 }, (_, i) => {
        const x = (Math.random() - 0.5) * 3
        const z = (Math.random() - 0.5) * 3
        const y = 0.1
        
        return (
          <group key={i} position={[x, y, z]} rotation={[0, Math.random() * Math.PI * 2, 0]}>
            {/* Shrimp body */}
            <Sphere args={[0.12, 6, 4]} scale={[2, 1.2, 1]}>
              <meshStandardMaterial 
                color={isSelected ? "#ff6b6b" : "#DC143C"} 
                roughness={0.4}
                metalness={0.1}
              />
            </Sphere>
            {/* Curved back segment */}
            <Sphere args={[0.1, 4, 3]} scale={[1.5, 1.5, 0.8]} position={[-0.15, 0.05, 0]}>
              <meshStandardMaterial 
                color={isSelected ? "#ff6b6b" : "#B22222"} 
                roughness={0.5}
              />
            </Sphere>
            {/* Antennae */}
            <Cylinder args={[0.01, 0.01, 0.3]} position={[0.15, 0.05, 0.05]} rotation={[0, 0, Math.PI/6]}>
              <meshStandardMaterial color={isSelected ? "#ff6b6b" : "#8B0000"} />
            </Cylinder>
            <Cylinder args={[0.01, 0.01, 0.3]} position={[0.15, 0.05, -0.05]} rotation={[0, 0, Math.PI/6]}>
              <meshStandardMaterial color={isSelected ? "#ff6b6b" : "#8B0000"} />
            </Cylinder>
          </group>
        )
      })}
    </group>
  ),

  // Add numeric ID mappings for database products
  '1': ({ position, rotation, scale, isSelected }: any) => EnhancedModels['dragon-stone']({ position, rotation, scale, isSelected }),
  '2': ({ position, rotation, scale, isSelected }: any) => EnhancedModels['seiryu-stone']({ position, rotation, scale, isSelected }),
  '3': ({ position, rotation, scale, isSelected }: any) => EnhancedModels['spider-wood']({ position, rotation, scale, isSelected }),
  '4': ({ position, rotation, scale, isSelected }: any) => EnhancedModels['spider-wood']({ position, rotation, scale, isSelected }), // Manzanita Wood -> Spider Wood
  '5': ({ position, rotation, scale, isSelected }: any) => EnhancedModels['anubias-nana']({ position, rotation, scale, isSelected }),
  '6': ({ position, rotation, scale, isSelected }: any) => EnhancedModels['java-moss']({ position, rotation, scale, isSelected }),
  '7': ({ position, rotation, scale, isSelected }: any) => EnhancedModels['anubias-nana']({ position, rotation, scale, isSelected }), // Amazon Sword -> Anubias
  '8': ({ position, rotation, scale, isSelected }: any) => EnhancedModels['java-moss']({ position, rotation, scale, isSelected }), // Monte Carlo -> Java Moss
  '9': ({ position, rotation, scale, isSelected }: any) => EnhancedModels['neon-tetra']({ position, rotation, scale, isSelected }),
  '10': ({ position, rotation, scale, isSelected }: any) => EnhancedModels['cherry-shrimp']({ position, rotation, scale, isSelected }),
  '11': ({ position, rotation, scale, isSelected }: any) => EnhancedModels['neon-tetra']({ position, rotation, scale, isSelected }), // Otocinclus -> Neon Tetra
  '12': ({ position, rotation, scale, isSelected }: any) => EnhancedModels['cherry-shrimp']({ position, rotation, scale, isSelected }), // Amano Shrimp -> Cherry Shrimp
}
