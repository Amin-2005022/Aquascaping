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

  const products = await Promise.all([
    // Hardscape products
    prisma.product.upsert({
      where: { slug: 'dragon-stone' },
      update: {},
      create: {
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
      where: { slug: 'seiryu-stone' },
      update: {},
      create: {
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
      where: { slug: 'spider-wood' },
      update: {},
      create: {
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

    // Plant products
    prisma.product.upsert({
      where: { slug: 'anubias-nana' },
      update: {},
      create: {
        name: 'Anubias Nana',
        slug: 'anubias-nana',
        description: 'Low-maintenance aquatic plant with broad dark green leaves',
        price: 15.99,
        images: JSON.stringify(['/images/products/anubias-nana-1.jpg']),
        modelUrl: '/models/anubias-nana.glb',
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
      where: { slug: 'java-moss' },
      update: {},
      create: {
        name: 'Java Moss',
        slug: 'java-moss',
        description: 'Versatile moss perfect for carpeting and decoration',
        price: 8.99,
        images: JSON.stringify(['/images/products/java-moss-1.jpg']),
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

    // Livestock products
    prisma.product.upsert({
      where: { slug: 'neon-tetra' },
      update: {},
      create: {
        name: 'Neon Tetra',
        slug: 'neon-tetra',
        description: 'Peaceful schooling fish with vibrant blue and red coloration',
        price: 4.99,
        images: JSON.stringify(['/images/products/neon-tetra-1.jpg']),
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
      where: { slug: 'cherry-shrimp' },
      update: {},
      create: {
        name: 'Cherry Shrimp',
        slug: 'cherry-shrimp',
        description: 'Colorful freshwater shrimp excellent for planted tanks',
        price: 6.99,
        images: JSON.stringify(['/images/products/cherry-shrimp-1.jpg']),
        dimensions: JSON.stringify({ width: 2, height: 2, depth: 1 }),
        weight: 0.005,
        stock: 150,
        categoryId: livestockCategory.id,
        specifications: JSON.stringify({
          temperature: '18-28°C',
          ph_range: '6.5-7.5',
          tank_size: 'Minimum 20L',
          breeding: 'Easy in stable conditions'
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
