'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import MegaMenu from './MegaMenu'
import { getProductUrl } from '@/lib/category-mapping'
import { useScroll } from '@/contexts/ScrollContext'

const menuData = {
  skincare: {
    byCategory: [
      'Face Masks',
      'Eye Care',
      'Tools & Accessories',
      'Massage & Contouring',
    ],
    byConcern: [
      'Redness',
      'Anti-Aging / Firming',
      'Dryness',
    ],
    bySkinType: [
      'Normal / All Skin Types',
    ],
  },
  spaProducts: [
    'Treatment Products (Waxing & Paraffin)',
    'Body Wraps & Spa Creams',
    'Hot Stones',
    'Spa Accessories',
    'Towels, Robes & Linens',
    'Slippers & Disposables',
    'Small Tools & Disposable Sundries',
    'Equipment',
    'Warmers & Hot Towel Cabinets',
  ],
  nailProducts: [
    'Nail Care (Cuticle & Treatments)',
    'Nail Files & Buffers',
    'Nail Art',
    'Tools & Equipment',
    'Pedicure Tools',
    'Stations & Storage',
    'Manicure & Pedicure Accessories',
    'Consumables & Disposables',
  ],
  equipment: [
    'Facial Equipment',
    'Styling Equipment',
    'Salon Equipment (Trolleys & Carts)',
    'Equipment Accessories (Stands & Bulbs)',
  ],
  implements: [
    'Hair Tools',
    'Scissors & Shears',
    'Skin Tools (Tweezers & Extraction)',
    'Nail Pushers & Implements',
    'Sterilization & Safety',
    'Disposables',
    'Bowls',
    'Medical & Treatment Disposables',
  ],
  furniture: [
    'Facial Bed Multipurpose',
    'Facial Massage Bed (White / Black)',
    'Salon Spa Rolling Tray with Accessories Holder',
  ],
}

interface Category {
  id: string
  name: string
  slug: string
  subcategories?: Subcategory[]
}

interface Subcategory {
  id: string
  name: string
  slug: string
  secondSubcategories?: SecondSubcategory[]
}

interface SecondSubcategory {
  id: string
  name: string
  slug: string
}

