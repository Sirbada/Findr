'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { MapPin, ArrowRight, Home, Car, Briefcase } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'
import { getProperties, getVehicles, Property, Vehicle } from '@/lib/supabase/queries'

function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR').format(price)
}

export function Categories() {
  const { t } = useTranslation()
  const [housingListings, setHousingListings] = useState<Property[]>([])
  const [carListings, setCarListings] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchListings() {
      const [housing, cars] = await Promise.all([
        getProperties({ limit: 4 }),
        getVehicles({ limit: 4 }),
      ])
      setHousingListings(housing)
      setCarListings(cars)
      setLoading(false)
    }
    fetchListings()
  }, [])

  if (loading) {
    return (
      <section className="py-12 bg-[color:var(--background)]">
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
    <section className="py-12 bg-[color:var(--background)]">
      <div className="max-w-6xl mx-auto px-4">
        {/* Housing Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[color:var(--green-50)] rounded-xl flex items-center justify-center">
                <Home className="w-5 h-5 text-[color:var(--green-600)]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {t.categories.housing}
                </h2>
                <p className="text-sm text-gray-500">
                  {t.listings.recentListings}
                </p>
              </div>
            </div>
            <Link 
              href="/housing"
              className="flex items-center gap-1 text-[color:var(--green-700)] hover:text-[color:var(--green-900)] font-medium text-sm"
            >
              {t.listings.viewAllLink}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {housingListings.map((listing) => (
              <Link
                key={listing.id}
                href={`/housing/${listing.id}`}
                className="group bg-white rounded-3xl overflow-hidden shadow-[var(--shadow-soft-sm)] hover:shadow-[var(--shadow-soft)] transition-all"
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
                    {formatPrice(listing.price_per_night)} XAF
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-gray-900 text-sm line-clamp-1 group-hover:text-[color:var(--green-700)] transition-colors">
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
              <div className="w-10 h-10 bg-[color:var(--green-50)] rounded-xl flex items-center justify-center">
                <Car className="w-5 h-5 text-[color:var(--green-600)]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {t.categories.cars}
                </h2>
                <p className="text-sm text-gray-500">
                  {t.listings.recentListings}
                </p>
              </div>
            </div>
            <Link 
              href="/cars"
              className="flex items-center gap-1 text-[color:var(--green-700)] hover:text-[color:var(--green-900)] font-medium text-sm"
            >
              {t.listings.viewAllLink}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {carListings.map((listing) => (
              <Link
                key={listing.id}
                href={`/cars/${listing.id}`}
                className="group bg-white rounded-3xl overflow-hidden shadow-[var(--shadow-soft-sm)] hover:shadow-[var(--shadow-soft)] transition-all"
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
                    {formatPrice(listing.price_per_day)} XAF{t.listings.perDay}
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-gray-900 text-sm line-clamp-1 group-hover:text-[color:var(--green-700)] transition-colors">
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

        {/* Emplois Section — CTA card */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{t.emplois.name}</h2>
                <p className="text-sm text-gray-500">{t.emplois.desc}</p>
              </div>
            </div>
            <Link
              href="/emplois"
              className="flex items-center gap-1 text-purple-700 hover:text-purple-900 font-medium text-sm"
            >
              {t.listings.viewAllLink}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <Link
            href="/emplois"
            className="group flex items-center justify-between bg-gradient-to-r from-purple-50 to-purple-100 rounded-3xl p-6 hover:from-purple-100 hover:to-purple-200 transition-all shadow-[var(--shadow-soft-sm)] hover:shadow-[var(--shadow-soft)]"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                <Briefcase className="w-7 h-7 text-purple-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{t.emplois.title}</p>
                <p className="text-sm text-gray-500">{t.emplois.subtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-purple-700 font-medium">
              {t.listings.viewAllLink}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}
