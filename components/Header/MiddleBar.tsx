'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import Link from 'next/link'
import Image from 'next/image'
import LoginModal from '../LoginModal'

export default function MiddleBar() {
  const { isLoggedIn, user, logout, isDealer } = useAuth()
  const { wishlistItems, cartItems, getCartItemCount, getCartTotal, removeFromCart, updateCartQuantity, removeFromWishlist } = useCart()
  const [showWishlistDropdown, setShowWishlistDropdown] = useState(false)
  const [showCartDropdown, setShowCartDropdown] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showLoginModal, setShowLoginModal] = useState(false)

  const wishlistRef = useRef<HTMLDivElement>(null)
  const cartRef = useRef<HTMLDivElement>(null)
  const userRef = useRef<HTMLDivElement>(null)

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
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <div className="relative h-16 w-48">
                <Image
                  src="/logo-removebg-preview.png"
                  alt="ACBS - Allied Concept Beauty Supply"
                  width={192}
                  height={64}
                  className="object-contain h-full w-auto bg-transparent"
                  priority
                  onError={(e) => {
                    // Fallback: show gradient placeholder
                    const target = e.target as HTMLImageElement;
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = '<div class="h-12 w-32 gradient-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">ACBS</div>';
                    }
                  }}
                />
              </div>
            </Link>
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="w-full relative">
              <input
                type="text"
                placeholder="Search products, brands, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Search - Show when hamburger is not active */}
          {!mobileMenuOpen && (
            <div className="md:hidden flex-1 mx-4">
              <div className="w-full relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Icons */}
          <div className="flex items-center space-x-4">
            {/* Wishlist - Only show for dealers or logged out users */}
            {(isDealer || !isLoggedIn) && (
              <div
                className="relative"
                ref={wishlistRef}
              >
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
                  <div
                    className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 transition-all duration-300 max-h-96 overflow-y-auto"
                  >
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

            {/* Cart - Only show for dealers or logged out users */}
            {(isDealer || !isLoggedIn) && (
              <div
                className="relative"
                ref={cartRef}
              >
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
                  <div
                    className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 transition-all duration-300 max-h-96 overflow-y-auto"
                  >
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
            <div
              className="relative"
              ref={userRef}
            >
              <button 
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="p-2 text-gray-700 hover:text-primary-400 transition-colors duration-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
              {showUserDropdown && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50 transition-all duration-300"
                >
                  {isLoggedIn ? (
                    <>
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center text-white font-bold">
                          {user?.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Hi, {user?.name}!</p>
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

            <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />

            {/* Mobile Hamburger */}
            <button
              className="md:hidden p-2 text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

