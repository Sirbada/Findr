'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, ArrowRight } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

const CITIES = ['Douala', 'Yaoundé', 'Kribi', 'Bafoussam', 'Limbe', 'Bamenda']

const CATEGORIES = [
  {
    id: 'housing',
    href: '/housing',
    icon: '🏠',
    labelFr: 'Immobilier',
    labelEn: 'Housing',
    color: '#059669',
    bg: 'linear-gradient(135deg, #059669, #10b981)',
    lightBg: '#ecfdf5',
    textColor: '#065f46',
  },
  {
    id: 'cars',
    href: '/cars',
    icon: '🚗',
    labelFr: 'Véhicules',
    labelEn: 'Vehicles',
    color: '#0ea5e9',
    bg: 'linear-gradient(135deg, #0ea5e9, #38bdf8)',
    lightBg: '#f0f9ff',
    textColor: '#0c4a6e',
  },
  {
    id: 'terrain',
    href: '/terrain',
    icon: '🌿',
    labelFr: 'Terrain',
    labelEn: 'Land',
    color: '#d97706',
    bg: 'linear-gradient(135deg, #d97706, #f59e0b)',
    lightBg: '#fffbeb',
    textColor: '#92400e',
  },
  {
    id: 'emplois',
    href: '/emplois',
    icon: '💼',
    labelFr: 'Emplois',
    labelEn: 'Jobs',
    color: '#8b5cf6',
    bg: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
    lightBg: '#f5f3ff',
    textColor: '#4c1d95',
  },
  {
    id: 'services',
    href: '/services',
    icon: '⚡',
    labelFr: 'Services',
    labelEn: 'Services',
    color: '#f43f5e',
    bg: 'linear-gradient(135deg, #f43f5e, #fb7185)',
    lightBg: '#fff1f2',
    textColor: '#9f1239',
  },
]

