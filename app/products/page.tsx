'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Header from '@/components/Header'
import MainNav from '@/components/MainNav'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import { Product } from '@/types'
import { Category } from '@/lib/products'

// Extended Category interface to include level from API
interface CategoryWithLevel extends Category {
  level?: number
}

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
  const [categories, setCategories] = useState<CategoryWithLevel[]>([])
  const [loading, setLoading] = useState(true)
  
  // Define the 6 main categories
  const mainCategoryNames = [
    'SKINCARE',
    'SPA PRODUCTS',
    'NAIL PRODUCTS',
    'EQUIPMENT',
    'IMPLEMENTS',
    'FURNITURE'
  ]
  
  // Complete fallback categories with all subcategories and second subcategories
  const fallbackCategories: CategoryWithLevel[] = [
    { 
      id: 'skincare', 
      name: 'SKINCARE', 
      slug: 'skincare', 
      level: 0,
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
          ]
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
          ]
        },
        { 
          id: 'skincare-by-skin-type', 
          name: 'By Skin Type', 
          slug: 'by-skin-type', 
          parentId: 'skincare', 
          secondSubcategories: [
            { id: 'normal-all-skin-types', name: 'Normal / All Skin Types', slug: 'normal-all-skin-types', parentId: 'skincare-by-skin-type' },
          ]
        },
      ]
    },
    { 
      id: 'spa-products', 
      name: 'SPA PRODUCTS', 
      slug: 'spa-products', 
      level: 0,
      subcategories: [
        { id: 'treatment-products', name: 'Treatment Products (Waxing & Paraffin)', slug: 'treatment-products', parentId: 'spa-products', secondSubcategories: [] },
        { id: 'body-wraps-spa-creams', name: 'Body Wraps & Spa Creams', slug: 'body-wraps-spa-creams', parentId: 'spa-products', secondSubcategories: [] },
        { id: 'hot-stones', name: 'Hot Stones', slug: 'hot-stones', parentId: 'spa-products', secondSubcategories: [] },
        { 
          id: 'spa-accessories', 
          name: 'Spa Accessories', 
          slug: 'spa-accessories', 
          parentId: 'spa-products', 
          secondSubcategories: [
            { id: 'towels-robes-linens', name: 'Towels, Robes & Linens', slug: 'towels-robes-linens', parentId: 'spa-accessories' },
            { id: 'slippers-disposables', name: 'Slippers & Disposables', slug: 'slippers-disposables', parentId: 'spa-accessories' },
            { id: 'small-tools-disposable-sundries', name: 'Small Tools & Disposable Sundries', slug: 'small-tools-disposable-sundries', parentId: 'spa-accessories' },
          ]
        },
        { 
          id: 'spa-equipment', 
          name: 'Equipment', 
          slug: 'spa-equipment', 
          parentId: 'spa-products', 
          secondSubcategories: [
            { id: 'warmers-hot-towel-cabinets', name: 'Warmers & Hot Towel Cabinets', slug: 'warmers-hot-towel-cabinets', parentId: 'spa-equipment' },
          ]
        },
      ]
    },
    { 
      id: 'nail-products', 
      name: 'NAIL PRODUCTS', 
      slug: 'nail-products', 
      level: 0,
      subcategories: [
        { id: 'nail-care', name: 'Nail Care (Cuticle & Treatments)', slug: 'nail-care', parentId: 'nail-products', secondSubcategories: [] },
        { id: 'nail-files-buffers', name: 'Nail Files & Buffers', slug: 'nail-files-buffers', parentId: 'nail-products', secondSubcategories: [] },
        { id: 'nail-art', name: 'Nail Art', slug: 'nail-art', parentId: 'nail-products', secondSubcategories: [] },
        { 
          id: 'tools-equipment', 
          name: 'Tools & Equipment', 
          slug: 'tools-equipment', 
          parentId: 'nail-products', 
          secondSubcategories: [
            { id: 'pedicure-tools', name: 'Pedicure Tools', slug: 'pedicure-tools', parentId: 'tools-equipment' },
            { id: 'stations-storage', name: 'Stations & Storage', slug: 'stations-storage', parentId: 'tools-equipment' },
            { id: 'manicure-pedicure-accessories', name: 'Manicure & Pedicure Accessories', slug: 'manicure-pedicure-accessories', parentId: 'tools-equipment' },
          ]
        },
        { id: 'consumables-disposables', name: 'Consumables & Disposables', slug: 'consumables-disposables', parentId: 'nail-products', secondSubcategories: [] },
      ]
    },
    { 
      id: 'equipment', 
      name: 'EQUIPMENT', 
      slug: 'equipment', 
      level: 0,
      subcategories: [
        { id: 'facial-equipment', name: 'Facial Equipment', slug: 'facial-equipment', parentId: 'equipment', secondSubcategories: [] },
        { id: 'styling-equipment', name: 'Styling Equipment', slug: 'styling-equipment', parentId: 'equipment', secondSubcategories: [] },
        { id: 'salon-equipment', name: 'Salon Equipment (Trolleys & Carts)', slug: 'salon-equipment', parentId: 'equipment', secondSubcategories: [] },
        { id: 'equipment-accessories', name: 'Equipment Accessories (Stands & Bulbs)', slug: 'equipment-accessories', parentId: 'equipment', secondSubcategories: [] },
      ]
    },
    { 
      id: 'implements', 
      name: 'IMPLEMENTS', 
      slug: 'implements', 
      level: 0,
      subcategories: [
        { id: 'hair-tools', name: 'Hair Tools', slug: 'hair-tools', parentId: 'implements', secondSubcategories: [] },
        { id: 'scissors-shears', name: 'Scissors & Shears', slug: 'scissors-shears', parentId: 'implements', secondSubcategories: [] },
        { id: 'skin-tools', name: 'Skin Tools (Tweezers & Extraction)', slug: 'skin-tools', parentId: 'implements', secondSubcategories: [] },
        { id: 'nail-pushers-implements', name: 'Nail Pushers & Implements', slug: 'nail-pushers-implements', parentId: 'implements', secondSubcategories: [] },
        { id: 'sterilization-safety', name: 'Sterilization & Safety', slug: 'sterilization-safety', parentId: 'implements', secondSubcategories: [] },
        { 
          id: 'disposables', 
          name: 'Disposables', 
          slug: 'disposables', 
          parentId: 'implements', 
          secondSubcategories: [
            { id: 'bowls', name: 'Bowls', slug: 'bowls', parentId: 'disposables' },
            { id: 'medical-treatment-disposables', name: 'Medical & Treatment Disposables', slug: 'medical-treatment-disposables', parentId: 'disposables' },
          ]
        },
      ]
    },
    { 
      id: 'furniture', 
      name: 'FURNITURE', 
      slug: 'furniture', 
      level: 0,
      subcategories: [
        { id: 'facial-bed-multipurpose', name: 'Facial Bed Multipurpose', slug: 'facial-bed-multipurpose', parentId: 'furniture', secondSubcategories: [] },
        { id: 'facial-massage-bed', name: 'Facial Massage Bed (White / Black)', slug: 'facial-massage-bed', parentId: 'furniture', secondSubcategories: [] },
        { id: 'salon-spa-rolling-tray', name: 'Salon Spa Rolling Tray with Accessories Holder', slug: 'salon-spa-rolling-tray', parentId: 'furniture', secondSubcategories: [] },
      ]
    },
  ]

  // Get the 6 main categories for the dropdown (always return all 6, regardless of selection)
  const getMainCategories = () => {
    // Always return all 6 fallback categories for the dropdown
    // This ensures the dropdown always shows all categories, not just the selected one
    return fallbackCategories
  }
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
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false) // Mobile filters toggle

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

  // Fetch categories with subcategories
  useEffect(() => {
    console.log('🟢 Fetching categories from API...')
    fetch('/api/categories')
      .then((res) => {
        console.log('🟢 API response status:', res.status)
        if (!res.ok) {
          throw new Error(`API returned ${res.status}`)
        }
        return res.json()
      })
      .then((data) => {
        console.log('🟢 API response data:', data)
        const fetchedCategories = data.categories || []
        console.log('📦 Total categories fetched:', fetchedCategories.length)
        if (fetchedCategories.length > 0) {
          console.log('📦 First category:', fetchedCategories[0])
          console.log('📦 First category subcategories:', fetchedCategories[0].subcategories)
        }
        const level0Categories = fetchedCategories.filter((cat: CategoryWithLevel) => cat.level === 0)
        console.log('📦 Level 0 categories (main categories):', level0Categories.length)
        console.log('📦 Level 0 category names:', level0Categories.map((cat: CategoryWithLevel) => cat.name))
        setCategories(fetchedCategories)
      })
      .catch((err) => {
        console.error('❌ Error fetching categories:', err)
        console.error('❌ Error details:', err.message, err.stack)
        // Don't set empty array, keep trying
      })
  }, [])

  // Fetch subcategories when a category is selected (if not already loaded)
  useEffect(() => {
    if (!selectedCategory) return
    
    console.log('🟡 Category selected, checking for subcategories...', selectedCategory)
    
    // Check if we already have this category with subcategories
    const existingCat = categories.find((c) => c.id === selectedCategory)
    if (existingCat && existingCat.subcategories && existingCat.subcategories.length > 0) {
      console.log('🟡 Category already has subcategories:', existingCat.name, existingCat.subcategories.length)
      return
    }
    
    // First, try to use fallback categories immediately (faster than API call)
    const selectedCatName = getMainCategories().find(c => c.id === selectedCategory)?.name
    if (selectedCatName) {
      const fallbackCat = fallbackCategories.find(c => c.name.toUpperCase() === selectedCatName.toUpperCase())
      if (fallbackCat && fallbackCat.subcategories && fallbackCat.subcategories.length > 0) {
        console.log('🟡 Using fallback category immediately:', fallbackCat.name, fallbackCat.subcategories.length)
        
        // Update categories state with fallback category (deep copy to preserve secondSubcategories)
        setCategories((prev) => {
          const existingIndex = prev.findIndex(c => c.id === selectedCategory || c.name.toUpperCase() === selectedCatName.toUpperCase())
          if (existingIndex >= 0) {
            const updated = [...prev]
            // Deep copy to preserve nested secondSubcategories
            updated[existingIndex] = { 
              ...updated[existingIndex], 
              ...fallbackCat,
              subcategories: fallbackCat.subcategories?.map((sub: any) => ({
                ...sub,
                secondSubcategories: sub.secondSubcategories || []
              })) || []
            }
            return updated
          } else {
            // Deep copy fallback category
            return [...prev, {
              ...fallbackCat,
              subcategories: fallbackCat.subcategories?.map((sub: any) => ({
                ...sub,
                secondSubcategories: sub.secondSubcategories || []
              })) || []
            }]
          }
        })
        return // Don't fetch from API if we have fallback
      }
    }
    
    console.log('🟡 Fetching subcategories from API for category:', selectedCategory)
    
    // Always fetch from API when category is selected to get fresh subcategories
    fetch('/api/categories')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`API returned ${res.status}`)
        }
        return res.json()
      })
      .then((data) => {
        const fetchedCategories = data.categories || []
        console.log('🟡 Fetched categories from API:', fetchedCategories.length)
        
        if (fetchedCategories.length === 0) {
          console.log('🟡 API returned empty categories array - using fallback categories with subcategories')
          
          // Use fallback categories with subcategories
          const selectedCatName = getMainCategories().find(c => c.id === selectedCategory)?.name
          if (selectedCatName) {
            const fallbackCat = fallbackCategories.find(c => c.name.toUpperCase() === selectedCatName.toUpperCase())
            if (fallbackCat && fallbackCat.subcategories && fallbackCat.subcategories.length > 0) {
              console.log('🟡 Using fallback category with subcategories:', fallbackCat.name, fallbackCat.subcategories.length)
              
              // Update categories state with fallback category
              setCategories((prev) => {
                const existingIndex = prev.findIndex(c => c.id === selectedCategory || c.name.toUpperCase() === selectedCatName.toUpperCase())
                if (existingIndex >= 0) {
                  const updated = [...prev]
                  updated[existingIndex] = { ...updated[existingIndex], ...fallbackCat }
                  return updated
                } else {
                  return [...prev, fallbackCat]
                }
              })
            }
          }
          return
        }
        
        // Try to find the selected category in the fetched categories by ID
        let categoryWithSubs = fetchedCategories.find((cat: CategoryWithLevel) => 
          cat.id === selectedCategory
        )
        
        // If not found by ID, try to find by name (case-insensitive)
        if (!categoryWithSubs) {
          const selectedCatName = getMainCategories().find(c => c.id === selectedCategory)?.name
          console.log('🟡 Trying to find category by name:', selectedCatName)
          if (selectedCatName) {
            categoryWithSubs = fetchedCategories.find((cat: CategoryWithLevel) => 
              cat.name.toUpperCase() === selectedCatName.toUpperCase()
            )
          }
        }
        
        if (categoryWithSubs) {
          console.log('🟡 Found category with subcategories:', categoryWithSubs.name)
          console.log('🟡 Subcategories count:', categoryWithSubs.subcategories?.length || 0)
          if (categoryWithSubs.subcategories && categoryWithSubs.subcategories.length > 0) {
            console.log('🟡 Subcategories:', categoryWithSubs.subcategories.map((s: any) => s.name))
          }
          
          // Update the categories state
          setCategories((prev) => {
            // Check if category already exists
            const existingIndex = prev.findIndex(c => c.id === selectedCategory || c.id === categoryWithSubs.id)
            
            if (existingIndex >= 0) {
              // Update existing category with subcategories
              const updated = [...prev]
              updated[existingIndex] = { 
                ...updated[existingIndex], 
                subcategories: categoryWithSubs.subcategories || []
              }
              console.log('🟡 Updated existing category with subcategories')
              return updated
            } else {
              // Add new category with subcategories
              console.log('🟡 Adding new category with subcategories to state')
              return [...prev, categoryWithSubs]
            }
          })
        } else {
          console.log('🟡 Category not found in API response for:', selectedCategory)
          console.log('🟡 Available categories:', fetchedCategories.map((c: any) => c.name))
        }
      })
      .catch((err) => {
        console.error('❌ Error fetching subcategories:', err)
      })
  }, [selectedCategory]) // Only depend on selectedCategory to avoid infinite loops

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
    
    // Use categoryId, subcategoryId, secondSubcategoryId for API
    if (selectedCategory) {
      params.set('categoryId', selectedCategory)
      console.log('🔴 Fetching products with categoryId:', selectedCategory)
    }
    if (selectedSubcategory) {
      params.set('subcategoryId', selectedSubcategory)
      console.log('🔴 Fetching products with subcategoryId:', selectedSubcategory)
    }
    if (selectedSecondSubcategory) {
      params.set('secondSubcategoryId', selectedSecondSubcategory)
      console.log('🔴 Fetching products with secondSubcategoryId:', selectedSecondSubcategory)
    }
    if (searchQuery) params.set('search', searchQuery)
    if (minPrice) params.set('minPrice', minPrice)
    if (maxPrice) params.set('maxPrice', maxPrice)
    params.set('page', pagination.page.toString())
    params.set('limit', pagination.limit.toString())

    const apiUrl = `/api/products?${params.toString()}`
    console.log('🔴 Fetching products from:', apiUrl)

    fetch(apiUrl)
      .then((res) => {
        console.log('🔴 Products API response status:', res.status)
        if (!res.ok) {
          throw new Error(`API returned ${res.status}`)
        }
        return res.json()
      })
      .then((data: ProductsResponse) => {
        console.log('🔴 Products fetched:', data.products?.length || 0, 'Total:', data.pagination?.total || 0)
        setProducts(data.products || [])
        setPagination(data.pagination || pagination)
        setLoading(false)
      })
      .catch((err) => {
        console.error('❌ Error fetching products:', err)
        setLoading(false)
      })
  }, [selectedCategory, selectedSubcategory, selectedSecondSubcategory, searchQuery, minPrice, maxPrice, pagination.page])

  const handleFilterChange = (filterType: string, value: string) => {
    console.log('🟢 handleFilterChange called:', filterType, value)
    
    // Reset dependent filters
    if (filterType === 'category') {
      setSelectedSubcategory('')
      setSelectedSecondSubcategory('')
      setSelectedCategory(value)
      console.log('🟢 Category changed to:', value)
    } else if (filterType === 'subcategory') {
      setSelectedSecondSubcategory('')
      setSelectedSubcategory(value)
      console.log('🟢 Subcategory changed to:', value)
    } else if (filterType === 'secondSubcategory') {
      setSelectedSecondSubcategory(value)
      console.log('🟢 Second Subcategory changed to:', value)
    }

    // Update URL params (keep both formats for compatibility)
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      // Set both old format (category, subcategory) and new format (categoryId, subcategoryId)
      params.set(filterType, value)
      if (filterType === 'category') {
        params.set('categoryId', value)
      } else if (filterType === 'subcategory') {
        params.set('subcategoryId', value)
      } else if (filterType === 'secondSubcategory') {
        params.set('secondSubcategoryId', value)
      }
    } else {
      params.delete(filterType)
      // Also delete the ID format
      if (filterType === 'category') {
        params.delete('categoryId')
      } else if (filterType === 'subcategory') {
        params.delete('subcategoryId')
      } else if (filterType === 'secondSubcategory') {
        params.delete('secondSubcategoryId')
      }
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
    if (!selectedCategory) return undefined
    
    // First try to find in loaded categories (these have subcategories from API)
    let category = categories.find((c) => c.id === selectedCategory)
    
    if (category && category.subcategories && category.subcategories.length > 0) {
      console.log('🔵 getSelectedCategory - Found in loaded categories with subcategories:', category.name, category.subcategories.length)
      return category
    }
    
    // Try to find by name match in loaded categories
    const selectedCatName = getMainCategories().find(c => c.id === selectedCategory)?.name
    if (selectedCatName) {
      category = categories.find((c) => c.name.toUpperCase() === selectedCatName.toUpperCase())
      if (category && category.subcategories && category.subcategories.length > 0) {
        console.log('🔵 getSelectedCategory - Found by name in loaded categories with subcategories:', category.name)
        return category
      }
    }
    
    // If not found in loaded categories, use fallback categories (these have complete subcategories)
    category = fallbackCategories.find((c) => c.id === selectedCategory)
    
    if (category) {
      console.log('🔵 getSelectedCategory - Found in fallback categories:', category.name)
      console.log('🔵 getSelectedCategory - Has subcategories:', category.subcategories?.length || 0)
      if (category.subcategories && category.subcategories.length > 0) {
        console.log('🔵 getSelectedCategory - Subcategories:', category.subcategories.map(s => s.name))
      }
      return category
    }
    
    // Try to find by name in fallback categories
    if (selectedCatName) {
      category = fallbackCategories.find((c) => c.name.toUpperCase() === selectedCatName.toUpperCase())
      if (category) {
        console.log('🔵 getSelectedCategory - Found by name in fallback categories:', category.name)
        return category
      }
    }
    
    // If still not found, try main categories
    const mainCats = getMainCategories()
    category = mainCats.find((c) => c.id === selectedCategory)
    
    if (category) {
      console.log('🔵 getSelectedCategory - Found in main categories:', category.name)
      return category
    }
    
    console.log('🔵 getSelectedCategory - Category not found for:', selectedCategory)
    return undefined
  }

  const getSelectedSubcategory = () => {
    if (!selectedSubcategory) return undefined
    
    const category = getSelectedCategory()
    if (!category) {
      console.log('🔵 getSelectedSubcategory - No category found')
      return undefined
    }
    
    console.log('🔵 getSelectedSubcategory - Category:', category.name)
    console.log('🔵 getSelectedSubcategory - Category subcategories:', category.subcategories?.length || 0)
    
    // Try to find subcategory by ID
    let subcategory = category?.subcategories?.find((s) => s.id === selectedSubcategory)
    
    // If not found by ID, try to find by name
    if (!subcategory) {
      subcategory = category?.subcategories?.find((s) => {
        const subName = s.name.toUpperCase().trim()
        const selectedName = selectedSubcategory.toUpperCase().trim()
        return subName === selectedName || subName.includes(selectedName) || selectedName.includes(subName)
      })
    }
    
    // If still not found, try to find in fallback categories
    if (!subcategory) {
      const selectedCatName = getMainCategories().find(c => c.id === selectedCategory)?.name
      if (selectedCatName) {
        const fallbackCat = fallbackCategories.find(c => c.name.toUpperCase() === selectedCatName.toUpperCase())
        if (fallbackCat) {
          subcategory = fallbackCat.subcategories?.find((s) => s.id === selectedSubcategory)
          if (!subcategory) {
            subcategory = fallbackCat.subcategories?.find((s) => {
              const subName = s.name.toUpperCase().trim()
              const selectedName = selectedSubcategory.toUpperCase().trim()
              return subName === selectedName || subName.includes(selectedName) || selectedName.includes(subName)
            })
          }
        }
      }
    }
    
    if (subcategory) {
      console.log('🔵 getSelectedSubcategory - Found subcategory:', subcategory.name)
      console.log('🔵 getSelectedSubcategory - Has secondSubcategories:', subcategory.secondSubcategories?.length || 0)
      if (subcategory.secondSubcategories && subcategory.secondSubcategories.length > 0) {
        console.log('🔵 getSelectedSubcategory - Second subcategories:', subcategory.secondSubcategories.map(s => s.name))
      }
    } else {
      console.log('🔵 getSelectedSubcategory - Subcategory not found for:', selectedSubcategory)
      console.log('🔵 getSelectedSubcategory - Available subcategories:', category.subcategories?.map(s => s.name) || [])
    }
    
    return subcategory
  }

  // Update page title based on filters
  useEffect(() => {
    let title = 'Products - Allied Concept Beauty Supplies'
    
    if (selectedSecondSubcategory) {
      const secondSub = getSelectedSubcategory()?.secondSubcategories?.find(s => s.id === selectedSecondSubcategory)
      if (secondSub) {
        title = `${secondSub.name} - Allied Concept Beauty Supplies`
      }
    } else if (selectedSubcategory) {
      const sub = getSelectedSubcategory()
      if (sub) {
        title = `${sub.name} - Allied Concept Beauty Supplies`
      }
    } else if (selectedCategory) {
      const cat = getSelectedCategory()
      if (cat) {
        title = `${cat.name} - Allied Concept Beauty Supplies`
      }
    }
    
    document.title = title
  }, [selectedCategory, selectedSubcategory, selectedSecondSubcategory, categories])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <MainNav />

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full" style={{ paddingTop: `${topPadding + 32}px` }}>
        {/* Mobile Search Bar - Above Filters Row */}
        <div className="lg:hidden mb-4">
          <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-sm p-4">
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

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            {/* Mobile Filters Toggle Button - White Row (like black nav bar) */}
            <div className="lg:hidden bg-white rounded-lg shadow-sm mb-4">
              <button
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                className="w-full flex items-center justify-between px-4 py-4"
              >
                <span className="text-lg font-semibold text-gray-900">Filters</span>
                <svg
                  className={`w-5 h-5 text-gray-700 transition-transform duration-300 ${mobileFiltersOpen ? 'transform rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Filters Content - Collapsible on Mobile, Always visible on Desktop */}
            <div className={`bg-white rounded-lg shadow-sm ${mobileFiltersOpen ? 'block' : 'hidden'} lg:block p-6 sticky`} style={{ top: `${topPadding + 16}px` }}>
              <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] bg-clip-text text-transparent hidden lg:block">
                Filters
              </h2>

              {/* Search - Desktop Only */}
              <div className="mb-6 hidden lg:block">
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

              {/* Category Filter - Show 6 main categories */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    console.log('🔵 Category selected:', e.target.value)
                    handleFilterChange('category', e.target.value)
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#87CEEB]"
                >
                  <option value="">All Categories</option>
                  {getMainCategories().map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subcategory Filter - Always visible, shows subcategories of selected category */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">Subcategory</label>
                <select
                  value={selectedSubcategory}
                  onChange={(e) => {
                    console.log('🟡 Subcategory selected:', e.target.value)
                    handleFilterChange('subcategory', e.target.value)
                  }}
                  disabled={!selectedCategory || !getSelectedCategory()}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#87CEEB] disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {!selectedCategory 
                      ? 'Select a category first' 
                      : (!getSelectedCategory()?.subcategories || getSelectedCategory()?.subcategories?.length === 0)
                        ? 'Loading subcategories...'
                        : 'All Subcategories'}
                  </option>
                  {selectedCategory && getSelectedCategory()?.subcategories && getSelectedCategory()?.subcategories.length > 0 && getSelectedCategory()?.subcategories.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Second Subcategory Filter - Always visible, shows second subcategories of selected subcategory */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">Second Subcategory</label>
                <select
                  value={selectedSecondSubcategory}
                  onChange={(e) => {
                    console.log('🟠 Second Subcategory selected:', e.target.value)
                    handleFilterChange('secondSubcategory', e.target.value)
                  }}
                  disabled={!selectedSubcategory || !getSelectedSubcategory()}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#87CEEB] disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {!selectedSubcategory 
                      ? 'Select a subcategory first' 
                      : (!getSelectedSubcategory())
                        ? 'Loading...'
                        : (!getSelectedSubcategory()?.secondSubcategories || getSelectedSubcategory()?.secondSubcategories?.length === 0)
                          ? 'No second subcategory'
                          : 'All Second Subcategories'}
                  </option>
                  {selectedSubcategory && getSelectedSubcategory()?.secondSubcategories && getSelectedSubcategory()?.secondSubcategories.length > 0 && getSelectedSubcategory()?.secondSubcategories.map((second) => (
                    <option key={second.id} value={second.id}>
                      {second.name}
                    </option>
                  ))}
                </select>
              </div>

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

