/**
 * Script to sync product images from data/products.json to MongoDB
 * This will update all products in the database with their images from the JSON file
 * 
 * Usage: npx tsx scripts/sync-images-from-json.ts
 */

import mongoose from 'mongoose'
import connectDB from '../lib/mongodb'
import Product from '../lib/models/Product'
import fs from 'fs'
import path from 'path'

interface ProductFromJSON {
  id: string
  name: string
  images: string[]
  [key: string]: any
}

async function syncImagesFromJSON() {
  try {
    // Read products.json
    const jsonPath = path.join(process.cwd(), 'data', 'products.json')
    console.log(`📖 Reading products from: ${jsonPath}\n`)
    
    if (!fs.existsSync(jsonPath)) {
      console.error(`❌ File not found: ${jsonPath}`)
      process.exit(1)
    }

    const jsonData = fs.readFileSync(jsonPath, 'utf-8')
    const productsFromJSON: ProductFromJSON[] = JSON.parse(jsonData)
    
    console.log(`📦 Found ${productsFromJSON.length} products in JSON file\n`)

    // Connect to database
    await connectDB()
    console.log('✅ Connected to database\n')
    console.log('🔄 Syncing images to database...\n')
    console.log('─'.repeat(80))

    let updated = 0
    let notFound = 0
    let errors = 0
    let skipped = 0

    // Process each product from JSON
    for (const jsonProduct of productsFromJSON) {
      try {
        // Skip if no images
        if (!jsonProduct.images || jsonProduct.images.length === 0) {
          skipped++
          continue
        }

        // Try to find product by name (most reliable)
        let product = await Product.findOne({ name: jsonProduct.name })

        // If not found by name, try by the ID from JSON (if it matches MongoDB _id format)
        if (!product && jsonProduct.id) {
          try {
            // Check if the ID looks like a MongoDB ObjectId
            if (mongoose.Types.ObjectId.isValid(jsonProduct.id)) {
              product = await Product.findById(jsonProduct.id)
            }
          } catch (e) {
            // Ignore ID parsing errors
          }
        }

        if (!product) {
          console.log(`⚠️  Product not found in database: ${jsonProduct.name}`)
          notFound++
          continue
        }

        // Update product images
        product.images = jsonProduct.images
        await product.save()

        console.log(`✅ Updated: ${jsonProduct.name}`)
        console.log(`   Images: ${jsonProduct.images.join(', ')}`)
        updated++
      } catch (error: any) {
        console.error(`❌ Error updating ${jsonProduct.name}:`, error.message)
        errors++
      }
    }

    console.log('\n' + '─'.repeat(80))
    console.log(`\n📊 Summary:`)
    console.log(`   ✅ Updated: ${updated} products`)
    console.log(`   ⚠️  Not found: ${notFound} products`)
    console.log(`   ⏭️  Skipped (no images): ${skipped} products`)
    console.log(`   ❌ Errors: ${errors} products`)
    
    await mongoose.connection.close()
    console.log('\n✅ Sync complete! Images should now show on the site.')
    process.exit(0)
  } catch (error: any) {
    console.error('❌ Error:', error.message)
    console.error(error.stack)
    process.exit(1)
  }
}

// Run the script
syncImagesFromJSON()

