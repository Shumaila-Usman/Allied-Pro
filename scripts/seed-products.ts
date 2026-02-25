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
    images: [`/products/${name.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '-').replace(/-+/g, '-')}-1.jpg`],
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
  'Our Hyaluronic Acid Gel Mask is a light and extremely hydrating professional level facial mask that assists in making the skin healthier, plumper and supple. Ideal to use in the salon and clinic, it provides immediate moisture and radiance. Available in 30ml size and also sold in a 500ml professional jar. Suitable for all skin types, in particular dry and dehydrated skin. Apply an even layer of this cooling skin mask to clean, dry skin. Leave on for 10–15 minutes, then gently peel off the mask. Serum or moisturizer are recommended to follow. Benefits include deep hydration, improved skin elasticity, leaves skin soft & supple, boosts healthy glow, and is ideal in business hydra IQ facials.',
  25.99,
  'skincare',
  'skincare-by-category',
  'face-masks'
))

products.push(createProduct(
  'Golden Firming Gel Mask (30ml/500ml)',
  'This golden firming gel mask enhances skin tone, gives a glowy effect and provides radiance. The gold and collagen are infused in this cooling skin mask to provide better elasticity that makes it perfect for salon use. It helps reduce face swelling and inflammation due to its cooling effect. Available in 30ml size and also in 500ml professional jar. Apply an even layer to clean, dry skin, avoiding the eye and lip area. Leave on for 10–15 minutes, then gently remove with water or a soft cloth. Benefits include improved skin tone, adds visible radiance, and leaves skin firmer and refreshed.',
  28.99,
  'skincare',
  'skincare-by-category',
  'face-masks'
))

products.push(createProduct(
  'Compressed Dry Sheet Masks',
  'These compressed dry sheet masks expand when soaked in serum or toner. These are individually packed and ideal for travel or professional use. Package includes 5 individually packed masks made from nonwoven material. Soak in toner or serum until fully expanded and saturated then unfold and apply evenly on the face, adjusting for a smooth, comfortable fit. Benefits include hygienic & portable design, customizable with any serum, and perfect for travel or salon use.',
  12.99,
  'skincare',
  'skincare-by-category',
  'face-masks'
))

products.push(createProduct(
  'Nonwoven Dry Sheet Mask',
  'Our Nonwoven Dry Sheet Mask is an all purpose facial mask available in white or black. Ideal for customized skincare treatments. One-time use mask suitable for professional use and routine skincare. Soak the Nonwoven Dry Sheet Face Mask thoroughly in your chosen serum. Apply evenly, making sure your or client\'s clean skin is completely covered, and let it sit for the suggested amount of time before removing it. Benefits include customizable treatment, soft and comfortable fit, and suitable for all skin types.',
  8.99,
  'skincare',
  'skincare-by-category',
  'face-masks'
))

// By Category - Eye Care
products.push(createProduct(
  'Nonwoven Dry Under Eye Pad',
  'In professional settings, these nonwoven under-eye pads are ideal for personalised under-eye treatments. Multi-use pads designed for professional salon use. Soak in serum until soft and fully absorbed. Place gently under the eyes during treatment and adjust for a comfortable fit. Benefits include targets the area under the eyes, improves hydration therapies, and lightweight and comfortable design.',
  6.99,
  'skincare',
  'skincare-by-category',
  'eye-care'
))

products.push(createProduct(
  'Under-Eye Press / Disc (Electric Jade)',
  'The Electric Jade Under-Eye Press is meant to remove the puffiness and refreshing tired eyes using a gentle vibration. Features vibrating function and compact design. After applying serum, gently glide the Under-Eye Press/Disc Electric Jade under the eyes. Use slow, light motions to reduce puffiness and refresh the delicate eye area. Benefits include helps de-puff eyes, stimulates circulation, and refreshes tired-looking skin.',
  19.99,
  'skincare',
  'skincare-by-category',
  'eye-care'
))

// By Category - Tools & Accessories
products.push(createProduct(
  'Cellulose Sponge',
  'Our Cellulose Sponge is a soft yet effective facial cleansing sponge suitable for all skin types. Ideal to remove masks, cleansers and to do a slight exfoliation on the skin when carrying out professional facials. Reusable and perfect for professional salon skincare use. Soak in warm water until soft, then gently wipe the face to remove products or cleanse skin. Benefits include light exfoliation, gentle on sensitive skin, and is ideal for professional facial treatments.',
  4.99,
  'skincare',
  'skincare-by-category',
  'tools-accessories'
))

products.push(createProduct(
  'Facial Brush (Synthetic/Natural)',
  'Our synthetic face brush is made to apply masks and skincare products evenly and smoothly. Also available in natural bristles. Professional use brush with synthetic bristles. Use to spread masks evenly over the face and neck. Apply in smooth, gentle strokes for clean and even coverage. Benefits include smooth product application, hygienic and easy to clean, and great for light exfoliation.',
  9.99,
  'skincare',
  'skincare-by-category',
  'tools-accessories'
))

products.push(createProduct(
  'Ice Globes',
  'Our Ice Globes are meant to be used on the face to calm, soothe, and cleanse the skin. A must-have facial massager tool for professional estheticians. Reusable glass globes suitable for professional spa and routine skincare use. Apply serum to cleansed skin and then gently roll cooled face globes upward and outward for 15 to 30 minutes. It will minimize puffiness and refresh the skin. Benefits include reduces redness, calms irritated skin, stimulates blood circulation, improves lymphatic drainage, and oxygenates the skin.',
  24.99,
  'skincare',
  'skincare-by-category',
  'tools-accessories'
))

products.push(createProduct(
  'Disposable Headbands',
  'Our Disposable Headbands are necessary to ensure hygiene in professional facial treatments. Designed for single use, they keep hair securely away from the face. Disposable & hygienic, lightweight & comfortable, perfect for professional salon use. Place around the client\'s head before starting any facial or skincare treatment. Adjust for a comfortable fit to keep hair away from the face. Benefits include maintains cleanliness, prevents product contact with hair, and ideal for spa and clinic use.',
  3.99,
  'skincare',
  'skincare-by-category',
  'tools-accessories'
))

products.push(createProduct(
  'Mixing Bowl Set',
  'An essential facial mixing bowl set for mixing skincare products, masks, and peels during professional procedures. Durable & reusable, suitable for professional use. Use the mixing bowl set to blend facial masks or skincare products before application. Ensure ingredients are mixed evenly for smooth, consistent results. Benefits include easy product blending, hygienic and practical design, and essential salon accessory.',
  14.99,
  'skincare',
  'skincare-by-category',
  'tools-accessories'
))

// By Category - Massage & Contouring
products.push(createProduct(
  'Gua Sha Stone (Dolphin)',
  'The Dolphin Gua Sha Stone is meant to improve the circulation of the blood and the lymphatic drainage of the body as well as modeling the facial features. Features an ergonomic dolphin shape for multi-area facial use. Apply a facial oil or serum, then glide the Gua Sha stone gently over the skin. Use upward and outward strokes for better circulation and a natural lift. Benefits include encourages lymphatic drainage, contours jawline & cheekbones, and improves skin glow.',
  18.99,
  'skincare',
  'skincare-by-category',
  'massage-contouring'
))

products.push(createProduct(
  'Gua Sha Stone (Concave)',
  'The Concave Gua Sha Stone is a multi-purpose facial tool best for specific facial areas like the nose bridge, fingers, and toes. Features a concave edge design for multi-use applications. Apply facial oil to the skin, then gently glide the Gua Sha Concave stone over targeted areas. Use slow, light strokes to stimulate circulation and relax muscles. Benefits include supports lymphatic massage, ideal for small delicate areas, and promotes smoother skin.',
  16.99,
  'skincare',
  'skincare-by-category',
  'massage-contouring'
))

products.push(createProduct(
  'Gua Sha Stone (S Shaped)',
  'The S-Shaped Gua Sha Stone is designed for multi-area use including face, neck, shoulders, and back. Features an ergonomic S shape suitable for face & body treatments. Apply a facial oil, then gently glide the "S" shaped Gua Sha stone along facial muscles. Use light pressure and smooth strokes to improve circulation and relieve tension. Benefits include relieves tension, encourages circulation, and ideal for full-body lymphatic massage.',
  17.99,
  'skincare',
  'skincare-by-category',
  'massage-contouring'
))

products.push(createProduct(
  'Jade Roller (Green, Rose Quartz, White)',
  'Our Jade Roller is a traditional facial massager that supports lymphatic drainage and gently tones and lifts the face. Available in Green Jade with Curved Bar, Rose Quartz with Curved Bar, and White Jade with Straight Bar. Apply serum or moisturizer to clean skin, then roll the Jade Roller gently upward. Use smooth, light strokes to boost circulation and promote a natural glow. Benefits include draws away toxins, improves circulation, and promotes firmer-looking skin.',
  22.99,
  'skincare',
  'skincare-by-category',
  'massage-contouring'
))

products.push(createProduct(
  '2-in-1 Electric Jade Roller',
  'The 2-in-1 Electric Jade Roller uses vibration to improve traditional facial massage, increasing skin stimulation and blood circulation. Includes Facial Roller & Under-Eye Press with electric vibrating function for professional use. Use the 2-in-1 Electric Jade Roller to massage the entire face gently. Chill the under-eye attachment before use to help reduce puffiness and refresh the eyes. Benefits include enhances lymphatic drainage, improves circulation, and helps reduce under-eye puffiness.',
  45.99,
  'skincare',
  'skincare-by-category',
  'massage-contouring'
))

products.push(createProduct(
  'T/U Electric Jade Roller',
  'T/U Electric Jade Roller is a multi-purpose vibrating facial rollers used to improve lymphatic drainage and facial sculpting. Features T/U shaped design with electric vibration for multi-area use. Gently roll the T/U Electric Jade Roller on the forehead, cheeks, chin, and jawline. Use upward, smooth movements to stimulate circulation and promote a natural glow. Benefits include supports lymphatic drainage, improves circulation, and enhances facial contouring.',
  39.99,
  'skincare',
  'skincare-by-category',
  'massage-contouring'
))

