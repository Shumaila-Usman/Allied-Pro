import connectDB from '../lib/mongodb'
import Category from '../lib/models/Category'
import Product from '../lib/models/Product'
import User from '../lib/models/User'
import fs from 'fs'
import path from 'path'

// Read existing JSON data
const categoriesPath = path.join(process.cwd(), 'data', 'categories.json')
const productsPath = path.join(process.cwd(), 'data', 'products.json')
const usersPath = path.join(process.cwd(), 'data', 'users.json')

interface CategoryJSON {
  id: string
  name: string
  slug: string
  subcategories?: SubCategoryJSON[]
}

interface SubCategoryJSON {
  id: string
  name: string
  slug: string
  parentId: string
  secondSubcategories?: SecondSubCategoryJSON[]
}

interface SecondSubCategoryJSON {
  id: string
  name: string
  slug: string
  parentId: string
}

interface ProductJSON {
  id: string
  name: string
  description: string
  price: number
  cost?: number
  images: string[]
  categoryId: string
  subcategoryId?: string
  secondSubcategoryId?: string
  stock: number
  sku?: string
  createdAt: string
  updatedAt: string
}

interface UserJSON {
  id: string
  firstName: string
  lastName: string
  email: string
  password: string
  role: 'normal' | 'dealer' | 'admin'
  dealerId?: string
  createdAt: string
  passwordChangedAt?: string
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

async function seedCategories() {
  console.log('🌱 Seeding categories...')
  
  const categoriesData: CategoryJSON[] = JSON.parse(fs.readFileSync(categoriesPath, 'utf-8'))
  const categoryMap = new Map<string, string>() // slug -> ObjectId
  
  // First pass: Create all root categories
  for (const category of categoriesData) {
    let rootCategory
    const existing = await Category.findOne({ slug: category.slug })
    if (existing) {
      rootCategory = existing
      categoryMap.set(category.slug, existing._id.toString())
      console.log(`  ✓ Root category "${category.name}" already exists`)
    } else {
      rootCategory = await Category.create({
        name: category.name,
        slug: category.slug,
        parent: null,
        level: 0,
      })
      categoryMap.set(category.slug, rootCategory._id.toString())
      console.log(`  ✓ Created root category "${category.name}"`)
    }
    
    // Second pass: Create subcategories (even if root already exists)
    if (category.subcategories) {
      for (const subcategory of category.subcategories) {
        const parentId = rootCategory._id
        const subSlug = `${category.slug}-${subcategory.slug}`
        
        let subCategory
        const existingSub = await Category.findOne({ slug: subSlug })
        if (existingSub) {
          subCategory = existingSub
          categoryMap.set(subSlug, existingSub._id.toString())
          console.log(`    ✓ Subcategory "${subcategory.name}" already exists`)
        } else {
          // Also check if a category with same name exists (in case of duplicate name index - it's global)
          const existingByName = await Category.findOne({ name: subcategory.name })
          if (existingByName) {
            subCategory = existingByName
            categoryMap.set(subSlug, existingByName._id.toString())
            // Update parent, level, and slug if different
            if (existingByName.parent?.toString() !== parentId.toString()) {
              existingByName.parent = parentId
              existingByName.level = 1
            }
            if (existingByName.slug !== subSlug) {
              existingByName.slug = subSlug
            }
            await existingByName.save()
            console.log(`    ✓ Subcategory "${subcategory.name}" already exists (by name)`)
          } else {
            try {
              subCategory = await Category.create({
                name: subcategory.name,
                slug: subSlug,
                parent: parentId,
                level: 1,
              })
              categoryMap.set(subSlug, subCategory._id.toString())
              console.log(`    ✓ Created subcategory "${subcategory.name}"`)
            } catch (error: any) {
              // If duplicate name error, try to find existing category (check by name only since index is on name)
              if (error.code === 11000 && error.keyPattern?.name) {
                const existingByName = await Category.findOne({ name: subcategory.name })
                if (existingByName) {
                  subCategory = existingByName
                  categoryMap.set(subSlug, existingByName._id.toString())
                  // Update parent and slug if different
                  if (existingByName.parent?.toString() !== parentId.toString()) {
                    existingByName.parent = parentId
                    existingByName.level = 1
                  }
                  if (existingByName.slug !== subSlug) {
                    existingByName.slug = subSlug
                  }
                  await existingByName.save()
                  console.log(`    ✓ Subcategory "${subcategory.name}" already exists (found after duplicate error)`)
                } else {
                  throw error
                }
              } else {
                throw error
              }
            }
          }
        }
        
        // Third pass: Create second subcategories (even if subcategory already exists)
        if (subcategory.secondSubcategories) {
          for (const secondSub of subcategory.secondSubcategories) {
            const secondSubSlug = `${subSlug}-${secondSub.slug}`
            
            const existingSecondSub = await Category.findOne({ slug: secondSubSlug })
            if (existingSecondSub) {
              categoryMap.set(secondSubSlug, existingSecondSub._id.toString())
              console.log(`      ✓ Second subcategory "${secondSub.name}" already exists`)
              continue
            }
            
            // Also check if a category with same name exists (in case of duplicate name index - it's global)
            const existingByName = await Category.findOne({ name: secondSub.name })
            if (existingByName) {
              categoryMap.set(secondSubSlug, existingByName._id.toString())
              // Update parent, level, and slug if different
              if (existingByName.parent?.toString() !== subCategory._id.toString()) {
                existingByName.parent = subCategory._id
                existingByName.level = 2
              }
              if (existingByName.slug !== secondSubSlug) {
                existingByName.slug = secondSubSlug
              }
              await existingByName.save()
              console.log(`      ✓ Second subcategory "${secondSub.name}" already exists (by name)`)
              continue
            }
            
            try {
              const secondSubCategory = await Category.create({
                name: secondSub.name,
                slug: secondSubSlug,
                parent: subCategory._id,
                level: 2,
              })
              categoryMap.set(secondSubSlug, secondSubCategory._id.toString())
              console.log(`      ✓ Created second subcategory "${secondSub.name}"`)
            } catch (error: any) {
              // If duplicate name error, try to find existing category (check by name only since index is on name)
              if (error.code === 11000 && error.keyPattern?.name) {
                const existingByName = await Category.findOne({ name: secondSub.name })
                if (existingByName) {
                  categoryMap.set(secondSubSlug, existingByName._id.toString())
                  // Update parent and slug if different
                  if (existingByName.parent?.toString() !== subCategory._id.toString()) {
                    existingByName.parent = subCategory._id
                    existingByName.level = 2
                  }
                  if (existingByName.slug !== secondSubSlug) {
                    existingByName.slug = secondSubSlug
                  }
                  await existingByName.save()
                  console.log(`      ✓ Second subcategory "${secondSub.name}" already exists (found after duplicate error)`)
                } else {
                  throw error
                }
              } else {
                throw error
              }
            }
          }
        }
      }
    }
  }
  
  return categoryMap
}

async function seedProducts(categoryMap: Map<string, string>) {
  console.log('🌱 Seeding products...')
  
  const productsData: ProductJSON[] = JSON.parse(fs.readFileSync(productsPath, 'utf-8'))
  const categoriesData: CategoryJSON[] = JSON.parse(fs.readFileSync(categoriesPath, 'utf-8'))
  
  // Build a map from old category IDs to MongoDB ObjectIds
  const idToObjectIdMap = new Map<string, string>()
  
  // Map root categories
  for (const cat of categoriesData) {
    const mongoId = categoryMap.get(cat.slug)
    if (mongoId) {
      idToObjectIdMap.set(cat.id, mongoId)
    }
    
    // Map subcategories
    if (cat.subcategories) {
      for (const sub of cat.subcategories) {
        const subSlug = `${cat.slug}-${sub.slug}`
        const subMongoId = categoryMap.get(subSlug)
        if (subMongoId) {
          idToObjectIdMap.set(sub.id, subMongoId)
        }
        
        // Map second subcategories
        if (sub.secondSubcategories) {
          for (const secondSub of sub.secondSubcategories) {
            const secondSubSlug = `${subSlug}-${secondSub.slug}`
            const secondSubMongoId = categoryMap.get(secondSubSlug)
            if (secondSubMongoId) {
              idToObjectIdMap.set(secondSub.id, secondSubMongoId)
              console.log(`  Mapped secondSubcategory: ${secondSub.id} (${secondSub.name}) -> ${secondSubMongoId}`)
            } else {
              console.log(`  ⚠️ Warning: Could not find category for slug: ${secondSubSlug} (${secondSub.name})`)
            }
          }
        }
      }
    }
  }
  
  console.log(`  Total category mappings: ${idToObjectIdMap.size}`)
  
  let created = 0
  let skipped = 0
  
  for (const product of productsData) {
    // Determine the leaf category ObjectId
    let categoryId: string | null = null
    
    if (product.secondSubcategoryId) {
      categoryId = idToObjectIdMap.get(product.secondSubcategoryId) || null
    } else if (product.subcategoryId) {
      // Check if this subcategory has children - if so, it's not a leaf
      const subMongoId = idToObjectIdMap.get(product.subcategoryId)
      if (subMongoId) {
        const hasChildren = await Category.findOne({ parent: subMongoId })
        if (!hasChildren) {
          categoryId = subMongoId
        }
      }
    } else if (product.categoryId) {
      // Check if root category has children - if so, it's not a leaf
      const rootMongoId = idToObjectIdMap.get(product.categoryId)
      if (rootMongoId) {
        const hasChildren = await Category.findOne({ parent: rootMongoId })
        if (!hasChildren) {
          categoryId = rootMongoId
        }
      }
    }
    
    if (!categoryId) {
      console.log(`  ⚠ Skipping product "${product.name}" - leaf category not found`)
      skipped++
      continue
    }
    
    // Check if product already exists (by name and category)
    const existing = await Product.findOne({ name: product.name, category: categoryId })
    if (existing) {
      skipped++
      continue
    }
    
    await Product.create({
      name: product.name,
      description: product.description || '',
      prices: {
        retail: product.price,
        dealer: product.cost,
      },
      images: product.images || [],
      stock: product.stock || 0,
      category: categoryId,
      isActive: true,
    })
    created++
  }
  
  console.log(`  ✓ Created ${created} products, skipped ${skipped} existing`)
}

async function seedUsers() {
  console.log('🌱 Seeding users...')
  
  if (!fs.existsSync(usersPath)) {
    console.log('  ⚠ No users.json file found, skipping user migration')
    return
  }
  
  const usersData: UserJSON[] = JSON.parse(fs.readFileSync(usersPath, 'utf-8'))
  let created = 0
  let skipped = 0
  
  for (const user of usersData) {
    // Check by id first
    const existingById = await User.findOne({ id: user.id })
    if (existingById) {
      skipped++
      continue
    }
    
    // Also check by email to avoid duplicates
    const existingByEmail = await User.findOne({ email: user.email })
    if (existingByEmail) {
      skipped++
      continue
    }
    
    try {
      await User.create({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
        role: user.role,
        dealerId: user.dealerId,
        createdAt: user.createdAt ? new Date(user.createdAt) : new Date(),
        passwordChangedAt: user.passwordChangedAt ? new Date(user.passwordChangedAt) : undefined,
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
      })
      created++
    } catch (error: any) {
      // Skip duplicate key errors
      if (error.code === 11000) {
        skipped++
        console.log(`  ⚠ Skipping user "${user.email}" - duplicate key error`)
      } else {
        throw error
      }
    }
  }
  
  console.log(`  ✓ Created ${created} users, skipped ${skipped} existing`)
}

async function main() {
  try {
    console.log('🚀 Starting MongoDB seed...\n')
    
    await connectDB()
    console.log('✓ Connected to MongoDB\n')
    
    // Clear existing data (optional - comment out if you want to keep existing data)
    // await Category.deleteMany({})
    // await Product.deleteMany({})
    // await User.deleteMany({})
    
    const categoryMap = await seedCategories()
    console.log('')
    
    await seedProducts(categoryMap)
    console.log('')
    
    await seedUsers()
    console.log('')
    
    console.log('✅ Seed completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  }
}

main()

