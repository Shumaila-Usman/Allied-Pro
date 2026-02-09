'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Header from '@/components/Header'
import MainNav from '@/components/MainNav'
import Footer from '@/components/Footer'
import { Product } from '@/types'

interface ProductsResponse {
  products: Product[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export default function DealerPortalPage() {
  const { isDealer, isLoggedIn, user } = useAuth()
  const { addToCart } = useCart()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [authLoading, setAuthLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedSubcategory, setSelectedSubcategory] = useState('')
  const [selectedSecondSubcategory, setSelectedSecondSubcategory] = useState('')
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [topPadding, setTopPadding] = useState(176)
  const [categories, setCategories] = useState<any[]>([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  })

  // Check auth state after component mounts and localStorage is checked
  useEffect(() => {
    // Wait for AuthContext to load user from localStorage
    // The AuthContext loads synchronously in useEffect, so we give it a moment
    const timer = setTimeout(() => {
      setAuthLoading(false)
    }, 150)

    return () => clearTimeout(timer)
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
    setTimeout(calculatePadding, 100)

    return () => {
      window.removeEventListener('resize', calculatePadding)
    }
  }, [])

  // Fetch categories - get flat list for filtering
  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        // Flatten the nested category structure
        const flatCategories: any[] = []
        const flattenCategories = (cats: any[]) => {
          for (const cat of cats) {
            flatCategories.push({
              _id: cat.id,
              id: cat.id,
              name: cat.name,
              slug: cat.slug,
              level: cat.level,
              parent: null, // Will be set below
            })
            if (cat.subcategories && cat.subcategories.length > 0) {
              for (const subcat of cat.subcategories) {
                flatCategories.push({
                  _id: subcat.id,
                  id: subcat.id,
                  name: subcat.name,
                  slug: subcat.slug,
                  level: subcat.level || 1,
                  parent: cat.id,
                })
                if (subcat.secondSubcategories && subcat.secondSubcategories.length > 0) {
                  for (const secondSubcat of subcat.secondSubcategories) {
                    flatCategories.push({
                      _id: secondSubcat.id,
                      id: secondSubcat.id,
                      name: secondSubcat.name,
                      slug: secondSubcat.slug,
                      level: secondSubcat.level || 2,
                      parent: subcat.id,
                    })
                  }
                }
              }
            }
          }
        }
        flattenCategories(data.categories || [])
        setCategories(flatCategories)
      })
      .catch((err) => console.error('Error fetching categories:', err))
  }, [])

  // Fetch products
  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (selectedCategory) params.set('categoryId', selectedCategory)
    if (selectedSubcategory) params.set('subcategoryId', selectedSubcategory)
    if (selectedSecondSubcategory) params.set('secondSubcategoryId', selectedSecondSubcategory)
    if (searchQuery) params.set('search', searchQuery)
    params.set('page', pagination.page.toString())
    params.set('limit', pagination.limit.toString())

    const url = `/api/products?${params.toString()}`
    console.log('Dealer portal fetching products from:', url)

    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        return res.json()
      })
      .then((data: ProductsResponse) => {
        console.log('Dealer portal products response:', {
          productCount: data.products?.length || 0,
          total: data.pagination?.total || 0,
          sampleProduct: data.products?.[0]
        })
        setProducts(data.products || [])
        if (data.pagination) {
          setPagination(data.pagination)
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching products:', err)
        setProducts([])
        setLoading(false)
      })
  }, [selectedCategory, selectedSubcategory, selectedSecondSubcategory, searchQuery, pagination.page, pagination.limit])

  // Redirect if not dealer (but wait for auth to load first)
  useEffect(() => {
    if (!authLoading) {
      if (!isLoggedIn || !isDealer) {
        router.push('/')
      }
    }
  }, [authLoading, isLoggedIn, isDealer, router])

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  // Redirect if not dealer
  if (!isLoggedIn || !isDealer) {
    return null
  }

  // Get root categories for the main dropdown
  const rootCategories = categories.filter((cat: any) => cat.level === 0 || !cat.level)
  const rootCategoryMap: Record<string, string> = {
    'skincare': 'Skincare',
    'spa-products': 'Spa Products',
    'nail-products': 'Nail Products',
    'equipment': 'Equipment',
    'implements': 'Implements',
    'furniture': 'Furniture',
  }

  // Get subcategories for selected root category
  const subcategories = selectedCategory
    ? categories.filter((cat: any) => {
        const rootCat = rootCategories.find((r: any) => r.slug === selectedCategory)
        return rootCat && cat.parent === rootCat.id && (cat.level === 1 || cat.level === undefined)
      })
    : []

  // Get second subcategories for selected subcategory
  const secondSubcategories = selectedSubcategory
    ? categories.filter((cat: any) => {
        const subCat = subcategories.find((s: any) => s.slug === selectedSubcategory)
        return subCat && cat.parent === subCat.id && cat.level === 2
      })
    : []

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value)
    setSelectedSubcategory('')
    setSelectedSecondSubcategory('')
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  const handleSubcategoryChange = (value: string) => {
    setSelectedSubcategory(value)
    setSelectedSecondSubcategory('')
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleQuantityChange = (productId: string, value: number) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, value)
    }))
  }

  const handleAddToCart = (product: Product) => {
    const quantity = quantities[product.id] || 1
    for (let i = 0; i < quantity; i++) {
      addToCart(product)
    }
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('')
    setSelectedSubcategory('')
    setSelectedSecondSubcategory('')
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  // Get category name for display
  const getCategoryName = (product: Product) => {
    if (product.categoryId) {
      // Try to find by ID first
      const cat = categories.find((c: any) => 
        c._id?.toString() === product.categoryId || 
        c.id === product.categoryId ||
        c.slug === product.categoryId
      )
      if (cat) return cat.name
      
      // Try to find by slug mapping
      for (const [slug, name] of Object.entries(rootCategoryMap)) {
        if (product.categoryId === slug) return name
      }
    }
    return 'Uncategorized'
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <MainNav />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ paddingTop: `${topPadding + 32}px` }}>
        {/* Header and Filters Section */}
        <div className="bg-gray-900 rounded-lg p-6 mb-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-4xl font-bold mb-2 text-white">Dealer Inventory & Ordering</h1>
            <p className="text-gray-300 text-lg">
              Browse our complete inventory with real-time stock levels and preferred partner pricing.
            </p>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-400"
              >
                <option value="">All Categories</option>
                {rootCategories.map((category: any) => (
                  <option key={category._id || category.slug} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            {subcategories.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Subcategory</label>
                <select
                  value={selectedSubcategory}
                  onChange={(e) => handleSubcategoryChange(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-400"
                >
                  <option value="">All Subcategories</option>
                  {subcategories.map((subcategory: any) => (
                    <option key={subcategory._id || subcategory.slug} value={subcategory.slug}>
                      {subcategory.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            {secondSubcategories.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Second Subcategory</label>
                <select
                  value={selectedSecondSubcategory}
                  onChange={(e) => {
                    setSelectedSecondSubcategory(e.target.value)
                    setPagination((prev) => ({ ...prev, page: 1 }))
                  }}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-400"
                >
                  <option value="">All Second Subcategories</option>
                  {secondSubcategories.map((secondSubcategory: any) => (
                    <option key={secondSubcategory._id || secondSubcategory.slug} value={secondSubcategory.slug}>
                      {secondSubcategory.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            <div className={secondSubcategories.length > 0 ? 'lg:col-span-2' : subcategories.length > 0 ? 'lg:col-span-3' : 'lg:col-span-4'}>
              <label className="block text-sm font-medium text-gray-300 mb-2">Product Search</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setPagination((prev) => ({ ...prev, page: 1 }))
                }}
                placeholder="e.g. Facial Cleanser or ACBS Professional"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
            </div>
            
            <div className="flex items-end gap-2">
              <button
                onClick={clearFilters}
                className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-300"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Products Table */}
        {loading ? (
          <div className="bg-gray-800 rounded-lg p-12 text-center">
            <p className="text-gray-400 text-lg">Loading products...</p>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">IMAGE</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">TITLE</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">CATEGORY</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">COST</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">STOCK</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">ADD TO CART</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {products.map((product) => {
                    const cost = product.cost || product.price // Use dealer cost if available, otherwise retail price
                    const imageUrl = product.images && product.images.length > 0 
                      ? product.images[0] 
                      : '/products/placeholder.jpg'
                    
                    return (
                      <tr key={product.id} className="hover:bg-gray-750 transition-colors duration-200">
                        <td className="px-6 py-4">
                          <div className="relative w-16 h-16">
                            <Image
                              src={imageUrl}
                              alt={product.name}
                              fill
                              className="object-cover rounded"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/products/placeholder.jpg'
                              }}
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-white">{product.name}</p>
                            <p className="text-sm text-gray-400 line-clamp-2">{product.description || ''}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-white">{getCategoryName(product)}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-red-400 font-semibold">${cost.toFixed(2)}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className={`font-semibold ${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {product.stock || 0}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="1"
                              max={product.stock || 1}
                              value={quantities[product.id] || 1}
                              onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value) || 1)}
                              className="w-16 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                            />
                            <button
                              onClick={() => handleAddToCart(product)}
                              disabled={!product.stock || product.stock === 0}
                              className="bg-gradient-to-r from-[#87CEEB] to-[#C8A2C8] text-white px-4 py-1 rounded-lg font-medium hover:opacity-90 transition-opacity duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Add
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No products found matching your filters.</p>
          </div>
        )}

        {/* Pagination */}
        {!loading && pagination.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between bg-gray-800 rounded-lg px-6 py-4">
            <div className="text-gray-300 text-sm">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} products
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pageNum: number
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1
                  } else if (pagination.page <= 3) {
                    pageNum = i + 1
                  } else if (pagination.page >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i
                  } else {
                    pageNum = pagination.page - 2 + i
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-2 rounded-lg transition-colors duration-300 ${
                        pagination.page === pageNum
                          ? 'bg-gradient-to-r from-[#87CEEB] to-[#C8A2C8] text-white'
                          : 'bg-gray-700 text-white hover:bg-gray-600'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
              </div>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
