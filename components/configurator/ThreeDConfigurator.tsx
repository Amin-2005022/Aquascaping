'use client'

import { useRef, useEffect, Suspense, useState, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Grid, Box, Plane, Sphere, Cylinder, Cone } from '@react-three/drei'
import { Vector3, Vector2, Color, Raycaster, Mesh, Euler, Plane as ThreePlane } from 'three'
import { useConfiguratorStore, type ConfiguratorItem } from '../../lib/stores/configurator'
import { ModelLoader } from './ModelLoader'

// New component to handle 3D drop zone with raycasting
function DropZone3D() {
  const { scene, camera } = useThree()
  const { addItem, tankConfig } = useConfiguratorStore()
  
  useEffect(() => {
    const handleDrop = (e: any) => {
      if (!e.detail) return
      
      const { productData, clientX, clientY, canvasRect } = e.detail
      
      // Convert screen coordinates to normalized device coordinates (-1 to +1)
      const mouse = new Vector2(
        ((clientX - canvasRect.left) / canvasRect.width) * 2 - 1,
        -((clientY - canvasRect.top) / canvasRect.height) * 2 + 1
      )
      
      // Create raycaster
      const raycaster = new Raycaster()
      raycaster.setFromCamera(mouse, camera)
      
      // Find all intersectable objects in the scene (tank bounds)
      const tankBounds = [
        // Tank floor
        { 
          normal: new Vector3(0, 1, 0), 
          point: new Vector3(0, 0, 0),
          name: 'floor'
        },
        // Tank walls (for wall placement)
        { 
          normal: new Vector3(0, 0, 1), 
          point: new Vector3(0, tankConfig.height/2, -tankConfig.depth/2),
          name: 'back_wall'
        },
        { 
          normal: new Vector3(0, 0, -1), 
          point: new Vector3(0, tankConfig.height/2, tankConfig.depth/2),
          name: 'front_wall'
        },
        { 
          normal: new Vector3(1, 0, 0), 
          point: new Vector3(-tankConfig.width/2, tankConfig.height/2, 0),
          name: 'left_wall'
        },
        { 
          normal: new Vector3(-1, 0, 0), 
          point: new Vector3(tankConfig.width/2, tankConfig.height/2, 0),
          name: 'right_wall'
        }
      ]
      
      // Find the closest intersection
      let closestIntersection: { point: Vector3; surface: string } | null = null
      let closestDistance = Infinity
      
      for (const bound of tankBounds) {
        const plane = new ThreePlane(bound.normal, -bound.normal.dot(bound.point))
        const intersectionPoint = new Vector3()
        const intersectionResult = raycaster.ray.intersectPlane(plane, intersectionPoint)
        
        if (intersectionResult !== null) {
          const distance = intersectionResult.distanceTo(raycaster.ray.origin)
          
          if (distance > 0 && distance < closestDistance) {
            // Check if intersection is within tank bounds
            const withinBounds = 
              intersectionPoint.x >= -tankConfig.width/2 && intersectionPoint.x <= tankConfig.width/2 &&
              intersectionPoint.y >= 0 && intersectionPoint.y <= tankConfig.height &&
              intersectionPoint.z >= -tankConfig.depth/2 && intersectionPoint.z <= tankConfig.depth/2
            
            if (withinBounds) {
              closestDistance = distance
              closestIntersection = {
                point: intersectionPoint.clone(),
                surface: bound.name
              }
            }
          }
        }
      }
      
      if (closestIntersection !== null) {
        // Add some offset based on the surface
        const intersection = closestIntersection as { point: Vector3; surface: string }
        const finalPosition = intersection.point.clone()
        
        switch (intersection.surface) {
          case 'floor':
            finalPosition.y += 0.5 // Slight offset above floor
            break
          case 'back_wall':
            finalPosition.z += 1 // Offset from back wall
            break
          case 'front_wall':
            finalPosition.z -= 1 // Offset from front wall
            break
          case 'left_wall':
            finalPosition.x += 1 // Offset from left wall
            break
          case 'right_wall':
            finalPosition.x -= 1 // Offset from right wall
            break
        }
        
        // Add the item
        addItem({
          productId: productData.id,
          name: productData.name,
          price: productData.price,
          position: finalPosition,
          rotation: new Euler(0, Math.random() * Math.PI * 2, 0),
          scale: new Vector3(1, 1, 1)
        })
        
        console.log(`Dropped ${productData.name} at 3D position:`, finalPosition, 'on surface:', intersection.surface)
      }
    }
    
    window.addEventListener('canvas3DDrop', handleDrop)
    return () => window.removeEventListener('canvas3DDrop', handleDrop)
  }, [scene, camera, addItem, tankConfig])
  
  return null
}

