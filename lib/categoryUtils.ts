// Utility functions for category handling

interface Category {
  id?: string
  _id?: string
  name: string
  slug: string
  level?: number
  subcategories?: SubCategory[]
}

interface SubCategory {
  id?: string
  _id?: string
  name: string
  slug: string
  parentId?: string
  level?: number
  secondSubcategories?: SecondSubCategory[]
}

interface SecondSubCategory {
  id?: string
  _id?: string
  name: string
  slug: string
  parentId?: string
  level?: number
}

// Helper to get category ID (handles both id and _id)
function getCategoryId(cat: any): string {
  return cat.id || cat._id?.toString() || ''
}

// Get category name from categoryId
export function getCategoryName(categoryId: string, categories: Category[]): string {
  if (!categoryId) return ''
  
  // Direct match for root category (by id or slug)
  const rootCategory = categories.find(cat => {
    const id = getCategoryId(cat)
    return id === categoryId || cat.slug === categoryId
  })
  if (rootCategory) {
    return rootCategory.name
  }
  
  // Search in subcategories
  for (const category of categories) {
    if (category.subcategories) {
      for (const subcat of category.subcategories) {
        const subcatId = getCategoryId(subcat)
        if (subcatId === categoryId || subcat.slug === categoryId) {
          return category.name
        }
        
        // Search in second subcategories
        if (subcat.secondSubcategories) {
          for (const secondSubcat of subcat.secondSubcategories) {
            const secondSubcatId = getCategoryId(secondSubcat)
            if (secondSubcatId === categoryId || secondSubcat.slug === categoryId) {
              return category.name
            }
          }
        }
      }
    }
  }
  
  // Fallback slug map
  const slugMap: Record<string, string> = {
    'skincare': 'SKINCARE',
    'nail-products': 'NAIL PRODUCTS',
    'spa-products': 'SPA PRODUCTS',
    'equipment': 'EQUIPMENT',
    'implements': 'IMPLEMENTS',
    'furniture': 'FURNITURE'
  }
  
  return slugMap[categoryId] || categoryId
}

// Helper function to recursively search all categories and subcategories
function findCategoryById(categories: Category[], targetId: string): { category: Category, path: Category[] } | null {
  for (const cat of categories) {
    const id = getCategoryId(cat)
    // Match by id, _id, or slug
    if (id === targetId || cat.slug === targetId || cat.slug?.toLowerCase() === targetId.toLowerCase()) {
      return { category: cat, path: [cat] }
    }
    
    // Search in subcategories
    if (cat.subcategories) {
      for (const subcat of cat.subcategories) {
        const subcatId = getCategoryId(subcat)
        if (subcatId === targetId || subcat.slug === targetId || subcat.slug?.toLowerCase() === targetId.toLowerCase()) {
          return { category: subcat, path: [cat, subcat] }
        }
        
        // Search in second subcategories
        if (subcat.secondSubcategories) {
          for (const secondSubcat of subcat.secondSubcategories) {
            const secondSubcatId = getCategoryId(secondSubcat)
            if (secondSubcatId === targetId || secondSubcat.slug === targetId || secondSubcat.slug?.toLowerCase() === targetId.toLowerCase()) {
              return { category: secondSubcat, path: [cat, subcat, secondSubcat] }
            }
          }
        }
      }
    }
  }
  return null
}

// Helper to find category by ID or slug (searches all levels)
function findCategoryByAnyId(categories: Category[], targetId: string): Category | SubCategory | SecondSubCategory | null {
  if (!targetId) return null
  
  for (const cat of categories) {
    const id = getCategoryId(cat)
    if (id === targetId || cat.slug === targetId || cat.slug?.toLowerCase() === targetId.toLowerCase()) {
      return cat
    }
    
    if (cat.subcategories) {
      for (const subcat of cat.subcategories) {
        const subcatId = getCategoryId(subcat)
        if (subcatId === targetId || subcat.slug === targetId || subcat.slug?.toLowerCase() === targetId.toLowerCase()) {
          return subcat
        }
        
        if (subcat.secondSubcategories) {
          for (const secondSubcat of subcat.secondSubcategories) {
            const secondSubcatId = getCategoryId(secondSubcat)
            if (secondSubcatId === targetId || secondSubcat.slug === targetId || secondSubcat.slug?.toLowerCase() === targetId.toLowerCase()) {
              return secondSubcat
            }
          }
        }
      }
    }
  }
  return null
}

