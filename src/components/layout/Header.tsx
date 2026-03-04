'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Globe } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'
import { Button } from '@/components/ui/Button'
import { DataSaverToggle } from '@/components/ui/DataSaverToggle'
import { GlassHeader } from '@/components/ui/GlassHeader'

export function Header() {
  const { t, lang, setLang } = useTranslation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <GlassHeader className="z-50">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[color:var(--green-600)] rounded-xl flex items-center justify-center shadow-[var(--shadow-soft-sm)]">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <span className="text-xl font-bold text-[color:var(--green-900)]">Findr</span>
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <div className="flex items-center space-x-8">
              <Link href="/housing" className="text-[color:var(--green-700)] hover:text-[color:var(--green-900)] font-medium transition-colors">
                🏠 {t.nav.housing}
              </Link>
              <Link href="/cars" className="text-[color:var(--green-700)] hover:text-[color:var(--green-900)] font-medium transition-colors">
                🚗 {t.nav.cars}
              </Link>
              <Link href="/services" className="text-[color:var(--green-700)] hover:text-[color:var(--green-900)] font-medium transition-colors">
                🧰 Services
              </Link>
              <Link href="/emplois" className="text-[color:var(--green-700)] hover:text-[color:var(--green-900)] font-medium transition-colors">
                💼 {t.emplois.name}
              </Link>
              <Link href="/onboarding" className="text-[color:var(--green-700)] hover:text-[color:var(--green-900)] font-medium transition-colors">
                ✨ Démarrer
              </Link>
            </div>
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center space-x-4">
            <DataSaverToggle />

            <button
              onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
              className="flex items-center space-x-1 text-[color:var(--green-700)] hover:text-[color:var(--green-900)]"
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium">{lang.toUpperCase()}</span>
            </button>

            <Link href="/login">
              <Button variant="ghost" size="sm">
                {t.nav.login}
              </Button>
            </Link>
            <Link href="/dashboard/new">
              <Button size="sm">
                {t.nav.postAd}
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-[color:var(--green-700)] hover:text-[color:var(--green-900)]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/60">
            <div className="space-y-3">
              <Link href="/housing" className="block text-[color:var(--green-700)] hover:text-[color:var(--green-900)] font-medium">
                {t.nav.housing}
              </Link>
              <Link href="/cars" className="block text-[color:var(--green-700)] hover:text-[color:var(--green-900)] font-medium">
                {t.nav.cars}
              </Link>
              <Link href="/services" className="block text-[color:var(--green-700)] hover:text-[color:var(--green-900)] font-medium">
                Services
              </Link>
              <Link href="/emplois" className="block text-[color:var(--green-700)] hover:text-[color:var(--green-900)] font-medium">
                💼 {t.emplois.name}
              </Link>
              <Link href="/onboarding" className="block text-[color:var(--green-700)] hover:text-[color:var(--green-900)] font-medium">
                Démarrer
              </Link>
              <hr className="my-3" />
              <button
                onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
                className="flex items-center space-x-2 text-[color:var(--green-700)]"
              >
                <Globe className="w-4 h-4" />
                <span>{lang === 'fr' ? 'English' : 'Français'}</span>
              </button>
              <div className="flex space-x-3 pt-2">
                <Link href="/login" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    {t.nav.login}
                  </Button>
                </Link>
                <Link href="/dashboard/new" className="flex-1">
                  <Button size="sm" className="w-full">
                    {t.nav.postAd}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </GlassHeader>
  )
}