function AquariumTank() {
  const { tankConfig } = useConfiguratorStore()
  
  return (
    <group>
      {/* Cabinet/Stand */}
      <Box 
        args={[tankConfig.width + 5, 15, tankConfig.depth + 5]} 
        position={[0, -7.5, 0]}
      >
        <meshBasicMaterial color={tankConfig.cabinetColor} />
      </Box>
      
      {/* Tank Base */}
      <Plane 
        args={[tankConfig.width, tankConfig.depth]} 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0.05, 0]}
      >
        <meshBasicMaterial color={tankConfig.cabinetColor} />
      </Plane>
      
      {/* Tank Walls - Transparent Glass with proper render order */}
      <group>
        {/* Front wall */}
        <Plane 
          args={[tankConfig.width, tankConfig.height]} 
          position={[0, tankConfig.height / 2, tankConfig.depth / 2]}
          renderOrder={0}
        >
          <meshPhysicalMaterial 
            color="#ffffff" 
            transparent 
            opacity={0.1} 
            transmission={0.85}
            roughness={0.02}
            thickness={0.5}
            ior={1.5}
            side={2}
            depthWrite={false}
          />
        </Plane>
        
        {/* Back wall */}
        <Plane 
          args={[tankConfig.width, tankConfig.height]} 
          position={[0, tankConfig.height / 2, -tankConfig.depth / 2]}
          rotation={[0, Math.PI, 0]}
          renderOrder={0}
        >
          <meshPhysicalMaterial 
            color="#ffffff" 
            transparent 
            opacity={0.1} 
            transmission={0.85}
            roughness={0.02}
            thickness={0.5}
            ior={1.5}
            side={2}
            depthWrite={false}
          />
        </Plane>
        
        {/* Left wall */}
        <Plane 
          args={[tankConfig.depth, tankConfig.height]} 
          position={[-tankConfig.width / 2, tankConfig.height / 2, 0]}
          rotation={[0, Math.PI / 2, 0]}
          renderOrder={0}
        >
          <meshPhysicalMaterial 
            color="#ffffff" 
            transparent 
            opacity={0.1} 
            transmission={0.85}
            roughness={0.02}
            thickness={0.5}
            ior={1.5}
            side={2}
            depthWrite={false}
          />
        </Plane>
        
        {/* Right wall */}
        <Plane 
          args={[tankConfig.depth, tankConfig.height]} 
          position={[tankConfig.width / 2, tankConfig.height / 2, 0]}
          rotation={[0, -Math.PI / 2, 0]}
          renderOrder={0}
        >
          <meshPhysicalMaterial 
            color="#ffffff" 
            transparent 
            opacity={0.1} 
            transmission={0.85}
            roughness={0.02}
            thickness={0.5}
            ior={1.5}
            side={2}
            depthWrite={false}
          />
        </Plane>
      </group>
    </group>
  )
}

