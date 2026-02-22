import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { CartProvider } from '@/contexts/CartContext'
import { ScrollProvider } from '@/contexts/ScrollContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Allied Concept Beauty Supplies',
  description: 'Professional beauty and spa products for businesses',
  icons: {
    icon: '/logo-removebg-preview.png',
    shortcut: '/logo-removebg-preview.png',
    apple: '/logo-removebg-preview.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body className={`${inter.className} overflow-x-hidden`}>
        <ScrollProvider>
          <AuthProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </AuthProvider>
        </ScrollProvider>
      </body>
    </html>
  )
}


