import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Product from '@/lib/models/Product'
import Category from '@/lib/models/Category'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    const product = await Product.findById(params.id)
      .populate('category', 'name slug level')
      .lean()

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Transform to match frontend expectations
    const transformedProduct = {
      id: product._id.toString(),
      name: product.name,
      description: product.description,
      price: product.prices?.retail || 0,
      cost: product.prices?.dealer,
      images: product.images || [],
      categoryId: product.category?._id?.toString() || '',
      stock: product.stock || 0,
      sku: product.sku,
      createdAt: product.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: product.updatedAt?.toISOString() || new Date().toISOString(),
    }

    return NextResponse.json({ product: transformedProduct })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    // TODO: Add admin/dealer authentication check
    
    const body = await request.json()
    const { name, description, prices, images, stock, category, isActive } = body

    const product = await Product.findById(params.id)
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // If category is being updated, verify it exists and is a leaf
    if (category && category !== product.category.toString()) {
      const categoryDoc = await Category.findById(category)
      if (!categoryDoc) {
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 404 }
        )
      }

      const hasChildren = await Category.findOne({ parent: category })
      if (hasChildren) {
        return NextResponse.json(
          { error: 'Products can only be assigned to leaf categories' },
          { status: 400 }
        )
      }
    }

    // Update product
    if (name !== undefined) product.name = name
    if (description !== undefined) product.description = description
    if (prices !== undefined) product.prices = prices
    if (images !== undefined) product.images = images
    if (stock !== undefined) product.stock = stock
    if (category !== undefined) product.category = category
    if (isActive !== undefined) product.isActive = isActive

    await product.save()

    return NextResponse.json({
      message: 'Product updated successfully',
      product,
    })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    // TODO: Add admin authentication check
    
    const product = await Product.findById(params.id)
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    await Product.findByIdAndDelete(params.id)

    return NextResponse.json({
      message: 'Product deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}

