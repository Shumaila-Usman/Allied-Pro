'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface CarouselProps {
  slides: Array<{
    id: string
    image: string
    title?: string
    subtitle?: string
    objectPosition?: string
  }>
  autoPlay?: boolean
  interval?: number
  hideFirstOnMobile?: boolean
}

export default function Carousel({ slides, autoPlay = true, interval = 5000, hideFirstOnMobile = false }: CarouselProps) {
  // Start from index 1 if first slide should be hidden on mobile
  const getInitialIndex = () => {
    if (hideFirstOnMobile && slides.length > 0 && slides[0].id === '1') {
      return 1
    }
    return 0
  }
  
  const [currentIndex, setCurrentIndex] = useState(getInitialIndex)

  // Reset to appropriate index when slides or hideFirstOnMobile changes
  const slideIds = slides.map(s => s.id).join(',')
  useEffect(() => {
    setCurrentIndex(getInitialIndex())
  }, [slideIds, hideFirstOnMobile])

  // Get next valid index (skip first if hidden on mobile)
  const getNextIndex = (current: number) => {
    let next = (current + 1) % slides.length
    if (hideFirstOnMobile && slides.length > 0 && slides[0].id === '1' && next === 0) {
      next = 1
    }
    return next
  }

  // Get previous valid index (skip first if hidden on mobile)
  const getPrevIndex = (current: number) => {
    let prev = (current - 1 + slides.length) % slides.length
    if (hideFirstOnMobile && slides.length > 0 && slides[0].id === '1' && prev === 0) {
      prev = slides.length - 1
    }
    return prev
  }

  useEffect(() => {
    if (!autoPlay) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => getNextIndex(prev))
    }, interval)

    return () => clearInterval(timer)
  }, [autoPlay, interval, slides.length, hideFirstOnMobile])

  const goToSlide = (index: number) => {
    // Don't allow going to first slide if it's hidden on mobile
    if (hideFirstOnMobile && slides.length > 0 && slides[0].id === '1' && index === 0) {
      setCurrentIndex(1)
    } else {
      setCurrentIndex(index)
    }
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => getPrevIndex(prev))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => getNextIndex(prev))
  }

  return (
    <div className="relative w-full max-w-5xl mx-auto h-[260px] sm:h-[320px] md:h-[380px] overflow-hidden bg-white rounded-2xl shadow-lg">
      {slides.map((slide, index) => {
        // Hide first slide on mobile if hideFirstOnMobile is true
        const isFirstSlide = index === 0 && slide.id === '1'
        const shouldHide = hideFirstOnMobile && isFirstSlide
        
        return (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          } ${shouldHide ? 'hidden md:block' : ''}`}
        >
          <div className="relative w-full h-full">
            <Image
              src={slide.image}
              alt={slide.title || 'Hero slide'}
              fill
              className="object-cover w-full h-full"
              style={{ 
                objectPosition: slide.objectPosition || (slide.image.includes('banner-4') ? 'center 0%' : 'center top')
              }}
              priority={index === 0}
            />
            {(slide.title || slide.subtitle) && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                <div className="text-center text-white px-4">
                  {slide.title && (
                    <h2 className="text-4xl md:text-6xl font-bold mb-4">{slide.title}</h2>
                  )}
                  {slide.subtitle && (
                    <p className="text-xl md:text-2xl">{slide.subtitle}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        )
      })}

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all duration-300"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((slide, index) => {
          // Hide first dot on mobile if first slide is hidden
          const isFirstSlide = index === 0 && slide.id === '1'
          const shouldHide = hideFirstOnMobile && isFirstSlide
          
          if (shouldHide) return null
          
          return (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          )
        })}
      </div>
    </div>
  )
}

