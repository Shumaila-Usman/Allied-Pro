'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import MainNav from '@/components/MainNav'
import Carousel from '@/components/Carousel'
import ProductSlider from '@/components/ProductSlider'
import BrandSlider from '@/components/BrandSlider'
import Footer from '@/components/Footer'
import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/types'

// Mock data
const heroSlides = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1920&q=80',
    title: 'Professional Beauty Products',
    subtitle: 'Elevate Your Business',
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1920&q=80',
    title: 'Spa Essentials',
    subtitle: 'Transform Your Space',
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=1920&q=80',
    title: 'Premium Equipment',
    subtitle: 'Built to Last',
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=1920&q=80',
    title: 'Expert Tools',
    subtitle: 'For Professionals',
  },
]

// Helper function to get category URL
function getCategoryUrl(categoryName: string): string {
  const categoryMap: Record<string, string> = {
    'Equipment': 'equipment',
    'Furniture': 'furniture',
    'Implements': 'implements',
    'Nail Care': 'nail-products',
    'Skincare': 'skincare',
    'Spa Essentials': 'spa-products',
  }
  const categoryId = categoryMap[categoryName] || ''
  return categoryId ? `/products?category=${categoryId}` : '/products'
}

const categories = [
  {
    id: '1',
    name: 'Equipment',
    description:
      'Upgrade your business with high-quality salon equipment and professional beauty tools you can trust. Our collection includes waxing kits, hair styling tools, and essential salon machines, designed for durability, performance, and reliable daily use to support smooth and efficient operations.',
    image: '/categories/equipment.jpg',
  },
  {
    id: '2',
    name: 'Furniture',
    description:
      'Create a workspace that blends luxury salon furniture with ergonomic comfort and modern design. Our salon chairs, styling stations, and treatment tables enhance client experience, workspace functionality, and salon aesthetics, helping your brand stand out professionally.',
    image: '/categories/furniture.jpg',
  },
  {
    id: '3',
    name: 'Implements',
    description:
      'Deliver precise results using professional salon implements built for accuracy, control, and ease of use. From premium tweezers and clippers to essential beauty grooming tools, our range ensures consistent performance and high-quality treatment results every time.',
    image: '/categories/implements.jpg',
  },
  {
    id: '4',
    name: 'Nail Care',
    description:
      'Achieve flawless results with our professional nail care products and manicure-pedicure essentials. Our solutions support nail strengthening, long-lasting polish results, and complete nail health, helping professionals and individuals maintain beautiful and durable nails with confidence.',
    image: '/categories/nail-care.jpg',
  },
  {
    id: '5',
    name: 'Skincare',
    description:
      'Reveal radiant beauty with our advanced skincare products and professional skin treatment solutions. Carefully selected formulas help improve skin hydration, protection, rejuvenation, and overall skin health, delivering visible and long-lasting skincare results.',
    image: '/categories/skincare.jpg',
  },
  {
    id: '6',
    name: 'Spa Essentials',
    description:
      'Transform any environment into a relaxing retreat with our luxury spa essentials and wellness accessories. From premium spa towels and aromatherapy fragrances to relaxation tools, our products help create a calming, refreshing, and stress-relieving spa experience.',
    image: '/categories/spa-products.jpg',
  },
]

const brands = [
  { id: '1', name: 'SILK B PROFESSIONAL', logo: '/brands/brand-1.png' },
  { id: '2', name: "MÔND'SUB", logo: '/brands/brand-2.png' },
  { id: '3', name: 'LA', logo: '/brands/brand-3.png' },
  { id: '4', name: 'XANITALIA', logo: '/brands/brand-4.png' },
  { id: '5', name: 'ROMA', logo: '/brands/brand-5.png' },
  { id: '6', name: 'BSC', logo: '/brands/brand-6.png' },
]

