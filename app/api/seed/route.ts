import { NextResponse } from 'next/server'
import { saveCategories, saveProducts } from '@/lib/products'
import type { Category, Product } from '@/lib/products'

// This is a simplified version - in production, you'd want to protect this route
export async function POST() {
  try {
    // Import and run the seed logic
    // For now, return a message that the seed script should be run manually
    return NextResponse.json({
      message: 'Please run the seed script manually using: npx tsx scripts/seed-products.ts',
    })
  } catch (error) {
    console.error('Error seeding:', error)
    return NextResponse.json({ error: 'Failed to seed' }, { status: 500 })
  }
}

