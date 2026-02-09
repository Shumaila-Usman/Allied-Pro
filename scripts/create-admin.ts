import bcrypt from 'bcryptjs'
import { getUsers, saveUsers, UserData } from '../lib/db'

async function createAdmin() {
  const email = 'admin@acbs.com'
  const password = 'Admin123!'
  const firstName = 'Admin'
  const lastName = 'User'

  const users = getUsers()
  
  // Check if admin already exists
  const existingAdmin = users.find(u => u.email === email)
  if (existingAdmin) {
    console.log('Admin user already exists!')
    console.log(`Email: ${email}`)
    console.log(`Password: ${password}`)
    return
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Create admin user
  const adminUser: UserData = {
    id: `admin_${Date.now()}`,
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role: 'admin',
    createdAt: new Date().toISOString(),
  }

  users.push(adminUser)
  saveUsers(users)

  console.log('✅ Admin user created successfully!')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📧 Email:', email)
  console.log('🔑 Password:', password)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('⚠️  Please change the password after first login!')
}

createAdmin().catch(console.error)

