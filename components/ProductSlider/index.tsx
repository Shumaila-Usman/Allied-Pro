'use client'

import { useRef, useState, useEffect } from 'react'
import ProductCard from '../ProductCard'
import { Product } from '@/types'

interface ProductSliderProps {
  products: Product[]
  title: string
  externalNavContainerId?: string
}

export default function ProductSlider({ products, title, externalNavContainerId }: ProductSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    checkScrollButtons()
    const scrollElement = scrollRef.current
    if (scrollElement) {
      scrollElement.addEventListener('scroll', checkScrollButtons)
      window.addEventListener('resize', checkScrollButtons)
    }
    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener('scroll', checkScrollButtons)
      }
      window.removeEventListener('resize', checkScrollButtons)
    }
  }, [products])

  // Inject navigation buttons into external container when provided
  useEffect(() => {
    if (externalNavContainerId) {
      const container = document.getElementById(externalNavContainerId)
      if (container) {
        // Clear existing content
        container.innerHTML = ''
        
        // Create buttons container
        const buttonsDiv = document.createElement('div')
        buttonsDiv.className = 'flex space-x-2'
        
        // Left button
        const leftButton = document.createElement('button')
        leftButton.className = 'p-2 rounded-full border border-gray-300 hover:border-primary-400 hover:text-primary-400 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
        leftButton.disabled = !canScrollLeft
        leftButton.setAttribute('aria-label', 'Scroll left')
        leftButton.innerHTML = `
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        `
        leftButton.onclick = () => scroll('left')
        
        // Right button
        const rightButton = document.createElement('button')
        rightButton.className = 'p-2 rounded-full border border-gray-300 hover:border-primary-400 hover:text-primary-400 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
        rightButton.disabled = !canScrollRight
        rightButton.setAttribute('aria-label', 'Scroll right')
        rightButton.innerHTML = `
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        `
        rightButton.onclick = () => scroll('right')
        
        buttonsDiv.appendChild(leftButton)
        buttonsDiv.appendChild(rightButton)
        container.appendChild(buttonsDiv)
        
        // Update button states when scroll state changes
        const updateButtons = () => {
          leftButton.disabled = !canScrollLeft
          rightButton.disabled = !canScrollRight
        }
        
        updateButtons()
        
        // Re-update on scroll
        const scrollElement = scrollRef.current
        if (scrollElement) {
          scrollElement.addEventListener('scroll', updateButtons)
        }
        
        return () => {
          if (scrollElement) {
            scrollElement.removeEventListener('scroll', updateButtons)
          }
        }
      }
    }
  }, [externalNavContainerId, canScrollLeft, canScrollRight, products])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      // Calculate card width based on screen size
      const isMobile = window.innerWidth < 768
      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024
      const cardWidth = isMobile ? 192 : isTablet ? 208 : 220 // w-48, w-52, or custom 220px
      const gap = 24 // gap-6 = 24px
      const scrollAmount = cardWidth + gap
      
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  return (
    <div className="relative">
      {title && (
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] bg-clip-text text-transparent">{title}</h2>
        </div>
      )}
      {!title && !externalNavContainerId && (
        <div className="flex items-center justify-end mb-4 -mt-12 md:-mt-10">
          <div className="flex space-x-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="p-2 rounded-full border border-gray-300 hover:border-primary-400 hover:text-primary-400 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Scroll left"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="p-2 rounded-full border border-gray-300 hover:border-primary-400 hover:text-primary-400 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Scroll right"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
      {title && (
        <div className="flex items-center justify-end mb-4">
          <div className="flex space-x-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="p-2 rounded-full border border-gray-300 hover:border-primary-400 hover:text-primary-400 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Scroll left"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="p-2 rounded-full border border-gray-300 hover:border-primary-400 hover:text-primary-400 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Scroll right"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
      <div
        ref={scrollRef}
        className="flex space-x-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4 snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        onScroll={checkScrollButtons}
      >
        {products.map((product) => (
          <div key={product.id} className="flex-shrink-0 w-48 sm:w-52 lg:w-[220px] snap-start">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}