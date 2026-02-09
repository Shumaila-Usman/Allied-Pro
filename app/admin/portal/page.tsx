'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Product } from '@/types'
import { Category } from '@/lib/products'

export default function AdminPortalPage() {
  const { user, isAdmin, isLoggedIn, logout } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'orders' | 'users' | 'dealers' | 'products'>('orders')
  
  // Orders state
  const [orders, setOrders] = useState<any[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [editingOrder, setEditingOrder] = useState<string | null>(null)
  const [orderEditData, setOrderEditData] = useState<any>({})

  // Users state
  const [users, setUsers] = useState<any[]>([])
  const [usersLoading, setUsersLoading] = useState(true)
  const [editingUser, setEditingUser] = useState<string | null>(null)
  const [userEditData, setUserEditData] = useState<any>({})

  // Dealers state
  const [dealers, setDealers] = useState<any[]>([])
  const [dealersLoading, setDealersLoading] = useState(true)
  const [editingDealer, setEditingDealer] = useState<string | null>(null)
  const [dealerEditData, setDealerEditData] = useState<any>({})

  // Products state
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [leafCategories, setLeafCategories] = useState<any[]>([])
  const [productsLoading, setProductsLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState<string | null>(null)
  const [productEditData, setProductEditData] = useState<any>({})
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [newProduct, setNewProduct] = useState<any>({
    name: '',
    description: '',
    price: 0,
    cost: 0,
    stock: 0,
    sku: '',
    categoryId: '',
    images: [],
  })

  useEffect(() => {
    if (!isLoggedIn || !isAdmin) {
      router.push('/sign-in')
      return
    }
  }, [isLoggedIn, isAdmin, router])

  // Fetch orders
  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders()
    }
  }, [activeTab])

  // Fetch users
  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers()
    }
  }, [activeTab])

  // Fetch dealers
  useEffect(() => {
    if (activeTab === 'dealers') {
      fetchDealers()
    }
  }, [activeTab])

  // Fetch products and categories
  useEffect(() => {
    if (activeTab === 'products') {
      fetchProducts()
      fetchCategories()
    }
  }, [activeTab])

  const fetchOrders = async () => {
    setOrdersLoading(true)
    try {
      const response = await fetch('/api/admin/orders')
      const data = await response.json()
      setOrders(data.orders || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setOrdersLoading(false)
    }
  }

  const fetchUsers = async () => {
    setUsersLoading(true)
    try {
      const response = await fetch('/api/admin/users')
      const data = await response.json()
      setUsers(data.users || [])
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setUsersLoading(false)
    }
  }

  const fetchDealers = async () => {
    setDealersLoading(true)
    try {
      const response = await fetch('/api/admin/dealers')
      const data = await response.json()
      setDealers(data.dealers || [])
    } catch (error) {
      console.error('Error fetching dealers:', error)
    } finally {
      setDealersLoading(false)
    }
  }

  const fetchProducts = async () => {
    setProductsLoading(true)
    try {
      const response = await fetch('/api/admin/products')
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('Error fetching products:', response.status, errorData)
        setProducts([])
        return
      }
      const data = await response.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error('Error fetching products:', error)
      setProducts([])
    } finally {
      setProductsLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      const data = await response.json()
      setCategories(data.categories || [])
      
      // Also fetch all categories to get leaf categories for product form
      const allCategoriesResponse = await fetch('/api/admin/categories/leaf')
      if (allCategoriesResponse.ok) {
        const leafData = await allCategoriesResponse.json()
        setLeafCategories(leafData.leafCategories || [])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleUpdateOrder = async (orderId: string) => {
    try {
      const response = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, updates: orderEditData }),
      })
      const data = await response.json()
      if (response.ok) {
        setEditingOrder(null)
        setOrderEditData({})
        fetchOrders()
        alert('Order updated successfully')
      } else {
        alert(data.error || 'Failed to update order')
      }
    } catch (error) {
      alert('Error updating order')
    }
  }

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order?')) return
    try {
      const response = await fetch(`/api/admin/orders?orderId=${orderId}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        fetchOrders()
        alert('Order deleted successfully')
      } else {
        alert('Failed to delete order')
      }
    } catch (error) {
      alert('Error deleting order')
    }
  }

  const handleUpdateUser = async (userId: string) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, updates: userEditData }),
      })
      const data = await response.json()
      if (response.ok) {
        setEditingUser(null)
        setUserEditData({})
        fetchUsers()
        alert('User updated successfully')
      } else {
        alert(data.error || 'Failed to update user')
      }
    } catch (error) {
      alert('Error updating user')
    }
  }

  const handleUpdateDealer = async (dealerId: string) => {
    try {
      const response = await fetch('/api/admin/dealers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dealerId, updates: dealerEditData }),
      })
      const data = await response.json()
      if (response.ok) {
        setEditingDealer(null)
        setDealerEditData({})
        fetchDealers()
        alert('Dealer updated successfully')
      } else {
        alert(data.error || 'Failed to update dealer')
      }
    } catch (error) {
      alert('Error updating dealer')
    }
  }

  const handleUpdateProduct = async (productId: string) => {
    try {
      const response = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, updates: productEditData }),
      })
      const data = await response.json()
      if (response.ok) {
        setEditingProduct(null)
        setProductEditData({})
        fetchProducts()
        alert('Product updated successfully')
      } else {
        alert(data.error || 'Failed to update product')
      }
    } catch (error) {
      alert('Error updating product')
    }
  }

  const handleAddProduct = async () => {
    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      })
      const data = await response.json()
      if (response.ok) {
        setShowAddProduct(false)
        setNewProduct({
          name: '',
          description: '',
          price: 0,
          cost: 0,
          stock: 0,
          sku: '',
          categoryId: '',
          images: [],
        })
        fetchProducts()
        alert('Product added successfully')
      } else {
        alert(data.error || 'Failed to add product')
      }
    } catch (error) {
      alert('Error adding product')
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    try {
      const response = await fetch(`/api/admin/products?productId=${productId}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        fetchProducts()
        alert('Product deleted successfully')
      } else {
        alert('Failed to delete product')
      }
    } catch (error) {
      alert('Error deleting product')
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return
    try {
      const response = await fetch(`/api/admin/users?userId=${userId}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        fetchUsers()
        alert('User deleted successfully')
      } else {
        alert('Failed to delete user')
      }
    } catch (error) {
      alert('Error deleting user')
    }
  }

  const handleDeleteDealer = async (dealerId: string) => {
    if (!confirm('Are you sure you want to delete this dealer?')) return
    try {
      const response = await fetch(`/api/admin/dealers?dealerId=${dealerId}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        fetchDealers()
        alert('Dealer deleted successfully')
      } else {
        alert('Failed to delete dealer')
      }
    } catch (error) {
      alert('Error deleting dealer')
    }
  }

  if (!isLoggedIn || !isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Logo at top center - not clickable */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-center">
        <div className="flex items-center">
          <Image
            src="/logo-removebg-preview.png"
            alt="ACBS Logo"
            width={150}
            height={80}
            className="object-contain h-auto w-auto cursor-default"
            style={{ maxWidth: '150px', pointerEvents: 'none' }}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-1">
            {(['orders', 'users', 'dealers', 'products'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 font-medium text-sm transition-colors ${
                  activeTab === tab
                    ? 'border-b-2 border-primary-500 text-primary-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Orders Management</h2>
            {ordersLoading ? (
              <div className="text-center py-12">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12 text-gray-500">No orders found</div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.customerEmail || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(order.date || order.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${order.total?.toFixed(2) || '0.00'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {editingOrder === order.id ? (
                            <select
                              value={orderEditData.status || order.status}
                              onChange={(e) => setOrderEditData({ ...orderEditData, status: e.target.value })}
                              className="border border-gray-300 rounded px-2 py-1"
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          ) : (
                            <span className={`px-2 py-1 rounded text-xs ${
                              order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                              order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {order.status || 'pending'}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {editingOrder === order.id ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleUpdateOrder(order.id)}
                                className="text-green-600 hover:text-green-800"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => {
                                  setEditingOrder(null)
                                  setOrderEditData({})
                                }}
                                className="text-gray-600 hover:text-gray-800"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setEditingOrder(order.id)
                                  setOrderEditData({ status: order.status })
                                }}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteOrder(order.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Users Management</h2>
            {usersLoading ? (
              <div className="text-center py-12">Loading users...</div>
            ) : users.length === 0 ? (
              <div className="text-center py-12 text-gray-500">No users found</div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {editingUser === user.id ? (
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={userEditData.firstName || user.firstName}
                                onChange={(e) => setUserEditData({ ...userEditData, firstName: e.target.value })}
                                className="border border-gray-300 rounded px-2 py-1 w-24"
                                placeholder="First Name"
                              />
                              <input
                                type="text"
                                value={userEditData.lastName || user.lastName}
                                onChange={(e) => setUserEditData({ ...userEditData, lastName: e.target.value })}
                                className="border border-gray-300 rounded px-2 py-1 w-24"
                                placeholder="Last Name"
                              />
                            </div>
                          ) : (
                            `${user.firstName} ${user.lastName}`
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {editingUser === user.id ? (
                            <input
                              type="text"
                              value={userEditData.phoneNumber || user.phoneNumber || ''}
                              onChange={(e) => setUserEditData({ ...userEditData, phoneNumber: e.target.value })}
                              className="border border-gray-300 rounded px-2 py-1 w-32"
                              placeholder="Phone"
                            />
                          ) : (
                            user.phoneNumber || 'N/A'
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {editingUser === user.id ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleUpdateUser(user.id)}
                                className="text-green-600 hover:text-green-800"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => {
                                  setEditingUser(null)
                                  setUserEditData({})
                                }}
                                className="text-gray-600 hover:text-gray-800"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setEditingUser(user.id)
                                  setUserEditData({ firstName: user.firstName, lastName: user.lastName, phoneNumber: user.phoneNumber || '' })
                                }}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Dealers Tab */}
        {activeTab === 'dealers' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Dealers Management</h2>
            {dealersLoading ? (
              <div className="text-center py-12">Loading dealers...</div>
            ) : dealers.length === 0 ? (
              <div className="text-center py-12 text-gray-500">No dealers found</div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dealer ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dealers.map((dealer) => (
                      <tr key={dealer.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {editingDealer === dealer.id ? (
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={dealerEditData.firstName || dealer.firstName}
                                onChange={(e) => setDealerEditData({ ...dealerEditData, firstName: e.target.value })}
                                className="border border-gray-300 rounded px-2 py-1 w-24"
                                placeholder="First Name"
                              />
                              <input
                                type="text"
                                value={dealerEditData.lastName || dealer.lastName}
                                onChange={(e) => setDealerEditData({ ...dealerEditData, lastName: e.target.value })}
                                className="border border-gray-300 rounded px-2 py-1 w-24"
                                placeholder="Last Name"
                              />
                            </div>
                          ) : (
                            `${dealer.firstName} ${dealer.lastName}`
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dealer.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {editingDealer === dealer.id ? (
                            <input
                              type="text"
                              value={dealerEditData.companyName || dealer.companyName || ''}
                              onChange={(e) => setDealerEditData({ ...dealerEditData, companyName: e.target.value })}
                              className="border border-gray-300 rounded px-2 py-1 w-32"
                              placeholder="Company"
                            />
                          ) : (
                            dealer.companyName || 'N/A'
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dealer.dealerId || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {editingDealer === dealer.id ? (
                            <input
                              type="text"
                              value={dealerEditData.phoneNumber || dealer.phoneNumber || ''}
                              onChange={(e) => setDealerEditData({ ...dealerEditData, phoneNumber: e.target.value })}
                              className="border border-gray-300 rounded px-2 py-1 w-32"
                              placeholder="Phone"
                            />
                          ) : (
                            dealer.phoneNumber || 'N/A'
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {editingDealer === dealer.id ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleUpdateDealer(dealer.id)}
                                className="text-green-600 hover:text-green-800"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => {
                                  setEditingDealer(null)
                                  setDealerEditData({})
                                }}
                                className="text-gray-600 hover:text-gray-800"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setEditingDealer(dealer.id)
                                  setDealerEditData({
                                    firstName: dealer.firstName,
                                    lastName: dealer.lastName,
                                    companyName: dealer.companyName || '',
                                    phoneNumber: dealer.phoneNumber || '',
                                  })
                                }}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteDealer(dealer.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Products Management</h2>
              <button
                onClick={() => setShowAddProduct(true)}
                className="px-4 py-2 bg-gradient-to-r from-[#87CEEB] to-[#C8A2C8] text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                Add Product
              </button>
            </div>

            {showAddProduct && (
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h3 className="text-xl font-bold mb-4">Add New Product</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Product Name</label>
                    <input
                      type="text"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">SKU</label>
                    <input
                      type="text"
                      value={newProduct.sku}
                      onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Price</label>
                    <input
                      type="number"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Cost (Dealer)</label>
                    <input
                      type="number"
                      value={newProduct.cost}
                      onChange={(e) => setNewProduct({ ...newProduct, cost: parseFloat(e.target.value) })}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Stock</label>
                    <input
                      type="number"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Category (Leaf Category Only)</label>
                    <select
                      value={newProduct.categoryId}
                      onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    >
                      <option value="">Select Category</option>
                      {leafCategories.map((cat: any) => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      rows={3}
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={handleAddProduct}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Add Product
                  </button>
                  <button
                    onClick={() => setShowAddProduct(false)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {productsLoading ? (
              <div className="text-center py-12">Loading products...</div>
            ) : products.length === 0 ? (
              <div className="text-center py-12 text-gray-500">No products found</div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.sku || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {editingProduct && (editingProduct === String(product.id) || editingProduct === product.id) ? (
                            <input
                              type="number"
                              step="0.01"
                              value={productEditData.price !== undefined ? productEditData.price : product.price}
                              onChange={(e) => setProductEditData({ ...productEditData, price: parseFloat(e.target.value) || 0 })}
                              className="border border-gray-300 rounded px-2 py-1 w-24"
                            />
                          ) : (
                            `$${product.price.toFixed(2)}`
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {editingProduct && (editingProduct === String(product.id) || editingProduct === product.id) ? (
                            <input
                              type="number"
                              step="0.01"
                              value={productEditData.cost !== undefined ? productEditData.cost : (product.cost || 0)}
                              onChange={(e) => setProductEditData({ ...productEditData, cost: parseFloat(e.target.value) || 0 })}
                              className="border border-gray-300 rounded px-2 py-1 w-24"
                            />
                          ) : (
                            `$${(product.cost || 0).toFixed(2)}`
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {editingProduct && (editingProduct === String(product.id) || editingProduct === product.id) ? (
                            <input
                              type="number"
                              value={productEditData.stock !== undefined ? productEditData.stock : product.stock}
                              onChange={(e) => setProductEditData({ ...productEditData, stock: parseInt(e.target.value) || 0 })}
                              className="border border-gray-300 rounded px-2 py-1 w-24"
                            />
                          ) : (
                            product.stock
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {editingProduct && (editingProduct === String(product.id) || editingProduct === product.id) ? (
                            <div className="flex gap-2 items-center">
                              <button
                                type="button"
                                onClick={() => handleUpdateProduct(String(product.id))}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-md whitespace-nowrap cursor-pointer"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingProduct(null)
                                  setProductEditData({})
                                }}
                                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium shadow-md whitespace-nowrap cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  const productId = String(product.id)
                                  setEditingProduct(productId)
                                  setProductEditData({ 
                                    price: product.price, 
                                    cost: product.cost || 0, 
                                    stock: product.stock || 0 
                                  })
                                }}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteProduct(String(product.id))}
                                className="text-red-600 hover:text-red-800"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

