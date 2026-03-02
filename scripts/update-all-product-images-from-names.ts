/**
 * Script to update ALL product images based on their current names in database
 * This generates image paths using the same pattern as the seed script:
 * name.toLowerCase().replace(/\s+/g, '-')-1.jpg
 */

import connectDB from '../lib/mongodb'
import Product from '../lib/models/Product'

// Helper function to generate image path from product name (same as seed script)
function generateImagePath(productName: string): string {
  // Convert to lowercase and replace spaces with hyphens
  const imageName = productName.toLowerCase().replace(/\s+/g, '-')
  return `/products/${imageName}-1.jpg`
}

async function updateAllProductImages() {
  try {
    await connectDB()
    console.log('✅ Connected to database\n')

    // Fetch all products
    const products = await Product.find({})
    console.log(`📦 Found ${products.length} products in database\n`)
    console.log('🔄 Updating image paths based on product names...\n')
    console.log('─'.repeat(80))

    let updated = 0
    let errors = 0

    for (const product of products) {
      try {
        const productName = product.name || ''
        
        if (!productName) {
          console.log(`⚠️  Skipping product with no name (ID: ${product._id})`)
          continue
        }

        // Generate image path using the same pattern as seed script
        const imagePath = generateImagePath(productName)
        
        // Update the product's images array
        await Product.findByIdAndUpdate(
          product._id,
          { $set: { images: [imagePath] } },
          { new: true, runValidators: false }
        )

        console.log(`✅ Updated: ${productName}`)
        console.log(`   Image path: ${imagePath}`)
        updated++
      } catch (error: any) {
        console.error(`❌ Error updating ${product.name}:`, error.message)
        errors++
      }
    }

    console.log('\n' + '─'.repeat(80))
    console.log(`\n📊 Summary:`)
    console.log(`   ✅ Updated: ${updated} products`)
    console.log(`   ❌ Errors: ${errors} products`)
    console.log('\n✅ Update complete!')
    console.log('\n💡 Make sure your image files are named exactly as shown above in the /public/products/ folder')
    process.exit(0)
  } catch (error: any) {
    console.error('❌ Error:', error.message)
    console.error(error.stack)
    process.exit(1)
  }
}

// Run the script
updateAllProductImages()







