'use client'

import { useState } from 'react'
import { Search, MapPin, Home, Car, Briefcase, Wrench, TreePine } from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from '@/lib/i18n/context'

export default function HeroSection() {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('Douala')

  const categories = [
    { id: 'immobilier', name: t.categories.housing, icon: Home, color: 'text-blue-600', count: '2,340' },
    { id: 'vehicules', name: t.categories.cars, icon: Car, color: 'text-green-600', count: '1,856' },
    { id: 'emplois', name: t.emplois.name, icon: Briefcase, color: 'text-purple-600', count: '967' },
    { id: 'services', name: t.categoryGrid.servicesName, icon: Wrench, color: 'text-blue-600', count: '1,234' },
    { id: 'terrain', name: t.categoryGrid.terrainName, icon: TreePine, color: 'text-emerald-600', count: '456' }
  ]

  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(selectedLocation)}`
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-white/10 opacity-20" />
      
      {/* Clean geometric pattern */}
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="absolute bottom-4 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-4xl mx-auto">
          
          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            <span className="block">{t.heroSection.tagline1}</span>
            <span className="block" style={{ color: '#F59E0B' }}>{t.heroSection.tagline2}</span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-blue-100 mb-8 font-medium">
            {t.heroSection.marketplaceTagline}
          </p>
          
          <p className="text-lg text-blue-200 mb-12 max-w-2xl mx-auto leading-relaxed">
            {t.heroSection.description}
          </p>

          {/* Search Bar */}
          <div className="bg-white rounded-2xl p-4 shadow-2xl mb-12 max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row gap-3">
              
              {/* Search Input */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={t.heroSection.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-12 pr-4 py-4 text-lg border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Location Selector */}
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="pl-12 pr-8 py-4 text-lg border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none min-w-[160px]"
                >
                  <option value="Douala">{t.cities.douala}</option>
                  <option value="Yaoundé">{t.cities.yaounde}</option>
                  <option value="Bafoussam">{t.cities.bafoussam}</option>
                  <option value="Bamenda">{t.cities.bamenda}</option>
                  <option value="Garoua">{t.cities.garoua}</option>
                  <option value="Maroua">Maroua</option>
                  <option value="Ngaoundéré">Ngaoundéré</option>
                  <option value="Bertoua">Bertoua</option>
                  <option value="Ebolowa">Ebolowa</option>
                  <option value="Kribi">Kribi</option>
                </select>
              </div>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                style={{ backgroundColor: '#F59E0B', backgroundImage: 'linear-gradient(to right, #F59E0B, #D97706)' }}
              >
                {t.hero.search}
              </button>
            </div>
          </div>

          {/* Category Icons */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
            {categories.map((category) => {
              const IconComponent = category.icon
              return (
                <Link 
                  key={category.id}
                  href={`/category/${category.id}`}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all duration-200 group cursor-pointer"
                >
                  <div className="text-center">
                    <div className="bg-white/20 rounded-full p-4 w-16 h-16 mx-auto mb-3 group-hover:scale-110 transition-transform duration-200">
                      <IconComponent className="w-8 h-8 text-white mx-auto" />
                    </div>
                    <h3 className="font-semibold text-white text-sm mb-1">{category.name}</h3>
                    <p className="text-blue-200 text-xs">{category.count} {t.heroSection.annoncesLabel}</p>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">12k+</div>
              <div className="text-blue-200 text-sm">{t.heroSection.statsActiveListings}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">5k+</div>
              <div className="text-blue-200 text-sm">{t.heroSection.statsUsers}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">10</div>
              <div className="text-blue-200 text-sm">{t.heroSection.statsCities}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
