import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Product from '@/lib/models/Product'
import Category from '@/lib/models/Category'
import mongoose from 'mongoose'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    // Helper function to resolve all leaf categories for a root category
    const resolveRootCategoryLeafs = async (rootCategory: any, query: any) => {
      // Get all level 1 children
      const level1Children = await Category.find({ parent: rootCategory._id }).lean()
      console.log('Level 1 children:', level1Children.length)
      
      const leafCategories: mongoose.Types.ObjectId[] = []
      
      // Check each level 1 child
      for (const level1Child of level1Children) {
        // Check if level 1 child itself is a leaf (no children)
        const hasLevel1Children = await Category.findOne({ parent: level1Child._id })
        if (!hasLevel1Children) {
          // Level 1 child is a leaf - add it
          leafCategories.push(level1Child._id)
          console.log('  ✅ Level 1 leaf found:', level1Child.name, level1Child._id.toString())
        } else {
          // Get level 2 children (or deeper)
          const level2Children = await Category.find({ parent: level1Child._id }).lean()
          console.log('  - Level 1 has', level2Children.length, 'children:', level1Child.name)
          for (const level2Child of level2Children) {
            const hasLevel2Children = await Category.findOne({ parent: level2Child._id })
            if (!hasLevel2Children) {
              // Level 2 child is a leaf - add it
              leafCategories.push(level2Child._id)
              console.log('    ✅ Level 2 leaf found:', level2Child.name, level2Child._id.toString())
            }
          }
        }
      }
      
      console.log('Total leaf categories found:', leafCategories.length)
      console.log('Leaf category names:', leafCategories.map((id: any) => id.toString()).slice(0, 10), '...')
      
      // IMPORTANT: Only apply category filter if we have leaf categories
      if (leafCategories.length > 0) {
        // First, try new schema
        query.category = { $in: leafCategories }
        console.log('✅ Applied category filter with', leafCategories.length, 'leaf categories')
        
        // Verify products exist with these categories (new schema)
        const productCount = await Product.countDocuments({ category: { $in: leafCategories } })
        console.log('Products found with these categories (new schema):', productCount)
        
        // Also check old schema
        const leafIds = leafCategories.map(id => id.toString())
        const leafSlugs = leafCategories.map((id: any) => {
          // Try to get slug from category - we'll need to fetch categories
          return id.toString()
        })
        
        // Get leaf category slugs for old schema matching
        const leafCategoryDocs = await Category.find({ _id: { $in: leafCategories } }).select('slug').lean()
        const leafCategorySlugs = leafCategoryDocs.map((doc: any) => doc.slug)
        
        // Check old schema with both IDs and slugs
        const oldSchemaCount = await Product.countDocuments({ 
          $or: [
            { secondSubcategoryId: { $in: leafIds } },
            { secondsubcategoryId: { $in: leafIds } },
            { subcategoryId: { $in: leafIds } },
            { secondSubcategoryId: { $in: leafCategorySlugs } },
            { secondsubcategoryId: { $in: leafCategorySlugs } },
            { subcategoryId: { $in: leafCategorySlugs } }
          ]
        })
        console.log('Products found with these categories (old schema):', oldSchemaCount)
        
        // Also check for products with categoryId matching root category slug
        const rootCategorySlug = rootCategory.slug || rootCategory.name?.toLowerCase().replace(/\s+/g, '-')
        const rootCategoryIdCount = await Product.countDocuments({ 
          categoryId: rootCategorySlug 
        })
        console.log('Products found with categoryId matching root slug:', rootCategoryIdCount, 'slug:', rootCategorySlug)
        
        // If new schema has no products but old schema does, switch to old schema
        if (productCount === 0 && (oldSchemaCount > 0 || rootCategoryIdCount > 0)) {
          console.log('⚠️ No products found with new schema, switching to old schema')
          delete query.category
          
          // Build $or conditions for old schema
          const oldSchemaConditions: any[] = []
          
          if (oldSchemaCount > 0) {
            oldSchemaConditions.push(
              { secondSubcategoryId: { $in: leafIds } },
              { secondsubcategoryId: { $in: leafIds } },
              { subcategoryId: { $in: leafIds } },
              { secondSubcategoryId: { $in: leafCategorySlugs } },
              { secondsubcategoryId: { $in: leafCategorySlugs } },
              { subcategoryId: { $in: leafCategorySlugs } }
            )
          }
          
          if (rootCategoryIdCount > 0) {
            oldSchemaConditions.push({ categoryId: rootCategorySlug })
          }
          
          if (oldSchemaConditions.length > 0) {
            if (!query.$and) {
              query.$and = []
            }
            query.$and.push({ $or: oldSchemaConditions })
            console.log('✅ Switched to old schema query with', oldSchemaConditions.length, 'conditions')
          }
        }
      } else {
        console.log('WARNING: No leaf categories found - trying root category slug directly')
        // Try to find products with categoryId matching root category slug
        const rootCategorySlug = rootCategory.slug || rootCategory.name?.toLowerCase().replace(/\s+/g, '-')
        const rootCategoryIdCount = await Product.countDocuments({ categoryId: rootCategorySlug })
        console.log('Products found with categoryId matching root slug:', rootCategoryIdCount, 'slug:', rootCategorySlug)
        
        if (rootCategoryIdCount > 0) {
          if (!query.$and) {
            query.$and = []
          }
          query.$and.push({ categoryId: rootCategorySlug })
          console.log('✅ Applied old schema filter with root category slug:', rootCategorySlug)
        }
      }
    }
    
    // STEP 1: Log database and collection info
    const mongoose = require('mongoose')
    console.log('=== DATABASE DEBUG INFO ===')
    console.log('DB name:', mongoose.connection.name)
    console.log('DB state:', mongoose.connection.readyState)
    console.log('Collection name:', Product.collection.name)
    console.log('==========================')
    
    // STEP 2: Test products without any filters
    const productsWithoutFilters = await Product.find({}).limit(5).lean()
    console.log('=== PRODUCTS WITHOUT FILTERS ===')
    console.log('Products count (no filters, limit 5):', productsWithoutFilters.length)
    if (productsWithoutFilters.length > 0) {
      console.log('Sample product:', {
        _id: productsWithoutFilters[0]._id,
        name: productsWithoutFilters[0].name,
        category: productsWithoutFilters[0].category,
        isActive: productsWithoutFilters[0].isActive
      })
    }
    console.log('================================')
    
    // STEP 3: Count total products in database
    const totalProductsInDB = await Product.countDocuments({})
    console.log('=== TOTAL PRODUCTS IN DB ===')
    console.log('Total products (no filters):', totalProductsInDB)
    console.log('============================')
    
    const searchParams = request.nextUrl.searchParams
    // Support both old format (categoryId) and new format (category) from navbar
    const categoryId = searchParams.get('categoryId') || searchParams.get('category')
    const subcategoryId = searchParams.get('subcategoryId') || searchParams.get('subcategory')
    const secondSubcategoryId = searchParams.get('secondSubcategoryId') || searchParams.get('secondSubcategory')
    
    // Debug: Log navbar parameters
    console.log('=== NAVBAR PARAMS DEBUG ===')
    console.log('Navbar params:', { 
      category: searchParams.get('category'),
      subcategory: searchParams.get('subcategory'),
      secondSubcategory: searchParams.get('secondSubcategory'),
      categoryId: searchParams.get('categoryId'),
      subcategoryId: searchParams.get('subcategoryId'),
      secondSubcategoryId: searchParams.get('secondSubcategoryId')
    })
    console.log('Resolved to:', { categoryId, subcategoryId, secondSubcategoryId })
    console.log('===========================')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')

    // Build query - REMOVED hard isActive filter
    let query: any = {}
    
    // STEP 4: Check isActive field existence
    const productsWithIsActive = await Product.countDocuments({ isActive: true })
    const productsWithoutIsActive = await Product.countDocuments({ isActive: { $exists: false } })
    const productsWithIsActiveFalse = await Product.countDocuments({ isActive: false })
    console.log('=== ISACTIVE FIELD CHECK ===')
    console.log('Products with isActive: true:', productsWithIsActive)
    console.log('Products with isActive: false:', productsWithIsActiveFalse)
    console.log('Products without isActive field:', productsWithoutIsActive)
    console.log('===========================')
    
    // Check if products use old schema (categoryId, subcategoryId, secondSubcategoryId as strings)
    const sampleProduct = await Product.findOne({}).lean()
    const usesOldSchema = sampleProduct && (sampleProduct as any).secondSubcategoryId && typeof (sampleProduct as any).secondSubcategoryId === 'string'
    
    // If no products exist, default to new schema
    if (!sampleProduct) {
      console.log('⚠️ No products found in database - defaulting to new schema')
    }
    console.log('=== SCHEMA CHECK ===')
    console.log('Uses old schema (categoryId strings):', usesOldSchema)
    if (sampleProduct) {
      console.log('Sample product fields:', Object.keys(sampleProduct))
      console.log('Has secondSubcategoryId:', !!(sampleProduct as any).secondSubcategoryId)
      console.log('Has category field:', !!(sampleProduct as any).category)
    }
    console.log('===================')
    
    // Use flexible isActive filter - include products with isActive: true OR no isActive field
    // We'll add this to $and array to combine with other filters
    const isActiveCondition = {
      $or: [
        { isActive: true },
        { isActive: { $exists: false } }
      ]
    }
    
    // Debug logging
    if (categoryId) {
      console.log('=== CATEGORY FILTER DEBUG ===')
      console.log('Category ID received:', categoryId)
    }

    // ✅ PREFERRED FIX: Handle category filtering with priority to secondSubcategory (leaf category)
    // Priority: secondSubcategory > subcategory > category
    // Also handle old schema where products have categoryId/subcategoryId/secondSubcategoryId as strings
    
    // Get native MongoDB collection for queries (needed for both old and new schema in some cases)
    const db = mongoose.connection.db
    if (!db) {
      throw new Error('Database connection not available')
    }
    const productsCollection = db.collection('products')
    
    // PRIORITY FIX: If we have categoryId (root category only), try new schema first
    let categoryHandled = false
    if (categoryId && !subcategoryId && !secondSubcategoryId) {
      // NEW SCHEMA PATH: Handle root category directly with new schema approach
      console.log('=== TRYING NEW SCHEMA QUERY FIRST (root category) ===')
      
      // Find root category
      let rootCategory = await Category.findOne({ slug: categoryId, level: 0 })
      if (!rootCategory) {
        rootCategory = await Category.findOne({ slug: { $regex: `^${categoryId}`, $options: 'i' }, level: 0 })
      }
      if (!rootCategory) {
        const categoryName = categoryId.replace(/-/g, ' ').toUpperCase()
        rootCategory = await Category.findOne({ 
          name: { $regex: new RegExp(`^${categoryName}`, 'i') },
          level: 0 
        })
      }
      
      if (rootCategory) {
        console.log('✅ Root category found:', rootCategory.name, 'ID:', rootCategory._id.toString())
        
        // Get ALL descendant categories recursively
        const getAllDescendantIds = async (parentId: mongoose.Types.ObjectId): Promise<mongoose.Types.ObjectId[]> => {
          const children = await Category.find({ parent: parentId }).lean()
          let allIds: mongoose.Types.ObjectId[] = [parentId]
          for (const child of children) {
            const childIds = await getAllDescendantIds(child._id)
            allIds = allIds.concat(childIds)
          }
          return allIds
        }
        
        const allCategoryIds = await getAllDescendantIds(rootCategory._id)
        console.log('✅ All category IDs (root + descendants):', allCategoryIds.length)
        
        // Use simple query with new schema
        if (allCategoryIds.length > 0) {
          // Test query first (without isActive)
          const testQueryNoActive = { category: { $in: allCategoryIds } }
          const testCountNoActive = await productsCollection.countDocuments(testQueryNoActive)
          console.log('✅ Test: Products with category field (new schema, no isActive):', testCountNoActive)
          
          // Test with isActive
          const testQuery = { 
            $and: [
              { category: { $in: allCategoryIds } },
              isActiveCondition
            ]
          }
          const testCount = await productsCollection.countDocuments(testQuery)
          console.log('✅ Test: Products with category field (new schema, with isActive):', testCount)
          
          if (testCount > 0) {
            // Use simple query with isActive
            if (!query.$and) {
              query.$and = []
            }
            query.$and.push({ category: { $in: allCategoryIds } })
            console.log('✅ Applied new schema category filter (with isActive)')
            categoryHandled = true
          } else if (testCountNoActive > 0) {
            // Use simple query without isActive
            if (!query.$and) {
              query.$and = []
            }
            query.$and.push({ category: { $in: allCategoryIds } })
            console.log('✅ Applied new schema category filter (without isActive)')
            categoryHandled = true
          } else {
            console.log('⚠️ No products with new schema, will try old schema...')
          }
        }
      }
    }
    
    // Only use old schema path if category wasn't handled by new schema OR if we have subcategory/secondSubcategory
    if (!categoryHandled) {
      // OLD SCHEMA: Products have categoryId, subcategoryId, secondSubcategoryId as string ObjectIds
      console.log('=== USING OLD SCHEMA QUERY ===')
      
      if (secondSubcategoryId) {
        // Find category by slug, get its ObjectId, then query products by secondSubcategoryId
        let leafCategory = null
        
        // Try to find category by slug - try multiple formats
        // FIRST try full compound slug (category-subcategory-secondSubcategory) - this is how seed script stores it
        if (categoryId && subcategoryId) {
          const compoundSlug2 = `${categoryId}-${subcategoryId}-${secondSubcategoryId}`
          leafCategory = await Category.findOne({ slug: compoundSlug2 })
          console.log('Trying compound slug FIRST (category-subcategory-secondSubcategory):', compoundSlug2, 'Found:', !!leafCategory)
        }
        
        // Then try compound slug if we have subcategory
        if (!leafCategory && subcategoryId) {
          const compoundSlug1 = `${subcategoryId}-${secondSubcategoryId}`
          leafCategory = await Category.findOne({ slug: compoundSlug1 })
          console.log('Trying compound slug (subcategory-secondSubcategory):', compoundSlug1, 'Found:', !!leafCategory)
        }
        
        // Try exact slug match - check both level 1 and level 2 (some secondSubcategories are level 1)
        if (!leafCategory) {
          leafCategory = await Category.findOne({ slug: secondSubcategoryId, level: { $in: [1, 2] } })
          console.log('Trying exact slug (level 1 or 2):', secondSubcategoryId, 'Found:', !!leafCategory)
        }
        
        // Try regex match (ends with) - check both levels
        if (!leafCategory) {
          leafCategory = await Category.findOne({ slug: { $regex: `${secondSubcategoryId}$`, $options: 'i' }, level: { $in: [1, 2] } })
          console.log('Trying regex (ends with, level 1 or 2):', secondSubcategoryId, 'Found:', !!leafCategory)
        }
        
        // Try contains match - check both levels
        if (!leafCategory) {
          leafCategory = await Category.findOne({ slug: { $regex: secondSubcategoryId, $options: 'i' }, level: { $in: [1, 2] } })
          console.log('Trying regex (contains, level 1 or 2):', secondSubcategoryId, 'Found:', !!leafCategory)
        }
        
        // Try name match as last resort - check both levels
        if (!leafCategory) {
          const namePattern = secondSubcategoryId.replace(/-/g, ' ')
          leafCategory = await Category.findOne({ 
            name: { $regex: new RegExp(`^${namePattern}`, 'i') },
            level: { $in: [1, 2] }
          })
          console.log('Trying name match (level 1 or 2):', namePattern, 'Found:', !!leafCategory)
        }
        
        if (leafCategory) {
          const categoryObjectId = leafCategory._id.toString()
          
          // Extract possible slug values from the category slug
          const slugParts = leafCategory.slug.split('-')
          const lastPart = slugParts[slugParts.length - 1]
          const possibleSlugs = [
            lastPart, // e.g., "pedicure-tools"
            leafCategory.slug, // full slug
            ...(slugParts.length > 1 ? [slugParts.slice(-2).join('-')] : []) // last 2 parts
          ]
          
          // Check which format products use - check both camelCase and lowercase field names
          const countByIdCamel = await Product.countDocuments({ secondSubcategoryId: categoryObjectId })
          const countByIdLower = await Product.countDocuments({ secondsubcategoryId: categoryObjectId })
          const countBySlugCamel = await Product.countDocuments({ secondSubcategoryId: { $in: possibleSlugs } })
          const countBySlugLower = await Product.countDocuments({ secondsubcategoryId: { $in: possibleSlugs } })
          
          console.log('Products with ObjectId (camelCase):', countByIdCamel)
          console.log('Products with ObjectId (lowercase):', countByIdLower)
          console.log('Products with slug (camelCase):', countBySlugCamel)
          console.log('Products with slug (lowercase):', countBySlugLower)
          console.log('Possible slugs:', possibleSlugs)
          
          // Build $or conditions for both field names
          const orConditions: any[] = []
          
          // Use whichever has products, or try both
          if (countBySlugCamel > 0 || countBySlugLower > 0) {
            if (possibleSlugs.length > 0) {
              orConditions.push({ secondSubcategoryId: { $in: possibleSlugs } })
              orConditions.push({ secondsubcategoryId: { $in: possibleSlugs } })
            }
            console.log('✅ Querying by secondSubcategoryId/secondsubcategoryId (slugs):', possibleSlugs, 'Category:', leafCategory.name)
          } else if (countByIdCamel > 0 || countByIdLower > 0) {
            orConditions.push({ secondSubcategoryId: categoryObjectId })
            orConditions.push({ secondsubcategoryId: categoryObjectId })
            console.log('✅ Querying by secondSubcategoryId/secondsubcategoryId (ObjectId):', categoryObjectId, 'Category:', leafCategory.name)
          } else {
            // Try both ObjectId and slugs with both field names
            orConditions.push({ secondSubcategoryId: categoryObjectId })
            orConditions.push({ secondsubcategoryId: categoryObjectId })
            if (possibleSlugs.length > 0) {
              orConditions.push({ secondSubcategoryId: { $in: possibleSlugs } })
              orConditions.push({ secondsubcategoryId: { $in: possibleSlugs } })
            }
            console.log('✅ Querying by secondSubcategoryId/secondsubcategoryId (both ObjectId and slugs)')
          }
          
          if (orConditions.length > 0) {
            // Add to $and array if it exists, otherwise create it
            if (!query.$and) {
              query.$and = []
            }
            query.$and.push({ $or: orConditions })
          }
          
          // Verify products exist
          const productCount = await Product.countDocuments(query)
          console.log('Total products found:', productCount)
        } else {
          console.log('❌ Leaf category not found for:', secondSubcategoryId)
          // List available level 2 categories for debugging
          const available = await Category.find({ level: 2 }).select('name slug').limit(5).lean()
          console.log('Available level 2 categories:', available.map((c: any) => ({ name: c.name, slug: c.slug })))
        }
      } else if (subcategoryId) {
        // Find subcategory, get all its leaf children, query products by those secondSubcategoryIds
        let subcategory = null
        
        // IMPORTANT: Try compound slug FIRST if we have categoryId (category-subcategory format)
        // This is the most reliable way since that's how slugs are stored in the database
        if (categoryId) {
          const compoundSlug = `${categoryId}-${subcategoryId}`
          subcategory = await Category.findOne({ slug: compoundSlug, level: 1 })
          console.log('Trying compound slug FIRST (category-subcategory):', compoundSlug, 'Found:', !!subcategory)
        }
        
        // If compound slug didn't work, try finding by parent
        if (!subcategory && categoryId) {
          // First, find the root category
          let rootCategory = await Category.findOne({ slug: categoryId, level: 0 })
          if (!rootCategory) {
            rootCategory = await Category.findOne({ slug: { $regex: categoryId, $options: 'i' }, level: 0 })
          }
          
          if (rootCategory) {
            // Find subcategory with this specific parent
            subcategory = await Category.findOne({ 
              slug: subcategoryId, 
              parent: rootCategory._id,
              level: 1 
            })
            console.log('Looking for subcategory:', subcategoryId, 'under parent:', rootCategory.name, 'Found:', !!subcategory)
            
            // If not found by exact slug, try regex
            if (!subcategory) {
              subcategory = await Category.findOne({ 
                slug: { $regex: subcategoryId, $options: 'i' }, 
                parent: rootCategory._id,
                level: 1 
              })
              console.log('Trying regex match for subcategory under parent, Found:', !!subcategory)
            }
          }
        }
        
        // Fallback: If no categoryId or subcategory not found, try without parent constraint
        if (!subcategory) {
          subcategory = await Category.findOne({ slug: { $regex: subcategoryId, $options: 'i' }, level: 1 })
          console.log('Fallback: Finding subcategory without parent constraint, Found:', !!subcategory)
        }
        
        if (subcategory) {
          // Get all children (both level 1 and level 2)
          const allChildren = await Category.find({ parent: subcategory._id }).lean()
          console.log('Subcategory children found:', allChildren.length, allChildren.map((c: any) => ({ name: c.name, level: c.level, id: c._id.toString(), slug: c.slug })))
          
          // Find leaf categories: categories with no children (regardless of level)
          const leafCategoryIds: string[] = []
          const leafCategorySlugs: string[] = []
          
          for (const child of allChildren) {
            const hasGrandChildren = await Category.findOne({ parent: child._id })
            if (!hasGrandChildren) {
              // This child is a leaf - add both ID and slug
              leafCategoryIds.push(child._id.toString())
              // Extract slug from the full slug (e.g., "nail-products-tools-equipment-pedicure-tools" -> "pedicure-tools")
              const slugParts = child.slug.split('-')
              const lastPart = slugParts[slugParts.length - 1]
              leafCategorySlugs.push(lastPart)
              // Also try the full slug and partial slugs
              leafCategorySlugs.push(child.slug)
              if (slugParts.length > 1) {
                leafCategorySlugs.push(slugParts.slice(-2).join('-')) // last 2 parts
              }
              console.log('  ✅ Leaf child found:', child.name, 'ID:', child._id.toString(), 'Slug:', child.slug, 'Last part:', lastPart)
            } else {
              console.log('  ⚠️ Child has grandchildren:', child.name)
            }
          }
          
          console.log('Total leaf categories found:', leafCategoryIds.length)
          console.log('Leaf category slugs to try:', leafCategorySlugs)
          
          if (leafCategoryIds.length > 0) {
            // IMPORTANT: Check BOTH old schema (secondSubcategoryId) AND new schema (category field)
            // Convert string IDs to ObjectIds for new schema
            const leafObjectIds = leafCategoryIds.map(id => {
              try {
                return new mongoose.Types.ObjectId(id)
              } catch (e) {
                console.log('⚠️ Invalid ObjectId:', id)
                return null
              }
            }).filter(id => id !== null)
            
            // Check new schema (category field)
            const productCountByCategory = leafObjectIds.length > 0 
              ? await Product.countDocuments({ category: { $in: leafObjectIds } })
              : 0
            
            // Check old schema fields
            const productCountByIdsCamel = await Product.countDocuments({ secondSubcategoryId: { $in: leafCategoryIds } })
            const productCountByIdsLower = await Product.countDocuments({ secondsubcategoryId: { $in: leafCategoryIds } })
            const productCountBySlugsCamel = await Product.countDocuments({ secondSubcategoryId: { $in: leafCategorySlugs } })
            const productCountBySlugsLower = await Product.countDocuments({ secondsubcategoryId: { $in: leafCategorySlugs } })
            
            console.log('Products found with category field (new schema):', productCountByCategory)
            console.log('Products found with ObjectIds (camelCase):', productCountByIdsCamel)
            console.log('Products found with ObjectIds (lowercase):', productCountByIdsLower)
            console.log('Products found with slugs (camelCase):', productCountBySlugsCamel)
            console.log('Products found with slugs (lowercase):', productCountBySlugsLower)
            
            // Build $or conditions for both old and new schema
            const orConditions: any[] = []
            
            // NEW SCHEMA: Add category field check
            if (leafObjectIds.length > 0) {
              orConditions.push({ category: { $in: leafObjectIds } })
            }
            
            // OLD SCHEMA: Check which format works
            if (productCountBySlugsCamel > 0 || productCountBySlugsLower > 0) {
              // Use slugs - check both field names
              if (leafCategorySlugs.length > 0) {
                orConditions.push({ secondSubcategoryId: { $in: leafCategorySlugs } })
                orConditions.push({ secondsubcategoryId: { $in: leafCategorySlugs } })
              }
              console.log('✅ Querying by secondSubcategoryId/secondsubcategoryId (slugs):', leafCategorySlugs.length, 'slugs')
            } else if (productCountByIdsCamel > 0 || productCountByIdsLower > 0) {
              // Use ObjectIds - check both field names
              if (leafCategoryIds.length > 0) {
                orConditions.push({ secondSubcategoryId: { $in: leafCategoryIds } })
                orConditions.push({ secondsubcategoryId: { $in: leafCategoryIds } })
              }
              console.log('✅ Querying by secondSubcategoryId/secondsubcategoryId (ObjectIds):', leafCategoryIds.length, 'categories')
            } else {
              // Try both ObjectIds and slugs with both field names (fallback)
              if (leafCategoryIds.length > 0) {
                orConditions.push({ secondSubcategoryId: { $in: leafCategoryIds } })
                orConditions.push({ secondsubcategoryId: { $in: leafCategoryIds } })
              }
              if (leafCategorySlugs.length > 0) {
                orConditions.push({ secondSubcategoryId: { $in: leafCategorySlugs } })
                orConditions.push({ secondsubcategoryId: { $in: leafCategorySlugs } })
              }
              console.log('✅ Querying by secondSubcategoryId/secondsubcategoryId (both ObjectIds and slugs)')
            }
            
            console.log('✅ Total conditions in $or:', orConditions.length, '(includes both old and new schema)')
            
            if (orConditions.length > 0) {
              // Initialize $and if it doesn't exist
              if (!query.$and) {
                query.$and = []
              }
              query.$and.push({ $or: orConditions })
            }
            
            // Verify products exist
            const productCount = await Product.countDocuments(query)
            console.log('Total products found with query:', productCount)
          } else {
            // Check if subcategory itself is a leaf (no children at all)
            if (allChildren.length === 0) {
              // Subcategory is a leaf - check if products are stored with subcategoryId or secondSubcategoryId
              const subcategoryIdStr = subcategory._id.toString()
              
              // Use native collection for old schema to check fields not in Mongoose schema
              // productsCollection is already defined at the top of the old schema block
              
              // Check products with subcategoryId (also try slug variants)
              const possibleSubcategoryIds = [
                subcategoryIdStr,
                subcategory.slug,
                subcategory.slug.split('-').pop() // last part of slug
              ]
              const productsWithSubcategoryId = await productsCollection.countDocuments({ 
                subcategoryId: { $in: possibleSubcategoryIds }
              })
              // Check products with secondSubcategoryId (both camelCase and lowercase)
              const productsWithSecondSubcategoryIdCamel = await productsCollection.countDocuments({ secondSubcategoryId: { $in: possibleSubcategoryIds } })
              const productsWithSecondSubcategoryIdLower = await productsCollection.countDocuments({ secondsubcategoryId: { $in: possibleSubcategoryIds } })
              const productsWithSecondSubcategoryId = productsWithSecondSubcategoryIdCamel + productsWithSecondSubcategoryIdLower
              
              // Check new schema (category field)
              const subcategoryObjectId = new mongoose.Types.ObjectId(subcategoryIdStr)
              const productsWithCategory = await Product.countDocuments({ category: subcategoryObjectId })
              
              console.log('Products with category field (new schema):', productsWithCategory)
              console.log('Products with subcategoryId:', productsWithSubcategoryId)
              console.log('Products with secondSubcategoryId (camelCase):', productsWithSecondSubcategoryIdCamel)
              console.log('Products with secondsubcategoryId (lowercase):', productsWithSecondSubcategoryIdLower)
              
              // Build $or conditions for both old and new schema
              const orConditions: any[] = []
              
              // NEW SCHEMA: Add category field check
              orConditions.push({ category: subcategoryObjectId })
              
              // OLD SCHEMA: Check which field has products
              if (productsWithSecondSubcategoryId > 0) {
                // Products are stored with secondSubcategoryId/secondsubcategoryId - use that
                orConditions.push({ secondSubcategoryId: { $in: possibleSubcategoryIds } })
                orConditions.push({ secondsubcategoryId: { $in: possibleSubcategoryIds } })
                console.log('✅ Subcategory is a leaf - querying by secondSubcategoryId/secondsubcategoryId:', possibleSubcategoryIds)
                console.log('Products found (old schema):', productsWithSecondSubcategoryId)
              } else if (productsWithSubcategoryId > 0) {
                // Products are stored with subcategoryId - use that
                orConditions.push({ subcategoryId: { $in: possibleSubcategoryIds } })
                console.log('✅ Subcategory is a leaf - querying by subcategoryId:', possibleSubcategoryIds)
                console.log('Products found (old schema):', productsWithSubcategoryId)
              } else {
                // Fallback: try all old schema fields even if no products found (might be new schema only)
                orConditions.push({ secondSubcategoryId: { $in: possibleSubcategoryIds } })
                orConditions.push({ secondsubcategoryId: { $in: possibleSubcategoryIds } })
                orConditions.push({ subcategoryId: { $in: possibleSubcategoryIds } })
                console.log('⚠️ No products found with old schema fields, trying all as fallback')
              }
              
              if (orConditions.length > 0) {
                if (!query.$and) {
                  query.$and = []
                }
                query.$and.push({ $or: orConditions })
                console.log('✅ Subcategory is a leaf - query includes both old and new schema')
                console.log('Total products found:', productsWithCategory + productsWithSecondSubcategoryId + productsWithSubcategoryId)
              } else {
                console.log('❌ WARNING: No query conditions created')
              }
            } else {
              console.log('❌ WARNING: Subcategory has children but none are leaves - this should not happen!')
            }
          }
        }
      } else if (categoryId) {
        // Find root category, get all leaf descendants, query products by those secondSubcategoryIds
        let rootCategory = null
        
        console.log('🔍 Looking for root category with categoryId:', categoryId)
        
        // Try to find root category by slug (exact match)
        rootCategory = await Category.findOne({ slug: categoryId, level: 0 })
        console.log('  - Exact slug match:', rootCategory ? `Found: ${rootCategory.name}` : 'Not found')
        
        // Try case-insensitive slug match
        if (!rootCategory) {
          rootCategory = await Category.findOne({ slug: { $regex: `^${categoryId}$`, $options: 'i' }, level: 0 })
          console.log('  - Case-insensitive slug match:', rootCategory ? `Found: ${rootCategory.name}` : 'Not found')
        }
        
        // Try partial slug match (starts with)
        if (!rootCategory) {
          rootCategory = await Category.findOne({ slug: { $regex: `^${categoryId}`, $options: 'i' }, level: 0 })
          console.log('  - Partial slug match (starts with):', rootCategory ? `Found: ${rootCategory.name}` : 'Not found')
        }
        
        // If not found, try to find by name (case insensitive)
        if (!rootCategory) {
          const categoryName = categoryId.replace(/-/g, ' ').toUpperCase()
          rootCategory = await Category.findOne({ 
            name: { $regex: new RegExp(`^${categoryName}`, 'i') },
            level: 0 
          })
          console.log('  - Name match:', rootCategory ? `Found: ${rootCategory.name}` : 'Not found')
        }
        
        // If still not found, check if categoryId is actually a subcategory or leaf category
        // and find its root parent
        if (!rootCategory) {
          let foundCategory = await Category.findOne({ 
            $or: [
              { slug: categoryId },
              { slug: { $regex: categoryId, $options: 'i' } }
            ]
          })
          
          if (foundCategory) {
            console.log('  - Found as subcategory/leaf, traversing up to root...')
            // Traverse up to find root category
            let current = foundCategory
            while (current && current.parent) {
              const parent = await Category.findById(current.parent)
              if (parent && parent.level === 0) {
                rootCategory = parent
                console.log('  - Found root parent:', rootCategory.name)
                break
              }
              if (parent) {
                current = parent
              } else {
                break
              }
            }
          }
        }
        
        if (rootCategory) {
          console.log('✅ Root category found:', rootCategory.name, 'ID:', rootCategory._id.toString(), 'Slug:', rootCategory.slug)
          
          // SIMPLIFIED APPROACH: Get ALL descendant categories recursively (not just leaves)
          // This ensures we catch all products regardless of which level category they're stored with
          const getAllDescendantIds = async (parentId: mongoose.Types.ObjectId): Promise<mongoose.Types.ObjectId[]> => {
            const children = await Category.find({ parent: parentId }).lean()
            let allIds: mongoose.Types.ObjectId[] = [parentId] // Include parent itself
            
            for (const child of children) {
              const childIds = await getAllDescendantIds(child._id)
              allIds = allIds.concat(childIds)
            }
            
            return allIds
          }
          
          const allCategoryIds = await getAllDescendantIds(rootCategory._id)
          console.log('✅ All category IDs (root + all descendants):', allCategoryIds.length)
          
          // Get all descendants recursively and find leaf categories (for old schema compatibility)
          const allLeafIds: string[] = []
          const allSubcategoryIds: string[] = [] // Level 1 subcategories
          const rootCategoryId = rootCategory._id.toString()
          
          // Get level 1 children
          const level1Children = await Category.find({ parent: rootCategory._id }).lean()
          
          for (const level1Child of level1Children) {
            // Add level 1 subcategory ID
            allSubcategoryIds.push(level1Child._id.toString())
            
            // Check if level 1 child itself is a leaf
            const hasLevel1Children = await Category.findOne({ parent: level1Child._id })
            if (!hasLevel1Children) {
              allLeafIds.push(level1Child._id.toString())
            } else {
              // Get level 2 children (or deeper)
              const level2Children = await Category.find({ parent: level1Child._id }).lean()
              for (const level2Child of level2Children) {
                const hasLevel2Children = await Category.findOne({ parent: level2Child._id })
                if (!hasLevel2Children) {
                  allLeafIds.push(level2Child._id.toString())
                }
              }
            }
          }
          
          // Get exact slugs for subcategories and leaf categories
          // Also extract partial slugs (last part) since products might store just the leaf name
          const allSubcategorySlugs: string[] = []
          const allLeafSlugs: string[] = []
          
          for (const level1Child of level1Children) {
            // Add exact slug
            allSubcategorySlugs.push(level1Child.slug)
            // Also add partial slug (last part) for matching
            const subSlugParts = level1Child.slug.split('-')
            if (subSlugParts.length > 1) {
              allSubcategorySlugs.push(subSlugParts[subSlugParts.length - 1]) // last part
            }
            
            const hasLevel1Children = await Category.findOne({ parent: level1Child._id })
            if (!hasLevel1Children) {
              // Level 1 child is a leaf
              allLeafSlugs.push(level1Child.slug)
              // Also add partial slug
              const leafSlugParts = level1Child.slug.split('-')
              if (leafSlugParts.length > 1) {
                allLeafSlugs.push(leafSlugParts[leafSlugParts.length - 1]) // last part
                // Also try last 2 parts
                if (leafSlugParts.length > 2) {
                  allLeafSlugs.push(leafSlugParts.slice(-2).join('-'))
                }
              }
            } else {
              // Get level 2 children (leaf categories)
              const level2Children = await Category.find({ parent: level1Child._id }).lean()
              for (const level2Child of level2Children) {
                allLeafSlugs.push(level2Child.slug)
                // Also add partial slug (last part) for matching
                const leafSlugParts = level2Child.slug.split('-')
                if (leafSlugParts.length > 1) {
                  allLeafSlugs.push(leafSlugParts[leafSlugParts.length - 1]) // last part
                  // Also try last 2 parts
                  if (leafSlugParts.length > 2) {
                    allLeafSlugs.push(leafSlugParts.slice(-2).join('-'))
                  }
                }
              }
            }
          }
          
          // Remove duplicates
          const uniqueLeafSlugs = Array.from(new Set(allLeafSlugs))
          const uniqueSubcategorySlugs = Array.from(new Set(allSubcategorySlugs))
          
          // Build $or conditions for all possible field combinations
          // IMPORTANT: Check BOTH old schema (categoryId/subcategoryId/secondSubcategoryId) AND new schema (category)
          const orConditions: any[] = []
          
          // Build comprehensive list of all leaf category IDs (including subcategories that are leaves)
          const allLeafCategoryIds = Array.from(new Set(allLeafIds)) // Start with level 2 leaves
          
          // IMPORTANT: Also include root category ID in case some products are stored with root category
          if (!allLeafCategoryIds.includes(rootCategoryId)) {
            allLeafCategoryIds.push(rootCategoryId)
            console.log('✅ Added root category ID to leaf list:', rootCategoryId)
          }
          
          // Also check if any subcategories are leaves (no children) - important for furniture
          for (const subId of allSubcategoryIds) {
            const hasChildren = await Category.findOne({ parent: new mongoose.Types.ObjectId(subId) })
            if (!hasChildren) {
              // This subcategory is a leaf, add it to the leaf list
              if (!allLeafCategoryIds.includes(subId)) {
                allLeafCategoryIds.push(subId)
                console.log('✅ Found leaf subcategory:', subId)
              }
            }
          }
          
          console.log('Total leaf categories (including root and leaf subcategories):', allLeafCategoryIds.length)
          console.log('Leaf IDs:', allLeafCategoryIds.slice(0, 10), '...')
          
          // NEW SCHEMA: Check by category field (ObjectId pointing to ANY category in the tree)
          // Use ALL category IDs (root + all descendants) for maximum coverage
          // This is the PRIMARY query - should catch all products
          if (allCategoryIds.length > 0) {
            orConditions.push({ category: { $in: allCategoryIds } })
            console.log('✅ Added new schema category filter with', allCategoryIds.length, 'category ObjectIds (root + all descendants)')
            
            // Test this query immediately to see if it works
            const testQuery = { 
              $and: [
                { category: { $in: allCategoryIds } },
                isActiveCondition
              ]
            }
            const testCount = await productsCollection.countDocuments(testQuery)
            console.log('✅ Test: Products with category field (new schema, all categories):', testCount)
            
            // Also test without isActive
            const testQueryNoActive = { category: { $in: allCategoryIds } }
            const testCountNoActive = await productsCollection.countDocuments(testQueryNoActive)
            console.log('✅ Test: Products with category field (no isActive):', testCountNoActive)
          }
          
          // OLD SCHEMA: Check by categoryId (ObjectId or slug)
          orConditions.push({ categoryId: rootCategoryId })
          orConditions.push({ categoryId: categoryId })
          
          // OLD SCHEMA: Check by subcategoryId (ObjectIds and slugs)
          // IMPORTANT: Also check subcategoryId because some products might be stored with subcategoryId
          // pointing to the subcategory itself (especially when subcategories are leaves like in furniture)
          if (allSubcategoryIds.length > 0) {
            orConditions.push({ subcategoryId: { $in: allSubcategoryIds } })
            console.log('✅ Added subcategoryId filter with', allSubcategoryIds.length, 'subcategory IDs')
          }
          if (uniqueSubcategorySlugs.length > 0) {
            orConditions.push({ subcategoryId: { $in: uniqueSubcategorySlugs } })
            console.log('✅ Added subcategoryId filter with', uniqueSubcategorySlugs.length, 'subcategory slugs')
          }
          
          // OLD SCHEMA: Check by secondSubcategoryId (ObjectIds and slugs, both camelCase and lowercase)
          // IMPORTANT: Use allLeafCategoryIds which includes both level 2 leaves AND level 1 leaves (subcategories that are leaves)
          if (allLeafCategoryIds.length > 0) {
            orConditions.push({ secondSubcategoryId: { $in: allLeafCategoryIds } })
            orConditions.push({ secondsubcategoryId: { $in: allLeafCategoryIds } })
            console.log('✅ Added secondSubcategoryId filter with', allLeafCategoryIds.length, 'leaf category IDs')
          }
          if (uniqueLeafSlugs.length > 0) {
            orConditions.push({ secondSubcategoryId: { $in: uniqueLeafSlugs } })
            orConditions.push({ secondsubcategoryId: { $in: uniqueLeafSlugs } })
            console.log('✅ Added secondSubcategoryId filter with', uniqueLeafSlugs.length, 'leaf slugs')
          }
          
          // PRIORITY: If we have allCategoryIds, use a simpler query that prioritizes new schema
          if (allCategoryIds.length > 0) {
            // Build a simpler query that prioritizes the category field (new schema)
            const simpleCategoryQuery = {
              $and: [
                { category: { $in: allCategoryIds } },
                isActiveCondition
              ]
            }
            
            // Test this query first
            const simpleCount = await productsCollection.countDocuments(simpleCategoryQuery)
            console.log('✅ Test: Simple category query (new schema):', simpleCount)
            
            if (simpleCount > 0) {
              // Use the simple query - it works!
              console.log('✅ Using simple category query (new schema only)')
              if (!query.$and) {
                query.$and = []
              }
              // Replace any existing category filters with the simple one
              query.$and = query.$and.filter((cond: any) => 
                !cond || !cond.$or || !cond.$or.some((orCond: any) => orCond.category)
              )
              query.$and.push({ category: { $in: allCategoryIds } })
            } else {
              // Simple query didn't work, use the complex one with all conditions
              if (orConditions.length > 0) {
                if (!query.$and) {
                  query.$and = []
                }
                query.$and.push({ $or: orConditions })
                console.log('✅ Using complex query with all field combinations:', {
                  rootCategoryId,
                  categorySlug: categoryId,
                  allCategories: allCategoryIds.length,
                  leafCategories: allLeafCategoryIds.length,
                  subcategories: allSubcategoryIds.length,
                  totalOrConditions: orConditions.length
                })
              }
            }
          } else if (orConditions.length > 0) {
            if (!query.$and) {
              query.$and = []
            }
            query.$and.push({ $or: orConditions })
            console.log('✅ Querying root category with all field combinations:', {
              rootCategoryId,
              categorySlug: categoryId,
              leafCategories: allLeafCategoryIds.length,
              subcategories: allSubcategoryIds.length,
              uniqueLeafSlugs: uniqueLeafSlugs.length,
              uniqueSubcategorySlugs: uniqueSubcategorySlugs.length,
              totalOrConditions: orConditions.length
            })
            
            // Verify the query will work by testing it
            const testQuery = { $and: [{ $or: orConditions }] }
            const testCount = await productsCollection.countDocuments(testQuery)
            console.log('✅ Test query count (before isActive filter):', testCount)
          } else {
            console.log('WARNING: No leaf categories found for root category - this should not happen!')
            // Still try to filter by categoryId slug as fallback
            if (!query.$and) {
              query.$and = []
            }
            query.$and.push({ 
              $or: [
                { categoryId: categoryId },
                { categoryId: rootCategoryId }
              ]
            })
          }
        } else {
          console.log('❌ ERROR: Root category not found for:', categoryId)
          console.log('Attempting to filter by categoryId slug as fallback...')
          // Try to filter by categoryId slug as last resort
          if (!query.$and) {
            query.$and = []
          }
          query.$and.push({ 
            $or: [
              { categoryId: categoryId },
              { categoryId: { $regex: categoryId, $options: 'i' } }
            ]
          })
          console.log('Applied fallback filter by categoryId:', categoryId)
        }
      }
      
      // Ensure category filter was applied
      if (categoryId && (!query.$and || !query.$and.some((cond: any) => 
        cond && (cond.$or || cond.categoryId || cond.subcategoryId || cond.secondSubcategoryId || cond.secondsubcategoryId)
      ))) {
        console.log('⚠️ WARNING: Category filter was not applied! Adding fallback filter...')
        if (!query.$and) {
          query.$and = []
        }
        query.$and.push({ 
          $or: [
            { categoryId: categoryId },
            { categoryId: { $regex: categoryId, $options: 'i' } }
          ]
        })
      }
      
      console.log('Old schema query after category filter:', JSON.stringify(query, null, 2))
      console.log('Query $and length:', query.$and?.length || 0)
      console.log('Has category filter:', !!(query.$and && query.$and.some((cond: any) => 
        cond && (cond.$or || cond.categoryId || cond.subcategoryId || cond.secondSubcategoryId || cond.secondsubcategoryId)
      )))
      console.log('===============================')
    } else if (secondSubcategoryId) {
      // secondSubcategory is the source of truth - it should be a leaf category
      console.log('=== PROCESSING SECOND SUBCATEGORY (LEAF) ===')
      let leafCategory = null
      
      // Try MongoDB ObjectId first
      if (secondSubcategoryId.match(/^[0-9a-fA-F]{24}$/)) {
        leafCategory = await Category.findById(secondSubcategoryId)
      } else {
        // Build compound slug if we have parent info
        let slugToFind = secondSubcategoryId
        
        // If we have category and subcategory, try: category-subcategory-secondSubcategory (full compound - this is how seed script stores it)
        if (categoryId && subcategoryId) {
          const compoundSlug2 = `${categoryId}-${subcategoryId}-${secondSubcategoryId}`
          leafCategory = await Category.findOne({ slug: compoundSlug2 })
          console.log('Trying compound slug (category-subcategory-secondSubcategory):', compoundSlug2, 'Found:', !!leafCategory)
        }
        
        // If we have subcategory, try building compound slug: subcategory-secondSubcategory
        if (!leafCategory && subcategoryId) {
          const compoundSlug = `${subcategoryId}-${secondSubcategoryId}`
          leafCategory = await Category.findOne({ slug: compoundSlug })
          console.log('Trying compound slug (subcategory-secondSubcategory):', compoundSlug, 'Found:', !!leafCategory)
        }
        
        // Also try if subcategoryId is actually a compound slug (category-subcategory format)
        if (!leafCategory && subcategoryId && subcategoryId.includes('-')) {
          const compoundSlug3 = `${subcategoryId}-${secondSubcategoryId}`
          leafCategory = await Category.findOne({ slug: compoundSlug3 })
          console.log('Trying compound slug (compound-subcategory-secondSubcategory):', compoundSlug3, 'Found:', !!leafCategory)
        }
        
        // Try exact slug match
        if (!leafCategory) {
          leafCategory = await Category.findOne({ slug: secondSubcategoryId })
          console.log('Trying exact slug:', secondSubcategoryId, 'Found:', !!leafCategory)
        }
        
        // Try partial slug match (ends with the secondSubcategory) - prioritize level 2
        if (!leafCategory) {
          leafCategory = await Category.findOne({ 
            slug: { $regex: `${secondSubcategoryId}$`, $options: 'i' },
            level: 2
          })
          console.log('Trying regex (ends with, level 2):', secondSubcategoryId, 'Found:', !!leafCategory)
        }
        
        // Try contains match - prioritize level 2
        if (!leafCategory) {
          leafCategory = await Category.findOne({ 
            slug: { $regex: secondSubcategoryId, $options: 'i' },
            level: 2
          })
          console.log('Trying regex (contains, level 2):', secondSubcategoryId, 'Found:', !!leafCategory)
        }
        
        // Try without level constraint (fallback)
        if (!leafCategory) {
          leafCategory = await Category.findOne({ slug: { $regex: `${secondSubcategoryId}$`, $options: 'i' } })
          console.log('Trying regex (ends with, any level):', secondSubcategoryId, 'Found:', !!leafCategory)
        }
        
        // Last resort: Try finding by name (case insensitive, partial match) - prioritize level 2
        if (!leafCategory) {
          const namePattern = secondSubcategoryId.replace(/-/g, ' ')
          leafCategory = await Category.findOne({ 
            name: { $regex: new RegExp(`^${namePattern}`, 'i') },
            level: 2
          })
          console.log('Trying name match (level 2):', namePattern, 'Found:', !!leafCategory)
        }
        
        // Final fallback: Try name match without level constraint
        if (!leafCategory) {
          const namePattern = secondSubcategoryId.replace(/-/g, ' ')
          leafCategory = await Category.findOne({ 
            name: { $regex: new RegExp(`^${namePattern}`, 'i') },
            level: { $in: [1, 2] }
          })
          console.log('Trying name match (level 1 or 2):', namePattern, 'Found:', !!leafCategory)
        }
      }
      
      if (leafCategory) {
        console.log('Leaf category found:', leafCategory.name, 'Slug:', leafCategory.slug, 'ID:', leafCategory._id.toString())
        query.category = leafCategory._id
        console.log('Resolved category filter:', query.category.toString())
      } else {
        console.log('WARNING: Leaf category not found for:', secondSubcategoryId)
        console.log('Available categories with level 2:')
        const allLevel2 = await Category.find({ level: 2 }).select('name slug').limit(10).lean()
        console.log('Sample level 2 categories:', allLevel2.map((c: any) => ({ name: c.name, slug: c.slug })))
      }
      console.log('==========================================')
    } else if (subcategoryId) {
      // Fallback: If only subcategory exists, resolve all its leaf children
      console.log('=== PROCESSING SUBCATEGORY ===')
      let subcategory = null
      
      // Try MongoDB ObjectId first
      if (subcategoryId.match(/^[0-9a-fA-F]{24}$/)) {
        subcategory = await Category.findById(subcategoryId)
      } else {
        // IMPORTANT: Try compound slug FIRST if we have categoryId (category-subcategory format)
        // This is the most reliable way since that's how slugs are stored in the database
        if (categoryId) {
          const compoundSlug = `${categoryId}-${subcategoryId}`
          subcategory = await Category.findOne({ slug: compoundSlug, level: 1 })
          console.log('Trying compound slug FIRST (category-subcategory):', compoundSlug, 'Found:', !!subcategory)
        }
        
        // If compound slug didn't work, try finding by parent
        if (!subcategory && categoryId) {
          // First, find the root category
          let rootCategory = await Category.findOne({ slug: categoryId, level: 0 })
          if (!rootCategory) {
            rootCategory = await Category.findOne({ slug: { $regex: categoryId, $options: 'i' }, level: 0 })
          }
          
          if (rootCategory) {
            // Find subcategory with this specific parent
            subcategory = await Category.findOne({ 
              slug: subcategoryId, 
              parent: rootCategory._id,
              level: 1 
            })
            console.log('Looking for subcategory:', subcategoryId, 'under parent:', rootCategory.name, 'Found:', !!subcategory)
            
            // If not found by exact slug, try regex
            if (!subcategory) {
              subcategory = await Category.findOne({ 
                slug: { $regex: subcategoryId, $options: 'i' }, 
                parent: rootCategory._id,
                level: 1 
              })
              console.log('Trying regex match for subcategory under parent, Found:', !!subcategory)
            }
          }
        }
        
        // Fallback: If no categoryId or subcategory not found, try without parent constraint
        if (!subcategory) {
          subcategory = await Category.findOne({ slug: subcategoryId, level: 1 })
          console.log('Trying exact slug without parent constraint, Found:', !!subcategory)
        }
        
        // Try contains match (slug ends with subcategoryId)
        if (!subcategory) {
          subcategory = await Category.findOne({ slug: { $regex: `${subcategoryId}$`, $options: 'i' }, level: 1 })
          console.log('Trying regex (ends with):', subcategoryId, 'Found:', !!subcategory)
        }
        
        // Try contains match (anywhere in slug)
        if (!subcategory) {
          subcategory = await Category.findOne({ slug: { $regex: subcategoryId, $options: 'i' }, level: 1 })
          console.log('Trying regex (contains), Found:', !!subcategory)
        }
      }
      
      if (subcategory) {
        console.log('Subcategory found:', subcategory.name, 'Level:', subcategory.level)
        
        // Get all children (both level 1 and level 2)
        const allChildren = await Category.find({ parent: subcategory._id }).lean()
        console.log('Subcategory children found:', allChildren.length, allChildren.map((c: any) => ({ name: c.name, level: c.level, id: c._id.toString() })))
        
        const leafCategories: mongoose.Types.ObjectId[] = []
        
        if (allChildren.length > 0) {
          // Check each child to see if it's a leaf (no children)
          for (const child of allChildren) {
            const hasGrandChildren = await Category.findOne({ parent: child._id })
            if (!hasGrandChildren) {
              // This child is a leaf - add it
              leafCategories.push(child._id)
              console.log('  ✅ Leaf child found:', child.name, 'ID:', child._id.toString())
            } else {
              console.log('  ⚠️ Child has grandchildren:', child.name)
            }
          }
          console.log('Total leaf categories found:', leafCategories.length)
        } else {
          // Subcategory itself is a leaf (no children)
          // For new schema, products are stored with category field pointing to this leaf
          leafCategories.push(subcategory._id)
          console.log('✅ Subcategory is a leaf - using it directly')
        }
        
        if (leafCategories.length > 0) {
          query.category = { $in: leafCategories }
          console.log('✅ Resolved category filter (leaf categories):', leafCategories.map((id: any) => id.toString()))
          
          // Verify products exist (for new schema)
          const productCount = await Product.countDocuments({ category: { $in: leafCategories } })
          console.log('Products found with these category IDs:', productCount)
          
          // If no products found with new schema, check old schema (secondSubcategoryId)
          if (productCount === 0) {
            const oldSchemaCount = await Product.countDocuments({ secondSubcategoryId: { $in: leafCategories.map((id: any) => id.toString()) } })
            console.log('Products found with secondSubcategoryId (old schema):', oldSchemaCount)
            if (oldSchemaCount > 0) {
              // Switch to old schema query
              delete query.category
              query.secondSubcategoryId = { $in: leafCategories.map((id: any) => id.toString()) }
              console.log('✅ Switched to old schema - querying by secondSubcategoryId')
            }
          }
        } else {
          console.log('❌ WARNING: No leaf categories found for subcategory')
        }
      } else {
        console.log('WARNING: Subcategory not found for:', subcategoryId)
      }
      console.log('============================')
    } else if (categoryId) {
      // Fallback: If only category exists, resolve all leaf descendants
      console.log('=== PROCESSING ROOT CATEGORY (NEW SCHEMA PATH) ===')
      
      // If it's a MongoDB ObjectId, use it directly
      if (categoryId.match(/^[0-9a-fA-F]{24}$/)) {
        const rootCategory = await Category.findById(categoryId)
        if (rootCategory) {
          console.log('Root category found by ID:', rootCategory.name)
          await resolveRootCategoryLeafs(rootCategory, query)
        }
      } else {
        // Handle old category ID format (like "skincare", "spa-products", etc.)
        let category = null
        
        // Map old category IDs to slugs
        const oldIdToSlugMap: Record<string, string> = {
          'skincare': 'skincare',
          'spa-products': 'spa-products',
          'nail-products': 'nail-products',
          'equipment': 'equipment',
          'implements': 'implements',
          'furniture': 'furniture',
        }
        
        const slugToFind = oldIdToSlugMap[categoryId] || categoryId
        
        console.log('Looking for root category with slug:', slugToFind)
        
        // Try exact slug match first
        category = await Category.findOne({ slug: slugToFind, level: 0 })
        console.log('  - Exact slug match:', category ? `Found: ${category.name}` : 'Not found')
        
        // If not found, try partial slug match
        if (!category) {
          category = await Category.findOne({ slug: { $regex: `^${slugToFind}`, $options: 'i' }, level: 0 })
          console.log('  - Partial slug match:', category ? `Found: ${category.name}` : 'Not found')
        }
        
        // If still not found, try finding root category by name (case insensitive)
        if (!category) {
          const categoryName = categoryId.replace(/-/g, ' ').toUpperCase()
          category = await Category.findOne({ 
            name: { $regex: new RegExp(`^${categoryName}`, 'i') },
            level: 0 
          })
          console.log('  - Name match:', category ? `Found: ${category.name}` : 'Not found')
        }
        
        if (category) {
          console.log('✅ Root category found:', category.name, 'ID:', category._id.toString())
          await resolveRootCategoryLeafs(category, query)
          
          // IMPORTANT: Also check for old schema products with categoryId directly
          // This handles products that have categoryId: "skincare" as a string
          // Use native collection to check for old schema fields
          const db = mongoose.connection.db
          if (db) {
            const productsCollection = db.collection('products')
            const directCategoryIdCount = await productsCollection.countDocuments({ categoryId: categoryId })
            console.log('Products found with direct categoryId (old schema):', directCategoryIdCount, 'categoryId:', categoryId)
            
            if (directCategoryIdCount > 0) {
              // Check if we already have a query condition
              if (!query.$and) {
                query.$and = []
              }
              
              // Check if categoryId condition already exists
              const hasCategoryIdCondition = query.$and.some((cond: any) => 
                cond && (cond.categoryId || (cond.$or && cond.$or.some((orCond: any) => orCond && orCond.categoryId)))
              )
              
              if (!hasCategoryIdCondition) {
                // Add categoryId condition to $or if it exists, otherwise add directly
                const categoryIdCondition = { categoryId: categoryId }
                
                // Check if there's already an $or in $and
                const orIndex = query.$and.findIndex((cond: any) => cond && cond.$or)
                if (orIndex >= 0) {
                  // Add to existing $or
                  query.$and[orIndex].$or.push(categoryIdCondition)
                } else {
                  // Create new $or condition
                  query.$and.push({ $or: [categoryIdCondition] })
                }
                console.log('✅ Added direct categoryId filter for old schema products')
              }
            }
          }
        } else {
          console.log('❌ WARNING: Root category not found for:', categoryId)
          console.log('Attempting to filter by categoryId as fallback...')
          
          // Direct check for old schema products with categoryId using native collection
          let directCategoryIdCount = 0
          const db = mongoose.connection.db
          if (db) {
            const productsCollection = db.collection('products')
            directCategoryIdCount = await productsCollection.countDocuments({ categoryId: categoryId })
            console.log('Products found with direct categoryId (old schema fallback):', directCategoryIdCount, 'categoryId:', categoryId)
            
            if (directCategoryIdCount > 0) {
              if (!query.$and) {
                query.$and = []
              }
              query.$and.push({ categoryId: categoryId })
              console.log('✅ Added direct categoryId filter (fallback)')
            }
          }
          
          // Try to filter by categoryId slug as last resort
          if (!query.category && directCategoryIdCount === 0) {
            // For new schema, try to find any category with this slug and use it
            const anyCategory = await Category.findOne({ 
              $or: [
                { slug: categoryId },
                { slug: { $regex: `^${categoryId}`, $options: 'i' } }
              ]
            })
            if (anyCategory) {
              console.log('Found category (not root):', anyCategory.name)
              // Get all leaf descendants
              await resolveRootCategoryLeafs(anyCategory, query)
            } else {
              console.log('⚠️ Could not find any category matching:', categoryId)
              console.log('⚠️ Products will NOT be filtered by category!')
            }
          }
        }
      }
      
      // Ensure category filter was applied for new schema
      if (categoryId && !query.category && (!query.$and || !query.$and.some((cond: any) => cond && cond.category))) {
        console.log('⚠️ WARNING: Category filter was not applied for new schema!')
        console.log('⚠️ This will result in showing all products!')
      }
      
      console.log('================================')
    }

    // Check if we have no filters at all - if so, use simple query
    const hasNoFilters = !categoryId && !subcategoryId && !secondSubcategoryId && !search && !minPrice && !maxPrice
    
    if (hasNoFilters) {
      // Simple case: no filters at all, just use isActive condition
      // Reset query to only include isActive condition
      // Use a simpler query that works with both schemas
      query = {
        $or: [
          { isActive: true },
          { isActive: { $exists: false } }
        ]
      }
      console.log('=== NO FILTERS CASE ===')
      console.log('Using simple query with isActive only:', JSON.stringify(query, null, 2))
      console.log('Schema type:', usesOldSchema ? 'OLD' : 'NEW')
      
      // Skip all the category filtering logic since we have no filters
      // The query is already set, so we can continue to the execution phase
    } else {
      // We have filters, add them to the query
      
      // Search filter
      if (search) {
        query.$and = query.$and || []
        query.$and.push({
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
          ]
        })
      }
      
      // Add isActive condition using $and to combine with other filters
      // Only add if $and doesn't already exist or if we have other conditions
      if (!query.$and) {
        query.$and = []
      }
      // Only add isActive condition if it's not already in $and
      const hasIsActive = query.$and.some((condition: any) => 
        condition && condition.$or && 
        Array.isArray(condition.$or) &&
        condition.$or.some((orCond: any) => orCond && orCond.isActive !== undefined)
      )
      if (!hasIsActive) {
        query.$and.push(isActiveCondition)
      }
      
      // If $and array is empty, remove it to avoid query issues
      if (query.$and && query.$and.length === 0) {
        delete query.$and
      }
      
      // Price filter - handle both old and new schema
      if (minPrice || maxPrice) {
        if (usesOldSchema) {
          // Old schema uses 'price' field directly
          query.price = {}
          if (minPrice) {
            query.price.$gte = parseFloat(minPrice)
          }
          if (maxPrice) {
            query.price.$lte = parseFloat(maxPrice)
          }
        } else {
          // New schema uses 'prices.retail'
          query['prices.retail'] = {}
          if (minPrice) {
            query['prices.retail'].$gte = parseFloat(minPrice)
          }
          if (maxPrice) {
            query['prices.retail'].$lte = parseFloat(maxPrice)
          }
        }
      }
    }

    // STEP 5: Log the final query and test
    console.log('=== FINAL QUERY DEBUG ===')
    
    // IMPORTANT: Remove category filter if $in array is empty
    if (query.category && query.category.$in && query.category.$in.length === 0) {
      console.log('WARNING: Empty $in array detected - removing category filter')
      delete query.category
    }
    
    // IMPORTANT: Remove secondSubcategoryId filter if $in array is empty (old schema)
    if (query.secondSubcategoryId && query.secondSubcategoryId.$in && query.secondSubcategoryId.$in.length === 0) {
      console.log('WARNING: Empty $in array detected for secondSubcategoryId - removing filter')
      delete query.secondSubcategoryId
    }
    
    console.log('=== FINAL QUERY ===')
    console.log('Final query:', JSON.stringify(query, null, 2))
    
    // Log resolved category IDs if they exist
    if (query.category) {
      if (query.category.$in) {
        console.log('Resolved category IDs in query:', query.category.$in.map((id: any) => id.toString()))
        console.log('Number of category IDs:', query.category.$in.length)
      } else {
        console.log('Single category ID in query:', query.category.toString())
      }
    } else if (query.secondSubcategoryId) {
      if (query.secondSubcategoryId.$in) {
        console.log('Resolved secondSubcategoryId in query:', query.secondSubcategoryId.$in.map((id: any) => id.toString()))
        console.log('Number of secondSubcategoryIds:', query.secondSubcategoryId.$in.length)
      } else {
        console.log('Single secondSubcategoryId in query:', query.secondSubcategoryId.toString())
      }
    } else if (query.subcategoryId) {
      console.log('Single subcategoryId in query:', query.subcategoryId.toString())
    } else {
      console.log('No category filter applied')
    }
    console.log('==================')
    
    // Get total count - use native collection for old schema to handle fields not in schema
    let total: number
    let products: any[]
    
    // Ensure query is valid - if $and is empty, remove it
    if (query.$and && Array.isArray(query.$and) && query.$and.length === 0) {
      delete query.$and
    }
    
    // Ensure isActive condition is always present (if we didn't already handle no-filters case)
    if (!hasNoFilters) {
      const hasIsActiveInQuery = query.$and && query.$and.some((condition: any) => 
        condition && condition.$or && 
        Array.isArray(condition.$or) &&
        condition.$or.some((orCond: any) => orCond && orCond.isActive !== undefined)
      )
      
      if (!hasIsActiveInQuery) {
        // Has filters, add isActive to $and
        if (!query.$and) {
          query.$and = []
        }
        query.$and.push(isActiveCondition)
      }
    }
    
    try {
      // Log the query before execution for debugging
      console.log('=== EXECUTING QUERY ===')
      console.log('Query:', JSON.stringify(query, null, 2))
      console.log('Schema:', usesOldSchema ? 'OLD' : 'NEW')
      console.log('Page:', page, 'Limit:', limit)
      console.log('Has no filters:', hasNoFilters)
      
      // Check if query has old schema fields (categoryId, subcategoryId, secondSubcategoryId)
      const hasOldSchemaFields = query.categoryId || query.subcategoryId || query.secondSubcategoryId || query.secondsubcategoryId ||
        (query.$and && query.$and.some((cond: any) => 
          cond && (cond.categoryId || cond.subcategoryId || cond.secondSubcategoryId || cond.secondsubcategoryId ||
            (cond.$or && cond.$or.some((orCond: any) => 
              orCond && (orCond.categoryId || orCond.subcategoryId || orCond.secondSubcategoryId || orCond.secondsubcategoryId)
            ))
          )
        ))
      
      // Use native collection if we have old schema OR if query has old schema fields
      const shouldUseNativeCollection = usesOldSchema || hasOldSchemaFields
      
      if (shouldUseNativeCollection) {
        // OLD SCHEMA: Use native MongoDB collection to query fields not in Mongoose schema
        // NOTE: This also handles new schema 'category' field if present in $or conditions
        if (!productsCollection) {
          throw new Error('productsCollection is not available')
        }
        
        // Log query structure for debugging
        console.log('Query structure for native collection:', JSON.stringify(query, null, 2))
        console.log('Query $and length:', query.$and?.length || 0)
        if (query.$and) {
          query.$and.forEach((cond: any, idx: number) => {
            if (cond.$or) {
              console.log(`  $and[${idx}].$or has`, cond.$or.length, 'conditions')
              cond.$or.forEach((orCond: any, orIdx: number) => {
                const keys = Object.keys(orCond)
                console.log(`    $or[${orIdx}]:`, keys.join(', '))
              })
            }
          })
        }
        
        // Before executing, verify the query structure is correct
        // Convert any ObjectId fields in $or conditions to proper format for native collection
        const processedQuery = JSON.parse(JSON.stringify(query, (key, value) => {
          // Keep ObjectIds as-is (they'll be serialized correctly by MongoDB driver)
          if (value && typeof value === 'object' && value.constructor && value.constructor.name === 'ObjectId') {
            return value
          }
          return value
        }))
        
        total = await productsCollection.countDocuments(processedQuery)
        console.log('Products after filters (native collection):', total)
        
        // If no products found, try a simpler query to debug AND FIX
        if (total === 0 && categoryId) {
          console.log('⚠️ No products found with full query, trying simpler queries for debugging...')
          
          // First, try to find the root category and get all leaf categories
          let rootCategory = await Category.findOne({ slug: categoryId, level: 0 })
          if (!rootCategory) {
            rootCategory = await Category.findOne({ slug: { $regex: `^${categoryId}`, $options: 'i' }, level: 0 })
          }
          
          // Also try by name
          if (!rootCategory) {
            const categoryName = categoryId.replace(/-/g, ' ').toUpperCase()
            rootCategory = await Category.findOne({ 
              name: { $regex: new RegExp(`^${categoryName}`, 'i') },
              level: 0 
            })
          }
          
          if (rootCategory) {
            console.log('  - Root category found:', rootCategory.name, 'Slug:', rootCategory.slug)
            
            // Get ALL categories under this root (recursive)
            const getAllDescendantIds = async (parentId: mongoose.Types.ObjectId): Promise<mongoose.Types.ObjectId[]> => {
              const children = await Category.find({ parent: parentId }).lean()
              let allIds: mongoose.Types.ObjectId[] = [parentId] // Include parent itself
              
              for (const child of children) {
                const childIds = await getAllDescendantIds(child._id)
                allIds = allIds.concat(childIds)
              }
              
              return allIds
            }
            
            const allCategoryIds = await getAllDescendantIds(rootCategory._id)
            console.log('  - All category IDs found (including root and all descendants):', allCategoryIds.length)
            
            // Try querying with just the category field (new schema) - THIS IS THE FIX
            if (allCategoryIds.length > 0) {
              const simpleCategoryQuery = { 
                $and: [
                  { category: { $in: allCategoryIds } },
                  isActiveCondition
                ]
              }
              const simpleCount = await productsCollection.countDocuments(simpleCategoryQuery)
              console.log('  - Products with category field (new schema, all descendants):', simpleCount)
              
              // Also try without isActive filter
              const simpleCategoryQueryNoActive = { category: { $in: allCategoryIds } }
              const simpleCountNoActive = await productsCollection.countDocuments(simpleCategoryQueryNoActive)
              console.log('  - Products with category field (no isActive filter):', simpleCountNoActive)
              
              // IF SIMPLE QUERY WORKS, USE IT INSTEAD
              if (simpleCount > 0) {
                console.log('✅ FIX: Using simpler query with isActive filter!')
                query = {
                  $and: [
                    { category: { $in: allCategoryIds } },
                    isActiveCondition
                  ]
                }
                total = simpleCount
                console.log('✅ Fixed query total:', total)
              } else if (simpleCountNoActive > 0) {
                console.log('✅ FIX: Using simpler query WITHOUT isActive filter (products exist but isActive might be false/missing)!')
                query = {
                  category: { $in: allCategoryIds }
                }
                total = simpleCountNoActive
                console.log('✅ Fixed query total (no isActive):', total)
              }
            }
            
            // If still 0, try old schema
            if (total === 0 && rootCategory) {
              console.log('  - Still 0 products, trying old schema fields...')
              const oldSchemaQuery = { 
                $and: [
                  { $or: [
                    { categoryId: categoryId },
                    { categoryId: rootCategory.slug }
                  ]},
                  isActiveCondition
                ]
              }
              const oldSchemaCount = await productsCollection.countDocuments(oldSchemaQuery)
              console.log('  - Products with categoryId only (old schema, with isActive):', oldSchemaCount)
              
              // Also try without isActive
              const oldSchemaQueryNoActive = { 
                $or: [
                  { categoryId: categoryId },
                  { categoryId: rootCategory.slug }
                ]
              }
              const oldSchemaCountNoActive = await productsCollection.countDocuments(oldSchemaQueryNoActive)
              console.log('  - Products with categoryId only (old schema, no isActive):', oldSchemaCountNoActive)
              
              if (oldSchemaCount > 0) {
                console.log('✅ FIX: Using old schema query with isActive!')
                query = oldSchemaQuery
                total = oldSchemaCount
              } else if (oldSchemaCountNoActive > 0) {
                console.log('✅ FIX: Using old schema query WITHOUT isActive!')
                query = oldSchemaQueryNoActive
                total = oldSchemaCountNoActive
              }
            }
          } else {
            console.log('  - Root category not found for:', categoryId)
            // List all available root categories for debugging
            const allRootCategories = await Category.find({ level: 0 }).select('name slug').lean()
            console.log('  - Available root categories:', allRootCategories.map((c: any) => ({ name: c.name, slug: c.slug })))
          }
        }
        
        // Use the updated query (might have been fixed above)
        const finalQuery = JSON.parse(JSON.stringify(query, (key, value) => {
          if (value && typeof value === 'object' && value.constructor && value.constructor.name === 'ObjectId') {
            return value
          }
          return value
        }))
        
        products = await productsCollection.find(finalQuery)
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .toArray()
        
        console.log('Products retrieved from native collection:', products?.length || 0)
      } else {
        // Check if query has old schema fields - if so, use native collection
        if (hasOldSchemaFields && productsCollection) {
          console.log('⚠️ Query has old schema fields but usesOldSchema is false - using native collection')
          const processedQuery = JSON.parse(JSON.stringify(query, (key, value) => {
            if (value && typeof value === 'object' && value.constructor && value.constructor.name === 'ObjectId') {
              return value
            }
            return value
          }))
          
          total = await productsCollection.countDocuments(processedQuery)
          console.log('Products after filters (native collection):', total)
          
          products = await productsCollection.find(processedQuery)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .toArray()
          
          console.log('Products retrieved from native collection (fallback):', products?.length || 0)
        } else {
          // NEW SCHEMA: Use Mongoose with populate for category reference
          total = await Product.countDocuments(query)
          console.log('Products after filters (Mongoose):', total)
          
          // Build query - handle populate safely
          let findQuery = Product.find(query)
          
          // Only populate if category field exists in query or if we're not filtering by category
          // For no-filters case, we can safely populate
          if (hasNoFilters || !query.category) {
            findQuery = findQuery.populate('category', 'name slug level')
          }
          
          products = await findQuery
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean()
        }
      }
      
      console.log('Products retrieved:', products?.length || 0)
      console.log('========================')
    } catch (queryError: any) {
      console.error('=== QUERY EXECUTION ERROR ===')
      console.error('Error:', queryError)
      console.error('Error message:', queryError.message)
      console.error('Error stack:', queryError.stack)
      console.error('Query that failed:', JSON.stringify(query, null, 2))
      console.error('Schema:', usesOldSchema ? 'OLD' : 'NEW')
      console.error('Has no filters:', hasNoFilters)
      console.error('=============================')
      throw new Error(`Query execution failed: ${queryError.message}`)
    }
    
    console.log('Resolved category filter:', query.category || query.secondSubcategoryId || query.subcategoryId || 'none')
    console.log('========================')

    // Ensure products is an array
    if (!products || !Array.isArray(products)) {
      console.warn('⚠️ Products is not an array, defaulting to empty array')
      products = []
    }

    // Transform products to match frontend expectations
    let transformedProducts: any[] = []
    
    try {
      transformedProducts = (products || [])
        .filter((product: any) => product && product._id) // Filter out any null/undefined products
        .map((product: any) => {
          try {
            // Handle old schema (has price, cost directly)
            if (usesOldSchema) {
              return {
                id: product._id?.toString() || '',
                name: product.name || '',
                description: product.description || '',
                price: product.price || 0,
                cost: product.cost,
                images: product.images || [],
                categoryId: product.categoryId || product.secondSubcategoryId || product.subcategoryId || '',
                stock: product.stock || 0,
                sku: product.sku,
                createdAt: product.createdAt?.toISOString() || new Date().toISOString(),
                updatedAt: product.updatedAt?.toISOString() || new Date().toISOString(),
              }
            } else {
              // New schema
              return {
                id: product._id?.toString() || '',
                name: product.name || '',
                description: product.description || '',
                price: product.prices?.retail || 0,
                cost: product.prices?.dealer,
                images: product.images || [],
                categoryId: product.category?._id?.toString() || '',
                stock: product.stock || 0,
                sku: product.sku,
                createdAt: product.createdAt?.toISOString() || new Date().toISOString(),
                updatedAt: product.updatedAt?.toISOString() || new Date().toISOString(),
              }
            }
          } catch (transformError: any) {
            console.error('Error transforming product:', transformError, 'Product:', product)
            return null
          }
        })
        .filter((p: any) => p !== null) // Remove any failed transformations
    } catch (transformError: any) {
      console.error('Error in product transformation:', transformError)
      transformedProducts = []
    }

    // Ensure total is a valid number
    const safeTotal = typeof total === 'number' && !isNaN(total) ? total : transformedProducts.length
    const totalPages = Math.ceil(safeTotal / limit)

    console.log('=== RETURNING RESPONSE ===')
    console.log('Products count:', transformedProducts.length)
    console.log('Total:', safeTotal)
    console.log('Total pages:', totalPages)
    console.log('=======================')

    return NextResponse.json({
      products: transformedProducts,
      pagination: {
        page,
        limit,
        total: safeTotal,
        totalPages,
      },
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    // TODO: Add admin authentication check
    const body = await request.json()
    const { name, description, prices, images, stock, category, isActive } = body

    if (!name || !category) {
      return NextResponse.json(
        { error: 'Name and category are required' },
        { status: 400 }
      )
    }

    // Verify category exists and is a leaf category
    const categoryDoc = await Category.findById(category)
    if (!categoryDoc) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    // Check if category has children (not a leaf)
    const hasChildren = await Category.findOne({ parent: category })
    if (hasChildren) {
      return NextResponse.json(
        { error: 'Products can only be added to leaf categories' },
        { status: 400 }
      )
    }

    const product = await Product.create({
      name,
      description: description || '',
      prices: prices || {},
      images: images || [],
      stock: stock || 0,
      category,
      isActive: isActive !== undefined ? isActive : true,
    })

    return NextResponse.json(
      { message: 'Product created successfully', product },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}


