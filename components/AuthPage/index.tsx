'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import MainNav from '@/components/MainNav'
import Footer from '@/components/Footer'

interface AuthPageProps {
  initialMode?: 'login' | 'register'
}

export default function AuthPage({ initialMode }: AuthPageProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { login, register } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Determine initial mode from URL if not provided
  const [isRegisterMode, setIsRegisterMode] = useState(
    initialMode === 'register' || pathname === '/create-account'
  )

  // Update URL when mode changes (without scrolling)
  useEffect(() => {
    if (isRegisterMode && pathname !== '/create-account') {
      router.replace('/create-account', { scroll: false })
    } else if (!isRegisterMode && pathname !== '/sign-in') {
      router.replace('/sign-in', { scroll: false })
    }
  }, [isRegisterMode, pathname, router])

  // Register form state
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  })
  const [isAdminLogin, setIsAdminLogin] = useState(false)

  // Password visibility
  const [showRegisterPassword, setShowRegisterPassword] = useState(false)
  const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] = useState(false)
  const [showLoginPassword, setShowLoginPassword] = useState(false)

  // Password validation
  const [passwordErrors, setPasswordErrors] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
    matches: false,
  })

  // Validate password
  const validatePassword = (password: string, confirmPassword: string = '') => {
    const errors = {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      matches: confirmPassword ? password === confirmPassword : true,
    }
    setPasswordErrors(errors)
    return Object.values(errors).every(Boolean)
  }

  useEffect(() => {
    if (registerData.password) {
      validatePassword(registerData.password, registerData.confirmPassword)
    } else {
      // Reset errors when password is empty
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (!validatePassword(registerData.password, registerData.confirmPassword)) {
      setError('Please ensure all password requirements are met')
      return
    }

    setIsLoading(true)
    const result = await register(
      registerData.firstName,
      registerData.lastName,
      registerData.email,
      registerData.password,
      registerData.confirmPassword
    )
    setIsLoading(false)

    if (result.success) {
      router.push('/')
    } else {
      setError(result.error || 'Registration failed')
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    
    const result = await login(loginData.email, loginData.password, undefined, isAdminLogin)
    setIsLoading(false)

    if (result.success) {
      if (isAdminLogin) {
        router.push('/admin/portal')
      } else {
        router.push('/')
      }
    } else {
      setError(result.error || 'Login failed')
    }
  }

  const toggleMode = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    setIsRegisterMode(!isRegisterMode)
  }

  const [topPadding, setTopPadding] = useState(176) // Default padding

  useEffect(() => {
    const calculatePadding = () => {
      const header = document.getElementById('main-header')
      const nav = document.getElementById('main-nav')
      if (header && nav) {
        const totalHeight = header.offsetHeight + nav.offsetHeight
        setTopPadding(totalHeight)
      }
    }

    calculatePadding()
    window.addEventListener('resize', calculatePadding)
    setTimeout(calculatePadding, 100)

    return () => {
      window.removeEventListener('resize', calculatePadding)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <MainNav />
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={{ paddingTop: `${topPadding + 48}px` }}>
        <div className="max-w-6xl w-full">
          {/* Container with two forms */}
          <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden" style={{ height: '600px' }}>
            {/* Error Message */}
            {error && (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg max-w-md">
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}
            
            <div className="h-full flex relative">
              {/* Register Form (Always on Left) */}
              <div className="w-1/2 p-12 flex flex-col justify-center relative z-0">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Registration</h2>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        value={registerData.firstName}
                        onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
                        placeholder="First Name"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        value={registerData.lastName}
                        onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
                        placeholder="Last Name"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="registerEmail" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="registerEmail"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
                      placeholder="Email Address"
                    />
                  </div>

                  <div>
                    <label htmlFor="registerPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showRegisterPassword ? 'text' : 'password'}
                        id="registerPassword"
                        value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                        required
                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
                        placeholder="Password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showRegisterPassword ? (
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
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showRegisterConfirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        value={registerData.confirmPassword}
                        onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                        required
                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
                        placeholder="Confirm Password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegisterConfirmPassword(!showRegisterConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showRegisterConfirmPassword ? (
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
                    {isLoading ? 'Registering...' : 'Register'}
                  </button>
                </form>
              </div>

              {/* Login Form (Always on Right) */}
              <div className="w-1/2 p-12 flex flex-col justify-center relative z-0">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Sign In</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label htmlFor="loginEmail" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="loginEmail"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
                      placeholder="Email Address"
                    />
                  </div>

                  <div>
                    <label htmlFor="loginPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showLoginPassword ? 'text' : 'password'}
                        id="loginPassword"
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

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="adminLogin"
                      checked={isAdminLogin}
                      onChange={(e) => setIsAdminLogin(e.target.checked)}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <label htmlFor="adminLogin" className="ml-2 block text-sm text-gray-700">
                      Login as Admin
                    </label>
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

              {/* Sliding Gradient Overlay */}
              <div 
                className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-[#87CEEB] to-[#C8A2C8] flex flex-col items-center justify-center p-12 text-white z-10 transition-transform duration-700 ease-in-out overflow-hidden"
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
                
                {/* Content - Show "Welcome Back" when overlay is on right (register mode), "New Here" when on left (login mode) */}
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
                        <p className="text-lg mb-4 text-white/90">Already a dealer?</p>
                        <Link
                          href="/dealer/sign-in"
                          className="inline-block bg-white/20 backdrop-blur-md text-white px-8 py-3 rounded-full font-semibold hover:bg-white/30 transition-all duration-300 shadow-lg hover:scale-105 transform border border-white/30"
                        >
                          Dealer's Sign In
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
                      <h2 className="text-5xl font-bold mb-4 drop-shadow-lg">New Here?</h2>
                      <p className="text-xl mb-6 text-white/90">Create an account to get started</p>
                      <button
                        type="button"
                        onClick={(e) => toggleMode(e)}
                        className="bg-white text-[#8B6FA8] px-10 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 shadow-2xl hover:scale-105 transform mb-4"
                      >
                        Create Account
                      </button>
                      <div className="mt-6 pt-6 border-t border-white/20">
                        <p className="text-lg mb-4 text-white/90">Are you a dealer?</p>
                        <Link
                          href="/dealer/sign-up"
                          className="inline-block bg-white/20 backdrop-blur-md text-white px-8 py-3 rounded-full font-semibold hover:bg-white/30 transition-all duration-300 shadow-lg hover:scale-105 transform border border-white/30"
                        >
                          Dealer's Sign Up
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
    </div>
  )
}