// By Concern - Redness
products.push(createProduct(
  'Ice Globes (Redness)',
  'Our Ice Globes are specifically designed to eliminate redness and calm skin. Features reusable glass globes, perfect for professional spa and routine skincare use. Apply serum to cleansed skin and then gently roll cooled face globes upward and outward for 15 to 30 minutes. It will minimize puffiness and refresh the skin. Benefits include reduces redness, calms irritated skin, stimulates blood circulation, improves lymphatic drainage, and oxygenates the skin.',
  24.99,
  'skincare',
  'skincare-by-concern',
  'redness'
))

// By Concern - Anti-Aging / Firming
products.push(createProduct(
  'Golden Firming Gel Mask (Anti-Aging)',
  'This golden firming gel mask enhances skin tone, gives a glowy effect and provides radiance. The gold and collagen are infused in this cooling skin mask to provide better elasticity that makes it perfect for salon use. It helps reduce face swelling and inflammation due to its cooling effect. Available in 30ml size and also in 500ml professional jar. Apply an even layer to clean, dry skin, avoiding the eye and lip area. Leave on for 10–15 minutes, then gently remove with water or a soft cloth. Benefits include improved skin tone, adds visible radiance, and leaves skin firmer and refreshed.',
  28.99,
  'skincare',
  'skincare-by-concern',
  'anti-aging-firming'
))

products.push(createProduct(
  'Jade Roller / Gua Sha (Anti-Aging)',
  'Professional facial massage tools that assist with lifting, toning, and contouring. Jade Roller features traditional design that supports lymphatic drainage and gently tones and lifts the face. Available in Green Jade with Curved Bar, Rose Quartz with Curved Bar, and White Jade with Straight Bar. Gua Sha Stones available in Dolphin, Concave, and S-Shaped designs for multi-area use. Apply serum or moisturizer to clean skin, then roll the Jade Roller gently upward or glide the Gua Sha stone gently over the skin. Use smooth, light strokes to boost circulation and promote a natural glow. Benefits include draws away toxins, improves circulation, promotes firmer-looking skin, encourages lymphatic drainage, contours jawline & cheekbones, and improves skin glow.',
  22.99,
  'skincare',
  'skincare-by-concern',
  'anti-aging-firming'
))

// By Concern - Dryness
products.push(createProduct(
  'Hyaluronic Acid Gel Mask (Dryness)',
  'Our Hyaluronic Acid Gel Mask is a light and extremely hydrating professional level facial mask that focuses on suppleness and hydration. Ideal to use in the salon and clinic, it provides immediate moisture and radiance. Available in 30ml size and also sold in a 500ml professional jar. Suitable for all skin types, in particular dry and dehydrated skin. Apply an even layer of this cooling skin mask to clean, dry skin. Leave on for 10–15 minutes, then gently peel off the mask. Serum or moisturizer are recommended to follow. Benefits include deep hydration, improved skin elasticity, leaves skin soft & supple, boosts healthy glow, and is ideal in business hydra IQ facials.',
  25.99,
  'skincare',
  'skincare-by-concern',
  'dryness'
))

// By Skin Type - Normal / All Skin Types
products.push(createProduct(
  'Cellulose Sponge (All Skin Types)',
  'Our Cellulose Sponge is a soft yet effective facial cleansing sponge explicitly listed as able to use with any skin type. Ideal to remove masks, cleansers and to do a slight exfoliation on the skin when carrying out professional facials. Reusable and perfect for professional salon skincare use. Soak in warm water until soft, then gently wipe the face to remove products or cleanse skin. Benefits include light exfoliation, gentle on sensitive skin, and ideal for professional facial treatments.',
  4.99,
  'skincare',
  'skincare-by-skin-type',
  'normal-all-skin-types'
))

products.push(createProduct(
  'Compressed Dry Sheet Masks (Universal)',
  'These compressed dry sheet masks expand when soaked in serum or toner. These are individually packed and ideal for travel or professional use with universal application for all skin types. Package includes 5 individually packed masks made from nonwoven material. Soak in toner or serum until fully expanded and saturated then unfold and apply evenly on the face, adjusting for a smooth, comfortable fit. Benefits include hygienic & portable design, customizable with any serum, and perfect for travel or salon use.',
  12.99,
  'skincare',
  'skincare-by-skin-type',
  'normal-all-skin-types'
))

// SPA PRODUCTS
// Treatment Products (Waxing & Paraffin)
products.push(createProduct(
  'SilkRoma Depilatory Honey Wax',
  'SilkRoma Honey Wax is a professional soft wax, ideal for removing coarse or curly hair with ease. Soft wax formulation best for coarse/curly hair, perfect for professional salon use. Heat the wax to the recommended temperature, apply in the direction of hair growth, and remove with a strip. Benefits include strong grip for thick hair, smooth hair-free results, and minimal irritation.',
  18.99,
  'spa-products',
  'treatment-products'
))

products.push(createProduct(
  'SilkRoma Depilatory Cream Wax',
  'Cream Wax melts at a lower temperature, reducing the risk of burns—perfect for sensitive skin. Low heat soft wax ideal for sensitive skin, designed for professional use. Apply a thin, even layer of SilkRoma Depilatory Cream Wax to the desired area. Press a pre-cut strip over the wax and remove quickly in the opposite direction of hair growth. Benefits include gentle on delicate skin, smooth and safe hair removal, and reduces discomfort.',
  19.99,
  'spa-products',
  'treatment-products'
))

products.push(createProduct(
  'SilkRoma Depilatory Zinc Wax',
  'Zinc Wax soothes the skin while removing hair, making it ideal for fine to medium hair types. Enriched with Zinc, best for fine/medium hair, perfect for professional use. Heat the SilkRoma Depilatory Zinc Wax until warm and spread evenly on the skin. Place a waxing strip over it and remove quickly in one smooth motion. Benefits include soothes skin during hair removal, reduces redness, and smooth results.',
  17.99,
  'spa-products',
  'treatment-products'
))

products.push(createProduct(
  'Roma Azulene Wax',
  'Infused with Azulene oil, this wax reduces redness and inflammation during hair removal. Perfect for sensitive, redness-prone skin. Features Azulene oil-infused formula, sensitive skin friendly, soft wax formula. Apply Roma Azulene Wax evenly in the direction of hair growth. Press a strip over the wax and remove quickly against hair growth for smooth results. Benefits include reduces irritation, gentle and calming, and smooth professional results.',
  20.99,
  'spa-products',
  'treatment-products'
))

products.push(createProduct(
  'Roll-on Wax (Pink, Honey, Azulene, Banana)',
  'Water-soluble roll-on wax for easy application and mess-free hair removal. Available in multiple formulations including Pink, Honey, Azulene, and Banana variants. Features water-soluble formula with ready-to-use roll-on cartridges. Roll the wax evenly over the desired area of skin. Let it cool slightly, then press a strip on top and remove against hair growth. Benefits include no sticky residue, fast and clean application, and suitable for all hair types.',
  15.99,
  'spa-products',
  'treatment-products'
))

products.push(createProduct(
  'Epilating Cotton Roll',
  'Premium epilating cotton rolls available in hard, soft, or medium densities for customizable waxing. Features ultra-white cotton, durable and thick construction, two sizes available with custom labeling available. Cut the Epilating Cotton Roll to the desired size for waxing applications. Use it to apply wax evenly or to remove excess wax from the skin. Benefits include professional-grade quality, smooth and even waxing, and reduces irritation.',
  8.99,
  'spa-products',
  'treatment-products'
))

products.push(createProduct(
  'Pre-Cut Waxing Strips',
  'Ready-to-use waxing strips for quick treatments. Features 100 pieces per pack, size: 3" x 9", nonwoven material. Apply over wax and remove swiftly. Benefits include time-saving, durable and strong, and consistent performance.',
  6.99,
  'spa-products',
  'treatment-products'
))

products.push(createProduct(
  'Paraffin Hand & Foot Liners',
  'Disposable paraffin hand and foot liners for safe and clean paraffin treatments. Features plastic, disposable design, easy to use, salon-grade quality. Paraffin Hand Liner quantity: 100 PC BAG. Paraffin Foot Liner quantity: 101 PC BAG. Insert hands or feet into liner before paraffin bath. Benefits include maintains hygiene, easy and convenient, reduces product mess, hygienic and convenient, and prevents mess.',
  4.99,
  'spa-products',
  'treatment-products'
))

products.push(createProduct(
  'Terry Booties or Mitts',
  'Insulated terry booties or mitts perfect for paraffin treatments. Features soft terry material, fits over plastic liners, retains warmth (quantity: 1 pair Mitts, 2 pair booties). Slide over hands or feet during paraffin wax therapy. Benefits include keeps paraffin warm longer, comfortable and soft, and professional spa-quality.',
  12.99,
  'spa-products',
  'treatment-products'
))

products.push(createProduct(
  'Paraffin Brush',
  'Reusable paraffin brush for smooth application of block or pellet wax. Features soft bristles, reusable design, salon-grade quality. Brush paraffin evenly over hands or feet during treatment. Benefits include even application, easy to clean, and professional results.',
  9.99,
  'spa-products',
  'treatment-products'
))

// Body Wraps & Spa Creams
products.push(createProduct(
  'Body Shrink Roll',
  'Give your clients the results they\'re looking for with a wrap that actually stays in place. This soft yet sturdy shrink roll is easy to apply and works with the body\'s natural heat to boost the effectiveness of every treatment. Features high-quality material, large roll for full-body treatments, salon-grade quality. Use the Body Shrink Roll to cover areas of the body during body sculpting or spa treatments. It protects the skin and ensures hygienic, comfortable treatment. Benefits include enhances treatment results, comfortable and flexible, and easy to use.',
  14.99,
  'spa-products',
  'body-wraps-spa-creams'
))

products.push(createProduct(
  'Thermal Foil Sheet Blanket',
  'Weightless, heat reflective thermal foil blanket to use in spa treatments and body wraps. Features lightweight, reflective material, reusable, perfect for salon and spa use (quantity: 1 pc). Wrap the Thermal Foil Sheet Blanket around the client to retain heat during treatments. Ensure full coverage for comfort and maximum effectiveness. Benefits include enhances treatment results, easy to handle, and professional-grade quality.',
  19.99,
  'spa-products',
  'body-wraps-spa-creams'
))

