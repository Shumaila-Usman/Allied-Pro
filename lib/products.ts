import fs from 'fs'
import path from 'path'

const productsPath = path.join(process.cwd(), 'data', 'products.json')
const categoriesPath = path.join(process.cwd(), 'data', 'categories.json')

export interface Category {
  id: string
  name: string
  slug: string
  subcategories?: SubCategory[]
}

export interface SubCategory {
  id: string
  name: string
  slug: string
  parentId: string
  secondSubcategories?: SecondSubCategory[]
}

export interface SecondSubCategory {
  id: string
  name: string
  slug: string
  parentId: string
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
  brand?: string
  stock: number
  sku?: string
  createdAt: string
  updatedAt: string
}

// Ensure data directory exists
function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

// Categories functions
export function getCategories(): Category[] {
  ensureDataDir()
  if (!fs.existsSync(categoriesPath)) {
    return []
  }
  try {
    const data = fs.readFileSync(categoriesPath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

export function saveCategories(categories: Category[]): void {
  ensureDataDir()
  fs.writeFileSync(categoriesPath, JSON.stringify(categories, null, 2))
}

// Products functions
export function getProducts(): Product[] {
  ensureDataDir()
  if (!fs.existsSync(productsPath)) {
    return []
  }
  try {
    const data = fs.readFileSync(productsPath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    return []
  }

}

export function saveProducts(products: Product[]): void {
  ensureDataDir()
  fs.writeFileSync(productsPath, JSON.stringify(products, null, 2))
}

export function getProductById(id: string): Product | undefined {
  const products = getProducts()
  return products.find((p) => p.id === id)
}

export function getProductsByCategory(categoryId: string): Product[] {
  const products = getProducts()
  return products.filter((p) => p.categoryId === categoryId)
}

export function getProductsBySubCategory(subcategoryId: string): Product[] {
  const products = getProducts()
  return products.filter((p) => p.subcategoryId === subcategoryId)
}

export function getProductsBySecondSubCategory(secondSubcategoryId: string): Product[] {
  const products = getProducts()
  return products.filter((p) => p.secondSubcategoryId === secondSubcategoryId)
}

