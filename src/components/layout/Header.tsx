'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Globe } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'
import { Button } from '@/components/ui/Button'
import { DataSaverToggle } from '@/components/ui/DataSaverToggle'

export function Header() {
  const { t, lang, setLang } = useTranslation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Findr</span>
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <div className="flex items-center space-x-8">
              <Link href="/housing" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                🏠 Immobilier
              </Link>
              <Link href="/cars" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                🚗 Véhicules
              </Link>
              <Link href="/terrain" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                🏗️ Terrain
              </Link>
              <Link href="/annonces" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                📋 Annonces
              </Link>
            </div>
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Data Saver Toggle */}
            <DataSaverToggle />

            {/* Language toggle */}
            <button
              onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
              className="flex items-center space-x-1 text-gray-600 hover:text-blue-600"
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
              className="text-gray-600 hover:text-gray-900"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="space-y-3">
              <Link href="/housing" className="block text-gray-600 hover:text-blue-600 font-medium" onClick={() => setMobileMenuOpen(false)}>
                🏠 Immobilier
              </Link>
              <Link href="/cars" className="block text-gray-600 hover:text-blue-600 font-medium" onClick={() => setMobileMenuOpen(false)}>
                🚗 Véhicules
              </Link>
              <Link href="/terrain" className="block text-gray-600 hover:text-blue-600 font-medium" onClick={() => setMobileMenuOpen(false)}>
                🏗️ Terrain
              </Link>
              <Link href="/annonces" className="block text-gray-600 hover:text-blue-600 font-medium" onClick={() => setMobileMenuOpen(false)}>
                📋 Annonces
              </Link>
              <hr className="my-3" />
              <button
                onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
                className="flex items-center space-x-2 text-gray-600"
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
    </header>
  )
}