products.push(createProduct(
  'Body Brush (Large/Small)',
  'Professional body brush for dry brushing and exfoliation. Features large or small sizes, soft natural bristles, salon-grade quality. Brush skin in circular motions before treatments. Benefits include exfoliates dead skin, stimulates circulation, and professional spa results.',
  11.99,
  'spa-products',
  'body-wraps-spa-creams'
))

products.push(createProduct(
  'Exfoliating Gloves',
  'Durable exfoliating gloves for multi-use body scrubs. Features soft but firm texture, multi-use design, salon and spa-grade quality. Wear gloves and massage skin to exfoliate dead cells. Benefits include smooths skin, stimulates circulation, and reusable and easy.',
  7.99,
  'spa-products',
  'body-wraps-spa-creams'
))

// Hot Stones
products.push(createProduct(
  'Hot Stones',
  'Premium basalt hot stones for spa and massage treatments. Features smooth, flat stones, heat-retentive, salon and spa-grade quality (quantity: 50 pc set). Heat stones and place on body for relaxation and muscle relief. Benefits include deep relaxation, professional massage results, and durable and reusable.',
  29.99,
  'spa-products',
  'hot-stones'
))

// Spa Accessories - Towels, Robes & Linens
products.push(createProduct(
  'Towels (Various Sizes)',
  'High-quality salon towels available in multiple sizes for professional use. Features soft and durable material, multi-use, salon and spa-grade quality (quantity: 13 PC/PK). Use for facials, massages, hair treatments, or general salon needs. Benefits include absorbent and hygienic, comfortable for clients, and reusable and durable.',
  12.99,
  'spa-products',
  'spa-accessories',
  'towels-robes-linens'
))

products.push(createProduct(
  'Pedicure Disposable Towels',
  'High-quality disposable towels for hygienic pedicure services. Features soft and absorbent material, single-use, salon-grade quality (quantity: 100/PK, 500 PC/CASE). Line pedicure stations or wrap around client feet. Benefits include hygienic and convenient, easy to use, and professional appearance.',
  5.99,
  'spa-products',
  'spa-accessories',
  'towels-robes-linens'
))

products.push(createProduct(
  'Terry Gown Wrap',
  'A strong, absorbent terry gown wrap with an adjustable Velcro strap, giving a comfortable and secure fit during treatments. Features mid-thigh length, Velcro adjustable, soft and durable design. Use to cover client body when doing facials, spa or hair treatments. Benefits include comfortable and adjustable, absorbent and hygienic, and professional salon quality.',
  24.99,
  'spa-products',
  'spa-accessories',
  'towels-robes-linens'
))

products.push(createProduct(
  'Terry Headbands',
  'Soft, thick headbands made from cozy terry fabric, designed with easy Velcro straps to keep your clients comfortable during treatments. Features Velcro adjustable strap, soft terry fabric, salon-grade quality (quantity: 1 PC). Wrap around the head of the client to keep hair away during treatments or facials. Benefits include comfortable and adjustable, protects hair during treatments, and durable and reusable.',
  6.99,
  'spa-products',
  'spa-accessories',
  'towels-robes-linens'
))

products.push(createProduct(
  'Cotton Flat Sheets',
  'Smooth cotton flat sheets designed for client protection and hygiene during treatments. Features breathable cotton fabric, protects from moisture, salon and spa-grade quality (quantity: 1 PC). Line beds or couches for facials, massages, or waxing. Benefits include naturally breathable, prevents bacterial growth, and comfortable and durable.',
  18.99,
  'spa-products',
  'spa-accessories',
  'towels-robes-linens'
))

products.push(createProduct(
  'Terry Fitted Bed Sheet',
  'Soft terry fitted sheets for treatment beds, available with or without hole for face placement. Features absorbent and soft material, perfect for salon and spa use, available in multiple sizes. Cover treatment beds to ensure client comfort and hygiene. Benefits include hygienic and reusable, comfortable for clients, and easy to clean.',
  22.99,
  'spa-products',
  'spa-accessories',
  'towels-robes-linens'
))

products.push(createProduct(
  'Jersey Fitted Bed Sheet',
  'Lightweight and comfortable jersey fitted sheet for client beds. Features soft and flexible material, easy to fit, salon-grade quality. Use to cover beds during treatments for hygiene and comfort. Benefits include comfortable and breathable, easy maintenance, and professional appearance.',
  19.99,
  'spa-products',
  'spa-accessories',
  'towels-robes-linens'
))

products.push(createProduct(
  'Soft Cotton Thermal Weave Blanket',
  'A soft, skin-friendly cotton thermal weave blanket, perfect for clients who like a thicker, cozy layer during treatments. Features soft cotton material, hypoallergenic, perfect for salon and spa use (quantity: 1 PC). Use to cover clients during facials, body wraps, or spa treatments. Benefits include comfortable and warm, safe for sensitive skin, and professional-grade quality.',
  34.99,
  'spa-products',
  'spa-accessories',
  'towels-robes-linens'
))

products.push(createProduct(
  'Waffle Blanket',
  'Soft and cozy waffle blanket ideal for client comfort during spa treatments. Features lightweight and breathable design, perfect for salon and spa use, soft texture. Cover clients during facials, massages, or body treatments. Benefits include enhances client comfort, professional-grade quality, and easy to maintain.',
  28.99,
  'spa-products',
  'spa-accessories',
  'towels-robes-linens'
))

// Spa Accessories - Slippers & Disposables
products.push(createProduct(
  'Disposable Bouffant Cap / Shower Cap',
  'Lightweight bouffant caps and shower caps to prevent contamination and maintain hygiene during treatments. Disposable Bouffant Cap features disposable design, comfortable elastic, perfect for salon and spa use (quantity: 100 PC/BAG). Disposable Shower Cap features disposable design, good-quality elastic, perfect for salon and spa use. Place over hair before treatments to prevent product contact or wetting. Benefits include hygienic and disposable, lightweight and comfortable, prevents contamination, and keeps hair protected.',
  2.99,
  'spa-products',
  'spa-accessories',
  'slippers-disposables'
))

products.push(createProduct(
  'G-String Panties / Nonwoven Shorts',
  'Hygienic, skin-friendly G string panties and soft, disposable nonwoven shorts for spa or salon treatments. G String Panties available in white or blue, available in Large sizes, single-use or disposable (quantity: 100 PC/PK). Nonwoven Disposable Shorts feature skin-friendly material, lightweight and compact, disposable for hygiene (quantity: 10 PC/BAG). Wear during body treatments, waxing, or spa services to protect modesty and comfort. Benefits include comfortable and hygienic, protects privacy, compact and convenient, hygienic and disposable, and easy to store and use.',
  3.99,
  'spa-products',
  'spa-accessories',
  'slippers-disposables'
))

products.push(createProduct(
  'Nonwoven Disposable Gown, Bra, or Underwear',
  'Soft, disposable nonwoven garments for client comfort and hygiene. Features skin-friendly material, disposable design, salon and spa-grade quality (quantity: 10 PC). Provide to clients during treatments for privacy and hygiene. Benefits include hygienic and convenient, comfortable for clients, and ideal for multiple treatment types.',
  4.99,
  'spa-products',
  'spa-accessories',
  'slippers-disposables'
))

products.push(createProduct(
  'Nonwoven Body Sheet Roll / Pre-cut Sheets',
  'Premium non-woven body sheet roll and convenient pre-cut nonwoven sheets for single-use in spas and salons. Pre-cut sheets feature pre-cut and ready to use, soft and hygienic, salon-grade quality (quantity: 10 PC/PK). Roll features salon grade non-woven fabric, roll large and on behalf of several clients, soft and durable (quantity: 50 SHEET /ROLL 30G, 1 ROLL). Line beds, chairs, or equipment for hygienic treatments. Use over straight beds, chairs or wraps in the course of treatments. Benefits include disposable and easy, protects surfaces, professional appearance, hygienic and disposable, and comfortable for clients.',
  7.99,
  'spa-products',
  'spa-accessories',
  'slippers-disposables'
))

products.push(createProduct(
  'Washable Cotton Fitted Face Cover',
  'Reusable hygienic face covers made of cotton for spas and salons. Features washable cotton material, soft and durable, salon-grade quality (quantity: 1 pc). Use over the client\'s face during treatment in order to protect skin and to keep hygiene. Benefits include reusable and eco-friendly, hygienic and comfortable, and protects during facials and masks.',
  8.99,
  'spa-products',
  'spa-accessories',
  'slippers-disposables'
))

// Spa Accessories - Small Tools & Disposable Sundries
products.push(createProduct(
  'Spatulas (Plastic, Small Angled, Wooden, Stainless Steel)',
  'Professional spatulas for application of creams, masks, and waxes. Wooden Waxing Spatulas are strong enough to handle thick waxes without snapping, giving you a reliable, splinter-free spread every single time. Available in multiple sizes, disposable and hygienic, salon-grade (quantity: 500 PC/ PK, 10 PK/ CAS). Wooden Handle Waxing Spatula features long-lasting design with wooden handle to provide a safe grip and good accuracy, stainless steel edge, professional use (quantity: 1 PC). Stainless Steel Spatula is reusable and retains heat to maximize the application of the wax, heat-retentive, easy to clean (quantity: 2 PC). Use spatulas to scoop and spread wax evenly on the treatment area. Apply in smooth, consistent strokes for easy and effective hair removal. Benefits include precise wax application, comfortable grip, accurate application, long-lasting and durable, smooth wax application, durable and reusable, and professional-grade tool.',
  5.99,
  'spa-products',
  'spa-accessories',
  'small-tools-disposable-sundries'
))

products.push(createProduct(
  'Brushes (Fan Brush, White/Clear Mask Brushes)',
  'Professional brushes for makeup and mask application. Fan Brush features soft synthetic bristles, lightweight and flexible design, best for powder, highlighter, or blush (quantity: 1pc). White/Clear Mask Brushes feature soft-bristled brushes with wooden handles for effortless mask application, easy to clean and durable (quantity: 1pc). Dip the Fan Brush lightly into powder, highlighter, or other makeup product and sweep gently over the desired area. Use the White or Clear Mask Brush to scoop your facial mask or cream and apply evenly over the face. Benefits include even product distribution, smooth even application, hygienic and professional, and ideal for salons and spa treatments.',
  8.99,
  'spa-products',
  'spa-accessories',
  'small-tools-disposable-sundries'
))

