'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight, MapPin, Clock, Star, Verified } from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from '@/lib/i18n/context'

// Mock data pour featured listings
const featuredListingsData = [
  {
    id: '1',
    title: 'Villa moderne à Bonanjo',
    price: '450,000,000',
    currency: 'FCFA',
    location: 'Bonanjo, Douala',
    image: '/api/placeholder/400/280',
    categoryKey: 'housing' as const,
    featured: true,
    verified: true,
    rating: 4.8,
    postedAgo: '2h',
    seller: {
      name: 'Marie Kouam',
      verified: true,
      photo: '/api/placeholder/40/40'
    }
  },
  {
    id: '2',
    title: 'Toyota Camry 2020 - Automatique',
    price: '18,500,000',
    currency: 'FCFA',
    location: 'Akwa, Douala',
    image: '/api/placeholder/400/280',
    categoryKey: 'cars' as const,
    featured: true,
    verified: true,
    rating: 4.9,
    postedAgo: '5h',
    seller: {
      name: 'Jean Fotso',
      verified: true,
      photo: '/api/placeholder/40/40'
    }
  },
  {
    id: '3',
    title: 'Développeur Full-Stack React/Node',
    price: '850,000',
    currency: 'FCFA/mois',
    location: 'Bastos, Yaoundé',
    image: '/api/placeholder/400/280',
    categoryKey: 'emplois' as const,
    featured: true,
    verified: false,
    rating: 4.7,
    postedAgo: '1j',
    seller: {
      name: 'TechStart Sarl',
      verified: true,
      photo: '/api/placeholder/40/40'
    }
  },
  {
    id: '4',
    title: 'MacBook Pro M2 - Neuf sous garantie',
    price: '2,100,000',
    currency: 'FCFA',
    location: 'Dschang, Ouest',
    image: '/api/placeholder/400/280',
    categoryKey: 'other' as const,
    featured: true,
    verified: true,
    rating: 5.0,
    postedAgo: '3h',
    seller: {
      name: 'Patrick Nkomo',
      verified: false,
      photo: '/api/placeholder/40/40'
    }
  },
  {
    id: '5',
    title: 'Terrain 2000m² - Titre foncier',
    price: '75,000,000',
    currency: 'FCFA',
    location: 'PK12, Yaoundé',
    image: '/api/placeholder/400/280',
    categoryKey: 'terrain' as const,
    featured: true,
    verified: true,
    rating: 4.6,
    postedAgo: '6h',
    seller: {
      name: 'Immobilier Plus',
      verified: true,
      photo: '/api/placeholder/40/40'
    }
  }
]

function formatPrice(price: string, currency: string): string {
  const numPrice = parseInt(price.replace(/,/g, ''))
  if (numPrice >= 1000000) {
    return `${(numPrice / 1000000).toFixed(1)}M ${currency.split('/')[0]}`
  } else if (numPrice >= 1000) {
    return `${(numPrice / 1000).toFixed(0)}K ${currency.split('/')[0]}`
  }
  return `${price} ${currency}`
}

export default function FeaturedListings() {
  const { t } = useTranslation()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const carouselRef = useRef<HTMLDivElement>(null)

  // Category labels using translations
  const categoryLabels: Record<string, string> = {
    housing: t.categories.housing,
    cars: t.categories.cars,
    emplois: t.emplois.name,
    terrain: t.categoryGrid.terrainName,
    other: t.categoryGrid.autresName,
  }
  
  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredListingsData.length)
    }, 5000)
    
    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredListingsData.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredListingsData.length) % featuredListingsData.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t.featuredSection.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl">
              {t.featuredSection.subtitle}
            </p>
          </div>
          <Link 
            href="/featured"
            className="mt-4 md:mt-0 inline-block text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg"
            style={{ 
              background: 'linear-gradient(to right, #F59E0B, #D97706)',
            }}
          >
            {t.featuredSection.viewAll}
          </Link>
        </div>

        {/* Carousel Container */}
        <div 
          className="relative"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          
          {/* Main Carousel */}
          <div className="overflow-hidden rounded-2xl shadow-xl">
            <div 
              ref={carouselRef}
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {featuredListingsData.map((listing) => (
                <div key={listing.id} className="w-full flex-shrink-0">
                  <Link href={`/listing/${listing.id}`}>
                    <div className="relative bg-white group cursor-pointer">
                      
                      {/* Main Image */}
                      <div className="relative h-80 md:h-96 bg-gray-200 overflow-hidden">
                        <img
                          src={listing.image}
                          alt={listing.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        
                        {/* Badges */}
                        <div className="absolute top-4 left-4 flex gap-2">
                          {listing.featured && (
                            <span className="text-white px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: '#F59E0B' }}>
                              {t.featuredSection.featuredBadge}
                            </span>
                          )}
                          {listing.verified && (
                            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                              <Verified className="w-3 h-3" />
                              {t.listings.verified}
                            </span>
                          )}
                        </div>

                        {/* Category */}
                        <div className="absolute top-4 right-4">
                          <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                            {categoryLabels[listing.categoryKey] ?? listing.categoryKey}
                          </span>
                        </div>

                        {/* Content Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                          <div className="mb-4">
                            <h3 className="text-2xl md:text-3xl font-bold mb-2 leading-tight">
                              {listing.title}
                            </h3>
                            <p className="text-3xl md:text-4xl font-bold mb-2" style={{ color: '#F59E0B' }}>
                              {formatPrice(listing.price, listing.currency)}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-200">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {listing.location}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {listing.postedAgo}
                              </div>
                            </div>
                          </div>

                          {/* Seller Info */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <img
                                src={listing.seller.photo}
                                alt={listing.seller.name}
                                className="w-10 h-10 rounded-full border-2 border-white"
                              />
                              <div>
                                <div className="font-medium text-sm">{listing.seller.name}</div>
                                {listing.seller.verified && (
                                  <div className="text-xs text-green-300 flex items-center gap-1">
                                    <Verified className="w-3 h-3" />
                                    {t.featuredSection.verifiedProfile}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm font-medium">{listing.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-full transition-all duration-200"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-full transition-all duration-200"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-8 gap-2">
          {featuredListingsData.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentIndex 
                  ? 'w-8' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              style={index === currentIndex ? { backgroundColor: '#F59E0B' } : {}}
            />
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-yellow-50 rounded-2xl p-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-1">15min</div>
              <div className="text-gray-700 text-sm">{t.featuredSection.publishTimeLabel}</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold mb-1" style={{ color: '#F59E0B' }}>3x</div>
              <div className="text-gray-700 text-sm">{t.featuredSection.viewsBoostLabel}</div>
            </div>
            <div className="col-span-2 md:col-span-1">
              <div className="text-2xl md:text-3xl font-bold text-green-600 mb-1">89%</div>
              <div className="text-gray-700 text-sm">{t.featuredSection.soldRateLabel}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
