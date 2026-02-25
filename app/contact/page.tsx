'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import MainNav from '@/components/MainNav'
import Footer from '@/components/Footer'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [topPadding, setTopPadding] = useState(176)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    document.title = 'Contact Us - Allied Concept Beauty Supplies'
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
        setTopPadding(totalHeight + (isMobile ? 20 : 64))
      } else {
        // Fallback padding if elements not found
        setTopPadding(isMobile ? 120 : 240)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitStatus('success')
      setFormData({ firstName: '', email: '', message: '' })
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000)
    }, 1000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <Header />
      <MainNav />

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full" style={{ paddingTop: `${topPadding}px` }}>
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Contact <span className="bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] bg-clip-text text-transparent">Allied Concept Beauty Supply</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get in touch with us for inquiries about our extensive range of salon products and equipment
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Information */}
          <div className="mt-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Contact Allied Concept Beauty Supply</h2>
            <p className="text-gray-700 leading-relaxed text-lg mb-8">
              Get in touch for inquiries about our extensive range of salon products and equipment available for beauty professionals in Markham, Ontario.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect</h3>
                  <a
                    href="tel:+14379554480"
                    className="text-gray-700 hover:text-[#87CEEB] transition-colors duration-300 text-lg"
                  >
                    +1 437 955 4480
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[#C8A2C8] to-[#87CEEB] rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Support</h3>
                  <a
                    href="https://mail.google.com/mail/u/0/?fs=1&to=info@alliedbeautysupply.ca&tf=cm"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-[#87CEEB] transition-colors duration-300 text-lg"
                  >
                    info@alliedbeautysupply.ca
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  Your First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  placeholder="Type your message here"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none"
                />
              </div>

              {submitStatus === 'success' && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                  <p className="text-sm">Thank you! Your message has been sent successfully.</p>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                  <p className="text-sm">Something went wrong. Please try again.</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#87CEEB] to-[#C8A2C8] text-white px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Your Inquiry'}
              </button>
            </form>
          </div>
        </div>

        {/* Location Section */}
        <div className="space-y-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Locations</h2>
            <p className="text-gray-700 leading-relaxed text-lg mb-8">
              Visit Allied Concept Beauty Supply at our two convenient locations in the Greater Toronto Area, catering to beauty professionals and their needs.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Kennedy Location */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Kennedy Location (Retail Only)</h3>
              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Address</h4>
                  <a
                    href="https://www.google.com/maps/place/8339+Kennedy+Rd+%232628,+Unionville,+ON+L3R+5T5,+Canada/@43.8567676,-79.3060757,17z/data=!3m1!4b1!4m5!3m4!1s0x89d4d4325ac599ef:0xb31599bf23741a4e!8m2!3d43.8567638!4d-79.3035008?entry=ttu&g_ep=EgoyMDI2MDEyOC4wIKXMDSoASAFQAw%3D%3D"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-[#87CEEB] transition-colors duration-300 text-lg block"
                  >
                    8339 Kennedy Rd #2628, Markham, ON L3R5T5
                  </a>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Hours</h4>
                  <p className="text-gray-700 text-lg">Monday to Sunday, 9:00 AM – 6:00 PM</p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Note</h4>
                  <p className="text-gray-700 text-lg">Walk-ins are welcome during business hours</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2880.123456789!2d-79.3035008!3d43.8567638!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89d4d4325ac599ef%3A0xb31599bf23741a4e!2s8339%20Kennedy%20Rd%20%232628%2C%20Unionville%2C%20ON%20L3R%205T5%2C%20Canada!5e0!3m2!1sen!2sus!4v1706700000000!5m2!1sen!2sus"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Kennedy Location - Allied Concept Beauty Supply"
                />
              </div>
            </div>

            {/* Scarborough Location */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Scarborough Location (Wholesale Only)</h3>
              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Address</h4>
                  <a
                    href="https://www.google.com/maps/place/200+Silver+Star+Blvd,+Scarborough,+ON+M2H+3B4,+Canada"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-[#87CEEB] transition-colors duration-300 text-lg block"
                  >
                    200 Silver Star Blvd, Scarborough, ON M2H 3B4, Canada
                  </a>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Hours</h4>
                  <p className="text-gray-700 text-lg">Monday to Thursday, 9:00 AM – 5:00 PM</p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Note</h4>
                  <p className="text-gray-700 text-lg">Appointment Required (Call Before Visiting)</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2883.123456789!2d-79.3456789!3d43.7890123!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89d4d4325ac599ef%3A0xb31599bf23741a4e!2s200%20Silver%20Star%20Blvd%2C%20Scarborough%2C%20ON%20M2H%203B4%2C%20Canada!5e0!3m2!1sen!2sus!4v1706700000000!5m2!1sen!2sus"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Scarborough Location - Allied Concept Beauty Supply"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