// Helper function to get category names for products
async function enrichProductsWithCategories(products: Product[]): Promise<Product[]> {
  try {
    const response = await fetch('/api/categories')
    const data = await response.json()
    const categories = data.categories || []
    
    // Create maps for ID/Slug to root category name
    const idToRootCategory = new Map<string, string>()
    const slugToRootCategory = new Map<string, string>()
    
    // Build a flat map of all categories with their root category
    const buildCategoryMaps = (cats: any[], rootCategoryName: string = '') => {
      for (const cat of cats) {
        const id = cat._id?.toString() || cat.id || ''
        const slug = cat.slug || ''
        const name = cat.name || ''
        
        // Determine root category name
        // If this is a root category (level 0), use its name as root
        // Otherwise, use the passed rootCategoryName
        const rootName = (cat.level === 0 || !rootCategoryName) ? name : rootCategoryName
        
        // Map this category to its root
        if (id) {
          idToRootCategory.set(id, rootName)
        }
        if (slug) {
          slugToRootCategory.set(slug, rootName)
        }
        
        // Process subcategories
        if (cat.subcategories && cat.subcategories.length > 0) {
          // For subcategories, the root is the parent category name
          const subRoot = rootName || name
          for (const subcat of cat.subcategories) {
            const subId = subcat._id?.toString() || subcat.id || ''
            const subSlug = subcat.slug || ''
            
            if (subId) {
              idToRootCategory.set(subId, subRoot)
            }
            if (subSlug) {
              slugToRootCategory.set(subSlug, subRoot)
            }
            
            // Process second subcategories (they also map to the same root)
            if (subcat.secondSubcategories && subcat.secondSubcategories.length > 0) {
              for (const secondSub of subcat.secondSubcategories) {
                const secondSubId = secondSub._id?.toString() || secondSub.id || ''
                const secondSubSlug = secondSub.slug || ''
                
                if (secondSubId) {
                  idToRootCategory.set(secondSubId, subRoot)
                }
                if (secondSubSlug) {
                  slugToRootCategory.set(secondSubSlug, subRoot)
                }
              }
            }
          }
          // Recursively process nested subcategories
          buildCategoryMaps(cat.subcategories, subRoot)
        }
      }
    }
    
    buildCategoryMaps(categories)
    
    // Fallback slug map for root categories
    const slugMap: Record<string, string> = {
      'skincare': 'Skincare',
      'nail-products': 'Nail Products',
      'spa-products': 'Spa Products',
      'equipment': 'Equipment',
      'implements': 'Implements',
      'furniture': 'Furniture'
    }
    
    // Enrich products with category names
    return products.map(product => {
      const categoryId = product.categoryId || ''
      
      // Try to find root category by ID first
      let categoryName = idToRootCategory.get(categoryId)
      
      // If not found, try by slug
      if (!categoryName) {
        categoryName = slugToRootCategory.get(categoryId)
      }
      
      // If still not found, try slug map
      if (!categoryName) {
        categoryName = slugMap[categoryId]
      }
      
      // If still not found, try case-insensitive slug match
      if (!categoryName) {
        for (const [slug, name] of Array.from(slugToRootCategory.entries())) {
          if (slug.toLowerCase() === categoryId.toLowerCase()) {
            categoryName = name
            break
          }
        }
      }
      
      // If still not found, try partial match (e.g., "skincare-by-category" -> "Skincare")
      if (!categoryName) {
        for (const [slug, name] of Array.from(slugToRootCategory.entries())) {
          if (categoryId.toLowerCase().includes(slug.toLowerCase()) || slug.toLowerCase().includes(categoryId.toLowerCase())) {
            categoryName = name
            break
          }
        }
      }
      
      // Final fallback: return empty string to hide category if not found
      return { ...product, category: categoryName || '' }
    })
  } catch (error) {
    console.error('Error enriching products with categories:', error)
    return products
  }
}

// Best Sellers Component
function BestSellersSlider() {
  const [bestSellersProducts, setBestSellersProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        // Fetch products from skincare, nail-products, and spa-products categories
        const categories = ['skincare', 'nail-products', 'spa-products']
        const allProducts: Product[] = []
        
        for (const category of categories) {
          try {
            const response = await fetch(`/api/products?categoryId=${category}&limit=10&page=1`)
            const data = await response.json()
            if (data.products && data.products.length > 0) {
              allProducts.push(...data.products.slice(0, 4))
            }
          } catch (error) {
            console.error(`Error fetching products for ${category}:`, error)
          }
        }
        
        // Shuffle and take up to 12 products
        const shuffled = allProducts.sort(() => 0.5 - Math.random())
        const selectedProducts = shuffled.slice(0, 12)
        
        // Enrich with category names
        const productsWithCategories = await enrichProductsWithCategories(selectedProducts)
        setBestSellersProducts(productsWithCategories)
      } catch (error) {
        console.error('Error fetching best sellers:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBestSellers()
  }, [])

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#87CEEB]"></div>
        <p className="mt-4 text-gray-600">Loading products...</p>
      </div>
    )
  }

  if (bestSellersProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No products available</p>
      </div>
    )
  }

  return <ProductSlider products={bestSellersProducts} title="" />
}

