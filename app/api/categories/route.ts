import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Category from '@/lib/models/Category'

// Helper function to build nested category tree
async function buildCategoryTree() {
  const allCategories = await Category.find({}).sort({ level: 1, name: 1 }).lean()
  
  // Create maps for quick lookup
  const categoryMap = new Map()
  const rootCategories: any[] = []
  
  // First pass: create all category objects
  for (const cat of allCategories) {
    const categoryObj = {
      id: cat._id.toString(),
      name: cat.name,
      slug: cat.slug,
      level: cat.level,
      subcategories: [],
    }
    categoryMap.set(cat._id.toString(), categoryObj)
    
    if (cat.level === 0) {
      rootCategories.push(categoryObj)
    }
  }
  
  // Second pass: build parent-child relationships
  for (const cat of allCategories) {
    const categoryObj = categoryMap.get(cat._id.toString())
    
    if (cat.parent) {
      const parentId = cat.parent.toString()
      const parent = categoryMap.get(parentId)
      if (parent) {
        if (cat.level === 1) {
          parent.subcategories = parent.subcategories || []
          parent.subcategories.push(categoryObj)
        } else if (cat.level === 2) {
          // Find the level 1 parent
          const level1Parent = allCategories.find(
            (c) => c._id.toString() === parentId
          )
          if (level1Parent && level1Parent.parent) {
            const rootParentId = level1Parent.parent.toString()
            const rootParent = categoryMap.get(rootParentId)
            if (rootParent) {
              const subcat = rootParent.subcategories.find(
                (s: any) => s.id === parentId
              )
              if (subcat) {
                subcat.secondSubcategories = subcat.secondSubcategories || []
                subcat.secondSubcategories.push(categoryObj)
              }
            }
          }
        }
      }
    }
  }
  
  return rootCategories
}

export async function GET() {
  try {
    await connectDB()
    const categories = await buildCategoryTree()
    return NextResponse.json({ categories })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}

