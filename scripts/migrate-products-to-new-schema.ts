/**
 * Script to migrate products from old schema to new schema
 * Sets the category field (ObjectId) based on secondSubcategoryId or subcategoryId
 */

import connectDB from '../lib/mongodb'
import Product from '../lib/models/Product'
import Category from '../lib/models/Category'

async function migrateProducts() {
  try {
    await connectDB()
    console.log('✅ Connected to database\n')

    // Get all products
    const products = await Product.find({}).lean()
    console.log(`📦 Found ${products.length} products to migrate\n`)
    console.log('─'.repeat(80))

    let migrated = 0
    let skipped = 0
    let errors = 0

    for (const product of products) {
      try {
        // Skip if already has category field (new schema)
        if (product.category) {
          skipped++
          continue
        }

        // Get the leaf category from old schema fields
        let leafCategoryId: string | null = null

        // Helper function to find category by ID or slug
        const findCategory = async (idOrSlug: string): Promise<any> => {
          // Try as ObjectId first
          try {
            const byId = await Category.findById(idOrSlug)
            if (byId) return byId
          } catch (e) {
            // Not a valid ObjectId, try as slug
          }
          
          // Try as slug
          const bySlug = await Category.findOne({ slug: idOrSlug })
          if (bySlug) return bySlug
          
          // Try partial slug match
          const byPartialSlug = await Category.findOne({ slug: { $regex: idOrSlug, $options: 'i' } })
          return byPartialSlug || null
        }

        // Priority: secondSubcategoryId > subcategoryId > categoryId
        if ((product as any).secondSubcategoryId) {
          const category = await findCategory((product as any).secondSubcategoryId)
          if (category) {
            const hasChildren = await Category.findOne({ parent: category._id })
            if (!hasChildren) {
              leafCategoryId = category._id.toString()
            }
          }
        } else if ((product as any).subcategoryId) {
          const category = await findCategory((product as any).subcategoryId)
          if (category) {
            const hasChildren = await Category.findOne({ parent: category._id })
            if (!hasChildren) {
              leafCategoryId = category._id.toString()
            }
          }
        } else if ((product as any).categoryId) {
          const category = await findCategory((product as any).categoryId)
          if (category) {
            const hasChildren = await Category.findOne({ parent: category._id })
            if (!hasChildren) {
              leafCategoryId = category._id.toString()
            }
          }
        }

        if (!leafCategoryId) {
          console.log(`⚠️  Skipping "${product.name}" - no valid leaf category found`)
          skipped++
          continue
        }

        // Verify the category exists
        const category = await Category.findById(leafCategoryId)
        if (!category) {
          console.log(`⚠️  Skipping "${product.name}" - category ${leafCategoryId} not found`)
          skipped++
          continue
        }

        // Update product with category field
        await Product.findByIdAndUpdate(
          product._id,
          { $set: { category: leafCategoryId } },
          { runValidators: false }
        )

        console.log(`✅ Migrated: ${product.name}`)
        console.log(`   Category: ${category.name} (${category.slug})`)
        migrated++
      } catch (error: any) {
        console.error(`❌ Error migrating "${product.name}":`, error.message)
        errors++
      }
    }

    console.log('\n' + '─'.repeat(80))
    console.log(`\n📊 Summary:`)
    console.log(`   ✅ Migrated: ${migrated} products`)
    console.log(`   ⏭️  Skipped: ${skipped} products`)
    console.log(`   ❌ Errors: ${errors} products`)
    console.log('\n✅ Migration complete!')
    process.exit(0)
  } catch (error: any) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

migrateProducts()

