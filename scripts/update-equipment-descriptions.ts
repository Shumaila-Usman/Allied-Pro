import connectDB from '../lib/mongodb'
import Product from '../lib/models/Product'

// Equipment products with updated descriptions
const equipmentProducts = [
  {
    name: 'Ionic Facial Steamer',
    description: `Product Overview
Professional ionic facial steamer with ozone function for deep skin hydration and detox.

Specifications
Adjustable height for client comfort
Ozone function for antibacterial and cleansing effect
Salon and spa-grade

How to Use
Fill with water, adjust height, and steam the face for 8–15 minutes.

Benefits
Deeply hydrates and softens skin
Opens pores for better treatment absorption
Professional spa results

CTA
Enhance your facial treatments with an ionic steamer.`
  },
  {
    name: 'Professional Salon/Spa Trolley (HST 145)',
    description: `Product Overview
Durable aluminium salon trolley for organized spa or salon services.

Specifications
Adjustable tray top
Multiple compartments
Professional-grade, lightweight aluminium

How to Use
Organize tools, creams, and equipment on adjustable trays during services.

Benefits
Improves workflow and efficiency
Keeps salon neat and professional
Easy access to tools

CTA
Optimize your salon workflow with a professional trolley.`
  },
  {
    name: '2-in-1 Portable Steamer',
    description: `Product Overview
Versatile table-top hair and facial steamer for spa and salon use.

Specifications
Dual-use for hair and face
Compact, portable design
Salon-grade efficiency

How to Use
Place on table, fill with water, and use on hair or face as required.

Benefits
Space-saving and multi-functional
Professional hydration and hair treatments
Portable for mobile services

CTA
Upgrade your facial and hair treatments with a 2-in-1 steamer.`
  },
  {
    name: 'Portable Facial Steamer',
    description: `Product Overview
Compact facial steamer for table-top spa use.

Specifications
Table-top design
Lightweight and easy to handle
Professional use

How to Use
Steam face for 8–15 minutes to open pores and prep for treatments.

Benefits
Deep cleansing and hydration
Improves absorption of serums and masks
Salon-quality results in a portable device

CTA
Provide professional facial services with a portable steamer.`
  },
  {
    name: 'Economical Hair Salon Trolley',
    description: `Product Overview
Affordable hair salon trolley with mobility and storage.

Specifications
5 removable trays
Smooth-rolling wheels
Compact and lightweight

How to Use
Organize hair tools, brushes, and products for easy access during services.

Benefits
Improves efficiency
Easy to move around the salon
Budget-friendly professional equipment

CTA
Streamline your hair services with a practical salon trolley.`
  },
  {
    name: 'Salon/Spa Rolling Tray Trolley',
    description: `Product Overview
Professional rolling tray trolley with stainless steel stand for salons and spas.

Specifications
Aluminium star base
Mechanical timer built-in
Sturdy and durable design

How to Use
Store tools and equipment; roll around easily during services.

Benefits
Enhances salon efficiency
Durable and professional
Timer function for precision treatments

CTA
Upgrade your spa or salon setup with a rolling trolley.`
  },
  {
    name: 'Metal and Glass Trolley',
    description: `Product Overview
Elegant metal and glass trolley ideal for professional spa use.

Specifications
Glass shelves with metal frame
Durable and stylish
Multi-purpose storage

How to Use
Store creams, tools, or equipment neatly during treatments.

Benefits
Sleek professional appearance
Easy to clean and maintain
Organizes spa essentials efficiently

CTA
Bring elegance and functionality to your spa treatments with this trolley.`
  },
  {
    name: 'Magnifying Lamp Stand (4WH)',
    description: `Product Overview
Sturdy 4-wheel floor magnifying lamp stand for precision treatments.

Specifications
Mobile 4-wheel base
Adjustable height
Professional spa-grade

How to Use
Place under client area; use lamp for precise skin or nail treatments.

Benefits
Provides clear visibility
Mobile and adjustable
Enhances precision and safety

CTA
Improve treatment accuracy with a 4WH magnifying lamp stand.`
  },
  {
    name: 'Magnifying Lamp Stand (5WH)',
    description: `Product Overview
Professional 5-wheel floor magnifying lamp stand for salon services.

Specifications
Sturdy 5-wheel base
Adjustable arm and height
Durable and mobile

How to Use
Move around the treatment area and adjust height for precision work.

Benefits
Stable and easy to maneuver
Enhances client treatment results
Ideal for facial or nail work

CTA
Ensure professional visibility with a 5WH magnifying lamp stand.`
  },
  {
    name: 'Magnifying Lamp Stand (Round)',
    description: `Product Overview
Heavy-duty round magnifying lamp stand for salon precision.

Specifications
Stable round base
Adjustable lamp arm
Professional-grade

How to Use
Use for detailed skin care, nail, or facial treatments.

Benefits
Strong and durable
Precise lighting for accuracy
Mobile for salon convenience

CTA
Upgrade your precision treatments with a round magnifying lamp stand.`
  },
  {
    name: 'Magnifying Lamp (3d or 5d)',
    description: `Product Overview
High-efficiency tabletop magnifying lamp with modifiable spring arm.

Specifications
Optional mount
3D or 5D magnification
Adjustable and clamp-based

How to Use
Clamp to table, adjust arm and magnification for detailed work.

Benefits
Enhances visibility for fine treatments
Flexible positioning
Professional results

CTA
Achieve detailed precision with a 3D/5D magnifying tabletop lamp.`
  },
  {
    name: 'Magnifying Lamp (3d or 5d) SMD',
    description: `Product Overview
SMD high-efficiency magnifying lamp for salons and spas.

Specifications
3D or 5D magnification
SMD light for bright, clear visibility
Adjustable spring arm

How to Use
Place over treatment area to view skin or nails with clarity.

Benefits
Bright, even illumination
Reduces eye strain
Ideal for precision work

CTA
Enhance your treatment visibility with a 3D/5D SMD lamp.`
  },
  {
    name: 'Bulbs (T4, T5, T9, UV)',
    description: `Product Overview
High-quality replacement bulbs for magnifying lamps and UV equipment.

Specifications
Available T4, T5, T9, and UV types
Professional salon-grade
Long-lasting performance

How to Use
Install compatible lamps for optimal illumination and UV treatment.

Benefits
Bright and efficient lighting
Supports professional treatment quality
Long lifespan

CTA
Ensure perfect lighting for all salon and spa treatments with professional bulbs.`
  }
]

async function updateEquipmentDescriptions() {
  try {
    await connectDB()
    console.log('✅ Connected to database\n')
    console.log(`📝 Updating ${equipmentProducts.length} equipment products:\n`)
    console.log('─'.repeat(80))

    let updated = 0
    let notFound = 0

    for (const productData of equipmentProducts) {
      try {
        const product = await Product.findOne({ name: productData.name })
        
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

updateEquipmentDescriptions()