function ConfiguratorItem({ item }: { item: ConfiguratorItem }) {
  const meshRef = useRef<any>()
  const { camera } = useThree()
  const { selectedItem, setSelectedItem, updateItem, commitChanges, tankConfig } = useConfiguratorStore()
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [originalPosition, setOriginalPosition] = useState<Vector3 | null>(null)
  const [originalScale, setOriginalScale] = useState<Vector3 | null>(null)

  // All hooks must be called before any early returns
  const isSelected = selectedItem === item?.id

  // Define pointer move and up handlers with useCallback - before early return
  const handlePointerMove = useCallback((event: any) => {
    if (!isDragging || !originalPosition || !originalScale || !item) return
    event.stopPropagation()
    
    // Calculate mouse delta in screen space
    const deltaX = event.clientX - dragStart.x
    const deltaY = event.clientY - dragStart.y
    
    // Rotation modification with Alt key
    if (event.altKey) {
      const rotationDelta = deltaX * 0.01
      updateItem(item.id, {
        rotation: new Euler(item.rotation.x, item.rotation.y + rotationDelta, item.rotation.z)
      })
      return
    }
    
    // Scale modification with Ctrl key
    if (event.ctrlKey) {
      const scaleChange = -deltaY * 0.01
      const newScale = Math.max(0.2, Math.min(3.0, originalScale.x + scaleChange))
      updateItem(item.id, {
        scale: new Vector3(newScale, newScale, newScale)
      })
      return
    }
    
    // Vertical movement with Shift key (Y-axis control)
    if (event.shiftKey) {
      const deltaWorldY = -deltaY * 0.05
      const newY = Math.max(0.5, originalPosition.y + deltaWorldY)
      updateItem(item.id, {
        position: new Vector3(originalPosition.x, newY, originalPosition.z)
      })
      return
    }
    
    // Position modification using camera-relative movement
    // Get camera's right and forward vectors (projected onto XZ plane)
    const cameraDirection = new Vector3()
    camera.getWorldDirection(cameraDirection)
    
    // Project camera direction onto XZ plane and normalize
    const forward = new Vector3(cameraDirection.x, 0, cameraDirection.z).normalize()
    const right = new Vector3().crossVectors(forward, new Vector3(0, 1, 0)).normalize()
    
    // Convert screen space movement to world space movement
    const movementSensitivity = 0.05
    const rightMovement = right.clone().multiplyScalar(deltaX * movementSensitivity)
    const forwardMovement = forward.clone().multiplyScalar(-deltaY * movementSensitivity) // Negative because screen Y is inverted
    
    // Calculate new position
    const newPosition = originalPosition.clone()
      .add(rightMovement)
      .add(forwardMovement)
    
    // Constraint to tank bounds
    const padding = 2
    const maxX = tankConfig.width / 2 - padding
    const maxZ = tankConfig.depth / 2 - padding
    const constrainedX = Math.max(-maxX, Math.min(maxX, newPosition.x))
    const constrainedZ = Math.max(-maxZ, Math.min(maxZ, newPosition.z))
    
    updateItem(item.id, {
      position: new Vector3(constrainedX, originalPosition.y, constrainedZ)
    })
  }, [isDragging, originalPosition, originalScale, dragStart, item, updateItem, tankConfig, camera])

  const handlePointerUp = useCallback((event: any) => {
    event.stopPropagation()
    setIsDragging(false)
    setOriginalPosition(null)
    setOriginalScale(null)
    
    // Commit changes to history when user finishes dragging/scaling/moving
    commitChanges()
  }, [commitChanges])

  // Add keyboard controls for rotation - before early return
  useEffect(() => {
    if (!isSelected || !item?.id || !item?.rotation) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.target !== document.body) return // Only when body is focused
      
      const rotationStep = Math.PI / 12 // 15 degrees
      const currentRotation = item.rotation

      switch (event.key.toLowerCase()) {
        case 'q':
          // Q key: Rotate left around Y axis
          updateItem(item.id, {
            rotation: new Euler(currentRotation.x, currentRotation.y + rotationStep, currentRotation.z)
          })
          commitChanges()
          break
        case 'e':
          // E key: Rotate right around Y axis
          updateItem(item.id, {
            rotation: new Euler(currentRotation.x, currentRotation.y - rotationStep, currentRotation.z)
          })
          commitChanges()
          break
        case 'r':
          // R key: Rotate around Z axis
          updateItem(item.id, {
            rotation: new Euler(currentRotation.x, currentRotation.y, currentRotation.z + rotationStep)
          })
          commitChanges()
          break
        case 't':
          // T key: Rotate around Z axis (opposite direction)
          updateItem(item.id, {
            rotation: new Euler(currentRotation.x, currentRotation.y, currentRotation.z - rotationStep)
          })
          commitChanges()
          break
        case 'x':
          // X key: Reset rotation
          updateItem(item.id, {
            rotation: new Euler(0, 0, 0)
          })
          commitChanges()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isSelected, item?.id, item?.rotation, updateItem, commitChanges])

  // Global event listeners for drag - before early return
  useEffect(() => {
    if (isDragging) {
      const handleGlobalMove = (e: MouseEvent) => handlePointerMove(e)
      const handleGlobalUp = (e: MouseEvent) => handlePointerUp(e)
      
      document.addEventListener('mousemove', handleGlobalMove)
      document.addEventListener('mouseup', handleGlobalUp)
      
      return () => {
        document.removeEventListener('mousemove', handleGlobalMove)
        document.removeEventListener('mouseup', handleGlobalUp)
      }
    }
  }, [isDragging, handlePointerMove, handlePointerUp])

  // Add safety checks for item properties - after all hooks
  if (!item || !item.id || !item.position || !item.rotation || !item.scale) {
    console.error('Invalid item data:', item)
    return null
  }

  const handlePointerDown = (event: any) => {
    event.stopPropagation()
    setSelectedItem(item.id)
    setIsDragging(true)
    setDragStart({ x: event.clientX, y: event.clientY })
    setOriginalPosition(new Vector3(item.position.x, item.position.y, item.position.z))
    setOriginalScale(new Vector3(item.scale.x, item.scale.y, item.scale.z))
  }

  const handleClick = (event: any) => {
    if (!isDragging) {
      event.stopPropagation()
      setSelectedItem(item.id)
    }
  }

  const handleDoubleClick = (event: any) => {
    event.stopPropagation()
    // Stack objects - find the highest Y position at this X,Z location
    const sameLocationItems = useConfiguratorStore.getState().items.filter(otherItem => 
      otherItem.id !== item.id &&
      Math.abs(otherItem.position.x - item.position.x) < 2 &&
      Math.abs(otherItem.position.z - item.position.z) < 2
    )
    
    const highestY = sameLocationItems.reduce((maxY, otherItem) => 
      Math.max(maxY, otherItem.position.y), 0
    )
    
    updateItem(item.id, {
      position: new Vector3(item.position.x, highestY + 2, item.position.z)
    })
    
    // Commit the stacking action to history
    commitChanges()
  }

  return (
    <group 
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      ref={meshRef}
    >
      {/* Invisible interaction area for better clickability */}
      <Box args={[4, 4, 4]} visible={false} position={[0, 1, 0]}>
        <meshBasicMaterial transparent opacity={0} />
      </Box>
      
      <ModelLoader
        productId={item.productId}
        position={[
          item.position?.x || 0, 
          item.position?.y || 1, 
          item.position?.z || 0
        ]}
        rotation={[
          item.rotation?.x || 0, 
          item.rotation?.y || 0, 
          item.rotation?.z || 0
        ]}
        scale={[
          item.scale?.x || 1, 
          item.scale?.y || 1, 
          item.scale?.z || 1
        ]}
        isSelected={isSelected}
      />
      {/* Enhanced selection and drag indicators */}
      {isSelected && (
        <>
          {/* Base selection ring */}
          <Box 
            args={[5, 0.1, 5]} 
            position={[0, -0.05, 0]}
          >
            <meshStandardMaterial color="#00ff88" transparent opacity={0.4} />
          </Box>
          
          {/* Selection wireframe */}
          <Sphere
            args={[3, 16, 16]}
            position={[0, 1, 0]}
          >
            <meshStandardMaterial 
              color="#00ff88" 
              transparent 
              opacity={0.15} 
              wireframe 
            />
          </Sphere>
          
          {/* Scale indicator corners */}
          {[
            [-2, 0, -2], [2, 0, -2], [-2, 0, 2], [2, 0, 2]
          ].map((pos, i) => (
            <Box key={i} args={[0.3, 0.3, 0.3]} position={[pos[0], pos[1], pos[2]]}>
              <meshStandardMaterial color="#ffff00" />
            </Box>
          ))}
        </>
      )}
      
      {/* Drag feedback */}
      {isDragging && (
        <>
          <Box 
            args={[4, 0.05, 4]} 
            position={[0, -0.15, 0]}
          >
            <meshStandardMaterial color="#ff4444" transparent opacity={0.6} />
          </Box>
          <Cylinder
            args={[0.1, 0.1, 4]}
            position={[0, 2, 0]}
          >
            <meshStandardMaterial color="#ff4444" transparent opacity={0.8} />
          </Cylinder>
        </>
      )}
    </group>
  )
}

