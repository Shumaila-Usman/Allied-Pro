'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import MainNav from '@/components/MainNav'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function WorkshopsPage() {
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
  const advancedSkinWorkshops = [
    {
      id: '1',
      title: 'Cosmetic Microneedling (0.25– 0.5mm)',
      description: 'Get to know how to microneedle safely to enhance the skin texture and decrease fine lines. This workshop is devoted to the correct depth, hygiene, and comfort of the client to reach shining outcomes.',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
    {
      id: '2',
      title: 'Superficial Chemical Peel (AHA/BHA Level)',
      description: 'The workshop trains delicate AHA/BHA peeling techniques to achieve brighter and smoother skin. You will have an idea of how to select the appropriate peel and take care of the different skin types.',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
    },
    {
      id: '3',
      title: 'Dermaplaning (Cosmetic Level)',
      description: 'Dermaplaning is a technique of giving the skin a clear and smooth finish that is hair-free. Learn how to do it. You will learn the right angle, skin preparation, and methods of effective and safe treatment.',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
        </svg>
      ),
    },
    {
      id: '4',
      title: 'LED Light Therapy',
      description: 'Find out how LED therapy has a chance to decrease acne, inflammations, and enhance the color of the skin. You will get to know how to operate various light settings and develop custom made treatment plans.',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
    {
      id: '5',
      title: 'HydroDermabrasion / Deep Cleansing',
      description: 'Develop a deep cleansing and hydrating skin technique with the hydrodermabrasion technology. This workshop is an extraction, exfoliation, and hydration workshop to achieve a fresh glow.',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
    },
    {
      id: '6',
      title: 'Facial Radio Frequency Tightening (Esthetic Device)',
      description: 'Get to know the method of tightening and firming of the skin using RF devices. This workshop is centered on how to treat these devices, treatment plan, and expected outcomes.',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      id: '7',
      title: 'Ultrasonic Cavitation & Body Contouring',
      description: 'Ultrasound methods Learn non-surgical body contouring. You will know how to focus on problem areas that are likely and offer the clients better, tone results.',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      id: '8',
      title: 'Back Facial',
      description: 'Learn how to wash, exfoliate and treat the area in the back to get clearer skin. In this workshop extraction, massage and hydrating techniques are discussed in order to achieve results that are visible.',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
    {
      id: '9',
      title: 'Scalp Facial & Head Spa',
      description: 'Find out how to do scalp treatments that help to take care of the scalp and hair quality. You will get to learn massage, how to cleanse the scalp and how to treat with calming techniques.',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
    },
  ]

  const laserLightWorkshops = [
    {
      id: '1',
      title: 'Laser Hair Removal (Cosmetic Level)',
      description: 'The workshop provides fundamental knowledge of laser hair removal such as the safe use of the devices and client evaluation. You are going to know how to apply various types of skin so confidently.',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
    {
      id: '2',
      title: 'IPL Hair Removal & Skin Rejuvenation',
      description: 'Discover the effectiveness of IPL in removing hair on the body as well as rejuvenating the skin. You will also have practical experience and be able to develop effective treatment plans for clients.',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <Header />
      <MainNav />

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full" style={{ paddingTop: `${topPadding + 64}px` }}>
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] bg-clip-text text-transparent">
              Workshops
            </span>
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
            Our workshops are designed to teach you specific beauty treatments quickly and efficiently. Each workshop is hands-on, practical, and focused on techniques you can start using immediately in your salon.
          </p>
        </div>

        {/* Advanced Skin Workshops */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold mb-12 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] bg-clip-text text-transparent text-center">
            I. ADVANCED SKIN WORKSHOPS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {advancedSkinWorkshops.map((workshop) => (
              <div
                key={workshop.id}
                className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] rounded-full flex items-center justify-center flex-shrink-0 shadow-lg mb-4">
                    {workshop.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-3 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] bg-clip-text text-transparent">
                      {workshop.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      {workshop.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Laser & Light Workshops */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold mb-12 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] bg-clip-text text-transparent text-center">
            II. LASER & LIGHT WORKSHOPS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {laserLightWorkshops.map((workshop) => (
              <div
                key={workshop.id}
                className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] rounded-full flex items-center justify-center flex-shrink-0 shadow-lg mb-4">
                    {workshop.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-3 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] bg-clip-text text-transparent">
                      {workshop.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      {workshop.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Our Workshops */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] bg-clip-text text-transparent text-center">
            Why Choose Our Workshops
          </h2>
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-200">
            <p className="text-gray-700 leading-relaxed text-lg text-center max-w-4xl mx-auto">
              Our sessions are brief, direct and practical. They are meant to help you learn how to treat a certain treatment in a fast and sure way, without the long term obligation. Good to incorporate some new services in your menu, or to sharpen your expertise.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] rounded-2xl p-12 text-center text-white shadow-xl">
          <h2 className="text-3xl font-bold mb-4">Want to book a workshop or know more about schedules?</h2>
          <p className="text-xl mb-8 opacity-90">
            Contact our team for pricing and availability.
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