products.push(createProduct(
  'Glass Dappen Dish',
  'Easily sanitised and crystal clear. This sturdy glass dappen dish gives your spa a polished appearance while offering a flawlessly smooth surface for blending creams and pigments. Available with or without lid, heat-resistant and reusable, perfect for professional salon tool (quantity: 1 pc). Use the Glass Dappen Dish to mix or hold small amounts of products during treatments. The lid (if included) keeps contents safe and prevents spills or contamination. Benefits include easy to clean, safe for multiple products, and essential for professional use.',
  6.99,
  'spa-products',
  'spa-accessories',
  'small-tools-disposable-sundries'
))

products.push(createProduct(
  'Mixing Palette',
  'Durable mixing palette for blending makeup colors efficiently. Features easy to clean, smooth surface, salon-grade quality. Mix foundations, powders, or pigments on palette for precise color application. Benefits include hygienic and reusable, blends colors easily, and professional makeup results.',
  7.99,
  'spa-products',
  'spa-accessories',
  'small-tools-disposable-sundries'
))

products.push(createProduct(
  'Cosmetic Applicators (Mascara wands, Brow wands, Eyeshadow wands, Lip brushes)',
  'Disposable cosmetic applicators for hygienic makeup application. Disposable Mascara Wands are designed for smooth and hygienic lash application, single-use or limited multi-use, lightweight and easy to handle, salon-grade quality (quantity: 25pc/BAG). Disposable Brow Wands are ideal for shaping, grooming, and applying brow products with precision, single-use or limited multi-use, lightweight and portable, salon-grade quality (quantity: 1 pc). Disposable Eyeshadow Applicators feature soft sponge tip, single-use, lightweight and easy to control. Disposable Lip Brushes are designed for precise and hygienic lipstick or gloss application, single-use, soft flexible tip, salon-grade quality (quantity: 25 PC/PK). Dip mascara wands into mascara or use to comb through lashes. Use brow wands to brush brows into shape or apply brow gel. Apply and blend eyeshadow evenly with eyeshadow applicators. Use lip brushes to apply lipstick or lip gloss evenly. Benefits include prevents cross-contamination, separates and defines lashes, maintains hygiene standards, defines and shapes brows easily, prevents product contamination, allows precise application, and ideal for professional makeup artists.',
  4.99,
  'spa-products',
  'spa-accessories',
  'small-tools-disposable-sundries'
))

products.push(createProduct(
  'Cotton Swabs',
  'Multi-use cotton swabs for precise makeup, skincare, or cleaning applications. Features soft and absorbent material, multi-purpose, salon-grade quality (quantity: 300 PC/BAG). Apply skincare, clean tools, or correct makeup. Benefits include precision application, hygienic and reusable, and professional results.',
  3.99,
  'spa-products',
  'spa-accessories',
  'small-tools-disposable-sundries'
))

products.push(createProduct(
  'Gauze (Various Sizes)',
  'Multi-use salon gauze for skincare, treatments, or minor procedures. Available in various sizes (2x2, 4x4, 4x8, 4x12), soft and absorbent, salon and spa-grade quality (quantity: 200/PK). Use for cleansing, applying products, or dressing minor cuts. Benefits include hygienic and professional, soft and safe on skin, and easy to use.',
  5.99,
  'spa-products',
  'spa-accessories',
  'small-tools-disposable-sundries'
))

products.push(createProduct(
  'Cosmetic Wedges',
  'Latex-free cosmetic wedges for flawless makeup application. Features absorbs less product, soft and durable, salon-grade quality (quantity: 100 PC/BAG). Apply foundation, concealer, or cream-based products. Benefits include minimizes product waste, hygienic and easy to use, and professional results.',
  4.99,
  'spa-products',
  'spa-accessories',
  'small-tools-disposable-sundries'
))

products.push(createProduct(
  'Examination Paper (Crepe/Smooth)',
  'Good crepe and smooth examination paper in different sizes to make clients feel comfortable. Available in crepe and smooth varieties, multiple sizes available, perfect for salon and spa use (quantity: 12 ROLL / CASE). Place the Examination Paper on beds, chairs, or treatment surfaces for hygiene purposes. Replace after each client to maintain a clean and sanitary environment. Benefits include clean and hygienic, easy to replace, and protects surfaces.',
  6.99,
  'spa-products',
  'spa-accessories',
  'small-tools-disposable-sundries'
))

products.push(createProduct(
  'Neck Paper Roll',
  'High-quality neck paper rolls that are hygienic and comfortable during treatments. Features high-quality material, perfect for professional salon use, available in standard sizes (quantity: 5 PC PER PK). Wrap the Neck Paper Roll around the client\'s neck before treatments. This keeps the area clean and protected throughout the service. Benefits include hygienic and comfortable, protects client clothing, and disposable and convenient.',
  5.99,
  'spa-products',
  'spa-accessories',
  'small-tools-disposable-sundries'
))

// Warmers & Hot Towel Cabinets
products.push(createProduct(
  'Double or Single Metal Wax Heater',
  'Quick-heating metal wax heaters for professional salons, available in single or double pot options. Comes with lid and pot, quick heating function, durable metal construction. Fill the Double or Single Metal Wax Heater with wax and turn it on to heat. Maintain a consistent temperature to ensure smooth, even application during waxing. Benefits include fast & efficient wax heating, durable for long-term use, and ideal for soft & hard wax.',
  89.99,
  'spa-products',
  'warmers-hot-towel-cabinets'
))

products.push(createProduct(
  'Paraffin Heater',
  'Efficient paraffin heater for melting block or pellet wax safely. Features adjustable temperature, large capacity, salon-grade quality. Melt paraffin wax for hands, feet, or full-body treatments. Benefits include safe and easy, consistent heating, and professional results.',
  79.99,
  'spa-products',
  'warmers-hot-towel-cabinets'
))

products.push(createProduct(
  'Hot Stone Heater (18q / 6q)',
  'Hot stone heaters with adjustable temperature for spa use. Hot Stone Heater 18q features large 18-quart capacity, adjustable heat dial, professional-grade quality. Hot Stone Heater 6q features small and portable design, adjustable temperature, salon-grade quality. Heat stones to desired temperature before treatments. Benefits include maintains consistent heat, large capacity for multiple stones, professional spa efficiency, space-saving, efficient heating, and professional results.',
  129.99,
  'spa-products',
  'warmers-hot-towel-cabinets'
))

products.push(createProduct(
  'Square/Round Warmer Coolers',
  'Heavy-duty paper collars to protect your wax warmer from spills and help lift cans safely. Available in square or round shape, durable and heat-resistant, perfect for professional salon use. Place the Warmer Cooler around your wax warmer to catch any drips or spills during waxing. It can also be used to safely lift, hold, or stabilize the wax can, ensuring a clean and convenient waxing process. Benefits include keeps workspace clean, makes handling wax cans safer, and reusable.',
  24.99,
  'spa-products',
  'warmers-hot-towel-cabinets'
))

// NAIL PRODUCTS
// Nail Care (Cuticle & Treatments)
products.push(createProduct(
  'Argan Oil Hand Mask',
  'Nourishing Argan oil hand mask with 1 pair of gloves for soft and hydrated hands. Features 1 pair of gloves, professional-grade, salon-quality. Wear gloves over clean hands for 15–20 minutes, then massage in excess product. Benefits include deep hydration, softens dry hands, and promotes healthy skin.',
  12.99,
  'nail-products',
  'nail-care'
))

products.push(createProduct(
  'Honey & Almond Hand Mask',
  'Moisturizing hand mask with honey and almond oil, includes 1 pair of gloves. Features 1 pair of gloves, natural nourishing ingredients, salon use. Apply gloves on clean hands for 15–20 minutes, then massage remaining product. Benefits include hydrates and softens skin, nourishes hands naturally, and salon-quality results.',
  12.99,
  'nail-products',
  'nail-care'
))

products.push(createProduct(
  'Teatree Exfoliating Foot Mask',
  'Anti-inflammatory foot mask with tea tree, includes 1 pair of booties. Features 1 pair of booties, anti-bacterial and soothing, professional-grade. Wear booties over feet for 15–20 minutes, then rinse or massage. Benefits include reduces inflammation, antibacterial and refreshing, and smooth healthy feet.',
  14.99,
  'nail-products',
  'nail-care'
))

products.push(createProduct(
  'Lavender Exfoliating Foot Mask',
  'Moisturizing foot mask with lavender, includes 1 pair of booties. Features 1 pair of booties, lavender-infused, salon-grade. Wear booties for 15–20 minutes, then massage remaining product into feet. Benefits include hydrates and softens skin, aromatherapy benefits, and smooth glowing feet.',
  14.99,
  'nail-products',
  'nail-care'
))

products.push(createProduct(
  'Argan Oil Moisturizing Foot Mask',
  'Intensive Argan oil foot mask, includes 1 pair of gloves for professional hydration. Features 1 pair of gloves, professional-grade, salon-quality. Apply gloves over clean feet for 15–20 minutes, then massage excess oil. Benefits include deep hydration, softens rough skin, and salon results.',
  13.99,
  'nail-products',
  'nail-care'
))

products.push(createProduct(
  'Hindu Stone',
  'High-quality hindu stone for cuticle and nail care. Features durable stone, professional-grade, multi-use. Use to push back cuticles gently during manicure. Benefits include safe and precise cuticle care, professional results, and hygienic.',
  6.99,
  'nail-products',
  'nail-care'
))

products.push(createProduct(
  'Wooden Manicure Stick',
  'Disposable wooden manicure sticks for cuticle and nail care. Features high-quality wood, various forms and sizes, single-use (quantity: 100 PC/BAG). Push back cuticles or clean under nails safely. Benefits include hygienic and disposable, precise nail care, and professional results.',
  3.99,
  'nail-products',
  'nail-care'
))

// Nail Files & Buffers
products.push(createProduct(
  'Nail Files (Various Kinds and Grits)',
  'Durable nail files for shaping and smoothing nails. Features various types and grits, salon and professional-grade, customizable (quantity: 1PC). File nails in one direction for smooth, professional edges. Benefits include precise nail shaping, reduces breakage, and professional finish.',
  4.99,
  'nail-products',
  'nail-files-buffers'
))

