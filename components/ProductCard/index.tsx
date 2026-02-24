'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import { Product } from '@/types'
import ProductDetailModal from '@/components/ProductDetailModal'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { isDealer } = useAuth()
  const { addToCart, addToWishlist, isInWishlist, removeFromWishlist } = useCart()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't open modal if clicking on buttons or links
    const target = e.target as HTMLElement
    if (target.closest('button') || target.closest('a')) {
      return
    }
    setIsModalOpen(true)
  }

  return (
    <div
      className="group relative rounded-[8px] p-[2px] bg-gradient-to-r from-[#E8D5E8] to-[#C7E8F0] shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full"
      onClick={handleCardClick}
    >
      <div className="bg-white rounded-[8px] overflow-hidden h-full flex flex-col">
      <div 
        className="relative aspect-square overflow-hidden"
        onMouseEnter={() => {
          if (product.images.length > 1) {
            setCurrentImageIndex(1)
          }
        }}
        onMouseLeave={() => setCurrentImageIndex(0)}
      >
        <Image
          src={product.images?.[0] || '/products/placeholder.jpg'}
          alt={product.name}
          fill
          className="object-cover transition-opacity duration-300"
          style={{ opacity: currentImageIndex === 0 ? 1 : 0 }}
          onError={(e) => {
            e.currentTarget.src = '/products/placeholder.jpg'
          }}
        />
        {product.images && product.images.length > 1 && (
          <Image
            src={product.images[1]}
            alt={product.name}
            fill
            className="object-cover transition-opacity duration-300 absolute inset-0"
            style={{ opacity: currentImageIndex === 1 ? 1 : 0 }}
            onError={(e) => {
              e.currentTarget.src = '/products/placeholder.jpg'
            }}
          />
        )}
        {/* Action buttons overlay - only for dealers */}
        {isDealer && (
          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {/* Wishlist button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                if (isInWishlist(product.id)) {
                  removeFromWishlist(product.id)
                } else {
                  addToWishlist(product)
                }
              }}
              className="bg-white rounded-full p-2 shadow-md hover:bg-primary-50 transition-all duration-300"
            >
              <svg
                className={`w-5 h-5 ${isInWishlist(product.id) ? 'text-red-500 fill-red-500' : 'text-gray-700'}`}
                fill={isInWishlist(product.id) ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            {/* View details button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsModalOpen(true)
              }}
              className="bg-white rounded-full p-2 shadow-md hover:bg-primary-50 transition-all duration-300"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
        {product.category && (
          <p className="text-xs text-[#87CEEB] font-medium mb-1 uppercase">{product.category}</p>
        )}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
        {isDealer ? (
          <div className="space-y-2 mt-auto">
            <div>
              <p className="text-lg font-bold text-gray-900">
                ${(product.cost && isDealer ? product.cost : product.price).toFixed(2)}
              </p>
              {product.cost && product.price !== product.cost && (
                <p className="text-sm text-gray-400 line-through">${product.price.toFixed(2)}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  addToCart(product)
                }}
                className="flex-1 gradient-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity duration-300 flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Add to Cart
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-auto">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsModalOpen(true)
              }}
              className="w-full border-2 border-black text-black font-semibold px-4 py-2 rounded-lg text-sm hover:scale-105 hover:border-[3px] transition-all duration-300"
            >
              View Details
            </button>
          </div>
        )}
      </div>
      </div>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}