'use client'

import { useState } from 'react'
import { Search, MapPin, Home, Car } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export function Hero() {
  const { t, lang } = useTranslation()
  const [activeTab, setActiveTab] = useState<'housing' | 'cars'>('housing')
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <section className="relative overflow-hidden">
      {/* Background with Cameroon-inspired gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-gray-900 to-red-900" />
      
      {/* Cameroon flag accent stripes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-[600px] h-[600px] bg-green-500/8 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-[120%] bg-yellow-400/6 blur-3xl rotate-12" />
        <div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] bg-red-500/8 rounded-full blur-3xl animate-pulse delay-700" />
        {/* Star accent */}
        <div className="absolute top-16 right-1/4 text-yellow-400/20 text-8xl">★</div>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm mb-6">
            <span className="inline-flex gap-0.5"><span className="w-2 h-2 bg-green-400 rounded-full" /><span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" /><span className="w-2 h-2 bg-red-400 rounded-full" /></span>
            {lang === 'fr' ? 'Le marketplace du Cameroun' : 'Cameroon\'s marketplace'}
          </div>

          {/* Main headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            {lang === 'fr' ? (
              <>Trouvez tout au <span className="text-yellow-400">Cameroun</span></>
            ) : (
              <>Find everything in <span className="text-yellow-400">Cameroon</span></>
            )}
          </h1>
          
          <p className="text-xl text-gray-100 mb-10 max-w-2xl mx-auto">
            {lang === 'fr' 
              ? 'Logements, véhicules, emplois et services — Douala, Yaoundé et partout au Cameroun'
              : 'Housing, vehicles, jobs and services — Douala, Yaoundé and across Cameroon'}
          </p>

          {/* Search Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-2 max-w-3xl mx-auto">
            {/* Tabs */}
            <div className="flex mb-2">
              <button
                onClick={() => setActiveTab('housing')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${
                  activeTab === 'housing'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Home className="w-5 h-5" />
                {lang === 'fr' ? 'Immobilier' : 'Real Estate'}
              </button>
              <button
                onClick={() => setActiveTab('cars')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${
                  activeTab === 'cars'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Car className="w-5 h-5" />
                {lang === 'fr' ? 'Véhicules' : 'Vehicles'}
              </button>
            </div>

            {/* Search inputs */}
            <div className="flex flex-col sm:flex-row gap-2 p-2">
              <div className="flex-1 relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={lang === 'fr' ? 'Douala, Yaoundé, Kribi...' : 'Douala, Yaoundé, Kribi...'}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>
              <Link href={searchQuery ? `/annonces?q=${encodeURIComponent(searchQuery)}` : (activeTab === 'housing' ? '/housing' : '/cars')}>
                <Button size="lg" className="w-full sm:w-auto px-8 py-4 text-lg">
                  <Search className="w-5 h-5 mr-2" />
                  {lang === 'fr' ? 'Rechercher' : 'Search'}
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick stats */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 md:gap-16">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">500+</div>
              <div className="text-gray-200 text-sm">{lang === 'fr' ? 'Propriétés' : 'Properties'}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">100+</div>
              <div className="text-gray-200 text-sm">{lang === 'fr' ? 'Véhicules' : 'Vehicles'}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">10k+</div>
              <div className="text-gray-200 text-sm">{lang === 'fr' ? 'Utilisateurs' : 'Users'}</div>
            </div>
          </div>

          {/* Popular cities */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <span className="text-gray-200 text-sm font-medium">{lang === 'fr' ? 'Villes populaires:' : 'Popular cities:'}</span>
            {['Douala', 'Yaoundé', 'Kribi', 'Bafoussam'].map(city => (
              <Link
                key={city}
                href={`/housing?city=${city}`}
                className="text-white bg-white/15 hover:bg-white/25 px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
              >
                {city}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
