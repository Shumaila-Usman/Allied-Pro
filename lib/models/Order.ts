import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IOrder extends Document {
  _id: mongoose.Types.ObjectId
  orderNumber: string
  userId?: string // User ID if logged in
  userEmail: string
  userFirstName?: string
  userLastName?: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  items: {
    productId: string
    productName: string
    quantity: number
    price: number
    cost?: number
    image?: string
  }[]
  subtotal: number
  tax: number
  shipping: number
  total: number
  shippingInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    city: string
    province: string
    postalCode: string
    country: string
  }
  billingInfo: {
    firstName: string
    lastName: string
    address: string
    city: string
    province: string
    postalCode: string
    country: string
  }
  paymentMethod: string
  createdAt: Date
  updatedAt: Date
}

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: String,
      sparse: true,
    },
    userEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    userFirstName: String,
    userLastName: String,
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    items: [
      {
        productId: String,
        productName: String,
        quantity: Number,
        price: Number,
        cost: Number,
        image: String,
      },
    ],
    subtotal: {
      type: Number,
      required: true,
    },
    tax: {
      type: Number,
      required: true,
    },
    shipping: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    shippingInfo: {
      firstName: String,
      lastName: String,
      email: String,
      phone: String,
      address: String,
      city: String,
      province: String,
      postalCode: String,
      country: String,
    },
    billingInfo: {
      firstName: String,
      lastName: String,
      address: String,
      city: String,
      province: String,
      postalCode: String,
      country: String,
    },
    paymentMethod: String,
  },
  {
    timestamps: true,
    collection: 'orders',
  }
)

// Indexes
OrderSchema.index({ userEmail: 1 })
OrderSchema.index({ userId: 1 })
OrderSchema.index({ orderNumber: 1 })
OrderSchema.index({ createdAt: -1 })

const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema)

export default Order

