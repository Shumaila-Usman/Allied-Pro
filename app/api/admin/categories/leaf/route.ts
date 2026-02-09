import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Category from '@/lib/models/Category'

export async function GET() {
  try {
    await connectDB()
    
    // Get all categories
    const allCategories = await Category.find({}).lean()
    
    // Find leaf categories (categories with no children)
    const leafCategories = []
    for (const cat of allCategories) {
      const hasChildren = await Category.findOne({ parent: cat._id })
      if (!hasChildren) {
        leafCategories.push({
          _id: cat._id.toString(),
          name: cat.name,
          slug: cat.slug,
          level: cat.level,
        })
      }
    }
    
    return NextResponse.json({ leafCategories }, { status: 200 })
  } catch (error) {
    console.error('Error fetching leaf categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leaf categories' },
      { status: 500 }
    )
  }
}