export default function Home() {
  const [topPadding, setTopPadding] = useState(176) // Default padding
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loadingProducts, setLoadingProducts] = useState(true)

  useEffect(() => {
    document.title = 'Allied Concept Beauty Supplies'
  }, [])

  useEffect(() => {
    const calculatePadding = () => {
      const header = document.getElementById('main-header')
      const nav = document.getElementById('main-nav')
      if (header && nav) {
        const totalHeight = header.offsetHeight + nav.offsetHeight
        setTopPadding(totalHeight)
      }
    }

    calculatePadding()
    window.addEventListener('resize', calculatePadding)
    // Also recalculate after a short delay to ensure elements are rendered
    setTimeout(calculatePadding, 100)

    return () => {
      window.removeEventListener('resize', calculatePadding)
    }
  }, [])

  // Fetch featured products from database
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch('/api/products?limit=10&page=1')
        const data = await response.json()
        if (data.products && data.products.length > 0) {
          // Add category names to products
          const productsWithCategories = await enrichProductsWithCategories(data.products.slice(0, 10))
          setFeaturedProducts(productsWithCategories)
        }
      } catch (error) {
        console.error('Error fetching featured products:', error)
      } finally {
        setLoadingProducts(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden max-w-full">
      <Header />
      <MainNav />

      {/* Hero Section - Add padding to account for fixed header and nav */}
      <section className="w-full" style={{ paddingTop: `${topPadding}px` }}>
        <Carousel slides={heroSlides} />
      </section>

      {/* Promo Cards Section */}
      <section className="w-full bg-white py-12 md:py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Sale Card */}
            <div className="relative h-72 md:h-80 rounded-2xl overflow-hidden shadow-xl group cursor-pointer hover:shadow-2xl transition-shadow duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-[#87CEEB] to-[#C8A2C8] flex items-center justify-center">
                <div className="text-center text-white px-6 w-full">
                  <h3 className="text-5xl md:text-6xl font-bold mb-2">EXTRA 20% OFF</h3>
                  <p className="text-2xl md:text-3xl font-semibold mb-4">SALE ITEMS</p>
                  <p className="text-base md:text-lg mb-6 opacity-90">Use code: BONUS20</p>
                  <button className="bg-white text-[#8B6FA8] px-10 py-3.5 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-xl hover:scale-105">
                    Shop Sale
                  </button>
                </div>
              </div>
            </div>
            
            {/* Featured Brands Card */}
            <div className="relative h-72 md:h-80 rounded-2xl overflow-hidden shadow-xl group cursor-pointer hover:shadow-2xl transition-shadow duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] flex items-center justify-center">
                <div className="text-center text-white px-6 w-full">
                  <span className="inline-block bg-white/30 backdrop-blur-md text-white text-sm font-bold px-5 py-2 rounded-full mb-5 border border-white/20">
                    NEW ARRIVALS
                  </span>
                  <h3 className="text-5xl md:text-6xl font-bold mb-3">Featured Brands</h3>
                  <p className="text-lg md:text-xl mb-6 opacity-90">Discover the latest in beauty & spa</p>
                  <button className="bg-white text-[#8B6FA8] px-10 py-3.5 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-xl hover:scale-105">
                    Explore Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Highlight Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] bg-clip-text text-transparent">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={getCategoryUrl(category.name)}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 group cursor-pointer block"
            >
              <div className="relative h-48 bg-gray-100">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{category.name}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{category.description}</p>
                <span className="mt-4 inline-block text-primary-500 font-semibold hover:text-primary-600 transition-colors duration-300">
                  Shop {category.name} →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Serving Beauty Businesses Section */}
      <section className="w-full py-12 md:py-16 bg-gradient-to-br from-purple-50 to-blue-50 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-purple-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-300 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
            {/* Left Column - Content */}
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] bg-clip-text text-transparent">
                SERVING BEAUTY BUSINESSES ACROSS CANADA
              </h2>
              <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed">
                Allied Concept of Beauty Supply supports beauty professionals and wellness businesses nationwide by offering premium wholesale product solutions. From salons seeking to buy salon supplies online to clinics sourcing spa equipment for salons, we provide reliable supply solutions tailored to industry needs.
              </p>
            </div>

            {/* Right Column - Icon Points */}
            <div className="flex-1 grid grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {/* Professional Grade */}
              <div className="bg-white rounded-lg p-4 sm:p-6 shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-[#C8A2C8] to-[#87CEEB] rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-gray-900">Professional Grade</h3>
              </div>

              {/* Bulk Pricing Advantage */}
              <div className="bg-white rounded-lg p-4 sm:p-6 shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-[#87CEEB] to-[#C8A2C8] rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-gray-900">Bulk Pricing Advantage</h3>
              </div>

              {/* Reliable Supply - Delivery Truck */}
              <div className="bg-white rounded-lg p-4 sm:p-6 shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-[#C8A2C8] to-[#87CEEB] rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                  </svg>
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-gray-900">Reliable Supply</h3>
              </div>

              {/* Coast-Coast Shipping - Maple Leaf */}
              <div className="bg-white rounded-lg p-4 sm:p-6 shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-[#87CEEB] to-[#C8A2C8] rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.41 16.09V20h2.82v-1.91c-.94.54-2.1.88-3.41.88s-2.47-.34-3.41-.88L7.5 18.5c1.2.6 2.64.95 4.09.95s2.89-.35 4.09-.95l-1.09-1.91c-.94.54-2.1.88-3.41.88zm-3.41-2.09l1.09-1.91c.94.54 2.1.88 3.41.88s2.47-.34 3.41-.88l1.09 1.91c-1.2.6-2.64.95-4.09.95s-2.89-.35-4.09-.95zm7.82-2.09l1.09-1.91c.94.54 2.1.88 3.41.88s2.47-.34 3.41-.88l1.09 1.91c-1.2.6-2.64.95-4.09.95s-2.89-.35-4.09-.95z"/>
                  </svg>
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-gray-900">Coast-Coast Shipping</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers & Professional Favorites Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="text-left md:text-center mb-8">
          {/* Mobile heading with line breaks */}
          <h2 className="md:hidden text-2xl font-bold mb-4 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] bg-clip-text text-transparent">
            BEST SELLERS &<br />
            PROFESSIONAL FAVORITES
          </h2>
          {/* Desktop heading without line breaks */}
          <h2 className="hidden md:block text-3xl font-bold mb-4 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] bg-clip-text text-transparent">
            BEST SELLERS & PROFESSIONAL FAVORITES
          </h2>
          {/* Mobile description with line breaks */}
          <p className="md:hidden text-gray-600 text-base">
            Discover our top-selling products frequently<br />
            ordered by Canadian beauty businesses<br />
            including
          </p>
          {/* Desktop description without line breaks */}
          <p className="hidden md:block text-gray-600 text-lg max-w-3xl mx-auto">
            Discover our top-selling products frequently ordered by Canadian beauty businesses including
          </p>
        </div>
        <BestSellersSlider />
      </section>

      {/* Brands Section */}
      <section className="w-full py-12">
        <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] bg-clip-text text-transparent">Our Brands</h2>
        <BrandSlider brands={brands} />
      </section>

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {loadingProducts ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#87CEEB]"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        ) : featuredProducts.length > 0 ? (
          <ProductSlider products={featuredProducts} title="Must Haves" />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No featured products available</p>
          </div>
        )}
      </section>

      {/* Fast & Reliable Supply Section */}
      <section className="w-full py-12 md:py-16 bg-gradient-to-br from-purple-50 to-blue-50 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-purple-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-300 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-12 text-center bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] bg-clip-text text-transparent">
            FAST & RELIABLE SUPPLY ACROSS CANADA
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Secure Packaging */}
            <div className="bg-white rounded-lg p-6 sm:p-8 shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-gradient-to-br from-[#C8A2C8] to-[#87CEEB] rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Secure Packaging</h3>
            </div>

            {/* Quick Order Processing */}
            <div className="bg-white rounded-lg p-6 sm:p-8 shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-gradient-to-br from-[#87CEEB] to-[#C8A2C8] rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Quick Order Processing</h3>
            </div>

            {/* Nationwide Delivery */}
            <div className="bg-white rounded-lg p-6 sm:p-8 shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-gradient-to-br from-[#C8A2C8] to-[#87CEEB] rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Nationwide Delivery</h3>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

