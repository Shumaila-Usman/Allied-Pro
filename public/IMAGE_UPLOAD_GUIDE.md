# Image Upload Guide

## 📁 Folder Structure

Place your images in the following locations:

```
public/
├── logo.png                    ← Image 1: Your ACBS logo
├── categories/
│   ├── equipment.jpg          ← Image 2: Equipment category
│   ├── furniture.jpg          ← Image 3: Furniture category
│   ├── implements.jpg         ← Image 4: Implements category
│   ├── nail-care.jpg          ← Image 5: Nail Care category
│   ├── skincare.jpg           ← Image 6: Skincare category
│   └── spa-products.jpg       ← Image 7: Spa Products category
└── brands/
    ├── brand-1.png            ← Image 8: First brand logo
    ├── brand-2.png            ← Image 9: Second brand logo
    ├── brand-3.png            ← Image 10: Third brand logo
    ├── brand-4.png            ← Image 11: Fourth brand logo
    ├── brand-5.png            ← Image 12: Fifth brand logo
    ├── brand-6.png            ← Image 13: Sixth brand logo
    ├── brand-7.png            ← Image 14: Seventh brand logo
    └── brand-8.png            ← Image 15: Eighth brand logo (if you have more)
```

## 📝 Image Requirements

### Logo
- **File**: `logo.png` (or `.jpg`, `.svg`)
- **Location**: `public/logo.png`
- **Recommended size**: 192px width × 64px height (or proportional)
- **Format**: PNG with transparent background preferred

### Category Images
- **Location**: `public/categories/`
- **Recommended size**: 800px × 600px (or similar aspect ratio)
- **Formats**: JPG, PNG, or WebP
- **File names must match exactly**:
  - `equipment.jpg`
  - `furniture.jpg`
  - `implements.jpg`
  - `nail-care.jpg`
  - `skincare.jpg`
  - `spa-products.jpg`

### Brand Logos
- **Location**: `public/brands/`
- **Recommended size**: 200px × 200px (square) or proportional
- **Formats**: PNG (transparent background) or JPG
- **File names**: `brand-1.png`, `brand-2.png`, etc.

## 🚀 After Uploading

1. Make sure all images are in the correct folders
2. The server will automatically reload
3. Refresh your browser to see the new images

## ⚠️ Important Notes

- File names are case-sensitive
- Supported formats: PNG, JPG, JPEG, SVG, WebP
- If an image is missing, a placeholder will be shown
- For best results, optimize images before uploading (use tools like TinyPNG)

