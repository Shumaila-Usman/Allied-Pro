'use client'

import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import LoginModal from '../LoginModal'
import { getProductUrl } from '@/lib/category-mapping'

interface Category {
  id: string
  name: string
  slug: string
  level: number
  subcategories?: Category[]
  secondSubcategories?: Category[]
}

export default function MiddleBar() {
  const router = useRouter()
  const { isLoggedIn, user, logout, isDealer } = useAuth()
  const { wishlistItems, cartItems, getCartItemCount, getCartTotal, removeFromCart, updateCartQuantity, removeFromWishlist } = useCart()
  const [showWishlistDropdown, setShowWishlistDropdown] = useState(false)
  const [showCartDropdown, setShowCartDropdown] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [showHamburgerDropdown, setShowHamburgerDropdown] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileUserSidebarOpen, setMobileUserSidebarOpen] = useState(false)
  const [mobileLinksSidebarOpen, setMobileLinksSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [expandedSubcategories, setExpandedSubcategories] = useState<Set<string>>(new Set())

  const wishlistRef = useRef<HTMLDivElement>(null)
  const cartRef = useRef<HTMLDivElement>(null)
  const userRef = useRef<HTMLDivElement>(null)
  const hamburgerRef = useRef<HTMLDivElement>(null)

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
        setCategories(data.categories || [])
      })
      .catch((err) => {
        console.error('Error fetching categories:', err)
        setCategories([]) // Set empty array on error to prevent crashes
      })
  }, [])

  // Prevent body scroll when mobile sidebars are open
  useEffect(() => {
    if (mobileMenuOpen || mobileUserSidebarOpen || mobileLinksSidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen, mobileUserSidebarOpen, mobileLinksSidebarOpen])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wishlistRef.current && !wishlistRef.current.contains(event.target as Node)) {
        setShowWishlistDropdown(false)
      }
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setShowCartDropdown(false)
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false)
      }
      if (hamburgerRef.current && !hamburgerRef.current.contains(event.target as Node)) {
        setShowHamburgerDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  const toggleSubcategory = (subcategoryId: string) => {
    const newExpanded = new Set(expandedSubcategories)
    if (newExpanded.has(subcategoryId)) {
      newExpanded.delete(subcategoryId)
    } else {
      newExpanded.add(subcategoryId)
    }
    setExpandedSubcategories(newExpanded)
  }

  // Get current day name
  const getDayName = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    return days[new Date().getDay()]
  }

  // Handle search
  const handleSearch = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault()
    }
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  // Handle Enter key press in search
  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <>
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 relative">
          {/* Mobile Layout: Logo left, Icons right */}
          <div className="md:hidden flex items-center justify-between w-full">
            {/* Logo - Left */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <div className="relative h-12 w-36 sm:h-14 sm:w-44">
                  <Image
                    src="/logo-removebg-preview.png"
                    alt="ACBS - Allied Concept Beauty Supply"
                    width={192}
                    height={64}
                    className="object-contain h-full w-auto bg-transparent"
                    priority
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = '<div class="h-10 w-28 sm:h-12 sm:w-36 gradient-primary rounded-lg flex items-center justify-center text-white font-bold text-sm sm:text-base">ACBS</div>';
                      }
                    }}
                  />
                </div>
              </Link>
            </div>

            {/* Right Side - Icons */}
            <div className="flex items-center space-x-1 sm:space-x-2 z-10">
            {/* User Icon - Opens Sidebar on Mobile */}
            <button 
              onClick={() => {
                setMobileUserSidebarOpen(true)
                setMobileMenuOpen(false)
                setMobileLinksSidebarOpen(false)
              }}
              className="p-1.5 sm:p-2 text-gray-700 hover:text-primary-400 transition-colors duration-300"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>

            {/* Second Hamburger - Links Menu */}
            <button
              className="p-1.5 sm:p-2 text-gray-700 hover:text-primary-400 transition-colors duration-300"
              onClick={() => {
                setMobileLinksSidebarOpen(true)
                setMobileMenuOpen(false)
                setMobileUserSidebarOpen(false)
              }}
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            </div>
          </div>

          {/* Desktop Layout: Logo left, Search center, Icons right */}
          <div className="hidden md:flex items-center w-full">
            {/* Logo and Search Bar Group */}
            <div className="flex items-center gap-0">
              {/* Logo */}
              <Link 
                href="/" 
                className="flex-shrink-0 inline-block"
                style={{ lineHeight: 0 }}
              >
                <div className="relative h-14 w-40 lg:h-16 lg:w-48 overflow-hidden">
                  <Image
                    src="/logo-removebg-preview.png"
                    alt="ACBS - Allied Concept Beauty Supply"
                    width={192}
                    height={64}
                    className="object-contain h-full w-full bg-transparent"
                    priority
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = '<div class="h-10 w-28 lg:h-12 lg:w-32 gradient-primary rounded-lg flex items-center justify-center text-white font-bold text-base lg:text-xl">ACBS</div>';
                      }
                    }}
                  />
                </div>
              </Link>

              {/* Search Bar */}
              <div className="flex-1 max-w-xl">
              <form onSubmit={handleSearch} className="w-full relative">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm lg:text-base"
                />
                <button 
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-400"
                >
                  <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </form>
              </div>

              {/* Navigation Links */}
              <div className="flex items-center gap-4 lg:gap-5 flex-shrink-0 ml-5">
              {/* About Us */}
              <Link
                href="/about-us"
                className="flex items-center gap-1.5 text-sm text-gray-700 hover:text-primary-400 transition-colors duration-300 whitespace-nowrap"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>About Us</span>
              </Link>

              {/* Contact Us */}
              <Link
                href="/contact"
                className="flex items-center gap-1.5 text-sm text-gray-700 hover:text-primary-400 transition-colors duration-300 whitespace-nowrap"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Contact Us</span>
              </Link>

              {/* FAQs */}
              <Link
                href="/faq"
                className="flex items-center gap-1.5 text-sm text-gray-700 hover:text-primary-400 transition-colors duration-300 whitespace-nowrap"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>FAQs</span>
              </Link>

              {/* Training & Education */}
              <Link
                href="/training-education"
                className="flex items-center gap-1.5 text-sm text-gray-700 hover:text-primary-400 transition-colors duration-300 whitespace-nowrap"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span>Training & Education</span>
              </Link>

              {/* Sales and Offers */}
              <Link
                href="/sales-offers"
                className="flex items-center gap-1.5 text-sm text-gray-700 hover:text-primary-400 transition-colors duration-300 whitespace-nowrap"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span>Sales & Offers</span>
              </Link>
              </div>
            </div>

            {/* Icons */}
            <div className="flex items-center gap-3 lg:gap-4 flex-shrink-0 ml-[30px]">
              {/* User Icon */}
              <div className="relative" ref={userRef}>
            <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="p-2 text-gray-700 hover:text-primary-400 transition-colors duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50 transition-all duration-300">
                    {isLoggedIn ? (
                      <>
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center text-white font-bold">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">Hi, {user?.name || 'User'}!</p>
                            {user?.role === 'dealer' && (
                              <p className="text-xs text-gray-500">Dealer ID: {user.dealerId}</p>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Link
                            href="/account/settings"
                            className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-300"
                            onClick={() => setShowUserDropdown(false)}
                          >
                            Account Settings
                          </Link>
                          {isDealer && (
                            <>
                              <Link
                                href="/orders"
                                className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-300"
                                onClick={() => setShowUserDropdown(false)}
                              >
                                Your Orders
                              </Link>
                              <Link
                                href="/track-order"
                                className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-300"
                                onClick={() => setShowUserDropdown(false)}
                              >
                                Track Order
                              </Link>
                            </>
                          )}
                          <Link
                            href="/recent-searches"
                            className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-300"
                            onClick={() => setShowUserDropdown(false)}
                          >
                            Recent Searches
                          </Link>
                          <button
                            onClick={logout}
                            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-300"
                          >
                            Sign Out
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-center mb-4">
                          <p className="text-lg font-semibold text-gray-900 mb-1">
                            Happy {getDayName()}, Beautiful 🎉
                          </p>
                          <div className="w-16 h-16 gradient-primary rounded-full mx-auto flex items-center justify-center text-white text-2xl font-bold">
                            ✨
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Link
                            href="/sign-in"
                            className="block w-full gradient-primary text-white py-2 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity duration-300 text-center"
                            onClick={() => setShowUserDropdown(false)}
                          >
                            Sign In
                          </Link>
                          <Link
                            href="/create-account"
                            className="block w-full bg-white border-2 border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:border-primary-400 transition-colors duration-300 text-center"
                            onClick={() => setShowUserDropdown(false)}
                          >
                            Create Account
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Categories */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-[60] transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Menu */}
          <div className="md:hidden fixed inset-0 top-[64px] sm:top-[80px] bg-white z-[70] overflow-y-auto transform transition-transform duration-300 ease-in-out">
            <div className="px-4 py-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Categories</h2>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-1">
                {/* Main Navigation Categories */}
                <div className="mb-6 pb-4 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Main Categories</h3>
                  <Link
                    href={getProductUrl('EQUIPMENT', true)}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full py-3 text-left text-gray-900 font-medium hover:text-primary-400 transition-colors border-b border-gray-100"
                  >
                    EQUIPMENT
                  </Link>
                  <Link
                    href={getProductUrl('IMPLEMENTS', true)}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full py-3 text-left text-gray-900 font-medium hover:text-primary-400 transition-colors border-b border-gray-100"
                  >
                    IMPLEMENTS
                  </Link>
                  <Link
                    href={getProductUrl('NAIL PRODUCTS', true)}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full py-3 text-left text-gray-900 font-medium hover:text-primary-400 transition-colors border-b border-gray-100"
                  >
                    NAIL PRODUCTS
                  </Link>
                  <Link
                    href={getProductUrl('SPA PRODUCTS', true)}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full py-3 text-left text-gray-900 font-medium hover:text-primary-400 transition-colors border-b border-gray-100"
                  >
                    SPA PRODUCTS
                  </Link>
                  <Link
                    href={getProductUrl('FURNITURE', true)}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full py-3 text-left text-gray-900 font-medium hover:text-primary-400 transition-colors border-b border-gray-100"
                  >
                    FURNITURE
                  </Link>
                  <Link
                    href={getProductUrl('SKINCARE', true)}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full py-3 text-left text-gray-900 font-medium hover:text-primary-400 transition-colors"
                  >
                    SKINCARE
                  </Link>
                </div>
                {/* Database Categories */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">All Categories</h3>
                </div>
                {categories && categories.length > 0 ? categories.map((category) => (
                  <div key={category.id} className="border-b border-gray-200">
                    {category.subcategories && category.subcategories.length > 0 ? (
                      <button
                        onClick={() => toggleCategory(category.id)}
                        className="w-full flex items-center justify-between py-3 text-left text-gray-900 font-medium hover:text-primary-400 transition-colors"
                      >
                        <span>{category.name}</span>
                        <svg
                          className={`w-5 h-5 transition-transform ${expandedCategories.has(category.id) ? 'transform rotate-90' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    ) : (
                      <Link
                        href={`/products?categoryId=${category.id}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full flex items-center justify-between py-3 text-left text-gray-900 font-medium hover:text-primary-400 transition-colors"
                      >
                        <span>{category.name}</span>
                      </Link>
                    )}
                    {expandedCategories.has(category.id) && category.subcategories && (
                      <div className="pl-4 pb-2">
                        {category.subcategories.map((subcategory) => (
                          <div key={subcategory.id} className="border-b border-gray-100">
                            {subcategory.secondSubcategories && subcategory.secondSubcategories.length > 0 ? (
                              <>
                                <button
                                  onClick={() => toggleSubcategory(subcategory.id)}
                                  className="w-full flex items-center justify-between py-2 text-left text-gray-700 text-sm hover:text-primary-400 transition-colors"
                                >
                                  <span>{subcategory.name}</span>
                                  <svg
                                    className={`w-4 h-4 transition-transform ${expandedSubcategories.has(subcategory.id) ? 'transform rotate-90' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </button>
                                {expandedSubcategories.has(subcategory.id) && (
                                  <div className="pl-4 pb-2">
                                    {subcategory.secondSubcategories.map((secondSubcategory) => (
                                      <Link
                                        key={secondSubcategory.id}
                                        href={`/products?secondSubcategoryId=${secondSubcategory.id}`}
                                        className="block py-2 text-gray-600 text-sm hover:text-primary-400 transition-colors"
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
                                onClick={() => setMobileMenuOpen(false)}
                                className="w-full flex items-center justify-between py-2 text-left text-gray-700 text-sm hover:text-primary-400 transition-colors"
                              >
                                <span>{subcategory.name}</span>
                              </Link>
                            )}
                          </div>
                        ))}
                        <Link
                          href={`/products?categoryId=${category.id}`}
                          className="block py-2 pl-4 text-primary-400 text-sm font-medium hover:underline"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          View All {category.name}
                        </Link>
                      </div>
                    )}
                  </div>
                )) : (
                  <div className="py-8 text-center text-gray-500">
                    <p>No categories available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Mobile User Sidebar */}
      {mobileUserSidebarOpen && typeof window !== 'undefined' && createPortal(
        <>
          {/* Backdrop */}
          <div 
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-[9998] transition-opacity duration-300"
            onClick={() => setMobileUserSidebarOpen(false)}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
          />
          {/* Sidebar */}
          <div 
            className="md:hidden fixed bg-white z-[9999] overflow-y-auto shadow-2xl" 
            style={{ 
              position: 'fixed',
              right: 0, 
              top: 0, 
              bottom: 0, 
              width: '85vw', 
              maxWidth: '384px', 
              minWidth: '280px',
              zIndex: 9999
            }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Account</h2>
                <button
                  onClick={() => setMobileUserSidebarOpen(false)}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {isLoggedIn ? (
                <>
                  <div className="flex items-center space-x-3 mb-6 pb-6 border-b border-gray-200">
                    <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center text-white font-bold text-base">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900 text-base truncate">Hi, {user?.name || 'User'}!</p>
                      {user?.role === 'dealer' && (
                        <p className="text-xs text-gray-500 truncate">Dealer ID: {user.dealerId}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Link
                      href="/account/settings"
                      className="block w-full text-left px-4 py-3 text-base text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-300"
                      onClick={() => setMobileUserSidebarOpen(false)}
                    >
                      Account Settings
                    </Link>
                    {isDealer && (
                      <>
                        <Link
                          href="/orders"
                          className="block w-full text-left px-4 py-3 text-base text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-300"
                          onClick={() => setMobileUserSidebarOpen(false)}
                        >
                          Your Orders
                        </Link>
                        <Link
                          href="/track-order"
                          className="block w-full text-left px-4 py-3 text-base text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-300"
                          onClick={() => setMobileUserSidebarOpen(false)}
                        >
                          Track Order
                        </Link>
                      </>
                    )}
                    <Link
                      href="/recent-searches"
                      className="block w-full text-left px-4 py-3 text-base text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-300"
                      onClick={() => setMobileUserSidebarOpen(false)}
                    >
                      Recent Searches
                    </Link>
                    <button
                      onClick={() => {
                        logout()
                        setMobileUserSidebarOpen(false)
                      }}
                      className="w-full text-left px-4 py-3 text-base text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-300"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center mb-6 pb-6 border-b border-gray-200">
                    <p className="text-lg font-semibold text-gray-900 mb-2">
                      Happy {getDayName()}, Beautiful 🎉
                    </p>
                    <div className="w-16 h-16 gradient-primary rounded-full mx-auto flex items-center justify-center text-white text-2xl font-bold">
                      ✨
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Link
                      href="/sign-in"
                      className="block w-full gradient-primary text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity duration-300 text-center"
                      onClick={() => setMobileUserSidebarOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/create-account"
                      className="block w-full bg-white border-2 border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:border-primary-400 transition-colors duration-300 text-center"
                      onClick={() => setMobileUserSidebarOpen(false)}
                    >
                      Create Account
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </>,
        document.body
      )}

      {/* Mobile Links Sidebar */}
      {mobileLinksSidebarOpen && typeof window !== 'undefined' && createPortal(
        <>
          {/* Backdrop */}
          <div 
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-[9998] transition-opacity duration-300"
            onClick={() => setMobileLinksSidebarOpen(false)}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
          />
          {/* Sidebar */}
          <div 
            className="md:hidden fixed bg-white z-[9999] overflow-y-auto shadow-2xl" 
            style={{ 
              position: 'fixed',
              right: 0, 
              top: 0, 
              bottom: 0, 
              width: '85vw', 
              maxWidth: '384px', 
              minWidth: '280px',
              zIndex: 9999
            }}
          >
            <div className="px-4 py-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Menu</h2>
                <button
                  onClick={() => setMobileLinksSidebarOpen(false)}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Links */}
              <div className="space-y-1">
                <Link
                  href="/about-us"
                  className="block w-full text-left px-4 py-3 text-base text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-300"
                  onClick={() => setMobileLinksSidebarOpen(false)}
                >
                  About Us
                </Link>
                <Link
                  href="/contact"
                  className="block w-full text-left px-4 py-3 text-base text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-300"
                  onClick={() => setMobileLinksSidebarOpen(false)}
                >
                  Contact Us
                </Link>
                <Link
                  href="/faq"
                  className="block w-full text-left px-4 py-3 text-base text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-300"
                  onClick={() => setMobileLinksSidebarOpen(false)}
                >
                  FAQs
                </Link>
                <Link
                  href="/training-education"
                  className="block w-full text-left px-4 py-3 text-base text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-300"
                  onClick={() => setMobileLinksSidebarOpen(false)}
                >
                  Training & Education
                </Link>
              </div>
            </div>
          </div>
        </>,
        document.body
      )}
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </>
  )
}

