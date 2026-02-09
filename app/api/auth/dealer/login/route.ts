import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { findUserByEmail } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, dealerId, password } = body

    // Validation
    if (!email || !dealerId || !password) {
      return NextResponse.json(
        { error: 'Email, Dealer ID, and password are required' },
        { status: 400 }
      )
    }

    // Find user
    const user = await findUserByEmail(email)
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email, dealer ID, or password' },
        { status: 401 }
      )
    }

    // Verify it's a dealer
    if (user.role !== 'dealer') {
      return NextResponse.json(
        { error: 'This account is not a dealer account' },
        { status: 403 }
      )
    }

    // Verify dealer ID
    if (user.dealerId !== dealerId) {
      return NextResponse.json(
        { error: 'Invalid email, dealer ID, or password' },
        { status: 401 }
      )
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email, dealer ID, or password' },
        { status: 401 }
      )
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
    console.error('Dealer login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

