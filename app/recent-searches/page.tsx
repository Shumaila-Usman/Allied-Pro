'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import MainNav from '@/components/MainNav'
import Footer from '@/components/Footer'
import Image from 'next/image'
import Link from 'next/link'

interface SearchItem {
  id: string
  query: string
  timestamp: string
  results: {
    id: string
    name: string
    image: string
    price: number
    brand: string
  }[]
}

export default function RecentSearchesPage() {
  const { user, isLoggedIn } = useAuth()
  const router = useRouter()
  const [searches, setSearches] = useState<SearchItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [topPadding, setTopPadding] = useState(176) // Default padding

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
    setTimeout(calculatePadding, 100)

    return () => {
      window.removeEventListener('resize', calculatePadding)
    }
  }, [])

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/sign-in')
      return
    }

    // Fetch recent searches from localStorage or API
    fetchRecentSearches()
  }, [isLoggedIn, router])

  const fetchRecentSearches = () => {
    setIsLoading(true)
    try {
      // Get from localStorage (for now)
      const savedSearches = localStorage.getItem(`recentSearches_${user?.email}`)
      if (savedSearches) {
        const parsedSearches = JSON.parse(savedSearches)
        // Get last 10 searches
        const last10Searches = parsedSearches.slice(-10).reverse()
        setSearches(last10Searches)
      }
    } catch (error) {
      console.error('Error fetching recent searches:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) {
      return 'Just now'
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400)
      return `${days} day${days !== 1 ? 's' : ''} ago`
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      })
    }
  }

  if (!isLoggedIn) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <Header />
      <MainNav />

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full" style={{ paddingTop: `${topPadding + 48}px` }}>
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Recent Searches</h1>
          <p className="text-gray-600">View your last 10 search queries and results</p>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading searches...</p>
          </div>
        ) : searches.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="mb-6">
              <svg
                className="w-24 h-24 mx-auto text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Recent Searches</h2>
            <p className="text-gray-600 mb-6">Your recent search history will appear here. Start searching for products!</p>
            <Link
              href="/"
              className="inline-block bg-gradient-to-r from-[#87CEEB] to-[#C8A2C8] text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {searches.map((search) => (
              <div
                key={search.id}
                className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200 hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-[#87CEEB] to-[#C8A2C8] rounded-full flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">"{search.query}"</h3>
                      <p className="text-sm text-gray-600">{formatDate(search.timestamp)}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                    {search.results.length} result{search.results.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {search.results.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {search.results.slice(0, 6).map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.id}`}
                        className="group bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-primary-400 hover:shadow-lg transition-all duration-300"
                      >
                        <div className="relative w-full h-48 bg-white rounded-lg overflow-hidden border border-gray-200 mb-3">
                          <Image
                            src={product.image || '/products/product-1-1.jpg'}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-1 line-clamp-2">{product.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
                        <p className="text-lg font-bold text-primary-600">${product.price.toFixed(2)}</p>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No results found for this search</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

