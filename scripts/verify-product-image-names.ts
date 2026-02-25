/**
 * Script to verify product names and their expected image file names
 * This shows what image files should exist based on product names in database
 */

import connectDB from '../lib/mongodb'
import Product from '../lib/models/Product'
import fs from 'fs'
import path from 'path'

// Helper function to generate image path from product name (same as seed script)
function generateImagePath(productName: string): string {
  const imageName = productName.toLowerCase().replace(/\s+/g, '-')
  return `/products/${imageName}-1.jpg`
}

// Helper function to get just the filename from path
function getImageFileName(productName: string): string {
  const imageName = productName.toLowerCase().replace(/\s+/g, '-')
  return `${imageName}-1.jpg`
}

async function verifyProductImageNames() {
  try {
    await connectDB()
    console.log('✅ Connected to database\n')

    // Fetch all products
    const products = await Product.find({}).sort({ name: 1 })
    console.log(`📦 Found ${products.length} products in database\n`)
    
    // Check if public/products directory exists
    const productsDir = path.join(process.cwd(), 'public', 'products')
    const imageFiles: string[] = []
    
    if (fs.existsSync(productsDir)) {
      const files = fs.readdirSync(productsDir)
      imageFiles.push(...files.filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f)))
      console.log(`📁 Found ${imageFiles.length} image files in public/products/\n`)
    } else {
      console.log('⚠️  public/products/ directory not found\n')
    }

    console.log('─'.repeat(100))
    console.log('PRODUCT NAME'.padEnd(60) + 'EXPECTED IMAGE FILE'.padEnd(40))
    console.log('─'.repeat(100))

    let matched = 0
    let notMatched = 0
    const missingImages: Array<{ product: string; expectedFile: string }> = []

    for (const product of products) {
      const productName = product.name || 'N/A'
      const expectedFile = getImageFileName(productName)
      const expectedPath = generateImagePath(productName)
      
      // Check if image file exists
      const fileExists = imageFiles.some(f => 
        f.toLowerCase() === expectedFile.toLowerCase() ||
        f.toLowerCase().replace(/[^a-z0-9]/g, '') === expectedFile.toLowerCase().replace(/[^a-z0-9]/g, '')
      )
      
      const status = fileExists ? '✅' : '❌'
      const displayName = productName.length > 58 ? productName.substring(0, 55) + '...' : productName
      const displayFile = expectedFile.length > 38 ? expectedFile.substring(0, 35) + '...' : expectedFile
      
      console.log(`${status} ${displayName.padEnd(58)}${displayFile.padEnd(38)}`)
      
      if (fileExists) {
        matched++
      } else {
        notMatched++
        missingImages.push({ product: productName, expectedFile })
      }
    }

    console.log('─'.repeat(100))
    console.log(`\n📊 Summary:`)
    console.log(`   ✅ Products with matching images: ${matched}`)
    console.log(`   ❌ Products missing images: ${notMatched}`)
    
    if (missingImages.length > 0) {
      console.log(`\n⚠️  Missing image files (${missingImages.length}):`)
      missingImages.forEach(({ product, expectedFile }) => {
        console.log(`   - ${product}`)
        console.log(`     Expected: ${expectedFile}`)
      })
    }

    console.log('\n💡 Image naming pattern:')
    console.log('   Product Name → lowercase → spaces to hyphens → add "-1.jpg"')
    console.log('   Example: "Ice Globes" → "ice-globes-1.jpg"')
    console.log('   Example: "2-in-1 Electric Jade Roller" → "2-in-1-electric-jade-roller-1.jpg"')
    
    process.exit(0)
  } catch (error: any) {
    console.error('❌ Error:', error.message)
    console.error(error.stack)
    process.exit(1)
  }
}

// Run the script
verifyProductImageNames()



