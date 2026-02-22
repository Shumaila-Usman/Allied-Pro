'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import MainNav from '@/components/MainNav'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function CertificationsPage() {
  const [topPadding, setTopPadding] = useState(176)

  useEffect(() => {
    document.title = 'Certifications - Allied Concept Beauty Supplies'
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
  const lashCertifications = [
    {
      id: '1',
      title: 'Classic Lash Extension Certification Course',
      description: 'Learn to apply classic lashes for a natural and elegant look. Focus on precise application, hygiene, client safety, and building long-lasting lash sets.',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
    },
    {
      id: '2',
      title: 'Hybrid Lash Extension Certification Course',
      description: 'Master the art of mixing classic and volume lashes for a textured, fuller look. Gain skills in advanced placement, balance, and natural aesthetics.',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
    },
    {
      id: '3',
      title: 'Volume Lash Mastery Certification Course (2D–6D)',
      description: 'Discover advanced volume techniques for dramatic lash sets. Learn to create lightweight fans and full sets without damaging natural lashes.',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
    },
    {
      id: '4',
      title: 'Lash Lift & Tint Certification Course',
      description: 'Enhance natural lashes with curl and color. This course covers safe application, timing, and aftercare for longer-lasting, stunning results.',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
    },
  ]

  const waxingCertifications = [
    {
      id: '1',
      title: 'Full Body Waxing Certification Course',
      description: 'Become a professional in full body waxing with smooth, polished results. Learn technique, client comfort, and proper maintenance.',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
    {
      id: '2',
      title: 'Brazilian Waxing Certification Course',
      description: 'Specialize in safe and hygienic Brazilian waxing. Gain the confidence to deliver clean, professional services for clients.',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      id: '3',
      title: 'Sugaring Certification Course',
      description: 'Learn the natural sugaring method for hair removal, perfect for sensitive skin. Focus on technique, product handling, and post-care for smooth outcomes.',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ]

  const nailCertifications = [
    {
      id: '1',
      title: 'Gel Polish Certification Course',
      description: 'Master gel polish application for long-lasting shine. Learn nail preparation, application, and safe removal techniques.',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
    },
    {
      id: '2',
      title: 'Spa Manicure Certification Course',
      description: 'Perfect professional manicure skills, including shaping, cuticle care, and hand massage for a smooth finish.',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      ),
    },
    {
      id: '3',
      title: 'Spa Pedicure Certification Course',
      description: 'Gain expertise in pedicure services, from foot care and callus removal to massage, ensuring healthy and comfortable results.',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    {
      id: '4',
      title: 'Nail Art Certification Course',
      description: 'Develop creative nail art skills to impress clients. Learn various artistic techniques to build a strong nail portfolio.',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
    },
    {
      id: '5',
      title: 'E-File Basics Certification Course',
      description: 'Understand safe e-file usage in modern nail services. Learn proper handling, speed control, and damage prevention.',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ]

  const makeupCertifications = [
    {
      id: '1',
      title: 'Makeup Fundamentals Certification Course',
      description: 'Build a strong foundation in blending, color matching, and application techniques. Essential for every professional makeup style.',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
        </svg>
      ),
    },
    {
      id: '2',
      title: 'Soft Glam Certification Course',
      description: 'Learn to create soft, natural, glowing looks perfect for everyday clients. Focus on subtle enhancement without overdoing it.',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
    {
      id: '3',
      title: 'Bridal Makeup Certification Course',
      description: 'Master bridal makeup techniques for long-lasting and flawless results. Gain experience in various bridal styles and client expectations management.',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
    {
      id: '4',
      title: 'Highlight & Contour Certification Course',
      description: 'Achieve sculpted and defined looks with advanced highlighting and contouring. Learn face shapes, blending, and color correction techniques.',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <Header />
      <MainNav />

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 w-full" style={{ paddingTop: `${topPadding + 24}px` }}>
        {/* Page Title */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 px-2">
            <span className="bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] bg-clip-text text-transparent break-words">
              CERTIFICATIONS
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto px-2">
            Our certification programs help you become a qualified expert in your chosen beauty field. Each course combines hands-on practical training with a professional qualification upon completion, giving you the skills and credentials to advance your career.
          </p>
        </div>

        {/* Lash Certification Courses */}
        <div className="mb-12 sm:mb-20">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-6 sm:mb-12 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] bg-clip-text text-transparent text-center px-2 break-words">
            I. LASH CERTIFICATION COURSES
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
            {lashCertifications.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 border border-gray-200 hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] rounded-full flex items-center justify-center flex-shrink-0 shadow-lg mb-4">
                    {course.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-3 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] bg-clip-text text-transparent">
                      {course.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      {course.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Waxing & Hair Removal Certification Courses */}
        <div className="mb-12 sm:mb-20">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-6 sm:mb-12 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] bg-clip-text text-transparent text-center px-2 break-words">
            II. WAXING & HAIR REMOVAL CERTIFICATION COURSES
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {waxingCertifications.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 border border-gray-200 hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] rounded-full flex items-center justify-center flex-shrink-0 shadow-lg mb-4">
                    {course.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-3 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] bg-clip-text text-transparent">
                      {course.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      {course.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nail & Hand / Foot Certification Course */}
        <div className="mb-12 sm:mb-20">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-6 sm:mb-12 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] bg-clip-text text-transparent text-center px-2 break-words">
            III. NAIL & HAND/FOOT CERTIFICATION COURSES
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {nailCertifications.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 border border-gray-200 hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] rounded-full flex items-center justify-center flex-shrink-0 shadow-lg mb-4">
                    {course.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-3 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] bg-clip-text text-transparent">
                      {course.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      {course.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Make Up Certification Courses */}
        <div className="mb-12 sm:mb-20">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-6 sm:mb-12 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] bg-clip-text text-transparent text-center px-2 break-words">
            IV. MAKEUP CERTIFICATION COURSES
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
            {makeupCertifications.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 border border-gray-200 hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] rounded-full flex items-center justify-center flex-shrink-0 shadow-lg mb-4">
                    {course.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-3 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] bg-clip-text text-transparent">
                      {course.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      {course.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Our Certifications */}
        <div className="mb-12 sm:mb-20">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] bg-clip-text text-transparent text-center px-2 break-words">
            Why Choose Our Certifications?
          </h2>
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 md:p-12 border border-gray-200">
            <p className="text-gray-700 leading-relaxed text-base sm:text-lg text-center max-w-4xl mx-auto">
              Our certification courses offer comprehensive professional training with hands-on experience. Each program concludes with a formal certificate, making it ideal for career advancement and professional recognition in the beauty industry.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 text-center text-white shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Want to become certified?</h2>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 opacity-90">
            Contact our team for pricing, enrollment, and full course details.
          </p>
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

