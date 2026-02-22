'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import MainNav from '@/components/MainNav'
import Footer from '@/components/Footer'
import Image from 'next/image'
import Link from 'next/link'

export default function EducationalModulePage() {
  const [topPadding, setTopPadding] = useState(176)

  useEffect(() => {
    document.title = 'Educational Module - Allied Concept Beauty Supplies'
  }, [])

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
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <MainNav />

      {/* Hero Banner */}
      <div className="relative w-full h-[400px] bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] flex items-center justify-center" style={{ marginTop: `${topPadding}px` }}>
        <div className="text-center text-white px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">LEARN AND GROW</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Take your skills to the next level!! Whether you're a beginner or a seasoned pro, let's unlock your best work yet.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        {/* Our Education & Training */}
        <div className="mb-20 text-center">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] bg-clip-text text-transparent">
            OUR EDUCATION & TRAINING
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg max-w-4xl mx-auto">
            At the heart of what we do is learning for beauty professionals. Our salon training programs, hands-on workshops, and certification courses are designed to deliver real salon results. Whether you're starting your career in beauty or looking to advance your professional skills, we are here to guide you, help you grow, and support your journey to becoming a qualified beauty expert.
          </p>
        </div>

        {/* Training, Workshops, Certifications */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {/* Training */}
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 text-center hover:shadow-lg transition-shadow duration-300 flex flex-col">
            <div className="w-16 h-16 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] bg-clip-text text-transparent">
              1 — Training
            </h3>
            <p className="text-gray-700 leading-relaxed mb-6 flex-grow">
              Build a strong foundation for your salon career with our professional salon training programs. These sessions are hands-on, designed to improve your technical skills, client communication, and service delivery. Perfect for new salon employees or anyone looking to enhance their expertise.
            </p>
            <Link
              href="/educational-module/training"
              className="inline-block bg-gradient-to-r from-[#87CEEB] to-[#C8A2C8] text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity duration-300 shadow-lg mt-auto"
            >
              View Training
            </Link>
          </div>

          {/* Workshops */}
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 text-center hover:shadow-lg transition-shadow duration-300 flex flex-col">
            <div className="w-16 h-16 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] bg-clip-text text-transparent">
              2 — Workshops
            </h3>
            <p className="text-gray-700 leading-relaxed mb-6 flex-grow">
              Our beauty workshops are focused, practical sessions that teach specific treatments efficiently. Ideal for quick skill mastery and for implementing new services in your salon immediately. These workshops help you stay updated with the latest beauty techniques.
            </p>
            <Link
              href="/educational-module/workshops"
              className="inline-block bg-gradient-to-r from-[#87CEEB] to-[#C8A2C8] text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity duration-300 shadow-lg mt-auto"
            >
              View Workshops
            </Link>
          </div>

          {/* Certifications */}
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 text-center hover:shadow-lg transition-shadow duration-300 flex flex-col">
            <div className="w-16 h-16 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] bg-clip-text text-transparent">
              3 — Certifications
            </h3>
            <p className="text-gray-700 leading-relaxed mb-6 flex-grow">
              Take your career to the next level with our professional certification courses. Each course includes practical training and awards an accredited certificate upon completion. Perfect for anyone aiming to become a certified beauty professional and gain professional recognition in the beauty industry.
            </p>
            <Link
              href="/educational-module/certifications"
              className="inline-block bg-gradient-to-r from-[#87CEEB] to-[#C8A2C8] text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity duration-300 shadow-lg mt-auto"
            >
              View Certifications
            </Link>
          </div>
        </div>

        {/* Who Should Attend */}
        <div className="mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] bg-clip-text text-transparent">
            WHO SHOULD ATTEND?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
            {/* Newcomers in the beauty sector - Person icon */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 flex flex-col items-center text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 mb-4 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
                  <defs>
                    <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#C8A2C8" />
                      <stop offset="100%" stopColor="#87CEEB" />
                    </linearGradient>
                  </defs>
                  <circle cx="12" cy="8" r="4" fill="url(#gradient1)" />
                  <path d="M6 20c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="url(#gradient1)" strokeWidth={1.5} strokeLinecap="round" />
                </svg>
              </div>
              <p className="text-gray-800 font-medium leading-tight">
                Newcomers in the beauty sector.
              </p>
            </div>

            {/* Professional employees who want to update their competencies - Circular arrow with star */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 flex flex-col items-center text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 mb-4 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
                  <defs>
                    <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#C8A2C8" />
                      <stop offset="100%" stopColor="#87CEEB" />
                    </linearGradient>
                  </defs>
                  <circle cx="12" cy="12" r="8" stroke="url(#gradient2)" strokeWidth={1.5} fill="none" />
                  <path d="M12 4l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" fill="url(#gradient2)" />
                  <path d="M8 12l4-4m0 8l4-4" stroke="url(#gradient2)" strokeWidth={1.5} strokeLinecap="round" />
                </svg>
              </div>
              <p className="text-gray-800 font-medium leading-tight">
                Professional employees of the beauty industry who want to update their competencies.
              </p>
            </div>

            {/* Salon employees who wish to enhance the quality of service - Hand pointing up with stars */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 flex flex-col items-center text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 mb-4 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
                  <defs>
                    <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#C8A2C8" />
                      <stop offset="100%" stopColor="#87CEEB" />
                    </linearGradient>
                  </defs>
                  <path d="M12 4v16M8 8l4-4 4 4" stroke="url(#gradient3)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="8" cy="4" r="1.5" fill="url(#gradient3)" />
                  <circle cx="12" cy="2" r="1.5" fill="url(#gradient3)" />
                  <circle cx="16" cy="4" r="1.5" fill="url(#gradient3)" />
                </svg>
              </div>
              <p className="text-gray-800 font-medium leading-tight">
                Salon employees who wish to enhance the quality of service.
              </p>
            </div>

            {/* Salon owners who train their staff or increase the services - Building/storefront icon */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 flex flex-col items-center text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 mb-4 flex items-center justify-center">
                <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <defs>
                    <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#C8A2C8" />
                      <stop offset="100%" stopColor="#87CEEB" />
                    </linearGradient>
                  </defs>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" stroke="url(#gradient4)" />
                </svg>
              </div>
              <p className="text-gray-800 font-medium leading-tight">
                Salon owners who train their staff or increase the services.
              </p>
            </div>

            {/* Those who would like to know professional beauty techniques - Magnifying glass with plus */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 flex flex-col items-center text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 mb-4 flex items-center justify-center">
                <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <defs>
                    <linearGradient id="gradient5" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#C8A2C8" />
                      <stop offset="100%" stopColor="#87CEEB" />
                    </linearGradient>
                  </defs>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" stroke="url(#gradient5)" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5v6m3-3h-6" strokeWidth={2} stroke="url(#gradient5)" />
                </svg>
              </div>
              <p className="text-gray-800 font-medium leading-tight">
                Those who would like to know professional beauty techniques.
              </p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] rounded-2xl p-12 text-center text-white shadow-xl">
          <p className="text-2xl font-semibold mb-6">For pricing, enrollment & course details, contact our team.</p>
          <Link
            href="/contact"
            className="inline-block bg-white text-[#87CEEB] px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity duration-300 shadow-lg"
          >
            Contact Us
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  )
}

