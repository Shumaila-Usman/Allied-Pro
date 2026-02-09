// Mapping between menu display names and database category/subcategory IDs

export const categoryMapping: Record<string, string> = {
  // Main categories
  'SKINCARE': 'skincare',
  'SPA PRODUCTS': 'spa-products',
  'NAIL PRODUCTS': 'nail-products',
  'EQUIPMENT': 'equipment',
  'IMPLEMENTS': 'implements',
  'FURNITURE': 'furniture',
}

// Subcategory mappings
export const subcategoryMapping: Record<string, { categoryId: string; subcategoryId: string }> = {
  // Skincare - By Category
  'Face Masks': { categoryId: 'skincare', subcategoryId: 'skincare-by-category' },
  'Eye Care': { categoryId: 'skincare', subcategoryId: 'skincare-by-category' },
  'Tools & Accessories': { categoryId: 'skincare', subcategoryId: 'skincare-by-category' },
  'Massage & Contouring': { categoryId: 'skincare', subcategoryId: 'skincare-by-category' },
  
  // Skincare - By Concern
  'Redness': { categoryId: 'skincare', subcategoryId: 'skincare-by-concern' },
  'Anti-Aging / Firming': { categoryId: 'skincare', subcategoryId: 'skincare-by-concern' },
  'Dryness': { categoryId: 'skincare', subcategoryId: 'skincare-by-concern' },
  
  // Skincare - By Skin Type
  'Normal / All Skin Types': { categoryId: 'skincare', subcategoryId: 'skincare-by-skin-type' },
  
  // Spa Products
  'Treatment Products (Waxing & Paraffin)': { categoryId: 'spa-products', subcategoryId: 'treatment-products' },
  'Body Wraps & Spa Creams': { categoryId: 'spa-products', subcategoryId: 'body-wraps-spa-creams' },
  'Hot Stones': { categoryId: 'spa-products', subcategoryId: 'hot-stones' },
  'Spa Accessories': { categoryId: 'spa-products', subcategoryId: 'spa-accessories' },
  'Towels, Robes & Linens': { categoryId: 'spa-products', subcategoryId: 'spa-accessories' },
  'Slippers & Disposables': { categoryId: 'spa-products', subcategoryId: 'spa-accessories' },
  'Small Tools & Disposable Sundries': { categoryId: 'spa-products', subcategoryId: 'spa-accessories' },
  'Warmers & Hot Towel Cabinets': { categoryId: 'spa-products', subcategoryId: 'warmers-hot-towel-cabinets' },
  
  // Nail Products
  'Nail Care (Cuticle & Treatments)': { categoryId: 'nail-products', subcategoryId: 'nail-care' },
  'Nail Files & Buffers': { categoryId: 'nail-products', subcategoryId: 'nail-files-buffers' },
  'Nail Art': { categoryId: 'nail-products', subcategoryId: 'nail-art' },
  'Tools & Equipment': { categoryId: 'nail-products', subcategoryId: 'tools-equipment' },
  'Consumables & Disposables': { categoryId: 'nail-products', subcategoryId: 'consumables-disposables' },
  
  // Equipment
  'Facial Equipment': { categoryId: 'equipment', subcategoryId: 'facial-equipment' },
  'Styling Equipment': { categoryId: 'equipment', subcategoryId: 'styling-equipment' },
  'Salon Equipment (Trolleys & Carts)': { categoryId: 'equipment', subcategoryId: 'salon-equipment' },
  'Equipment Accessories (Stands & Bulbs)': { categoryId: 'equipment', subcategoryId: 'equipment-accessories' },
  
  // Implements
  'Hair Tools': { categoryId: 'implements', subcategoryId: 'hair-tools' },
  'Scissors & Shears': { categoryId: 'implements', subcategoryId: 'scissors-shears' },
  'Skin Tools (Tweezers & Extraction)': { categoryId: 'implements', subcategoryId: 'skin-tools' },
  'Nail Pushers & Implements': { categoryId: 'implements', subcategoryId: 'nail-pushers-implements' },
  'Sterilization & Safety': { categoryId: 'implements', subcategoryId: 'sterilization-safety' },
  'Disposables': { categoryId: 'implements', subcategoryId: 'disposables' },
  'Bowls': { categoryId: 'implements', subcategoryId: 'disposables' },
  'Medical & Treatment Disposables': { categoryId: 'implements', subcategoryId: 'disposables' },
  
  // Furniture
  'Facial Bed Multipurpose': { categoryId: 'furniture', subcategoryId: 'facial-bed-multipurpose' },
  'Facial Massage Bed (White / Black)': { categoryId: 'furniture', subcategoryId: 'facial-massage-bed' },
  'Salon Spa Rolling Tray with Accessories Holder': { categoryId: 'furniture', subcategoryId: 'salon-spa-color-rolling-tray' },
  'Portable Massage Bed': { categoryId: 'furniture', subcategoryId: 'portable-massage-bed' },
  'Wooden Trolley with 2 Draws': { categoryId: 'furniture', subcategoryId: 'wooden-trolley' },
  'SPA SALON METAL TROLLEY': { categoryId: 'furniture', subcategoryId: 'spa-salon-metal-trolley' },
  'FACIAL BEAUTY SPA, SALON GLASS TROLLY WITH 4 SHELVES': { categoryId: 'furniture', subcategoryId: 'facial-beauty-spa-salon-glass-trolly' },
  'MULTI USE SPA, SALON TROLY': { categoryId: 'furniture', subcategoryId: 'multi-use-spa-salon-trolly' },
  '#1 SELLER SALON TROLLY WITH DRAWS & ACCESSORIES HOLDER': { categoryId: 'furniture', subcategoryId: 'seller-salon-trolly' },
  'Portable Manicure Table Folable Legs': { categoryId: 'furniture', subcategoryId: 'portable-manicure-table' },
  'SPA - SALON ADJUSTABLE STOOL': { categoryId: 'furniture', subcategoryId: 'spa-salon-adjustable-stool' },
  'Pedicure Foot Rest': { categoryId: 'furniture', subcategoryId: 'pedicure-foot-rest' },
}