products.push(createProduct(
  'Zebra Files (Straight or Curve)',
  'Professional Zebra nail files available in straight or curved styles. Features different grits, salon-grade, durable (quantity: 1PC). Use straight or curved files to shape nails efficiently. Benefits include smooth finish, precise filing, and reduces nail damage.',
  5.99,
  'nail-products',
  'nail-files-buffers'
))

products.push(createProduct(
  'Nail Buffers (Blue, Orange, or Purple)',
  'Colorful nail buffers for a smooth, glossy finish. Features available in blue, orange, purple, salon-grade, multi-use (quantity: 5 PC/PK). Buff nails gently in circular motions for shine. Benefits include smooths nail surface, enhances shine, and professional results.',
  4.99,
  'nail-products',
  'nail-files-buffers'
))

products.push(createProduct(
  '4-Way Nail Buffer',
  'Multi-sided 4-way nail buffer for shaping, smoothing, and shining. Features each side serves a different purpose, salon-quality, durable (quantity: 5 PC/PK). Use each side in sequence for professional nail finish. Benefits include smooths and polishes nails, saves time, and professional results.',
  6.99,
  'nail-products',
  'nail-files-buffers'
))

products.push(createProduct(
  'Glass Nail File (Large or Small)',
  'High-quality glass nail file for precision nail shaping. Features available in large or small, multiple colors, salon-grade (quantity: 5 PC/PK). Gently file nails in one direction for smooth edges. Benefits include durable and hygienic, smooth professional finish, and reduces nail splitting.',
  8.99,
  'nail-products',
  'nail-files-buffers'
))

products.push(createProduct(
  'Mini Buffers (Pink or White)',
  'Compact mini nail buffer for smoothing and polishing nails. Features pink or white, salon-grade, small and portable. Buff nails gently for shine and smoothness. Benefits include compact and easy to use, smooths nails efficiently, and professional results.',
  3.99,
  'nail-products',
  'nail-files-buffers'
))

// Nail Art
products.push(createProduct(
  'Nail Art Tool',
  'Multi-sided nail art tool for precise dotting and designs. Features multiple sizes on each side, professional-grade, durable (quantity: 10 PC/PK). Use ends to create dots, patterns, or fine details on nails. Benefits include enhances nail art creativity, precision application, and salon-quality results.',
  5.99,
  'nail-products',
  'nail-art'
))

products.push(createProduct(
  'Nail Art Tip Display (18 or 64-tip)',
  'Professional nail art tip display for showcasing designs. Features available in 18-tip or 64-tip sets, durable and high-quality, multiple sizes. Attach tips, display nail art designs for clients or training. Benefits include showcases creativity, organizes designs, and enhances professional nail portfolio.',
  12.99,
  'nail-products',
  'nail-art'
))

products.push(createProduct(
  'Nail-Tip Wheel',
  'Versatile nail-tip wheel in various sizes and colors. Features multiple tip sizes, durable plastic, salon and professional use (quantity: 10 PC/PK). Display, organize, or use tips for practice and client services. Benefits include enhances nail art, keeps tips organized, and professional salon accessory.',
  9.99,
  'nail-products',
  'nail-art'
))

// Tools & Equipment - Pedicure Tools
products.push(createProduct(
  '2-Sided Callus Remover Foot File',
  'Dual-sided foot file for removing calluses effectively. Features fine sand side, coarse sand side, salon and spa-grade. Rub coarse side on rough skin, smooth side to finish. Benefits include softens and smooths feet, efficient exfoliation, and professional results.',
  8.99,
  'nail-products',
  'tools-equipment',
  'pedicure-tools'
))

products.push(createProduct(
  'SilkB Micro-plane Colossal Foot File',
  'High-quality micro plane foot file for heavy callus removal. Features colossal size for efficiency, easy to clean, professional salon-grade. Rub on dry or wet skin to remove hardened calluses. Benefits include smooths rough feet quickly, durable and long-lasting, and professional foot care results.',
  12.99,
  'nail-products',
  'tools-equipment',
  'pedicure-tools'
))

products.push(createProduct(
  'Stainless Steel Pedicure Foot File',
  'High-quality stainless steel foot file for pedicure treatments. Features durable rust-resistant design, easy to sanitize, salon-grade professional tool. Rub on heels and rough skin in circular motion. Clean with sanitizer after use. Benefits include long-lasting professional tool, hygienic and easy to clean, and smooths tough skin efficiently.',
  14.99,
  'nail-products',
  'tools-equipment',
  'pedicure-tools'
))

products.push(createProduct(
  'Pumice Stone',
  'Lightweight pumice stone for exfoliating feet and heels. Features durable natural stone, salon and spa-grade, reusable. Rub on dry or wet heels in circular motion to remove dead skin. Benefits include smooths rough skin, prevents calluses, and professional foot care.',
  5.99,
  'nail-products',
  'tools-equipment',
  'pedicure-tools'
))

products.push(createProduct(
  'Pumice Stone with Brush',
  'Dual-purpose pumice stone with brush for smooth feet. Features stone for exfoliation, brush for cleansing, salon-grade. Use pumice for rough skin, brush to remove debris. Benefits include smooth exfoliated feet, easy to use, and professional results.',
  7.99,
  'nail-products',
  'tools-equipment',
  'pedicure-tools'
))

products.push(createProduct(
  'Pedicure File Stickers',
  'Convenient pedicure file stickers available in multiple grits. Features variety of grit options, easy to apply, professional salon use (quantity: 5 STICKER/PK pc). Stick onto file base and use for exfoliating feet. Replace when worn. Benefits include customizable filing experience, efficient callus removal, and hygienic and professional.',
  4.99,
  'nail-products',
  'tools-equipment',
  'pedicure-tools'
))

products.push(createProduct(
  '2-Sided Pedicure File',
  'Durable 2-sided pedicure file for professional foot care. Features coarse and fine grit sides, salon-grade quality, reusable. Rub coarse side on calluses, smooth with fine side for soft feet. Benefits include efficient callus removal, smooth salon-ready feet, and hygienic and professional.',
  6.99,
  'nail-products',
  'tools-equipment',
  'pedicure-tools'
))

// Stations & Storage
products.push(createProduct(
  'Nail Polish Table or Wall Rack',
  'High-quality nail polish storage rack for salon organization. Features holds multiple bottles, tabletop or wall-mount, durable and professional. Place bottles neatly to organize your nail polish collection. Benefits include easy access to colors, saves workspace, and professional presentation.',
  34.99,
  'nail-products',
  'stations-storage'
))

products.push(createProduct(
  'Nail Bit Holder (48 holes)',
  'Professional nail bit holder for organizing drill bits. Features holds 48 bits, durable plastic, salon-grade (quantity: 48 holes). Insert bits into slots for storage and easy access. Benefits include keeps nail bits organized, easy to locate tools, and professional salon setup.',
  18.99,
  'nail-products',
  'stations-storage'
))

products.push(createProduct(
  'Empty Storage Container',
  'High-quality multi-use storage container for nails and beauty tools. Features durable and reusable, professional-grade, compact design. Store nail products, bits, or accessories safely. Benefits include keeps tools organized, protects items, and professional salon storage.',
  12.99,
  'nail-products',
  'stations-storage'
))

products.push(createProduct(
  'Manicure Hand Rest',
  'Portable manicure hand rest for professional nail care. Features lightweight and easy to carry, durable material, salon-grade. Place under client hands during manicure for comfort and stability. Benefits include ergonomic and comfortable, improves nail service precision, and professional salon appearance.',
  14.99,
  'nail-products',
  'stations-storage'
))

products.push(createProduct(
  'Practise Hand',
  'High-quality practice hand for nail training and practice. Features durable and realistic design, professional-grade, multi-use for nail techniques. Use for practicing nail art, extensions, or filing techniques. Benefits include ideal for students and salons, improves skill and precision, and reusable and durable.',
  89.99,
  'nail-products',
  'stations-storage'
))

products.push(createProduct(
  'Nail-Tip Box (Numbered)',
  'Professional numbered nail-tip storage box. Features organizes tips by number, durable and reusable, salon-grade. Store nail tips in an organized, easy-to-access way. Benefits include keeps nail tips neat, saves time during services, and professional and durable.',
  8.99,
  'nail-products',
  'stations-storage'
))

// Manicure & Pedicure Accessories
products.push(createProduct(
  'Manicure Bowls (5-finger well molded, Classic, or with Lid)',
  'Professional manicure bowls for soaking nails. 5-Finger Manicure Bowl features molded design with 5 finger wells, salon-grade, durable. Fill with water or soak solution, insert fingers for softening cuticles. Manicure Bowl with Lid features two-part design, professional-grade, easy to clean. Fill with soak solution, place fingers inside, and cover with lid for efficient softening. Classic Manicure Bowl features durable design, salon-grade, easy to use. Add soak solution, immerse fingers, soften cuticles. Benefits include convenient and efficient, maintains hygiene, smooths nails and cuticles, professional results, and easy to clean.',
  9.99,
  'nail-products',
  'manicure-pedicure-accessories'
))

products.push(createProduct(
  'Stainless Steel Pedicure Bowl',
  'High-quality pedicure bowl for professional use. Features durable stainless steel, easy to clean, salon-grade. Fill with warm water and soak feet during pedicure services. Benefits include hygienic, durable, and professional salon results.',
  24.99,
  'nail-products',
  'manicure-pedicure-accessories'
))

products.push(createProduct(
  'Pedicure Bowl Liners',
  'Disposable pedicure bowl liners for hygiene. Features single-use, fits standard pedicure bowls, salon-grade (quantity: 400 PC PER CASE). Line pedicure bowl before service, dispose after use. Benefits include maintains hygiene, easy cleanup, and safe for clients.',
  4.99,
  'nail-products',
  'manicure-pedicure-accessories'
))

products.push(createProduct(
  'Nail Brushes (Handle or Long Handle)',
  'Professional nail brushes for cleaning nails efficiently. Nail Brush with Handle features strong design, durable bristles, ergonomic handle, salon-grade. Scrub under nails or around cuticles gently with water. Nail Brush Long Handle features extended design, long handle for easy reach, salon-grade, durable bristles. Clean nails and cuticles with gentle strokes. Benefits include removes residue effectively, protects nails, efficient residue removal, ergonomic design, and professional results.',
  5.99,
  'nail-products',
  'manicure-pedicure-accessories'
))

