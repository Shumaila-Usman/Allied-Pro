'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import MainNav from '@/components/MainNav'
import Carousel from '@/components/Carousel'
import ProductSlider from '@/components/ProductSlider'
import BrandSlider from '@/components/BrandSlider'
import Footer from '@/components/Footer'
import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/types'

// Mock data
const heroSlides = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1920&q=80',
    title: 'Professional Beauty Products',
    subtitle: 'Elevate Your Business',
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1920&q=80',
    title: 'Spa Essentials',
    subtitle: 'Transform Your Space',
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=1920&q=80',
    title: 'Premium Equipment',
    subtitle: 'Built to Last',
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=1920&q=80',
    title: 'Expert Tools',
    subtitle: 'For Professionals',
  },
]

// Helper function to get category URL
function getCategoryUrl(categoryName: string): string {
  const categoryMap: Record<string, string> = {
    'Equipment': 'equipment',
    'Furniture': 'furniture',
    'Implements': 'implements',
    'Nail Care': 'nail-products',
    'Skincare': 'skincare',
    'Spa Essentials': 'spa-products',
  }
  const categoryId = categoryMap[categoryName] || ''
  return categoryId ? `/products?category=${categoryId}` : '/products'
}

const categories = [
  {
    id: '1',
    name: 'Equipment',
    description:
      'Upgrade your business with tools you can trust. Our products- salon equipment of all types, including waxing kits, hair tools, etc.- are constructed to work hard and be durable.',
    image: '/categories/equipment.jpg',
  },
  {
    id: '2',
    name: 'Furniture',
    description:
      'Prepare a working-space as attractive as it is comfortable. The seats of our salon and tables are comfortable to the clients of yours and are elegant enough to make your shop outstanding.',
    image: '/categories/furniture.jpg',
  },
  {
    id: '3',
    name: 'Implements',
    description:
      'Use the right tools to do your best work. And you have good quality tweezers, clippers, and others that are simple to use and can make you receive the best possible results each and every time.',
    image: '/categories/implements.jpg',
  },
  {
    id: '4',
    name: 'Nail Care',
    description:
      'Get yourself the best manicure. We provide salon quality products and services, so that you are able to have long and healthy nails without having to go to the salon.',
    image: '/categories/nail-care.jpg',
  },
  {
    id: '5',
    name: 'Skincare',
    description:
      'Get glowing skin you have always desired. We have selected the most effective products that really do work to make your skin healthy, secured and feel fresh and fresh each day.',
    image: '/categories/skincare.jpg',
  },
  {
    id: '6',
    name: 'Spa Essentials',
    description:
      'Make any room your own personal escape. We have the softest towels ever, relaxing fragrances, anything you want to make your home relaxing and stress will be washed away.',
    image: '/categories/spa-products.jpg',
  },
]

const brands = [
  { id: '1', name: 'SILK B PROFESSIONAL', logo: '/brands/brand-1.png' },
  { id: '2', name: "MÔND'SUB", logo: '/brands/brand-2.png' },
  { id: '3', name: 'LA', logo: '/brands/brand-3.png' },
  { id: '4', name: 'XANITALIA', logo: '/brands/brand-4.png' },
  { id: '5', name: 'ROMA', logo: '/brands/brand-5.png' },
  { id: '6', name: 'BSC', logo: '/brands/brand-6.png' },
]

export default function Home() {
  const [topPadding, setTopPadding] = useState(176) // Default padding
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loadingProducts, setLoadingProducts] = useState(true)

  useEffect(() => {
    const calculatePadding = () => {
      const header = document.getElementById('main-header')
      const nav = document.getElementById('main-nav')
      if (header && nav) {
        const totalHeight = header.offsetHeight + nav.offsetHeight
        setTopPadding(totalHeight)
      }
    }

    calculatePadding()
    window.addEventListener('resize', calculatePadding)
    // Also recalculate after a short delay to ensure elements are rendered
    setTimeout(calculatePadding, 100)

    return () => {
      window.removeEventListener('resize', calculatePadding)
    }
  }, [])

  // Fetch featured products from database
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch('/api/products?limit=10&page=1')
        const data = await response.json()
        if (data.products && data.products.length > 0) {
          setFeaturedProducts(data.products.slice(0, 10)) // Get first 10 products
        }
      } catch (error) {
        console.error('Error fetching featured products:', error)
      } finally {
        setLoadingProducts(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden max-w-full">
      <Header />
      <MainNav />

      {/* Hero Section - Add padding to account for fixed header and nav */}
      <section className="w-full" style={{ paddingTop: `${topPadding}px` }}>
        <Carousel slides={heroSlides} />
      </section>

      {/* Promo Cards Section */}
      <section className="w-full bg-white py-12 md:py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Sale Card */}
            <div className="relative h-72 md:h-80 rounded-2xl overflow-hidden shadow-xl group cursor-pointer hover:shadow-2xl transition-shadow duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-[#87CEEB] to-[#C8A2C8] flex items-center justify-center">
                <div className="text-center text-white px-6 w-full">
                  <h3 className="text-5xl md:text-6xl font-bold mb-2">EXTRA 20% OFF</h3>
                  <p className="text-2xl md:text-3xl font-semibold mb-4">SALE ITEMS</p>
                  <p className="text-base md:text-lg mb-6 opacity-90">Use code: BONUS20</p>
                  <button className="bg-white text-[#8B6FA8] px-10 py-3.5 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-xl hover:scale-105">
                    Shop Sale
                  </button>
                </div>
              </div>
            </div>
            
            {/* Featured Brands Card */}
            <div className="relative h-72 md:h-80 rounded-2xl overflow-hidden shadow-xl group cursor-pointer hover:shadow-2xl transition-shadow duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] flex items-center justify-center">
                <div className="text-center text-white px-6 w-full">
                  <span className="inline-block bg-white/30 backdrop-blur-md text-white text-sm font-bold px-5 py-2 rounded-full mb-5 border border-white/20">
                    NEW ARRIVALS
                  </span>
                  <h3 className="text-5xl md:text-6xl font-bold mb-3">Featured Brands</h3>
                  <p className="text-lg md:text-xl mb-6 opacity-90">Discover the latest in beauty & spa</p>
                  <button className="bg-white text-[#8B6FA8] px-10 py-3.5 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-xl hover:scale-105">
                    Explore Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Highlight Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8 text-center">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={getCategoryUrl(category.name)}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 group cursor-pointer block"
            >
              <div className="relative h-48 bg-gray-100">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{category.name}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{category.description}</p>
                <span className="mt-4 inline-block text-primary-500 font-semibold hover:text-primary-600 transition-colors duration-300">
                  Shop {category.name} →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Brands Section */}
      <section className="w-full py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Brands</h2>
        <BrandSlider brands={brands} />
      </section>

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {loadingProducts ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#87CEEB]"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        ) : featuredProducts.length > 0 ? (
          <ProductSlider products={featuredProducts} title="Featured Products" />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No featured products available</p>
          </div>
        )}
      </section>

      <Footer />
    </div>
  )
}

