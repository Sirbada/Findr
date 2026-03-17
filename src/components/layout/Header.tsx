'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Globe, Home, Car, Wrench, Briefcase, Compass } from 'lucide-react'
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
        <div className="flex justify-between h-[60px]">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#E8630A] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <span className="text-xl font-semibold text-[#111827] tracking-[-0.02em]">Findr</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <div className="flex items-center space-x-8">
              <Link href="/housing" className="flex items-center gap-1.5 text-sm font-medium text-[#4B5563] hover:text-[#111827] transition-colors duration-150">
                <Home className="w-4 h-4" />
                {t.nav.housing}
              </Link>
              <Link href="/cars" className="flex items-center gap-1.5 text-sm font-medium text-[#4B5563] hover:text-[#111827] transition-colors duration-150">
                <Car className="w-4 h-4" />
                {t.nav.cars}
              </Link>
              <Link href="/services" className="flex items-center gap-1.5 text-sm font-medium text-[#4B5563] hover:text-[#111827] transition-colors duration-150">
                <Wrench className="w-4 h-4" />
                Services
              </Link>
              <Link href="/emplois" className="flex items-center gap-1.5 text-sm font-medium text-[#4B5563] hover:text-[#111827] transition-colors duration-150">
                <Briefcase className="w-4 h-4" />
                {t.emplois.name}
              </Link>
              <Link href="/onboarding" className="flex items-center gap-1.5 text-sm font-medium text-[#4B5563] hover:text-[#111827] transition-colors duration-150">
                <Compass className="w-4 h-4" />
                {lang === 'fr' ? 'Commencer' : 'Get Started'}
              </Link>
            </div>
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center space-x-3">
            <DataSaverToggle />

            <button
              onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
              className="flex items-center space-x-1 text-[#4B5563] hover:text-[#111827] transition-colors duration-150"
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
              className="text-[#4B5563] hover:text-[#111827] transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#E5E7EB]">
            <div className="space-y-3">
              <Link href="/housing" className="flex items-center gap-2 text-[#4B5563] hover:text-[#111827] font-medium transition-colors">
                <Home className="w-4 h-4" />
                {t.nav.housing}
              </Link>
              <Link href="/cars" className="flex items-center gap-2 text-[#4B5563] hover:text-[#111827] font-medium transition-colors">
                <Car className="w-4 h-4" />
                {t.nav.cars}
              </Link>
              <Link href="/services" className="flex items-center gap-2 text-[#4B5563] hover:text-[#111827] font-medium transition-colors">
                <Wrench className="w-4 h-4" />
                Services
              </Link>
              <Link href="/emplois" className="flex items-center gap-2 text-[#4B5563] hover:text-[#111827] font-medium transition-colors">
                <Briefcase className="w-4 h-4" />
                {t.emplois.name}
              </Link>
              <Link href="/onboarding" className="flex items-center gap-2 text-[#4B5563] hover:text-[#111827] font-medium transition-colors">
                <Compass className="w-4 h-4" />
                {lang === 'fr' ? 'Commencer' : 'Get Started'}
              </Link>
              <hr className="border-[#E5E7EB] my-3" />
              <button
                onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
                className="flex items-center space-x-2 text-[#4B5563] hover:text-[#111827]"
              >
                <Globe className="w-4 h-4" />
                <span>{lang === 'fr' ? 'English' : 'Fran\u00e7ais'}</span>
              </button>
              <div className="flex space-x-3 pt-2">
                <Link href="/login" className="flex-1">
                  <Button variant="secondary" size="sm" className="w-full">
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