products.push(createProduct(
  'Toe Separators',
  'Lightweight yet firm toe separators for pedicures. Features soft but durable material, salon and spa-grade, multi-use (quantity: 50 PC/PK). Place between toes during polish application for clean separation. Benefits include prevents smudging, comfortable for clients, and professional results.',
  3.99,
  'nail-products',
  'manicure-pedicure-accessories'
))

products.push(createProduct(
  'Nail Cap Clips',
  'Convenient nail cap clips for removing gel polish efficiently. Features durable plastic, salon-quality, multi-use (quantity: 10 PC/PK). Place nail wraps or cotton with remover under clip, leave 10–15 minutes, then remove gel polish. Benefits include speeds up removal, protects nails, and professional finish.',
  4.99,
  'nail-products',
  'manicure-pedicure-accessories'
))

products.push(createProduct(
  'Pump Bottles (2oz, 4oz, 8oz)',
  'Multi-size pump bottles for dispensing liquids efficiently. Features available in 8oz, 4oz, 2oz, durable and reusable, professional use. Fill with solution and pump for controlled dispensing. Benefits include reduces product waste, easy to use in salons, and professional presentation.',
  6.99,
  'nail-products',
  'manicure-pedicure-accessories'
))

products.push(createProduct(
  'Nail Forms',
  'Professional nail forms for shaping and extending nails. Features available in two forms, salon and professional-grade (quantity: 500 PC PE ROLL). Place under natural nails to sculpt extensions. Benefits include supports nail extensions, accurate shaping, and professional salon results.',
  7.99,
  'nail-products',
  'manicure-pedicure-accessories'
))

// Consumables & Disposables
products.push(createProduct(
  'Nail Wipes (High-Quality or Ultra-Fine)',
  'Professional nail wipes for manicure and pedicure prep. High-Quality Nail Wipes feature soft lint-free material, salon-grade, multi-use (quantity: 300 pc). Ultra-Fine Nail Wipes feature lint-free design, salon-grade, multi-use. Use to clean nails, remove residue, or prep nails before polish. Clean nails or remove polish for precise manicures and pedicures. Benefits include removes residue efficiently, protects nails, gentle on nails, leaves no residue, and professional salon results.',
  5.99,
  'nail-products',
  'consumables-disposables'
))

products.push(createProduct(
  'Ultra-Fine Makeup Wipes',
  'High-quality ultra-fine makeup wipes that foam when wet. Features dry-to-foam technology, gentle and effective, professional-grade. Wet the wipe to create foam, then cleanse the face or remove makeup. Benefits include efficient makeup removal, gentle on skin, and professional salon-grade results.',
  6.99,
  'nail-products',
  'consumables-disposables'
))

products.push(createProduct(
  'Makeup Cotton / Cotton Pads',
  'High-quality makeup cotton pads for touch-ups and professional makeup application. Makeup Cotton features soft and durable material, multi-use, professional-grade. Makeup Cotton Pads feature soft smooth texture, high-quality, salon-grade (quantity: 100 PC/PK). Use for makeup removal, touch-ups, or applying products. Apply or remove makeup gently without irritation. Benefits include gentle on skin, efficient product application, perfect for sensitive skin, and professional results.',
  4.99,
  'nail-products',
  'consumables-disposables'
))

products.push(createProduct(
  'Pedicure Slippers (Foam, Paper, & Terry)',
  'Comfortable pedicure slippers for salon and spa use. Features various types: foam, paper, terry, lightweight and durable, multi-color options. Wear during pedicure services to protect feet and maintain hygiene. Benefits include comfortable for clients, hygienic and disposable options, and professional spa experience.',
  3.99,
  'nail-products',
  'consumables-disposables'
))

// EQUIPMENT
// Facial Equipment
products.push(createProduct(
  'Ionic Facial Steamer',
  'Professional ionic facial steamer with ozone function for deep skin hydration and detox. Features adjustable height for client comfort, ozone function for antibacterial and cleansing effect, salon and spa-grade. Fill with water, adjust height, and steam the face for 8–15 minutes. Benefits include deeply hydrates and softens skin, opens pores for better treatment absorption, and professional spa results.',
  199.99,
  'equipment',
  'facial-equipment'
))

products.push(createProduct(
  'Portable Facial Steamer',
  'Compact facial steamer for table-top spa use. Features table-top design, lightweight and easy to handle, professional use. Steam face for 8–15 minutes to open pores and prep for treatments. Benefits include deep cleansing and hydration, improves absorption of serums and masks, and salon-quality results in a portable device.',
  149.99,
  'equipment',
  'facial-equipment'
))

products.push(createProduct(
  'Magnifying Lamp (3d or 5d)',
  'High-efficiency tabletop magnifying lamp with modifiable spring arm. Features optional mount, 3D or 5D magnification, adjustable and clamp-based. Clamp to table, adjust arm and magnification for detailed work. Benefits include enhances visibility for fine treatments, flexible positioning, and professional results.',
  89.99,
  'equipment',
  'facial-equipment'
))

products.push(createProduct(
  'Magnifying Lamp (3d or 5d) SMD',
  'SMD high-efficiency magnifying lamp for salons and spas. Features 3D or 5D magnification, SMD light for bright clear visibility, adjustable spring arm. Place over treatment area to view skin or nails with clarity. Benefits include bright even illumination, reduces eye strain, and ideal for precision work.',
  99.99,
  'equipment',
  'facial-equipment'
))

products.push(createProduct(
  '2-in-1 Portable Steamer',
  'Versatile table-top hair and facial steamer for spa and salon use. Features dual-use for hair and face, compact portable design, salon-grade efficiency. Place on table, fill with water, and use on hair or face as required. Benefits include space-saving and multi-functional, professional hydration and hair treatments, and portable for mobile services.',
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
  'Durable aluminium salon trolley for organized spa or salon services. Features adjustable tray top, multiple compartments, professional-grade lightweight aluminium. Organize tools, creams, and equipment on adjustable trays during services. Benefits include improves workflow and efficiency, keeps salon neat and professional, and easy access to tools.',
  249.99,
  'equipment',
  'salon-equipment'
))

products.push(createProduct(
  'Economical Hair Salon Trolley',
  'Affordable hair salon trolley with mobility and storage. Features 5 removable trays, smooth-rolling wheels, compact and lightweight. Organize hair tools, brushes, and products for easy access during services. Benefits include improves efficiency, easy to move around the salon, and budget-friendly professional equipment.',
  189.99,
  'equipment',
  'salon-equipment'
))

products.push(createProduct(
  'Salon/Spa Rolling Tray Trolley',
  'Professional rolling tray trolley with stainless steel stand for salons and spas. Features aluminium star base, mechanical timer built-in, sturdy and durable design. Store tools and equipment; roll around easily during services. Benefits include enhances salon efficiency, durable and professional, and timer function for precision treatments.',
  299.99,
  'equipment',
  'salon-equipment'
))

products.push(createProduct(
  'Metal and Glass Trolley',
  'Elegant metal and glass trolley ideal for professional spa use. Features glass shelves with metal frame, durable and stylish, multi-purpose storage. Store creams, tools, or equipment neatly during treatments. Benefits include sleek professional appearance, easy to clean and maintain, and organizes spa essentials efficiently.',
  349.99,
  'equipment',
  'salon-equipment'
))

// Equipment Accessories (Stands & Bulbs)
products.push(createProduct(
  'Magnifying Lamp Stand (4WH)',
  'Sturdy 4-wheel floor magnifying lamp stand for precision treatments. Features mobile 4-wheel base, adjustable height, professional spa-grade. Place under client area; use lamp for precise skin or nail treatments. Benefits include provides clear visibility, mobile and adjustable, and enhances precision and safety.',
  79.99,
  'equipment',
  'equipment-accessories'
))

products.push(createProduct(
  'Magnifying Lamp Stand (5WH)',
  'Professional 5-wheel floor magnifying lamp stand for salon services. Features sturdy 5-wheel base, adjustable arm and height, durable and mobile. Move around the treatment area and adjust height for precision work. Benefits include stable and easy to maneuver, enhances client treatment results, and ideal for facial or nail work.',
  89.99,
  'equipment',
  'equipment-accessories'
))

products.push(createProduct(
  'Magnifying Lamp Stand (Round)',
  'Heavy-duty round magnifying lamp stand for salon precision. Features stable round base, adjustable lamp arm, professional-grade. Use for detailed skin care, nail, or facial treatments. Benefits include strong and durable, precise lighting for accuracy, and mobile for salon convenience.',
  94.99,
  'equipment',
  'equipment-accessories'
))

products.push(createProduct(
  'Bulbs (T4, T5, T9, UV)',
  'High-quality replacement bulbs for magnifying lamps and UV equipment. Features available T4, T5, T9, and UV types, professional salon-grade, long-lasting performance. Install compatible lamps for optimal illumination and UV treatment. Benefits include bright and efficient lighting, supports professional treatment quality, and long lifespan.',
  12.99,
  'equipment',
  'equipment-accessories'
))

// IMPLEMENTS
// Hair Tools
products.push(createProduct(
  'Professional Barber Scissors',
  'Premium barber scissors with leather case for professionals. Features stainless steel, includes leather protective kit, sharp ergonomic blades. Use for precision hair cutting and styling in salon or barber settings. Benefits include sharp and precise, durable and hygienic, and protective leather case for safe storage.',
  49.99,
  'implements',
  'hair-tools'
))

products.push(createProduct(
  'Safety Scissors',
  'Durable safety scissors for salon and spa use. Features stainless steel, rounded tips for safety. Use for cutting towels, gauze, or disposable items safely. Benefits include prevents accidental cuts, long-lasting and hygienic, and professional quality.',
  12.99,
  'implements',
  'hair-tools'
))

// Scissors & Shears (Nail & Cuticle)
products.push(createProduct(
  'Cuticle Scissors (Curved or Straight)',
  'Professional cuticle scissors for precise cuticle trimming. Cuticle Scissors (Curved) features stainless steel curved blade, ergonomic design. Cuticle Scissors (Straight) features stainless steel, ergonomic handle. Trim excess cuticle and dead skin around nails carefully. Trim cuticles and dead skin with control. Benefits include precise trimming, durable and easy to clean, professional manicure tool, easy to sanitize and durable, accurate trimming, and salon-grade tool.',
  14.99,
  'implements',
  'scissors-shears'
))

