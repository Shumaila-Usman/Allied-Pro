'use client'

export default function TopBar() {
  return (
    <div className="hidden md:block bg-gray-100 py-2 px-2 sm:px-4 text-center text-xs sm:text-sm text-gray-700">
      <p className="whitespace-normal break-words">
        <span className="hidden sm:inline">🎉 Special Offer: Free Shipping on Orders Over $500 | New Dealers Get 15% Off First Order</span>
        <span className="sm:hidden">🎉 Free Shipping Over $500 | New Dealers: 15% Off</span>
      </p>
    </div>
  )
}


