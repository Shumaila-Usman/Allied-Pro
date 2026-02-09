import connectDB from './mongodb'
import User, { IUser } from './models/User'

export interface UserData {
  id: string
  firstName: string
  lastName: string
  email: string
  password: string // hashed
  role: 'normal' | 'dealer' | 'admin'
  dealerId?: string
  createdAt: string
  passwordChangedAt?: string
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

// Get all users
export async function getUsers(): Promise<UserData[]> {
  await connectDB()
  const users = await User.find({}).lean()
  return users.map((user) => ({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    password: user.password,
    role: user.role,
    dealerId: user.dealerId,
    createdAt: user.createdAt.toISOString(),
    passwordChangedAt: user.passwordChangedAt?.toISOString(),
    companyName: user.companyName,
    businessType: user.businessType,
    businessAddress: user.businessAddress,
    city: user.city,
    province: user.province,
    postalCode: user.postalCode,
    country: user.country,
    hasSupplier: user.hasSupplier,
    supplierName: user.supplierName,
    phoneNumber: user.phoneNumber,
  }))
}

// Find user by email
export async function findUserByEmail(email: string): Promise<UserData | undefined> {
  await connectDB()
  const user = await User.findOne({ email: email.toLowerCase() }).lean()
  if (!user) return undefined
  
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    password: user.password,
    role: user.role,
    dealerId: user.dealerId,
    createdAt: user.createdAt.toISOString(),
    passwordChangedAt: user.passwordChangedAt?.toISOString(),
    companyName: user.companyName,
    businessType: user.businessType,
    businessAddress: user.businessAddress,
    city: user.city,
    province: user.province,
    postalCode: user.postalCode,
    country: user.country,
    hasSupplier: user.hasSupplier,
    supplierName: user.supplierName,
    phoneNumber: user.phoneNumber,
  }
}

// Find user by ID
export async function findUserById(id: string): Promise<UserData | undefined> {
  await connectDB()
  const user = await User.findOne({ id }).lean()
  if (!user) return undefined
  
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    password: user.password,
    role: user.role,
    dealerId: user.dealerId,
    createdAt: user.createdAt.toISOString(),
    passwordChangedAt: user.passwordChangedAt?.toISOString(),
    companyName: user.companyName,
    businessType: user.businessType,
    businessAddress: user.businessAddress,
    city: user.city,
    province: user.province,
    postalCode: user.postalCode,
    country: user.country,
    hasSupplier: user.hasSupplier,
    supplierName: user.supplierName,
    phoneNumber: user.phoneNumber,
  }
}

// Add new user
export async function addUser(userData: UserData): Promise<void> {
  await connectDB()
  await User.create({
    id: userData.id,
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    password: userData.password,
    role: userData.role,
    dealerId: userData.dealerId,
    createdAt: userData.createdAt ? new Date(userData.createdAt) : new Date(),
    passwordChangedAt: userData.passwordChangedAt ? new Date(userData.passwordChangedAt) : undefined,
    companyName: userData.companyName,
    businessType: userData.businessType,
    businessAddress: userData.businessAddress,
    city: userData.city,
    province: userData.province,
    postalCode: userData.postalCode,
    country: userData.country,
    hasSupplier: userData.hasSupplier,
    supplierName: userData.supplierName,
    phoneNumber: userData.phoneNumber,
  })
}

// Update user
export async function updateUser(id: string, updates: Partial<UserData>): Promise<boolean> {
  await connectDB()
  const updateData: any = {}
  
  if (updates.firstName !== undefined) updateData.firstName = updates.firstName
  if (updates.lastName !== undefined) updateData.lastName = updates.lastName
  if (updates.email !== undefined) updateData.email = updates.email
  if (updates.password !== undefined) updateData.password = updates.password
  if (updates.role !== undefined) updateData.role = updates.role
  if (updates.dealerId !== undefined) updateData.dealerId = updates.dealerId
  if (updates.passwordChangedAt !== undefined) updateData.passwordChangedAt = new Date(updates.passwordChangedAt)
  if (updates.companyName !== undefined) updateData.companyName = updates.companyName
  if (updates.businessType !== undefined) updateData.businessType = updates.businessType
  if (updates.businessAddress !== undefined) updateData.businessAddress = updates.businessAddress
  if (updates.city !== undefined) updateData.city = updates.city
  if (updates.province !== undefined) updateData.province = updates.province
  if (updates.postalCode !== undefined) updateData.postalCode = updates.postalCode
  if (updates.country !== undefined) updateData.country = updates.country
  if (updates.hasSupplier !== undefined) updateData.hasSupplier = updates.hasSupplier
  if (updates.supplierName !== undefined) updateData.supplierName = updates.supplierName
  if (updates.phoneNumber !== undefined) updateData.phoneNumber = updates.phoneNumber
  
  const result = await User.updateOne({ id }, { $set: updateData })
  return result.modifiedCount > 0
}

