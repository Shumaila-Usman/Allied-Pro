'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface ScrollContextType {
  isScrolledDown: boolean
}

const ScrollContext = createContext<ScrollContextType>({
  isScrolledDown: false,
})

export function ScrollProvider({ children }: { children: ReactNode }) {
  const [isScrolledDown, setIsScrolledDown] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const scrollThreshold = 10 // Small threshold to prevent flickering

      // If at the very top (or very close to top), always show the header
      if (currentScrollY <= scrollThreshold) {
        setIsScrolledDown(false)
        setLastScrollY(currentScrollY)
        return
      }

      // Determine scroll direction
      const scrollingDown = currentScrollY > lastScrollY
      const scrollingUp = currentScrollY < lastScrollY

      if (scrollingDown && currentScrollY > scrollThreshold) {
        // Scrolling down - hide TopBar and MiddleBar, show MainNav at top
        setIsScrolledDown(true)
      } else if (scrollingUp) {
        // Scrolling up - show TopBar and MiddleBar, MainNav returns to original position
        setIsScrolledDown(false)
      }

      setLastScrollY(currentScrollY)
    }

    // Initialize scroll position
    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  return (
    <ScrollContext.Provider value={{ isScrolledDown }}>
      {children}
    </ScrollContext.Provider>
  )
}

export function useScroll() {
  return useContext(ScrollContext)
}

