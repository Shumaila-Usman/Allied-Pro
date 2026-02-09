import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IAdmin extends Document {
  _id: mongoose.Types.ObjectId
  email: string
  password: string // hashed
  firstName: string
  lastName: string
  createdAt: Date
  updatedAt: Date
}

const AdminSchema = new Schema<IAdmin>(
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
  },
  {
    timestamps: true,
    collection: 'admins',
  }
)

// Index for email lookup
AdminSchema.index({ email: 1 })

const Admin: Model<IAdmin> = mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema)

export default Admin

