'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import MainNav from '@/components/MainNav'
import Footer from '@/components/Footer'

interface FAQItem {
  id: string
  question: string
  answer: string
}

const faqData: FAQItem[] = [
  {
    id: '1',
    question: 'Who can shop at Allied Concept Beauty Supply?',
    answer: 'We serve licensed beauty professionals, salon/spa owners, and students. While some retail items are open to the public, professional-grade products require a verified account.',
  },
  {
    id: '2',
    question: 'Is there a minimum order quantity (MOQ) for wholesale?',
    answer: 'We do not have a site-wide minimum, but specific brands may require a minimum opening order to maintain authorized dealer status.',
  },
  {
    id: '3',
    question: 'What happens if my equipment arrives damaged?',
    answer: 'You must inspect all freight deliveries before signing the BOL (Bill of Lading). If the packaging is damaged, note it on the form and contact us within 24 hours.',
  },
  {
    id: '4',
    question: 'How do I become a dealer?',
    answer: 'To become a dealer, simply register for a dealer account on our website. You will need to provide your business information, including your business license and tax ID. Once approved, you will receive your unique Dealer ID via email, which you can use to access dealer pricing and exclusive products.',
  },
  {
    id: '5',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, bank transfers, and purchase orders for qualified businesses. Payment terms may vary based on your account status and order history.',
  },
  {
    id: '6',
    question: 'Do you offer training or educational resources?',
    answer: 'Yes! We offer comprehensive training programs for new professionals, including hands-on workshops, online courses, and educational modules. Our team of experienced professionals is dedicated to helping you master techniques and stay updated with industry best practices.',
  },
]

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<string[]>([])
  const [topPadding, setTopPadding] = useState(176)

  useEffect(() => {
    document.title = 'FAQs - Allied Concept Beauty Supplies'
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

  const toggleItem = (id: string) => {
    setOpenItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <Header />
      <MainNav />

      <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full" style={{ paddingTop: `${topPadding + 64}px` }}>
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <div className="w-20 h-20 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] rounded-full flex items-center justify-center mx-auto shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked <span className="bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] bg-clip-text text-transparent">Questions</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about our products, services, and policies. Can't find what you're looking for? Contact us!
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqData.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full px-6 py-5 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-primary-400 rounded-xl"
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-8">{item.question}</h3>
                <div className="flex-shrink-0">
                  <svg
                    className={`w-6 h-6 text-[#87CEEB] transition-transform duration-300 ${
                      openItems.includes(item.id) ? 'transform rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openItems.includes(item.id) ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-5">
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-gray-700 leading-relaxed mt-4">{item.answer}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] rounded-2xl p-8 md:p-12 text-center text-white shadow-xl">
          <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
          <p className="text-xl mb-6 opacity-90">
            Our team is here to help! Get in touch with us and we'll be happy to assist you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+14379554480"
              className="inline-block bg-white text-[#87CEEB] px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity duration-300 shadow-lg"
            >
              Call Us: +1 437 955 4480
            </a>
            <a
              href="https://mail.google.com/mail/u/0/?fs=1&to=info@alliedpro.ca&tf=cm"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white text-[#87CEEB] px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity duration-300 shadow-lg"
            >
              Email Us
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

