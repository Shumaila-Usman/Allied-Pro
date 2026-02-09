'use client'

import TopBar from './TopBar'
import MiddleBar from './MiddleBar'

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white" id="main-header">
      <TopBar />
      <MiddleBar />
    </header>
  )
}


