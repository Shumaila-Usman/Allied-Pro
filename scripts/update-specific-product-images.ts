/**
 * Script to update images for specific products based on provided image files
 * Matches product names with image file names and updates the database
 */

import connectDB from '../lib/mongodb'
import Product from '../lib/models/Product'

// Image files provided by user
const imageFiles = [
  '2 in 1 Electric Jade Roller.jpg',
  'Cellulose Sponge.png',
  'Compressed Dry Sheet Masks 100 PCBAG.jpg',
  'Cotton Pads.jpg',
  'Disposable Head Band Roll Stick On.jpg',
  'Elastic Bandge.jpg',
  'Facial Brush Synthetic.jpg',
  'FACIAL MASSAGE BED White  Black.png',
  'Golden Firming Gel Mask 30ml.jpg',
  'Gua Sha Stone Concave.jpg',
  'Gua Sha Stone Dolphin.png',
  'Gua Sha Stone S Shaped.jpg',
  'High Quality Nail Wipes.jpg',
  'Hot Stone Heater 18q.png',
  'Hyaluronic Acid Gel Mask 30ml.jpg',
  'Ice Globes 2 PCBOX.png',
  'Jade Roller.jpg',
  'Mixing Bowl Set.jpg',
  'Nonwoven Dry Sheet Mask.jpg',
  'Nonwoven Dry Under Eye Pad.jpg',
  'Paraffin Heater.jpg',
  'Pedicure Foam, Paper, & Terry Slippers.jpg',
  'Portable Manicure Table Folable Legs.jpg',
  'Pumice Stone.png',
  'SalonSpa Rolling Tray Trolley.jpg',
  'SILK RIMA DEPILATORY CREAM PINK CAN WAX 14 OZ Spa.jpg',
  'SILK RIMA DEPILATORY HONEY CAN WAX 14 OZ.jpg',
  'SILK RIMA DEPILATORY Y ZINC OXIDE WHITE CAN WAX.jpg',
  'SILK RIMA DEPILLTIRY AZULENE CAN WAX 14 OZ.jpg',
  'Square Warmer Cooler.jpg',
  'TU Electric Jade Roller.jpg',
  'Under-Eye Press Disc Electric Jade.jpg',
]

// Helper function to normalize strings for matching
function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '') // Remove all non-alphanumeric
    .trim()
}

// Helper function to extract product name from image filename
function extractProductNameFromImage(filename: string): string {
  // Remove extension
  let name = filename.replace(/\.(jpg|jpeg|png|webp)$/i, '')
  // Remove common suffixes that might not be in product name
  name = name.replace(/\s+\d+\s*(ml|oz|pc|pcs?|box|bag)$/i, '')
  return name.trim()
}

// Helper function to match product name with image filename
function findMatchingImage(productName: string, imageFiles: string[]): string | null {
  const normalizedProductName = normalizeString(productName)
  
  // Try exact match first (normalized)
  for (const imageFile of imageFiles) {
    const imageName = extractProductNameFromImage(imageFile)
    const normalizedImageName = normalizeString(imageName)
    
    if (normalizedProductName === normalizedImageName) {
      return imageFile
    }
  }
  
  // Try partial match - check if product name contains image name or vice versa
  for (const imageFile of imageFiles) {
    const imageName = extractProductNameFromImage(imageFile)
    const normalizedImageName = normalizeString(imageName)
    
    // Check if product name contains image name (or significant portion)
    if (normalizedProductName.includes(normalizedImageName) && normalizedImageName.length > 5) {
      return imageFile
    }
    
    // Check if image name contains product name (or significant portion)
    if (normalizedImageName.includes(normalizedProductName) && normalizedProductName.length > 5) {
      return imageFile
    }
  }
  
  // Try fuzzy matching for common variations
  for (const imageFile of imageFiles) {
    const imageName = extractProductNameFromImage(imageFile)
    const normalizedImageName = normalizeString(imageName)
    
    // Remove common words and compare
    const productWords = normalizedProductName.split(/\s+/).filter(w => w.length > 3)
    const imageWords = normalizedImageName.split(/\s+/).filter(w => w.length > 3)
    
    const matchingWords = productWords.filter(w => imageWords.includes(w))
    if (matchingWords.length >= 2) {
      return imageFile
    }
  }
  
  return null
}

