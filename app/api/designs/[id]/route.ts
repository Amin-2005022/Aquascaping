import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'
import { getServerSession } from 'next-auth'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if the design exists and belongs to the user
    const design = await prisma.design.findUnique({
      where: { 
        id: params.id,
        userId: user.id
      }
    })

    if (!design) {
      return NextResponse.json(
        { error: 'Design not found or access denied' },
        { status: 404 }
      )
    }

    // Delete the design (items will be deleted automatically due to cascade)
    await prisma.design.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Error deleting design:', error)
    return NextResponse.json(
      { error: 'Failed to delete design' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const design = await prisma.design.findUnique({
      where: { 
        id: params.id,
        userId: user.id
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    })

    if (!design) {
      return NextResponse.json(
        { error: 'Design not found or access denied' },
        { status: 404 }
      )
    }

    return NextResponse.json(design)
  } catch (error) {
    console.error('Error fetching design:', error)
    return NextResponse.json(
      { error: 'Failed to fetch design' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const body = await request.json()

    // Check if the design exists and belongs to the user
    const existingDesign = await prisma.design.findUnique({
      where: { 
        id: params.id,
        userId: user.id
      }
    })

    if (!existingDesign) {
      return NextResponse.json(
        { error: 'Design not found or access denied' },
        { status: 404 }
      )
    }

    // Update the design
    const design = await prisma.design.update({
      where: { id: params.id },
      data: {
        name: body.name,
        description: body.description,
        data: body.data,
        totalPrice: body.totalPrice,
        isPublic: body.isPublic || false,
        items: {
          deleteMany: {}, // Remove all existing items
          create: body.items?.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity || 1,
            position: item.position,
            rotation: item.rotation,
            scale: item.scale
          })) || []
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    })

    return NextResponse.json(design)
  } catch (error) {
    console.error('Error updating design:', error)
    return NextResponse.json(
      { error: 'Failed to update design' },
      { status: 500 }
    )
  }
}
