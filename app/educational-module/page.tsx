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
  const courses = [
    {
      id: '1',
      title: 'Foundation Female Cutting Course',
      description: 'Foundation Female Cutting Course, a program meticulously crafted to enhance your foundational knowledge in hair cutting and styling, preparing you for a successful career as a Hairstylist. Here are the details:',
      image: '/educational/female-cutting.jpg',
    },
    {
      id: '2',
      title: 'Foundation Color Course',
      description: 'Our Foundation Color Course is meticulously designed to provide you with hands-on experience and the confidence needed to excel in working with clients. Explore course',
      image: '/educational/color-course.jpg',
    },
    {
      id: '3',
      title: 'Men Cut Course',
      description: 'Aimed at elevating your foundational knowledge in men\'s haircutting and equipping you with versatile skills tailored for diverse clientele. Explore course',
      image: '/educational/men-cut.jpg',
    },
  ]

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
            At our core, learning is what we do. Our training, certification courses and workshops are designed to be salon work and salon results. Whether you are at the beginning of your career or the end, we are here to assist you to study, become better and proceed with life comfortably.
          </p>
        </div>

        {/* Course Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
              <div className="relative w-full h-80 bg-gray-100">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] bg-clip-text text-transparent">
                  {course.title}
                </h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  {course.description}
                </p>
                <Link
                  href={`/educational-module/${course.id}`}
                  className="inline-block bg-gradient-to-r from-[#87CEEB] to-[#C8A2C8] text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity duration-300 shadow-lg"
                >
                  Explore Course
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Training, Workshops, Certifications */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {/* Training */}
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 text-center hover:shadow-lg transition-shadow duration-300">
            <div className="w-16 h-16 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] bg-clip-text text-transparent">
              Training
            </h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              The best way to establish strong salon foundations is through training programs. Such meetings assist you to enhance your ability, dealing with clients and service delivery.
            </p>
            <Link
              href="/educational-module/training"
              className="inline-block bg-gradient-to-r from-[#87CEEB] to-[#C8A2C8] text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity duration-300 shadow-lg"
            >
              View Training
            </Link>
          </div>

          {/* Workshops */}
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 text-center hover:shadow-lg transition-shadow duration-300">
            <div className="w-16 h-16 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] bg-clip-text text-transparent">
              Workshops
            </h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Workshops are brief, practical sessions devoted to particular beauty treatments. They would be good when you need to master a new skill fast and begin providing it in your salon.
            </p>
            <Link
              href="/educational-module/workshops"
              className="inline-block bg-gradient-to-r from-[#87CEEB] to-[#C8A2C8] text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity duration-300 shadow-lg"
            >
              View Workshops
            </Link>
          </div>

          {/* Certifications */}
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 text-center hover:shadow-lg transition-shadow duration-300">
            <div className="w-16 h-16 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] bg-clip-text text-transparent">
              Certifications
            </h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Certification programs offer a full professional training and an accredited certificate at the end of the program. The courses are ideal to individuals who desire to be qualified specialists.
            </p>
            <Link
              href="/educational-module/certifications"
              className="inline-block bg-gradient-to-r from-[#87CEEB] to-[#C8A2C8] text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity duration-300 shadow-lg"
            >
              View Certifications
            </Link>
          </div>
        </div>

        {/* Who Should Attend */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] bg-clip-text text-transparent text-center">
            WHO SHOULD ATTEND ?
          </h2>
          <div className="bg-gray-50 rounded-2xl p-8 md:p-12 border border-gray-200">
            <ul className="space-y-4 max-w-3xl mx-auto">
              <li className="flex items-start">
                <span className="text-[#87CEEB] mr-4 font-bold text-xl">●</span>
                <span className="text-gray-700 text-lg">Newcomers in the beauty sector.</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#87CEEB] mr-4 font-bold text-xl">●</span>
                <span className="text-gray-700 text-lg">Professional employees of the beauty industry that want to update their competencies.</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#87CEEB] mr-4 font-bold text-xl">●</span>
                <span className="text-gray-700 text-lg">Salon employees who wish to enhance the quality of service.</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#87CEEB] mr-4 font-bold text-xl">●</span>
                <span className="text-gray-700 text-lg">Salon owners who train their staff or increase the services.</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#87CEEB] mr-4 font-bold text-xl">●</span>
                <span className="text-gray-700 text-lg">Those who would like to know professional beauty techniques.</span>
              </li>
            </ul>
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

