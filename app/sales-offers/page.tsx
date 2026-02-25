'use client'

import { useState, useEffect, useMemo } from 'react'
import Header from '@/components/Header'
import MainNav from '@/components/MainNav'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import { Product } from '@/types'

// Category definitions with exact product names to match
const categories = [
  {
    name: 'Silk-B Professional Sale',
    productNames: [
      'nonwoven body sheet roll',
      'pre-cut sheets',
      'essentials',
      'examination paper',
      'crepe', 'smooth',
      'epilating cotton roll',
      'pmt portable manicure table',
      'foldable legs'
    ]
  },
  {
    name: 'Silk Roma Wax Sale',
    productNames: [
      'silkroma depilatory honey wax',
      'silkroma depilatory zinc wax',
      'roma azulene wax',
      'roll-on wax',
      'roll on wax',
      'pink', 'honey', 'azulene', 'banana'
    ]
  },
  {
    name: 'Waxing Essentials Deals',
    productNames: [
      'spatulas',
      'plastic', 'small angled', 'wooden', 'stainless steel',
      'double metal wax heater',
      'single metal wax heater',
      'nonwoven body sheet roll',
      'pre-cut sheets'
    ]
  },
  {
    name: 'Disposable & Spa Supplies Sale',
    productNames: [
      'nonwoven disposable gown',
      'nonwoven disposable bra',
      'nonwoven disposable underwear',
      'terry fitted bed sheet',
      'towels',
      'pedicure disposable towels',
      'terry gown wrap',
      'cotton flat sheets'
    ]
  }
]

interface Category {
  id: string
  name: string
  slug: string
  level: number
  subcategories?: Category[]
}

