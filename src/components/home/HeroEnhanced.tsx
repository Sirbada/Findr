'use client'

import { useState, useEffect } from 'react'
import { Search, MapPin, Home, Car, Briefcase, Wrench, ArrowRight } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export function HeroEnhanced() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<'housing' | 'cars' | 'jobs' | 'services'>('housing')
  const [searchQuery, setSearchQuery] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const categories = [
    {
      key: 'housing' as const,
      icon: Home,
      label: t.categories.housing,
      description: t.categories.housingDesc,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      key: 'cars' as const,
      icon: Car,
      label: t.categories.cars,
      description: t.heroEnhanced.carsDesc,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      key: 'jobs' as const,
      icon: Briefcase,
      label: t.emplois.name,
      description: t.heroEnhanced.jobsDesc,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      key: 'services' as const,
      icon: Wrench,
      label: t.categoryGrid.servicesName,
      description: t.heroEnhanced.servicesDesc,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
    },
  ]

  const activeCategory = categories.find((c) => c.key === activeTab) ?? categories[0]

  return (
    <section className="relative overflow-hidden min-h-screen flex items-center">
      {/* Animated gradient background */}
      <div className="absolute inset-0 gradient-bg opacity-90" />

      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-float" />
        <div className="absolute top-40 right-20 w-16 h-16 bg-white/10 rounded-full animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-40 left-20 w-12 h-12 bg-white/10 rounded-full animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 right-40 w-24 h-24 bg-white/10 rounded-full animate-float" style={{ animationDelay: '0.5s' }} />
      </div>

      <div
        className={`relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 ${
          mounted ? 'animate-fade-in' : 'opacity-0'
        }`}
      >
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center glass text-white px-6 py-3 rounded-full text-sm font-medium mb-8 animate-slide-up">
            <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3 animate-pulse" />
            {t.heroEnhanced.badge}
          </div>

          {/* Main headline */}
          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight animate-slide-up"
            style={{ animationDelay: '0.2s' }}
          >
            {t.heroEnhanced.titleFind}{' '}
            <span className="text-emerald-300">{t.heroEnhanced.titleEverything}</span>{' '}
            {t.heroEnhanced.titleIn}
            <br />
            <span className="bg-gradient-to-r from-emerald-300 to-emerald-100 bg-clip-text text-transparent">
              Cameroun
            </span>
          </h1>

          <p
            className="text-xl md:text-2xl text-emerald-50 mb-12 max-w-3xl mx-auto animate-slide-up"
            style={{ animationDelay: '0.4s' }}
          >
            {t.heroEnhanced.subtitle}
          </p>

          {/* Enhanced Search Card */}
          <div
            className="glass backdrop-blur-xl rounded-3xl p-6 max-w-4xl mx-auto mb-12 animate-scale-in"
            style={{ animationDelay: '0.6s' }}
          >
            {/* Category tabs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {categories.map((category) => {
                const IconComponent = category.icon
                return (
                  <button
                    key={category.key}
                    onClick={() => setActiveTab(category.key)}
                    className={`group relative p-4 rounded-2xl transition-all duration-300 ${
                      activeTab === category.key
                        ? 'bg-white text-emerald-600 shadow-lg transform scale-105'
                        : 'text-white hover:bg-white/20'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <div
                        className={`p-2 rounded-xl ${
                          activeTab === category.key ? category.bgColor : 'bg-white/10'
                        }`}
                      >
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-sm">{category.label}</div>
                        <div
                          className={`text-xs ${
                            activeTab === category.key ? 'text-gray-600' : 'text-white/70'
                          }`}
                        >
                          {category.description}
                        </div>
                      </div>
                    </div>
                    {activeTab === category.key && (
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-emerald-600/20 rounded-2xl animate-pulse" />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Search inputs */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-emerald-600" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.heroEnhanced.searchPlaceholder}
                  className="w-full pl-14 pr-6 py-5 bg-white/90 backdrop-blur-sm rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 focus:bg-white transition-all text-lg font-medium"
                />
              </div>
              <Link
                href={
                  searchQuery
                    ? `/annonces?q=${encodeURIComponent(searchQuery)}&category=${activeTab}`
                    : `/${activeTab}`
                }
              >
                <Button
                  size="lg"
                  className={`w-full md:w-auto px-10 py-5 text-lg font-semibold rounded-2xl bg-gradient-to-r ${activeCategory.color} hover:shadow-xl transform transition-all duration-300 hover:scale-105 group`}
                >
                  <Search className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />
                  {t.hero.search}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Popular cities */}
          <div
            className="flex flex-wrap items-center justify-center gap-3 animate-slide-up"
            style={{ animationDelay: '0.8s' }}
          >
            <span className="text-emerald-100 text-sm font-medium">
              {t.heroEnhanced.popularCities}
            </span>
            {['Douala', 'Yaoundé', 'Kribi', 'Bafoussam', 'Bamenda'].map((city, index) => (
              <Link
                key={city}
                href={`/${activeTab}?city=${city}`}
                className="group flex items-center space-x-2 glass text-white hover:bg-white/30 px-4 py-2 rounded-full text-sm font-medium transition-all hover-lift"
                style={{ animationDelay: `${0.9 + index * 0.1}s` }}
              >
                <span>{city}</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  )
}
