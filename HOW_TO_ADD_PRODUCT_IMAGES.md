# 📸 How to Add Images to Products

Your products are stored in the database, and you need to add images to them. Here's how:

## Method 1: Using the API (Recommended for individual products)

### Step 1: Upload Image Files
1. Place your product images in the `public/products/` folder
2. Name them descriptively (e.g., `product-name-1.jpg`, `product-name-2.jpg`)

### Step 2: Update Product via API

You can update a product's images using the API endpoint:

**Endpoint:** `PUT /api/products/[productId]`

**Example using curl:**
```bash
curl -X PUT http://localhost:3000/api/products/YOUR_PRODUCT_ID \
  -H "Content-Type: application/json" \
  -d '{
    "images": ["/products/product-1.jpg", "/products/product-1-2.jpg"]
  }'
```

**Example using JavaScript (in browser console or script):**
```javascript
const productId = 'YOUR_PRODUCT_ID'
const images = ['/products/product-1.jpg', '/products/product-1-2.jpg']

fetch(`/api/products/${productId}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ images })
})
  .then(res => res.json())
  .then(data => console.log('Updated:', data))
  .catch(err => console.error('Error:', err))
```

## Method 2: Using the Script (Recommended for bulk updates)

### Step 1: Upload Image Files
1. Place all your product images in the `public/products/` folder
2. Note the file names

### Step 2: Get Product IDs
You can get product IDs by:
- Checking your database
- Using the API: `GET /api/products` or `GET /api/admin/products`
- Looking at the product URLs in your app

### Step 3: Update the Script
1. Open `scripts/add-product-images.ts`
2. Update the `productImageMap` object with your product IDs and image paths:

```typescript
const productImageMap: Record<string, string[]> = {
  'product-id-1': ['/products/product-1-1.jpg', '/products/product-1-2.jpg'],
  'product-id-2': ['/products/product-2-1.jpg'],
  'product-id-3': ['/products/product-3-1.jpg', '/products/product-3-2.jpg'],
  // Add more products...
}
```

### Step 4: Run the Script
```bash
npx tsx scripts/add-product-images.ts
```

## Method 3: Direct Database Update (Advanced)

If you have direct access to MongoDB:

```javascript
// Connect to MongoDB
use your-database-name

// Update a single product
db.products.updateOne(
  { _id: ObjectId("YOUR_PRODUCT_ID") },
  { $set: { images: ["/products/product-1.jpg", "/products/product-1-2.jpg"] } }
)

// Update multiple products
db.products.updateMany(
  { name: "Product Name" },
  { $set: { images: ["/products/product-1.jpg"] } }
)
```

## Image Path Format

Images should be referenced as:
- **Full path**: `/products/image-name.jpg` (recommended)
- **Relative path**: `image-name.jpg` (if in public/products/)

The ProductCard component will:
- Show the first image by default
- Show the second image on hover (if available)
- Fall back to `/products/placeholder.jpg` if image fails to load

## Image Requirements

- **Location**: `public/products/` folder
- **Formats**: JPG, PNG, WebP
- **Recommended size**: 400px × 400px (square) or larger
- **Naming**: Use descriptive names (e.g., `product-name-1.jpg`)

## Tips

1. **Multiple images**: You can add multiple images per product. The first one is shown by default, the second appears on hover.

2. **Image naming convention**: Consider using a consistent naming pattern:
   - `{product-id}-1.jpg` for main image
   - `{product-id}-2.jpg` for hover image
   - Or use product SKU: `{sku}-1.jpg`

3. **Bulk operations**: If you have many products, use Method 2 (the script) for efficiency.

4. **Verify images**: After adding images, check that they display correctly in the ProductCard component.

## Troubleshooting

- **Images not showing?** 
  - Check that files are in `public/products/` folder
  - Verify the path in the database matches the file name
  - Check browser console for 404 errors

- **Script errors?**
  - Make sure MongoDB is running
  - Verify product IDs are correct
  - Check that image paths are correct

- **API errors?**
  - Ensure the product ID is valid
  - Check that the request body is properly formatted
  - Verify the server is running




