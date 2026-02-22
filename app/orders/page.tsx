'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import MainNav from '@/components/MainNav'
import Footer from '@/components/Footer'
import Image from 'next/image'
import Link from 'next/link'

interface Order {
  id: string
  orderNumber: string
  date: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total: number
  items: {
    id: string
    name: string
    image: string
    quantity: number
    price: number
  }[]
}

export default function OrdersPage() {
  const { user, isLoggedIn, isDealer } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [topPadding, setTopPadding] = useState(176) // Default padding

  useEffect(() => {
    document.title = 'Orders - Allied Concept Beauty Supplies'
  }, [])

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

    // Fetch orders from API
    fetchOrders()
  }, [isLoggedIn, router])

  const fetchOrders = async () => {
    setIsLoading(true)
    try {
      let url = `/api/orders?email=${encodeURIComponent(user?.email || '')}`
      if (user?.id) {
        url += `&userId=${encodeURIComponent(user.id)}`
      }
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders || [])
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Orders</h1>
          <p className="text-gray-600">View and manage all your orders</p>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
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
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Orders Yet</h2>
            <p className="text-gray-600 mb-6">You haven't placed any orders yet. Start shopping to see your orders here!</p>
            <Link
              href="/"
              className="inline-block bg-gradient-to-r from-[#87CEEB] to-[#C8A2C8] text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200 hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 pb-6 border-b border-gray-200">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">Order #{order.orderNumber}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Placed on {formatDate(order.date)}</p>
                  </div>
                  <div className="mt-4 md:mt-0 text-right">
                    <p className="text-2xl font-bold text-gray-900">${order.total.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="relative w-20 h-20 bg-white rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                        <Image
                          src={item.image || '/products/product-1-1.jpg'}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate">{item.name}</h4>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                        <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end">
                  <button className="bg-gradient-to-r from-[#87CEEB] to-[#C8A2C8] text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity duration-300">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

