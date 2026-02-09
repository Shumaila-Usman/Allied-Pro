import { saveCategories, saveProducts } from '../lib/products'
import type { Category, Product } from '../lib/products'

// Initialize categories with subcategories
const categories: Category[] = [
  {
    id: 'skincare',
    name: 'SKINCARE',
    slug: 'skincare',
    subcategories: [
      {
        id: 'skincare-by-category',
        name: 'By Category',
        slug: 'by-category',
        parentId: 'skincare',
        secondSubcategories: [
          { id: 'face-masks', name: 'Face Masks', slug: 'face-masks', parentId: 'skincare-by-category' },
          { id: 'eye-care', name: 'Eye Care', slug: 'eye-care', parentId: 'skincare-by-category' },
          { id: 'tools-accessories', name: 'Tools & Accessories', slug: 'tools-accessories', parentId: 'skincare-by-category' },
          { id: 'massage-contouring', name: 'Massage & Contouring', slug: 'massage-contouring', parentId: 'skincare-by-category' },
        ],
      },
      {
        id: 'skincare-by-concern',
        name: 'By Concern',
        slug: 'by-concern',
        parentId: 'skincare',
        secondSubcategories: [
          { id: 'redness', name: 'Redness', slug: 'redness', parentId: 'skincare-by-concern' },
          { id: 'anti-aging-firming', name: 'Anti-Aging / Firming', slug: 'anti-aging-firming', parentId: 'skincare-by-concern' },
          { id: 'dryness', name: 'Dryness', slug: 'dryness', parentId: 'skincare-by-concern' },
        ],
      },
      {
        id: 'skincare-by-skin-type',
        name: 'By Skin Type',
        slug: 'by-skin-type',
        parentId: 'skincare',
        secondSubcategories: [
          { id: 'normal-all-skin-types', name: 'Normal / All Skin Types', slug: 'normal-all-skin-types', parentId: 'skincare-by-skin-type' },
        ],
      },
    ],
  },
  {
    id: 'spa-products',
    name: 'SPA PRODUCTS',
    slug: 'spa-products',
    subcategories: [
      {
        id: 'treatment-products',
        name: 'Treatment Products (Waxing & Paraffin)',
        slug: 'treatment-products',
        parentId: 'spa-products',
      },
      {
        id: 'body-wraps-spa-creams',
        name: 'Body Wraps & Spa Creams',
        slug: 'body-wraps-spa-creams',
        parentId: 'spa-products',
      },
      {
        id: 'hot-stones',
        name: 'Hot Stones',
        slug: 'hot-stones',
        parentId: 'spa-products',
      },
      {
        id: 'spa-accessories',
        name: 'Spa Accessories',
        slug: 'spa-accessories',
        parentId: 'spa-products',
        secondSubcategories: [
          { id: 'towels-robes-linens', name: 'Towels, Robes & Linens', slug: 'towels-robes-linens', parentId: 'spa-accessories' },
          { id: 'slippers-disposables', name: 'Slippers & Disposables', slug: 'slippers-disposables', parentId: 'spa-accessories' },
          { id: 'small-tools-disposable-sundries', name: 'Small Tools & Disposable Sundries', slug: 'small-tools-disposable-sundries', parentId: 'spa-accessories' },
        ],
      },
      {
        id: 'warmers-hot-towel-cabinets',
        name: 'Warmers & Hot Towel Cabinets',
        slug: 'warmers-hot-towel-cabinets',
        parentId: 'spa-products',
      },
    ],
  },
  {
    id: 'nail-products',
    name: 'NAIL PRODUCTS',
    slug: 'nail-products',
    subcategories: [
      {
        id: 'nail-care',
        name: 'Nail Care (Cuticle & Treatments)',
        slug: 'nail-care',
        parentId: 'nail-products',
      },
      {
        id: 'nail-files-buffers',
        name: 'Nail Files & Buffers',
        slug: 'nail-files-buffers',
        parentId: 'nail-products',
      },
      {
        id: 'nail-art',
        name: 'Nail Art',
        slug: 'nail-art',
        parentId: 'nail-products',
      },
      {
        id: 'tools-equipment',
        name: 'Tools & Equipment',
        slug: 'tools-equipment',
        parentId: 'nail-products',
        secondSubcategories: [
          { id: 'pedicure-tools', name: 'Pedicure Tools (Exfoliation & Care)', slug: 'pedicure-tools', parentId: 'tools-equipment' },
        ],
      },
      {
        id: 'stations-storage',
        name: 'Stations & Storage',
        slug: 'stations-storage',
        parentId: 'nail-products',
      },
      {
        id: 'manicure-pedicure-accessories',
        name: 'Manicure & Pedicure Accessories',
        slug: 'manicure-pedicure-accessories',
        parentId: 'nail-products',
      },
      {
        id: 'consumables-disposables',
        name: 'Consumables & Disposables',
        slug: 'consumables-disposables',
        parentId: 'nail-products',
      },
    ],
  },
  {
    id: 'equipment',
    name: 'EQUIPMENT',
    slug: 'equipment',
    subcategories: [
      {
        id: 'facial-equipment',
        name: 'Facial Equipment',
        slug: 'facial-equipment',
        parentId: 'equipment',
      },
      {
        id: 'styling-equipment',
        name: 'Styling Equipment',
        slug: 'styling-equipment',
        parentId: 'equipment',
      },
      {
        id: 'salon-equipment',
        name: 'Salon Equipment (Trolleys & Carts)',
        slug: 'salon-equipment',
        parentId: 'equipment',
      },
      {
        id: 'equipment-accessories',
        name: 'Equipment Accessories (Stands & Bulbs)',
        slug: 'equipment-accessories',
        parentId: 'equipment',
      },
    ],
  },
  {
    id: 'implements',
    name: 'IMPLEMENTS',
    slug: 'implements',
    subcategories: [
      {
        id: 'hair-tools',
        name: 'Hair Tools',
        slug: 'hair-tools',
        parentId: 'implements',
      },
      {
        id: 'scissors-shears',
        name: 'Scissors & Shears (Nail & Cuticle)',
        slug: 'scissors-shears',
        parentId: 'implements',
      },
      {
        id: 'skin-tools',
        name: 'Skin Tools (Tweezers & Extraction)',
        slug: 'skin-tools',
        parentId: 'implements',
      },
      {
        id: 'nail-pushers-implements',
        name: 'Nail Pushers & Implements',
        slug: 'nail-pushers-implements',
        parentId: 'implements',
      },
      {
        id: 'sterilization-safety',
        name: 'Sterilization & Safety',
        slug: 'sterilization-safety',
        parentId: 'implements',
      },
      {
        id: 'disposables',
        name: 'Disposables',
        slug: 'disposables',
        parentId: 'implements',
        secondSubcategories: [
          { id: 'bowls', name: 'Bowls', slug: 'bowls', parentId: 'disposables' },
          { id: 'medical-treatment-disposables', name: 'Medical & Treatment Disposables', slug: 'medical-treatment-disposables', parentId: 'disposables' },
        ],
      },
    ],
  },
  {
    id: 'furniture',
    name: 'FURNITURE',
    slug: 'furniture',
    subcategories: [
      {
        id: 'facial-bed-multipurpose',
        name: 'Facial Bed Multipurpose',
        slug: 'facial-bed-multipurpose',
        parentId: 'furniture',
      },
      {
        id: 'facial-massage-bed',
        name: 'Facial Massage Bed',
        slug: 'facial-massage-bed',
        parentId: 'furniture',
      },
      {
        id: 'portable-massage-bed',
        name: 'Portable Massage Bed',
        slug: 'portable-massage-bed',
        parentId: 'furniture',
      },
      {
        id: 'wooden-trolley',
        name: 'Wooden Trolley with 2 Draws',
        slug: 'wooden-trolley',
        parentId: 'furniture',
      },
      {
        id: 'spa-salon-metal-trolley',
        name: 'SPA SALON METAL TROLLEY',
        slug: 'spa-salon-metal-trolley',
        parentId: 'furniture',
      },
      {
        id: 'facial-beauty-spa-salon-glass-trolly',
        name: 'FACIAL BEAUTY SPA, SALON GLASS TROLLY WITH 4 SHELVES',
        slug: 'facial-beauty-spa-salon-glass-trolly',
        parentId: 'furniture',
      },
      {
        id: 'salon-spa-color-rolling-tray',
        name: 'Salon Spa Color rolling Tray with accessories holder Cart',
        slug: 'salon-spa-color-rolling-tray',
        parentId: 'furniture',
      },
      {
        id: 'multi-use-spa-salon-trolly',
        name: 'MULTI USE SPA, SALON TROLY',
        slug: 'multi-use-spa-salon-trolly',
        parentId: 'furniture',
      },
      {
        id: 'seller-salon-trolly',
        name: '#1 SELLER SALON TROLLY WITH DRAWS & ACCESSORIES HOLDER',
        slug: 'seller-salon-trolly',
        parentId: 'furniture',
      },
      {
        id: 'portable-manicure-table',
        name: 'Portable Manicure Table Folable Legs',
        slug: 'portable-manicure-table',
        parentId: 'furniture',
      },
      {
        id: 'spa-salon-adjustable-stool',
        name: 'SPA - SALON ADJUSTABLE STOOL',
        slug: 'spa-salon-adjustable-stool',
        parentId: 'furniture',
      },
      {
        id: 'pedicure-foot-rest',
        name: 'Pedicure Foot Rest',
        slug: 'pedicure-foot-rest',
        parentId: 'furniture',
      },
    ],
  },
]

