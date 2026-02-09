# ACBS - B2B Beauty & Spa E-Commerce

A modern, responsive B2B beauty and spa e-commerce website built with Next.js 14 (App Router) and Tailwind CSS, inspired by Sephora.com.

## Features

- 🎨 **Modern Design**: Sephora-inspired UI with gradient branding
- 👥 **Role-Based Access**: Different UI for Normal Users and Dealers
- 📱 **Fully Responsive**: Optimized for desktop and mobile devices
- 🛍️ **E-Commerce Ready**: Product cards, cart, wishlist functionality
- 🎯 **Mega Menus**: Rich navigation with category dropdowns
- 🎠 **Interactive Carousels**: Hero section and product sliders
- ♾️ **Infinite Scroll**: Auto-scrolling brand showcase

## User Roles

### Normal User
- ❌ No prices visible
- ❌ No add to cart
- ❌ No wishlist icon
- ✅ Can view products and categories
- ✅ Can read descriptions

### Dealer
- ✅ Prices visible
- ✅ Cart enabled
- ✅ Wishlist enabled
- ✅ Dealer Portal accessible
- ✅ Full e-commerce functionality

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
acbs/
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.tsx            # Root layout with AuthProvider
│   └── page.tsx              # Home page
├── components/
│   ├── Header/               # Header components
│   ├── MainNav/              # Navigation with mega menus
│   ├── Carousel/             # Hero carousel
│   ├── ProductCard/          # Product card component
│   ├── ProductSlider/        # Product slider
│   ├── BrandSlider/          # Infinite brand scroll
│   ├── Footer/               # Footer component
│   └── LoginModal/           # Login modal
├── contexts/
│   └── AuthContext.tsx       # Authentication context
├── types/
│   └── index.ts              # TypeScript types
└── package.json
```

## Testing User Roles

### Login as Normal User
1. Click on any "Login" button
2. Enter an email (e.g., `user@example.com`)
3. Leave "I am a dealer" unchecked
4. Click "Sign In"

### Login as Dealer
1. Click on any "Login" button
2. Enter an email (e.g., `dealer@example.com`)
3. Check "I am a dealer"
4. Enter a Dealer ID (e.g., `DEALER123`)
5. Click "Sign In"

The UI will automatically update based on the user role.

## Key Components

### Header
- Top bar with promotional message
- Middle bar with logo, search, and icons
- Hover dropdowns for wishlist/cart (when logged out)
- User dropdown with account options

### Main Navigation
- Black navigation bar
- Mega dropdown menus on hover
- Mobile hamburger menu

### Hero Section
- Full-width carousel with 4 slides
- Auto-play with manual controls
- Smooth fade transitions

### Product Cards
- Role-based pricing display
- Image hover effects
- Add to cart (dealers only)

## Technologies

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Animations (optional)
- **React Context** - State management

## Customization

### Branding Colors
Edit `tailwind.config.ts` to customize the gradient colors:
```typescript
backgroundImage: {
  'gradient-primary': 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
}
```

### Logo
Replace the placeholder logo in `components/Header/MiddleBar.tsx` with your actual logo image.

## License

This project is proprietary and confidential.


