'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import MainNav from '@/components/MainNav'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function TrainingPage() {
  const [topPadding, setTopPadding] = useState(176)

  useEffect(() => {
    document.title = 'Trainings - Allied Concept Beauty Supplies'
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
  const trainingCourses = [
    {
      id: '1',
      title: 'Spa Sanitation Training',
      description: 'Learn the essential hygiene and sanitation practices for salons. This training ensures a safe and clean environment for both clients and staff, helping you maintain professional standards.',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      id: '2',
      title: 'Client Consultation Training',
      description: 'Master the art of client communication. Understand clients' needs, suggest suitable services, and build trust while minimizing mistakes. Perfect for beauty professionals aiming to improve client satisfaction.',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      id: '3',
      title: 'Customer Service Training',
      description: 'Enhance your salon customer service skills, from bookings to aftercare. Learn how to manage client expectations and create a positive salon experience that keeps clients coming back.',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      id: '4',
      title: 'Retail & Product Knowledge Training',
      description: 'Discover how to sell salon products effectively. Learn the benefits of different hair, skin, and spa products, and how to match them with client needs to increase sales.',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
    },
    {
      id: '5',
      title: 'Social Media & Portfolio Training',
      description: 'Build a strong professional online presence. Learn how to create an engaging portfolio, showcase your work, and attract new clients through social media platforms.',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <Header />
      <MainNav />

      <div className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 w-full" style={{ paddingTop: `${topPadding + 24}px` }}>
        {/* Page Title */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 px-2">
            <span className="bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] bg-clip-text text-transparent break-words">
              Spa Professional Training
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto px-2">
            Our spa professional training programs are designed to help you develop strong, practical salon skills. These real-world classes enable you to serve clients confidently and professionally. Ideal for salon employees, new students, and beauty enthusiasts who want to enhance their performance and stand out in the industry.
          </p>
        </div>

        {/* Training Courses */}
        <div className="mb-12 sm:mb-20">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-6 sm:mb-12 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] bg-clip-text text-transparent text-center px-2 break-words">
            Training Courses
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {trainingCourses.map((course, index) => (
              <div
                key={course.id}
                className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 border border-gray-200 hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] rounded-full flex items-center justify-center flex-shrink-0 shadow-lg mb-4">
                    {course.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] bg-clip-text text-transparent">
                      {course.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {course.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Our Training */}
        <div className="mb-12 sm:mb-20">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] bg-clip-text text-transparent text-center px-2 break-words">
            Why Choose Our Training?
          </h2>
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 md:p-12 border border-gray-200">
            <p className="text-gray-700 leading-relaxed text-base sm:text-lg text-center max-w-4xl mx-auto">
              We go beyond theory; our sessions are hands-on and practical, designed to improve the quality of your services, client communication, and daily salon performance. You'll learn techniques that are directly applicable in a professional salon environment, ensuring you gain skills that matter from day one.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 text-center text-white shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Ready to elevate your salon skills?</h2>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 opacity-90">
            Contact our team today for pricing, schedule, and enrollment details.
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

