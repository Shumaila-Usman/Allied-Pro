import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getUsers, findUserByEmail, addUser, UserData } from '@/lib/db'
import connectDB from '@/lib/mongodb'
import Dealer from '@/lib/models/Dealer'

// Generate unique dealer ID
function generateDealerId(): string {
  const prefix = 'DEALER'
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}-${timestamp}-${random}`
}

// Mock email sending function (replace with actual email service)
async function sendDealerIdEmail(email: string, dealerId: string, companyName: string) {
  // In production, use a service like SendGrid, AWS SES, or Nodemailer
  console.log(`\n=== DEALER ID EMAIL ===`)
  console.log(`To: ${email}`)
  console.log(`Subject: Your ACBS Dealer ID`)
  console.log(`\nDear ${companyName},\n`)
  console.log(`Thank you for registering as a dealer with ACBS!`)
  console.log(`\nYour Dealer ID is: ${dealerId}`)
  console.log(`\nPlease use this ID along with your email and password to sign in.`)
  console.log(`\nBest regards,\nACBS Team`)
  console.log(`\n======================\n`)
  
  // TODO: Implement actual email sending
  // Example with Nodemailer:
  // await transporter.sendMail({
  //   from: 'noreply@acbs.com',
  //   to: email,
  //   subject: 'Your ACBS Dealer ID',
  //   html: `...`
  // })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      companyName,
      businessType,
      otherBusinessType,
      businessAddress,
      city,
      province,
      postalCode,
      country,
      hasSupplier,
      supplierName,
      firstName,
      lastName,
      phoneNumber,
      email,
      password,
      confirmPassword,
    } = body

    // Validation
    if (!companyName || !businessType || !businessAddress || !city || !province || 
        !postalCode || !firstName || !lastName || !phoneNumber || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { error: 'All required fields must be filled' },
        { status: 400 }
      )
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      )
    }

    // Password validation
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    if (!/[A-Z]/.test(password)) {
      return NextResponse.json(
        { error: 'Password must contain at least one uppercase letter' },
        { status: 400 }
      )
    }

    if (!/[a-z]/.test(password)) {
      return NextResponse.json(
        { error: 'Password must contain at least one lowercase letter' },
        { status: 400 }
      )
    }

    if (!/[0-9]/.test(password)) {
      return NextResponse.json(
        { error: 'Password must contain at least one number' },
        { status: 400 }
      )
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return NextResponse.json(
        { error: 'Password must contain at least one special character' },
        { status: 400 }
      )
    }

    // Check if user already exists as a dealer
    const existingUser = await findUserByEmail(email)
    if (existingUser && existingUser.role === 'dealer') {
      return NextResponse.json(
        { error: 'A dealer account with this email already exists' },
        { status: 409 }
      )
    }
    // Allow same email for normal user and dealer (different roles)

    // Generate dealer ID
    const dealerId = generateDealerId()

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Generate unique user ID (with timestamp and random string to avoid collisions)
    const userId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${Math.random().toString(36).substr(2, 9)}`

    // Create new dealer user
    const newDealer: UserData = {
      id: userId,
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'dealer',
      dealerId,
      createdAt: new Date().toISOString(),
      companyName,
      businessType: businessType === 'Other' ? otherBusinessType : businessType,
      businessAddress,
      city,
      province,
      postalCode,
      country: country || 'Canada',
      hasSupplier: hasSupplier || false,
      supplierName: hasSupplier ? (supplierName || '') : '',
      phoneNumber,
    }

    // Save dealer to both User collection (for backward compatibility) and Dealer collection
    try {
      await connectDB()
      
      // Check if dealer already exists in Dealer collection
      const existingDealer = await Dealer.findOne({ email: email.toLowerCase() })
      if (existingDealer) {
        return NextResponse.json(
          { error: 'A dealer account with this email already exists' },
          { status: 409 }
        )
      }

      // Save to Dealer collection
      await Dealer.create({
        email: email.toLowerCase(),
        password: hashedPassword,
        firstName,
        lastName,
        dealerId,
        phoneNumber,
        companyName,
        businessType: businessType === 'Other' ? otherBusinessType : businessType,
        businessAddress,
        city,
        province,
        postalCode,
        country: country || 'Canada',
        hasSupplier: hasSupplier || false,
        supplierName: hasSupplier ? (supplierName || '') : '',
      })

      // Also save to User collection for backward compatibility
      await addUser(newDealer)
    } catch (dbError: any) {
      console.error('Database error saving dealer:', dbError)
      // Handle duplicate key errors
      if (dbError.code === 11000) {
        const field = Object.keys(dbError.keyPattern || {})[0]
        if (field === 'email') {
          return NextResponse.json(
            { error: 'A user with this email already exists' },
            { status: 409 }
          )
        } else if (field === 'id') {
          // Retry with a new ID if ID collision
          newDealer.id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
          try {
            await addUser(newDealer)
          } catch (retryError) {
            console.error('Retry failed:', retryError)
            return NextResponse.json(
              { error: 'Failed to create dealer account. Please try again.' },
              { status: 500 }
            )
          }
        } else {
          return NextResponse.json(
            { error: `A dealer with this ${field} already exists` },
            { status: 409 }
          )
        }
      } else {
        throw dbError // Re-throw to be caught by outer catch
      }
    }

    // Send dealer ID via email (mock for now)
    try {
      await sendDealerIdEmail(email, dealerId, companyName)
    } catch (emailError) {
      console.error('Email sending error (non-fatal):', emailError)
      // Don't fail registration if email fails
    }

    // Return success (without sensitive data)
    return NextResponse.json(
      {
        message: 'Dealer registered successfully. Your Dealer ID has been sent to your email.',
        dealerId, // Include in response for testing (remove in production)
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Dealer registration error:', error)
    console.error('Error stack:', error.stack)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}

