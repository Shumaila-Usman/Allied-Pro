import mongoose, { Schema, Document, Model, Types } from 'mongoose'

export interface ICategory extends Document {
  _id: mongoose.Types.ObjectId
  name: string
  slug: string
  parent: Types.ObjectId | null
  level: number // 0 = root, 1 = subcategory, 2 = sub-subcategory
  createdAt: Date
  updatedAt: Date
}

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
    level: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

// Indexes
CategorySchema.index({ slug: 1 }, { unique: true })
CategorySchema.index({ parent: 1 })
CategorySchema.index({ level: 1 })

const Category: Model<ICategory> = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema)

export default Category

