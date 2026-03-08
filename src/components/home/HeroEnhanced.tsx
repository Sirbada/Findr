'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Home, Car, TreePine, Briefcase, Zap } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

const CITIES = ['Douala', 'Yaound\u00e9', 'Kribi', 'Bafoussam', 'Limbe', 'Bamenda']

const CATEGORIES = [
  { id: 'housing', href: '/housing', icon: Home, labelFr: 'Immobilier', labelEn: 'Housing' },
  { id: 'cars', href: '/cars', icon: Car, labelFr: 'V\u00e9hicules', labelEn: 'Vehicles' },
  { id: 'terrain', href: '/terrain', icon: TreePine, labelFr: 'Terrain', labelEn: 'Land' },
  { id: 'emplois', href: '/emplois', icon: Briefcase, labelFr: 'Emplois', labelEn: 'Jobs' },
  { id: 'services', href: '/services', icon: Zap, labelFr: 'Services', labelEn: 'Services' },
]

export function HeroEnhanced() {
  const { t, lang } = useTranslation()
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('housing')

  const activeCat = CATEGORIES.find(c => c.id === activeCategory)!

  const handleSearch = () => {
    router.push(query ? `${activeCat.href}?q=${encodeURIComponent(query)}` : activeCat.href)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #0D3D24 0%, #1B5E3B 60%, #2D8A5F 100%)',
        minHeight: '520px',
      }}
    >
      <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-16">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6 text-[12px] font-semibold uppercase tracking-[0.06em] bg-white/10 text-white/80 border border-white/15">
          <span className="w-1.5 h-1.5 bg-white rounded-full" />
          {t.heroEnhanced.badge}
        </div>

        {/* Headline — left-aligned */}
        <h1
          className="font-bold mb-5 max-w-3xl"
          style={{
            fontSize: 'clamp(2.25rem, 5vw, 3.5rem)',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            color: '#FFFFFF',
          }}
        >
          {t.heroEnhanced.titleFind}{' '}
          <span className="text-[#FEF3C7]">{t.heroEnhanced.titleEverything}</span>{' '}
          {t.heroEnhanced.titleIn} {lang === 'fr' ? 'Cameroun' : 'Cameroon'}
        </h1>

        {/* Subtitle */}
        <p className="mb-10 max-w-xl text-[17px] leading-[1.7] text-white/60">
          {t.heroEnhanced.subtitle}
        </p>

        {/* Category tabs */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id
            const Icon = cat.icon
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-[#0D3D24]'
                    : 'bg-white/10 text-white border border-white/15 hover:bg-white/15'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{lang === 'fr' ? cat.labelFr : cat.labelEn}</span>
              </button>
            )
          })}
        </div>

        {/* Search bar */}
        <div className="max-w-[600px]">
          <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-[0_4px_16px_rgba(0,0,0,0.06),0_1px_4px_rgba(0,0,0,0.04)]">
            <Search className="w-5 h-5 text-[#7A7A73] flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                lang === 'fr'
                  ? `Rechercher ${activeCat.labelFr.toLowerCase()} \u00e0 Douala, Yaound\u00e9...`
                  : `Search ${activeCat.labelEn.toLowerCase()} in Douala, Yaound\u00e9...`
              }
              className="flex-1 bg-transparent text-[15px] text-[#1A1A18] outline-none placeholder:text-[#ADADAA]"
            />
            <button
              onClick={handleSearch}
              className="flex items-center gap-2 px-5 py-2 bg-[#1B5E3B] hover:bg-[#0D3D24] text-white text-sm font-semibold rounded-lg flex-shrink-0 transition-all duration-150 active:scale-[0.98]"
            >
              {lang === 'fr' ? 'Rechercher' : 'Search'}
            </button>
          </div>

          {/* Popular cities */}
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <span className="text-[12px] text-white/40 font-medium">
              {t.heroEnhanced.popularCities}
            </span>
            {CITIES.map((city) => (
              <button
                key={city}
                onClick={() => router.push(`${activeCat.href}?city=${encodeURIComponent(city)}`)}
                className="text-[12px] font-medium text-white/70 hover:text-white bg-white/10 hover:bg-white/15 px-2.5 py-0.5 rounded-full transition-colors duration-150"
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-6 mt-12 flex-wrap">
          {[
            { value: '10K+', label: lang === 'fr' ? 'Annonces' : 'Listings' },
            { value: '5K+', label: lang === 'fr' ? 'Utilisateurs' : 'Users' },
            { value: '50+', label: lang === 'fr' ? 'Villes' : 'Cities' },
            { value: '100%', label: lang === 'fr' ? 'Gratuit' : 'Free' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center px-4 py-2 rounded-xl bg-white/8"
            >
              <span className="text-xl font-bold text-white tracking-[-0.02em]">
                {stat.value}
              </span>
              <span className="text-[11px] font-medium text-white/50">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
