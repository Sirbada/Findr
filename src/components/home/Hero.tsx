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
      {/* Background with gradient overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80"
          alt="Cameroon cityscape"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-800/85 to-gray-900/90" />
      </div>

      {/* Animated shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm mb-6">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            {lang === 'fr' ? 'La première plateforme immobilière au Cameroun' : 'Cameroon\'s #1 real estate platform'}
          </div>

          {/* Main headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            {lang === 'fr' ? (
              <>Trouvez votre <span className="text-blue-400">prochain chez-vous</span></>
            ) : (
              <>Find your <span className="text-blue-400">next home</span></>
            )}
          </h1>
          
          <p className="text-xl text-gray-100 mb-10 max-w-2xl mx-auto">
            {lang === 'fr' 
              ? 'Des milliers de logements et véhicules vous attendent à Douala, Yaoundé et partout au Cameroun'
              : 'Thousands of properties and vehicles waiting for you in Douala, Yaoundé and across Cameroon'}
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
              <Link href={activeTab === 'housing' ? '/housing' : '/cars'}>
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
