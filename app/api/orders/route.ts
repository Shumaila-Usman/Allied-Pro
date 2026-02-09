import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Order from '@/lib/models/Order'

// Generate unique order number
function generateOrderNumber(): string {
  const prefix = 'ORD'
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}-${timestamp}-${random}`
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const body = await request.json()

    const {
      items,
      subtotal,
      tax,
      shipping,
      total,
      shippingInfo,
      billingInfo,
      paymentMethod,
      userId,
      userEmail,
      userFirstName,
      userLastName,
    } = body

    // Validation
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Order must contain at least one item' },
        { status: 400 }
      )
    }

    if (!shippingInfo || !shippingInfo.email) {
      return NextResponse.json(
        { error: 'Shipping information is required' },
        { status: 400 }
      )
    }

    // Generate order number
    const orderNumber = generateOrderNumber()

    // Create order
    const order = await Order.create({
      orderNumber,
      userId,
      userEmail: userEmail || shippingInfo.email,
      userFirstName: userFirstName || shippingInfo.firstName,
      userLastName: userLastName || shippingInfo.lastName,
      status: 'pending',
      items,
      subtotal,
      tax,
      shipping,
      total,
      shippingInfo,
      billingInfo,
      paymentMethod,
    })

    const createdOrder = await Order.findById(order._id).lean()

    return NextResponse.json(
      {
        message: 'Order created successfully',
        order: {
          id: createdOrder._id.toString(),
          orderNumber: createdOrder.orderNumber,
          status: createdOrder.status,
          total: createdOrder.total,
          createdAt: createdOrder.createdAt,
        },
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const userId = searchParams.get('userId')

    if (!email && !userId) {
      return NextResponse.json(
        { error: 'Email or userId is required' },
        { status: 400 }
      )
    }

    // Build query
    const query: any = {}
    if (email) {
      query.userEmail = email.toLowerCase()
    }
    if (userId) {
      query.userId = userId
    }

    // Fetch orders from database
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .lean()

    // Transform to match frontend format
    const transformedOrders = orders.map((order: any) => ({
      id: order._id.toString(),
      orderNumber: order.orderNumber,
      date: order.createdAt?.toISOString() || new Date().toISOString(),
      status: order.status || 'pending',
      total: order.total || 0,
      items: order.items || [],
      shippingInfo: order.shippingInfo || {},
      billingInfo: order.billingInfo || {},
    }))

    return NextResponse.json(
      { orders: transformedOrders },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
