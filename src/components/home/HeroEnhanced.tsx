'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

const CITIES = ['Douala', 'Yaoundé', 'Kribi', 'Bafoussam', 'Limbe', 'Bamenda']

const CATEGORIES = [
  { id: 'housing', href: '/housing', icon: '🏠', labelFr: 'Immobilier', labelEn: 'Housing' },
  { id: 'cars', href: '/cars', icon: '🚗', labelFr: 'Véhicules', labelEn: 'Vehicles' },
  { id: 'terrain', href: '/terrain', icon: '🌿', labelFr: 'Terrain', labelEn: 'Land' },
  { id: 'emplois', href: '/emplois', icon: '💼', labelFr: 'Emplois', labelEn: 'Jobs' },
  { id: 'services', href: '/services', icon: '🔧', labelFr: 'Services', labelEn: 'Services' },
]

export function HeroEnhanced() {
  const { lang } = useTranslation()
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('housing')

  const handleSearch = () => {
    const cat = CATEGORIES.find(c => c.id === activeCategory)
    if (cat) {
      router.push(query ? `${cat.href}?q=${encodeURIComponent(query)}` : cat.href)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <section className="relative bg-white overflow-hidden">
      {/* Subtle gradient background — Apple-style */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(5,150,105,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-[1200px] mx-auto px-6 pt-20 pb-16 text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#059669]/8 rounded-full mb-6">
          <span className="w-1.5 h-1.5 bg-[#059669] rounded-full" />
          <span className="text-[12px] font-medium text-[#059669] tracking-[0.02em]">
            {lang === 'fr' ? 'Cameroun · Douala · Yaoundé' : 'Cameroon · Douala · Yaoundé'}
          </span>
        </div>

        {/* Headline — Apple-scale */}
        <h1
          className="font-bold text-[#1d1d1f] mb-5"
          style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            letterSpacing: '-0.04em',
            lineHeight: 1.05,
          }}
        >
          {lang === 'fr' ? (
            <>Trouvez <span className="text-[#059669]">tout</span> au Cameroun</>
          ) : (
            <>Find <span className="text-[#059669]">everything</span> in Cameroon</>
          )}
        </h1>

        {/* Subheadline */}
        <p
          className="text-[#6e6e73] mb-10 max-w-[560px] mx-auto"
          style={{ fontSize: '19px', letterSpacing: '-0.022em', lineHeight: 1.47 }}
        >
          {lang === 'fr'
            ? 'Logements, véhicules, terrains, emplois et services — tout en un seul endroit.'
            : 'Housing, vehicles, land, jobs and services — all in one place.'}
        </p>

        {/* Category tabs */}
        <div className="flex items-center justify-center gap-1 mb-6 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 px-4 py-2 text-[14px] font-medium rounded-full transition-all duration-200 ${
                activeCategory === cat.id
                  ? 'bg-[#1d1d1f] text-white shadow-sm'
                  : 'bg-[#f5f5f7] text-[#1d1d1f]/70 hover:bg-[#e8e8ed] hover:text-[#1d1d1f]'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{lang === 'fr' ? cat.labelFr : cat.labelEn}</span>
            </button>
          ))}
        </div>

        {/* Search bar — Apple-style pill */}
        <div className="max-w-[640px] mx-auto">
          <div
            className="flex items-center gap-3 bg-white rounded-2xl px-5 py-4"
            style={{
              boxShadow: '0 2px 20px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.06)',
            }}
          >
            <Search className="w-5 h-5 text-[#86868b] flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                lang === 'fr'
                  ? 'Rechercher à Douala, Yaoundé, Kribi...'
                  : 'Search in Douala, Yaoundé, Kribi...'
              }
              className="flex-1 bg-transparent text-[#1d1d1f] text-[15px] placeholder-[#86868b] outline-none"
              style={{ letterSpacing: '-0.01em' }}
            />
            <button
              onClick={handleSearch}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#059669] text-white text-[14px] font-medium rounded-xl hover:bg-[#047857] transition-all duration-200 flex-shrink-0"
              style={{ letterSpacing: '-0.01em' }}
            >
              <Search className="w-4 h-4" />
              {lang === 'fr' ? 'Rechercher' : 'Search'}
            </button>
          </div>

          {/* Popular cities */}
          <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
            <span className="text-[12px] text-[#86868b]">
              {lang === 'fr' ? 'Villes populaires :' : 'Popular cities:'}
            </span>
            {CITIES.map((city) => (
              <button
                key={city}
                onClick={() => {
                  const cat = CATEGORIES.find(c => c.id === activeCategory)
                  if (cat) router.push(`${cat.href}?city=${encodeURIComponent(city)}`)
                }}
                className="text-[12px] text-[#059669] hover:text-[#047857] font-medium transition-colors"
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
