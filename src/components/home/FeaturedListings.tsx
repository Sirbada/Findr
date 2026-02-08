'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { MapPin, Bed, CheckCircle, Car, Home } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'
import { Button } from '@/components/ui/Button'
import { getListings, Listing } from '@/lib/supabase/queries'

function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR').format(price)
}

const categoryIcons = {
  housing: Home,
  cars: Car,
}

export function FeaturedListings() {
  const { t, lang } = useTranslation()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchListings() {
      const data = await getListings({ limit: 8 })
      setListings(data)
      setLoading(false)
    }
    fetchListings()
  }, [])

  if (loading) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-10"></div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-gray-200 rounded-xl h-72"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">
            {lang === 'fr' ? 'Annonces récentes' : 'Recent Listings'}
          </h2>
          <Button variant="outline">
            {lang === 'fr' ? 'Voir tout' : 'View all'}
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {listings.map((listing) => {
            const CategoryIcon = categoryIcons[listing.category as keyof typeof categoryIcons] || Home
            const detailUrl = listing.category === 'cars' 
              ? `/cars/${listing.id}` 
              : `/housing/${listing.id}`
            
            return (
              <Link
                key={listing.id}
                href={detailUrl}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  {listing.images?.[0] ? (
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <CategoryIcon className="w-12 h-12 text-gray-300" />
                    </div>
                  )}
                  {listing.is_featured && (
                    <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded">
                      {t.listings.featured}
                    </span>
                  )}
                  {listing.is_verified && (
                    <span className="absolute top-3 right-3 bg-white/90 text-green-600 text-xs font-medium px-2 py-1 rounded flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      {t.listings.verified}
                    </span>
                  )}
                  {/* Category badge */}
                  <span className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
                    {listing.category === 'housing' && (listing.housing_type || 'Logement')}
                    {listing.category === 'cars' && (listing.car_brand || 'Voiture')}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {listing.title}
                  </h3>
                  <div className="flex items-center text-gray-500 text-sm mb-3">
                    <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                    <span className="truncate">
                      {listing.neighborhood ? `${listing.neighborhood}, ` : ''}{listing.city}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    {/* Left side info */}
                    <div className="flex items-center text-gray-500 text-sm">
                      {listing.category === 'housing' && listing.rooms && (
                        <>
                          <Bed className="w-4 h-4 mr-1" />
                          <span>{listing.rooms} {t.listings.rooms}</span>
                        </>
                      )}
                      {listing.category === 'cars' && listing.car_year && (
                        <span>{listing.car_year}</span>
                      )}
                    </div>
                    {/* Price */}
                    <div className="text-blue-600 font-bold text-right">
                      {listing.category === 'housing' && listing.price > 0 && (
                        <>
                          {formatPrice(listing.price)}
                          <span className="text-xs font-normal text-gray-500">
                            {listing.rental_period === 'sale' ? ' XAF' : ' XAF/mois'}
                          </span>
                        </>
                      )}
                      {listing.category === 'cars' && listing.price_per_day && (
                        <>
                          {formatPrice(listing.price_per_day)}
                          <span className="text-xs font-normal text-gray-500"> XAF/jour</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