function ClickToPlaceFloor() {
  const { tankConfig, addItem, setSelectedItem } = useConfiguratorStore()
  const [pendingItem, setPendingItem] = useState<any>(null)
  
  // Listen for pending items from the UI
  useEffect(() => {
    const handlePendingItem = (event: CustomEvent) => {
      setPendingItem(event.detail)
    }
    
    window.addEventListener('setPendingItem', handlePendingItem as EventListener)
    return () => window.removeEventListener('setPendingItem', handlePendingItem as EventListener)
  }, [])

  const handleFloorClick = (event: any) => {
    event.stopPropagation()
    
    if (pendingItem) {
      // Place new item
      const [x, z] = event.point ? [event.point.x, event.point.z] : [0, 0]
      
      addItem({
        productId: pendingItem.id,
        name: pendingItem.name,
        price: pendingItem.price,
        position: new Vector3(x, 1, z), // Y=1 to place on tank floor
        rotation: new Euler(0, Math.random() * Math.PI * 2, 0), // Random rotation
        scale: new Vector3(1, 1, 1)
      })
      
      // Clear pending item
      setPendingItem(null)
      window.dispatchEvent(new CustomEvent('clearPendingItem'))
    } else {
      // Deselect any selected object when clicking on empty floor
      setSelectedItem(null)
    }
  }

  return (
    <Plane
      args={[tankConfig.width - 2, tankConfig.depth - 2]}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0.1, 0]}
      onClick={handleFloorClick}
    >
      <meshStandardMaterial 
        color={pendingItem ? "#90EE90" : "#ffffff"} 
        transparent 
        opacity={pendingItem ? 0.2 : 0}
      />
    </Plane>
  )
}

