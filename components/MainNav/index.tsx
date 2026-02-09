'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import MegaMenu from './MegaMenu'
import { getProductUrl } from '@/lib/category-mapping'

const menuData = {
  skincare: {
    byCategory: [
      'Face Masks',
      'Eye Care',
      'Tools & Accessories',
      'Massage & Contouring',
    ],
    byConcern: [
      'Redness',
      'Anti-Aging / Firming',
      'Dryness',
    ],
    bySkinType: [
      'Normal / All Skin Types',
    ],
  },
  spaProducts: [
    'Treatment Products (Waxing & Paraffin)',
    'Body Wraps & Spa Creams',
    'Hot Stones',
    'Spa Accessories',
    'Towels, Robes & Linens',
    'Slippers & Disposables',
    'Small Tools & Disposable Sundries',
    'Equipment',
    'Warmers & Hot Towel Cabinets',
  ],
  nailProducts: [
    'Nail Care (Cuticle & Treatments)',
    'Nail Files & Buffers',
    'Nail Art',
    'Tools & Equipment',
    'Pedicure Tools',
    'Stations & Storage',
    'Manicure & Pedicure Accessories',
    'Consumables & Disposables',
  ],
  equipment: [
    'Facial Equipment',
    'Styling Equipment',
    'Salon Equipment (Trolleys & Carts)',
    'Equipment Accessories (Stands & Bulbs)',
  ],
  implements: [
    'Hair Tools',
    'Scissors & Shears',
    'Skin Tools (Tweezers & Extraction)',
    'Nail Pushers & Implements',
    'Sterilization & Safety',
    'Disposables',
    'Bowls',
    'Medical & Treatment Disposables',
  ],
  furniture: [
    'Facial Bed Multipurpose',
    'Facial Massage Bed (White / Black)',
    'Salon Spa Rolling Tray with Accessories Holder',
  ],
}