async function updateProductImages() {
  try {
    await connectDB()
    console.log('✅ Connected to database\n')

    // Fetch all products (without lean to preserve Mongoose document structure)
    const products = await Product.find({})

    console.log(`📦 Found ${products.length} products in database\n`)
    console.log('🔄 Matching products with images...\n')
    console.log('─'.repeat(80))

    let updated = 0
    let notMatched = 0
    const matchedProducts: Array<{ product: any; image: string }> = []
    const unmatchedImages: string[] = [...imageFiles]

    // Match products with images
    for (const product of products) {
      const productName = product.name || ''
      const matchingImage = findMatchingImage(productName, imageFiles)
      
      if (matchingImage) {
        matchedProducts.push({ product, image: matchingImage })
        // Remove from unmatched list
        const index = unmatchedImages.indexOf(matchingImage)
        if (index > -1) {
          unmatchedImages.splice(index, 1)
        }
      }
    }

    // Update products with matched images
    console.log(`\n📝 Updating ${matchedProducts.length} products:\n`)
    
    for (const { product, image } of matchedProducts) {
      try {
        const imagePath = `/products/${image}`
        
        // Use findByIdAndUpdate to only update the images field
        const updatedProduct = await Product.findByIdAndUpdate(
          product._id,
          { $set: { images: [imagePath] } },
          { new: true, runValidators: false }
        )

        if (!updatedProduct) {
          console.log(`❌ Product not found: ${product.name} (${product._id})`)
          continue
        }

        console.log(`✅ Updated: ${product.name}`)
        console.log(`   Image: ${imagePath}`)
        updated++
      } catch (error: any) {
        console.error(`❌ Error updating ${product.name}:`, error.message)
      }
    }

    console.log('\n' + '─'.repeat(80))
    console.log(`\n📊 Summary:`)
    console.log(`   ✅ Updated: ${updated} products`)
    
    if (unmatchedImages.length > 0) {
      console.log(`\n⚠️  Could not match ${unmatchedImages.length} images to products:`)
      unmatchedImages.forEach(img => console.log(`   - ${img}`))
      console.log(`\n💡 These images may need manual matching or the products may not exist in the database.`)
    }

    // Show products that weren't matched
    const matchedProductNames = matchedProducts.map(m => m.product.name.toLowerCase())
    const unmatchedProducts = products.filter(p => !matchedProductNames.includes(p.name.toLowerCase()))
    
    if (unmatchedProducts.length > 0 && unmatchedImages.length > 0) {
      console.log(`\n💡 Potential matches (manual review needed):`)
      unmatchedImages.forEach(imageFile => {
        const imageName = extractProductNameFromImage(imageFile)
        console.log(`\n   Image: ${imageFile}`)
        console.log(`   Similar product names:`)
        unmatchedProducts.forEach(p => {
          const similarity = calculateSimilarity(p.name.toLowerCase(), imageName.toLowerCase())
          if (similarity > 0.3) {
            console.log(`     - ${p.name} (similarity: ${(similarity * 100).toFixed(0)}%)`)
          }
        })
      })
    }

    console.log('\n✅ Update complete!')
    process.exit(0)
  } catch (error: any) {
    console.error('❌ Error:', error.message)
    console.error(error.stack)
    process.exit(1)
  }
}

// Simple similarity calculation
function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2
  const shorter = str1.length > str2.length ? str2 : str1
  
  if (longer.length === 0) return 1.0
  
  const distance = levenshteinDistance(longer, shorter)
  return (longer.length - distance) / longer.length
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = []
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i]
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        )
      }
    }
  }
  
  return matrix[str2.length][str1.length]
}

// Run the script
updateProductImages()

