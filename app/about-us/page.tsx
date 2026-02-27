'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import MainNav from '@/components/MainNav'
import Footer from '@/components/Footer'
import Image from 'next/image'
import Link from 'next/link'

export default function AboutUsPage() {
  const [topPadding, setTopPadding] = useState(176)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    document.title = 'About Us - Allied Concept Beauty Supplies'
  }, [])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const calculatePadding = () => {
      const header = document.getElementById('main-header')
      const nav = document.getElementById('main-nav')
      const isMobile = window.innerWidth < 768 // md breakpoint
      
      if (header && nav) {
        // Get actual heights, accounting for when header might be hidden
        const headerHeight = header.offsetHeight > 0 ? header.offsetHeight : header.scrollHeight
        const navHeight = nav.offsetHeight
        
        // On mobile, nav is not fixed, so only account for header
        // On desktop, account for both header and nav
        const totalHeight = isMobile ? headerHeight : headerHeight + navHeight
        // Add extra padding to ensure content is not hidden
        setTopPadding(totalHeight + (isMobile ? 10 : 20))
      } else {
        // Fallback padding if elements not found
        setTopPadding(isMobile ? 100 : 220)
      }
    }

    // Calculate immediately
    calculatePadding()
    
    // Recalculate after delays to ensure DOM is ready
    const timeout1 = setTimeout(calculatePadding, 100)
    const timeout2 = setTimeout(calculatePadding, 300)
    const timeout3 = setTimeout(calculatePadding, 500)
    
    window.addEventListener('resize', calculatePadding)

    return () => {
      clearTimeout(timeout1)
      clearTimeout(timeout2)
      clearTimeout(timeout3)
      window.removeEventListener('resize', calculatePadding)
    }
  }, [])

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <MainNav />

      {/* Hero Banner */}
      <div className="relative w-full h-[350px] md:h-[450px] overflow-hidden" style={{ marginTop: isMobile ? `${topPadding - 20}px` : `${topPadding}px` }}>
        {/* Blurred Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/about-us/started.png"
            alt="Beauty Products Background"
            fill
            className="object-cover"
            style={{ filter: 'blur(8px)', transform: 'scale(1.1)' }}
          />
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#87CEEB] to-[#C8A2C8] opacity-90"></div>
        
        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 py-6 md:py-12">
          {/* Proudly Serving Canada - Top Right */}
          <div className="absolute top-3 right-3 md:top-8 md:right-8 flex items-center gap-2 text-white">
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span className="text-xs md:text-base font-medium">Proudly Serving Canada</span>
          </div>

          {/* Concept Group Presents */}
          <h2 className="text-lg md:text-2xl lg:text-3xl font-semibold text-white text-center mb-2 md:mb-3 drop-shadow-md px-2">
            Concept Group Presents
          </h2>

          {/* Main Title */}
          <h1 className="text-2xl md:text-5xl lg:text-6xl font-bold text-white mb-2 md:mb-4 text-center drop-shadow-lg px-2">
            Allied Concept Beauty Supply
          </h1>

          {/* Three Icons */}
          <div className="flex items-center justify-center gap-3 md:gap-8 mb-2 md:mb-4">
            {/* Beaker with Leaf Icon - Premium Products */}
            <div className="w-12 h-12 md:w-20 md:h-20 rounded-full border-2 border-white flex items-center justify-center bg-white/10 backdrop-blur-sm">
              <svg className="w-6 h-6 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 0v4m0-4h4m-4 0H8" />
              </svg>
            </div>

            {/* Book Icon - Expert Training */}
            <div className="w-12 h-12 md:w-20 md:h-20 rounded-full border-2 border-white flex items-center justify-center bg-white/10 backdrop-blur-sm">
              <svg className="w-6 h-6 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>

            {/* Shield with Heart Icon - Ongoing Support */}
            <div className="w-12 h-12 md:w-20 md:h-20 rounded-full border-2 border-white flex items-center justify-center bg-white/10 backdrop-blur-sm relative">
              <svg className="w-6 h-6 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <svg className="absolute w-3 h-3 md:w-5 md:h-5 text-white" fill="currentColor" viewBox="0 0 24 24" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
          </div>

          {/* Contact Us Button */}
          <Link
            href="/contact"
            className="inline-block bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity duration-300 shadow-lg mt-4"
          >
            Contact Us
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        {/* How It All Started */}
        <div className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Image Section */}
            <div className="relative w-full h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/about-us/started.png"
                alt="How It All Started - Professional Beauty Industry"
                fill
                className="object-cover"
                priority
              />
            </div>
            
            {/* Content Section */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] bg-clip-text text-transparent">
                How It All Started
              </h2>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed text-lg">
                  Allied Concept Beauty Supply, a division of Concept Group, is committed to equipping beauty professionals with premium products, reliable service, and trusted partnerships. We uphold the highest standards of quality, integrity, and operational excellence in the professional beauty industry.
                </p>
                <p className="text-gray-700 leading-relaxed text-lg">
                  In addition to serving retail customers, Allied Concept Beauty Supply proudly supports licensed professionals, clinics, and spas through our dedicated wholesale distribution program.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mission and Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <div>
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] bg-clip-text text-transparent">
              Our Mission
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              To provide beauty professionals with premium equipment and high-quality wholesale products they can trust. To empower salons and spas with reliable solutions, from waxing kits to nail care products, delivering consistent results and long-term business growth.
            </p>
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] bg-clip-text text-transparent">
              Our Vision
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              To become the leading destination for wholesale beauty innovation, offering tools, education, and support to redefine industry standards. To help stylists and spa experts grow with purpose, providing exceptional salon-quality solutions that drive success and lasting impact.
            </p>
          </div>
        </div>