// Second subcategory mappings (for items that have second level)
export const secondSubcategoryMapping: Record<string, { categoryId: string; subcategoryId: string; secondSubcategoryId: string }> = {
  // Skincare - By Category
  'Face Masks': { categoryId: 'skincare', subcategoryId: 'skincare-by-category', secondSubcategoryId: 'face-masks' },
  'Eye Care': { categoryId: 'skincare', subcategoryId: 'skincare-by-category', secondSubcategoryId: 'eye-care' },
  'Tools & Accessories': { categoryId: 'skincare', subcategoryId: 'skincare-by-category', secondSubcategoryId: 'tools-accessories' },
  'Massage & Contouring': { categoryId: 'skincare', subcategoryId: 'skincare-by-category', secondSubcategoryId: 'massage-contouring' },
  
  // Skincare - By Concern
  'Redness': { categoryId: 'skincare', subcategoryId: 'skincare-by-concern', secondSubcategoryId: 'redness' },
  'Anti-Aging / Firming': { categoryId: 'skincare', subcategoryId: 'skincare-by-concern', secondSubcategoryId: 'anti-aging-firming' },
  'Dryness': { categoryId: 'skincare', subcategoryId: 'skincare-by-concern', secondSubcategoryId: 'dryness' },
  
  // Skincare - By Skin Type
  'Normal / All Skin Types': { categoryId: 'skincare', subcategoryId: 'skincare-by-skin-type', secondSubcategoryId: 'normal-all-skin-types' },
  
  // Spa Accessories - Second level
  'Towels, Robes & Linens': { categoryId: 'spa-products', subcategoryId: 'spa-accessories', secondSubcategoryId: 'towels-robes-linens' },
  'Slippers & Disposables': { categoryId: 'spa-products', subcategoryId: 'spa-accessories', secondSubcategoryId: 'slippers-disposables' },
  'Small Tools & Disposable Sundries': { categoryId: 'spa-products', subcategoryId: 'spa-accessories', secondSubcategoryId: 'small-tools-disposable-sundries' },
  
  // Nail Tools & Equipment - Second level
  'Pedicure Tools': { categoryId: 'nail-products', subcategoryId: 'tools-equipment', secondSubcategoryId: 'pedicure-tools' },
  'Stations & Storage': { categoryId: 'nail-products', subcategoryId: 'tools-equipment', secondSubcategoryId: 'stations-storage' },
  'Manicure & Pedicure Accessories': { categoryId: 'nail-products', subcategoryId: 'tools-equipment', secondSubcategoryId: 'manicure-pedicure-accessories' },
  
  // Implements - Disposables - Second level
  'Bowls': { categoryId: 'implements', subcategoryId: 'disposables', secondSubcategoryId: 'bowls' },
  'Medical & Treatment Disposables': { categoryId: 'implements', subcategoryId: 'disposables', secondSubcategoryId: 'medical-treatment-disposables' },
}

// Helper function to get product URL
export function getProductUrl(itemName: string, isMainCategory: boolean = false): string {
  if (isMainCategory) {
    const categoryId = categoryMapping[itemName]
    if (categoryId) {
      return `/products?category=${categoryId}`
    }
  }
  
  // Check for second subcategory first
  const secondSub = secondSubcategoryMapping[itemName]
  if (secondSub) {
    return `/products?category=${secondSub.categoryId}&subcategory=${secondSub.subcategoryId}&secondSubcategory=${secondSub.secondSubcategoryId}`
  }
  
  // Check for subcategory
  const sub = subcategoryMapping[itemName]
  if (sub) {
    return `/products?category=${sub.categoryId}&subcategory=${sub.subcategoryId}`
  }
  
  // Fallback to main category
  const categoryId = categoryMapping[itemName]
  if (categoryId) {
    return `/products?category=${categoryId}`
  }
  
  return '/products'
}

