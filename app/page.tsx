'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import MainNav from '@/components/MainNav'
import Carousel from '@/components/Carousel'
import ProductSlider from '@/components/ProductSlider'
import Footer from '@/components/Footer'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Product } from '@/types'

// Hero banner images - Only 3 banners (removed banner-1)
const heroSlides = [
  {
    id: '2',
    image: '/banners/banner-2.jpg',
    title: '',
    subtitle: '',
  },
  {
    id: '3',
    image: '/banners/banner-3.jpg',
    title: '',
    subtitle: '',
    objectPosition: 'center 20%',
  },
  {
    id: '4',
    image: '/banners/banner-4.jpg',
    title: '',
    subtitle: '',
    objectPosition: 'center 50%',
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
    const idToCategory = new Map<string, any>() // Store full category objects
    
    // First, build a map of all categories by ID
    const buildCategoryMap = (cats: any[]) => {
      for (const cat of cats) {
        const id = cat._id?.toString() || cat.id || ''
        if (id) {
          idToCategory.set(id, cat)
        }
        if (cat.subcategories && cat.subcategories.length > 0) {
          buildCategoryMap(cat.subcategories)
        }
      }
    }
    buildCategoryMap(categories)
    
    // Helper function to find root category name by traversing up the tree
    const findRootCategoryName = (categoryId: string): string | null => {
      const category = idToCategory.get(categoryId)
      if (!category) return null
      
      // If this is a root category (level 0), return its name
      if (category.level === 0) {
        return category.name
      }
      
      // Otherwise, traverse up to find root
      let current = category
      while (current) {
        if (current.level === 0) {
          return current.name
        }
        // Try to find parent
        if (current.parent) {
          const parentId = typeof current.parent === 'string' ? current.parent : current.parent._id?.toString() || current.parent.toString()
          current = idToCategory.get(parentId)
          if (!current) break
        } else {
          break
        }
      }
      
      return null
    }
    
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
          // Also try to find root by traversing up
          const foundRoot = findRootCategoryName(id)
          if (foundRoot) {
            idToRootCategory.set(id, foundRoot)
          }
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
              // Also try to find root by traversing up
              const foundRoot = findRootCategoryName(subId)
              if (foundRoot) {
                idToRootCategory.set(subId, foundRoot)
              }
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
                  // Also try to find root by traversing up
                  const foundRoot = findRootCategoryName(secondSubId)
                  if (foundRoot) {
                    idToRootCategory.set(secondSubId, foundRoot)
                  }
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
      'skincare': 'SKINCARE',
      'nail-products': 'NAIL PRODUCTS',
      'spa-products': 'SPA PRODUCTS',
      'equipment': 'EQUIPMENT',
      'implements': 'IMPLEMENTS',
      'furniture': 'FURNITURE'
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
        // Specific products for BEST SELLERS & PROFESSIONAL FAVORITES
        const productNames = [
          'Makeup Cotton / Cotton Pads',
          'Paraffin Heater',
          'Hot Stone Heater (18q / 6q)',
          'Compressed Dry Sheet Masks',
          'Golden Firming Gel Mask (30ml/500ml)',
          'Jade Roller / Gua Sha (Anti-Aging)',
          'Under-Eye Press / Disc (Electric Jade)',
          'Salon/Spa Rolling Tray Trolley'
        ]
        
        // Fetch all products and filter by name
        const response = await fetch('/api/products?limit=1000&page=1')
        const data = await response.json()
        
        if (data.products && data.products.length > 0) {
          // Filter products by exact name match
          const filteredProducts = data.products.filter((product: Product) => 
            productNames.some(name => product.name === name)
          )
          
          // Sort to match the order specified
          const sortedProducts = productNames
            .map(name => filteredProducts.find((p: Product) => p.name === name))
            .filter((p): p is Product => p !== undefined)
          
          // Manually set categories for specific products
          const productsWithCategories = sortedProducts.map(product => {
            // Manually assign categories based on product names
            let category = ''
            if (product.name === 'Makeup Cotton / Cotton Pads') {
              category = 'NAIL PRODUCTS'
            } else if (product.name === 'Paraffin Heater' || product.name === 'Hot Stone Heater (18q / 6q)') {
              category = 'SPA PRODUCTS'
            } else if (product.name === 'Compressed Dry Sheet Masks' || 
                       product.name === 'Golden Firming Gel Mask (30ml/500ml)' ||
                       product.name === 'Jade Roller / Gua Sha (Anti-Aging)' ||
                       product.name === 'Under-Eye Press / Disc (Electric Jade)') {
              category = 'SKINCARE'
            } else if (product.name === 'Salon/Spa Rolling Tray Trolley') {
              category = 'EQUIPMENT'
            }
            
            return { ...product, category }
          })
          
          setBestSellersProducts(productsWithCategories)
        }
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

  return <ProductSlider products={bestSellersProducts} title="" externalNavContainerId="best-sellers-nav" />
}

export default function Home() {
  const router = useRouter()
  const { isLoggedIn } = useAuth()
  const [topPadding, setTopPadding] = useState(176) // Default padding
  const [isMobile, setIsMobile] = useState(false)
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    document.title = 'Allied Concept Beauty Supplies'
  }, [])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    // Check immediately
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const calculatePadding = () => {
      const header = document.getElementById('main-header')
      const nav = document.getElementById('main-nav')
      const isMobile = window.innerWidth < 768 // md breakpoint
      
      if (header && nav) {
        // Get actual heights, accounting for when header might be hidden
        const headerHeight = header.offsetHeight > 0 ? header.offsetHeight : header.scrollHeight
        const navHeight = nav.offsetHeight
        
        // On mobile, nav is not fixed, so only account for header
        // On desktop, account for both header and nav
        const totalHeight = isMobile ? headerHeight : headerHeight + navHeight
        // Add extra padding to ensure content is not hidden
        setTopPadding(totalHeight + (isMobile ? 10 : 30))
      } else {
        // Fallback padding if elements not found
        setTopPadding(isMobile ? 100 : 220)
      }
    }

    // Calculate immediately
    calculatePadding()
    
    // Recalculate after a short delay to ensure DOM is ready
    const timeout1 = setTimeout(calculatePadding, 100)
    const timeout2 = setTimeout(calculatePadding, 500)
    
    window.addEventListener('resize', calculatePadding)
    window.addEventListener('scroll', calculatePadding)

    return () => {
      clearTimeout(timeout1)
      clearTimeout(timeout2)
      window.removeEventListener('resize', calculatePadding)
      window.removeEventListener('scroll', calculatePadding)
    }
  }, [])

  // Fetch featured products from database (Salon Must-Haves)
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        // Specific products for SALONS MUST HAVES
        const productNames = [
          'Mixing Bowl Set',
          'Disposable Headbands',
          'PMT Portable Manicure Table Folable Legs',
          'Cellulose Sponge',
          'SilkRoma Depilatory Cream Wax',
          'Pumice Stone with Brush',
          'Gua Sha Stone (Dolphin)',
          'Makeup Cotton / Cotton Pads'
        ]
        
        // Fetch all products and filter by name
        const response = await fetch('/api/products?limit=1000&page=1')
        const data = await response.json()
        
        if (data.products && data.products.length > 0) {
          // Filter products by exact name match
          const filteredProducts = data.products.filter((product: Product) => 
            productNames.some(name => product.name === name)
          )
          
          // Sort to match the order specified
          const sortedProducts = productNames
            .map(name => filteredProducts.find((p: Product) => p.name === name))
            .filter((p): p is Product => p !== undefined)
          
          // Manually set categories for specific products
          const productsWithCategories = sortedProducts.map(product => {
            // Manually assign categories based on product names
            let category = ''
            if (product.name === 'Mixing Bowl Set' || product.name === 'Disposable Headbands') {
              category = 'SKINCARE'
            } else if (product.name === 'PMT Portable Manicure Table Folable Legs') {
              category = 'FURNITURE'
            } else if (product.name === 'Cellulose Sponge') {
              category = 'SKINCARE'
            } else if (product.name === 'SilkRoma Depilatory Cream Wax') {
              category = 'SPA PRODUCTS'
            } else if (product.name === 'Pumice Stone with Brush') {
              category = 'NAIL PRODUCTS'
            } else if (product.name === 'Gua Sha Stone (Dolphin)') {
              category = 'SKINCARE'
            }
            
            return { ...product, category }
          })
          
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
      <section className="w-full px-2 sm:px-4 md:px-6 lg:px-8" style={{ paddingTop: `${topPadding}px` }}>
        <Carousel slides={heroSlides} />
      </section>

      {/* Promo Cards Section */}
      <section className="w-full bg-white py-12 md:py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* SILK-B Professional Special Sale Event Card */}
            <Link href="/sales-offers" className="group block h-full">
              <div className="relative rounded-[8px] overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 bg-white h-full flex flex-col">
                {/* Image Section - Top 2/3 */}
                <div className="relative h-64 md:h-80 flex-shrink-0 overflow-hidden bg-gradient-to-br from-purple-200 via-pink-200 to-blue-200">
                  <Image
                    src="/promo/silk-b-sale.jpg"
                    alt="SILK-B Professional Special Sale Event"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300 relative z-10"
                    style={{ objectPosition: isMobile ? 'center 70%' : 'center 50%' }}
                    priority
                    unoptimized
                  />
                </div>
                {/* Text Section - Bottom 1/3 with Sky Blue background */}
                <div className="bg-[#87CEEB] px-6 py-6 md:py-8 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 md:mb-3">
                      SILK B Professionals<br />
                      Special Sale Event
                    </h3>
                    <p className="text-white text-base md:text-lg mb-4 md:mb-5 opacity-95">
                      Premium Products and Spa Essentials Now on Sale
                    </p>
                  </div>
                  <span className="inline-block bg-white text-[#87CEEB] px-6 py-3 rounded-[30px] font-semibold text-base md:text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:scale-105 w-fit">
                    Stock Up and Save
                  </span>
                </div>
              </div>
            </Link>
            
            {/* Featured Brands Card */}
            <Link href="#our-brands" className="group block h-full">
              <div className="relative rounded-[8px] overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 bg-white h-full flex flex-col">
                {/* Image Section - Top 2/3 */}
                <div className="relative h-64 md:h-80 flex-shrink-0 overflow-hidden bg-gradient-to-br from-purple-200 via-pink-200 to-blue-200">
                  <Image
                    src="/promo/discover-beauty-brands.jpg"
                    alt="Featured Brands"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300 relative z-10"
                    style={{ objectPosition: isMobile ? 'center 70%' : 'center 50%' }}
                    priority
                    unoptimized
                  />
                </div>
                {/* Text Section - Bottom 1/3 with Lilac background */}
                <div className="bg-[#C8A2C8] px-6 py-6 md:py-8 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 md:mb-3">
                      Featured Brands
                    </h3>
                    <p className="text-white text-base md:text-lg mb-4 md:mb-5 opacity-95">
                      Discover the Latest in Beauty & Spa
                    </p>
                  </div>
                  <span className="inline-block bg-white text-[#C8A2C8] px-6 py-3 rounded-[30px] font-semibold text-base md:text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:scale-105 w-fit">
                    Explore Now
                  </span>
                </div>
              </div>
            </Link>
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
              {/* Learn More Button - Desktop View (under paragraph) */}
              <Link
                href="/about-us"
                className="hidden lg:inline-block mt-6 px-6 py-3 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity duration-300 shadow-lg hover:shadow-xl"
              >
                Learn More
              </Link>
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
          {/* Learn More Button - Mobile View (after cards) */}
          <div className="lg:hidden text-center mt-8">
            <Link
              href="/about-us"
              className="inline-block px-6 py-3 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity duration-300 shadow-lg hover:shadow-xl"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Best Sellers & Professional Favorites Section */}
      <section className="w-full overflow-x-visible py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Heading - Centered */}
          <div className="text-center mb-4">
            {/* Mobile heading with line breaks */}
            <h2 className="md:hidden text-2xl font-bold mb-4 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] bg-clip-text text-transparent">
              BEST SELLERS &<br />
              PROFESSIONAL FAVORITES
            </h2>
            {/* Desktop heading without line breaks */}
            <h2 className="hidden md:block text-3xl font-bold mb-4 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] bg-clip-text text-transparent">
              BEST SELLERS & PROFESSIONAL FAVORITES
            </h2>
          </div>

          {/* Description - Centered */}
          <div className="text-center mb-4">
            {/* Mobile description with line breaks */}
            <p className="md:hidden text-gray-600 text-base">
              Discover our top-selling products frequently<br />
              ordered by Canadian beauty businesses
            </p>
            {/* Desktop description without line breaks */}
            <p className="hidden md:block text-gray-600 text-lg">
              Discover our top-selling products frequently ordered by Canadian beauty businesses
            </p>
          </div>

          {/* Navigation and View All - Left and Right */}
          <div className="flex items-center justify-between mb-4">
            {/* Navigation Arrows - Left Side */}
            <div id="best-sellers-nav" className="flex space-x-2">
              {/* Navigation buttons will be inserted here by ProductSlider */}
            </div>
            {/* View All Products Link - Right Side */}
            <div className="flex items-center">
              <Link
                href="/products"
                className="text-[#C8A2C8] hover:text-[#87CEEB] font-semibold transition-colors duration-300 whitespace-nowrap"
              >
                View All Products →
              </Link>
            </div>
          </div>
        </div>
        <div className="w-full overflow-x-visible px-4 sm:px-6 lg:px-8">
          <BestSellersSlider />
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="w-full overflow-x-visible py-4 md:py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loadingProducts ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#87CEEB]"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        ) : featuredProducts.length > 0 ? (
          <div>
            {/* Heading - Centered */}
            <div className="text-center mb-4">
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] bg-clip-text text-transparent mb-2">
                Salon Must-Haves
              </h2>
            </div>

            {/* Description - Centered */}
            <div className="text-center mb-4">
              <p className="text-gray-600 text-base md:text-lg">
                Top-rated products for flawless skincare services.
              </p>
            </div>

            {/* Navigation and View All - Left and Right */}
            <div className="flex items-center justify-between mb-4">
              {/* Navigation Arrows - Left Side */}
              <div id="salon-must-haves-nav" className="flex space-x-2">
                {/* Navigation buttons will be inserted here by ProductSlider */}
              </div>
              {/* View All Products Link - Right Side */}
              <div className="flex items-center">
                <button
                  onClick={() => {
                    if (isLoggedIn) {
                      router.push('/recent-searches')
                    } else {
                      setShowAuthModal(true)
                    }
                  }}
                  className="text-[#C8A2C8] hover:text-[#87CEEB] font-semibold transition-colors duration-300 whitespace-nowrap"
                >
                  View All Products →
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No featured products available</p>
          </div>
        )}
        </div>
        {featuredProducts.length > 0 && (
          <div className="w-full overflow-x-visible px-4 sm:px-6 lg:px-8">
            <ProductSlider products={featuredProducts} title="" externalNavContainerId="salon-must-haves-nav" />
          </div>
        )}
      </section>

      {/* Auth Modal */}
      {showAuthModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowAuthModal(false)}
        >
          <div
            className="bg-white rounded-lg max-w-md w-full p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Sign In or Create Account
              </h3>
              <p className="text-gray-600 mb-6">
                To view recent searches, please sign up or login.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/create-account?redirect=/recent-searches"
                  className="flex-1 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity duration-300 text-center"
                >
                  Create Account
                </Link>
                <Link
                  href="/sign-in?redirect=/recent-searches"
                  className="flex-1 border-2 border-[#C8A2C8] text-[#C8A2C8] px-6 py-3 rounded-lg font-semibold hover:bg-[#C8A2C8] hover:text-white transition-all duration-300 text-center"
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

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

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left Section - Text Content */}
            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] bg-clip-text text-transparent">
                Scale Your Salon with Allied Quality
              </h2>
              <p className="text-gray-600 text-base md:text-lg">
                Partner with Allied Concept Beauty Supply for premium, professional-grade spa essentials in Canada. From advanced serums to salon equipments, provide your clients with the quality they deserve.
              </p>
              <div className="inline-block p-[2px] bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] rounded">
                <Link
                  href="/contact"
                  className="block px-8 py-3 rounded bg-white font-semibold text-base uppercase tracking-wide transition-all duration-300 relative overflow-hidden group"
                >
                  <span className="bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] bg-clip-text text-transparent group-hover:text-white transition-colors duration-300 relative z-10">
                    CONTACT US
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded"></span>
                </Link>
              </div>
            </div>
            
            {/* Right Section - Image */}
            <div className="relative h-64 md:h-96 w-full rounded-lg overflow-hidden">
              <Image
                src="/promo/spa-products.jpg"
                alt="Spa and beauty products"
                fill
                className="object-cover"
                style={{ objectPosition: isMobile ? 'center 70%' : 'center 50%' }}
                unoptimized
                onError={(e) => {
                  // Fallback to a gradient background if image doesn't exist
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.className = 'relative h-64 md:h-96 w-full rounded-lg overflow-hidden bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100';
                  }
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section id="our-brands" className="w-full pt-4 pb-6 md:pt-6 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] bg-clip-text text-transparent">Our Brands</h2>
          <div className="flex items-center justify-center gap-8 md:gap-12">
            {brands.slice(0, 3).map((brand) => (
              <div
                key={brand.id}
                className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 relative transition-all duration-300"
              >
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

