'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import Link from 'next/link'
import Image from 'next/image'
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
          <div className="hidden md:flex items-center justify-between w-full">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <div className="relative h-14 w-40 lg:h-16 lg:w-48">
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
                        parent.innerHTML = '<div class="h-10 w-28 lg:h-12 lg:w-32 gradient-primary rounded-lg flex items-center justify-center text-white font-bold text-base lg:text-xl">ACBS</div>';
                      }
                    }}
                  />
                </div>
              </Link>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-4 lg:mx-8">
              <div className="w-full relative">
                <input
                  type="text"
                  placeholder="Search products, brands, categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 lg:px-4 py-2 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm lg:text-base"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-400">
                  <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Icons */}
            <div className="flex items-center space-x-2 lg:space-x-4">
              {/* Hamburger Menu */}
              <div className="relative" ref={hamburgerRef}>
                <button 
                  onClick={() => setShowHamburgerDropdown(!showHamburgerDropdown)}
                  className="p-2 text-gray-700 hover:text-primary-400 transition-colors duration-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                {showHamburgerDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50 transition-all duration-300">
                    <div className="py-2">
                      <Link
                        href="/about-us"
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-300"
                        onClick={() => setShowHamburgerDropdown(false)}
                      >
                        About Us
                      </Link>
                      <Link
                        href="/contact"
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-300"
                        onClick={() => setShowHamburgerDropdown(false)}
                      >
                        Contact Us
                      </Link>
                      <Link
                        href="/faq"
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-300"
                        onClick={() => setShowHamburgerDropdown(false)}
                      >
                        FAQs
                      </Link>
                      <Link
                        href="/educational-module"
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-300"
                        onClick={() => setShowHamburgerDropdown(false)}
                      >
                        Educational Module
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Wishlist */}
              {(isDealer || !isLoggedIn) && (
                <div className="relative" ref={wishlistRef}>
                  <button 
                    onClick={() => setShowWishlistDropdown(!showWishlistDropdown)}
                    className="p-2 text-gray-700 hover:text-primary-400 transition-colors duration-300 relative"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {isLoggedIn && wishlistItems.length > 0 && (
                      <span className="absolute top-0 right-0 bg-primary-400 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {wishlistItems.length}
                      </span>
                    )}
                  </button>
                  {showWishlistDropdown && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 transition-all duration-300 max-h-96 overflow-y-auto">
                      {!isLoggedIn ? (
                        <div className="p-4">
                          <p className="text-sm text-gray-600 mb-4">
                            Signup as a dealer to see your wishlist
                          </p>
                          <div className="space-y-2">
                            <Link
                              href="/create-account"
                              className="block w-full gradient-primary text-white py-2 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity duration-300 text-center"
                              onClick={() => setShowWishlistDropdown(false)}
                            >
                              Create Account
                            </Link>
                            <Link
                              href="/sign-in"
                              className="block w-full bg-white border-2 border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:border-primary-400 transition-colors duration-300 text-center"
                              onClick={() => setShowWishlistDropdown(false)}
                            >
                              Login
                            </Link>
                          </div>
                        </div>
                      ) : wishlistItems.length === 0 ? (
                        <div className="p-6 text-center">
                          <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          <p className="text-sm text-gray-600">Your wishlist is empty</p>
                        </div>
                      ) : (
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 mb-3">Wishlist ({wishlistItems.length})</h3>
                          <div className="space-y-3">
                            {wishlistItems.map((item) => (
                              <div key={item.id} className="flex items-center gap-3 pb-3 border-b border-gray-100 last:border-0">
                                <div className="relative w-16 h-16 flex-shrink-0">
                                  <Image
                                    src={item.images[0]}
                                    alt={item.name}
                                    fill
                                    className="object-cover rounded"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                                  <p className="text-sm text-gray-500">{item.brand}</p>
                                  <p className="text-sm font-semibold text-primary-400">
                                    ${(item.cost && isDealer ? item.cost : item.price).toFixed(2)}
                                  </p>
                                </div>
                                <button
                                  onClick={() => removeFromWishlist(item.id)}
                                  className="text-gray-400 hover:text-red-500 transition-colors duration-300"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                          <Link
                            href="/wishlist"
                            className="block w-full mt-4 gradient-primary text-white py-2 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity duration-300 text-center"
                            onClick={() => setShowWishlistDropdown(false)}
                          >
                            View All
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Cart */}
              {(isDealer || !isLoggedIn) && (
                <div className="relative" ref={cartRef}>
                  {isDealer ? (
                    <button
                      onClick={() => setShowCartDropdown(!showCartDropdown)}
                      className="p-2 text-gray-700 hover:text-primary-400 transition-colors duration-300 relative"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {isLoggedIn && getCartItemCount() > 0 && (
                        <span className="absolute top-0 right-0 bg-primary-400 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {getCartItemCount()}
                        </span>
                      )}
                    </button>
                  ) : (
                    <button 
                      onClick={() => setShowCartDropdown(!showCartDropdown)}
                      className="p-2 text-gray-700 hover:text-primary-400 transition-colors duration-300 relative"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </button>
                  )}
                  {showCartDropdown && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 transition-all duration-300 max-h-96 overflow-y-auto">
                      {!isLoggedIn ? (
                        <div className="p-4">
                          <p className="text-sm text-gray-600 mb-4">
                            Signup as a dealer to see your cart
                          </p>
                          <div className="space-y-2">
                            <Link
                              href="/create-account"
                              className="block w-full gradient-primary text-white py-2 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity duration-300 text-center"
                              onClick={() => setShowCartDropdown(false)}
                            >
                              Create Account
                            </Link>
                            <Link
                              href="/sign-in"
                              className="block w-full bg-white border-2 border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:border-primary-400 transition-colors duration-300 text-center"
                              onClick={() => setShowCartDropdown(false)}
                            >
                              Login
                            </Link>
                          </div>
                        </div>
                      ) : cartItems.length === 0 ? (
                        <div className="p-6 text-center">
                          <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <p className="text-sm text-gray-600">Your cart is empty</p>
                        </div>
                      ) : (
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 mb-3">Cart ({getCartItemCount()} items)</h3>
                          <div className="space-y-3">
                            {cartItems.map((item) => (
                              <div key={item.id} className="flex items-center gap-3 pb-3 border-b border-gray-100 last:border-0">
                                <div className="relative w-16 h-16 flex-shrink-0">
                                  <Image
                                    src={item.images[0]}
                                    alt={item.name}
                                    fill
                                    className="object-cover rounded"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                                  <p className="text-sm text-gray-500">{item.brand}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <p className="text-sm font-semibold text-primary-400">
                                      ${(item.cost && isDealer ? item.cost : item.price).toFixed(2)}
                                    </p>
                                    <div className="flex items-center gap-1 border border-gray-300 rounded">
                                      <button
                                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                                        className="px-2 py-1 text-gray-600 hover:text-gray-900"
                                      >
                                        -
                                      </button>
                                      <span className="px-2 py-1 text-sm">{item.quantity}</span>
                                      <button
                                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                        className="px-2 py-1 text-gray-600 hover:text-gray-900"
                                      >
                                        +
                                      </button>
                                    </div>
                                  </div>
                                </div>
                                <button
                                  onClick={() => removeFromCart(item.id)}
                                  className="text-gray-400 hover:text-red-500 transition-colors duration-300"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex justify-between items-center mb-3">
                              <span className="font-semibold text-gray-900">Total:</span>
                              <span className="font-bold text-lg text-primary-400">${getCartTotal().toFixed(2)}</span>
                            </div>
                            <Link
                              href="/cart"
                              className="block w-full gradient-primary text-white py-2 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity duration-300 text-center"
                              onClick={() => setShowCartDropdown(false)}
                            >
                              View Cart
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

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
                            Happy Friday, Beautiful 🎉
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
                    href={getProductUrl('SKINCARE', true)}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full py-3 text-left text-gray-900 font-medium hover:text-primary-400 transition-colors border-b border-gray-100"
                  >
                    SKINCARE
                  </Link>
                  <Link
                    href={getProductUrl('SPA PRODUCTS', true)}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full py-3 text-left text-gray-900 font-medium hover:text-primary-400 transition-colors border-b border-gray-100"
                  >
                    SPA PRODUCTS
                  </Link>
                  <Link
                    href={getProductUrl('NAIL PRODUCTS', true)}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full py-3 text-left text-gray-900 font-medium hover:text-primary-400 transition-colors border-b border-gray-100"
                  >
                    NAIL PRODUCTS
                  </Link>
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
                    href={getProductUrl('FURNITURE', true)}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full py-3 text-left text-gray-900 font-medium hover:text-primary-400 transition-colors"
                  >
                    FURNITURE
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
      {mobileUserSidebarOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-[60] transition-opacity duration-300"
            onClick={() => setMobileUserSidebarOpen(false)}
          />
          {/* Sidebar */}
          <div className="md:hidden fixed right-0 top-0 bottom-0 w-[85vw] max-w-sm bg-white z-[70] overflow-y-auto shadow-2xl transform transition-transform duration-300 ease-in-out">
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
                      Welcome! 👋
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
        </>
      )}

      {/* Mobile Links Sidebar */}
      {mobileLinksSidebarOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-[9998] transition-opacity duration-300"
            onClick={() => setMobileLinksSidebarOpen(false)}
          />
          {/* Sidebar */}
          <div className="md:hidden fixed left-0 top-0 bottom-0 w-[85vw] max-w-sm bg-white z-[9999] overflow-y-auto shadow-2xl">
            <div className="px-4 py-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <Link href="/" className="flex flex-col">
                  <span className="text-xl font-bold text-primary-600">ACBS</span>
                  <span className="text-[10px] text-gray-600 leading-tight">ALLIED CONCEPT BEAUTY SUPPLY</span>
                </Link>
                <div className="flex-1 flex justify-center">
                  <h2 className="text-2xl font-bold text-gray-900">Menu</h2>
                </div>
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
                  href="/educational-module"
                  className="block w-full text-left px-4 py-3 text-base text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-300"
                  onClick={() => setMobileLinksSidebarOpen(false)}
                >
                  Educational Module
                </Link>
                <Link
                  href="/wishlist"
                  className="block w-full text-left px-4 py-3 text-base text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-300"
                  onClick={() => setMobileLinksSidebarOpen(false)}
                >
                  Wish List
                </Link>
                <Link
                  href="/cart"
                  className="block w-full text-left px-4 py-3 text-base text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-300"
                  onClick={() => setMobileLinksSidebarOpen(false)}
                >
                  Cart
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </>
  )
}

