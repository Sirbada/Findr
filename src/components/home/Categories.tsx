'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { MapPin, ArrowRight, Home, Car } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'
import { getListings, Listing } from '@/lib/supabase/queries'

function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR').format(price)
}

export function Categories() {
  const { lang } = useTranslation()
  const [housingListings, setHousingListings] = useState<Listing[]>([])
  const [carListings, setCarListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchListings() {
      const [housing, cars] = await Promise.all([
        getListings({ category: 'housing', limit: 4 }),
        getListings({ category: 'cars', limit: 4 }),
      ])
      setHousingListings(housing)
      setCarListings(cars)
      setLoading(false)
    }
    fetchListings()
  }, [])

  if (loading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="bg-gray-200 rounded-xl h-48"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* Housing Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Home className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {lang === 'fr' ? 'Immobilier' : 'Real Estate'}
                </h2>
                <p className="text-sm text-gray-500">
                  {lang === 'fr' ? 'Annonces récentes' : 'Recent listings'}
                </p>
              </div>
            </div>
            <Link 
              href="/housing"
              className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              {lang === 'fr' ? 'Voir tout' : 'View all'}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {housingListings.map((listing) => (
              <Link
                key={listing.id}
                href={`/housing/${listing.id}`}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                <div className="relative h-32 overflow-hidden">
                  {listing.images?.[0] ? (
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <Home className="w-8 h-8 text-gray-300" />
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                    {formatPrice(listing.price)} XAF
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-gray-900 text-sm line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {listing.title}
                  </h3>
                  <div className="flex items-center text-gray-500 text-xs mt-1">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span className="truncate">
                      {listing.neighborhood ? `${listing.neighborhood}, ` : ''}{listing.city}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Cars Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Car className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {lang === 'fr' ? 'Véhicules' : 'Vehicles'}
                </h2>
                <p className="text-sm text-gray-500">
                  {lang === 'fr' ? 'Annonces récentes' : 'Recent listings'}
                </p>
              </div>
            </div>
            <Link 
              href="/cars"
              className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              {lang === 'fr' ? 'Voir tout' : 'View all'}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {carListings.map((listing) => (
              <Link
                key={listing.id}
                href={`/cars/${listing.id}`}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                <div className="relative h-32 overflow-hidden">
                  {listing.images?.[0] ? (
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <Car className="w-8 h-8 text-gray-300" />
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                    {listing.price_per_day 
                      ? `${formatPrice(listing.price_per_day)} XAF/jour`
                      : `${formatPrice(listing.price)} XAF`
                    }
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-gray-900 text-sm line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {listing.title}
                  </h3>
                  <div className="flex items-center text-gray-500 text-xs mt-1">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span className="truncate">
                      {listing.neighborhood ? `${listing.neighborhood}, ` : ''}{listing.city}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
