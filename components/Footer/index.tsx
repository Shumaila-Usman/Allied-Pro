'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'

export default function Footer() {
  const { isDealer, isLoggedIn } = useAuth()
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About ACBS */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">About ACBS</h3>
            <p className="text-sm mb-4">
              Your trusted partner in professional beauty and spa products. We provide high-quality
              products for salons, spas, and beauty professionals.
            </p>
            <div className="ml-auto mr-auto md:ml-0">
              <Image
                src="/logo-removebg-preview.png"
                alt="ACBS - Allied Concept Beauty Supply"
                width={150}
                height={80}
                className="object-contain h-auto w-auto bg-transparent"
                style={{ backgroundColor: 'transparent', maxWidth: '150px' }}
                onError={(e) => {
                  // Fallback: show logo with text matching the design
                  const target = e.target as HTMLImageElement;
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class="flex flex-col items-center md:items-start">
                        <div class="text-3xl font-bold mb-2 tracking-tight">
                          <span style="background: linear-gradient(135deg, #00C8FF 0%, #6400C8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">ACBS</span>
                        </div>
                        <div class="text-xs text-gray-400 text-center md:text-left leading-tight font-medium uppercase tracking-wide">
                          <div>ALLIED CONCEPT</div>
                          <div>BEAUTY SUPPLY</div>
                        </div>
                      </div>
                    `;
                  }
                }}
              />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about-us" className="hover:text-primary-400 transition-colors duration-300">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary-400 transition-colors duration-300">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-primary-400 transition-colors duration-300">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/educational-module" className="hover:text-primary-400 transition-colors duration-300">
                  Educational Module
                </Link>
              </li>
              <li>
                <Link 
                  href={isLoggedIn && isDealer ? "/dealer/portal" : "/dealer/sign-up"} 
                  className="hover:text-primary-400 transition-colors duration-300"
                >
                  Dealer's Portal
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-primary-400 transition-colors duration-300">
                  Products
                </Link>
              </li>
              {isDealer && (
                <li>
                  <Link href="#" className="hover:text-primary-400 transition-colors duration-300">
                    Track Order
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Contact Service */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Contact Service</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="tel:+14379554480"
                  className="hover:text-primary-400 transition-colors"
                >
                  Phone: +1 437 955 4480
                </a>
              </li>
              <li>
                <a
                  href="https://mail.google.com/mail/u/0/?fs=1&to=info@alliedpro.ca&tf=cm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-400 transition-colors"
                >
                  Email: info@alliedpro.ca
                </a>
              </li>
              <li>
                <a
                  href="https://www.google.com/maps/place/8339+Kennedy+Rd+%232628,+Unionville,+ON+L3R+5T5,+Canada/@43.8567676,-79.3060757,17z/data=!3m1!4b1!4m5!3m4!1s0x89d4d4325ac599ef:0xb31599bf23741a4e!8m2!3d43.8567638!4d-79.3035008?entry=ttu&g_ep=EgoyMDI2MDEyOC4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-400 transition-colors"
                >
                  Address: 8339 Kennedy Rd #2628, Markham, ON L3R 5T5
                </a>
              </li>
            </ul>
            <div className="mt-4">
              <h4 className="text-white font-semibold text-sm mb-2">Store Hours:</h4>
              <ul className="space-y-1 text-sm">
                <li>Monday - Friday: 9 AM - 6 PM</li>
                <li>Saturday: 10 AM - 5 PM</li>
                <li>Sunday: Closed</li>
              </ul>
            </div>
          </div>

          {/* Stay Connected */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Stay Connected</h3>
            <div className="mb-4">
              <p className="text-sm mb-2">Subscribe to our newsletter</p>
              <div className="flex w-full max-w-sm mr-4">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary-400 text-white placeholder-gray-400 text-sm"
                />
                <button className="gradient-primary text-white px-4 py-2 rounded-r-lg hover:opacity-90 transition-opacity duration-300 whitespace-nowrap text-sm">
                  Subscribe
                </button>
              </div>
            </div>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/alliedprobeautysupply/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-400 transition-colors duration-300"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/alliedpro_beautysupply/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-400 transition-colors duration-300"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://www.youtube.com/@alliedprobeautysupply"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-400 transition-colors duration-300"
                aria-label="YouTube"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} ACBS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

