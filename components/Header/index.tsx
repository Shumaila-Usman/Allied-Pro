'use client'

import { useScroll } from '@/contexts/ScrollContext'
import TopBar from './TopBar'
import MiddleBar from './MiddleBar'

export default function Header() {
  const { isScrolledDown } = useScroll()

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ease-in-out ${
        isScrolledDown 
          ? 'bg-transparent h-0 overflow-hidden' 
          : 'bg-white'
      }`} 
      id="main-header"
    >
      <div className={`transition-all duration-300 ease-in-out ${
        isScrolledDown 
          ? '-translate-y-full opacity-0 pointer-events-none' 
          : 'translate-y-0 opacity-100 pointer-events-auto'
      }`}>
        <TopBar />
        <MiddleBar />
      </div>
    </header>
  )
}