// Get full category path (e.g., "SKINCARE/By Category/Face Masks")
export function getCategoryPath(
  categoryId: string,
  subcategoryId: string | undefined,
  secondSubcategoryId: string | undefined,
  categories: Category[]
): string {
  // Normalize empty strings to undefined
  const catId = categoryId?.trim() || undefined
  const subId = subcategoryId?.trim() || undefined
  const secondSubId = secondSubcategoryId?.trim() || undefined
  
  if (!catId && !subId && !secondSubId) return ''
  
  const parts: string[] = []
  let rootCategory: Category | null = null
  let foundSubcat: SubCategory | null = null
  let foundSecondSubcat: SecondSubCategory | null = null
  
  // Step 1: Find root category by categoryId
  if (catId) {
    for (const cat of categories) {
      const id = getCategoryId(cat)
      if (id === catId || 
          cat.slug === catId || 
          cat.slug?.toLowerCase() === catId.toLowerCase()) {
        rootCategory = cat
        break
      }
    }
  }
  
  // Step 2: If root not found but we have subcategoryId, search for it to find root
  if (!rootCategory && subId) {
    for (const cat of categories) {
      if (cat.subcategories) {
        for (const subcat of cat.subcategories) {
          const subcatId = getCategoryId(subcat)
          if (subcatId === subId || 
              subcat.slug === subId || 
              subcat.slug?.toLowerCase() === subId.toLowerCase()) {
            rootCategory = cat
            foundSubcat = subcat
            break
          }
        }
        if (rootCategory) break
      }
    }
  }
  
  // Step 3: If root still not found but we have secondSubcategoryId, search for it
  if (!rootCategory && secondSubId) {
    for (const cat of categories) {
      if (cat.subcategories) {
        for (const subcat of cat.subcategories) {
          if (subcat.secondSubcategories) {
            for (const secondSubcat of subcat.secondSubcategories) {
              const secondSubcatId = getCategoryId(secondSubcat)
              if (secondSubcatId === secondSubId || 
                  secondSubcat.slug === secondSubId || 
                  secondSubcat.slug?.toLowerCase() === secondSubId.toLowerCase()) {
                rootCategory = cat
                foundSubcat = subcat
                foundSecondSubcat = secondSubcat
                break
              }
            }
            if (rootCategory) break
          }
        }
        if (rootCategory) break
      }
    }
  }
  
  // Step 4: Build the path - we must have rootCategory at this point
  if (rootCategory) {
    parts.push(rootCategory.name)
    
    // Find subcategory if we have subcategoryId and haven't found it yet
    if (subId && !foundSubcat && rootCategory.subcategories) {
      for (const subcat of rootCategory.subcategories) {
        const subcatId = getCategoryId(subcat)
        if (subcatId === subId || 
            subcat.slug === subId || 
            subcat.slug?.toLowerCase() === subId.toLowerCase()) {
          foundSubcat = subcat
          break
        }
      }
    }
    
    // Add subcategory to path if found
    if (foundSubcat) {
      parts.push(foundSubcat.name)
      
      // Find second subcategory if we have secondSubcategoryId and haven't found it yet
      if (secondSubId && !foundSecondSubcat && foundSubcat.secondSubcategories) {
        for (const secondSubcat of foundSubcat.secondSubcategories) {
          const secondSubcatId = getCategoryId(secondSubcat)
          if (secondSubcatId === secondSubId || 
              secondSubcat.slug === secondSubId || 
              secondSubcat.slug?.toLowerCase() === secondSubId.toLowerCase()) {
            foundSecondSubcat = secondSubcat
            break
          }
        }
      }
      
      // Add second subcategory to path if found
      if (foundSecondSubcat) {
        parts.push(foundSecondSubcat.name)
      }
    }
  } else if (catId) {
    // Fallback: just get root category name
    const fallbackName = getCategoryName(catId, categories)
    if (fallbackName && fallbackName !== catId) {
      parts.push(fallbackName)
    }
  }
  
  return parts.length > 0 ? parts.join('/') : ''
}