products.push(createProduct(
  'Cuticle Cutter',
  'Professional cuticle cutter for efficient cuticle removal. Features stainless steel ergonomic design, sharp precision blade. Trim excess cuticle carefully for a clean nail bed. Benefits include reduces nail damage, durable and hygienic, and professional salon standard.',
  11.99,
  'implements',
  'scissors-shears'
))

products.push(createProduct(
  'Ingrown Nail Cutter',
  'Specialized ingrown nail cutter for safe and effective nail edge trimming. Features stainless steel precise tip, ergonomic design. Trim ingrown nail edges carefully to prevent discomfort. Benefits include reduces nail pain, professional and safe, and easy to sterilize.',
  16.99,
  'implements',
  'scissors-shears'
))

products.push(createProduct(
  'Toe-nail Cutter (Standard & Heavy)',
  'Professional toe-nail cutters for pedicure services. Toe-Nail Cutter features stainless steel sharp blade, ergonomic design. Toe-Nail Cutter (Heavy) features stainless steel robust design, comfortable grip. Trim toenails safely and efficiently. Trim thick toenails safely without splitting. Benefits include accurate cutting, durable and hygienic, professional-grade strength, durable and precise, ideal for salon pedicures, and suitable for tough nails.',
  9.99,
  'implements',
  'scissors-shears'
))

// Skin Tools (Tweezers & Extraction)
products.push(createProduct(
  'Tweezers (Full Range)',
  'Professional tweezers for salon, spa, and beauty applications. Flat Tip Tweezer features precision design, stainless steel, professional-quality durable. Slant Tip Tweezer features professional design, high-grade stainless steel, ergonomic design. Slant/Point Tweezer features versatile dual-purpose tip, stainless steel professional-grade. Waxing Tweezer features professional design, stainless steel, ergonomic durable design. Short Point Tweezer features precision design, stainless steel durable, compact and ergonomic. Extra Long Tip Tweezer features professional design, stainless steel, extended length for better reach. Use for picking, shaping, or applying small beauty elements. Use the angled tip for tweezing, shaping, and precision tasks. Use slant tip for brows; point tip for fine hair or detail work. Hold and place wax strips or remove stray hairs with control. Use for fine hair removal or precise detail work in small areas. Ideal for removing fine hairs or debris in detailed beauty tasks. Benefits include precise control and accuracy, long-lasting and hygienic, accurate and efficient, comfortable grip for long sessions, multi-functional, precise and easy to handle, improves waxing accuracy, hygienic and professional, accurate and easy to control, easy access to hard areas, durable hygienic and professional, and essential tool for beauty professionals.',
  8.99,
  'implements',
  'skin-tools'
))

products.push(createProduct(
  'Ingrown Hair Tweezers',
  'Specialized ingrown hair tweezers for safe removal of embedded hair. Ingrown Hair Tweezer features stainless steel sharp tip, professional-grade precise design. Ingrown Fine Hair Tweezer features stainless steel, fine sharp tip for accuracy. Lift and extract ingrown hairs gently without damaging the skin. Use on sensitive areas for removing fine or embedded hairs. Benefits include reduces irritation, professional hygienic design, minimizes skin trauma, hygienic and durable, essential for salons and spas, and salon-quality professional tool.',
  12.99,
  'implements',
  'skin-tools'
))

products.push(createProduct(
  'Eyelash Tweezers',
  'Professional eyelash tweezers for perfect lash application and shaping. Features stainless steel precise tip, ergonomic design for comfort. Use to apply or adjust individual lashes with control and accuracy. Benefits include ensures flawless lash application, durable and hygienic, and professional salon standard.',
  9.99,
  'implements',
  'skin-tools'
))

products.push(createProduct(
  'Ingrown Nail File',
  'Professional ingrown nail file for safe nail edge care. Features stainless steel, fine grit for precision filing. File nail edges carefully to prevent ingrown nails. Benefits include reduces discomfort, professional-grade durable, and easy to clean.',
  7.99,
  'implements',
  'skin-tools'
))

// Nail Pushers & Implements
products.push(createProduct(
  'Nail Pushers (Full Variety)',
  'Professional nail pushers for manicure and pedicure services. Flat/Arrow Nail Pusher features dual-purpose design, stainless steel reusable, ergonomic handle. Flat-Dual Ended Nail Pusher features versatile design, stainless steel, two functional ends: flat & angled. Pterygium/Round Nail Pusher features specialized design, stainless steel, rounded tip for safe cuticle management. Round Dual-Ended Nail Pusher features professional design, stainless steel durable, two rounded ends for multi-use. Round/Flat Ended Nail Pusher features salon-quality design, stainless steel, ergonomic professional design. Round Tip Pusher features precision design, stainless steel ergonomic, rounded tip for safe use. Use flat side for cuticle pushing, arrow tip for nail cleaning. Push back cuticles and clean nail beds efficiently. Gently push back cuticles and manage pterygium without injury. Use for pushing cuticles and cleaning nails gently. Use round end for cuticle work, flat end for nail cleaning. Push back cuticles and clean nail beds safely. Benefits include professional nail care, durable easy to clean, multi-functional and ergonomic, hygienic and durable, safe for sensitive nail areas, professional long-lasting tool, multi-functional professional, hygienic and durable, efficient nail care, long-lasting easy to sterilize, prevents cuticle damage, professional and durable, and suitable for professional use.',
  6.99,
  'implements',
  'nail-pushers-implements'
))

// Sterilization & Safety
products.push(createProduct(
  'Instrument Picker',
  'Precision instrument picker for salon and spa tools. Features stainless steel durable, ergonomic handle. Pick up small tools or accessories hygienically and safely. Benefits include reduces contamination, professional-grade and precise, and easy to sanitize.',
  4.99,
  'implements',
  'sterilization-safety'
))

products.push(createProduct(
  'Sterilization Boxes (IBA/IBF)',
  'Professional stainless steel sterilization boxes for keeping instruments clean and hygienic. Stainless Steel Sterilization Box IBA features dimensions 4" x 8", comes with lid, durable corrosion-resistant stainless steel, round bottom design. Stainless Steel Sterilization Box IBF features dimensions 4" x 8", flat bottom design, comes with lid, stainless steel construction. Place tools inside, cover with lid, and sterilize using autoclave or chemical solutions. Store tools inside and sterilize using autoclave or disinfectant. Benefits include maintains high hygiene standards, long-lasting and easy to clean, keeps instruments hygienic, flat base for stability, and professional-grade instrument storage.',
  24.99,
  'implements',
  'sterilization-safety'
))

products.push(createProduct(
  'Sterilization Trays',
  'Professional sterilization trays for organizing instruments. Sterilization Tray with Cover features versatile design, available in various sizes, stainless steel durable and hygienic, comes with secure cover. Sterilization Tray without Cover features practical open design, various sizes available, stainless steel easy to clean. Sterilization Plastic Tray features compact lightweight design, durable material, ideal for small instruments, easy to sanitize. Place instruments inside and sterilize using autoclave or disinfectant. Arrange instruments on the tray during procedures or before sterilization. Place instruments inside and clean with disinfectant or chemical sterilizer. Benefits include maintains instrument hygiene, covers prevent contamination, easy instrument access, durable and reusable, cost-effective and portable, maintains hygiene standards, and professional-grade storage.',
  18.99,
  'implements',
  'sterilization-safety'
))

products.push(createProduct(
  'Sterilization Jar',
  'Professional sterilization jar for liquid disinfectant or autoclave use. Features available in small and large sizes, durable high-quality material. Fill with disinfectant and submerge instruments for sterilization. Benefits include keeps instruments clean and safe, easy to handle and reusable, and suitable for salons and spas.',
  14.99,
  'implements',
  'sterilization-safety'
))

products.push(createProduct(
  'Stainless Steel Scaler Tray',
  'Professional scaler tray for organizing tools during treatments. Features size 4" x 8", stainless steel corrosion-resistant. Place instruments for easy access during procedures. Benefits include keeps instruments organized, durable and easy to sanitize, and professional salon quality.',
  19.99,
  'implements',
  'sterilization-safety'
))

products.push(createProduct(
  'Sharps Container (Small & Large)',
  'Safe and durable sharps container for professional salon or spa use. Features available in small and large sizes, durable plastic with secure lid (quantity: 3 LETTER). Dispose of sharp instruments safely to prevent injuries. Benefits include protects staff and clients, complies with safety standards, and reusable and hygienic.',
  12.99,
  'implements',
  'sterilization-safety'
))

// Disposables - Bowls
products.push(createProduct(
  'Stainless Steel Kidney Bowl',
  'Multi-purpose kidney-shaped bowl for professional salon and spa use. Features size 4" x 8", stainless steel easy to clean. Use for holding small instruments, liquids, or waste during procedures. Benefits include hygienic and reusable, lightweight and durable, and ideal for professional treatments.',
  16.99,
  'implements',
  'disposables',
  'bowls'
))

// Disposables - Medical & Treatment Disposables
products.push(createProduct(
  'Cotton Crepe Bandages',
  'Premium cotton crepe bandages for spa, salon, and therapeutic use. Features width: 9" | Length: 5m, soft flexible durable material. Wrap around treatment areas as needed for support or compresses. Benefits include provides comfort and support, breathable and skin-friendly, and professional-quality bandages.',
  8.99,
  'implements',
  'disposables',
  'medical-treatment-disposables'
))

products.push(createProduct(
  'Elastic Bandages',
  'Professional elastic bandages for support and treatment applications. Features width: 9" | Length: 5m, stretchable and durable design. Wrap around limbs or areas requiring compression or support. Benefits include flexible and comfortable, ideal for therapy or post-treatment care, and reusable and durable.',
  9.99,
  'implements',
  'disposables',
  'medical-treatment-disposables'
))

// FURNITURE
products.push(createProduct(
  'FMB2 FACIAL MASSAGE BED',
  'The FMB2 Facial Massage Bed offers professional comfort for facials, massages, and spa therapies. Available in white and black, designed for durability. Features adjustable backrest, high-density foam padding, strong steel frame. Place the bed on a flat surface, adjust the backrest, and cover with protective sheets. Use for facial massages, skincare treatments, or body therapies. Clean after each use. Benefits include ensures professional client support, enhances therapist efficiency, and durable and long-lasting for daily use.',
  599.99,
  'furniture',
  'facial-bed-multipurpose'
))