// Generate products from the screenshots
const products: Product[] = []

// Helper function to create product
function createProduct(
  name: string,
  description: string,
  price: number,
  categoryId: string,
  subcategoryId?: string,
  secondSubcategoryId?: string,
  stock: number = 100
): Product {
  return {
    id: `prod-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name,
    description,
    price,
    cost: price * 0.7, // 30% margin for dealers
    images: [`/products/${name.toLowerCase().replace(/\s+/g, '-')}-1.jpg`],
    categoryId,
    subcategoryId,
    secondSubcategoryId,
    stock,
    sku: `SKU-${name.substring(0, 3).toUpperCase()}-${Math.floor(Math.random() * 10000)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

// SKINCARE PRODUCTS
// By Category - Face Masks
products.push(createProduct(
  'Hyaluronic Acid Gel Mask (30ml/500ml)',
  'Promotes healthier and supple skin.',
  25.99,
  'skincare',
  'skincare-by-category',
  'face-masks'
))

products.push(createProduct(
  'Golden Firming Gel Mask (30ml/500ml)',
  'Improves skin tone and adds radiance.',
  28.99,
  'skincare',
  'skincare-by-category',
  'face-masks'
))

products.push(createProduct(
  'Compressed Dry Sheet Masks',
  'Individually packed; great for travel.',
  12.99,
  'skincare',
  'skincare-by-category',
  'face-masks'
))

products.push(createProduct(
  'Nonwoven Dry Sheet Mask',
  'Available in white or black for multi-use.',
  8.99,
  'skincare',
  'skincare-by-category',
  'face-masks'
))

// By Category - Eye Care
products.push(createProduct(
  'Nonwoven Dry Under Eye Pad',
  'For multi-use.',
  6.99,
  'skincare',
  'skincare-by-category',
  'eye-care'
))

products.push(createProduct(
  'Under-Eye Press / Disc (Electric Jade)',
  'Specifically for de-puffing the eye area.',
  19.99,
  'skincare',
  'skincare-by-category',
  'eye-care'
))

// By Category - Tools & Accessories
products.push(createProduct(
  'Cellulose Sponge',
  'Lightly exfoliates; suitable for all skin types.',
  4.99,
  'skincare',
  'skincare-by-category',
  'tools-accessories'
))

products.push(createProduct(
  'Facial Brush (Synthetic/Natural)',
  'Used for exfoliation.',
  9.99,
  'skincare',
  'skincare-by-category',
  'tools-accessories'
))

products.push(createProduct(
  'Ice Globes',
  'Calms skin and stimulates circulation.',
  24.99,
  'skincare',
  'skincare-by-category',
  'tools-accessories'
))

products.push(createProduct(
  'Disposable Headbands',
  'Professional/Treatment use.',
  3.99,
  'skincare',
  'skincare-by-category',
  'tools-accessories'
))

products.push(createProduct(
  'Mixing Bowl Set',
  'For mask preparation.',
  14.99,
  'skincare',
  'skincare-by-category',
  'tools-accessories'
))

// By Category - Massage & Contouring
products.push(createProduct(
  'Gua Sha Stone (Dolphin)',
  'For contouring jawlines and cheekbones.',
  18.99,
  'skincare',
  'skincare-by-category',
  'massage-contouring'
))

products.push(createProduct(
  'Gua Sha Stone (Concave)',
  'Multi-purpose (nose, fingers, toes).',
  16.99,
  'skincare',
  'skincare-by-category',
  'massage-contouring'
))

products.push(createProduct(
  'Gua Sha Stone (S Shaped)',
  'Multi-purpose (hands, feet, back, neck).',
  17.99,
  'skincare',
  'skincare-by-category',
  'massage-contouring'
))

products.push(createProduct(
  'Jade Roller (Green, Rose Quartz, White)',
  'Toning and lifting effect.',
  22.99,
  'skincare',
  'skincare-by-category',
  'massage-contouring'
))

products.push(createProduct(
  '2-in-1 Electric Jade Roller',
  'Vibrating roller for circulation with 2 attachment heads.',
  45.99,
  'skincare',
  'skincare-by-category',
  'massage-contouring'
))

products.push(createProduct(
  'T/U Electric Jade Roller',
  'For lymphatic drainage on forehead, cheeks, and jaw.',
  39.99,
  'skincare',
  'skincare-by-category',
  'massage-contouring'
))

// By Concern - Redness
products.push(createProduct(
  'Ice Globes (Redness)',
  'Specifically designed to eliminate redness and calm skin.',
  24.99,
  'skincare',
  'skincare-by-concern',
  'redness'
))

// By Concern - Anti-Aging / Firming
products.push(createProduct(
  'Golden Firming Gel Mask (Anti-Aging)',
  'Focuses on radiance and skin tone.',
  28.99,
  'skincare',
  'skincare-by-concern',
  'anti-aging-firming'
))

products.push(createProduct(
  'Jade Roller / Gua Sha (Anti-Aging)',
  'Assists with lifting, toning, and contouring.',
  22.99,
  'skincare',
  'skincare-by-concern',
  'anti-aging-firming'
))

// By Concern - Dryness
products.push(createProduct(
  'Hyaluronic Acid Gel Mask (Dryness)',
  'Focuses on suppleness and hydration.',
  25.99,
  'skincare',
  'skincare-by-concern',
  'dryness'
))

// By Skin Type - Normal / All Skin Types
products.push(createProduct(
  'Cellulose Sponge (All Skin Types)',
  'Explicitly listed as able to use with any skin type.',
  4.99,
  'skincare',
  'skincare-by-skin-type',
  'normal-all-skin-types'
))

products.push(createProduct(
  'Compressed Dry Sheet Masks (Universal)',
  'Universal application.',
  12.99,
  'skincare',
  'skincare-by-skin-type',
  'normal-all-skin-types'
))

// SPA PRODUCTS
// Treatment Products (Waxing & Paraffin)
products.push(createProduct(
  'SilkRoma Depilatory Honey Wax',
  'Soft wax for coarse/curly hair.',
  18.99,
  'spa-products',
  'treatment-products'
))

products.push(createProduct(
  'SilkRoma Depilatory Cream Wax',
  'Low heat; best for sensitive skin.',
  19.99,
  'spa-products',
  'treatment-products'
))

products.push(createProduct(
  'SilkRoma Depilatory Zinc Wax',
  'Soothing; for fine to medium hair.',
  17.99,
  'spa-products',
  'treatment-products'
))

products.push(createProduct(
  'Roma Azulene Wax',
  'Reduces redness and inflammation.',
  20.99,
  'spa-products',
  'treatment-products'
))

products.push(createProduct(
  'Roll-on Wax (Pink, Honey, Azulene, Banana)',
  'Water-soluble.',
  15.99,
  'spa-products',
  'treatment-products'
))

products.push(createProduct(
  'Epilating Cotton Roll',
  'Premium quality fabric (Hard, Soft, Medium).',
  8.99,
  'spa-products',
  'treatment-products'
))

products.push(createProduct(
  'Pre-Cut Waxing Strips',
  'High-quality nonwoven material.',
  6.99,
  'spa-products',
  'treatment-products'
))

products.push(createProduct(
  'Paraffin Hand & Foot Liners',
  'Plastic disposable liners.',
  4.99,
  'spa-products',
  'treatment-products'
))

products.push(createProduct(
  'Terry Booties or Mitts',
  'Insulated for paraffin wax therapy.',
  12.99,
  'spa-products',
  'treatment-products'
))

products.push(createProduct(
  'Paraffin Brush',
  'Reusable; for block or pellet paraffin.',
  9.99,
  'spa-products',
  'treatment-products'
))

// Body Wraps & Spa Creams
products.push(createProduct(
  'Body Shrink Roll',
  'Used for body treatments.',
  14.99,
  'spa-products',
  'body-wraps-spa-creams'
))

products.push(createProduct(
  'Thermal Foil Sheet Blanket',
  'Heat reflective for treatments.',
  19.99,
  'spa-products',
  'body-wraps-spa-creams'
))

products.push(createProduct(
  'Body Brush (Large/Small)',
  'For dry brushing and exfoliating.',
  11.99,
  'spa-products',
  'body-wraps-spa-creams'
))

products.push(createProduct(
  'Exfoliating Gloves',
  'Excellent for skin exfoliation.',
  7.99,
  'spa-products',
  'body-wraps-spa-creams'
))

// Hot Stones
products.push(createProduct(
  'Hot Stones',
  'Basalt stones, smooth and flat.',
  29.99,
  'spa-products',
  'hot-stones'
))

// Spa Accessories - Towels, Robes & Linens
products.push(createProduct(
  'Towels (Various Sizes)',
  'Various sizes, high quality.',
  12.99,
  'spa-products',
  'spa-accessories',
  'towels-robes-linens'
))

products.push(createProduct(
  'Pedicure Disposable Towels',
  'High quality and disposable.',
  5.99,
  'spa-products',
  'spa-accessories',
  'towels-robes-linens'
))

products.push(createProduct(
  'Terry Gown Wrap',
  'Absorbent with Velcro strap.',
  24.99,
  'spa-products',
  'spa-accessories',
  'towels-robes-linens'
))

products.push(createProduct(
  'Terry Headbands',
  'Soft and thick with Velcro.',
  6.99,
  'spa-products',
  'spa-accessories',
  'towels-robes-linens'
))

products.push(createProduct(
  'Cotton Flat Sheets',
  'Breathable fabric.',
  18.99,
  'spa-products',
  'spa-accessories',
  'towels-robes-linens'
))

products.push(createProduct(
  'Terry Fitted Bed Sheet',
  'Available with or without face hole.',
  22.99,
  'spa-products',
  'spa-accessories',
  'towels-robes-linens'
))

products.push(createProduct(
  'Jersey Fitted Bed Sheet',
  'Light and comfortable.',
  19.99,
  'spa-products',
  'spa-accessories',
  'towels-robes-linens'
))

products.push(createProduct(
  'Soft Cotton Thermal Weave Blanket',
  'Denser, hypoallergenic feel.',
  34.99,
  'spa-products',
  'spa-accessories',
  'towels-robes-linens'
))

products.push(createProduct(
  'Waffle Blanket',
  'Great for client use.',
  28.99,
  'spa-products',
  'spa-accessories',
  'towels-robes-linens'
))

// Spa Accessories - Slippers & Disposables
products.push(createProduct(
  'Disposable Bouffant Cap / Shower Cap',
  'For product protection.',
  2.99,
  'spa-products',
  'spa-accessories',
  'slippers-disposables'
))

products.push(createProduct(
  'G-String Panties / Nonwoven Shorts',
  'Skin-friendly and hygienic.',
  3.99,
  'spa-products',
  'spa-accessories',
  'slippers-disposables'
))

products.push(createProduct(
  'Nonwoven Disposable Gown, Bra, or Underwear',
  'Soft and hygienic.',
  4.99,
  'spa-products',
  'spa-accessories',
  'slippers-disposables'
))

products.push(createProduct(
  'Nonwoven Body Sheet Roll / Pre-cut Sheets',
  'For salon/spa beds.',
  7.99,
  'spa-products',
  'spa-accessories',
  'slippers-disposables'
))

products.push(createProduct(
  'Washable Cotton Fitted Face Cover',
  'For massage tables.',
  8.99,
  'spa-products',
  'spa-accessories',
  'slippers-disposables'
))

// Spa Accessories - Small Tools & Disposable Sundries
products.push(createProduct(
  'Spatulas (Plastic, Small Angled, Wooden, Stainless Steel)',
  'Various types for different uses.',
  5.99,
  'spa-products',
  'spa-accessories',
  'small-tools-disposable-sundries'
))

products.push(createProduct(
  'Brushes (Fan Brush, White/Clear Mask Brushes)',
  'For mask application.',
  8.99,
  'spa-products',
  'spa-accessories',
  'small-tools-disposable-sundries'
))

products.push(createProduct(
  'Glass Dappen Dish',
  'For mixing substances.',
  6.99,
  'spa-products',
  'spa-accessories',
  'small-tools-disposable-sundries'
))

products.push(createProduct(
  'Mixing Palette',
  'For blending colors.',
  7.99,
  'spa-products',
  'spa-accessories',
  'small-tools-disposable-sundries'
))

products.push(createProduct(
  'Cosmetic Applicators (Mascara wands, Brow wands, Eyeshadow wands, Lip brushes)',
  'Various applicators for different uses.',
  4.99,
  'spa-products',
  'spa-accessories',
  'small-tools-disposable-sundries'
))

products.push(createProduct(
  'Cotton Swabs',
  'Essential for treatments.',
  3.99,
  'spa-products',
  'spa-accessories',
  'small-tools-disposable-sundries'
))

products.push(createProduct(
  'Gauze (Various Sizes)',
  'For various treatments.',
  5.99,
  'spa-products',
  'spa-accessories',
  'small-tools-disposable-sundries'
))

products.push(createProduct(
  'Cosmetic Wedges',
  'For makeup and treatments.',
  4.99,
  'spa-products',
  'spa-accessories',
  'small-tools-disposable-sundries'
))

products.push(createProduct(
  'Examination Paper (Crepe/Smooth)',
  'For treatments.',
  6.99,
  'spa-products',
  'spa-accessories',
  'small-tools-disposable-sundries'
))

products.push(createProduct(
  'Neck Paper Roll',
  'For treatments.',
  5.99,
  'spa-products',
  'spa-accessories',
  'small-tools-disposable-sundries'
))

// Warmers & Hot Towel Cabinets
products.push(createProduct(
  'Double or Single Metal Wax Heater',
  'Quick heating with lid/pot.',
  89.99,
  'spa-products',
  'warmers-hot-towel-cabinets'
))

products.push(createProduct(
  'Paraffin Heater',
  'Designed for melting paraffin wax.',
  79.99,
  'spa-products',
  'warmers-hot-towel-cabinets'
))

products.push(createProduct(
  'Hot Stone Heater (18q / 6q)',
  'Large or small with adjustable temperature.',
  129.99,
  'spa-products',
  'warmers-hot-towel-cabinets'
))

products.push(createProduct(
  'Square/Round Warmer Coolers',
  'Heavy paper collars to prevent wax spills.',
  24.99,
  'spa-products',
  'warmers-hot-towel-cabinets'
))

// NAIL PRODUCTS
// Nail Care (Cuticle & Treatments)
products.push(createProduct(
  'Argan Oil Hand Mask',
  '1 pair of gloves for moisturizing.',
  12.99,
  'nail-products',
  'nail-care'
))

products.push(createProduct(
  'Honey & Almond Hand Mask',
  '1 pair of gloves for moisturizing.',
  12.99,
  'nail-products',
  'nail-care'
))

products.push(createProduct(
  'Teatree Exfoliating Foot Mask',
  'Anti-inflammatory and antibacterial booties.',
  14.99,
  'nail-products',
  'nail-care'
))

products.push(createProduct(
  'Lavender Exfoliating Foot Mask',
  'Moisturizing booties.',
  14.99,
  'nail-products',
  'nail-care'
))

products.push(createProduct(
  'Argan Oil Moisturizing Foot Mask',
  'Moisturizing treatment.',
  13.99,
  'nail-products',
  'nail-care'
))

products.push(createProduct(
  'Hindu Stone',
  'Specifically for cuticle care.',
  6.99,
  'nail-products',
  'nail-care'
))

products.push(createProduct(
  'Wooden Manicure Stick',
  'Disposable, various sizes.',
  3.99,
  'nail-products',
  'nail-care'
))

// Nail Files & Buffers
products.push(createProduct(
  'Nail Files (Various Kinds and Grits)',
  'Various kinds and grits.',
  4.99,
  'nail-products',
  'nail-files-buffers'
))

products.push(createProduct(
  'Zebra Files (Straight or Curve)',
  'Available in different grits.',
  5.99,
  'nail-products',
  'nail-files-buffers'
))

products.push(createProduct(
  'Nail Buffers (Blue, Orange, or Purple)',
  'Various color options.',
  4.99,
  'nail-products',
  'nail-files-buffers'
))

products.push(createProduct(
  '4-Way Nail Buffer',
  'Multi-sided for various finishes.',
  6.99,
  'nail-products',
  'nail-files-buffers'
))

products.push(createProduct(
  'Glass Nail File (Large or Small)',
  'High-quality glass in various colors.',
  8.99,
  'nail-products',
  'nail-files-buffers'
))

products.push(createProduct(
  'Mini Buffers (Pink or White)',
  'Various packaging options.',
  3.99,
  'nail-products',
  'nail-files-buffers'
))

// Nail Art
products.push(createProduct(
  'Nail Art Tool',
  'Double-sided dotting tool.',
  5.99,
  'nail-products',
  'nail-art'
))

products.push(createProduct(
  'Nail Art Tip Display (18 or 64-tip)',
  'Available in 18 or 64-tip versions.',
  12.99,
  'nail-products',
  'nail-art'
))

products.push(createProduct(
  'Nail-Tip Wheel',
  'Various sizes and colors for displaying designs.',
  9.99,
  'nail-products',
  'nail-art'
))

// Tools & Equipment - Pedicure Tools
products.push(createProduct(
  '2-Sided Callus Remover Foot File',
  'Fine and coarse sand finishes.',
  8.99,
  'nail-products',
  'tools-equipment',
  'pedicure-tools'
))

products.push(createProduct(
  'SilkB Micro-plane Colossal Foot File',
  'Professional grade for callused skin.',
  12.99,
  'nail-products',
  'tools-equipment',
  'pedicure-tools'
))

products.push(createProduct(
  'Stainless Steel Pedicure Foot File',
  'Professional quality; easy to sanitize.',
  14.99,
  'nail-products',
  'tools-equipment',
  'pedicure-tools'
))

products.push(createProduct(
  'Pumice Stone',
  'Abrasive stone for exfoliating heels.',
  5.99,
  'nail-products',
  'tools-equipment',
  'pedicure-tools'
))

products.push(createProduct(
  'Pumice Stone with Brush',
  'Dual-action smoothing and cleaning.',
  7.99,
  'nail-products',
  'tools-equipment',
  'pedicure-tools'
))

products.push(createProduct(
  'Pedicure File Stickers',
  'Replacement grits for files.',
  4.99,
  'nail-products',
  'tools-equipment',
  'pedicure-tools'
))

products.push(createProduct(
  '2-Sided Pedicure File',
  'Standard manual file.',
  6.99,
  'nail-products',
  'tools-equipment',
  'pedicure-tools'
))

// Stations & Storage
products.push(createProduct(
  'Nail Polish Table or Wall Rack',
  'High-quality storage for bottles.',
  34.99,
  'nail-products',
  'stations-storage'
))

products.push(createProduct(
  'Nail Bit Holder (48 holes)',
  'Storage for drill bits.',
  18.99,
  'nail-products',
  'stations-storage'
))

products.push(createProduct(
  'Empty Storage Container',
  'Multi-use high-quality storage.',
  12.99,
  'nail-products',
  'stations-storage'
))

products.push(createProduct(
  'Manicure Hand Rest',
  'Portable support for manicures.',
  14.99,
  'nail-products',
  'stations-storage'
))

products.push(createProduct(
  'Practise Hand',
  'High-quality tool for training.',
  89.99,
  'nail-products',
  'stations-storage'
))

products.push(createProduct(
  'Nail-Tip Box (Numbered)',
  'Organized storage for tips.',
  8.99,
  'nail-products',
  'stations-storage'
))

// Manicure & Pedicure Accessories
products.push(createProduct(
  'Manicure Bowls (5-finger well molded, Classic, or with Lid)',
  'Various styles available.',
  9.99,
  'nail-products',
  'manicure-pedicure-accessories'
))

products.push(createProduct(
  'Stainless Steel Pedicure Bowl',
  'Professional and easy to clean.',
  24.99,
  'nail-products',
  'manicure-pedicure-accessories'
))

products.push(createProduct(
  'Pedicure Bowl Liners',
  'Disposable for hygiene.',
  4.99,
  'nail-products',
  'manicure-pedicure-accessories'
))

products.push(createProduct(
  'Nail Brushes (Handle or Long Handle)',
  'For cleaning residue.',
  5.99,
  'nail-products',
  'manicure-pedicure-accessories'
))

products.push(createProduct(
  'Toe Separators',
  'Lightweight and firm.',
  3.99,
  'nail-products',
  'manicure-pedicure-accessories'
))

products.push(createProduct(
  'Nail Cap Clips',
  'Used for soaking off gel polish.',
  4.99,
  'nail-products',
  'manicure-pedicure-accessories'
))

products.push(createProduct(
  'Pump Bottles (2oz, 4oz, 8oz)',
  'For dispensing liquids like acetone or alcohol.',
  6.99,
  'nail-products',
  'manicure-pedicure-accessories'
))

products.push(createProduct(
  'Nail Forms',
  'Available in two styles for extension.',
  7.99,
  'nail-products',
  'manicure-pedicure-accessories'
))

// Consumables & Disposables
products.push(createProduct(
  'Nail Wipes (High-Quality or Ultra-Fine)',
  'Lint-free for prep and cleaning.',
  5.99,
  'nail-products',
  'consumables-disposables'
))

products.push(createProduct(
  'Ultra-Fine Makeup Wipes',
  'Dry wipes that foam when wet.',
  6.99,
  'nail-products',
  'consumables-disposables'
))

products.push(createProduct(
  'Makeup Cotton / Cotton Pads',
  'For touch-ups and product removal.',
  4.99,
  'nail-products',
  'consumables-disposables'
))

products.push(createProduct(
  'Pedicure Slippers (Foam, Paper, & Terry)',
  'Various types and colors.',
  3.99,
  'nail-products',
  'consumables-disposables'
))

// EQUIPMENT
// Facial Equipment
products.push(createProduct(
  'Ionic Facial Steamer',
  'Features ozone function with adjustable height.',
  199.99,
  'equipment',
  'facial-equipment'
))

products.push(createProduct(
  'Portable Facial Steamer',
  'Table-top design for face treatments.',
  149.99,
  'equipment',
  'facial-equipment'
))

products.push(createProduct(
  'Magnifying Lamp (3d or 5d)',
  'Tabletop clamp with modifiable spring arm.',
  89.99,
  'equipment',
  'facial-equipment'
))

products.push(createProduct(
  'Magnifying Lamp (3d or 5d) SMD',
  'High-efficiency lamp with SMD light.',
  99.99,
  'equipment',
  'facial-equipment'
))

products.push(createProduct(
  '2-in-1 Portable Steamer',
  'Table-top unit for both Hair and Face steaming.',
  179.99,
  'equipment',
  'facial-equipment'
))

// Styling Equipment
products.push(createProduct(
  '2-in-1 Portable Steamer (Styling)',
  'Dual-purpose Hair and Face steamer.',
  179.99,
  'equipment',
  'styling-equipment'
))

// Salon Equipment (Trolleys & Carts)
products.push(createProduct(
  'Professional Salon/Spa Trolley (HST 145)',
  'Aluminum instrument tray with adjustable top.',
  249.99,
  'equipment',
  'salon-equipment'
))

products.push(createProduct(
  'Economical Hair Salon Trolley',
  'Includes 5 removable trays and wheels.',
  189.99,
  'equipment',
  'salon-equipment'
))

products.push(createProduct(
  'Salon/Spa Rolling Tray Trolley',
  'Stainless steel stand with aluminum star base and built-in mechanical timer.',
  299.99,
  'equipment',
  'salon-equipment'
))

products.push(createProduct(
  'Metal and Glass Trolley',
  'Professional aesthetic, great for spa environments.',
  349.99,
  'equipment',
  'salon-equipment'
))

// Equipment Accessories (Stands & Bulbs)
products.push(createProduct(
  'Magnifying Lamp Stand (4WH)',
  'Sturdy 4-wheel floor stand.',
  79.99,
  'equipment',
  'equipment-accessories'
))

products.push(createProduct(
  'Magnifying Lamp Stand (5WH)',
  'Sturdy 5-wheel floor stand.',
  89.99,
  'equipment',
  'equipment-accessories'
))

products.push(createProduct(
  'Magnifying Lamp Stand (Round)',
  'Heavy-duty, sturdy lamp stand.',
  94.99,
  'equipment',
  'equipment-accessories'
))

products.push(createProduct(
  'Bulbs (T4, T5, T9, UV)',
  'Replacement bulbs for professional equipment.',
  12.99,
  'equipment',
  'equipment-accessories'
))

// IMPLEMENTS
// Hair Tools
products.push(createProduct(
  'Professional Barber Scissors',
  'Includes a leather kit.',
  49.99,
  'implements',
  'hair-tools'
))

products.push(createProduct(
  'Safety Scissors',
  'General-purpose professional use.',
  12.99,
  'implements',
  'hair-tools'
))

// Scissors & Shears (Nail & Cuticle)
products.push(createProduct(
  'Cuticle Scissors (Curved or Straight)',
  'For precision grooming.',
  14.99,
  'implements',
  'scissors-shears'
))

products.push(createProduct(
  'Cuticle Cutter',
  'For professional cuticle maintenance.',
  11.99,
  'implements',
  'scissors-shears'
))

products.push(createProduct(
  'Ingrown Nail Cutter',
  'Specifically designed for ingrown treatments.',
  16.99,
  'implements',
  'scissors-shears'
))

products.push(createProduct(
  'Toe-nail Cutter (Standard & Heavy)',
  'For thick or standard toenails.',
  9.99,
  'implements',
  'scissors-shears'
))

// Skin Tools (Tweezers & Extraction)
products.push(createProduct(
  'Tweezers (Full Range)',
  'Includes Flat Tip, Slant Tip, Slant/Point, Waxing, Short Point, and Extra Long Tip.',
  8.99,
  'implements',
  'skin-tools'
))

products.push(createProduct(
  'Ingrown Hair Tweezers',
  'Available in standard and Fine Hair versions.',
  12.99,
  'implements',
  'skin-tools'
))

products.push(createProduct(
  'Eyelash Tweezers',
  'For lash application/maintenance.',
  9.99,
  'implements',
  'skin-tools'
))

products.push(createProduct(
  'Ingrown Nail File',
  'For corrective nail treatments.',
  7.99,
  'implements',
  'skin-tools'
))

// Nail Pushers & Implements
products.push(createProduct(
  'Nail Pushers (Full Variety)',
  'Includes Flat/Arrow, Flat-Dual Ended, Pterygium/Round, and Round Tip.',
  6.99,
  'implements',
  'nail-pushers-implements'
))

// Sterilization & Safety
products.push(createProduct(
  'Instrument Picker',
  'For safe handling of tools.',
  4.99,
  'implements',
  'sterilization-safety'
))

products.push(createProduct(
  'Sterilization Boxes (IBA/IBF)',
  'Stainless steel with lids (Round or Flat bottom).',
  24.99,
  'implements',
  'sterilization-safety'
))

products.push(createProduct(
  'Sterilization Trays',
  'Available in Plastic or Stainless Steel (with or without covers).',
  18.99,
  'implements',
  'sterilization-safety'
))

products.push(createProduct(
  'Sterilization Jar',
  'Available in Small and Large.',
  14.99,
  'implements',
  'sterilization-safety'
))

products.push(createProduct(
  'Stainless Steel Scaler Tray',
  'For organizing hand instruments.',
  19.99,
  'implements',
  'sterilization-safety'
))

products.push(createProduct(
  'Sharps Container (Small & Large)',
  'For safe disposal of needles/blades.',
  12.99,
  'implements',
  'sterilization-safety'
))

// Disposables - Bowls
products.push(createProduct(
  'Stainless Steel Kidney Bowl',
  'Professional-grade 4x8" bowl.',
  16.99,
  'implements',
  'disposables',
  'bowls'
))

// Disposables - Medical & Treatment Disposables
products.push(createProduct(
  'Cotton Crepe Bandages',
  '9" width, 5m length.',
  8.99,
  'implements',
  'disposables',
  'medical-treatment-disposables'
))

products.push(createProduct(
  'Elastic Bandages',
  '9" width, 5m length.',
  9.99,
  'implements',
  'disposables',
  'medical-treatment-disposables'
))

// FURNITURE
products.push(createProduct(
  'FMB2 FACIAL MASSAGE BED',
  'Facial Massage Bed White / Black.',
  599.99,
  'furniture',
  'facial-bed-multipurpose'
))

products.push(createProduct(
  'FACIAL MASSAGE BED WHITE / BLACK',
  'Professional facial massage bed.',
  649.99,
  'furniture',
  'facial-massage-bed'
))

products.push(createProduct(
  'PMB Portable Massage Bed',
  'Portable massage bed for mobile services.',
  299.99,
  'furniture',
  'portable-massage-bed'
))

products.push(createProduct(
  'BT-02 Wooden Trolley with 2 Draws',
  'Wooden trolley with 2 drawers.',
  199.99,
  'furniture',
  'wooden-trolley'
))

products.push(createProduct(
  'BT-021 SPA SALON METAL TROLLEY',
  'Professional metal trolley for spa/salon.',
  249.99,
  'furniture',
  'spa-salon-metal-trolley'
))

products.push(createProduct(
  'BT-018 FACIAL BEAUTY SPA, SALON GLASS TROLLY WITH 4 SHELVES',
  'Glass trolley with 4 shelves.',
  349.99,
  'furniture',
  'facial-beauty-spa-salon-glass-trolly'
))

products.push(createProduct(
  'Salon Spa Color rolling Tray with accessories holder Cart',
  'Color rolling tray with accessories holder.',
  179.99,
  'furniture',
  'salon-spa-color-rolling-tray'
))

products.push(createProduct(
  'HST-11 MULTI USE SPA, SALON TROLY',
  'Multi-use spa/salon trolley.',
  229.99,
  'furniture',
  'multi-use-spa-salon-trolly'
))

products.push(createProduct(
  'HST-35 #1 SELLER SALON TROLLY WITH DRAWS & ACCESSORIES HOLDER',
  '#1 seller salon trolley with drawers and accessories holder.',
  279.99,
  'furniture',
  'seller-salon-trolly'
))

products.push(createProduct(
  'PMT Portable Manicure Table Folable Legs',
  'Portable manicure table with foldable legs.',
  199.99,
  'furniture',
  'portable-manicure-table'
))

products.push(createProduct(
  'BS-01 SPA - SALON ADJUSTABLE STOOL WHITE / BLACK',
  'Adjustable stool for spa/salon.',
  89.99,
  'furniture',
  'spa-salon-adjustable-stool'
))

products.push(createProduct(
  'BS-02 SPA - SALON ADJUSTABLE STOOL WHITE / BLACK',
  'Adjustable stool variant 2.',
  94.99,
  'furniture',
  'spa-salon-adjustable-stool'
))

products.push(createProduct(
  'MP-01 Pedicure Foot Rest',
  'Pedicure foot rest.',
  79.99,
  'furniture',
  'pedicure-foot-rest'
))

// Save categories and products
saveCategories(categories)
saveProducts(products)

console.log(`✅ Seeded ${categories.length} categories`)
console.log(`✅ Seeded ${products.length} products`)