function Scene() {
  const { items, selectedItem } = useConfiguratorStore()
  
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 20, 5]} intensity={1.8} />
      <directionalLight position={[-10, 15, -5]} intensity={1.0} />
      <pointLight position={[0, 25, 0]} intensity={1.2} />
      <pointLight position={[-15, 10, 15]} intensity={0.8} color="#4A90E2" />
      <pointLight position={[15, 10, -15]} intensity={0.8} color="#FFA726" />
      
      <DropZone3D />
      <AquariumTank />
      <ClickToPlaceFloor />
      
      {/* Render objects with proper depth sorting and error handling */}
      {items
        .sort((a, b) => {
          // Sort by productId to ensure proper rendering order
          const getOrder = (productId: string) => {
            const id = parseInt(productId)
            if (id <= 6) return 1  // Rocks/hardscape
            if (id <= 11) return 2 // Plants
            return 3               // Fish/livestock
          }
          return getOrder(a.productId) - getOrder(b.productId)
        })
        .map((item) => {
          try {
            return <ConfiguratorItem key={item.id} item={item} />
          } catch (error) {
            console.error('Error rendering item:', item.id, error)
            return null
          }
        })}
      
      <Grid 
        args={[100, 100]} 
        position={[0, -0.1, 0]} 
        cellSize={5} 
        cellThickness={0.5} 
        cellColor="#e0e0e0" 
        sectionSize={25} 
        sectionThickness={1} 
        sectionColor="#b0b0b0" 
        fadeDistance={50} 
        fadeStrength={1} 
        infiniteGrid 
      />
      
      <OrbitControls 
        enabled={!selectedItem} // Disable camera controls when object is selected
        enablePan={!selectedItem} 
        enableZoom={!selectedItem} 
        enableRotate={!selectedItem}
        minDistance={15}
        maxDistance={120}
        maxPolarAngle={Math.PI * 0.85}
        target={[0, 8, 0]}
        autoRotate={false}
        autoRotateSpeed={0.5}
      />
    </>
  )
}

