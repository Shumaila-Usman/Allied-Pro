import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId
  id: string
  firstName: string
  lastName: string
  email: string
  password: string // hashed
  role: 'normal' | 'dealer' | 'admin'
  dealerId?: string
  createdAt: Date
  passwordChangedAt?: Date
  // Dealer-specific fields
  companyName?: string
  businessType?: string
  businessAddress?: string
  city?: string
  province?: string
  postalCode?: string
  country?: string
  hasSupplier?: boolean
  supplierName?: string
  phoneNumber?: string
}

const UserSchema = new Schema<IUser>(
  {
    id: {
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
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['normal', 'dealer', 'admin'],
      required: true,
      default: 'normal',
    },
    dealerId: {
      type: String,
      sparse: true,
    },
    companyName: String,
    businessType: String,
    businessAddress: String,
    city: String,
    province: String,
    postalCode: String,
    country: String,
    hasSupplier: Boolean,
    supplierName: String,
    phoneNumber: String,
    passwordChangedAt: Date,
  },
  {
    timestamps: true,
  }
)

// Indexes
UserSchema.index({ email: 1 }, { unique: true })
UserSchema.index({ id: 1 }, { unique: true })

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema)

export default User

