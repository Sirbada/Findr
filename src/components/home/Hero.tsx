'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, MapPin, Home, Car, Sparkles } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export function Hero() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<'housing' | 'cars'>('housing')
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <section className="relative overflow-hidden bg-[color:var(--background)]">
      {/* Soft background */}
      <div className="absolute inset-0">
        <div className="absolute -top-32 left-[-10%] h-80 w-80 rounded-full bg-[color:var(--green-100)]/60 blur-3xl" />
        <div className="absolute -bottom-40 right-[-10%] h-96 w-96 rounded-full bg-[color:var(--green-200)]/50 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/40 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          {/* Left copy */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[color:var(--green-50)] px-3 py-1 text-xs text-[color:var(--green-700)]">
              <Sparkles className="h-3 w-3" />
              {t.heroPremium.platformTagline}
            </div>
            <h1 className="mt-4 text-4xl font-semibold text-[color:var(--green-900)] md:text-5xl">
              {t.heroPremium.headlineBook}
            </h1>
            <p className="mt-4 max-w-xl text-sm text-[color:var(--green-700)] md:text-base">
              {t.heroPremium.taglineDesc}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/housing">
                <Button size="lg">{t.heroPremium.exploreHousing}</Button>
              </Link>
              <Link href="/services">
                <Button size="lg" variant="outline">{t.heroPremium.findPro}</Button>
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-6 text-xs text-[color:var(--green-600)]">
              <span>✓ {t.heroPremium.badgeSafe}</span>
              <span>✓ {t.heroPremium.badgeLocal}</span>
              <span>✓ {t.heroPremium.badgeSupport}</span>
            </div>
          </div>

          {/* Right card */}
          <Card variant="glass" className="p-5">
            <div className="mb-4 flex rounded-2xl bg-white/80 p-1">
              <button
                onClick={() => setActiveTab('housing')}
                className={`flex-1 rounded-xl px-3 py-2 text-sm font-medium transition-all ${
                  activeTab === 'housing'
                    ? 'bg-[color:var(--green-600)] text-white shadow-[var(--shadow-soft-sm)]'
                    : 'text-[color:var(--green-700)]'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Home className="h-4 w-4" />
                  {t.nav.housing}
                </div>
              </button>
              <button
                onClick={() => setActiveTab('cars')}
                className={`flex-1 rounded-xl px-3 py-2 text-sm font-medium transition-all ${
                  activeTab === 'cars'
                    ? 'bg-[color:var(--green-600)] text-white shadow-[var(--shadow-soft-sm)]'
                    : 'text-[color:var(--green-700)]'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Car className="h-4 w-4" />
                  {t.nav.cars}
                </div>
              </button>
            </div>

            <label className="text-xs font-medium text-[color:var(--green-700)]">
              {t.heroPremium.whereSearch}
            </label>
            <div className="mt-2 flex items-center gap-2 rounded-2xl border border-[color:var(--green-100)] bg-white/80 px-3 py-3">
              <MapPin className="h-4 w-4 text-[color:var(--green-500)]" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Douala, Yaoundé, Kribi..."
                className="w-full bg-transparent text-sm text-[color:var(--green-900)] outline-none"
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {['Douala', 'Yaoundé', 'Kribi'].map((city) => (
                <Link
                  key={city}
                  href={`/housing?city=${city}`}
                  className="rounded-full bg-[color:var(--green-50)] px-3 py-1 text-xs text-[color:var(--green-700)]"
                >
                  {city}
                </Link>
              ))}
            </div>

            <div className="mt-5">
              <Link href={activeTab === 'housing' ? '/housing' : '/cars'}>
                <Button size="lg" className="w-full">
                  <Search className="mr-2 h-4 w-4" />
                  {t.hero.search}
                </Button>
              </Link>
            </div>

            <div className="mt-4 rounded-2xl bg-[color:var(--green-50)] px-4 py-3 text-xs text-[color:var(--green-700)]">
              {t.heroPremium.paymentHint}
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
