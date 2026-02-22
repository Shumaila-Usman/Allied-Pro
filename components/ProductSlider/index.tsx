'use client'

import { useRef } from 'react'
import ProductCard from '../ProductCard'
import { Product } from '@/types'

interface ProductSliderProps {
  products: Product[]
  title: string
}

export default function ProductSlider({ products, title }: ProductSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-6">
        {title && (
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] bg-clip-text text-transparent">{title}</h2>
        )}
        <div className="flex space-x-2">
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-full border border-gray-300 hover:border-primary-400 hover:text-primary-400 transition-colors duration-300"
            aria-label="Scroll left"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-full border border-gray-300 hover:border-primary-400 hover:text-primary-400 transition-colors duration-300"
            aria-label="Scroll right"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex space-x-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4 snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product) => (
          <div key={product.id} className="flex-shrink-0 w-64 md:w-72 snap-start">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  )
}

