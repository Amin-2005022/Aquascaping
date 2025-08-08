# Free 3D Model Resources for Aquascaping

## Where to Get Free 3D Models

### 1. **Sketchfab** (Best Option)
- URL: https://sketchfab.com/
- Search for: "rock", "tree", "fish", "coral", "aquarium"
- Filter by: "Downloadable" and "Free"
- Format: GLB/GLTF (best for web)
- License: Check each model's license

### 2. **Google Poly Archive**
- URL: https://poly.pizza/
- Simple, low-poly models perfect for web
- All models are Creative Commons
- Format: GLB/GLTF

### 3. **Free3D**
- URL: https://free3d.com/
- Filter by "Free" models
- Categories: Nature, Animals, Plants
- Multiple formats available

### 4. **CGTrader**
- URL: https://www.cgtrader.com/free-3d-models
- Filter by "Free" models
- High-quality models
- Some require registration

### 5. **TurboSquid Free Models**
- URL: https://www.turbosquid.com/Search/3D-Models/free
- Professional quality
- Limited free selection
- Various formats

## How to Add Models to Your Project

### Step 1: Download Models
1. Download GLB/GLTF format (recommended)
2. If other format, convert using: https://gltf.report/
3. Place files in `public/models/` folder

### Step 2: Update Model Paths
Edit `components/configurator/ModelLoader.tsx`:

```typescript
const ModelPaths = {
  'dragon-stone': '/models/your-rock-model.glb',
  'spider-wood': '/models/your-wood-model.glb',
  'neon-tetra': '/models/your-fish-model.glb',
  // Add more models here
}
```

### Step 3: Add New Product Types
Add new products to your database and configurator:

```sql
INSERT INTO products (name, price, category, model_id) 
VALUES ('Driftwood Piece', 45.00, 'hardscape', 'driftwood-large');
```

## Recommended Search Terms

### For Hardscape:
- "aquarium rock"
- "driftwood"
- "volcanic rock"
- "river stone"
- "aquascape stone"

### For Plants:
- "aquatic plant"
- "anubias"
- "java fern"
- "moss"
- "aquarium plant"

### For Livestock:
- "tropical fish"
- "neon tetra"
- "angelfish"
- "cherry shrimp"
- "aquarium fish"

## Model Optimization Tips

### File Size:
- Keep models under 5MB each
- Use Draco compression for GLB files
- Optimize textures to 512x512 or 1024x1024

### Performance:
- Use LOD (Level of Detail) models for complex objects
- Combine small objects into single files
- Use instancing for repeated objects (like schooling fish)

## Example Model Implementation

Here's how to add a new "Coral" model:

1. **Download coral.glb** and place in `public/models/`

2. **Update ModelLoader.tsx**:
```typescript
const ModelPaths = {
  // ... existing models
  'brain-coral': '/models/coral.glb',
}

const FallbackModels = {
  // ... existing fallbacks
  'brain-coral': ({ position, rotation, scale, isSelected }: any) => (
    <Sphere args={[1, 1, 1]} position={position}>
      <meshStandardMaterial color={isSelected ? "#ff6b6b" : "#FF7F50"} />
    </Sphere>
  ),
}
```

3. **Add to database** (if using dynamic products):
```sql
INSERT INTO products (id, name, price, category, description) 
VALUES ('brain-coral', 'Brain Coral', 75.00, 'decoration', 'Beautiful brain coral for marine tanks');
```

## Troubleshooting

### Model Not Loading:
- Check file path in browser dev tools
- Verify GLB/GLTF format
- Check console for errors
- Ensure model file size is reasonable

### Performance Issues:
- Reduce model polygon count
- Optimize textures
- Use fewer simultaneous models
- Implement model culling

### Fallback Not Showing:
- Check FallbackModels has entry for your product ID
- Verify Suspense fallback is working
- Check console for errors

## License Notes

- Always check model licenses before commercial use
- Creative Commons models may require attribution
- Some "free" models have restrictions
- Keep license information in your project documentation

## Next Steps

1. Browse Sketchfab for aquarium-related models
2. Download 3-5 models in GLB format
3. Add them to your `public/models/` folder
4. Update the ModelPaths in ModelLoader.tsx
5. Test in your configurator
6. Add fallback shapes for each model
