// Memoized GLTF Model component to prevent unnecessary re-renders
const GLTFModel = React.memo(({ modelPath, position, rotation, scale, isSelected, onError }: any) => {
  console.log('Attempting to load model:', modelPath)
  
  // Always call useGLTF unconditionally
  const gltfResult = useGLTF(modelPath) as any
  
  // Handle errors after the hook call
  let scene: any = null
  let hasError = false
  
  if (!gltfResult || !gltfResult.scene) {
    hasError = true
    console.error('No scene found in GLTF for:', modelPath)
    if (onError) onError(new Error('No scene found in GLTF'))
  } else {
    scene = gltfResult.scene
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

// Add display name to the component
GLTFModel.displayName = 'GLTFModel'
