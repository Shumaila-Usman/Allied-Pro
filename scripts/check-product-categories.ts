/**
 * Script to check how products are assigned to categories
 */

import connectDB from '../lib/mongodb'
import Product from '../lib/models/Product'
import Category from '../lib/models/Category'

async function checkProductCategories() {
  try {
    await connectDB()
    console.log('✅ Connected to database\n')

    // Get a sample of products
    const products = await Product.find({}).limit(10).lean()
    
    console.log(`📦 Checking ${products.length} sample products:\n`)
    console.log('─'.repeat(80))
    
    for (const product of products) {
      console.log(`\nProduct: ${product.name}`)
      console.log(`  ID: ${product._id}`)
      
      // Check category field (new schema)
      if (product.category) {
        const categoryId = typeof product.category === 'string' 
          ? product.category 
          : product.category._id?.toString() || product.category.toString()
        
        const category = await Category.findById(categoryId)
        if (category) {
          console.log(`  Category (new schema): ${category.name} (${category.slug}) - Level: ${category.level}`)
          
          // Get parent chain
          let current = category
          const chain: string[] = [current.name]
          while (current.parent) {
            const parent = await Category.findById(current.parent)
            if (parent) {
              chain.unshift(parent.name)
              current = parent
            } else {
              break
            }
          }
          console.log(`  Category chain: ${chain.join(' > ')}`)
        } else {
          console.log(`  Category (new schema): ObjectId ${categoryId} - NOT FOUND in categories collection`)
        }
      } else {
        console.log(`  Category (new schema): NOT SET`)
      }
      
      // Check old schema fields
      if ((product as any).categoryId) {
        console.log(`  categoryId (old schema): ${(product as any).categoryId}`)
      }
      if ((product as any).subcategoryId) {
        console.log(`  subcategoryId (old schema): ${(product as any).subcategoryId}`)
      }
      if ((product as any).secondSubcategoryId) {
        console.log(`  secondSubcategoryId (old schema): ${(product as any).secondSubcategoryId}`)
      }
    }
    
    // Check a specific product - Ice Globes
    console.log('\n' + '─'.repeat(80))
    console.log('\n🔍 Checking "Ice Globes" products:\n')
    
    const iceGlobes = await Product.find({ name: { $regex: /Ice Globes/i } }).lean()
    for (const product of iceGlobes) {
      console.log(`Product: ${product.name}`)
      if (product.category) {
        const categoryId = typeof product.category === 'string' 
          ? product.category 
          : product.category._id?.toString() || product.category.toString()
        
        const category = await Category.findById(categoryId)
        if (category) {
          console.log(`  Category: ${category.name} (${category.slug}) - Level: ${category.level}`)
          
          // Get full path
          let current = category
          const path: string[] = [current.slug]
          while (current.parent) {
            const parent = await Category.findById(current.parent)
            if (parent) {
              path.unshift(parent.slug)
              current = parent
            } else {
              break
            }
          }
          console.log(`  Full path: ${path.join(' > ')}`)
        }
      }
    }
    
    process.exit(0)
  } catch (error: any) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

checkProductCategories()




