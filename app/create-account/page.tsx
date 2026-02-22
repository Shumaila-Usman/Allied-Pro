'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AuthPage from '@/components/AuthPage'

export default function CreateAccountPage() {
  useEffect(() => {
    document.title = 'Registration - Allied Concept Beauty Supplies'
  }, [])
  
  return <AuthPage initialMode="register" />
}

