import mongoose, { Schema, Document, Model, Types } from 'mongoose'

export interface IProduct extends Document {
  _id: mongoose.Types.ObjectId
  name: string
  description: string
  prices: {
    retail?: number
    dealer?: number
  }
  images: string[]
  stock: number
  category: Types.ObjectId // must point to LEAF category only
  isActive: boolean
  sku?: string
  createdAt: Date
  updatedAt: Date
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    prices: {
      retail: Number,
      dealer: Number,
    },
    images: {
      type: [String],
      default: [],
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    sku: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: 'products', // Explicitly set collection name
  }
)

// Indexes
ProductSchema.index({ category: 1 })
ProductSchema.index({ isActive: 1 })
ProductSchema.index({ name: 'text', description: 'text' })

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema)

export default Product