{/* Salon Image */}
        <div className="mb-20">
          <div className="relative w-full h-[500px] rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="/salon-workspace.jpg"
              alt="Salon Workspace"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* All in One Solution */}
        <div className="mb-20">
          {/* Headlines */}
          <div className="text-center pt-12 pb-8 px-4">
            <h2 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] bg-clip-text text-transparent">
              An All-in-One Wholesale Spa/Salon Solution
            </h2>
            <p className="text-xl text-gray-700">
              Everything Your Spa or Salon Needs in One Place
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 px-4 lg:px-12 pb-12">
            {/* Left Section - Photo */}
            <div className="relative w-full h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/about-us/new-sec.png"
                alt="Professional Spa and Salon Team"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Right Section - Product Categories with Icons */}
            <div className="flex flex-col justify-center">
              <div className="grid grid-cols-2 gap-8 mb-8">
                {/* Spa and salon equipment - Treatment table/bed icon */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 mb-4 flex items-center justify-center">
                    <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <defs>
                        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#C8A2C8" />
                          <stop offset="100%" stopColor="#87CEEB" />
                        </linearGradient>
                      </defs>
                      <rect x="3" y="6" width="18" height="12" rx="1" stroke="url(#gradient1)" />
                      <path d="M3 12h18M9 6v12" stroke="url(#gradient1)" />
                      <circle cx="6" cy="12" r="1" fill="url(#gradient1)" />
                      <circle cx="18" cy="12" r="1" fill="url(#gradient1)" />
                    </svg>
                  </div>
                  <p className="text-gray-800 text-sm font-medium leading-tight">Spa and salon equipment</p>
                </div>

                {/* Waxing products and Skincare - Skincare bottle/jar icon */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 mb-4 flex items-center justify-center">
                    <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <defs>
                        <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#C8A2C8" />
                          <stop offset="100%" stopColor="#87CEEB" />
                        </linearGradient>
                      </defs>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 2v4m6-4v4M9 6h6M5 8h14a1 1 0 011 1v10a2 2 0 01-2 2H6a2 2 0 01-2-2V9a1 1 0 011-1z" stroke="url(#gradient2)" />
                      <path d="M9 12h6M9 16h6" stroke="url(#gradient2)" />
                    </svg>
                  </div>
                  <p className="text-gray-800 text-sm font-medium leading-tight">Waxing products and Skincare</p>
                </div>

                {/* Professional accessories and equipment - Tools/scissors icon */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 mb-4 flex items-center justify-center">
                    <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <defs>
                        <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#C8A2C8" />
                          <stop offset="100%" stopColor="#87CEEB" />
                        </linearGradient>
                      </defs>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" stroke="url(#gradient3)" />
                    </svg>
                  </div>
                  <p className="text-gray-800 text-sm font-medium leading-tight">Professional accessories and equipment</p>
                </div>

                {/* Pieces of furniture and treatment necessities - Cabinet/furniture icon */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 mb-4 flex items-center justify-center">
                    <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <defs>
                        <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#C8A2C8" />
                          <stop offset="100%" stopColor="#87CEEB" />
                        </linearGradient>
                      </defs>
                      <rect x="4" y="4" width="16" height="16" rx="1" stroke="url(#gradient4)" />
                      <path d="M4 10h16M10 4v16" stroke="url(#gradient4)" />
                      <circle cx="7" cy="7" r="0.5" fill="url(#gradient4)" />
                      <circle cx="17" cy="7" r="0.5" fill="url(#gradient4)" />
                    </svg>
                  </div>
                  <p className="text-gray-800 text-sm font-medium leading-tight">Pieces of furniture and treatment necessities</p>
                </div>

                {/* Consumable and everyday supplies - Bottle/dispenser icon */}
                <div className="flex flex-col items-center text-center col-span-2">
                  <div className="w-20 h-20 mb-4 flex items-center justify-center">
                    <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <defs>
                        <linearGradient id="gradient5" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#C8A2C8" />
                          <stop offset="100%" stopColor="#87CEEB" />
                        </linearGradient>
                      </defs>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.2 1.599M5 14.5l-1.2 1.599m0 0l-1.599-1.2M5 14.5l-1.599-1.2" stroke="url(#gradient5)" />
                    </svg>
                  </div>
                  <p className="text-gray-800 text-sm font-medium leading-tight">Consumable and everyday supplies</p>
                </div>
              </div>

              {/* Concluding Paragraph */}
              <p className="text-gray-700 leading-relaxed text-base text-center lg:text-left">
                All products are carefully chosen to meet professional needs, so you can offer safe, clean, and high quality services to your clients.
              </p>
            </div>
          </div>
        </div>

        {/* Students Images Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          <div className="relative w-full h-64 rounded-lg overflow-hidden shadow-lg">
            <Image
              src="/students/student-1.jpg"
              alt="Student Training"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative w-full h-64 rounded-lg overflow-hidden shadow-lg">
            <Image
              src="/students/student-2.jpg"
              alt="Student Training"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative w-full h-64 rounded-lg overflow-hidden shadow-lg">
            <Image
              src="/students/student-3.jpg"
              alt="Student Training"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative w-full h-64 rounded-lg overflow-hidden shadow-lg">
            <Image
              src="/students/student-4.jpg"
              alt="Student Training"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Training & Support */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] bg-clip-text text-transparent text-center">
            Training & Support for New Professionals
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Section - Photo */}
            <div className="relative w-full h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/about-us/new-sec2.png"
                alt="Training and Support for New Professionals"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Right Section - Content with Icons */}
            <div>
              <p className="text-gray-700 leading-relaxed text-lg mb-6">
                Starting in the beauty industry can feel confusing and overwhelming, and we understand that.
              </p>
              
              <ul className="space-y-4 text-gray-700 text-lg mb-6">
                {/* Acquiring proper skills */}
                <li className="flex items-start">
                  <div className="w-6 h-6 mr-3 mt-1 flex-shrink-0">
                    <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" strokeWidth={2}>
                      <defs>
                        <linearGradient id="gradientTraining1" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#C8A2C8" />
                          <stop offset="100%" stopColor="#87CEEB" />
                        </linearGradient>
                      </defs>
                      <rect x="4" y="8" width="16" height="8" rx="1" stroke="url(#gradientTraining1)" />
                      <line x1="4" y1="12" x2="20" y2="12" stroke="url(#gradientTraining1)" />
                    </svg>
                  </div>
                  <span>Acquiring proper skills.</span>
                </li>

                {/* The safe use of professional products */}
                <li className="flex items-start">
                  <div className="w-6 h-6 mr-3 mt-1 flex-shrink-0">
                    <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" strokeWidth={2}>
                      <defs>
                        <linearGradient id="gradientTraining2" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#C8A2C8" />
                          <stop offset="100%" stopColor="#87CEEB" />
                        </linearGradient>
                      </defs>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" stroke="url(#gradientTraining2)" />
                    </svg>
                  </div>
                  <span>The safe use of professional products.</span>
                </li>

                {/* Knowledge of tools and equipment */}
                <li className="flex items-start">
                  <div className="w-6 h-6 mr-3 mt-1 flex-shrink-0">
                    <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" strokeWidth={2}>
                      <defs>
                        <linearGradient id="gradientTraining3" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#C8A2C8" />
                          <stop offset="100%" stopColor="#87CEEB" />
                        </linearGradient>
                      </defs>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" stroke="url(#gradientTraining3)" />
                    </svg>
                  </div>
                  <span>Knowledge of tools and equipment.</span>
                </li>

                {/* Developing trust in real-life salon work */}
                <li className="flex items-start">
                  <div className="w-6 h-6 mr-3 mt-1 flex-shrink-0">
                    <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" strokeWidth={2}>
                      <defs>
                        <linearGradient id="gradientTraining4" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#C8A2C8" />
                          <stop offset="100%" stopColor="#87CEEB" />
                        </linearGradient>
                      </defs>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" stroke="url(#gradientTraining4)" />
                    </svg>
                  </div>
                  <span>Developing trust in real-life salon work.</span>
                </li>
              </ul>

              <p className="text-gray-700 leading-relaxed text-lg mb-6">
                We feel that you work better when you have learned well - and that your clients likewise have more faith in you.
              </p>

              {/* CTA Button */}
              <Link
                href="/training-education"
                className="inline-block bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity duration-300 shadow-lg"
              >
                Explore Training & Education
              </Link>
            </div>
          </div>
        </div>

        {/* Why Beauty Pros Choose ACBS */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] bg-clip-text text-transparent text-center">
            Why Beauty Pros Choose ACBS
          </h2>
          <p className="text-center text-gray-700 text-lg mb-12 max-w-3xl mx-auto">
            Beauty professionals choose Allied concept beauty supply for high-quality products, expert-trusted tools, a wide selection, and reliable support, all under one roof.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4 rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="/about-us/features/pro-grade-products.jpg"
                  alt="Pro-Grade Products"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Pro-Grade Products</h3>
              <p className="text-gray-700">ACBS offers high-quality, salon-tested tools and supplies for waxing, hair, nails, and spa services. Every product ensures consistent, flawless results for professionals seeking precision and reliability.</p>
            </div>
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4 rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="/about-us/features/trusted-experts.jpg"
                  alt="Trusted Industry Experts"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Trusted Industry Experts</h3>
              <p className="text-gray-700">All products are chosen by experienced estheticians, makeup artists, and educators with industry expertise. They provide professional-grade tools, safety, and effectiveness for every salon and spa.</p>
            </div>
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4 rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="/about-us/features/wide-selection.jpg"
                  alt="Wide Selection"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Wide Selection</h3>
              <p className="text-gray-700">ACBS stocks spa equipment, nail care products, brow lamination tools, and waxing supplies for every professional need. Everything is in one location, supporting efficiency, quality results, and smooth operations.</p>
            </div>
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4 rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="/about-us/features/business-support.jpg"
                  alt="Business Support"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Business Support</h3>
              <p className="text-gray-700">Our team provides expert guidance, fast shipping, and reliable support for your beauty business. We offer ongoing help, solutions, and personalized advice for successful operations.</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mb-20">
          <div className="bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] rounded-2xl p-12 text-center text-white">
            <h2 className="text-4xl font-bold mb-4">Speak with an Expert Today</h2>
            <p className="text-xl mb-8 opacity-90">Get personalized advice and support from our team of beauty professionals</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+14379554480"
                className="inline-block bg-white text-[#87CEEB] px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity duration-300 shadow-lg"
              >
                Call Us: +1 437 955 4480
              </a>
              <Link
                href="/contact"
                className="inline-block bg-white text-[#87CEEB] px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity duration-300 shadow-lg"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>

        {/* More Than a Supplier */}
        <div className="mb-20 relative overflow-hidden rounded-2xl">
          {/* Background with gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 opacity-50"></div>
          
          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center p-8 lg:p-12">
            {/* Left Section - Image */}
            <div className="relative w-full h-[400px] lg:h-[500px] rounded-xl overflow-hidden shadow-xl">
              <Image
                src="/about-us/new-sec3.png"
                alt="Partnership and Trust"
                fill
                className="object-cover"
              />
            </div>
            
            {/* Right Section - Content with Icons */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 lg:p-8 shadow-lg">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] bg-clip-text text-transparent">
                More Than a Supplier: A Partner You Can Trust
              </h2>
              
              {/* Feature Icons Grid - 5 icons in a row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
                {/* New Salon Setups */}
                <div className="bg-white border border-gray-200 rounded-lg p-3 text-center shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 mx-auto mb-2 flex items-center justify-center">
                    <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <defs>
                        <linearGradient id="gradientIcon1" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#C8A2C8" />
                          <stop offset="100%" stopColor="#87CEEB" />
                        </linearGradient>
                      </defs>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" stroke="url(#gradientIcon1)" />
                    </svg>
                  </div>
                  <p className="text-xs font-medium text-gray-700">New Salon Setups</p>
                </div>

                {/* Product Supply Solutions */}
                <div className="bg-white border border-gray-200 rounded-lg p-3 text-center shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 mx-auto mb-2 flex items-center justify-center">
                    <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <defs>
                        <linearGradient id="gradientIcon2" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#C8A2C8" />
                          <stop offset="100%" stopColor="#87CEEB" />
                        </linearGradient>
                      </defs>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" stroke="url(#gradientIcon2)" />
                    </svg>
                  </div>
                  <p className="text-xs font-medium text-gray-700">Product Supply Solutions</p>
                </div>

                {/* Profit Growth Support */}
                <div className="bg-white border border-gray-200 rounded-lg p-3 text-center shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 mx-auto mb-2 flex items-center justify-center">
                    <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <defs>
                        <linearGradient id="gradientIcon3" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#C8A2C8" />
                          <stop offset="100%" stopColor="#87CEEB" />
                        </linearGradient>
                      </defs>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" stroke="url(#gradientIcon3)" />
                    </svg>
                  </div>
                  <p className="text-xs font-medium text-gray-700">Profit Growth Support</p>
                </div>

                {/* Staff Training Resources */}
                <div className="bg-white border border-gray-200 rounded-lg p-3 text-center shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 mx-auto mb-2 flex items-center justify-center">
                    <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <defs>
                        <linearGradient id="gradientIcon4" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#C8A2C8" />
                          <stop offset="100%" stopColor="#87CEEB" />
                        </linearGradient>
                      </defs>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" stroke="url(#gradientIcon4)" />
                    </svg>
                  </div>
                  <p className="text-xs font-medium text-gray-700">Staff Training Resources</p>
                </div>

                {/* Ongoing Partnership */}
                <div className="bg-white border border-gray-200 rounded-lg p-3 text-center shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 mx-auto mb-2 flex items-center justify-center">
                    <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <defs>
                        <linearGradient id="gradientIcon5" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#C8A2C8" />
                          <stop offset="100%" stopColor="#87CEEB" />
                        </linearGradient>
                      </defs>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.25 18.002h18.75M2.25 12.75h18.75m-18.75-4.5h18.75m-9.75 4.5v-4.5m0 4.5v4.5m0-4.5h-4.5m4.5 0h4.5" stroke="url(#gradientIcon5)" />
                    </svg>
                  </div>
                  <p className="text-xs font-medium text-gray-700">Ongoing Partnership</p>
                </div>
              </div>
              
              {/* Bottom Line */}
              <p className="text-lg font-semibold text-gray-800 mt-6">
                We don't just supply products<br />
                We empower beauty businesses.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

