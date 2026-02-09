import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const dealers = await User.find({ role: 'dealer' }).lean()
    // Remove passwords from response
    const dealersWithoutPasswords = dealers.map(({ password, ...dealer }) => ({
      id: dealer.id,
      firstName: dealer.firstName,
      lastName: dealer.lastName,
      email: dealer.email,
      dealerId: dealer.dealerId,
      companyName: dealer.companyName,
      phoneNumber: dealer.phoneNumber,
      createdAt: dealer.createdAt?.toISOString() || new Date().toISOString(),
    }))
    return NextResponse.json({ dealers: dealersWithoutPasswords }, { status: 200 })
  } catch (error) {
    console.error('Error fetching dealers:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB()
    const body = await request.json()
    const { dealerId, updates } = body

    const dealer = await User.findOne({ id: dealerId })
    
    if (!dealer) {
      return NextResponse.json(
        { error: 'Dealer not found' },
        { status: 404 }
      )
    }

    // Don't allow changing role or password through this endpoint
    const { role, password, ...safeUpdates } = updates
    
    // Update dealer fields
    if (safeUpdates.firstName !== undefined) dealer.firstName = safeUpdates.firstName
    if (safeUpdates.lastName !== undefined) dealer.lastName = safeUpdates.lastName
    if (safeUpdates.companyName !== undefined) dealer.companyName = safeUpdates.companyName
    if (safeUpdates.phoneNumber !== undefined) dealer.phoneNumber = safeUpdates.phoneNumber
    
    await dealer.save()

    const { password: _, ...dealerWithoutPassword } = dealer.toObject()

    return NextResponse.json(
      { message: 'Dealer updated successfully', dealer: {
        id: dealerWithoutPassword.id,
        firstName: dealerWithoutPassword.firstName,
        lastName: dealerWithoutPassword.lastName,
        email: dealerWithoutPassword.email,
        dealerId: dealerWithoutPassword.dealerId,
        companyName: dealerWithoutPassword.companyName,
        phoneNumber: dealerWithoutPassword.phoneNumber,
      } },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating dealer:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const dealerId = searchParams.get('dealerId')

    if (!dealerId) {
      return NextResponse.json(
        { error: 'Dealer ID is required' },
        { status: 400 }
      )
    }

    const dealer = await User.findOneAndDelete({ id: dealerId })
    
    if (!dealer) {
      return NextResponse.json(
        { error: 'Dealer not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { message: 'Dealer deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting dealer:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

