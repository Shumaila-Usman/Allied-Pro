'use client'

import { useState, useEffect, useRef } from 'react'
import { useScroll } from '@/contexts/ScrollContext'
import MiddleBar from './MiddleBar'
import Link from 'next/link'
import { getProductUrl } from '@/lib/category-mapping'

interface Category {
  id: string
  _id?: string | { toString(): string }
  name: string
  slug: string
  level: number
  subcategories?: Category[]
  secondSubcategories?: Category[]
}

export default function Header() {
  const { isScrolledDown } = useScroll()
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [mainCategoryMap, setMainCategoryMap] = useState<Record<string, string>>({})
  const dropdownRef = useRef<HTMLDivElement>(null)

  const mainCategories = [
    'EQUIPMENT',
    'IMPLEMENTS',
    'NAIL PRODUCTS',
    'SPA PRODUCTS',
    'FURNITURE',
    'SKINCARE'
  ]

  // Fetch categories and map main categories to their IDs
  useEffect(() => {
    fetch('/api/categories')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch categories')
        }
        return res.json()
      })
      .then((data) => {
        const fetchedCategories = data.categories || []
        setCategories(fetchedCategories)
        
        // Map main category names to their IDs
        const categoryMap: Record<string, string> = {}
        fetchedCategories.forEach((cat: Category) => {
          if (cat.level === 0) {
            // Map category name to its ID
            const categoryName = cat.name.toUpperCase()
            if (mainCategories.includes(categoryName)) {
              categoryMap[categoryName] = cat.id || cat._id?.toString() || ''
            }
          }
        })
        setMainCategoryMap(categoryMap)
      })
      .catch((err) => {
        console.error('Error fetching categories:', err)
        setCategories([])
      })
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setCategoriesDropdownOpen(false)
      }
    }

    if (categoriesDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [categoriesDropdownOpen])

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ease-in-out ${
        isScrolledDown 
          ? 'bg-transparent h-0 overflow-hidden' 
          : 'bg-white'
      }`} 
      id="main-header"
    >
      <div className={`transition-all duration-300 ease-in-out ${
        isScrolledDown 
          ? '-translate-y-full opacity-0 pointer-events-none' 
          : 'translate-y-0 opacity-100 pointer-events-auto'
      }`}>
        <MiddleBar />
        {/* Black Row with Categories Dropdown - Mobile Only */}
        <div className="md:hidden bg-black w-full relative" ref={dropdownRef}>
          <div className="flex items-center justify-between px-4 py-2">
            <span className="text-white font-medium">Categories</span>
            <button
              onClick={() => setCategoriesDropdownOpen(!categoriesDropdownOpen)}
              className="text-white hover:text-gray-300 transition-colors duration-300"
            >
              <svg
                className={`w-4 h-4 transition-transform duration-300 ${categoriesDropdownOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Dropdown Menu */}
          {categoriesDropdownOpen && (
            <div className="absolute top-full left-0 right-0 bg-black shadow-lg max-h-[70vh] overflow-y-auto z-50">
              <div className="px-4 py-4 space-y-1">
                {/* Main Categories */}
                <div className="mb-4 pb-4 border-b border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">Main Categories</h3>
                  {mainCategories.map((category) => {
                    // Use slug-based URL (getProductUrl handles the mapping correctly)
                    // This ensures compatibility with the API which expects slugs
                    const href = getProductUrl(category, true)
                    
                    return (
                      <Link
                        key={category}
                        href={href}
                        onClick={() => setCategoriesDropdownOpen(false)}
                        className="block w-full py-2 text-left text-white font-medium hover:text-gray-300 transition-colors"
                      >
                        {category}
                      </Link>
                    )
                  })}
                </div>

                {/* Database Categories */}
                {categories && categories.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">All Categories</h3>
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/products?categoryId=${category.id}`}
                        onClick={() => setCategoriesDropdownOpen(false)}
                        className="block w-full py-2 text-left text-gray-300 hover:text-white transition-colors border-b border-gray-800"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}


