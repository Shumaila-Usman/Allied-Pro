import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { findUserByEmail } from '@/lib/db'
import connectDB from '@/lib/mongodb'
import Admin from '@/lib/models/Admin'

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const body = await request.json()
    const { email, password } = body

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // First check Admin collection
    let admin = await Admin.findOne({ email: email.toLowerCase() }).lean()
    
    // If not found in Admin collection, check User collection (for backward compatibility)
    if (!admin) {
      const user = await findUserByEmail(email)
      if (user && user.role === 'admin') {
        // Migrate admin from User collection to Admin collection
        admin = await Admin.create({
          email: user.email,
          password: user.password,
          firstName: user.firstName,
          lastName: user.lastName,
        })
        admin = admin.toObject()
      }
    }

    if (!admin) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, admin.password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Return admin data (without password)
    const { password: _, ...adminWithoutPassword } = admin

    return NextResponse.json(
      {
        message: 'Admin login successful',
        user: {
          id: admin._id.toString(),
          firstName: admin.firstName,
          lastName: admin.lastName,
          email: admin.email,
          role: 'admin',
          createdAt: admin.createdAt?.toISOString() || new Date().toISOString(),
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

