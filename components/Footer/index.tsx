'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'

export default function Footer() {
  const { isDealer, isLoggedIn } = useAuth()
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* About ACBS */}
          <div className="text-center sm:text-left">
            <Link href="/" className="flex justify-center sm:justify-start mb-3 sm:mb-4 -mt-4 sm:-mt-3">
              <Image
                src="/logo-removebg-preview.png"
                alt="ACBS - Allied Concept Beauty Supply"
                width={200}
                height={110}
                className="object-contain h-auto w-auto bg-transparent max-w-[180px] sm:max-w-[200px] cursor-pointer hover:opacity-90 transition-opacity duration-300"
                style={{ backgroundColor: 'transparent' }}
                onError={(e) => {
                  // Fallback: show logo with text matching the design
                  const target = e.target as HTMLImageElement;
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class="flex flex-col items-center md:items-start cursor-pointer hover:opacity-90 transition-opacity duration-300">
                        <div class="text-4xl sm:text-5xl font-bold mb-2 tracking-tight">
                          <span style="background: linear-gradient(135deg, #00C8FF 0%, #6400C8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">ACBS</span>
                        </div>
                        <div class="text-sm sm:text-base text-gray-400 text-center md:text-left leading-tight font-medium uppercase tracking-wide">
                          <div>ALLIED CONCEPT</div>
                          <div>BEAUTY SUPPLY</div>
                        </div>
                      </div>
                    `;
                  }
                }}
              />
            </Link>
          </div>

          {/* Quick Links */}
          <div className="text-center sm:text-left">
            <h3 className="text-white font-bold text-base sm:text-lg mb-3 sm:mb-4">Quick Links</h3>
            <ul className="space-y-2 text-xs sm:text-sm">
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
                <Link href="/training-education" className="hover:text-primary-400 transition-colors duration-300">
                  Training & Education
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

          {/* Contact Service & Stay Connected */}
          <div className="text-center sm:text-left -ml-2 sm:-ml-4 lg:-ml-6 mr-4 sm:mr-6 lg:mr-8">
            {/* Contact Service */}
            <h3 className="text-white font-bold text-base sm:text-lg mb-3 sm:mb-4">Contact Service</h3>
            <ul className="space-y-2 text-xs sm:text-sm mb-6">
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
                  href="https://mail.google.com/mail/u/0/?fs=1&to=alliedprosupplies@gmail.com&tf=cm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-400 transition-colors"
                >
                  Email: alliedprosupplies@gmail.com
                </a>
              </li>
            </ul>

            {/* Stay Connected */}
            <h3 className="text-white font-bold text-base sm:text-lg mb-3 sm:mb-4">Stay Connected</h3>
            <div className="mb-4">
              <p className="text-xs sm:text-sm mb-2">Sign up for ACBS Emails</p>
              <div className="flex w-full max-w-sm mx-auto sm:mx-0">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary-400 text-white placeholder-gray-400 text-xs sm:text-sm"
                />
                <button className="gradient-primary text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-r-lg hover:opacity-90 transition-opacity duration-300 whitespace-nowrap text-xs sm:text-sm">
                  Subscribe
                </button>
              </div>
            </div>
            <div className="flex space-x-4 justify-center sm:justify-start">
              <a
                href="https://web.facebook.com/people/Allied-Beauty-Supply/61584295626073/"
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
                href="https://www.instagram.com/alliedbeautysupply"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-400 transition-colors duration-300"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Locations */}
          <div className="text-center sm:text-left">
            <h3 className="text-white font-bold text-base sm:text-lg mb-3 sm:mb-4">Locations</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-white font-semibold text-xs sm:text-sm mb-2">Kennedy Location (Retail Only)</h4>
                <a
                  href="https://www.google.com/maps/place/8339+Kennedy+Rd+%232628,+Unionville,+ON+L3R+5T5,+Canada/@43.8567676,-79.3060757,17z/data=!3m1!4b1!4m5!3m4!1s0x89d4d4325ac599ef:0xb31599bf23741a4e!8m2!3d43.8567638!4d-79.3035008?entry=ttu&g_ep=EgoyMDI2MDEyOC4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-400 transition-colors text-xs sm:text-sm block mb-1"
                >
                  8339 Kennedy Rd #2628, Markham, ON L3R5T5
                </a>
                <p className="text-xs sm:text-sm text-gray-400">Monday to Friday: 10:00 AM – 8:00 PM</p>
                <p className="text-xs sm:text-sm text-gray-400">Saturday: 9:00 AM – 4:00 PM</p>
                <p className="text-xs sm:text-sm text-gray-400">Sunday: Closed</p>
              </div>
              <div>
                <h4 className="text-white font-semibold text-xs sm:text-sm mb-2">Scarborough Location (Wholesale Only)</h4>
                <a
                  href="https://www.google.com/maps/place/200+Silver+Star+Blvd,+Scarborough,+ON+M2H+3B4,+Canada"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-400 transition-colors text-xs sm:text-sm block mb-1"
                >
                  200 Silver Star Blvd, Scarborough, ON M2H 3B4, Canada
                </a>
                <p className="text-xs sm:text-sm text-gray-400">Monday to Thursday: 9:00 AM – 5:00 PM</p>
                <p className="text-xs sm:text-sm text-gray-400">By Appointment Only</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-xs sm:text-sm">
          <p>&copy; {new Date().getFullYear()} ACBS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

