'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AuthPage from '@/components/AuthPage'

export default function SignInPage() {
  return <AuthPage initialMode="login" />
}

