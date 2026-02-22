'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AuthPage from '@/components/AuthPage'

export default function SignInPage() {
  useEffect(() => {
    document.title = 'Sign in - Allied Concept Beauty Supplies'
  }, [])
  
  return <AuthPage initialMode="login" />
}

