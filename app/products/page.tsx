'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Header from '@/components/Header'
import MainNav from '@/components/MainNav'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import { Product } from '@/types'
import { Category } from '@/lib/products'

interface ProductsResponse {
  products: Product[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  })

  // Filters - read from URL params
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get('category') || ''
  )
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(
    searchParams.get('subcategory') || ''
  )
  const [selectedSecondSubcategory, setSelectedSecondSubcategory] = useState<string>(
    searchParams.get('secondSubcategory') || ''
  )

  // Update filters when URL params change
  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || '')
    setSelectedSubcategory(searchParams.get('subcategory') || '')
    setSelectedSecondSubcategory(searchParams.get('secondSubcategory') || '')
  }, [searchParams])
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('search') || '')
  const [minPrice, setMinPrice] = useState<string>(searchParams.get('minPrice') || '')
  const [maxPrice, setMaxPrice] = useState<string>(searchParams.get('maxPrice') || '')
  const [topPadding, setTopPadding] = useState(176) // Default padding

  // Calculate header padding
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

  // Fetch categories
  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []))
      .catch((err) => console.error('Error fetching categories:', err))
  }, [])

  // Initialize pagination from URL
  useEffect(() => {
    const pageParam = searchParams.get('page')
    if (pageParam) {
      setPagination((prev) => ({ ...prev, page: parseInt(pageParam) }))
    }
  }, [searchParams])

  // Fetch products
  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (selectedCategory) params.set('categoryId', selectedCategory)
    if (selectedSubcategory) params.set('subcategoryId', selectedSubcategory)
    if (selectedSecondSubcategory) params.set('secondSubcategoryId', selectedSecondSubcategory)
    if (searchQuery) params.set('search', searchQuery)
    if (minPrice) params.set('minPrice', minPrice)
    if (maxPrice) params.set('maxPrice', maxPrice)
    params.set('page', pagination.page.toString())
    params.set('limit', pagination.limit.toString())

    fetch(`/api/products?${params.toString()}`)
      .then((res) => res.json())
      .then((data: ProductsResponse) => {
        setProducts(data.products || [])
        setPagination(data.pagination || pagination)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching products:', err)
        setLoading(false)
      })
  }, [selectedCategory, selectedSubcategory, selectedSecondSubcategory, searchQuery, minPrice, maxPrice, pagination.page])

  const handleFilterChange = (filterType: string, value: string) => {
    // Reset dependent filters
    if (filterType === 'category') {
      setSelectedSubcategory('')
      setSelectedSecondSubcategory('')
      setSelectedCategory(value)
    } else if (filterType === 'subcategory') {
      setSelectedSecondSubcategory('')
      setSelectedSubcategory(value)
    } else if (filterType === 'secondSubcategory') {
      setSelectedSecondSubcategory(value)
    }

    // Update URL
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(filterType, value)
    } else {
      params.delete(filterType)
    }
    params.set('page', '1') // Reset to page 1 when filters change
    router.push(`/products?${params.toString()}`, { scroll: false })
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (searchQuery) {
      params.set('search', searchQuery)
    } else {
      params.delete('search')
    }
    params.set('page', '1')
    router.push(`/products?${params.toString()}`, { scroll: false })
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  const handlePriceFilter = () => {
    const params = new URLSearchParams(searchParams.toString())
    if (minPrice) params.set('minPrice', minPrice)
    else params.delete('minPrice')
    if (maxPrice) params.set('maxPrice', maxPrice)
    else params.delete('maxPrice')
    params.set('page', '1')
    router.push(`/products?${params.toString()}`, { scroll: false })
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  const clearFilters = () => {
    setSelectedCategory('')
    setSelectedSubcategory('')
    setSelectedSecondSubcategory('')
    setSearchQuery('')
    setMinPrice('')
    setMaxPrice('')
    router.push('/products', { scroll: false })
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  const getSelectedCategory = () => {
    return categories.find((c) => c.id === selectedCategory)
  }

  const getSelectedSubcategory = () => {
    const category = getSelectedCategory()
    return category?.subcategories?.find((s) => s.id === selectedSubcategory)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <MainNav />

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full" style={{ paddingTop: `${topPadding + 32}px` }}>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky" style={{ top: `${topPadding + 16}px` }}>
              <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] bg-clip-text text-transparent">
                Filters
              </h2>

              {/* Search */}
              <div className="mb-6">
                <form onSubmit={handleSearch}>
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#87CEEB]"
                  />
                  <button
                    type="submit"
                    className="mt-2 w-full bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Search
                  </button>
                </form>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#87CEEB]"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subcategory Filter */}
              {selectedCategory && getSelectedCategory()?.subcategories && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2">Subcategory</label>
                  <select
                    value={selectedSubcategory}
                    onChange={(e) => handleFilterChange('subcategory', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#87CEEB]"
                  >
                    <option value="">All Subcategories</option>
                    {getSelectedCategory()?.subcategories?.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Second Subcategory Filter */}
              {selectedSubcategory && getSelectedSubcategory()?.secondSubcategories && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2">Second Subcategory</label>
                  <select
                    value={selectedSecondSubcategory}
                    onChange={(e) => handleFilterChange('secondSubcategory', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#87CEEB]"
                  >
                    <option value="">All Second Subcategories</option>
                    {getSelectedSubcategory()?.secondSubcategories?.map((second) => (
                      <option key={second.id} value={second.id}>
                        {second.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Price Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">Price Range</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#87CEEB]"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#87CEEB]"
                  />
                </div>
                <button
                  onClick={handlePriceFilter}
                  className="w-full bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Apply Price Filter
                </button>
              </div>

              {/* Clear Filters */}
              <button
                onClick={clearFilters}
                className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] bg-clip-text text-transparent">
                Products
              </h1>
              <p className="text-gray-600">
                Showing {products.length} of {pagination.total} products
              </p>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#87CEEB]"></div>
                <p className="mt-4 text-gray-600">Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No products found.</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 text-[#87CEEB] hover:underline"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2">
                    <button
                      onClick={() => {
                        const newPage = pagination.page - 1
                        setPagination((prev) => ({ ...prev, page: newPage }))
                        const params = new URLSearchParams(searchParams.toString())
                        params.set('page', newPage.toString())
                        router.push(`/products?${params.toString()}`, { scroll: false })
                      }}
                      disabled={pagination.page === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2">
                      Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <button
                      onClick={() => {
                        const newPage = pagination.page + 1
                        setPagination((prev) => ({ ...prev, page: newPage }))
                        const params = new URLSearchParams(searchParams.toString())
                        params.set('page', newPage.toString())
                        router.push(`/products?${params.toString()}`, { scroll: false })
                      }}
                      disabled={pagination.page === pagination.totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  )
}

