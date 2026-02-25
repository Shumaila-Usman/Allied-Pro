/**
 * Script to add images to existing products in the database
 * 
 * Usage:
 * 1. Place your product images in the public/products/ folder
 * 2. Update the productImageMap below with product IDs and their image paths
 * 3. Run: npx tsx scripts/add-product-images.ts
 */

import mongoose from 'mongoose'
import connectDB from '../lib/mongodb'
import Product from '../lib/models/Product'

// Map product IDs to their image paths
// Images should be in public/products/ folder
// Use paths like: '/products/image-name.jpg' or just 'image-name.jpg'
const productImageMap: Record<string, string[]> = {
  // Example:
  // 'product-id-1': ['/products/product-1-1.jpg', '/products/product-1-2.jpg'],
  // 'product-id-2': ['/products/product-2-1.jpg'],
  // Add your product IDs and image paths here
}

async function addImagesToProducts() {
  try {
    await connectDB()
    console.log('Connected to database')

    const productIds = Object.keys(productImageMap)
    
    if (productIds.length === 0) {
      console.log('⚠️  No products to update. Please add product IDs and image paths to productImageMap.')
      process.exit(0)
    }

    let updated = 0
    let notFound = 0
    let errors = 0

    for (const productId of productIds) {
      try {
        const product = await Product.findById(productId)
        
        if (!product) {
          console.log(`❌ Product not found: ${productId}`)
          notFound++
          continue
        }

        const images = productImageMap[productId]
        product.images = images
        await product.save()

        console.log(`✅ Updated product: ${product.name} (${productId})`)
        console.log(`   Images: ${images.join(', ')}`)
        updated++
      } catch (error: any) {
        console.error(`❌ Error updating product ${productId}:`, error.message)
        errors++
      }
    }

    console.log('\n📊 Summary:')
    console.log(`   ✅ Updated: ${updated}`)
    console.log(`   ❌ Not found: ${notFound}`)
    console.log(`   ⚠️  Errors: ${errors}`)
    
    await mongoose.connection.close()
    console.log('\n✅ Done!')
  } catch (error: any) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

// Run the script
addImagesToProducts()






