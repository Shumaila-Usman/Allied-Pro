import { NextRequest, NextResponse } from 'next/server'
import { getUsers, updateUser } from '@/lib/db'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const users = await User.find({ role: 'normal' }).lean()
    // Remove passwords from response
    const usersWithoutPasswords = users.map(({ password, ...user }) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      createdAt: user.createdAt?.toISOString() || new Date().toISOString(),
    }))
    return NextResponse.json({ users: usersWithoutPasswords }, { status: 200 })
  } catch (error) {
    console.error('Error fetching users:', error)
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
    const { userId, updates } = body

    const user = await User.findOne({ id: userId })
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Don't allow changing role or password through this endpoint
    const { role, password, ...safeUpdates } = updates
    
    // Update user fields
    if (safeUpdates.firstName !== undefined) user.firstName = safeUpdates.firstName
    if (safeUpdates.lastName !== undefined) user.lastName = safeUpdates.lastName
    if (safeUpdates.phoneNumber !== undefined) user.phoneNumber = safeUpdates.phoneNumber
    
    await user.save()

    const { password: _, ...userWithoutPassword } = user.toObject()

    return NextResponse.json(
      { message: 'User updated successfully', user: {
        id: userWithoutPassword.id,
        firstName: userWithoutPassword.firstName,
        lastName: userWithoutPassword.lastName,
        email: userWithoutPassword.email,
        phoneNumber: userWithoutPassword.phoneNumber,
      } },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating user:', error)
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
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const user = await User.findOneAndDelete({ id: userId })
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { message: 'User deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

