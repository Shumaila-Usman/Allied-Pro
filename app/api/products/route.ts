import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Product from '@/lib/models/Product'
import Category from '@/lib/models/Category'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
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
    
    if (usesOldSchema) {
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
            // IMPORTANT: Products might have secondSubcategoryId (camelCase) OR secondsubcategoryId (lowercase)
            // Also might have slugs OR ObjectIds
            const productCountByIdsCamel = await Product.countDocuments({ secondSubcategoryId: { $in: leafCategoryIds } })
            const productCountByIdsLower = await Product.countDocuments({ secondsubcategoryId: { $in: leafCategoryIds } })
            const productCountBySlugsCamel = await Product.countDocuments({ secondSubcategoryId: { $in: leafCategorySlugs } })
            const productCountBySlugsLower = await Product.countDocuments({ secondsubcategoryId: { $in: leafCategorySlugs } })
            
            console.log('Products found with ObjectIds (camelCase):', productCountByIdsCamel)
            console.log('Products found with ObjectIds (lowercase):', productCountByIdsLower)
            console.log('Products found with slugs (camelCase):', productCountBySlugsCamel)
            console.log('Products found with slugs (lowercase):', productCountBySlugsLower)
            
            // Build $or conditions for both field names
            const orConditions: any[] = []
            
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
              // Try both ObjectIds and slugs with both field names
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
              
              console.log('Products with subcategoryId:', productsWithSubcategoryId)
              console.log('Products with secondSubcategoryId (camelCase):', productsWithSecondSubcategoryIdCamel)
              console.log('Products with secondsubcategoryId (lowercase):', productsWithSecondSubcategoryIdLower)
              
              if (productsWithSecondSubcategoryId > 0) {
                // Products are stored with secondSubcategoryId/secondsubcategoryId - use that
                const orConditions: any[] = [
                  { secondSubcategoryId: { $in: possibleSubcategoryIds } },
                  { secondsubcategoryId: { $in: possibleSubcategoryIds } }
                ]
                if (!query.$and) {
                  query.$and = []
                }
                query.$and.push({ $or: orConditions })
                console.log('✅ Subcategory is a leaf - querying by secondSubcategoryId/secondsubcategoryId:', possibleSubcategoryIds)
                console.log('Products found:', productsWithSecondSubcategoryId)
              } else if (productsWithSubcategoryId > 0) {
                // Products are stored with subcategoryId - use that (try all possible values)
                query.subcategoryId = { $in: possibleSubcategoryIds }
                console.log('✅ Subcategory is a leaf - querying by subcategoryId:', possibleSubcategoryIds)
                console.log('Products found:', productsWithSubcategoryId)
              } else {
                console.log('❌ WARNING: No products found with either subcategoryId or secondSubcategoryId/secondsubcategoryId')
              }
            } else {
              console.log('❌ WARNING: Subcategory has children but none are leaves - this should not happen!')
            }
          }
        }
      } else if (categoryId) {
        // Find root category, get all leaf descendants, query products by those secondSubcategoryIds
        let rootCategory = null
        rootCategory = await Category.findOne({ slug: categoryId, level: 0 })
        if (!rootCategory) {
          rootCategory = await Category.findOne({ slug: { $regex: categoryId, $options: 'i' }, level: 0 })
        }
        
        if (rootCategory) {
          // Get all descendants recursively and find leaf categories
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
          
          // Get exact slugs for subcategories and leaf categories (no partial matches to avoid cross-category contamination)
          const allSubcategorySlugs: string[] = []
          const allLeafSlugs: string[] = []
          
          for (const level1Child of level1Children) {
            // Only add exact slug, not partial matches
            allSubcategorySlugs.push(level1Child.slug)
            
            const hasLevel1Children = await Category.findOne({ parent: level1Child._id })
            if (!hasLevel1Children) {
              allLeafSlugs.push(level1Child.slug)
            } else {
              const level2Children = await Category.find({ parent: level1Child._id }).lean()
              for (const level2Child of level2Children) {
                allLeafSlugs.push(level2Child.slug)
              }
            }
          }
          
          // Build $or conditions for all possible field combinations
          const orConditions: any[] = []
          
          // Check by categoryId (ObjectId or slug)
          orConditions.push({ categoryId: rootCategoryId })
          orConditions.push({ categoryId: categoryId })
          
          // Check by subcategoryId (ObjectIds and slugs)
          if (allSubcategoryIds.length > 0) {
            orConditions.push({ subcategoryId: { $in: allSubcategoryIds } })
          }
          if (allSubcategorySlugs.length > 0) {
            orConditions.push({ subcategoryId: { $in: allSubcategorySlugs } })
          }
          
          // Check by secondSubcategoryId (ObjectIds and slugs, both camelCase and lowercase)
          if (allLeafIds.length > 0) {
            orConditions.push({ secondSubcategoryId: { $in: allLeafIds } })
            orConditions.push({ secondsubcategoryId: { $in: allLeafIds } })
          }
          if (allLeafSlugs.length > 0) {
            orConditions.push({ secondSubcategoryId: { $in: allLeafSlugs } })
            orConditions.push({ secondsubcategoryId: { $in: allLeafSlugs } })
          }
          
          if (orConditions.length > 0) {
            if (!query.$and) {
              query.$and = []
            }
            query.$and.push({ $or: orConditions })
            console.log('✅ Querying root category with all field combinations:', {
              rootCategoryId,
              categorySlug: categoryId,
              leafCategories: allLeafIds.length,
              subcategories: allSubcategoryIds.length
            })
          } else {
            console.log('WARNING: No leaf categories found for root category')
          }
        }
      }
      
      console.log('Old schema query:', JSON.stringify(query, null, 2))
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
      console.log('=== PROCESSING ROOT CATEGORY ===')
      
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
        
        // Try exact slug match first
        category = await Category.findOne({ slug: slugToFind, level: 0 })
        
        // If not found, try partial slug match
        if (!category) {
          category = await Category.findOne({ slug: { $regex: `^${slugToFind}`, $options: 'i' }, level: 0 })
        }
        
        // If still not found, try finding root category by name (case insensitive)
        if (!category) {
          category = await Category.findOne({ 
            name: { $regex: new RegExp(`^${categoryId.replace(/-/g, ' ')}`, 'i') },
            level: 0 
          })
        }
        
        if (category) {
          console.log('Root category found:', category.name)
          await resolveRootCategoryLeafs(category, query)
        } else {
          console.log('WARNING: Root category not found for:', categoryId)
        }
      }
      console.log('================================')
    }
    
    // Helper function to resolve all leaf categories for a root category
    async function resolveRootCategoryLeafs(rootCategory: any, query: any) {
      // Get all level 1 children
      const level1Children = await Category.find({ parent: rootCategory._id }).lean()
      console.log('Level 1 children:', level1Children.length)
      
      const leafCategories: mongoose.Types.ObjectId[] = []
      
      // Check each level 1 child
      for (const level1Child of level1Children) {
        // Check if level 1 child itself is a leaf (no children)
        const hasLevel1Children = await Category.findOne({ parent: level1Child._id })
        if (!hasLevel1Children) {
          leafCategories.push(level1Child._id)
        } else {
          // Get level 2 children (or deeper)
          const level2Children = await Category.find({ parent: level1Child._id }).lean()
          for (const level2Child of level2Children) {
            const hasLevel2Children = await Category.findOne({ parent: level2Child._id })
            if (!hasLevel2Children) {
              leafCategories.push(level2Child._id)
            }
          }
        }
      }
      
      console.log('Leaf categories found:', leafCategories.length)
      
      // IMPORTANT: Only apply category filter if we have leaf categories
      if (leafCategories.length > 0) {
        query.category = { $in: leafCategories }
        console.log('Resolved category filter (leaf descendants):', leafCategories.map((id: any) => id.toString()))
      } else {
        console.log('WARNING: No leaf categories found - NOT applying category filter')
        // Don't set query.category at all if empty
      }
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
      
      if (usesOldSchema) {
        // OLD SCHEMA: Use native MongoDB collection to query fields not in Mongoose schema
        if (!productsCollection) {
          throw new Error('productsCollection is not available')
        }
        total = await productsCollection.countDocuments(query)
        console.log('Products after filters (native collection):', total)
        
        products = await productsCollection.find(query)
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .toArray()
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

