import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'tanks' },
      update: {},
      create: {
        name: 'Tanks & Cabinets',
        slug: 'tanks',
        description: 'Aquarium tanks and stands',
        image: '/images/categories/tanks.jpg'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'hardscape' },
      update: {},
      create: {
        name: 'Hardscape',
        slug: 'hardscape',
        description: 'Rocks, stones, and driftwood',
        image: '/images/categories/hardscape.jpg'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'plants' },
      update: {},
      create: {
        name: 'Aquatic Plants',
        slug: 'plants',
        description: 'Live aquarium plants',
        image: '/images/categories/plants.jpg'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'livestock' },
      update: {},
      create: {
        name: 'Livestock',
        slug: 'livestock',
        description: 'Fish, shrimp, and other aquatic animals',
        image: '/images/categories/livestock.jpg'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'decoration' },
      update: {},
      create: {
        name: 'Decorations',
        slug: 'decoration',
        description: 'Decorative items and ornaments',
        image: '/images/categories/decoration.jpg'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'equipment' },
      update: {},
      create: {
        name: 'Equipment',
        slug: 'equipment',
        description: 'Filters, lighting, and other equipment',
        image: '/images/categories/equipment.jpg'
      }
    })
  ])

  console.log('✅ Categories created')

  // Create products
  const hardscapeCategory = categories.find(c => c.slug === 'hardscape')!
  const plantsCategory = categories.find(c => c.slug === 'plants')!
  const livestockCategory = categories.find(c => c.slug === 'livestock')!
  const decorationCategory = categories.find(c => c.slug === 'decoration')!

  const products = await Promise.all([
    // Hardscape products
    prisma.product.upsert({
      where: { id: '1' },
      update: {},
      create: {
        id: '1',
        name: 'Dragon Stone',
        slug: 'dragon-stone',
        description: 'Natural limestone rock perfect for aquascaping',
        price: 25.99,
        images: JSON.stringify(['/images/products/dragon-stone-1.jpg', '/images/products/dragon-stone-2.jpg']),
        modelUrl: '/models/dragon-stone.glb',
        dimensions: JSON.stringify({ width: 15, height: 12, depth: 8 }),
        weight: 2.5,
        stock: 45,
        categoryId: hardscapeCategory.id,
        specifications: JSON.stringify({
          material: 'Limestone',
          ph_impact: 'Slightly raises pH',
          size_range: '10-20cm',
          origin: 'Japan'
        })
      }
    }),
    prisma.product.upsert({
      where: { id: '2' },
      update: {},
      create: {
        id: '2',
        name: 'Seiryu Stone',
        slug: 'seiryu-stone',
        description: 'Premium Japanese aquascaping stone with natural blue-gray color',
        price: 35.99,
        images: JSON.stringify(['/images/products/seiryu-stone-1.jpg']),
        modelUrl: '/models/seiryu-stone.glb',
        dimensions: JSON.stringify({ width: 18, height: 15, depth: 10 }),
        weight: 3.2,
        stock: 28,
        categoryId: hardscapeCategory.id,
        specifications: JSON.stringify({
          material: 'Limestone',
          ph_impact: 'Raises pH significantly',
          size_range: '15-25cm',
          origin: 'Japan'
        })
      }
    }),
    prisma.product.upsert({
      where: { id: '3' },
      update: {},
      create: {
        id: '3',
        name: 'Spider Wood',
        slug: 'spider-wood',
        description: 'Intricate branching driftwood perfect for natural aquascapes',
        price: 42.99,
        images: JSON.stringify(['/images/products/spider-wood-1.jpg']),
        modelUrl: '/models/spider-wood.glb',
        dimensions: JSON.stringify({ width: 25, height: 20, depth: 15 }),
        weight: 1.8,
        stock: 15,
        categoryId: hardscapeCategory.id,
        specifications: JSON.stringify({
          material: 'Natural driftwood',
          ph_impact: 'Slightly lowers pH',
          size_range: '20-30cm',
          preparation: 'Pre-soaked and cleaned'
        })
      }
    }),
    prisma.product.upsert({
      where: { id: '4' },
      update: {},
      create: {
        id: '4',
        name: 'Lava Rock',
        slug: 'lava-rock',
        description: 'Porous volcanic rock ideal for biological filtration',
        price: 18.99,
        images: JSON.stringify(['/images/products/lava-rock-1.jpg']),
        modelUrl: '/models/lava-rock.glb',
        dimensions: JSON.stringify({ width: 12, height: 10, depth: 8 }),
        weight: 1.5,
        stock: 35,
        categoryId: hardscapeCategory.id,
        specifications: JSON.stringify({
          material: 'Volcanic rock',
          ph_impact: 'Neutral',
          size_range: '8-15cm',
          porosity: 'High'
        })
      }
    }),
    prisma.product.upsert({
      where: { id: '5' },
      update: {},
      create: {
        id: '5',
        name: 'Ohko Stone',
        slug: 'ohko-stone',
        description: 'Traditional Japanese aquascaping stone with unique texture',
        price: 28.99,
        images: JSON.stringify(['/images/products/ohko-stone-1.jpg']),
        modelUrl: '/models/ohko-stone.glb',
        dimensions: JSON.stringify({ width: 16, height: 14, depth: 9 }),
        weight: 2.8,
        stock: 22,
        categoryId: hardscapeCategory.id,
        specifications: JSON.stringify({
          material: 'Sedimentary rock',
          ph_impact: 'Slightly raises pH',
          size_range: '12-18cm',
          origin: 'Japan'
        })
      }
    }),
    prisma.product.upsert({
      where: { id: '6' },
      update: {},
      create: {
        id: '6',
        name: 'Petrified Wood',
        slug: 'petrified-wood',
        description: 'Ancient fossilized wood with beautiful natural patterns',
        price: 65.99,
        images: JSON.stringify(['/images/products/petrified-wood-1.jpg']),
        modelUrl: '/models/petrified-wood.glb',
        dimensions: JSON.stringify({ width: 30, height: 18, depth: 12 }),
        weight: 4.2,
        stock: 8,
        categoryId: hardscapeCategory.id,
        specifications: JSON.stringify({
          material: 'Fossilized wood',
          ph_impact: 'Neutral',
          size_range: '25-35cm',
          age: 'Millions of years old'
        })
      }
    }),
    prisma.product.upsert({
      where: { id: '16' },
      update: {},
      create: {
        id: '16',
        name: 'Driftwood',
        slug: 'driftwood',
        description: 'Natural weathered wood for aquascaping',
        price: 32.99,
        images: JSON.stringify(['/images/products/driftwood-1.jpg']),
        modelUrl: '/models/driftwood.glb',
        dimensions: JSON.stringify({ width: 22, height: 16, depth: 10 }),
        weight: 1.6,
        stock: 18,
        categoryId: hardscapeCategory.id,
        specifications: JSON.stringify({
          material: 'Natural driftwood',
          ph_impact: 'Slightly lowers pH',
          size_range: '18-25cm',
          preparation: 'Pre-soaked'
        })
      }
    }),
    prisma.product.upsert({
      where: { id: '17' },
      update: {},
      create: {
        id: '17',
        name: 'Drift Wood',
        slug: 'drift-wood',
        description: 'Premium quality drift wood for natural aquascapes',
        price: 38.99,
        images: JSON.stringify(['/images/products/drift-wood-1.jpg']),
        modelUrl: '/models/drift_wood.glb',
        dimensions: JSON.stringify({ width: 28, height: 20, depth: 12 }),
        weight: 2.1,
        stock: 12,
        categoryId: hardscapeCategory.id,
        specifications: JSON.stringify({
          material: 'Natural driftwood',
          ph_impact: 'Slightly lowers pH',
          size_range: '22-30cm',
          preparation: 'Premium grade'
        })
      }
    }),
    prisma.product.upsert({
      where: { id: '18' },
      update: {},
      create: {
        id: '18',
        name: 'Aquarium Vase',
        slug: 'aquarium-vase',
        description: 'Decorative ceramic vase for aquarium decoration',
        price: 24.99,
        images: JSON.stringify(['/images/products/aquarium-vase-1.jpg']),
        modelUrl: '/models/aquarium_vase.glb',
        dimensions: JSON.stringify({ width: 8, height: 15, depth: 8 }),
        weight: 0.8,
        stock: 25,
        categoryId: decorationCategory.id,
        specifications: JSON.stringify({
          material: 'Ceramic',
          ph_impact: 'Neutral',
          finish: 'Glazed',
          safe: 'Aquarium safe'
        })
      }
    }),
    prisma.product.upsert({
      where: { id: '19' },
      update: {},
      create: {
        id: '19',
        name: 'Synthetic Rock',
        slug: 'synthetic-rock',
        description: 'High-quality synthetic rock formation',
        price: 45.99,
        images: JSON.stringify(['/images/products/synthetic-rock-1.jpg']),
        modelUrl: '/models/terrariumaquarium_synthetic_rock.glb',
        dimensions: JSON.stringify({ width: 20, height: 18, depth: 14 }),
        weight: 2.5,
        stock: 15,
        categoryId: hardscapeCategory.id,
        specifications: JSON.stringify({
          material: 'Synthetic resin',
          ph_impact: 'Neutral',
          size_range: '16-22cm',
          safe: 'Aquarium safe'
        })
      }
    }),
    prisma.product.upsert({
      where: { id: '20' },
      update: {},
      create: {
        id: '20',
        name: 'Real Aquarium Wood',
        slug: 'real-aquarium-wood',
        description: '3D scanned real aquarium wood piece',
        price: 48.99,
        images: JSON.stringify(['/images/products/real-aquarium-wood-1.jpg']),
        modelUrl: '/models/real_aquarium_wood_3d_scan.glb',
        dimensions: JSON.stringify({ width: 26, height: 22, depth: 16 }),
        weight: 2.3,
        stock: 10,
        categoryId: hardscapeCategory.id,
        specifications: JSON.stringify({
          material: 'Natural hardwood',
          ph_impact: 'Slightly lowers pH',
          size_range: '22-28cm',
          scan: '3D scanned authentic piece'
        })
      }
    }),
    prisma.product.upsert({
      where: { id: 'ruined-rock' },
      update: {},
      create: {
        id: 'ruined-rock',
        name: 'Ruined Rock',
        slug: 'ruined-rock',
        description: 'Weathered rock formation with ancient appearance',
        price: 55.99,
        images: JSON.stringify(['/images/products/ruined-rock-1.jpg']),
        modelUrl: '/models/ruined_rock_fence.glb',
        dimensions: JSON.stringify({ width: 32, height: 20, depth: 18 }),
        weight: 5.1,
        stock: 6,
        categoryId: hardscapeCategory.id,
        specifications: JSON.stringify({
          material: 'Weathered limestone',
          ph_impact: 'Slightly raises pH',
          size_range: '28-35cm',
          appearance: 'Ancient ruins style'
        })
      }
    }),
    prisma.product.upsert({
      where: { id: 'driftwood-trunk' },
      update: {},
      create: {
        id: 'driftwood-trunk',
        name: 'Driftwood Trunk',
        slug: 'driftwood-trunk',
        description: 'Large driftwood trunk piece for centerpiece aquascaping',
        price: 78.99,
        images: JSON.stringify(['/images/products/driftwood-trunk-1.jpg']),
        modelUrl: '/models/k01__driftwood_trunk__free_sample.glb',
        dimensions: JSON.stringify({ width: 40, height: 25, depth: 20 }),
        weight: 3.8,
        stock: 4,
        categoryId: hardscapeCategory.id,
        specifications: JSON.stringify({
          material: 'Large driftwood trunk',
          ph_impact: 'Lowers pH',
          size_range: '35-45cm',
          centerpiece: 'Perfect for large tanks'
        })
      }
    }),
    prisma.product.upsert({
      where: { id: 'drift-wood-dee' },
      update: {},
      create: {
        id: 'drift-wood-dee',
        name: 'Drift Wood (Dee Why)',
        slug: 'drift-wood-dee-why',
        description: 'Premium drift wood collected from Dee Why beach',
        price: 58.99,
        images: JSON.stringify(['/images/products/drift-wood-dee-1.jpg']),
        modelUrl: '/models/drift_wood_from_dee_why.glb',
        dimensions: JSON.stringify({ width: 35, height: 18, depth: 14 }),
        weight: 2.7,
        stock: 8,
        categoryId: hardscapeCategory.id,
        specifications: JSON.stringify({
          material: 'Beach driftwood',
          ph_impact: 'Slightly lowers pH',
          size_range: '30-38cm',
          origin: 'Dee Why Beach, Australia'
        })
      }
    }),

    // Plant products
    prisma.product.upsert({
      where: { id: '7' },
      update: {},
      create: {
        id: '7',
        name: 'Anubias Nana',
        slug: 'anubias-nana',
        description: 'Low-maintenance aquatic plant with broad dark green leaves',
        price: 15.99,
        images: JSON.stringify(['/images/products/anubias-nana-1.jpg']),
        modelUrl: '/models/plants_anubias.glb',
        dimensions: JSON.stringify({ width: 8, height: 12, depth: 8 }),
        weight: 0.1,
        stock: 60,
        categoryId: plantsCategory.id,
        specifications: JSON.stringify({
          light_requirement: 'Low to medium',
          co2_requirement: 'Optional',
          difficulty: 'Easy',
          placement: 'Mid to foreground'
        })
      }
    }),
    prisma.product.upsert({
      where: { id: '8' },
      update: {},
      create: {
        id: '8',
        name: 'Java Moss',
        slug: 'java-moss',
        description: 'Versatile moss perfect for carpeting and decoration',
        price: 8.99,
        images: JSON.stringify(['/images/products/java-moss-1.jpg']),
        modelUrl: '/models/java-moss.glb',
        dimensions: JSON.stringify({ width: 10, height: 3, depth: 10 }),
        weight: 0.05,
        stock: 100,
        categoryId: plantsCategory.id,
        specifications: JSON.stringify({
          light_requirement: 'Low',
          co2_requirement: 'None',
          difficulty: 'Very easy',
          placement: 'Any'
        })
      }
    }),
    prisma.product.upsert({
      where: { id: '9' },
      update: {},
      create: {
        id: '9',
        name: 'Amazon Sword',
        slug: 'amazon-sword',
        description: 'Popular aquarium plant with large sword-shaped leaves',
        price: 12.99,
        images: JSON.stringify(['/images/products/amazon-sword-1.jpg']),
        modelUrl: '/models/amazon-sword.glb',
        dimensions: JSON.stringify({ width: 15, height: 25, depth: 15 }),
        weight: 0.2,
        stock: 40,
        categoryId: plantsCategory.id,
        specifications: JSON.stringify({
          light_requirement: 'Medium',
          co2_requirement: 'Beneficial',
          difficulty: 'Easy',
          placement: 'Background'
        })
      }
    }),
    prisma.product.upsert({
      where: { id: '10' },
      update: {},
      create: {
        id: '10',
        name: 'Java Fern',
        slug: 'java-fern',
        description: 'Hardy aquatic fern with distinctive leaf shape',
        price: 14.99,
        images: JSON.stringify(['/images/products/java-fern-1.jpg']),
        modelUrl: '/models/java-fern.glb',
        dimensions: JSON.stringify({ width: 12, height: 20, depth: 12 }),
        weight: 0.15,
        stock: 50,
        categoryId: plantsCategory.id,
        specifications: JSON.stringify({
          light_requirement: 'Low to medium',
          co2_requirement: 'None',
          difficulty: 'Very easy',
          placement: 'Mid to background'
        })
      }
    }),
    prisma.product.upsert({
      where: { id: '11' },
      update: {},
      create: {
        id: '11',
        name: 'Cabomba',
        slug: 'cabomba',
        description: 'Feathery aquatic plant perfect for background planting',
        price: 9.99,
        images: JSON.stringify(['/images/products/cabomba-1.jpg']),
        modelUrl: '/models/cabomba.glb',
        dimensions: JSON.stringify({ width: 8, height: 30, depth: 8 }),
        weight: 0.08,
        stock: 75,
        categoryId: plantsCategory.id,
        specifications: JSON.stringify({
          light_requirement: 'High',
          co2_requirement: 'Required',
          difficulty: 'Medium',
          placement: 'Background'
        })
      }
    }),

    // Livestock products
    prisma.product.upsert({
      where: { id: '12' },
      update: {},
      create: {
        id: '12',
        name: 'Neon Tetra',
        slug: 'neon-tetra',
        description: 'Peaceful schooling fish with vibrant blue and red coloration',
        price: 4.99,
        images: JSON.stringify(['/images/products/neon-tetra-1.jpg']),
        modelUrl: '/models/neon_tetra_aquarium_fish.glb',
        dimensions: JSON.stringify({ width: 3, height: 3, depth: 1 }),
        weight: 0.01,
        stock: 200,
        categoryId: livestockCategory.id,
        specifications: JSON.stringify({
          temperature: '20-26°C',
          ph_range: '6.0-7.0',
          tank_size: 'Minimum 40L',
          schooling: 'Yes, minimum 6'
        })
      }
    }),
    prisma.product.upsert({
      where: { id: '13' },
      update: {},
      create: {
        id: '13',
        name: 'Betta Fish',
        slug: 'betta-fish',
        description: 'Beautiful solitary fish with vibrant colors and flowing fins',
        price: 12.99,
        images: JSON.stringify(['/images/products/betta-fish-1.jpg']),
        modelUrl: '/models/betta_fish.glb',
        dimensions: JSON.stringify({ width: 5, height: 4, depth: 2 }),
        weight: 0.02,
        stock: 80,
        categoryId: livestockCategory.id,
        specifications: JSON.stringify({
          temperature: '24-28°C',
          ph_range: '6.5-7.5',
          tank_size: 'Minimum 20L',
          schooling: 'No, solitary'
        })
      }
    }),
    prisma.product.upsert({
      where: { id: '14' },
      update: {},
      create: {
        id: '14',
        name: 'Blue Betta',
        slug: 'blue-betta',
        description: 'Stunning blue betta fish with exceptional coloration',
        price: 16.99,
        images: JSON.stringify(['/images/products/blue-betta-1.jpg']),
        modelUrl: '/models/blue_betta.glb',
        dimensions: JSON.stringify({ width: 5, height: 4, depth: 2 }),
        weight: 0.02,
        stock: 45,
        categoryId: livestockCategory.id,
        specifications: JSON.stringify({
          temperature: '24-28°C',
          ph_range: '6.5-7.5',
          tank_size: 'Minimum 20L',
          schooling: 'No, solitary'
        })
      }
    }),
    prisma.product.upsert({
      where: { id: '15' },
      update: {},
      create: {
        id: '15',
        name: 'Goldfish',
        slug: 'goldfish',
        description: 'Classic goldfish with beautiful golden coloration',
        price: 8.99,
        images: JSON.stringify(['/images/products/goldfish-1.jpg']),
        modelUrl: '/models/goldfish_variety_3.glb',
        dimensions: JSON.stringify({ width: 8, height: 6, depth: 3 }),
        weight: 0.05,
        stock: 120,
        categoryId: livestockCategory.id,
        specifications: JSON.stringify({
          temperature: '18-24°C',
          ph_range: '6.5-8.0',
          tank_size: 'Minimum 80L',
          schooling: 'Social, prefer groups'
        })
      }
    })
  ])

  console.log('✅ Products created')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@aquascaping.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@aquascaping.com',
      role: 'ADMIN'
    }
  })

  console.log('✅ Admin user created')

  // Create sample design
  const sampleDesign = await prisma.design.upsert({
    where: { id: 'sample-design-1' },
    update: {},
    create: {
      id: 'sample-design-1',
      name: 'Nature Aquarium Style',
      description: 'A beautiful nature-style aquascape with rocks and plants',
      isPublic: true,
      thumbnail: '/images/designs/nature-aquarium-1.jpg',
      data: JSON.stringify({
        camera: { position: [0, 0, 5], target: [0, 0, 0] },
        lighting: { intensity: 0.8, color: '#ffffff' },
        objects: [
          {
            id: 'stone-1',
            type: 'hardscape',
            productId: products[0].id,
            position: [-1, 0, 0],
            rotation: [0, 0.5, 0],
            scale: [1, 1, 1]
          },
          {
            id: 'plant-1',
            type: 'plant',
            productId: products[3].id,
            position: [1, 0, 0],
            rotation: [0, 0, 0],
            scale: [1, 1, 1]
          }
        ]
      }),
      totalPrice: products[0].price + products[3].price,
      userId: adminUser.id
    }
  })

  // Create design items
  await Promise.all([
    prisma.designItem.create({
      data: {
        designId: sampleDesign.id,
        productId: products[0].id,
        quantity: 1,
        position: JSON.stringify({ x: -1, y: 0, z: 0 }),
        rotation: JSON.stringify({ x: 0, y: 0.5, z: 0 }),
        scale: JSON.stringify({ x: 1, y: 1, z: 1 })
      }
    }),
    prisma.designItem.create({
      data: {
        designId: sampleDesign.id,
        productId: products[3].id,
        quantity: 1,
        position: JSON.stringify({ x: 1, y: 0, z: 0 }),
        rotation: JSON.stringify({ x: 0, y: 0, z: 0 }),
        scale: JSON.stringify({ x: 1, y: 1, z: 1 })
      }
    })
  ])

  console.log('✅ Sample design created')

  // Create blog posts
  await Promise.all([
    prisma.blogPost.create({
      data: {
        title: 'Getting Started with Aquascaping',
        content: 'Aquascaping is the art of creating beautiful underwater landscapes...',
        excerpt: 'Learn the basics of aquascaping and create your first underwater masterpiece.',
        image: '/images/blog/getting-started.jpg',
        published: true
      }
    }),
    prisma.blogPost.create({
      data: {
        title: 'Choosing the Right Plants for Your Aquarium',
        content: 'Selecting the right plants is crucial for a successful aquascape...',
        excerpt: 'Discover how to choose plants that will thrive in your aquarium setup.',
        image: '/images/blog/choosing-plants.jpg',
        published: true
      }
    }),
    prisma.blogPost.create({
      data: {
        title: 'Advanced Hardscaping Techniques',
        content: 'Take your aquascaping to the next level with these advanced techniques...',
        excerpt: 'Master advanced hardscaping techniques to create stunning underwater landscapes.',
        image: '/images/blog/advanced-hardscaping.jpg',
        published: true
      }
    })
  ])

  console.log('✅ Blog posts created')
  console.log('🎉 Database seeded successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
