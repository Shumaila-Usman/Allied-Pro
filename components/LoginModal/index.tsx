'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [dealerId, setDealerId] = useState('')
  const [isDealerLogin, setIsDealerLogin] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    
    const result = await login(email, password, isDealerLogin ? dealerId : undefined)
    setIsLoading(false)
    
    if (result.success) {
      onClose()
      setEmail('')
      setPassword('')
      setDealerId('')
    } else {
      setError(result.error || 'Login failed')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {isDealerLogin ? 'Dealer Login' : 'Sign In'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
              placeholder="Password"
            />
          </div>

          {isDealerLogin && (
            <div>
              <label htmlFor="dealerId" className="block text-sm font-medium text-gray-700 mb-1">
                Dealer ID
              </label>
              <input
                type="text"
                id="dealerId"
                value={dealerId}
                onChange={(e) => setDealerId(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
                placeholder="Enter your Dealer ID"
              />
            </div>
          )}

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isDealer"
              checked={isDealerLogin}
              onChange={(e) => setIsDealerLogin(e.target.checked)}
              className="w-4 h-4 text-primary-400 border-gray-300 rounded focus:ring-primary-400"
            />
            <label htmlFor="isDealer" className="ml-2 text-sm text-gray-700">
              I am a dealer
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full gradient-primary text-white py-2 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setIsDealerLogin(false)
              setEmail('')
              setDealerId('')
            }}
            className="text-sm text-primary-500 hover:text-primary-600"
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  )
}

