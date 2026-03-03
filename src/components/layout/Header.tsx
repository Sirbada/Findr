'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, Menu, X, ChevronDown } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

export function Header() {
  const { lang, setLang } = useTranslation()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const nav = [
    { href: '/housing', label: lang === 'fr' ? 'Immobilier' : 'Housing' },
    { href: '/cars', label: lang === 'fr' ? 'Véhicules' : 'Vehicles' },
    { href: '/terrain', label: lang === 'fr' ? 'Terrain' : 'Land' },
    { href: '/emplois', label: lang === 'fr' ? 'Emplois' : 'Jobs' },
    { href: '/services', label: 'Services' },
  ]

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/80 backdrop-blur-xl border-b border-black/[0.06] shadow-sm'
            : 'bg-white/60 backdrop-blur-xl border-b border-transparent'
        }`}
        style={{ WebkitBackdropFilter: 'saturate(180%) blur(20px)' }}
      >
        <div className="max-w-[1200px] mx-auto px-6 h-[52px] flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-[#1d1d1f] hover:opacity-70 transition-opacity"
          >
            <div className="w-7 h-7 bg-[#059669] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm tracking-tight">F</span>
            </div>
            <span className="font-semibold text-[15px] tracking-[-0.02em]">Findr</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 text-[13px] font-medium tracking-[-0.01em] rounded-full transition-all duration-200 ${
                  pathname?.startsWith(item.href)
                    ? 'text-[#059669] bg-[#059669]/8'
                    : 'text-[#1d1d1f]/80 hover:text-[#1d1d1f] hover:bg-black/[0.04]'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Language toggle */}
            <button
              onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
              className="hidden md:flex items-center gap-1 px-2.5 py-1.5 text-[13px] font-medium text-[#1d1d1f]/70 hover:text-[#1d1d1f] hover:bg-black/[0.04] rounded-full transition-all"
            >
              {lang === 'fr' ? 'EN' : 'FR'}
            </button>

            {/* Login */}
            <Link
              href="/login"
              className="hidden md:flex items-center px-3 py-1.5 text-[13px] font-medium text-[#1d1d1f]/80 hover:text-[#1d1d1f] hover:bg-black/[0.04] rounded-full transition-all"
            >
              {lang === 'fr' ? 'Connexion' : 'Sign in'}
            </Link>

            {/* CTA */}
            <Link
              href="/dashboard/new"
              className="flex items-center px-4 py-1.5 bg-[#059669] text-white text-[13px] font-medium tracking-[-0.01em] rounded-full hover:bg-[#047857] transition-all duration-200 shadow-sm hover:shadow-md"
            >
              {lang === 'fr' ? 'Publier' : 'Post'}
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-[#1d1d1f]/70 hover:text-[#1d1d1f] hover:bg-black/[0.04] rounded-full transition-all"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-white/95 backdrop-blur-xl pt-[52px]"
          style={{ WebkitBackdropFilter: 'blur(20px)' }}
        >
          <nav className="flex flex-col p-6 gap-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-3 text-[17px] font-medium tracking-[-0.02em] rounded-xl transition-all ${
                  pathname?.startsWith(item.href)
                    ? 'text-[#059669] bg-[#059669]/8'
                    : 'text-[#1d1d1f] hover:bg-black/[0.04]'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-4 pt-4 border-t border-black/[0.06] flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 text-[17px] font-medium text-[#1d1d1f] hover:bg-black/[0.04] rounded-xl transition-all"
              >
                {lang === 'fr' ? 'Connexion' : 'Sign in'}
              </Link>
              <Link
                href="/dashboard/new"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 bg-[#059669] text-white text-[17px] font-medium rounded-xl text-center hover:bg-[#047857] transition-all"
              >
                {lang === 'fr' ? 'Publier une annonce' : 'Post a listing'}
              </Link>
              <button
                onClick={() => { setLang(lang === 'fr' ? 'en' : 'fr'); setMobileOpen(false) }}
                className="px-4 py-3 text-[17px] font-medium text-[#6e6e73] hover:bg-black/[0.04] rounded-xl transition-all text-left"
              >
                {lang === 'fr' ? 'Switch to English' : 'Passer en Français'}
              </button>
            </div>
          </nav>
        </div>
      )}

      {/* Spacer for fixed header */}
      <div className="h-[52px]" />
    </>
  )
}
