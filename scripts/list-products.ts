/**
 * Script to list all products with their IDs
 * Useful for finding product IDs when adding images
 * 
 * Run: npx tsx scripts/list-products.ts
 */

import connectDB from '../lib/mongodb'
import Product from '../lib/models/Product'

async function listProducts() {
  try {
    await connectDB()
    console.log('Connected to database\n')

    const products = await Product.find({})
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .lean()

    if (products.length === 0) {
      console.log('No products found in database.')
      process.exit(0)
    }

    console.log(`Found ${products.length} products:\n`)
    console.log('─'.repeat(80))
    
    products.forEach((product: any, index: number) => {
      const categoryName = product.category?.name || 'N/A'
      const imageCount = Array.isArray(product.images) ? product.images.length : 0
      const hasImages = imageCount > 0 ? '✅' : '❌'
      
      console.log(`\n${index + 1}. ${product.name}`)
      console.log(`   ID: ${product._id}`)
      console.log(`   Category: ${categoryName}`)
      console.log(`   Images: ${hasImages} ${imageCount} image(s)`)
      if (product.images && product.images.length > 0) {
        console.log(`   Image paths: ${product.images.join(', ')}`)
      }
      console.log(`   SKU: ${product.sku || 'N/A'}`)
    })

    console.log('\n' + '─'.repeat(80))
    console.log(`\nTotal: ${products.length} products`)
    
    process.exit(0)
  } catch (error: any) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

listProducts()




