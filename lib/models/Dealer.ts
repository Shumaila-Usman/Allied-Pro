import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IDealer extends Document {
  _id: mongoose.Types.ObjectId
  email: string
  password: string // hashed
  firstName: string
  lastName: string
  dealerId: string
  phoneNumber?: string
  companyName?: string
  businessType?: string
  businessAddress?: string
  city?: string
  province?: string
  postalCode?: string
  country?: string
  hasSupplier?: boolean
  supplierName?: string
  createdAt: Date
  updatedAt: Date
}

const DealerSchema = new Schema<IDealer>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    dealerId: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: String,
    companyName: String,
    businessType: String,
    businessAddress: String,
    city: String,
    province: String,
    postalCode: String,
    country: String,
    hasSupplier: Boolean,
    supplierName: String,
  },
  {
    timestamps: true,
    collection: 'dealers',
  }
)

// Indexes
DealerSchema.index({ email: 1 })
DealerSchema.index({ dealerId: 1 })

const Dealer: Model<IDealer> = mongoose.models.Dealer || mongoose.model<IDealer>('Dealer', DealerSchema)

export default Dealer

