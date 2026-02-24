/**
 * Script to update Ice Globes (Redness) product with image
 */

import connectDB from '../lib/mongodb'
import Product from '../lib/models/Product'

async function updateIceGlobesRedness() {
  try {
    await connectDB()
    console.log('✅ Connected to database\n')

    // Find the Ice Globes (Redness) product
    const product = await Product.findOne({ 
      name: { $regex: /Ice Globes.*Redness/i } 
    })

    if (!product) {
      console.log('❌ Product "Ice Globes (Redness)" not found')
      console.log('\n🔍 Searching for similar products...\n')
      
      // Try to find any Ice Globes products
      const allIceGlobes = await Product.find({ 
        name: { $regex: /Ice Globes/i } 
      })
      
      if (allIceGlobes.length === 0) {
        console.log('No Ice Globes products found in database.')
      } else {
        console.log(`Found ${allIceGlobes.length} Ice Globes product(s):`)
        allIceGlobes.forEach((p: any) => {
          console.log(`  - ${p.name} (ID: ${p._id})`)
          console.log(`    Current images: ${p.images?.length || 0}`)
        })
      }
      process.exit(1)
    }

    const imagePath = '/products/Ice Globes 2 PCBOX.png'
    
    await Product.findByIdAndUpdate(
      product._id,
      { $set: { images: [imagePath] } },
      { new: true, runValidators: false }
    )

    console.log(`✅ Updated: ${product.name}`)
    console.log(`   Image: ${imagePath}`)
    console.log('\n✅ Update complete!')
    process.exit(0)
  } catch (error: any) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

updateIceGlobesRedness()