export default function MainNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [headerHeight, setHeaderHeight] = useState(0)

  useEffect(() => {
    const updateHeaderHeight = () => {
      const header = document.getElementById('main-header')
      if (header) {
        setHeaderHeight(header.offsetHeight)
      }
    }
    
    updateHeaderHeight()
    window.addEventListener('resize', updateHeaderHeight)
    
    return () => {
      window.removeEventListener('resize', updateHeaderHeight)
    }
  }, [])

  return (
    <nav id="main-nav" className="bg-black text-white fixed left-0 right-0 z-30" style={{ top: `${headerHeight}px` }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="hidden md:flex items-center justify-center space-x-1">
          <MegaMenu title="SKINCARE">
            <div className="grid grid-cols-3 gap-12">
              <div>
                <Link href={getProductUrl('SKINCARE', true)} className="text-gray-900 font-semibold text-base mb-4 block hover:text-primary-400 transition-colors duration-300">
                  All Skincare &gt;
                </Link>
                <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">By Category</h3>
                <ul className="space-y-2.5">
                  {menuData.skincare.byCategory.map((item) => (
                    <li key={item}>
                      <Link href={getProductUrl(item)} className="text-gray-700 hover:text-primary-400 transition-colors duration-300 text-sm">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">By Concern</h3>
                <ul className="space-y-2.5">
                  {menuData.skincare.byConcern.map((item) => (
                    <li key={item}>
                      <Link href={getProductUrl(item)} className="text-gray-700 hover:text-primary-400 transition-colors duration-300 text-sm">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">By Skin Type</h3>
                <ul className="space-y-2.5">
                  {menuData.skincare.bySkinType.map((item) => (
                    <li key={item}>
                      <Link href={getProductUrl(item)} className="text-gray-700 hover:text-primary-400 transition-colors duration-300 text-sm">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </MegaMenu>

          <MegaMenu title="SPA PRODUCTS">
            <div className="grid grid-cols-3 gap-12">
              <div>
                <Link href={getProductUrl('SPA PRODUCTS', true)} className="text-gray-900 font-semibold text-base mb-4 block hover:text-primary-400 transition-colors duration-300">
                  All Spa Products &gt;
                </Link>
                <ul className="space-y-2.5">
                  {menuData.spaProducts.slice(0, 3).map((item) => (
                    <li key={item}>
                      <Link href={getProductUrl(item)} className="text-gray-700 hover:text-primary-400 transition-colors duration-300 text-sm">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <ul className="space-y-2.5 mt-8">
                  {menuData.spaProducts.slice(3, 6).map((item) => (
                    <li key={item}>
                      <Link href={getProductUrl(item)} className="text-gray-700 hover:text-primary-400 transition-colors duration-300 text-sm">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <ul className="space-y-2.5 mt-8">
                  {menuData.spaProducts.slice(6).map((item) => (
                    <li key={item}>
                      <Link href={getProductUrl(item)} className="text-gray-700 hover:text-primary-400 transition-colors duration-300 text-sm">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </MegaMenu>

          <MegaMenu title="NAIL PRODUCTS">
            <div className="grid grid-cols-2 gap-12">
              <div>
                <Link href={getProductUrl('NAIL PRODUCTS', true)} className="text-gray-900 font-semibold text-base mb-4 block hover:text-primary-400 transition-colors duration-300">
                  All Nail Products &gt;
                </Link>
                <ul className="space-y-2.5">
                  {menuData.nailProducts.slice(0, 4).map((item) => (
                    <li key={item}>
                      <Link href={getProductUrl(item)} className="text-gray-700 hover:text-primary-400 transition-colors duration-300 text-sm">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <ul className="space-y-2.5 mt-8">
                  {menuData.nailProducts.slice(4).map((item) => (
                    <li key={item}>
                      <Link href={getProductUrl(item)} className="text-gray-700 hover:text-primary-400 transition-colors duration-300 text-sm">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </MegaMenu>

          <MegaMenu title="EQUIPMENT">
            <div className="grid grid-cols-2 gap-12">
              <div>
                <Link href={getProductUrl('EQUIPMENT', true)} className="text-gray-900 font-semibold text-base mb-4 block hover:text-primary-400 transition-colors duration-300">
                  All Equipment &gt;
                </Link>
                <ul className="space-y-2.5">
                  {menuData.equipment.map((item) => (
                    <li key={item}>
                      <Link href={getProductUrl(item)} className="text-gray-700 hover:text-primary-400 transition-colors duration-300 text-sm">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </MegaMenu>

          <MegaMenu title="IMPLEMENTS">
            <div className="grid grid-cols-2 gap-12">
              <div>
                <Link href={getProductUrl('IMPLEMENTS', true)} className="text-gray-900 font-semibold text-base mb-4 block hover:text-primary-400 transition-colors duration-300">
                  All Implements &gt;
                </Link>
                <ul className="space-y-2.5">
                  {menuData.implements.slice(0, 4).map((item) => (
                    <li key={item}>
                      <Link href={getProductUrl(item)} className="text-gray-700 hover:text-primary-400 transition-colors duration-300 text-sm">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <ul className="space-y-2.5 mt-8">
                  {menuData.implements.slice(4).map((item) => (
                    <li key={item}>
                      <Link href={getProductUrl(item)} className="text-gray-700 hover:text-primary-400 transition-colors duration-300 text-sm">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </MegaMenu>

          <MegaMenu title="FURNITURE">
            <div className="grid grid-cols-1 gap-12">
              <div>
                <Link href={getProductUrl('FURNITURE', true)} className="text-gray-900 font-semibold text-base mb-4 block hover:text-primary-400 transition-colors duration-300">
                  All Furniture &gt;
                </Link>
                <ul className="space-y-2.5">
                  {menuData.furniture.map((item) => (
                    <li key={item}>
                      <Link href={getProductUrl(item)} className="text-gray-700 hover:text-primary-400 transition-colors duration-300 text-sm">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </MegaMenu>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-full py-4 flex items-center justify-between"
          >
            <span className="font-medium">Menu</span>
            <svg
              className={`w-5 h-5 transition-transform ${mobileMenuOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {mobileMenuOpen && (
            <div className="pb-4 space-y-1">
              <Link
                href={getProductUrl('SKINCARE', true)}
                className="block py-3 px-4 hover:bg-gray-900 rounded transition-colors duration-300 font-medium"
              >
                SKINCARE
              </Link>
              <Link
                href={getProductUrl('SPA PRODUCTS', true)}
                className="block py-3 px-4 hover:bg-gray-900 rounded transition-colors duration-300 font-medium"
              >
                SPA PRODUCTS
              </Link>
              <Link
                href={getProductUrl('NAIL PRODUCTS', true)}
                className="block py-3 px-4 hover:bg-gray-900 rounded transition-colors duration-300 font-medium"
              >
                NAIL PRODUCTS
              </Link>
              <Link
                href={getProductUrl('EQUIPMENT', true)}
                className="block py-3 px-4 hover:bg-gray-900 rounded transition-colors duration-300 font-medium"
              >
                EQUIPMENT
              </Link>
              <Link
                href={getProductUrl('IMPLEMENTS', true)}
                className="block py-3 px-4 hover:bg-gray-900 rounded transition-colors duration-300 font-medium"
              >
                IMPLEMENTS
              </Link>
              <Link
                href={getProductUrl('FURNITURE', true)}
                className="block py-3 px-4 hover:bg-gray-900 rounded transition-colors duration-300 font-medium"
              >
                FURNITURE
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

