/**
 * Script to update remaining product images that need manual mapping
 */

import connectDB from '../lib/mongodb'
import Product from '../lib/models/Product'

// Manual mapping for remaining images
const manualMappings: Array<{ productName: string; imageFile: string }> = [
  { productName: 'Elastic Bandages', imageFile: 'Elastic Bandge.jpg' },
  { productName: 'Nail Wipes (High-Quality or Ultra-Fine)', imageFile: 'High Quality Nail Wipes.jpg' },
  { productName: 'Pedicure Slippers (Foam, Paper, & Terry)', imageFile: 'Pedicure Foam, Paper, & Terry Slippers.jpg' },
  { productName: 'SilkRoma Depilatory Honey Wax', imageFile: 'SILK RIMA DEPILATORY HONEY CAN WAX 14 OZ.jpg' },
  { productName: 'SilkRoma Depilatory Cream Wax', imageFile: 'SILK RIMA DEPILATORY CREAM PINK CAN WAX 14 OZ Spa.jpg' },
  { productName: 'SilkRoma Depilatory Zinc Wax', imageFile: 'SILK RIMA DEPILATORY Y ZINC OXIDE WHITE CAN WAX.jpg' },
  { productName: 'Roma Azulene Wax', imageFile: 'SILK RIMA DEPILLTIRY AZULENE CAN WAX 14 OZ.jpg' },
  { productName: 'Square/Round Warmer Coolers', imageFile: 'Square Warmer Cooler.jpg' },
  { productName: 'Disposable Headbands', imageFile: 'Disposable Head Band Roll Stick On.jpg' },
]

async function updateRemainingImages() {
  try {
    await connectDB()
    console.log('✅ Connected to database\n')
    console.log(`📝 Updating ${manualMappings.length} products with manual mappings:\n`)
    console.log('─'.repeat(80))

    let updated = 0
    let notFound = 0

    for (const { productName, imageFile } of manualMappings) {
      try {
        const product = await Product.findOne({ name: productName })
        
        if (!product) {
          console.log(`❌ Product not found: ${productName}`)
          notFound++
          continue
        }

        const imagePath = `/products/${imageFile}`
        
        await Product.findByIdAndUpdate(
          product._id,
          { $set: { images: [imagePath] } },
          { new: true, runValidators: false }
        )

        console.log(`✅ Updated: ${productName}`)
        console.log(`   Image: ${imagePath}`)
        updated++
      } catch (error: any) {
        console.error(`❌ Error updating ${productName}:`, error.message)
      }
    }

    console.log('\n' + '─'.repeat(80))
    console.log(`\n📊 Summary:`)
    console.log(`   ✅ Updated: ${updated} products`)
    console.log(`   ❌ Not found: ${notFound} products`)
    console.log('\n✅ Update complete!')
    process.exit(0)
  } catch (error: any) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

updateRemainingImages()




