'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import MainNav from '@/components/MainNav'
import Footer from '@/components/Footer'

interface TrackingInfo {
  orderId: string
  status: string
  estimatedDelivery: string
  currentLocation: string
  timeline: {
    date: string
    time: string
    status: string
    location: string
    description: string
  }[]
}

export default function TrackOrderPage() {
  const { isLoggedIn, isDealer } = useAuth()
  const router = useRouter()
  const [orderId, setOrderId] = useState('')
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
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

  // Dummy tracking data
  const getDummyTracking = (orderId: string): TrackingInfo => {
    return {
      orderId,
      status: 'shipped',
      estimatedDelivery: '2024-01-25',
      currentLocation: 'Toronto, ON',
      timeline: [
        {
          date: '2024-01-20',
          time: '10:30 AM',
          status: 'Order Placed',
          location: 'Warehouse',
          description: 'Your order has been placed and is being processed.',
        },
        {
          date: '2024-01-21',
          time: '02:15 PM',
          status: 'Processing',
          location: 'Warehouse',
          description: 'Your order is being prepared for shipment.',
        },
        {
          date: '2024-01-22',
          time: '09:00 AM',
          status: 'Shipped',
          location: 'Toronto, ON',
          description: 'Your order has been shipped and is in transit.',
        },
        {
          date: '2024-01-23',
          time: '11:45 AM',
          status: 'In Transit',
          location: 'Mississauga, ON',
          description: 'Your order is on the way to the delivery location.',
        },
      ],
    }
  }

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setTrackingInfo(null)

    if (!orderId.trim()) {
      setError('Please enter an order ID')
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      // For now, use dummy data
      const tracking = getDummyTracking(orderId.trim())
      setTrackingInfo(tracking)
      setIsLoading(false)
    }, 1000)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'order placed':
        return 'bg-blue-100 text-blue-800'
      case 'processing':
        return 'bg-yellow-100 text-yellow-800'
      case 'shipped':
        return 'bg-purple-100 text-purple-800'
      case 'in transit':
        return 'bg-indigo-100 text-indigo-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  useEffect(() => {
    if (!isLoggedIn || !isDealer) {
      router.push('/sign-in')
    }
  }, [isLoggedIn, isDealer, router])

  if (!isLoggedIn || !isDealer) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <Header />
      <MainNav />

      <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full" style={{ paddingTop: `${topPadding + 48}px` }}>
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Track Your Order</h1>
          <p className="text-gray-600">Enter your order ID to track the status of your shipment</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 mb-8">
          <form onSubmit={handleTrackOrder} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Order ID</label>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="Enter your order ID (e.g., ORD-12345)"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-gradient-to-r from-[#87CEEB] to-[#C8A2C8] text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Tracking...' : 'Track Order'}
                </button>
              </div>
            </div>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                <p className="text-sm">{error}</p>
              </div>
            )}
          </form>
        </div>

        {trackingInfo && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Order #{trackingInfo.orderId}</h2>
                  <p className="text-sm text-gray-600">Estimated Delivery: {new Date(trackingInfo.estimatedDelivery).toLocaleDateString()}</p>
                </div>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wide ${getStatusColor(
                    trackingInfo.status
                  )}`}
                >
                  {trackingInfo.status}
                </span>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Current Location:</strong> {trackingInfo.currentLocation}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6">Tracking Timeline</h3>
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#87CEEB] to-[#C8A2C8]"></div>

                {/* Timeline items */}
                <div className="space-y-8">
                  {trackingInfo.timeline.map((event, index) => (
                    <div key={index} className="relative flex items-start gap-6">
                      {/* Timeline dot */}
                      <div className="relative z-10 flex-shrink-0">
                        <div className="w-8 h-8 bg-gradient-to-r from-[#87CEEB] to-[#C8A2C8] rounded-full border-4 border-white shadow-lg"></div>
                      </div>

                      {/* Event content */}
                      <div className="flex-1 bg-gray-50 rounded-lg p-5 border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${getStatusColor(
                              event.status
                            )}`}
                          >
                            {event.status}
                          </span>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-gray-900">{event.date}</p>
                            <p className="text-xs text-gray-600">{event.time}</p>
                          </div>
                        </div>
                        <p className="text-sm font-medium text-gray-700 mb-1">{event.location}</p>
                        <p className="text-sm text-gray-600">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {!trackingInfo && !isLoading && (
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Track Your Order</h2>
            <p className="text-gray-600">Enter your order ID above to see real-time tracking information</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