function CameraLockIndicator() {
  const { selectedItem, items, canUndo, canRedo } = useConfiguratorStore()
  const selectedObject = items.find(item => item.id === selectedItem)
  
  if (!selectedItem || !selectedObject) {
    // Show undo/redo status when no item is selected
    const undoStatus = canUndo()
    const redoStatus = canRedo()
    
    if (!undoStatus && !redoStatus) return null
    
    return (
      <div className="absolute top-4 left-4 z-10 bg-gray-800 text-white px-3 py-2 rounded-lg shadow-lg text-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
          <span>History Status</span>
        </div>
        <div className="text-xs mt-1 opacity-75 space-y-1">
          <div>Ctrl+Z: Undo {undoStatus ? '✓' : '✗'}</div>
          <div>Ctrl+Y: Redo {redoStatus ? '✓' : '✗'}</div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="absolute top-4 left-4 z-10 bg-blue-500 text-white px-3 py-2 rounded-lg shadow-lg text-sm">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <span>Camera Locked - Editing: {selectedObject.name}</span>
      </div>
      <div className="text-xs mt-1 opacity-75 space-y-1">
        <div>Click empty space to unlock camera</div>
        <div>Drag: Move X/Z • Shift+Drag: Move Y • Ctrl+Drag: Resize</div>
        <div>Arrow keys: Fine positioning • Delete: Remove • Esc: Deselect</div>
        <div>Ctrl+Z: Undo • Ctrl+Y: Redo</div>
      </div>
    </div>
  )
}

// Global keyboard controls
function KeyboardControls() {
  const { selectedItem, setSelectedItem, removeItem, updateItem, commitChanges, items, undo, redo, canUndo, canRedo } = useConfiguratorStore()
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Handle Ctrl+Z (Undo) and Ctrl+Y (Redo)
      if (event.ctrlKey && event.key.toLowerCase() === 'z' && !event.shiftKey) {
        event.preventDefault()
        const success = undo()
        if (success) {
          console.log('Undo successful')
        } else {
          console.log('Nothing to undo')
        }
        return
      }
      
      if (event.ctrlKey && (event.key.toLowerCase() === 'y' || (event.key.toLowerCase() === 'z' && event.shiftKey))) {
        event.preventDefault()
        const success = redo()
        if (success) {
          console.log('Redo successful')
        } else {
          console.log('Nothing to redo')
        }
        return
      }
      
      if (!selectedItem) return
      
      const selectedObject = items.find(item => item.id === selectedItem)
      if (!selectedObject) return
      
      switch (event.key) {
        case 'Delete':
        case 'Backspace':
          event.preventDefault()
          removeItem(selectedItem)
          break
        case 'Escape':
          event.preventDefault()
          setSelectedItem(null)
          break
        case 'ArrowUp':
          event.preventDefault()
          updateItem(selectedItem, {
            position: new Vector3(
              selectedObject.position.x,
              selectedObject.position.y,
              selectedObject.position.z - 0.5
            )
          })
          commitChanges() // Save state after arrow key movement
          break
        case 'ArrowDown':
          event.preventDefault()
          updateItem(selectedItem, {
            position: new Vector3(
              selectedObject.position.x,
              selectedObject.position.y,
              selectedObject.position.z + 0.5
            )
          })
          commitChanges() // Save state after arrow key movement
          break
        case 'ArrowLeft':
          event.preventDefault()
          updateItem(selectedItem, {
            position: new Vector3(
              selectedObject.position.x - 0.5,
              selectedObject.position.y,
              selectedObject.position.z
            )
          })
          commitChanges() // Save state after arrow key movement
          break
        case 'ArrowRight':
          event.preventDefault()
          updateItem(selectedItem, {
            position: new Vector3(
              selectedObject.position.x + 0.5,
              selectedObject.position.y,
              selectedObject.position.z
            )
          })
          commitChanges() // Save state after arrow key movement
          break
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [selectedItem, items, setSelectedItem, removeItem, updateItem, commitChanges, undo, redo, canUndo, canRedo])
  
  return null
}

export function ThreeDConfigurator() {
  const { initializeHistory } = useConfiguratorStore()
  const [isDragOver, setIsDragOver] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  // Initialize history on mount
  useEffect(() => {
    initializeHistory()
  }, [initializeHistory])

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    // Only set to false if leaving the main container
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    try {
      const productData = JSON.parse(e.dataTransfer.getData('application/json'))
      
      // Get the canvas element bounds
      const canvasRect = e.currentTarget.getBoundingClientRect()
      
      // Dispatch custom event to the 3D scene for raycasting
      window.dispatchEvent(new CustomEvent('canvas3DDrop', {
        detail: {
          productData,
          clientX: e.clientX,
          clientY: e.clientY,
          canvasRect
        }
      }))
      
    } catch (error) {
      console.error('Error handling drop:', error)
    }
  }
  
  return (
    <div 
      className={`w-full h-full relative transition-all duration-200 ${
        isDragOver ? 'bg-blue-50 border-2 border-dashed border-blue-400' : ''
      }`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <KeyboardControls />
      <CameraLockIndicator />
      
      <Canvas
        ref={canvasRef}
        camera={{ position: [45, 25, 45], fov: 65 }}
        gl={{ alpha: true, antialias: true }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  )
}
