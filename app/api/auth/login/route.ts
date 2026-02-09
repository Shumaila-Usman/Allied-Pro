import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { findUserByEmail } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, dealerId } = body

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find user
    const user = await findUserByEmail(email)
    if (!user) {
      return NextResponse.json(
        { error: 'No such user exists' },
        { status: 401 }
      )
    }

    // If user is admin, reject login through regular login endpoint
    if (user.role === 'admin') {
      return NextResponse.json(
        { error: 'No such user exists' },
        { status: 401 }
      )
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'No such user exists' },
        { status: 401 }
      )
    }

    // If dealer login, verify dealer ID
    if (dealerId) {
      if (user.role !== 'dealer' || user.dealerId !== dealerId) {
        return NextResponse.json(
          { error: 'Invalid dealer credentials' },
          { status: 401 }
        )
      }
    }

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(
      {
        message: 'Login successful',
        user: userWithoutPassword,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

