/**
 * Script to verify image paths match actual files (case-sensitive check)
 * This helps identify case sensitivity issues for deployment
 * 
 * Usage: npx tsx scripts/verify-image-paths.ts
 */

import fs from 'fs'
import path from 'path'

interface ProductFromJSON {
  id: string
  name: string
  images: string[]
  [key: string]: any
}

function verifyImagePaths() {
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

    // Get all files in public/products directory
    const productsDir = path.join(process.cwd(), 'public', 'products')
    
    if (!fs.existsSync(productsDir)) {
      console.error(`❌ Directory not found: ${productsDir}`)
      process.exit(1)
    }

    const actualFiles = fs.readdirSync(productsDir)
    console.log(`📁 Found ${actualFiles.length} files in public/products/\n`)
    console.log('🔄 Verifying image paths...\n')
    console.log('─'.repeat(80))

    let valid = 0
    let missing = 0
    let caseMismatch = 0
    const missingImages: Array<{ product: string; image: string }> = []
    const caseMismatches: Array<{ product: string; image: string; actual: string }> = []

    // Create a case-insensitive map of actual files
    const fileMap = new Map<string, string>()
    actualFiles.forEach(file => {
      fileMap.set(file.toLowerCase(), file)
    })

    // Check each product's images
    for (const product of productsFromJSON) {
      if (!product.images || product.images.length === 0) {
        continue
      }

      for (const imagePath of product.images) {
        // Extract filename from path (e.g., "/products/image.PNG" -> "image.PNG")
        const filename = imagePath.replace('/products/', '')
        
        // Check if file exists with exact case
        if (actualFiles.includes(filename)) {
          valid++
        } else {
          // Check if file exists with different case
          const lowerFilename = filename.toLowerCase()
          const actualFile = fileMap.get(lowerFilename)
          
          if (actualFile) {
            caseMismatch++
            caseMismatches.push({
              product: product.name,
              image: filename,
              actual: actualFile
            })
            console.log(`⚠️  Case mismatch: ${product.name}`)
            console.log(`   Expected: ${filename}`)
            console.log(`   Actual:   ${actualFile}`)
          } else {
            missing++
            missingImages.push({
              product: product.name,
              image: filename
            })
            console.log(`❌ Missing: ${product.name}`)
            console.log(`   Image: ${filename}`)
          }
        }
      }
    }

    console.log('\n' + '─'.repeat(80))
    console.log(`\n📊 Summary:`)
    console.log(`   ✅ Valid paths: ${valid}`)
    console.log(`   ⚠️  Case mismatches: ${caseMismatch}`)
    console.log(`   ❌ Missing files: ${missing}`)

    if (caseMismatches.length > 0) {
      console.log(`\n⚠️  CASE SENSITIVITY ISSUES FOUND:`)
      console.log(`   These will cause problems on Linux servers (most hosting platforms).`)
      console.log(`   Consider updating the database to match actual file names.\n`)
    }

    if (missingImages.length > 0) {
      console.log(`\n❌ MISSING FILES:`)
      console.log(`   These images are referenced but don't exist in public/products/\n`)
    }

    if (caseMismatch === 0 && missing === 0) {
      console.log(`\n✅ All image paths are valid!`)
    } else {
      console.log(`\n💡 TIP: On Linux servers (most hosting platforms), file names are case-sensitive.`)
      console.log(`   Make sure the image paths in the database match the actual file names exactly.`)
    }

    process.exit(0)
  } catch (error: any) {
    console.error('❌ Error:', error.message)
    console.error(error.stack)
    process.exit(1)
  }
}

// Run the script
verifyImagePaths()