products.push(createProduct(
  'FACIAL MASSAGE BED WHITE / BLACK',
  'The Multipurpose Facial Bed is perfect for spa and salon professionals performing facials, massages, and skincare treatments. Its ergonomic design ensures comfort for both clients and therapists. Features adjustable backrest and height, sturdy professional frame, comfortable cushioned surface. Place the bed on a flat surface, adjust the backrest and height to suit the client\'s comfort, and cover with a towel or sheet. Ideal for facials, massages, or any spa treatment. Clean after each session. Benefits include provides ergonomic support for client comfort, improves therapist posture during treatments, and enhances treatment quality and efficiency.',
  649.99,
  'furniture',
  'facial-massage-bed'
))

products.push(createProduct(
  'PMB Portable Massage Bed',
  'The Portable Massage Bed is lightweight and foldable, perfect for mobile spa therapists or salons with limited space. Features foldable design, adjustable headrest, sturdy lightweight frame. Unfold the bed on a stable surface, adjust the headrest, and cover with a sheet. Ideal for facials or body treatments, then fold for storage. Benefits include portable and easy to store, professional comfort anywhere, and supports mobile or small-space salons.',
  299.99,
  'furniture',
  'portable-massage-bed'
))

products.push(createProduct(
  'BT-02 Wooden Trolley with 2 Draws',
  'The BT-02 Wooden Trolley keeps spa and salon tools organized. Two drawers provide ample storage for essentials. Features 2 storage drawers, smooth-rolling wheels, durable wooden frame. Place next to your workstation, store tools and products in drawers, and roll as needed. Wipe clean after use. Benefits include keeps tools organized and accessible, enhances workflow efficiency, and durable for daily salon use.',
  199.99,
  'furniture',
  'wooden-trolley'
))

products.push(createProduct(
  'BT-021 SPA SALON METAL TROLLEY',
  'A professional metal trolley designed for spa and salon use, with multiple trays for storing tools and products. Features multiple storage trays, smooth-rolling wheels, durable metal frame. Store spa essentials on trays, roll trolley gently between stations, and wipe clean after each session. Benefits include durable and long-lasting, mobile storage for spa and salon tools, and improves workspace organization.',
  249.99,
  'furniture',
  'spa-salon-metal-trolley'
))

products.push(createProduct(
  'BT-018 FACIAL BEAUTY SPA, SALON GLASS TROLLY WITH 4 SHELVES',
  'This Glass Trolley with four sturdy shelves offers modern and functional storage for spa and salon products. Features four tempered glass shelves, heavy-duty metal frame, smooth-rolling wheels. Arrange tools and products on shelves, roll as needed during treatments, and wipe clean regularly. Benefits include elegant modern design, easy access to products and tools, and efficient and organized storage solution.',
  349.99,
  'furniture',
  'facial-beauty-spa-salon-glass-trolly'
))

products.push(createProduct(
  'Salon Spa Color rolling Tray with accessories holder Cart',
  'A colorful rolling tray with an accessory holder, perfect for keeping spa tools and products organized during treatments. Features rolling design, integrated accessory holder, durable and lightweight. Place near your workstation, organize tools and products, roll as needed, and clean after use. Benefits include keeps essentials within reach, improves workflow efficiency, and adds color and style to your salon.',
  179.99,
  'furniture',
  'salon-spa-color-rolling-tray'
))

products.push(createProduct(
  'HST-11 MULTI USE SPA, SALON TROLY',
  'A versatile multi-use trolley with drawers and compartments for professional spa and salon organization. Features multi-use drawers and compartments, rolling wheels for mobility, durable design. Store spa tools and products, move trolley easily between stations, and wipe clean regularly. Benefits include improves salon efficiency, keeps tools organized, and supports professional service standards.',
  229.99,
  'furniture',
  'multi-use-spa-salon-trolly'
))

products.push(createProduct(
  'HST-35 #1 SELLER SALON TROLLY WITH DRAWS & ACCESSORIES HOLDER',
  'Top-selling HST-35 Trolley with drawers and accessory holders for ultimate spa and salon organization. Features multiple drawers and holders, smooth-rolling wheels, durable construction. Store tools and products in drawers and holders, roll between workstations, and clean regularly. Benefits include #1 organization solution, professional appearance and mobility, and enhances workflow efficiency.',
  279.99,
  'furniture',
  'seller-salon-trolly'
))

products.push(createProduct(
  'PMT Portable Manicure Table Folable Legs',
  'Compact and foldable manicure table ideal for mobile or professional nail services. Features foldable legs, smooth working surface, lightweight and portable. Unfold on a stable surface, cover with a towel or sheet, perform manicure services, then fold for storage. Benefits include portable and easy to store, professional manicure setup anywhere, and lightweight but durable.',
  199.99,
  'furniture',
  'portable-manicure-table'
))

products.push(createProduct(
  'BS-01 SPA - SALON ADJUSTABLE STOOL WHITE / BLACK',
  'Ergonomic adjustable stool for salon and spa professionals, available in white or black. Features height-adjustable design, padded seat, rolling casters. Adjust height to suit your working level, roll smoothly during treatments, and wipe clean after use. Benefits include ergonomic and mobile, supports long treatment sessions comfortably, and professional look for any salon.',
  89.99,
  'furniture',
  'spa-salon-adjustable-stool'
))

products.push(createProduct(
  'BS-02 SPA - SALON ADJUSTABLE STOOL WHITE / BLACK',
  'Ergonomic adjustable stool for salon and spa professionals, available in white or black. Features height-adjustable design, padded seat, rolling casters. Adjust height to suit your working level, roll smoothly during treatments, and wipe clean after use. Benefits include ergonomic and mobile, supports long treatment sessions comfortably, and professional look for any salon.',
  94.99,
  'furniture',
  'spa-salon-adjustable-stool'
))

products.push(createProduct(
  'MP-01 Pedicure Foot Rest',
  'Ergonomic pedicure footrest for maximum client comfort during foot treatments. Features adjustable height, comfortable padded surface, compact and salon-friendly. Place footrest in position, adjust height for client comfort, and use during pedicure services. Benefits include provides optimal client support, enhances pedicure comfort, and improves professional service quality.',
  79.99,
  'furniture',
  'pedicure-foot-rest'
))

// Sales & Offers Products
// Bed Sheets & Linens
products.push(createProduct(
  'Woven Bed Sheet Roll',
  'Disposable perforated bed sheet roll for professional spa and salon use. Features 50 sheets per roll, size: 31" x 72", available in 25, 30, 35 & 40 GSM. Tear along perforation and place on treatment bed. Benefits include hygienic single use, soft and durable, and easy to replace.',
  15.99,
  'spa-products',
  'spa-accessories',
  'towels-robes-linens'
))

products.push(createProduct(
  'Waterproof Nonwoven Bed Sheet Roll',
  'Water-resistant disposable bed sheet roll for high-moisture treatments. Features 50 sheets per roll, size: 31" x 72", waterproof backing. Unroll, tear, and cover treatment bed securely. Benefits include prevents liquid seepage, comfortable and protective, and ideal for facials and body treatments.',
  18.99,
  'spa-products',
  'spa-accessories',
  'towels-robes-linens'
))

products.push(createProduct(
  'Nonwoven Fitted Bed Sheet with Elastic',
  'Elastic-fitted disposable bed cover for secure placement. Features stretchable elastic edges, soft nonwoven material, single-use. Fit over treatment bed and adjust corners. Benefits include snug fit, prevents slipping, and maintains hygiene standards.',
  12.99,
  'spa-products',
  'spa-accessories',
  'towels-robes-linens'
))

// Disposables
products.push(createProduct(
  'Nonwoven Shower Gown',
  'Lightweight disposable gown for spa and body treatments. Features one size fits most, available in White & Blue, breathable nonwoven fabric. Wear during treatments for coverage and comfort. Benefits include comfortable fit, hygienic single use, and professional presentation.',
  3.99,
  'spa-products',
  'spa-accessories',
  'slippers-disposables'
))

products.push(createProduct(
  'Nonwoven Waxing Roll (3" x 100 Yards)',
  'Professional waxing roll for smooth hair removal. Features 3" width, 100 yards length, strong nonwoven material. Cut desired length and apply over waxed area. Benefits include strong grip, tear-resistant, and lint-free performance.',
  14.99,
  'spa-products',
  'treatment-products'
))

products.push(createProduct(
  'Disposable Panties (100 Pack)',
  'Disposable undergarments for spa and body treatments. Features 100 pieces per pack, white or blue, elastic waistband. Wear during body or laser treatments. Benefits include hygienic and comfortable, breathable material, and professional standard.',
  8.99,
  'spa-products',
  'spa-accessories',
  'slippers-disposables'
))

products.push(createProduct(
  'Disposable Shorts (10 Pack)',
  'Comfortable disposable shorts for treatment coverage. Features 10 pieces per pack, lightweight nonwoven fabric. Wear during waxing or body treatments. Benefits include easy to wear, provides coverage, and single-use hygiene.',
  4.99,
  'spa-products',
  'spa-accessories',
  'slippers-disposables'
))

products.push(createProduct(
  'Disposable Bra (10 Pack)',
  'Disposable bra for professional spa services. Features 10 pieces per pack, blue color, soft nonwoven material. Wear during massage or body treatments. Benefits include secure fit, comfortable coverage, and maintains hygiene.',
  5.99,
  'spa-products',
  'spa-accessories',
  'slippers-disposables'
))

products.push(createProduct(
  'Disposable Slippers (25 Pairs)',
  'Lightweight disposable slippers for salons and spas. Features 25 pairs per pack, slip-on design. Provide to clients before treatment. Benefits include maintains floor hygiene, comfortable fit, and professional appearance.',
  6.99,
  'spa-products',
  'spa-accessories',
  'slippers-disposables'
))

// Save categories and products
saveCategories(categories)
saveProducts(products)

console.log(`✅ Seeded ${categories.length} categories`)
console.log(`✅ Seeded ${products.length} products`)