export default function MainNav() {
  const { isScrolledDown } = useScroll()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [headerHeight, setHeaderHeight] = useState(80) // Default height to prevent hydration issues
  const [categories, setCategories] = useState<Category[]>([])
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [expandedSubcategories, setExpandedSubcategories] = useState<Set<string>>(new Set())
  const [forceUpdate, setForceUpdate] = useState(0) // Force re-render

  useEffect(() => {
    const updateHeaderHeight = () => {
      const header = document.getElementById('main-header')
      if (header) {
        // Get the actual height of the header content (TopBar + MiddleBar)
        // Even when hidden, offsetHeight should give us the correct height
        const height = header.offsetHeight
        setHeaderHeight(height)
      }
    }
    
    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      updateHeaderHeight()
    })
    
    // Also update after a short delay to ensure all content is loaded
    const timeoutId = setTimeout(updateHeaderHeight, 100)
    
    window.addEventListener('resize', updateHeaderHeight)
    
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', updateHeaderHeight)
    }
  }, [])

  // Update header height when scroll state changes
  useEffect(() => {
    const updateHeaderHeight = () => {
      const header = document.getElementById('main-header')
      if (header) {
        // When header is visible, get its height
        // When hidden, we still need the height for when it comes back
        const height = header.offsetHeight
        setHeaderHeight(height)
      }
    }
    // Use requestAnimationFrame to ensure DOM updates are complete
    requestAnimationFrame(() => {
      updateHeaderHeight()
    })
  }, [isScrolledDown])

  // Fetch categories for mobile menu
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
        console.log('MainNav: Categories loaded:', fetchedCategories.length)
        if (fetchedCategories.length > 0) {
          console.log('MainNav: First category:', fetchedCategories[0])
          console.log('MainNav: First category subcategories:', fetchedCategories[0].subcategories)
          if (fetchedCategories[0].subcategories && fetchedCategories[0].subcategories.length > 0) {
            console.log('MainNav: First category has', fetchedCategories[0].subcategories.length, 'subcategories')
            console.log('MainNav: First subcategory:', fetchedCategories[0].subcategories[0])
          } else {
            console.log('MainNav: WARNING - First category has NO subcategories!')
          }
        }
      })
      .catch((err) => {
        console.error('Error fetching categories:', err)
        setCategories([])
      })
  }, [])

  const toggleCategory = (categoryId: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    console.log('🟢 toggleCategory called with:', categoryId)
    setExpandedCategories((prev) => {
      const newExpanded = new Set(prev)
      const wasExpanded = newExpanded.has(categoryId)
      if (wasExpanded) {
        newExpanded.delete(categoryId)
        console.log('🟢 Removing category from expanded set')
      } else {
        newExpanded.add(categoryId)
        console.log('🟢 Adding category to expanded set')
      }
      console.log('🟢 New expanded set:', Array.from(newExpanded))
      console.log('🟢 Category is now expanded:', newExpanded.has(categoryId))
      setForceUpdate(prev => prev + 1) // Force re-render
      return newExpanded
    })
  }

  const toggleSubcategory = (subcategoryId: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    console.log('🟡 toggleSubcategory called with:', subcategoryId)
    setExpandedSubcategories((prev) => {
      const newExpanded = new Set(prev)
      const wasExpanded = newExpanded.has(subcategoryId)
      if (wasExpanded) {
        newExpanded.delete(subcategoryId)
        console.log('🟡 Removing subcategory from expanded set')
      } else {
        newExpanded.add(subcategoryId)
        console.log('🟡 Adding subcategory to expanded set')
      }
      console.log('🟡 New expanded subcategories set:', Array.from(newExpanded))
      setForceUpdate(prev => prev + 1) // Force re-render
      return newExpanded
    })
  }

  return (
    <nav id="main-nav" className={`bg-black text-white fixed left-0 right-0 transition-all duration-300 ${isScrolledDown ? 'z-50' : 'z-30'}`} style={{ top: isScrolledDown ? '0px' : `${headerHeight}px` }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Navigation - Hidden on mobile */}
        <div className="hidden md:flex items-center justify-center space-x-1">
          <MegaMenu title="SKINCARE">
            <div className="grid grid-cols-3 gap-12">
              <div>
                <Link href={getProductUrl('SKINCARE', true)} className="text-gray-900 font-semibold text-base mb-4 block hover:text-primary-400 transition-colors duration-300">
                  All Skincare &gt;
                </Link>
                <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">By Category</h3>
                <ul className="space-y-2.5">
                  {menuData.skincare.byCategory.map((item) => (
                    <li key={item}>
                      <Link href={getProductUrl(item)} className="text-gray-700 hover:text-primary-400 transition-colors duration-300 text-sm">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">By Concern</h3>
                <ul className="space-y-2.5">
                  {menuData.skincare.byConcern.map((item) => (
                    <li key={item}>
                      <Link href={getProductUrl(item)} className="text-gray-700 hover:text-primary-400 transition-colors duration-300 text-sm">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">By Skin Type</h3>
                <ul className="space-y-2.5">
                  {menuData.skincare.bySkinType.map((item) => (
                    <li key={item}>
                      <Link href={getProductUrl(item)} className="text-gray-700 hover:text-primary-400 transition-colors duration-300 text-sm">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </MegaMenu>

          <MegaMenu title="SPA PRODUCTS">
            <div className="grid grid-cols-3 gap-12">
              <div>
                <Link href={getProductUrl('SPA PRODUCTS', true)} className="text-gray-900 font-semibold text-base mb-4 block hover:text-primary-400 transition-colors duration-300">
                  All Spa Products &gt;
                </Link>
                <ul className="space-y-2.5">
                  {menuData.spaProducts.slice(0, 3).map((item) => (
                    <li key={item}>
                      <Link href={getProductUrl(item)} className="text-gray-700 hover:text-primary-400 transition-colors duration-300 text-sm">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <ul className="space-y-2.5 mt-8">
                  {menuData.spaProducts.slice(3, 6).map((item) => (
                    <li key={item}>
                      <Link href={getProductUrl(item)} className="text-gray-700 hover:text-primary-400 transition-colors duration-300 text-sm">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <ul className="space-y-2.5 mt-8">
                  {menuData.spaProducts.slice(6).map((item) => (
                    <li key={item}>
                      <Link href={getProductUrl(item)} className="text-gray-700 hover:text-primary-400 transition-colors duration-300 text-sm">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </MegaMenu>

          <MegaMenu title="NAIL PRODUCTS">
            <div className="grid grid-cols-2 gap-12">
              <div>
                <Link href={getProductUrl('NAIL PRODUCTS', true)} className="text-gray-900 font-semibold text-base mb-4 block hover:text-primary-400 transition-colors duration-300">
                  All Nail Products &gt;
                </Link>
                <ul className="space-y-2.5">
                  {menuData.nailProducts.slice(0, 4).map((item) => (
                    <li key={item}>
                      <Link href={getProductUrl(item)} className="text-gray-700 hover:text-primary-400 transition-colors duration-300 text-sm">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <ul className="space-y-2.5 mt-8">
                  {menuData.nailProducts.slice(4).map((item) => (
                    <li key={item}>
                      <Link href={getProductUrl(item)} className="text-gray-700 hover:text-primary-400 transition-colors duration-300 text-sm">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </MegaMenu>

          <MegaMenu title="EQUIPMENT">
            <div className="grid grid-cols-2 gap-12">
              <div>
                <Link href={getProductUrl('EQUIPMENT', true)} className="text-gray-900 font-semibold text-base mb-4 block hover:text-primary-400 transition-colors duration-300">
                  All Equipment &gt;
                </Link>
                <ul className="space-y-2.5">
                  {menuData.equipment.map((item) => (
                    <li key={item}>
                      <Link href={getProductUrl(item)} className="text-gray-700 hover:text-primary-400 transition-colors duration-300 text-sm">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </MegaMenu>

          <MegaMenu title="IMPLEMENTS">
            <div className="grid grid-cols-2 gap-12">
              <div>
                <Link href={getProductUrl('IMPLEMENTS', true)} className="text-gray-900 font-semibold text-base mb-4 block hover:text-primary-400 transition-colors duration-300">
                  All Implements &gt;
                </Link>
                <ul className="space-y-2.5">
                  {menuData.implements.slice(0, 4).map((item) => (
                    <li key={item}>
                      <Link href={getProductUrl(item)} className="text-gray-700 hover:text-primary-400 transition-colors duration-300 text-sm">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <ul className="space-y-2.5 mt-8">
                  {menuData.implements.slice(4).map((item) => (
                    <li key={item}>
                      <Link href={getProductUrl(item)} className="text-gray-700 hover:text-primary-400 transition-colors duration-300 text-sm">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </MegaMenu>

          <MegaMenu title="FURNITURE">
            <div className="grid grid-cols-1 gap-12">
              <div>
                <Link href={getProductUrl('FURNITURE', true)} className="text-gray-900 font-semibold text-base mb-4 block hover:text-primary-400 transition-colors duration-300">
                  All Furniture &gt;
                </Link>
                <ul className="space-y-2.5">
                  {menuData.furniture.map((item) => (
                    <li key={item}>
                      <Link href={getProductUrl(item)} className="text-gray-700 hover:text-primary-400 transition-colors duration-300 text-sm">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </MegaMenu>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-full py-4 flex items-center justify-between"
          >
            <span className="font-medium">Categories</span>
            <svg
              className={`w-5 h-5 transition-transform ${mobileMenuOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {mobileMenuOpen && (
            <div className="pb-4 space-y-1">
              {categories && categories.length > 0 ? (
                categories.map((category) => {
                  const hasSubcategories = category.subcategories && category.subcategories.length > 0
                  const isExpanded = expandedCategories.has(category.id)
                  
                  return (
                    <div key={category.id} className="border-b border-gray-800">
                      {hasSubcategories ? (
                        <>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              console.log('🔵 Button clicked for category:', category.id, category.name)
                              console.log('🔵 Has subcategories:', hasSubcategories)
                              console.log('🔵 Subcategories array:', category.subcategories)
                              console.log('🔵 Current expanded state:', Array.from(expandedCategories))
                              toggleCategory(category.id, e)
                              // Force re-render check
                              setTimeout(() => {
                                console.log('🔵 After toggle, expanded state:', Array.from(expandedCategories))
                              }, 100)
                            }}
                            className="w-full flex items-center py-3 px-4 hover:bg-gray-900 rounded transition-colors duration-300 font-medium"
                          >
                            <svg
                              className={`w-5 h-5 mr-3 transition-transform flex-shrink-0 ${isExpanded ? 'transform rotate-90' : ''}`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            <span className="flex-1 text-left">{category.name}</span>
                          </button>
                          {isExpanded && hasSubcategories && category.subcategories && category.subcategories.length > 0 && (
                            <div className="pl-4 pb-2 space-y-1 bg-gray-800/30">
                              <div className="text-xs text-gray-400 mb-1">Subcategories ({category.subcategories.length}):</div>
                              {category.subcategories.map((subcategory) => {
                                const hasSecondSubcategories = subcategory.secondSubcategories && subcategory.secondSubcategories.length > 0
                                const isSubExpanded = expandedSubcategories.has(subcategory.id)
                                
                                return (
                                  <div key={subcategory.id} className="border-b border-gray-700">
                                    {hasSecondSubcategories ? (
                                      <>
                                        <button
                                          type="button"
                                          onClick={(e) => toggleSubcategory(subcategory.id, e)}
                                          className="w-full flex items-center py-2 px-4 hover:bg-gray-900 rounded transition-colors duration-300 text-sm"
                                        >
                                          <svg
                                            className={`w-4 h-4 mr-3 transition-transform flex-shrink-0 ${isSubExpanded ? 'transform rotate-90' : ''}`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                          </svg>
                                          <span className="flex-1 text-left">{subcategory.name}</span>
                                        </button>
                                        {isSubExpanded && hasSecondSubcategories && (
                                          <div className="pl-4 pb-2">
                                            {subcategory.secondSubcategories.map((secondSubcategory) => (
                                              <Link
                                                key={secondSubcategory.id}
                                                href={`/products?secondSubcategoryId=${secondSubcategory.id}`}
                                                className="block py-2 px-4 hover:bg-gray-900 rounded transition-colors duration-300 text-sm text-gray-300"
                                                onClick={() => setMobileMenuOpen(false)}
                                              >
                                                {secondSubcategory.name}
                                              </Link>
                                            ))}
                                          </div>
                                        )}
                                      </>
                                    ) : (
                                      <Link
                                        href={`/products?subcategoryId=${subcategory.id}`}
                                        className="block py-2 px-4 hover:bg-gray-900 rounded transition-colors duration-300 text-sm"
                                        onClick={() => setMobileMenuOpen(false)}
                                      >
                                        {subcategory.name}
                                      </Link>
                                    )}
                                  </div>
                                )
                              })}
                              <Link
                                href={`/products?categoryId=${category.id}`}
                                className="block py-2 pl-4 text-primary-400 text-sm font-medium hover:underline"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                View All {category.name}
                              </Link>
                            </div>
                          )}
                        </>
                      ) : (
                        <Link
                          href={`/products?categoryId=${category.id}`}
                          className="flex items-center py-3 px-4 hover:bg-gray-900 rounded transition-colors duration-300 font-medium"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <svg
                            className="w-5 h-5 mr-3 flex-shrink-0 opacity-50"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                          <span className="flex-1 text-left">{category.name}</span>
                        </Link>
                      )}
                    </div>
                  )
                })
              ) : (
                // Fallback to static menu if categories not loaded - Show with arrows but no subcategories
                <>
                  <div className="border-b border-gray-800">
                    <Link
                      href={getProductUrl('SKINCARE', true)}
                      className="flex items-center py-3 px-4 hover:bg-gray-900 rounded transition-colors duration-300 font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <svg
                        className="w-5 h-5 mr-3 flex-shrink-0 opacity-50"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <span className="flex-1 text-left">SKINCARE</span>
                    </Link>
                  </div>
                  <div className="border-b border-gray-800">
                    <Link
                      href={getProductUrl('SPA PRODUCTS', true)}
                      className="flex items-center py-3 px-4 hover:bg-gray-900 rounded transition-colors duration-300 font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <svg
                        className="w-5 h-5 mr-3 flex-shrink-0 opacity-50"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <span className="flex-1 text-left">SPA PRODUCTS</span>
                    </Link>
                  </div>
                  <div className="border-b border-gray-800">
                    <Link
                      href={getProductUrl('NAIL PRODUCTS', true)}
                      className="flex items-center py-3 px-4 hover:bg-gray-900 rounded transition-colors duration-300 font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <svg
                        className="w-5 h-5 mr-3 flex-shrink-0 opacity-50"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <span className="flex-1 text-left">NAIL PRODUCTS</span>
                    </Link>
                  </div>
                  <div className="border-b border-gray-800">
                    <Link
                      href={getProductUrl('EQUIPMENT', true)}
                      className="flex items-center py-3 px-4 hover:bg-gray-900 rounded transition-colors duration-300 font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <svg
                        className="w-5 h-5 mr-3 flex-shrink-0 opacity-50"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <span className="flex-1 text-left">EQUIPMENT</span>
                    </Link>
                  </div>
                  <div className="border-b border-gray-800">
                    <Link
                      href={getProductUrl('IMPLEMENTS', true)}
                      className="flex items-center py-3 px-4 hover:bg-gray-900 rounded transition-colors duration-300 font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <svg
                        className="w-5 h-5 mr-3 flex-shrink-0 opacity-50"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <span className="flex-1 text-left">IMPLEMENTS</span>
                    </Link>
                  </div>
                  <div className="border-b border-gray-800">
                    <Link
                      href={getProductUrl('FURNITURE', true)}
                      className="flex items-center py-3 px-4 hover:bg-gray-900 rounded transition-colors duration-300 font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <svg
                        className="w-5 h-5 mr-3 flex-shrink-0 opacity-50"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <span className="flex-1 text-left">FURNITURE</span>
                    </Link>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

