export type UserRole = 'admin' | 'normal' | 'dealer' | null

export interface User {
  id: string
  firstName: string
  lastName: string
  name: string // Full name (firstName + lastName)
  email: string
  role: UserRole
  dealerId?: string
  createdAt?: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  cost?: number // For dealers
  images: string[]
  categoryId: string
  subcategoryId?: string
  secondSubcategoryId?: string
  category?: string // Legacy support
  brand?: string
  stock: number
  sku?: string
  createdAt?: string
  updatedAt?: string
}

export interface Category {
  id: string
  name: string
  description: string
  image: string
}


