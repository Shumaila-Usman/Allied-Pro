'use client'

import Image from 'next/image'

interface Brand {
  id: string
  name: string
  logo: string
}

interface BrandSliderProps {
  brands: Brand[]
}

export default function BrandSlider({ brands }: BrandSliderProps) {
  // Duplicate brands for infinite scroll effect
  const duplicatedBrands = [...brands, ...brands, ...brands]

  return (
    <div className="relative w-full overflow-hidden bg-gray-50 py-8">
      <div className="flex animate-scroll space-x-8">
        {duplicatedBrands.map((brand, index) => (
          <div
            key={`${brand.id}-${index}`}
            className="flex-shrink-0 w-32 h-32 md:w-40 md:h-40 relative grayscale hover:grayscale-0 transition-all duration-300"
          >
            <Image
              src={brand.logo}
              alt={brand.name}
              fill
              className="object-contain"
            />
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
      `}</style>
    </div>
  )
}


