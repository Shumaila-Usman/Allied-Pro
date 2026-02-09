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
        {/* Two Column Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <div>
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] bg-clip-text text-transparent">
              Born from passion, built for professionals
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              In Allied Concept Beauty Supply, we know that there is a dream, labor and passion behind all those spas and salons. We are here to help beauty professionals to grow confidently, to have the right products, the right tools and the right guidance.
            </p>
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] bg-clip-text text-transparent">
              Supporting your success at every stage
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              We are a wholesale beauty supply firm that was established with spas, salons and skincares in mind. We aim to help ease your work through reliable supplies and professional equipment, as well as training of those, who are new in the industry.
            </p>
          </div>
        </div>

        {/* How It All Started */}
        <div className="mb-20 text-center">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] bg-clip-text text-transparent">
            How It All Started
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg max-w-4xl mx-auto">
            Allied Concept Beauty Supply was constructed by individuals with actual experience in the beauty business. We have collaborated very closely with the salon owners, spa teams, and beauty experts, in such a way that we are aware of all the challenges you go through daily: finding the right supplier, mastering the technique, and meeting the demands of the clientele. Our initial thought of starting this business was: beauty professionals needed quality, support, and truthful service.
          </p>
        </div>

        {/* Mission and Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] bg-clip-text text-transparent">
              Our mission
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              To become the first place to shop in terms of wholesale beauty innovation, to which every professional has access to the tools and help to reinvent the industry norms. Our vision is a community of empowered stylists and artists expanding their businesses confidently all over the world. With the best salon-quality solutions being curated, we will become the lifelong companion that assists the beauty experts with the conversion of their passion into the success they can get.
            </p>
          </div>
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] bg-clip-text text-transparent">
              Our vision
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              To provide any beauty professional with the best industry equipment and high-end wholesale merchandise. We believe in making you creative at Allied PRO and assist your business to grow with high performance products that are also reliable and deliver success to your salon in the long run.
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
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] bg-clip-text text-transparent text-center">
            An All in One Wholesale Spa/Salon Solution
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg mb-6">
            We give all that a spa or a salon requires to operate efficiently. You do not need to go hunting down various suppliers, you can find your needs in a single reliable location.
          </p>
          <p className="text-gray-900 font-bold text-lg mb-4">Our wholesale line would consist of:</p>
          <ul className="space-y-3 text-gray-700 text-lg mb-6">
            <li className="flex items-start">
              <span className="text-[#87CEEB] mr-3">●</span>
              <span>Spa and salon equipment</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#87CEEB] mr-3">●</span>
              <span>Waxing products and skincare.</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#87CEEB] mr-3">●</span>
              <span>Professional accessories and equipment.</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#87CEEB] mr-3">●</span>
              <span>Pieces of furniture and treatment necessities.</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#87CEEB] mr-3">●</span>
              <span>Consumable and everyday supplies.</span>
            </li>
          </ul>
          <p className="text-gray-700 leading-relaxed text-lg">
            All products are carefully chosen to meet professional needs, so you can offer safe, clean, and high quality services to your clients.
          </p>
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
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] bg-clip-text text-transparent text-center">
            Training & Support for New Professionals
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg mb-6">
            Starting in the beauty industry can feel confusing and overwhelming, and we understand that.
          </p>
          <ul className="space-y-3 text-gray-700 text-lg mb-6">
            <li className="flex items-start">
              <span className="text-[#87CEEB] mr-3">●</span>
              <span>Acquiring proper skills.</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#87CEEB] mr-3">●</span>
              <span>The safe use of professional products.</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#87CEEB] mr-3">●</span>
              <span>Knowledge of tools and equipment.</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#87CEEB] mr-3">●</span>
              <span>Developing trust in a real life salon work.</span>
            </li>
          </ul>
          <p className="text-gray-700 leading-relaxed text-lg">
            We feel that you work better when you have learned well - and that your clients likewise have more faith in you.
          </p>
        </div>

        {/* Why Beauty Pros Choose Allied PRO */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] bg-clip-text text-transparent text-center">
            Why Beauty Pros Choose Allied PRO
          </h2>
          <p className="text-center text-gray-700 text-lg mb-12 max-w-3xl mx-auto">
            Beauty pros choose Allied PRO for high-quality products, expert-trusted tools, a wide selection, and reliable support—all in one place.
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
              <p className="text-gray-700">Allied PRO offers high-quality, salon-tested tools and supplies that deliver consistent, flawless results.</p>
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
              <p className="text-gray-700">Backed by years of experience, our products are chosen by seasoned estheticians, makeup artists, and educators.</p>
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
              <p className="text-gray-700">From waxing and skincare to brows and lashes, Allied PRO carries the essentials pros need —under one roof.</p>
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
                <p className="text-xl text-gray-700 mb-6">30+ Years of Excellence in Aesthetics & Beauty</p>
                <blockquote className="text-lg italic text-gray-700 mb-6 border-l-4 border-[#87CEEB] pl-4">
                  "My mission is to provide beauty pros with the high performance tools I wish I had when I started my career." - Samira Farooq
                </blockquote>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Having more than thirty years of practical experience, Samira Farooq has transformed herself into a master aesthetician and the first-tier wholesale distributor. Her career is characterized by the strong belief in promoting industry standards in terms of education and sourcing products of high quality.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-[#87CEEB] mr-3 font-bold">●</span>
                    <span className="text-gray-700"><strong>Expert Sourcing:</strong> 30 years of wisdom of creating a collection of high-end, salon-tested products.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#87CEEB] mr-3 font-bold">●</span>
                    <span className="text-gray-700"><strong>Education Focused:</strong> committed to nurturing the future of the beauty professionals by highly training them.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#87CEEB] mr-3 font-bold">●</span>
                    <span className="text-gray-700"><strong>Professional Collaboration:</strong> Making Allied PRO an anchor of practitioners seeking excellence.</span>
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
                  Natasha is a bridge person between clinical aesthetics and operational excellence, having 15 years of experience in the industry. With ten and more years experience working as a master aesthetician she is currently in charge of the smooth flow of products and assistance in delivery to Allied PRO clients.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-[#87CEEB] mr-3 font-bold">●</span>
                    <span className="text-gray-700"><strong>Professional Logistics:</strong> Provides quality service to all their partners.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#87CEEB] mr-3 font-bold">●</span>
                    <span className="text-gray-700"><strong>The Pro Perspective:</strong> Uses her practical background to choose the most appropriate tools to the trade.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#87CEEB] mr-3 font-bold">●</span>
                    <span className="text-gray-700"><strong>Team Growth:</strong> Devoted to the development of a team based empowering environment.</span>
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
                    <span className="text-gray-700"><strong>Scientific Expertise:</strong> Applies her biology experience to describe the behavior of the products in the skin at a cellular level.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#87CEEB] mr-3 font-bold">●</span>
                    <span className="text-gray-700"><strong>Expert Consulting:</strong> Seven years of experience in providing data-driven skincare solutions that are personalized.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#87CEEB] mr-3 font-bold">●</span>
                    <span className="text-gray-700"><strong>B2B Relationship Builder:</strong> It is dedicated to making sales based on knowledgeable, self-assured client relationships and continuous support.</span>
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
            <Link
              href="/contact"
              className="inline-block bg-white text-[#87CEEB] px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>

        {/* More Than a Supplier */}
        <div className="mb-20 text-center">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] bg-clip-text text-transparent">
            More Than a Supplier: A Partner You Can Trust
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg mb-6 max-w-4xl mx-auto">
            At Allied Concept Beauty Supply, we don't see our customers as just buyers. We see them as partners. Whether you are opening your first salon, managing a busy spa, or training new staff, we are here to support you.
          </p>
          <p className="text-gray-700 leading-relaxed text-lg max-w-4xl mx-auto">
            Supporting Your Journey at Every Step No matter where you are in your journey, we are proud to support you with quality products, practical training, consistent supply, and ongoing guidance.
          </p>
        </div>

        {/* Our Promise */}
        <div className="mb-20 text-center">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] bg-clip-text text-transparent">
            Our Promise to You
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg mb-6 max-w-4xl mx-auto">
            At Allied Concept Beauty Supply, we promise to keep things simple, honest, and professional. We are committed to helping beauty professionals feel confident in their work and proud of their businesses.
          </p>
          <p className="text-gray-900 font-bold text-xl max-w-4xl mx-auto">
            We are not just here to sell products, we are here to support your success.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  )
}

