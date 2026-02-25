'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import Header from '@/components/Header'
import MainNav from '@/components/MainNav'
import Footer from '@/components/Footer'

interface DealerAuthPageProps {
  initialMode?: 'login' | 'register'
}

export default function DealerAuthPage({ initialMode }: DealerAuthPageProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { login } = useAuth()
  
  const [isRegisterMode, setIsRegisterMode] = useState(
    initialMode === 'register' || pathname === '/dealer/sign-up'
  )

  useEffect(() => {
    if (isRegisterMode && pathname !== '/dealer/sign-up') {
      router.replace('/dealer/sign-up', { scroll: false })
    } else if (!isRegisterMode && pathname !== '/dealer/sign-in') {
      router.replace('/dealer/sign-in', { scroll: false })
    }
  }, [isRegisterMode, pathname, router])

  // Dealer Register form state
  const [registerData, setRegisterData] = useState({
    // Business Information
    companyName: '',
    businessType: '',
    otherBusinessType: '',
    businessAddress: '',
    city: '',
    province: '',
    postalCode: '',
    country: 'Canada',
    // Supplier Information
    hasSupplier: false,
    supplierName: '',
    // Contact & Login
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  // Dealer Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    dealerId: '',
    password: '',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showDealerIdModal, setShowDealerIdModal] = useState(false)
  const [dealerId, setDealerId] = useState<string>('')
  const [copied, setCopied] = useState(false)
  const [passwordErrors, setPasswordErrors] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
    matches: false,
  })

  const toggleMode = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    setIsRegisterMode(!isRegisterMode)
  }

  const validatePassword = (password: string, confirmPassword: string) => {
    const errors = {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      matches: password === confirmPassword,
    }
    setPasswordErrors(errors)
    return Object.values(errors).every(Boolean)
  }

  useEffect(() => {
    validatePassword(registerData.password, registerData.confirmPassword)
    if (!registerData.password && !registerData.confirmPassword) {
      setPasswordErrors({
        minLength: false,
        hasUpperCase: false,
        hasLowerCase: false,
        hasNumber: false,
        hasSpecialChar: false,
        matches: false,
      })
    }
  }, [registerData.password, registerData.confirmPassword])

  const validatePhoneNumber = (phone: string): boolean => {
    // Canadian phone number validation
    // Format: (XXX) XXX-XXXX or XXX-XXX-XXXX or XXXXXXXXXX
    // Area codes: 2XX, 3XX, 4XX, 5XX, 6XX, 7XX, 8XX, 9XX
    const canadianPhoneRegex = /^(\+?1[-.\s]?)?\(?([2-9][0-9]{2})\)?[-.\s]?([2-9][0-9]{2})[-.\s]?([0-9]{4})$/
    return canadianPhoneRegex.test(phone.replace(/\s/g, ''))
  }

  const copyDealerId = () => {
    navigator.clipboard.writeText(dealerId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCloseModal = () => {
    setShowDealerIdModal(false)
    router.push('/dealer/sign-in')
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    // Validate password
    if (!validatePassword(registerData.password, registerData.confirmPassword)) {
      setError('Please fulfill all password requirements and ensure passwords match.')
      return
    }

    // Validate Canadian phone number
    if (registerData.country === 'Canada' && !validatePhoneNumber(registerData.phoneNumber)) {
      setError('Please enter a valid Canadian phone number (e.g., (123) 456-7890 or 123-456-7890)')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/dealer/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Registration failed')
        setIsLoading(false)
        return
      }

      // Show dealer ID in popup
      setDealerId(data.dealerId)
      setShowDealerIdModal(true)
      setIsLoading(false)
    } catch (error) {
      console.error('Registration error:', error)
      setError('Network error. Please try again.')
      setIsLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/dealer/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Login failed')
        setIsLoading(false)
        return
      }

      const userData = data.user
      
      // Update auth context - login function will handle the API call
      const result = await login(loginData.email, loginData.password, loginData.dealerId)
      
      if (result.success) {
        router.push('/')
      } else {
        setError(result.error || 'Login failed')
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('Network error. Please try again.')
      setIsLoading(false)
    }
  }

  const provinces = [
    'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick',
    'Newfoundland and Labrador', 'Northwest Territories', 'Nova Scotia',
    'Nunavut', 'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan', 'Yukon'
  ]

  const businessTypes = [
    'Retail Store',
    'Salon',
    'Spa',
    'Distributor',
    'Wholesaler',
    'Other'
  ]

  // Province to cities mapping
  const provinceCities: Record<string, string[]> = {
    'Ontario': ['Toronto', 'Ottawa', 'Mississauga', 'Brampton', 'Hamilton', 'London', 'Markham', 'Vaughan', 'Windsor', 'Kitchener', 'Richmond Hill', 'Burlington', 'Oakville', 'Oshawa', 'St. Catharines'],
    'Quebec': ['Montreal', 'Quebec City', 'Laval', 'Gatineau', 'Longueuil', 'Sherbrooke', 'Saguenay', 'Lévis', 'Trois-Rivières', 'Terrebonne', 'Saint-Jean-sur-Richelieu', 'Repentigny', 'Brossard', 'Drummondville'],
    'British Columbia': ['Vancouver', 'Surrey', 'Burnaby', 'Richmond', 'Coquitlam', 'Langley', 'Abbotsford', 'North Vancouver', 'West Vancouver', 'Kelowna', 'Victoria', 'New Westminster', 'Port Coquitlam'],
    'Alberta': ['Calgary', 'Edmonton', 'Red Deer', 'Lethbridge', 'St. Albert', 'Medicine Hat', 'Grande Prairie', 'Airdrie', 'Spruce Grove', 'Leduc', 'Okotoks', 'Fort McMurray'],
    'Manitoba': ['Winnipeg', 'Brandon', 'Steinbach', 'Thompson', 'Portage la Prairie', 'Winkler', 'Selkirk', 'Morden', 'Dauphin'],
    'Saskatchewan': ['Saskatoon', 'Regina', 'Prince Albert', 'Moose Jaw', 'Swift Current', 'Yorkton', 'North Battleford', 'Estevan', 'Weyburn'],
    'Nova Scotia': ['Halifax', 'Dartmouth', 'Sydney', 'Truro', 'New Glasgow', 'Glace Bay', 'Kentville', 'Amherst', 'Bridgewater'],
    'New Brunswick': ['Saint John', 'Moncton', 'Fredericton', 'Dieppe', 'Miramichi', 'Edmundston', 'Campbellton', 'Bathurst'],
    'Newfoundland and Labrador': ['St. John\'s', 'Mount Pearl', 'Corner Brook', 'Conception Bay South', 'Grand Falls-Windsor', 'Gander', 'Happy Valley-Goose Bay'],
    'Prince Edward Island': ['Charlottetown', 'Summerside', 'Stratford', 'Cornwall', 'Montague'],
    'Northwest Territories': ['Yellowknife', 'Hay River', 'Inuvik', 'Fort Smith'],
    'Nunavut': ['Iqaluit', 'Rankin Inlet', 'Arviat', 'Baker Lake'],
    'Yukon': ['Whitehorse', 'Dawson City', 'Watson Lake']
  }

  const [topPadding, setTopPadding] = useState(176) // Default padding
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const calculatePadding = () => {
      const header = document.getElementById('main-header')
      const nav = document.getElementById('main-nav')
      const isMobile = window.innerWidth < 768 // md breakpoint
      
      if (header && nav) {
        // Get actual heights, accounting for when header might be hidden
        const headerHeight = header.offsetHeight > 0 ? header.offsetHeight : header.scrollHeight
        const navHeight = nav.offsetHeight
        
        // On mobile, nav is not fixed, so only account for header
        // On desktop, account for both header and nav
        const totalHeight = isMobile ? headerHeight : headerHeight + navHeight
        // Add extra padding to ensure content is not hidden
        setTopPadding(totalHeight + (isMobile ? 20 : 48))
      } else {
        // Fallback padding if elements not found
        setTopPadding(isMobile ? 120 : 220)
      }
    }

    // Calculate immediately
    calculatePadding()
    
    // Recalculate after delays to ensure DOM is ready
    const timeout1 = setTimeout(calculatePadding, 100)
    const timeout2 = setTimeout(calculatePadding, 300)
    const timeout3 = setTimeout(calculatePadding, 500)
    
    window.addEventListener('resize', calculatePadding)

    return () => {
      clearTimeout(timeout1)
      clearTimeout(timeout2)
      clearTimeout(timeout3)
      window.removeEventListener('resize', calculatePadding)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <MainNav />
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={{ paddingTop: `${topPadding}px` }}>
        <div className="max-w-6xl w-full">
          {/* Mobile: Simple Form */}
          <div className="md:hidden w-full max-w-md mx-auto">
            {error && (
              <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg">
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}
            {isRegisterMode ? (
              <div className="bg-white rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Dealer Registration</h2>
                <form onSubmit={handleRegister} className="space-y-4">
                  {/* Business Information */}
                  <div className="border-b border-gray-200 pb-4 mb-4">
                    <h3 className="text-base font-semibold text-gray-900 mb-3">1 BUSINESS INFORMATION</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                        <input
                          type="text"
                          value={registerData.companyName}
                          onChange={(e) => setRegisterData({ ...registerData, companyName: e.target.value })}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type of Business</label>
                        <select
                          value={registerData.businessType}
                          onChange={(e) => setRegisterData({ ...registerData, businessType: e.target.value, otherBusinessType: e.target.value !== 'Other' ? '' : registerData.otherBusinessType })}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm"
                        >
                          <option value="">Select...</option>
                          {businessTypes.map((type) => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                        {registerData.businessType === 'Other' && (
                          <div className="mt-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Please specify</label>
                            <input
                              type="text"
                              value={registerData.otherBusinessType}
                              onChange={(e) => setRegisterData({ ...registerData, otherBusinessType: e.target.value })}
                              required
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm"
                              placeholder="Enter your business type"
                            />
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Business Address</label>
                        <input
                          type="text"
                          value={registerData.businessAddress}
                          onChange={(e) => setRegisterData({ ...registerData, businessAddress: e.target.value })}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
                        <select
                          value={registerData.province}
                          onChange={(e) => setRegisterData({ ...registerData, province: e.target.value, city: '' })}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm"
                        >
                          <option value="">Select...</option>
                          {provinces.map((province) => (
                            <option key={province} value={province}>{province}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                        {registerData.province ? (
                          <select
                            value={registerData.city}
                            onChange={(e) => setRegisterData({ ...registerData, city: e.target.value })}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm"
                          >
                            <option value="">Select City...</option>
                            {provinceCities[registerData.province]?.map((city) => (
                              <option key={city} value={city}>{city}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            value={registerData.city}
                            onChange={(e) => setRegisterData({ ...registerData, city: e.target.value })}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm bg-gray-50"
                            placeholder="Select province first"
                            disabled
                          />
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                          <input
                            type="text"
                            value={registerData.postalCode}
                            onChange={(e) => setRegisterData({ ...registerData, postalCode: e.target.value })}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                          <input
                            type="text"
                            value={registerData.country}
                            readOnly
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Supplier Information */}
                  <div className="border-b border-gray-200 pb-4 mb-4">
                    <h3 className="text-base font-semibold text-gray-900 mb-3">2 SUPPLIER INFORMATION (OPTIONAL)</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Do you currently have a supplier?</label>
                      <div className="flex gap-4 mb-3">
                        <button
                          type="button"
                          onClick={() => setRegisterData({ ...registerData, hasSupplier: true, supplierName: registerData.hasSupplier ? registerData.supplierName : '' })}
                          className={`px-6 py-2 rounded-lg font-medium transition-colors text-sm ${
                            registerData.hasSupplier
                              ? 'bg-primary-400 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => setRegisterData({ ...registerData, hasSupplier: false, supplierName: '' })}
                          className={`px-6 py-2 rounded-lg font-medium transition-colors text-sm ${
                            !registerData.hasSupplier
                              ? 'bg-primary-400 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          No
                        </button>
                      </div>
                      {registerData.hasSupplier && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Supplier Name</label>
                          <input
                            type="text"
                            value={registerData.supplierName}
                            onChange={(e) => setRegisterData({ ...registerData, supplierName: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm"
                            placeholder="Enter supplier name"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contact & Login */}
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-3">3 CONTACT & LOGIN</h3>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                          <input
                            type="text"
                            value={registerData.firstName}
                            onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                          <input
                            type="text"
                            value={registerData.lastName}
                            onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          value={registerData.phoneNumber}
                          onChange={(e) => setRegisterData({ ...registerData, phoneNumber: e.target.value })}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm"
                          placeholder={registerData.country === 'Canada' ? '(123) 456-7890' : 'Phone Number'}
                        />
                        {registerData.country === 'Canada' && registerData.phoneNumber && !validatePhoneNumber(registerData.phoneNumber) && (
                          <p className="mt-1 text-xs text-red-600">Please enter a valid Canadian phone number</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                          type="email"
                          value={registerData.email}
                          onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={registerData.password}
                            onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                            required
                            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showPassword ? (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            )}
                          </button>
                        </div>
                        {registerData.password && (
                          <div className="mt-2 text-xs space-y-1">
                            <div className={`flex items-center ${passwordErrors.minLength ? 'text-green-600' : 'text-gray-500'}`}>
                              <span className="mr-2">{passwordErrors.minLength ? '✓' : '○'}</span>
                              At least 8 characters
                            </div>
                            <div className={`flex items-center ${passwordErrors.hasUpperCase ? 'text-green-600' : 'text-gray-500'}`}>
                              <span className="mr-2">{passwordErrors.hasUpperCase ? '✓' : '○'}</span>
                              One uppercase letter
                            </div>
                            <div className={`flex items-center ${passwordErrors.hasLowerCase ? 'text-green-600' : 'text-gray-500'}`}>
                              <span className="mr-2">{passwordErrors.hasLowerCase ? '✓' : '○'}</span>
                              One lowercase letter
                            </div>
                            <div className={`flex items-center ${passwordErrors.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
                              <span className="mr-2">{passwordErrors.hasNumber ? '✓' : '○'}</span>
                              One number
                            </div>
                            <div className={`flex items-center ${passwordErrors.hasSpecialChar ? 'text-green-600' : 'text-gray-500'}`}>
                              <span className="mr-2">{passwordErrors.hasSpecialChar ? '✓' : '○'}</span>
                              One special character
                            </div>
                            <div className={`flex items-center ${passwordErrors.matches ? 'text-green-600' : 'text-gray-500'}`}>
                              <span className="mr-2">{passwordErrors.matches ? '✓' : '○'}</span>
                              Passwords match
                            </div>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={registerData.confirmPassword}
                            onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                            required
                            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showConfirmPassword ? (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-[#87CEEB] to-[#C8A2C8] text-white py-3 px-4 rounded-lg font-semibold hover:opacity-90 transition-opacity duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                  >
                    {isLoading ? 'Registering...' : 'Register'}
                  </button>
                </form>
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">Already have an account?</p>
                  <button
                    onClick={(e) => toggleMode(e)}
                    className="mt-2 text-primary-400 font-semibold hover:underline"
                  >
                    Sign In
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-2xl p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Dealer Sign In</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm"
                      placeholder="Email Address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dealer ID</label>
                    <input
                      type="text"
                      value={loginData.dealerId}
                      onChange={(e) => setLoginData({ ...loginData, dealerId: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm"
                      placeholder="Enter your Dealer ID"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <div className="relative">
                      <input
                        type={showLoginPassword ? 'text' : 'password'}
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        required
                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm"
                        placeholder="Password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showLoginPassword ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-[#87CEEB] to-[#C8A2C8] text-white py-3 px-4 rounded-lg font-semibold hover:opacity-90 transition-opacity duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </button>
                </form>
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">Don't have an account?</p>
                  <button
                    onClick={(e) => toggleMode(e)}
                    className="mt-2 text-primary-400 font-semibold hover:underline"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Desktop: Container with two forms */}
          <div className="hidden md:block relative bg-white rounded-2xl shadow-2xl overflow-hidden" style={{ minHeight: '700px', height: registerData.hasSupplier ? '850px' : '700px', transition: 'height 0.3s ease-in-out' }}>
            {/* Error Message */}
            {error && (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg max-w-md">
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <div className="h-full flex relative">
              {/* Register Form (Always on Left) */}
              <div className="w-1/2 p-8 flex flex-col relative z-0 overflow-y-auto" style={{ justifyContent: 'flex-start' }}>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Dealer Registration</h2>
                <form onSubmit={handleRegister} className="space-y-4">
                  {/* Business Information */}
                  <div className="border-b border-gray-200 pb-4 mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">1 BUSINESS INFORMATION</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                        <input
                          type="text"
                          value={registerData.companyName}
                          onChange={(e) => setRegisterData({ ...registerData, companyName: e.target.value })}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type of Business</label>
                        <select
                          value={registerData.businessType}
                          onChange={(e) => setRegisterData({ ...registerData, businessType: e.target.value, otherBusinessType: e.target.value !== 'Other' ? '' : registerData.otherBusinessType })}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
                        >
                          <option value="">Select...</option>
                          {businessTypes.map((type) => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                        {registerData.businessType === 'Other' && (
                          <div className="mt-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Please specify</label>
                            <input
                              type="text"
                              value={registerData.otherBusinessType}
                              onChange={(e) => setRegisterData({ ...registerData, otherBusinessType: e.target.value })}
                              required
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
                              placeholder="Enter your business type"
                            />
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Business Address</label>
                        <input
                          type="text"
                          value={registerData.businessAddress}
                          onChange={(e) => setRegisterData({ ...registerData, businessAddress: e.target.value })}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                          {registerData.province ? (
                            <select
                              value={registerData.city}
                              onChange={(e) => setRegisterData({ ...registerData, city: e.target.value })}
                              required
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
                            >
                              <option value="">Select City...</option>
                              {provinceCities[registerData.province]?.map((city) => (
                                <option key={city} value={city}>{city}</option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type="text"
                              value={registerData.city}
                              onChange={(e) => setRegisterData({ ...registerData, city: e.target.value })}
                              required
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
                              placeholder="Select province first"
                              disabled
                            />
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
                          <select
                            value={registerData.province}
                            onChange={(e) => setRegisterData({ ...registerData, province: e.target.value, city: '' })}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
                          >
                            <option value="">Select...</option>
                            {provinces.map((province) => (
                              <option key={province} value={province}>{province}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                          <input
                            type="text"
                            value={registerData.postalCode}
                            onChange={(e) => setRegisterData({ ...registerData, postalCode: e.target.value })}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                          <input
                            type="text"
                            value={registerData.country}
                            readOnly
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Supplier Information */}
                  <div className="border-b border-gray-200 pb-4 mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">2 SUPPLIER INFORMATION (OPTIONAL)</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Do you currently have a tire supplier?</label>
                      <div className="flex gap-4 mb-3">
                        <button
                          type="button"
                          onClick={() => setRegisterData({ ...registerData, hasSupplier: true, supplierName: registerData.hasSupplier ? registerData.supplierName : '' })}
                          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                            registerData.hasSupplier
                              ? 'bg-primary-400 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => setRegisterData({ ...registerData, hasSupplier: false, supplierName: '' })}
                          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                            !registerData.hasSupplier
                              ? 'bg-primary-400 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          No
                        </button>
                      </div>
                      {registerData.hasSupplier && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Supplier Name</label>
                          <input
                            type="text"
                            value={registerData.supplierName}
                            onChange={(e) => setRegisterData({ ...registerData, supplierName: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
                            placeholder="Enter supplier name"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contact & Login */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">3 CONTACT & LOGIN</h3>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                          <input
                            type="text"
                            value={registerData.firstName}
                            onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                          <input
                            type="text"
                            value={registerData.lastName}
                            onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          value={registerData.phoneNumber}
                          onChange={(e) => setRegisterData({ ...registerData, phoneNumber: e.target.value })}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
                          placeholder={registerData.country === 'Canada' ? '(123) 456-7890' : 'Phone Number'}
                        />
                        {registerData.country === 'Canada' && registerData.phoneNumber && !validatePhoneNumber(registerData.phoneNumber) && (
                          <p className="mt-1 text-xs text-red-600">Please enter a valid Canadian phone number</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                          type="email"
                          value={registerData.email}
                          onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={registerData.password}
                            onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                            required
                            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showPassword ? (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            )}
                          </button>
                        </div>
                        {/* Password Requirements */}
                        {registerData.password && (
                          <div className="mt-2 text-xs space-y-1">
                            <div className={`flex items-center ${passwordErrors.minLength ? 'text-green-600' : 'text-gray-500'}`}>
                              <span className="mr-2">{passwordErrors.minLength ? '✓' : '○'}</span>
                              At least 8 characters
                            </div>
                            <div className={`flex items-center ${passwordErrors.hasUpperCase ? 'text-green-600' : 'text-gray-500'}`}>
                              <span className="mr-2">{passwordErrors.hasUpperCase ? '✓' : '○'}</span>
                              One uppercase letter
                            </div>
                            <div className={`flex items-center ${passwordErrors.hasLowerCase ? 'text-green-600' : 'text-gray-500'}`}>
                              <span className="mr-2">{passwordErrors.hasLowerCase ? '✓' : '○'}</span>
                              One lowercase letter
                            </div>
                            <div className={`flex items-center ${passwordErrors.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
                              <span className="mr-2">{passwordErrors.hasNumber ? '✓' : '○'}</span>
                              One number
                            </div>
                            <div className={`flex items-center ${passwordErrors.hasSpecialChar ? 'text-green-600' : 'text-gray-500'}`}>
                              <span className="mr-2">{passwordErrors.hasSpecialChar ? '✓' : '○'}</span>
                              One special character
                            </div>
                            <div className={`flex items-center ${passwordErrors.matches ? 'text-green-600' : 'text-gray-500'}`}>
                              <span className="mr-2">{passwordErrors.matches ? '✓' : '○'}</span>
                              Passwords match
                            </div>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={registerData.confirmPassword}
                            onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                            required
                            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showConfirmPassword ? (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-[#87CEEB] to-[#C8A2C8] text-white py-3 px-4 rounded-lg font-semibold hover:opacity-90 transition-opacity duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                  >
                    {isLoading ? 'Registering...' : 'Register'}
                  </button>
                </form>
              </div>

              {/* Login Form (Always on Right) */}
              <div className="w-1/2 p-12 flex flex-col justify-center relative z-0">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Dealer Sign In</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
                      placeholder="Email Address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dealer ID</label>
                    <input
                      type="text"
                      value={loginData.dealerId}
                      onChange={(e) => setLoginData({ ...loginData, dealerId: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
                      placeholder="Enter your Dealer ID"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <div className="relative">
                      <input
                        type={showLoginPassword ? 'text' : 'password'}
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        required
                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
                        placeholder="Password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showLoginPassword ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-[#87CEEB] to-[#C8A2C8] text-white py-3 px-4 rounded-lg font-semibold hover:opacity-90 transition-opacity duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </button>
                </form>
              </div>

              {/* Sliding Gradient Overlay - Desktop Only */}
              <div 
                className="hidden md:flex absolute inset-y-0 w-1/2 bg-gradient-to-r from-[#87CEEB] to-[#C8A2C8] flex-col items-center justify-center p-12 text-white z-10 transition-transform duration-700 ease-in-out overflow-hidden"
                style={{
                  left: 0,
                  transform: isRegisterMode ? 'translateX(100%)' : 'translateX(0%)',
                  willChange: 'transform',
                }}
              >
                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2"></div>
                
                {/* Content */}
                <div className="relative z-10 text-center">
                  {isRegisterMode ? (
                    <>
                      <div className="mb-6">
                        <svg className="w-20 h-20 mx-auto mb-4 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <h2 className="text-5xl font-bold mb-4 drop-shadow-lg">Welcome Back!</h2>
                      <p className="text-xl mb-6 text-white/90">Already have an account?</p>
                      <button
                        type="button"
                        onClick={(e) => toggleMode(e)}
                        className="bg-white text-[#8B6FA8] px-10 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 shadow-2xl hover:scale-105 transform mb-4"
                      >
                        Sign In
                      </button>
                      <div className="mt-6 pt-6 border-t border-white/20">
                        <p className="text-lg mb-4 text-white/90">Not a dealer?</p>
                        <Link
                          href="/create-account"
                          className="inline-block bg-white/20 backdrop-blur-md text-white px-8 py-3 rounded-full font-semibold hover:bg-white/30 transition-all duration-300 shadow-lg hover:scale-105 transform border border-white/30"
                        >
                          Regular Sign Up
                        </Link>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="mb-6">
                        <svg className="w-20 h-20 mx-auto mb-4 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                      </div>
                      <h2 className="text-5xl font-bold mb-4 drop-shadow-lg">New Dealer?</h2>
                      <p className="text-xl mb-6 text-white/90">Create a dealer account</p>
                      <button
                        type="button"
                        onClick={(e) => toggleMode(e)}
                        className="bg-white text-[#8B6FA8] px-10 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 shadow-2xl hover:scale-105 transform mb-4"
                      >
                        Sign Up
                      </button>
                      <div className="mt-6 pt-6 border-t border-white/20">
                        <p className="text-lg mb-4 text-white/90">Not a dealer?</p>
                        <Link
                          href="/sign-in"
                          className="inline-block bg-white/20 backdrop-blur-md text-white px-8 py-3 rounded-full font-semibold hover:bg-white/30 transition-all duration-300 shadow-lg hover:scale-105 transform border border-white/30"
                        >
                          Regular Sign In
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {/* Dealer ID Modal */}
      {showDealerIdModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            <div className="text-center">
              <div className="mb-4">
                <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
              <p className="text-gray-600 mb-6">Your Dealer ID has been generated. Please copy it and keep it safe.</p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Dealer ID:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={dealerId}
                    readOnly
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-white font-mono text-sm font-semibold"
                  />
                  <button
                    onClick={copyDealerId}
                    className="px-4 py-2 bg-gradient-to-r from-[#87CEEB] to-[#C8A2C8] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity duration-300 flex items-center gap-2"
                  >
                    {copied ? (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
                <p className="text-sm text-yellow-800">
                  <strong>Important:</strong> Save this Dealer ID. You'll need it along with your email and password to sign in.
                </p>
              </div>

              <button
                onClick={handleCloseModal}
                className="w-full bg-gradient-to-r from-[#87CEEB] to-[#C8A2C8] text-white py-3 px-4 rounded-lg font-semibold hover:opacity-90 transition-opacity duration-300"
              >
                Continue to Sign In
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