export default function SalesOffersPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [topPadding, setTopPadding] = useState(220) // Default padding

  // Set page title
  useEffect(() => {
    document.title = 'Sales & Offers - Allied Concept Beauty Supplies'
  }, [])

  // Fetch categories
  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.categories || [])
      })
      .catch((err) => {
        console.error('Error fetching categories:', err)
      })
  }, [])

  // Helper function to get root category name from product
  const getCategoryName = (product: Product): string => {
    if (!product.categoryId) {
      return product.category || 'Other'
    }
    
    // Build a map of category ID to root category name
    const buildCategoryMap = (cats: Category[], rootName: string = ''): Map<string, string> => {
      const map = new Map<string, string>()
      
      for (const cat of cats) {
        const currentRoot = cat.level === 0 ? cat.name : rootName
        
        if (cat.id) {
          map.set(cat.id, currentRoot)
        }
        
        if (cat.subcategories && cat.subcategories.length > 0) {
          const subMap = buildCategoryMap(cat.subcategories, currentRoot)
          subMap.forEach((value, key) => map.set(key, value))
        }
      }
      
      return map
    }
    
    const categoryMap = buildCategoryMap(categories)
    const rootCategoryName = categoryMap.get(product.categoryId)
    
    return rootCategoryName || product.category || 'Other'
  }

  useEffect(() => {
    // Fetch all products
    const fetchProducts = async () => {
      try {
        setLoading(true)
        console.log('Fetching products...')
        const response = await fetch('/api/products?limit=100')
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        console.log('API Response:', data)
        
        if (data.products && Array.isArray(data.products)) {
          console.log('Total products received:', data.products.length)
          
          // Filter products from spa-products, skincare, and nail-products categories
          // Try to match by categoryId or category name
          const filteredProducts = data.products.filter((p: Product) => {
            const categoryId = String(p.categoryId || '').toLowerCase()
            const category = String(p.category || '').toLowerCase()
            
            // Check if product belongs to spa-products, skincare, or nail-products
            const isSpa = categoryId.includes('spa') || category.includes('spa')
            const isSkincare = categoryId.includes('skincare') || category.includes('skincare')
            const isNail = categoryId.includes('nail') || category.includes('nail')
            
            return isSpa || isSkincare || isNail
          })
          
          console.log('Filtered products:', filteredProducts.length)
          
          // If filtered products are less than 20, use all products
          const productsToUse = filteredProducts.length >= 20 ? filteredProducts : data.products
          
          setProducts(productsToUse)
          console.log('Products to display:', productsToUse.length)
        } else {
          console.log('No products array in response')
          setProducts([])
        }
      } catch (err) {
        console.error('Error fetching products:', err)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    
    fetchProducts()
  }, [])

  // Organize products by category
  const productsByCategory = useMemo(() => {
    if (products.length === 0) {
      return {}
    }
    
    const grouped: { [key: string]: Product[] } = {}
    
    products.forEach((product) => {
      const categoryName = getCategoryName(product)
      if (!grouped[categoryName]) {
        grouped[categoryName] = []
      }
      grouped[categoryName].push(product)
    })
    
    return grouped
  }, [products, categories])

  // Organize products into rows by category (4 rows with 5 products each)
  const categoryRows = useMemo(() => {
    const rows: Array<{ categoryName: string; products: Product[] }> = []
    const categoryNames = Object.keys(productsByCategory)
    
    // Take first 20 products total, organized by category
    let productsUsed = 0
    const maxProducts = 20
    
    for (const categoryName of categoryNames) {
      if (productsUsed >= maxProducts) break
      
      const categoryProducts = productsByCategory[categoryName]
      const remainingSlots = maxProducts - productsUsed
      const productsToTake = categoryProducts.slice(0, remainingSlots)
      
      if (productsToTake.length > 0) {
        // Split into rows of 5
        for (let i = 0; i < productsToTake.length; i += 5) {
          const rowProducts = productsToTake.slice(i, i + 5)
          rows.push({
            categoryName: i === 0 ? categoryName : '', // Only show category name for first row
            products: rowProducts
          })
          productsUsed += rowProducts.length
          if (productsUsed >= maxProducts) break
        }
      }
    }
    
    // Ensure we have exactly 4 rows
    while (rows.length < 4) {
      rows.push({ categoryName: '', products: [] })
    }
    
    return rows.slice(0, 4)
  }, [productsByCategory])


  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
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
        setTopPadding(totalHeight + (isMobile ? 10 : 20))
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <MainNav />
      
      <main className="flex-grow pb-12" style={{ paddingTop: `${topPadding}px` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-12 mt-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] bg-clip-text text-transparent mb-4">
              Sales & Offers
            </h1>
            <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
              Discover amazing deals on premium beauty products and spa essentials
            </p>
          </div>

          {/* SILK B Professionals Special Sale Event Banner */}
          <div className="mb-16 rounded-[8px] overflow-hidden shadow-xl bg-gradient-to-r from-[#87CEEB] to-[#C8A2C8] p-8 md:p-12 transform hover:scale-[1.01] transition-transform duration-300">
            <div className="text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                SILK B Professionals Special Sale Event
              </h2>
              <p className="text-lg md:text-xl mb-6 opacity-95">
                Premium Products and Spa Essentials Now on Sale
              </p>
              <p className="text-base md:text-lg opacity-90">
                Stock up and save on your favorite professional beauty products
              </p>
            </div>
          </div>

          {/* Products by Category */}
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#87CEEB]"></div>
              <p className="mt-4 text-gray-600 text-lg">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-600 text-lg">No products available at this time.</p>
            </div>
          ) : (
            <div className="space-y-16">
              {/* Display products organized by category */}
              {categoryRows.map((row, rowIndex) => {
                // Only render row if it has products
                if (row.products.length === 0) return null
                
                // Don't show "Other" category heading
                if (row.categoryName === 'Other') {
                  return (
                    <div key={rowIndex} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {row.products.map((product) => (
                          <div key={product.id} className="w-full">
                            <ProductCard product={product} />
                          </div>
                        ))}
                        {Array.from({ length: Math.max(0, 5 - row.products.length) }).map((_, index) => (
                          <div key={`empty-${rowIndex}-${index}`} className="w-full aspect-square bg-transparent" aria-hidden="true" />
                        ))}
                      </div>
                    </div>
                  )
                }
                
                return (
                  <div key={rowIndex} className="space-y-6">
                    {/* Category Heading */}
                    {row.categoryName && (
                      <div className="mb-4">
                        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] bg-clip-text text-transparent">
                          {row.categoryName}
                        </h2>
                        <div className="h-1 w-20 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] mt-2 rounded"></div>
                      </div>
                    )}
                    
                    {/* Products Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                      {row.products.map((product) => (
                        <div key={product.id} className="w-full">
                          <ProductCard product={product} />
                        </div>
                      ))}
                      {/* Fill remaining slots if less than 5 products in row */}
                      {Array.from({ length: Math.max(0, 5 - row.products.length) }).map((_, index) => (
                        <div key={`empty-${rowIndex}-${index}`} className="w-full aspect-square bg-transparent" aria-hidden="true" />
                      ))}
                    </div>
                  </div>
                )
              })}
              
              {/* Show message if no products found */}
              {categoryRows.every(row => row.products.length === 0) && (
                <div className="text-center py-16">
                  <p className="text-gray-600 text-lg">
                    No products available at this time.
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    Total products loaded: {products.length}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

