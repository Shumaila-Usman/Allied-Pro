import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Product from '@/lib/models/Product'
import Category from '@/lib/models/Category'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    // Fetch products - try with populate first, fallback to without
    let products: any[] = []
    
    try {
      // Try with populate
      products = await Product.find({})
        .populate({
          path: 'category',
          select: 'name slug level',
          strictPopulate: false
        })
        .sort({ createdAt: -1 })
        .lean()
    } catch (populateError: any) {
      console.warn('Populate failed, trying without populate:', populateError?.message)
      // If populate fails, try without populate
      products = await Product.find({})
        .sort({ createdAt: -1 })
        .lean()
    }
    
    // Transform to match frontend format
    const transformedProducts = products
      .filter((product: any) => product && product._id) // Filter out invalid products
      .map((product: any) => {
        // Handle category - can be populated object, ObjectId, or string
        let categoryId = ''
        if (product.category) {
          if (product.category._id) {
            categoryId = product.category._id.toString()
          } else if (typeof product.category === 'string') {
            categoryId = product.category
          } else {
            categoryId = String(product.category)
          }
        }
        
        return {
          id: product._id.toString(),
          name: product.name || '',
          description: product.description || '',
          price: product.prices?.retail ?? product.price ?? 0,
          cost: product.prices?.dealer ?? product.cost,
          images: Array.isArray(product.images) ? product.images : [],
          categoryId: categoryId,
          stock: product.stock ?? 0,
          sku: product.sku || '',
          createdAt: product.createdAt ? new Date(product.createdAt).toISOString() : new Date().toISOString(),
          updatedAt: product.updatedAt ? new Date(product.updatedAt).toISOString() : new Date().toISOString(),
        }
      })
    
    return NextResponse.json({ products: transformedProducts }, { status: 200 })
  } catch (error: any) {
    console.error('Error in GET /api/admin/products:', error)
    console.error('Error details:', {
      message: error?.message,
      name: error?.name,
      stack: error?.stack
    })
    
    // Return empty array instead of error to prevent frontend crash
    return NextResponse.json(
      { 
        products: [],
        error: process.env.NODE_ENV === 'development' ? error?.message : 'Failed to fetch products'
      },
      { status: 200 } // Return 200 with empty array instead of 500
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const body = await request.json()
    
    const { name, description, price, cost, stock, categoryId, images, sku } = body

    if (!name || !categoryId) {
      return NextResponse.json(
        { error: 'Name and category are required' },
        { status: 400 }
      )
    }

    // Verify category exists and is a leaf category
    const category = await Category.findById(categoryId)
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    // Check if category has children (not a leaf)
    const hasChildren = await Category.findOne({ parent: category._id })
    if (hasChildren) {
      return NextResponse.json(
        { error: 'Products can only be added to leaf categories' },
        { status: 400 }
      )
    }

    // Create product with MongoDB schema
    const newProduct = await Product.create({
      name,
      description: description || '',
      prices: {
        retail: price || 0,
        dealer: cost,
      },
      images: images || [],
      stock: stock || 0,
      category: categoryId,
      isActive: true,
    })

    const populatedProduct = await Product.findById(newProduct._id)
      .populate('category', 'name slug level')
      .lean()

    // Transform to match frontend format
    const transformedProduct = {
      id: populatedProduct._id.toString(),
      name: populatedProduct.name,
      description: populatedProduct.description || '',
      price: populatedProduct.prices?.retail || 0,
      cost: populatedProduct.prices?.dealer,
      images: populatedProduct.images || [],
      categoryId: populatedProduct.category?._id?.toString() || '',
      stock: populatedProduct.stock || 0,
      sku: populatedProduct.sku,
      createdAt: populatedProduct.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: populatedProduct.updatedAt?.toISOString() || new Date().toISOString(),
    }

    return NextResponse.json(
      { message: 'Product added successfully', product: transformedProduct },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error adding product:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB()
    const body = await request.json()
    const { productId, updates } = body

    const product = await Product.findById(productId)
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Initialize prices object if it doesn't exist
    if (!product.prices) {
      product.prices = { retail: 0, dealer: 0 }
    }

    // Update product fields
    if (updates.name !== undefined) product.name = updates.name
    if (updates.description !== undefined) product.description = updates.description
    if (updates.price !== undefined) product.prices.retail = updates.price
    if (updates.cost !== undefined) product.prices.dealer = updates.cost
    if (updates.stock !== undefined) product.stock = updates.stock
    if (updates.images !== undefined) product.images = updates.images
    if (updates.isActive !== undefined) product.isActive = updates.isActive

    await product.save()

    const updatedProduct = await Product.findById(productId)
      .populate('category', 'name slug level')
      .lean()

    // Transform to match frontend format
    const transformedProduct = {
      id: updatedProduct._id.toString(),
      name: updatedProduct.name,
      description: updatedProduct.description || '',
      price: updatedProduct.prices?.retail || 0,
      cost: updatedProduct.prices?.dealer,
      images: updatedProduct.images || [],
      categoryId: updatedProduct.category?._id?.toString() || '',
      stock: updatedProduct.stock || 0,
      sku: updatedProduct.sku,
      createdAt: updatedProduct.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: updatedProduct.updatedAt?.toISOString() || new Date().toISOString(),
    }

    return NextResponse.json(
      { message: 'Product updated successfully', product: transformedProduct },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    const product = await Product.findByIdAndDelete(productId)
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { message: 'Product deleted successfully' },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

