'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import MainNav from '@/components/MainNav'
import Footer from '@/components/Footer'

export default function AccountSettingsPage() {
  const { user, isLoggedIn } = useAuth()
  const router = useRouter()
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [verificationCode, setVerificationCode] = useState('')
  const [codeSent, setCodeSent] = useState(false)
  const [codeVerified, setCodeVerified] = useState(false)
  const [userDetails, setUserDetails] = useState<any>(null)
  const [lastPasswordChange, setLastPasswordChange] = useState<string | null>(null)

  // Password change form state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordErrors, setPasswordErrors] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
    matches: false,
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showCodeModal, setShowCodeModal] = useState(false)
  const [generatedCode, setGeneratedCode] = useState<string>('')
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
  })
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

  useEffect(() => {
    if (!isLoggedIn || !user) {
      router.push('/sign-in')
      return
    }

    // Fetch user details
    fetchUserDetails()
  }, [isLoggedIn, user, router])

  const fetchUserDetails = async () => {
    try {
      // Get user details from localStorage and fetch from API
      const savedUser = localStorage.getItem('user')
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser)
        // Fetch full user details from API
        const response = await fetch(`/api/user/details?email=${encodeURIComponent(parsedUser.email)}`)
        if (response.ok) {
          const data = await response.json()
          setUserDetails(data.user)
          setLastPasswordChange(data.user?.passwordChangedAt || null)
          // Initialize edit data
          setEditData({
            firstName: data.user?.firstName || '',
            lastName: data.user?.lastName || '',
            phoneNumber: data.user?.phoneNumber || '',
            companyName: data.user?.companyName || '',
            businessAddress: data.user?.businessAddress || '',
            city: data.user?.city || '',
            province: data.user?.province || '',
            postalCode: data.user?.postalCode || '',
          })
        } else {
          // Fallback to localStorage data
          setUserDetails(parsedUser)
          setLastPasswordChange(null)
          setEditData({
            firstName: parsedUser?.firstName || '',
            lastName: parsedUser?.lastName || '',
            phoneNumber: parsedUser?.phoneNumber || '',
          })
        }
      }
    } catch (error) {
      console.error('Error fetching user details:', error)
      // Fallback to localStorage
      const savedUser = localStorage.getItem('user')
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser)
        setUserDetails(parsedUser)
        setEditData({
          firstName: parsedUser?.firstName || '',
          lastName: parsedUser?.lastName || '',
          phoneNumber: parsedUser?.phoneNumber || '',
        })
      }
    }
  }

  const handleSaveChanges = async () => {
    setError(null)
    setSuccess(null)
    setIsLoading(true)

    try {
      const response = await fetch('/api/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user?.email,
          updates: editData,
        }),
      })

      const data = await response.json()
      if (response.ok) {
        setSuccess('Account information updated successfully!')
        setIsEditing(false)
        // Update localStorage
        const savedUser = localStorage.getItem('user')
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser)
          const updatedUser = { ...parsedUser, ...editData }
          localStorage.setItem('user', JSON.stringify(updatedUser))
        }
        // Refresh user details
        await fetchUserDetails()
      } else {
        setError(data.error || 'Failed to update account information')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setError(null)
    setSuccess(null)
    // Reset edit data to current user details
    setEditData({
      firstName: userDetails?.firstName || '',
      lastName: userDetails?.lastName || '',
      phoneNumber: userDetails?.phoneNumber || '',
    })
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
    if (newPassword || confirmPassword) {
      validatePassword(newPassword, confirmPassword)
    }
  }, [newPassword, confirmPassword])

  const handleForgotPassword = async () => {
    setShowForgotPassword(true)
    setCodeSent(true)
    // Generate verification code
    const mockCode = Math.floor(100000 + Math.random() * 900000).toString()
    setGeneratedCode(mockCode)
    // Store in sessionStorage for verification
    sessionStorage.setItem('verificationCode', mockCode)
    sessionStorage.setItem('verificationEmail', user?.email || '')
    // Show popup with code
    setShowCodeModal(true)
  }

  const copyCode = () => {
    navigator.clipboard.writeText(generatedCode)
  }

  const handleVerifyCode = () => {
    const storedCode = sessionStorage.getItem('verificationCode')
    if (verificationCode === storedCode) {
      setCodeVerified(true)
      setError(null)
    } else {
      setError('Invalid verification code. Please try again.')
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!showForgotPassword) {
      // Change password with current password
      if (!validatePassword(newPassword, confirmPassword)) {
        setError('Please fulfill all password requirements and ensure passwords match.')
        return
      }

      setIsLoading(true)
      try {
        const response = await fetch('/api/user/change-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user?.email,
            currentPassword,
            newPassword,
            confirmPassword,
          }),
        })

        const data = await response.json()
        if (response.ok) {
          setSuccess('Password changed successfully!')
          setCurrentPassword('')
          setNewPassword('')
          setConfirmPassword('')
          setShowChangePassword(false)
          fetchUserDetails() // Refresh user details
        } else {
          setError(data.error || 'Failed to change password')
        }
      } catch (error) {
        setError('Network error. Please try again.')
      } finally {
        setIsLoading(false)
      }
    } else {
      // Forgot password flow
      if (!codeVerified) {
        setError('Please verify the code first')
        return
      }

      if (!validatePassword(newPassword, confirmPassword)) {
        setError('Please fulfill all password requirements and ensure passwords match.')
        return
      }

      setIsLoading(true)
      try {
        const response = await fetch('/api/user/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user?.email,
            verificationCode,
            newPassword,
            confirmPassword,
          }),
        })

        const data = await response.json()
        if (response.ok) {
          setSuccess('Password reset successfully!')
          setNewPassword('')
          setConfirmPassword('')
          setVerificationCode('')
          setShowChangePassword(false)
          setShowForgotPassword(false)
          setCodeSent(false)
          setCodeVerified(false)
          sessionStorage.removeItem('verificationCode')
          sessionStorage.removeItem('verificationEmail')
          fetchUserDetails() // Refresh user details
        } else {
          setError(data.error || 'Failed to reset password')
        }
      } catch (error) {
        setError('Network error. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }
  }

  if (!isLoggedIn || !user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <Header />
      <MainNav />
      
      <div className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full" style={{ paddingTop: `${topPadding + 48}px` }}>
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Account Settings</h1>
          <p className="text-gray-600">Manage your account information and security settings</p>
        </div>

        {/* Account Details */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-[#87CEEB] to-[#C8A2C8] rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Account Information</h2>
            </div>
            {!isEditing && (
              <button
                onClick={() => {
                  // Initialize editData with current values when entering edit mode
                  setEditData({
                    firstName: userDetails?.firstName || user?.firstName || '',
                    lastName: userDetails?.lastName || user?.lastName || '',
                    phoneNumber: userDetails?.phoneNumber || user?.phoneNumber || '',
                  })
                  setIsEditing(true)
                }}
                className="bg-gradient-to-r from-[#87CEEB] to-[#C8A2C8] text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
            )}
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
              <p className="text-sm">{error}</p>
            </div>
          )}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4">
              <p className="text-sm">{success}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">First Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.firstName}
                  onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white"
                />
              ) : (
                <p className="text-lg font-medium text-gray-900">{userDetails?.firstName || user?.firstName || 'N/A'}</p>
              )}
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Last Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.lastName}
                  onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white"
                />
              ) : (
                <p className="text-lg font-medium text-gray-900">{userDetails?.lastName || user?.lastName || 'N/A'}</p>
              )}
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 md:col-span-2">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Email Address</label>
              <p className="text-lg font-medium text-gray-900">{user?.email || 'N/A'}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Phone Number</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={editData.phoneNumber}
                  onChange={(e) => setEditData({ ...editData, phoneNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white"
                  placeholder="Phone Number"
                />
              ) : (
                <p className="text-lg font-medium text-gray-900">{userDetails?.phoneNumber || user?.phoneNumber || 'N/A'}</p>
              )}
            </div>
            {userDetails?.companyName && (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Company Name</label>
                <p className="text-lg font-medium text-gray-900">{userDetails.companyName}</p>
              </div>
            )}
            {userDetails?.businessType && (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Business Type</label>
                <p className="text-lg font-medium text-gray-900">{userDetails.businessType}</p>
              </div>
            )}
            {userDetails?.businessAddress && (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 md:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Business Address</label>
                <p className="text-lg font-medium text-gray-900">{userDetails.businessAddress}</p>
              </div>
            )}
            {userDetails?.city && userDetails?.province && (
              <>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">City</label>
                  <p className="text-lg font-medium text-gray-900">{userDetails.city}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Province</label>
                  <p className="text-lg font-medium text-gray-900">{userDetails.province}</p>
                </div>
              </>
            )}
            {userDetails?.postalCode && (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Postal Code</label>
                <p className="text-lg font-medium text-gray-900">{userDetails.postalCode}</p>
              </div>
            )}
            {userDetails?.country && (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Country</label>
                <p className="text-lg font-medium text-gray-900">{userDetails.country}</p>
              </div>
            )}
            {user?.dealerId && (
              <div className="bg-gradient-to-r from-[#87CEEB]/10 to-[#C8A2C8]/10 rounded-lg p-4 border-2 border-primary-400 md:col-span-2">
                <label className="block text-xs font-semibold text-primary-600 uppercase tracking-wide mb-2">Dealer ID</label>
                <p className="text-lg font-bold text-primary-600 font-mono">{user.dealerId}</p>
              </div>
            )}
          </div>

          {isEditing && (
            <div className="flex gap-4 mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={handleSaveChanges}
                disabled={isLoading}
                className="bg-gradient-to-r from-[#87CEEB] to-[#C8A2C8] text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={handleCancelEdit}
                disabled={isLoading}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Change Password Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-[#87CEEB] to-[#C8A2C8] rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Password</h2>
                {lastPasswordChange && (
                  <p className="text-sm text-gray-500 mt-1">Last changed: {new Date(lastPasswordChange).toLocaleDateString()}</p>
                )}
              </div>
            </div>
            {!showChangePassword && (
              <button
                onClick={() => setShowChangePassword(true)}
                className="bg-gradient-to-r from-[#87CEEB] to-[#C8A2C8] text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Change Password
              </button>
            )}
          </div>

          {showChangePassword && (
            <form onSubmit={handleChangePassword} className="space-y-4">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                  <p className="text-sm">{error}</p>
                </div>
              )}
              {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                  <p className="text-sm">{success}</p>
                </div>
              )}

              {!showForgotPassword ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showCurrentPassword ? (
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
                  <div>
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-primary-500 hover:text-primary-600 text-sm font-medium"
                    >
                      Forgot password?
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {!codeVerified ? (
                    <>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <p className="text-sm text-blue-800">
                          Please enter the verification code shown in the popup
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Verification Code</label>
                        <input
                          type="text"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          placeholder="Enter 6-digit code"
                          maxLength={6}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
                        />
                        <button
                          type="button"
                          onClick={handleVerifyCode}
                          className="mt-2 bg-primary-500 text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity duration-300"
                        >
                          Verify Code
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                        <p className="text-sm text-green-800">Code verified successfully!</p>
                      </div>
                    </>
                  )}
                </>
              )}

              {(showForgotPassword && codeVerified) || !showForgotPassword ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showNewPassword ? (
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
                    {newPassword && (
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
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
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
                </>
              ) : null}

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-gradient-to-r from-[#87CEEB] to-[#C8A2C8] text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Updating...' : 'Update Password'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowChangePassword(false)
                    setShowForgotPassword(false)
                    setCodeSent(false)
                    setCodeVerified(false)
                    setCurrentPassword('')
                    setNewPassword('')
                    setConfirmPassword('')
                    setVerificationCode('')
                    setError(null)
                    setSuccess(null)
                    sessionStorage.removeItem('verificationCode')
                    sessionStorage.removeItem('verificationEmail')
                  }}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <Footer />

      {/* Verification Code Modal */}
      {showCodeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 relative overflow-hidden">
            <div className="text-center">
              <div className="mb-4">
                <svg className="w-16 h-16 mx-auto text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Code</h2>
              <p className="text-gray-600 mb-6 text-sm sm:text-base break-words">A verification code has been generated for <strong>{user?.email}</strong></p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Verification Code:</label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full">
                  <input
                    type="text"
                    value={generatedCode}
                    readOnly
                    className="flex-1 px-3 sm:px-4 py-3 border border-gray-300 rounded-lg bg-white font-mono text-xl sm:text-2xl font-bold text-center tracking-widest min-w-0 w-full sm:w-auto"
                  />
                  <button
                    onClick={copyCode}
                    className="px-4 py-3 bg-gradient-to-r from-[#87CEEB] to-[#C8A2C8] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity duration-300 flex items-center justify-center gap-2 whitespace-nowrap w-full sm:w-auto"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy
                  </button>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
                <p className="text-sm text-yellow-800">
                  <strong>Important:</strong> Enter this code in the verification field to reset your password.
                </p>
              </div>

              <button
                onClick={() => setShowCodeModal(false)}
                className="w-full bg-gradient-to-r from-[#87CEEB] to-[#C8A2C8] text-white py-3 px-4 rounded-lg font-semibold hover:opacity-90 transition-opacity duration-300"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

