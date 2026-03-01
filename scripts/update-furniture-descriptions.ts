import connectDB from '../lib/mongodb'
import Product from '../lib/models/Product'

// Furniture products with updated descriptions
const furnitureProducts = [
  {
    name: 'FACIAL MASSAGE BED WHITE / BLACK',
    description: `Product Overview
The Multipurpose Facial Bed is perfect for spa and salon professionals performing facials, massages, and skincare treatments. Its ergonomic design ensures comfort for both clients and therapists.

Specifications
Adjustable backrest and height
Sturdy professional frame
Comfortable cushioned surface

How to Use
Place the bed on a flat surface, adjust the backrest and height to suit the client's comfort, and cover with a towel or sheet. Ideal for facials, massages, or any spa treatment. Clean after each session.

Benefits
Provides ergonomic support for client comfort
Improves therapist posture during treatments
Enhances treatment quality and efficiency

CTA
Upgrade your treatment space today!`
  },
  {
    name: 'FMB2 FACIAL MASSAGE BED',
    description: `Product Overview
The FMB2 Facial Massage Bed offers professional comfort for facials, massages, and spa therapies. Available in white and black, designed for durability.

Specifications
Adjustable backrest
High-density foam padding
Strong steel frame

How to Use
Place the bed on a flat surface, adjust the backrest, and cover with protective sheets. Use for facial massages, skincare treatments, or body therapies. Clean after each use.

Benefits
Ensures professional client support
Enhances therapist efficiency
Durable and long-lasting for daily use

CTA
Provide premium spa services!`
  },
  {
    name: 'PMB Portable Massage Bed',
    description: `Product Overview
The Portable Massage Bed is lightweight and foldable, perfect for mobile spa therapists or salons with limited space.

Specifications
Foldable design
Adjustable headrest
Sturdy lightweight frame

How to Use
Unfold the bed on a stable surface, adjust the headrest, and cover with a sheet. Ideal for facials or body treatments, then fold for storage.

Benefits
Portable and easy to store
Professional comfort anywhere
Supports mobile or small-space salons

CTA
Bring spa treatments anywhere!`
  },
  {
    name: 'BT-02 Wooden Trolley with 2 Draws',
    description: `Product Overview
The BT-02 Wooden Trolley keeps spa and salon tools organized. Two drawers provide ample storage for essentials.

Specifications
2 storage drawers
Smooth-rolling wheels
Durable wooden frame

How to Use
Place next to your workstation, store tools and products in drawers, and roll as needed. Wipe clean after use.

Benefits
Keeps tools organized and accessible
Enhances workflow efficiency
Durable for daily salon use

CTA
Keep your salon tools organized!`
  },
  {
    name: 'BT-021 SPA SALON METAL TROLLEY',
    description: `Product Overview
A professional metal trolley designed for spa and salon use, with multiple trays for storing tools and products.

Specifications
Multiple storage trays
Smooth-rolling wheels
Durable metal frame

How to Use
Store spa essentials on trays, roll trolley gently between stations, and wipe clean after each session.

Benefits
Durable and long-lasting
Mobile storage for spa and salon tools
Improves workspace organization

CTA
Upgrade your salon storage!`
  },
  {
    name: 'BT-018 FACIAL BEAUTY SPA, SALON GLASS TROLLY WITH 4 SHELVES',
    description: `Product Overview
This Glass Trolley with four sturdy shelves offers modern and functional storage for spa and salon products.

Specifications
Four tempered glass shelves
Heavy-duty metal frame
Smooth-rolling wheels

How to Use
Arrange tools and products on shelves, roll as needed during treatments, and wipe clean regularly.

Benefits
Elegant modern design
Easy access to products and tools
Efficient and organized storage solution

CTA
Organize your spa in style!`
  },
  {
    name: 'Salon Spa Color rolling Tray with accessories holder Cart',
    description: `Product Overview
A colorful rolling tray with an accessory holder, perfect for keeping spa tools and products organized during treatments.

Specifications
Rolling design
Integrated accessory holder
Durable and lightweight

How to Use
Place near your workstation, organize tools and products, roll as needed, and clean after use.

Benefits
Keeps essentials within reach
Improves workflow efficiency
Adds color and style to your salon

CTA
Make your salon workflow smoother!`
  },
  {
    name: 'HST-11 MULTI USE SPA, SALON TROLY',
    description: `Product Overview
A versatile multi-use trolley with drawers and compartments for professional spa and salon organization.

Specifications
Multi-use drawers and compartments
Rolling wheels for mobility
Durable design

How to Use
Store spa tools and products, move trolley easily between stations, and wipe clean regularly.

Benefits
Improves salon efficiency
Keeps tools organized
Supports professional service standards

CTA
Enhance your salon organization!`
  },
  {
    name: 'HST-35 #1 SELLER SALON TROLLY WITH DRAWS & ACCESSORIES HOLDER',
    description: `Product Overview
Top-selling HST-35 Trolley with drawers and accessory holders for ultimate spa and salon organization.

Specifications
Multiple drawers and holders
Smooth-rolling wheels
Durable construction

How to Use
Store tools and products in drawers and holders, roll between workstations, and clean regularly.

Benefits
#1 organization solution
Professional appearance and mobility
Enhances workflow efficiency

CTA
Get the #1 trolley today!`
  },
  {
    name: 'PMT Portable Manicure Table Folable Legs',
    description: `Product Overview
Compact and foldable manicure table ideal for mobile or professional nail services.

Specifications
Foldable legs
Smooth working surface
Lightweight and portable

How to Use
Unfold on a stable surface, cover with a towel or sheet, perform manicure services, then fold for storage.

Benefits
Portable and easy to store
Professional manicure setup anywhere
Lightweight but durable

CTA
Start professional nail services instantly!`
  },
  {
    name: 'BS-01 SPA - SALON ADJUSTABLE STOOL WHITE / BLACK',
    description: `Product Overview
Ergonomic adjustable stool for salon and spa professionals, available in white or black.

Specifications
Height-adjustable
Padded seat
Rolling casters

How to Use
Adjust height to suit your working level, roll smoothly during treatments, and wipe clean after use.

Benefits
Ergonomic and mobile
Supports long treatment sessions comfortably
Professional look for any salon

CTA
Upgrade your salon seating!`
  },
  {
    name: 'BS-02 SPA - SALON ADJUSTABLE STOOL WHITE / BLACK',
    description: `Product Overview
Ergonomic adjustable stool for salon and spa professionals, available in white or black.

Specifications
Height-adjustable
Padded seat
Rolling casters

How to Use
Adjust height to suit your working level, roll smoothly during treatments, and wipe clean after use.

Benefits
Ergonomic and mobile
Supports long treatment sessions comfortably
Professional look for any salon

CTA
Upgrade your salon seating!`
  },
  {
    name: 'MP-01 Pedicure Foot Rest',
    description: `Product Overview
Ergonomic pedicure footrest for maximum client comfort during foot treatments.

Specifications
Adjustable height
Comfortable padded surface
Compact and salon-friendly

How to Use
Place footrest in position, adjust height for client comfort, and use during pedicure services.

Benefits
Provides optimal client support
Enhances pedicure comfort
Improves professional service quality

CTA
Offer premium pedicure comfort!`
  }
]

async function updateFurnitureDescriptions() {
  try {
    await connectDB()
    console.log('✅ Connected to database\n')
    console.log(`📝 Updating ${furnitureProducts.length} furniture products:\n`)
    console.log('─'.repeat(80))

    let updated = 0
    let notFound = 0

    for (const productData of furnitureProducts) {
      try {
        // Try exact match first
        let product = await Product.findOne({ name: productData.name })
        
        // If not found, try case-insensitive match
        if (!product) {
          product = await Product.findOne({ 
            name: { $regex: new RegExp(`^${productData.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
          })
        }
        
        if (!product) {
          console.log(`❌ Product not found: ${productData.name}`)
          notFound++
          continue
        }

        await Product.findByIdAndUpdate(
          product._id,
          { $set: { description: productData.description } },
          { new: true, runValidators: false }
        )

        console.log(`✅ Updated: ${productData.name}`)
        updated++
      } catch (error: any) {
        console.error(`❌ Error updating ${productData.name}:`, error.message)
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

updateFurnitureDescriptions()