export function HeroEnhanced() {
  const { lang } = useTranslation()
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
        background: 'linear-gradient(160deg, #d1fae5 0%, #a7f3d0 15%, #ecfdf5 40%, #fafaf9 65%, #fef3c7 85%, #fde68a 100%)',
        minHeight: '520px',
      }}
    >
      {/* Decorative blobs */}
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none opacity-30"
        style={{
          background: 'radial-gradient(circle, #34d399 0%, transparent 70%)',
          transform: 'translate(30%, -30%)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none opacity-20"
        style={{
          background: 'radial-gradient(circle, #fbbf24 0%, transparent 70%)',
          transform: 'translate(-30%, 30%)',
        }}
      />
      <div
        className="absolute top-1/2 left-1/4 w-[300px] h-[300px] rounded-full pointer-events-none opacity-10"
        style={{
          background: 'radial-gradient(circle, #0ea5e9 0%, transparent 70%)',
          transform: 'translate(-50%, -50%)',
        }}
      />

      <div className="relative max-w-[1200px] mx-auto px-6 pt-16 pb-14 text-center">
        {/* Eyebrow pill */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-[13px] font-semibold"
          style={{
            background: 'linear-gradient(135deg, #d1fae5, #fef3c7)',
            color: '#065f46',
            border: '1px solid #a7f3d0',
          }}
        >
          <span className="w-2 h-2 bg-[#059669] rounded-full animate-pulse" />
          {lang === 'fr' ? '🇨🇲 Cameroun · Douala · Yaoundé · Kribi' : '🇨🇲 Cameroon · Douala · Yaoundé · Kribi'}
        </div>

        {/* Headline */}
        <h1
          className="font-bold mb-4"
          style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            letterSpacing: '-0.04em',
            lineHeight: 1.05,
            color: '#064e3b',
          }}
        >
          {lang === 'fr' ? (
            <>
              Trouvez{' '}
              <span style={{ color: '#059669' }}>
                tout
              </span>{' '}
              au Cameroun
            </>
          ) : (
            <>
              Find{' '}
              <span style={{ color: '#059669' }}>
                everything
              </span>{' '}
              in Cameroon
            </>
          )}
        </h1>

        {/* Subheadline */}
        <p
          className="mb-8 max-w-[560px] mx-auto"
          style={{ fontSize: '18px', color: '#4b5563', letterSpacing: '-0.01em', lineHeight: 1.5 }}
        >
          {lang === 'fr'
            ? 'Logements, véhicules, terrains, emplois et services — tout en un seul endroit.'
            : 'Housing, vehicles, land, jobs and services — all in one place.'}
        </p>

        {/* Category tabs — colorful */}
        <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className="flex items-center gap-2 px-4 py-2 text-[14px] font-semibold rounded-full transition-all duration-200"
                style={
                  isActive
                    ? {
                        background: cat.bg,
                        color: '#ffffff',
                        boxShadow: `0 4px 16px ${cat.color}40`,
                        transform: 'translateY(-1px)',
                      }
                    : {
                        background: cat.lightBg,
                        color: cat.textColor,
                        border: `1.5px solid ${cat.color}30`,
                      }
                }
              >
                <span className="text-base">{cat.icon}</span>
                <span>{lang === 'fr' ? cat.labelFr : cat.labelEn}</span>
              </button>
            )
          })}
        </div>

        {/* Search bar */}
        <div className="max-w-[640px] mx-auto">
          <div
            className="flex items-center gap-3 bg-white rounded-2xl px-5 py-3.5"
            style={{
              boxShadow: `0 4px 24px rgba(0,0,0,0.08), 0 0 0 1.5px ${activeCat.color}30`,
            }}
          >
            <span className="text-xl flex-shrink-0">{activeCat.icon}</span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                lang === 'fr'
                  ? `Rechercher ${activeCat.labelFr.toLowerCase()} à Douala, Yaoundé...`
                  : `Search ${activeCat.labelEn.toLowerCase()} in Douala, Yaoundé...`
              }
              className="flex-1 bg-transparent text-[15px] outline-none"
              style={{ color: '#1a1a1a', letterSpacing: '-0.01em' }}
            />
            <button
              onClick={handleSearch}
              className="flex items-center gap-2 px-5 py-2.5 text-white text-[14px] font-semibold rounded-xl flex-shrink-0 transition-all duration-200"
              style={{
                background: activeCat.bg,
                boxShadow: `0 2px 12px ${activeCat.color}40`,
              }}
            >
              <Search className="w-4 h-4" />
              {lang === 'fr' ? 'Rechercher' : 'Search'}
            </button>
          </div>

          {/* Popular cities */}
          <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
            <span className="text-[12px] text-[#9ca3af] font-medium">
              {lang === 'fr' ? 'Villes populaires :' : 'Popular cities:'}
            </span>
            {CITIES.map((city) => (
              <button
                key={city}
                onClick={() => router.push(`${activeCat.href}?city=${encodeURIComponent(city)}`)}
                className="text-[12px] font-semibold transition-colors px-2 py-0.5 rounded-full"
                style={{
                  color: activeCat.color,
                  background: activeCat.lightBg,
                }}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-center gap-8 mt-10 flex-wrap">
          {[
            { value: '10K+', label: lang === 'fr' ? 'Annonces' : 'Listings', color: '#059669', bg: '#ecfdf5' },
            { value: '5K+', label: lang === 'fr' ? 'Utilisateurs' : 'Users', color: '#0ea5e9', bg: '#f0f9ff' },
            { value: '50+', label: lang === 'fr' ? 'Villes' : 'Cities', color: '#d97706', bg: '#fffbeb' },
            { value: '100%', label: lang === 'fr' ? 'Gratuit' : 'Free', color: '#8b5cf6', bg: '#f5f3ff' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center px-4 py-2 rounded-2xl"
              style={{ background: stat.bg }}
            >
              <span className="text-[22px] font-bold" style={{ color: stat.color, letterSpacing: '-0.03em' }}>
                {stat.value}
              </span>
              <span className="text-[11px] font-medium" style={{ color: stat.color + 'cc' }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
