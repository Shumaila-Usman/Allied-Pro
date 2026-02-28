import connectDB from '../lib/mongodb'
import Product from '../lib/models/Product'

// Implement products with updated descriptions
// Note: Some products are combined in the database, so we'll match them accordingly
const implementProducts = [
  {
    name: 'Sterilization Boxes (IBA/IBF)',
    description: `Product Overview
Professional stainless steel sterilization boxes for keeping instruments clean and hygienic.

Specifications
Stainless Steel Sterilization Box – IBA: Dimensions 4" x 8", round bottom, comes with lid, durable corrosion-resistant stainless steel
Stainless Steel Sterilization Box – IBF: Dimensions 4" x 8", flat bottom design, comes with lid, stainless steel construction

How to Use
Place tools inside, cover with lid, and sterilize using autoclave or chemical solutions.

Benefits
Maintains high hygiene standards
Long-lasting and easy to clean
Professional-grade instrument storage

CTA
Ensure safe and clean tools with sterilization boxes.`
  },
  {
    name: 'Stainless Steel Kidney Bowl',
    description: `Product Overview
Multi-purpose kidney-shaped bowl for professional salon and spa use.

Specifications
Size: 4" x 8"
Stainless steel, easy to clean

How to Use
Use for holding small instruments, liquids, or waste during procedures.

Benefits
Hygienic and reusable
Lightweight and durable
Ideal for professional treatments

CTA
Enhance salon hygiene with a kidney bowl.`
  },
  {
    name: 'Stainless Steel Scaler Tray',
    description: `Product Overview
Professional scaler tray for organizing tools during treatments.

Specifications
Size: 4" x 8"
Stainless steel, corrosion-resistant

How to Use
Place instruments for easy access during procedures.

Benefits
Keeps instruments organized
Durable and easy to sanitize
Professional salon quality

CTA
Upgrade your instrument storage with a scaler tray.`
  },
  {
    name: 'Sterilization Trays',
    description: `Product Overview
Professional sterilization trays for organizing instruments in salons or spas.

Specifications
Sterilization Tray with Cover: Available in various sizes (inquire for details), stainless steel, durable and hygienic, comes with secure cover
Sterilization Tray without Cover: Various sizes available, stainless steel, easy to clean
Sterilization Plastic Tray: Lightweight and durable, ideal for small instruments, easy to sanitize

How to Use
Place instruments inside and sterilize using autoclave or disinfectant. Arrange instruments on the tray during procedures or before sterilization. Place instruments inside and clean with disinfectant or chemical sterilizer.

Benefits
Maintains instrument hygiene
Covers prevent contamination
Easy instrument access
Durable and reusable
Cost-effective and portable
Professional-grade storage

CTA
Keep tools sterile and organized with sterilization trays.`
  },
  {
    name: 'Sterilization Jar',
    description: `Product Overview
Professional sterilization jar for liquid disinfectant or autoclave use.

Specifications
Available in small and large sizes
Durable, high-quality material

How to Use
Fill with disinfectant and submerge instruments for sterilization.

Benefits
Keeps instruments clean and safe
Easy to handle and reusable
Suitable for salons and spas

CTA
Maintain hygienic tools with a sterilization jar.`
  },
  {
    name: 'Sharps Container (Small & Large)',
    description: `Product Overview
Safe and durable sharps container for professional salon or spa use.

Specifications
Available in small and large sizes
Durable plastic with secure lid
Quantity: 3 LETTER

How to Use
Dispose of sharp instruments safely to prevent injuries.

Benefits
Protects staff and clients
Complies with safety standards
Reusable and hygienic

CTA
Ensure safe disposal of sharp tools with a sharps container.`
  },
  {
    name: 'Cotton Crepe Bandages',
    description: `Product Overview
Premium cotton crepe bandages for spa, salon, and therapeutic use.

Specifications
Width: 9" | Length: 5m
Soft, flexible, durable

How to Use
Wrap around treatment areas as needed for support or compresses.

Benefits
Provides comfort and support
Breathable and skin-friendly
Professional-quality bandages

CTA
Support client comfort and care with cotton crepe bandages.`
  },
  {
    name: 'Elastic Bandages',
    description: `Product Overview
Professional elastic bandages for support and treatment applications.

Specifications
Width: 9" | Length: 5m
Stretchable and durable

How to Use
Wrap around limbs or areas requiring compression or support.

Benefits
Flexible and comfortable
Ideal for therapy or post-treatment care
Reusable and durable

CTA
Provide professional support and compression with elastic bandages.`
  },
  {
    name: 'Tweezers (Full Range)',
    description: `Product Overview
Professional tweezers for salon, spa, and beauty applications.

Specifications
Flat Tip Tweezer: Stainless steel, professional-quality, durable
Slant Tip Tweezer: High-grade stainless steel, ergonomic design
Slant/Point Tweezer: Dual-purpose tip for various applications, stainless steel, professional-grade
Waxing Tweezer: Stainless steel, ergonomic, durable design
Short Point Tweezer: Stainless steel, durable, compact and ergonomic
Extra Long Tip Tweezer: Stainless steel, extended length for better reach

How to Use
Flat Tip: Use for picking, shaping, or applying small beauty elements.
Slant Tip: Use the angled tip for tweezing, shaping, and precision tasks.
Slant/Point: Use slant tip for brows; point tip for fine hair or detail work.
Waxing: Hold and place wax strips or remove stray hairs with control.
Short Point: Use for fine hair removal or precise detail work in small areas.
Extra Long Tip: Ideal for removing fine hairs or debris in detailed beauty tasks.

Benefits
Precise control and accuracy
Long-lasting and hygienic
Accurate and efficient
Comfortable grip for long sessions
Multi-functional
Precise and easy to handle
Improves waxing accuracy
Hygienic and professional
Easy access to hard areas
Essential tool for beauty professionals

CTA
Enhance precision treatments with professional tweezers.`
  },
  {
    name: 'Ingrown Hair Tweezers',
    description: `Product Overview
Specialized ingrown hair tweezers for safe removal of embedded hair.

Specifications
Ingrown Hair Tweezer: Stainless steel, sharp tip, professional-grade, precise
Ingrown Fine Hair Tweezer: Stainless steel, fine sharp tip for accuracy

How to Use
Lift and extract ingrown hairs gently without damaging the skin. Use on sensitive areas for removing fine or embedded hairs.

Benefits
Reduces irritation
Professional, hygienic design
Minimizes skin trauma
Hygienic and durable
Essential for salons and spas
Salon-quality professional tool

CTA
Treat ingrown hairs safely with specialized tweezers.`
  },
  {
    name: 'Eyelash Tweezers',
    description: `Product Overview
Professional eyelash tweezers for perfect lash application and shaping.

Specifications
Stainless steel, precise tip
Ergonomic design for comfort

How to Use
Use to apply or adjust individual lashes with control and accuracy.

Benefits
Ensures flawless lash application
Durable and hygienic
Professional salon standard

CTA
Create perfect lashes with precision eyelash tweezers.`
  },
  {
    name: 'Nail Pushers (Full Variety)',
    description: `Product Overview
Professional nail pushers for manicure and pedicure services.

Specifications
Flat/Arrow Nail Pusher: Stainless steel, reusable, ergonomic handle
Flat-Dual Ended Nail Pusher: Stainless steel, two functional ends: flat & angled
Pterygium / Round Nail Pusher: Stainless steel, rounded tip for safe cuticle management
Round Dual-Ended Nail Pusher: Stainless steel, durable, two rounded ends for multi-use
Round/Flat Ended Nail Pusher: Stainless steel, ergonomic, professional design
Round Tip Pusher: Stainless steel, ergonomic, rounded tip for safe use

How to Use
Flat/Arrow: Use flat side for cuticle pushing, arrow tip for nail cleaning.
Flat-Dual Ended: Push back cuticles and clean nail beds efficiently.
Pterygium/Round: Gently push back cuticles and manage pterygium without injury.
Round Dual-Ended: Use for pushing cuticles and cleaning nails gently.
Round/Flat Ended: Use round end for cuticle work, flat end for nail cleaning.
Round Tip: Push back cuticles and clean nail beds safely.

Benefits
Professional nail care
Durable, easy to clean
Multi-functional and ergonomic
Hygienic and durable
Safe for sensitive nail areas
Professional, long-lasting tool
Easy to sterilize
Prevents cuticle damage
Suitable for professional use

CTA
Maintain professional nail care with nail pushers.`
  },
  {
    name: 'Ingrown Nail File',
    description: `Product Overview
Professional ingrown nail file for safe nail edge care.

Specifications
Stainless steel
Fine grit for precision filing

How to Use
File nail edges carefully to prevent ingrown nails.

Benefits
Reduces discomfort
Professional-grade, durable
Easy to clean

CTA
Prevent ingrown nails safely with an ingrown nail file.`
  },
  {
    name: 'Instrument Picker',
    description: `Product Overview
Precision instrument picker for salon and spa tools.

Specifications
Stainless steel, durable
Ergonomic handle

How to Use
Pick up small tools or accessories hygienically and safely.

Benefits
Reduces contamination
Professional-grade and precise
Easy to sanitize

CTA
Handle small tools safely with an instrument picker.`
  },
  {
    name: 'Safety Scissors',
    description: `Product Overview
Durable safety scissors for salon and spa use.

Specifications
Stainless steel
Rounded tips for safety

How to Use
Use for cutting towels, gauze, or disposable items safely.

Benefits
Prevents accidental cuts
Long-lasting and hygienic
Professional quality

CTA
Ensure safe cutting with professional safety scissors.`
  },
  {
    name: 'Cuticle Scissors (Curved or Straight)',
    description: `Product Overview
Professional cuticle scissors for precise cuticle trimming.

Specifications
Cuticle Scissors (Curved): Stainless steel, curved blade, ergonomic design
Cuticle Scissors (Straight): Stainless steel, ergonomic handle

How to Use
Trim excess cuticle and dead skin around nails carefully. Trim cuticles and dead skin with control.

Benefits
Precise trimming
Durable and easy to clean
Professional manicure tool
Easy to sanitize and durable
Accurate trimming
Salon-grade tool

CTA
Achieve perfect cuticles with cuticle scissors.`
  },
  {
    name: 'Cuticle Cutter',
    description: `Product Overview
Professional cuticle cutter for efficient cuticle removal.

Specifications
Stainless steel, ergonomic
Sharp precision blade

How to Use
Trim excess cuticle carefully for a clean nail bed.

Benefits
Reduces nail damage
Durable and hygienic
Professional salon standard

CTA
Achieve clean cuticles with a cuticle cutter.`
  },
  {
    name: 'Ingrown Nail Cutter',
    description: `Product Overview
Specialized ingrown nail cutter for safe and effective nail edge trimming.

Specifications
Stainless steel, precise tip
Ergonomic design

How to Use
Trim ingrown nail edges carefully to prevent discomfort.

Benefits
Reduces nail pain
Professional and safe
Easy to sterilize

CTA
Prevent ingrown nails professionally with this cutter.`
  },
  {
    name: 'Toe-nail Cutter (Standard & Heavy)',
    description: `Product Overview
Professional toe-nail cutters for pedicure services.

Specifications
Toe-Nail Cutter: Stainless steel, sharp blade, ergonomic design
Toe-Nail Cutter (Heavy): Stainless steel, robust design, comfortable grip

How to Use
Trim toenails safely and efficiently. Trim thick toenails safely without splitting.

Benefits
Accurate cutting
Durable and hygienic
Professional-grade strength
Durable and precise
Ideal for salon pedicures
Suitable for tough nails

CTA
Achieve perfectly trimmed toenails with toe-nail cutters.`
  },
  {
    name: 'Professional Barber Scissors',
    description: `Product Overview
Premium barber scissors with leather case for professionals.

Specifications
Stainless steel
Includes leather protective kit
Sharp, ergonomic blades

How to Use
Use for precision hair cutting and styling in salon or barber settings.

Benefits
Sharp and precise
Durable and hygienic
Protective leather case for safe storage

CTA
Upgrade your professional haircut tools with barber scissors and kit.`
  }
]

async function updateImplementsDescriptions() {
  try {
    await connectDB()
    console.log('✅ Connected to database\n')
    console.log(`📝 Updating ${implementProducts.length} implement products:\n`)
    console.log('─'.repeat(80))

    let updated = 0
    let notFound = 0

    for (const productData of implementProducts) {
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

updateImplementsDescriptions()




