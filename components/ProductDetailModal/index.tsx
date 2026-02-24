'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import { Product } from '@/types'

interface ProductDetailModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}

export default function ProductDetailModal({ product, isOpen, onClose }: ProductDetailModalProps) {
  const { isDealer } = useAuth()
  const { addToCart, addToWishlist, isInWishlist, removeFromWishlist } = useCart()
  const searchParams = useSearchParams()
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>([])
  const [categoryName, setCategoryName] = useState('')

  useEffect(() => {
    if (product) {
      setSelectedImageIndex(0)
      setQuantity(1)
      
      // Get category info from URL params (most reliable)
      const urlCategory = searchParams.get('category')
      const urlSubcategory = searchParams.get('subcategory')
      const urlSecondSubcategory = searchParams.get('secondSubcategory')
      
      // Fallback categories structure (same as products page)
      const fallbackCategories: any[] = [
        { 
          id: 'skincare', 
          name: 'SKINCARE', 
          slug: 'skincare', 
          subcategories: [
            { 
              id: 'skincare-by-category', 
              name: 'By Category', 
              slug: 'by-category', 
              secondSubcategories: [
                { id: 'face-masks', name: 'Face Masks', slug: 'face-masks' },
                { id: 'eye-care', name: 'Eye Care', slug: 'eye-care' },
                { id: 'tools-accessories', name: 'Tools & Accessories', slug: 'tools-accessories' },
                { id: 'massage-contouring', name: 'Massage & Contouring', slug: 'massage-contouring' },
              ]
            },
            { 
              id: 'skincare-by-concern', 
              name: 'By Concern', 
              slug: 'by-concern', 
              secondSubcategories: [
                { id: 'redness', name: 'Redness', slug: 'redness' },
                { id: 'anti-aging-firming', name: 'Anti-Aging / Firming', slug: 'anti-aging-firming' },
                { id: 'dryness', name: 'Dryness', slug: 'dryness' },
              ]
            },
            { 
              id: 'skincare-by-skin-type', 
              name: 'By Skin Type', 
              slug: 'by-skin-type', 
              secondSubcategories: [
                { id: 'normal-all-skin-types', name: 'Normal / All Skin Types', slug: 'normal-all-skin-types' },
              ]
            },
          ]
        },
        { 
          id: 'spa-products', 
          name: 'SPA PRODUCTS', 
          slug: 'spa-products', 
          subcategories: [
            { id: 'treatment-products', name: 'Treatment Products (Waxing & Paraffin)', slug: 'treatment-products', secondSubcategories: [] },
            { id: 'body-wraps-spa-creams', name: 'Body Wraps & Spa Creams', slug: 'body-wraps-spa-creams', secondSubcategories: [] },
            { id: 'hot-stones', name: 'Hot Stones', slug: 'hot-stones', secondSubcategories: [] },
            { 
              id: 'spa-accessories', 
              name: 'Spa Accessories', 
              slug: 'spa-accessories', 
              secondSubcategories: [
                { id: 'towels-robes-linens', name: 'Towels, Robes & Linens', slug: 'towels-robes-linens' },
                { id: 'slippers-disposables', name: 'Slippers & Disposables', slug: 'slippers-disposables' },
                { id: 'small-tools-disposable-sundries', name: 'Small Tools & Disposable Sundries', slug: 'small-tools-disposable-sundries' },
              ]
            },
            { 
              id: 'spa-equipment', 
              name: 'Equipment', 
              slug: 'spa-equipment', 
              secondSubcategories: [
                { id: 'warmers-hot-towel-cabinets', name: 'Warmers & Hot Towel Cabinets', slug: 'warmers-hot-towel-cabinets' },
              ]
            },
          ]
        },
        { 
          id: 'nail-products', 
          name: 'NAIL PRODUCTS', 
          slug: 'nail-products', 
          subcategories: [
            { id: 'nail-care', name: 'Nail Care (Cuticle & Treatments)', slug: 'nail-care', secondSubcategories: [] },
            { id: 'nail-files-buffers', name: 'Nail Files & Buffers', slug: 'nail-files-buffers', secondSubcategories: [] },
            { id: 'nail-art', name: 'Nail Art', slug: 'nail-art', secondSubcategories: [] },
            { 
              id: 'tools-equipment', 
              name: 'Tools & Equipment', 
              slug: 'tools-equipment', 
              secondSubcategories: [
                { id: 'pedicure-tools', name: 'Pedicure Tools', slug: 'pedicure-tools' },
                { id: 'stations-storage', name: 'Stations & Storage', slug: 'stations-storage' },
                { id: 'manicure-pedicure-accessories', name: 'Manicure & Pedicure Accessories', slug: 'manicure-pedicure-accessories' },
              ]
            },
            { id: 'consumables-disposables', name: 'Consumables & Disposables', slug: 'consumables-disposables', secondSubcategories: [] },
          ]
        },
        { 
          id: 'equipment', 
          name: 'EQUIPMENT', 
          slug: 'equipment', 
          subcategories: [
            { id: 'facial-equipment', name: 'Facial Equipment', slug: 'facial-equipment', secondSubcategories: [] },
            { id: 'styling-equipment', name: 'Styling Equipment', slug: 'styling-equipment', secondSubcategories: [] },
            { id: 'salon-equipment', name: 'Salon Equipment (Trolleys & Carts)', slug: 'salon-equipment', secondSubcategories: [] },
            { id: 'equipment-accessories', name: 'Equipment Accessories (Stands & Bulbs)', slug: 'equipment-accessories', secondSubcategories: [] },
          ]
        },
        { 
          id: 'implements', 
          name: 'IMPLEMENTS', 
          slug: 'implements', 
          subcategories: [
            { id: 'hair-tools', name: 'Hair Tools', slug: 'hair-tools', secondSubcategories: [] },
            { id: 'scissors-shears', name: 'Scissors & Shears', slug: 'scissors-shears', secondSubcategories: [] },
            { id: 'skin-tools', name: 'Skin Tools (Tweezers & Extraction)', slug: 'skin-tools', secondSubcategories: [] },
            { id: 'nail-pushers-implements', name: 'Nail Pushers & Implements', slug: 'nail-pushers-implements', secondSubcategories: [] },
            { id: 'sterilization-safety', name: 'Sterilization & Safety', slug: 'sterilization-safety', secondSubcategories: [] },
            { 
              id: 'disposables', 
              name: 'Disposables', 
              slug: 'disposables', 
              secondSubcategories: [
                { id: 'bowls', name: 'Bowls', slug: 'bowls' },
                { id: 'medical-treatment-disposables', name: 'Medical & Treatment Disposables', slug: 'medical-treatment-disposables' },
              ]
            },
          ]
        },
        { 
          id: 'furniture', 
          name: 'FURNITURE', 
          slug: 'furniture', 
          subcategories: [
            { id: 'facial-bed-multipurpose', name: 'Facial Bed Multipurpose', slug: 'facial-bed-multipurpose', secondSubcategories: [] },
            { id: 'facial-massage-bed', name: 'Facial Massage Bed (White / Black)', slug: 'facial-massage-bed', secondSubcategories: [] },
            { id: 'salon-spa-rolling-tray', name: 'Salon Spa Rolling Tray with Accessories Holder', slug: 'salon-spa-rolling-tray', secondSubcategories: [] },
          ]
        },
      ]
      
      // Build breadcrumbs from URL params using fallback categories
      const breadcrumbPath: string[] = []
      
      if (urlCategory) {
        const category = fallbackCategories.find((c: any) => 
          c.id === urlCategory || 
          c.slug === urlCategory ||
          c.name?.toUpperCase() === urlCategory.toUpperCase()
        )
        
        if (category) {
          breadcrumbPath.push(category.name)
          
          if (urlSubcategory && category.subcategories) {
            const subcategory = category.subcategories.find((s: any) => 
              s.id === urlSubcategory || 
              s.slug === urlSubcategory ||
              s.name?.toUpperCase() === urlSubcategory.toUpperCase()
            )
            
            if (subcategory) {
              breadcrumbPath.push(subcategory.name)
              
              if (urlSecondSubcategory && subcategory.secondSubcategories) {
                const secondSubcategory = subcategory.secondSubcategories.find((s: any) => 
                  s.id === urlSecondSubcategory || 
                  s.slug === urlSecondSubcategory ||
                  s.name?.toUpperCase() === urlSecondSubcategory.toUpperCase()
                )
                
                if (secondSubcategory) {
                  breadcrumbPath.push(secondSubcategory.name)
                }
              }
            }
          }
        } else {
          // Fallback: convert slug to readable name
          const catName = urlCategory
            .split('-')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
          breadcrumbPath.push(catName)
          
          if (urlSubcategory) {
            const subName = urlSubcategory
              .split('-')
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ')
            breadcrumbPath.push(subName)
          }
          
          if (urlSecondSubcategory) {
            const secondName = urlSecondSubcategory
              .split('-')
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ')
            breadcrumbPath.push(secondName)
          }
        }
      }
      
      // If no URL params, try to get from API
      if (breadcrumbPath.length === 0) {
        fetch('/api/categories')
          .then((res) => res.json())
          .then((data) => {
            const categories = data.categories || []
            
            let category: any = null
            let subcategory: any = null
            let secondSubcategory: any = null
            
            if (product.categoryId) {
              category = categories.find((c: any) => 
                c.id === product.categoryId || 
                c.id?.toString() === product.categoryId?.toString() ||
                c.slug === product.categoryId
              )
            }
            
            if (category) {
              const categoryName = category.name || 'Products'
              const path: string[] = [categoryName]
              
              if (product.subcategoryId && category.subcategories) {
                subcategory = category.subcategories.find((s: any) => 
                  s.id === product.subcategoryId || 
                  s.id?.toString() === product.subcategoryId?.toString()
                )
                
                if (subcategory) {
                  path.push(subcategory.name)
                  
                  if (product.secondSubcategoryId && subcategory.secondSubcategories) {
                    secondSubcategory = subcategory.secondSubcategories.find((s: any) => 
                      s.id === product.secondSubcategoryId || 
                      s.id?.toString() === product.secondSubcategoryId?.toString()
                    )
                    
                    if (secondSubcategory) {
                      path.push(secondSubcategory.name)
                    }
                  }
                }
              }
              
              setCategoryName(path[0])
              setBreadcrumbs(path)
            } else {
              setCategoryName('Products')
              setBreadcrumbs(['Products'])
            }
          })
          .catch(() => {
            setCategoryName('Products')
            setBreadcrumbs(['Products'])
          })
      } else {
        setCategoryName(breadcrumbPath[0])
        setBreadcrumbs(breadcrumbPath)
      }
    }
  }, [product, searchParams])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen || !product) return null

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product)
    }
    // Optionally close modal after adding to cart
    // onClose()
  }

  const handleAddToWishlist = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  // Calculate discount if there's a cost (dealer price)
  const originalPrice = product.cost ? product.price : null
  const displayPrice = product.cost && isDealer ? product.cost : product.price
  const discount = originalPrice && product.cost ? Math.round(((originalPrice - product.cost) / originalPrice) * 100) : 0

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors duration-300"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
          {/* Left Column - Images */}
          <div className="space-y-4">
            {/* Breadcrumbs */}
            <div className="text-sm text-gray-600">
              {breadcrumbs.map((crumb, index) => (
                <span key={index}>
                  {index > 0 && <span className="mx-2">/</span>}
                  <span className={index === breadcrumbs.length - 1 ? 'text-gray-900' : 'hover:text-gray-900 cursor-pointer'}>
                    {crumb}
                  </span>
                </span>
              ))}
            </div>

            {/* Product Title */}
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

            {/* Action Buttons - Only for Dealers */}
            {isDealer && (
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-300 text-sm font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  SHARE
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-300 text-sm font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                  </svg>
                  COMPARE
                </button>
                <button
                  onClick={handleAddToWishlist}
                  className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors duration-300 text-sm font-medium ${
                    isInWishlist(product.id)
                      ? 'border-red-500 bg-red-50 text-red-600'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <svg
                    className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-red-500' : ''}`}
                    fill={isInWishlist(product.id) ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  ADD TO WISHLIST
                </button>
              </div>
            )}

            {/* Main Product Image */}
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={product.images?.[selectedImageIndex] || product.images?.[0] || '/products/placeholder.jpg'}
                alt={product.name}
                fill
                className="object-contain"
                onError={(e) => {
                  e.currentTarget.src = '/products/placeholder.jpg'
                }}
              />
            </div>

            {/* Thumbnail Carousel */}
            {product.images && product.images.length > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedImageIndex(Math.max(0, selectedImageIndex - 1))}
                  disabled={selectedImageIndex === 0}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div className="flex gap-2 flex-1 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative w-20 h-20 flex-shrink-0 border-2 rounded-lg overflow-hidden transition-all ${
                        selectedImageIndex === index ? 'border-[#87CEEB]' : 'border-gray-200'
                      }`}
                    >
                      <Image
                        src={image || '/products/placeholder.jpg'}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/products/placeholder.jpg'
                        }}
                      />
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setSelectedImageIndex(Math.min(product.images.length - 1, selectedImageIndex + 1))}
                  disabled={selectedImageIndex === product.images.length - 1}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-6">
            {/* Product Description */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Description</h2>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p>{product.description}</p>
                <p>
                  {product.name} is a premium product designed for professionals. It ensures quality and durability,
                  making it an ideal choice for your business needs. This product has been carefully selected to meet
                  the highest standards in the beauty and spa industry.
                </p>
              </div>
            </div>

            {/* Pricing - Only for Dealers */}
            {isDealer && (
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-gray-900">${displayPrice.toFixed(2)}</span>
                  {originalPrice && discount > 0 && (
                    <>
                      <span className="text-xl text-gray-400 line-through">${originalPrice.toFixed(2)}</span>
                      <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                        -{discount}%
                      </span>
                    </>
                  )}
                </div>
                {product.brand && (
                  <p className="text-sm text-gray-600">Brand: {product.brand}</p>
                )}
                {product.stock !== undefined && (
                  <p className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                  </p>
                )}
              </div>
            )}
            
            {/* Brand and Stock Info for Normal Users (without price) */}
            {!isDealer && (
              <div className="space-y-2">
                {product.brand && (
                  <p className="text-sm text-gray-600">Brand: {product.brand}</p>
                )}
                {product.stock !== undefined && (
                  <p className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.stock > 0 ? `In Stock` : 'Out of Stock'}
                  </p>
                )}
              </div>
            )}

            {/* Quantity & Add to Cart - Only for Dealers */}
            {isDealer && (
              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-semibold text-gray-700">QTY</label>
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#87CEEB]"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="w-full bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] text-white px-6 py-3 rounded-lg font-bold text-lg hover:opacity-90 transition-opacity duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  ADD TO CART
                </button>
              </div>
            )}

            {/* Additional Info */}
            <div className="pt-4 border-t space-y-2 text-sm text-gray-600">
              <p>
                <span className="font-semibold">SKU:</span> {product.sku || 'N/A'}
              </p>
              <p>
                <span className="font-semibold">Category:</span> {breadcrumbs.join(' / ')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}