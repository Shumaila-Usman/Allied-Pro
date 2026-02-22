'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import MainNav from '@/components/MainNav'
import Footer from '@/components/Footer'
import Image from 'next/image'
import Link from 'next/link'

export default function AboutUsPage() {
  const [topPadding, setTopPadding] = useState(176)

  useEffect(() => {
    document.title = 'About Us - Allied Concept Beauty Supplies'
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
          <h1 className="text-5xl md:text-6xl font-bold mb-4">About Allied PRO Beauty Supply</h1>
          <p className="text-xl md:text-2xl mb-8">Supporting Beauty Professionals with Products, Knowledge, and Care</p>
          <Link
            href="/contact"
            className="inline-block bg-white text-[#87CEEB] px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity duration-300 border-2 border-white"
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
                  Allied Concept Beauty Supply was constructed by individuals with real experience in the beauty business. We have collaborated closely with salon owners, spa teams, and beauty experts, giving us a deep understanding of the daily challenges professionals face: finding the right supplier, mastering techniques, and meeting client demands.
                </p>
                <p className="text-gray-700 leading-relaxed text-lg">
                  Our initial thought in starting this business was simple: beauty professionals needed quality, support, and truthful service, and a partner where they could source professional beauty supplies, buy salon supplies online, and access spa equipment for salons in Canada.
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
              To provide beauty professionals with premium industry equipment and high-quality wholesale products they can trust. At Allied Concept Beauty Supply, we support creativity, high performance, and long-term growth. We empower salons and spas with reliable solutions from professional waxing kits to professional nail care products that enhance services, strengthen businesses, and deliver consistent results that drive lasting success.
            </p>
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] bg-clip-text text-transparent">
              Our Vision
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              To become the leading destination for wholesale beauty innovation, where every professional has access to the tools, education, and support needed to redefine industry standards. We envision a global community of confident stylists and spa experts growing their businesses with purpose. By curating exceptional salon-quality solutions, including brow lamination products wholesale and esthetician spa tools, we aim to be a lifelong partner in turning passion into measurable success.
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

              <p className="text-gray-700 leading-relaxed text-lg">
                We feel that you work better when you have learned well - and that your clients likewise have more faith in you.
              </p>
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
              <p className="text-gray-700">ACBS offers high quality, salon-tested tools and supplies, from waxing supplies for professionals to hair salon supplies wholesale, ensuring consistent, flawless results.</p>
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
              <p className="text-gray-700">Backed by years of experience, our products are selected by seasoned estheticians, makeup artists, and educators.</p>
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
              <p className="text-gray-700">From waxing supplies for professionals and spa equipment for salons to professional nail care products, brow lamination products wholesale, and esthetician spa tools, ACBS carries all the essentials pros need, all in one convenient location.</p>
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
              <p className="text-gray-700">Our team understands the beauty industry and provides expert guidance, fast shipping, and ongoing support.</p>
            </div>
          </div>
        </div>

        {/* Founder Section */}
        <div className="mb-20">
          <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-2 text-gray-900">Founder & CEO: Samira Farooq</h2>
                <p className="text-xl text-gray-700 mb-6">30+ Years of Excellence in Aesthetics & Beauty
                </p>
                <blockquote className="text-lg italic text-gray-700 mb-6 border-l-4 border-[#87CEEB] pl-4">
                "My mission is to provide beauty pros with the high-performance tools I wish I had when I started my career."  Samira Farooq

                </blockquote>
                <p className="text-gray-700 leading-relaxed mb-6">
                Having more than thirty years of practical experience, Samira Farooq has transformed herself into a master aesthetician and the first-tier wholesale distributor. Her career is characterized by the strong belief in promoting industry standards in terms of education and sourcing products of high quality.

                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-[#87CEEB] mr-3 font-bold">●</span>
                    <span className="text-gray-700"><strong>Expert Sourcing:</strong>  30 years of wisdom of creating a collection of high-end, salon-tested products.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#87CEEB] mr-3 font-bold">●</span>
                    <span className="text-gray-700"><strong>Education Focused:</strong>Committed to nurturing the future of the beauty professionals by highly training them.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#87CEEB] mr-3 font-bold">●</span>
                    <span className="text-gray-700"><strong>Professional Collaboration:</strong> Making ACBS an anchor of practitioners seeking excellence.
                    </span>
                  </li>
                </ul>
              </div>
              <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden shadow-xl">
                <Image
                  src="/team/samira-farooq.jpg"
                  alt="Samira Farooq"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Natasha Section */}
        <div className="mb-20">
          <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden shadow-xl order-2 md:order-1">
                <Image
                  src="/team/natasha-kowalski.jpg"
                  alt="Natasha Kowalski"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="order-1 md:order-2">
                <h2 className="text-3xl font-bold mb-2 text-gray-900">Natasha Kowalski</h2>
                <p className="text-xl text-gray-700 mb-6">Aesthetician & Operations Manager</p>
                <p className="text-gray-700 leading-relaxed mb-6">
                Natasha is a bridge person between clinical aesthetics and operational excellence, having 15 years of experience in the industry. With ten and more years experience working as a master aesthetician she is currently in charge of the smooth flow of products and assistance in delivery to ACBS clients.

                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-[#87CEEB] mr-3 font-bold">●</span>
                    <span className="text-gray-700"><strong>Professional Logistics:</strong> Provides quality service to all their partners.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#87CEEB] mr-3 font-bold">●</span>
                    <span className="text-gray-700"><strong>The Pro Perspective:</strong> The Pro Perspective Uses her practical background to choose the most appropriate tools to the trade.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#87CEEB] mr-3 font-bold">●</span>
                    <span className="text-gray-700"><strong>Team Growth:</strong>  Devoted to the development of a team based empowering environment.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Ammara Section */}
        <div className="mb-20">
          <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-2 text-gray-900">Ammara Ferwa</h2>
                <p className="text-xl text-gray-700 mb-6">Sales Specialist & Skincare Expert | BSc Biology</p>
                <p className="text-gray-700 leading-relaxed mb-6">
                Having a Bachelor of Science in Biology, Ammara is a person who was able to integrate the science behind skincare with high customer service. She uses her seven years experience to give technical and science-based product advice to the professionals.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-[#87CEEB] mr-3 font-bold">●</span>
                    <span className="text-gray-700"><strong>Scientific Expertise:</strong> Applies her biology experience to describe the behavior of the products in the skin at a cellular level.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#87CEEB] mr-3 font-bold">●</span>
                    <span className="text-gray-700"><strong>Expert Consulting:</strong> Seven years of experience in providing data-driven skincare solutions that are personalized.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#87CEEB] mr-3 font-bold">●</span>
                    <span className="text-gray-700"><strong>B2B Relationship Builder:</strong>  It is dedicated to making sales based on knowledgeable, self-assured client relationships and continuous support.
                    </span>
                  </li>
                </ul>
              </div>
              <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden shadow-xl">
                <Image
                  src="/team/ammara-ferwa.jpg"
                  alt="Ammara Ferwa"
                  fill
                  className="object-contain"
                />
              </div>
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

        {/* Our Promise */}
        <div className="mb-20 relative overflow-hidden rounded-2xl">
          {/* Background with gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 opacity-50"></div>
          
          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center p-8 lg:p-12">
            {/* Left Section - Text Content */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 lg:p-8 shadow-lg">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] bg-clip-text text-transparent">
                Our Promise to You
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg mb-6">
                At Allied Concept Beauty Supply, we promise to keep things simple, honest, and professional. We are committed to helping beauty professionals feel confident in their work and proud of their businesses.
              </p>
              <p className="text-gray-900 font-bold text-xl lg:text-2xl">
                We are not just here to sell products, we are here to support your success.
              </p>
            </div>
            
            {/* Right Section - Image */}
            <div className="relative w-full h-[400px] lg:h-[500px] rounded-xl overflow-hidden shadow-xl">
              <Image
                src="/about-us/new-sec4.png"
                alt="Our Promise to You"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

