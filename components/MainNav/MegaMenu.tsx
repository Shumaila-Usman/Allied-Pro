'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

interface MegaMenuProps {
  title: string
  children: React.ReactNode
}

export default function MegaMenu({ title, children }: MegaMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [topPosition, setTopPosition] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const updatePosition = () => {
      const nav = document.getElementById('main-nav')
      const header = document.querySelector('header')
      if (nav && header) {
        // Get the actual position from the viewport
        const headerRect = header.getBoundingClientRect()
        const navRect = nav.getBoundingClientRect()
        // Position dropdown right below the nav bar (which is below the header)
        const totalHeight = navRect.bottom
        setTopPosition(totalHeight)
      }
    }
    
    if (isOpen) {
      updatePosition()
      // Update on scroll and resize to keep it stuck to nav
      const handleScroll = () => updatePosition()
      const handleResize = () => updatePosition()
      
      window.addEventListener('scroll', handleScroll, true)
      window.addEventListener('resize', handleResize)
      
      return () => {
        window.removeEventListener('scroll', handleScroll, true)
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [isOpen])

  const dropdownContent = isOpen && mounted ? (
    <div
      className="fixed bg-white shadow-2xl border-t-2 border-primary-400 z-[60] transition-all duration-300"
      style={{ 
        top: `${topPosition}px`,
        left: 0,
        right: 0,
        width: '100vw',
        maxWidth: '100vw',
        opacity: isOpen ? 1 : 0,
        transform: isOpen ? 'translateY(0)' : 'translateY(-10px)'
      }}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className="max-w-7xl mx-auto px-12 py-10">
        {children}
      </div>
    </div>
  ) : null

  return (
    <>
      <div
        className="relative"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <button className="px-4 py-4 text-white hover:text-primary-300 transition-colors duration-300 font-medium">
          {title}
        </button>
      </div>
      {mounted && createPortal(dropdownContent, document.body)}
    </>
  )
}

