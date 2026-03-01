/**
 * Script to check what files need to be uploaded to Hostinger
 * This helps ensure all necessary files are included in deployment
 * 
 * Usage: npx tsx scripts/check-deployment-files.ts
 */

import fs from 'fs'
import path from 'path'

function checkDeploymentFiles() {
  console.log('📋 Hostinger Deployment Checklist\n')
  console.log('─'.repeat(80))

  const checks: Array<{ name: string; path: string; exists: boolean; count?: number }> = []

  // Check public/products folder
  const productsDir = path.join(process.cwd(), 'public', 'products')
  const productsExists = fs.existsSync(productsDir)
  let productCount = 0
  if (productsExists) {
    productCount = fs.readdirSync(productsDir).length
  }
  checks.push({
    name: 'public/products/ folder',
    path: productsDir,
    exists: productsExists,
    count: productCount
  })

  // Check .env file
  const envPath = path.join(process.cwd(), '.env')
  const envLocalPath = path.join(process.cwd(), '.env.local')
  const envExists = fs.existsSync(envPath) || fs.existsSync(envLocalPath)
  checks.push({
    name: '.env file (MongoDB connection)',
    path: envPath,
    exists: envExists
  })

  // Check package.json
  const packagePath = path.join(process.cwd(), 'package.json')
  const packageExists = fs.existsSync(packagePath)
  checks.push({
    name: 'package.json',
    path: packagePath,
    exists: packageExists
  })

  // Check next.config.js
  const nextConfigPath = path.join(process.cwd(), 'next.config.js')
  const nextConfigExists = fs.existsSync(nextConfigPath)
  checks.push({
    name: 'next.config.js',
    path: nextConfigPath,
    exists: nextConfigExists
  })

  // Display results
  console.log('\n📦 Files to Upload to Hostinger:\n')

  let allGood = true
  for (const check of checks) {
    const status = check.exists ? '✅' : '❌'
    const countInfo = check.count !== undefined ? ` (${check.count} files)` : ''
    
    console.log(`${status} ${check.name}${countInfo}`)
    
    if (!check.exists) {
      allGood = false
      console.log(`   ⚠️  MISSING: ${check.path}`)
    } else if (check.name === 'public/products/ folder' && check.count !== undefined) {
      if (check.count < 150) {
        console.log(`   ⚠️  WARNING: Only ${check.count} files found. Expected ~197 image files.`)
        allGood = false
      } else {
        console.log(`   ✅ All ${check.count} image files present`)
      }
    }
    console.log()
  }

  console.log('─'.repeat(80))
  console.log('\n📝 Hostinger Upload Instructions:\n')

  if (allGood) {
    console.log('✅ All required files are present!\n')
  } else {
    console.log('⚠️  Some files are missing. Please check above.\n')
  }

  console.log('1. Via cPanel File Manager:')
  console.log('   - Log into Hostinger cPanel')
  console.log('   - Go to File Manager')
  console.log('   - Navigate to public_html/ (or your domain folder)')
  console.log('   - Upload the entire public/products/ folder with all image files')
  console.log()

  console.log('2. Via FTP (FileZilla, WinSCP):')
  console.log('   - Connect to your Hostinger FTP')
  console.log('   - Navigate to public_html/')
  console.log('   - Upload public/products/ folder with all files')
  console.log()

  console.log('3. Critical Files:')
  console.log('   ✅ public/products/ - ALL 197 image files must be uploaded')
  console.log('   ✅ .env - MongoDB connection string for production')
  console.log('   ✅ .next/ - Built Next.js app (after npm run build)')
  console.log('   ✅ node_modules/ - Or install on server with npm install')
  console.log()

  console.log('4. Verify After Upload:')
  console.log('   - Check: https://yoursite.com/public/products/Hyaluronic-Acid-Gel-Mask-30ml.PNG')
  console.log('   - Should show the image directly')
  console.log('   - If 404, images are not uploaded correctly')
  console.log()

  console.log('📖 Full guide: See HOSTINGER_DEPLOYMENT.md')
}

checkDeploymentFiles()

