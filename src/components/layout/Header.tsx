'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

const NAV_ITEMS = [
  { href: '/housing', labelFr: 'Immobilier', labelEn: 'Housing', color: '#059669', bg: '#ecfdf5' },
  { href: '/cars', labelFr: 'Véhicules', labelEn: 'Vehicles', color: '#0ea5e9', bg: '#f0f9ff' },
  { href: '/terrain', labelFr: 'Terrain', labelEn: 'Land', color: '#d97706', bg: '#fffbeb' },
  { href: '/emplois', labelFr: 'Emplois', labelEn: 'Jobs', color: '#8b5cf6', bg: '#f5f3ff' },
  { href: '/services', labelFr: 'Services', labelEn: 'Services', color: '#f43f5e', bg: '#fff1f2' },
]

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

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled
            ? 'rgba(250, 250, 249, 0.88)'
            : 'rgba(250, 250, 249, 0.70)',
          backdropFilter: 'saturate(180%) blur(20px)',
          WebkitBackdropFilter: 'saturate(180%) blur(20px)',
          borderBottom: scrolled ? '1px solid rgba(0,0,0,0.06)' : '1px solid transparent',
          boxShadow: scrolled ? '0 1px 12px rgba(0,0,0,0.04)' : 'none',
        }}
      >
        <div className="max-w-[1200px] mx-auto px-6 h-[56px] flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #059669, #10b981)' }}
            >
              <span className="text-white font-bold text-[15px]">F</span>
            </div>
            <span
              className="font-bold text-[16px]"
              style={{ color: '#1a1a1a', letterSpacing: '-0.03em' }}
            >
              Findr
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname?.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3 py-1.5 text-[13px] font-semibold rounded-full transition-all duration-200"
                  style={
                    isActive
                      ? {
                          background: item.bg,
                          color: item.color,
                        }
                      : {
                          color: '#4b5563',
                        }
                  }
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = item.bg
                      e.currentTarget.style.color = item.color
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.color = '#4b5563'
                    }
                  }}
                >
                  {lang === 'fr' ? item.labelFr : item.labelEn}
                </Link>
              )
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Language */}
            <button
              onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
              className="hidden md:flex items-center px-2.5 py-1.5 text-[12px] font-bold rounded-full transition-all"
              style={{ color: '#6b7280', background: '#f5f5f0' }}
            >
              {lang === 'fr' ? 'EN' : 'FR'}
            </button>

            {/* Login */}
            <Link
              href="/login"
              className="hidden md:flex items-center px-3 py-1.5 text-[13px] font-semibold rounded-full transition-all"
              style={{ color: '#4b5563' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#f5f5f0' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
            >
              {lang === 'fr' ? 'Connexion' : 'Sign in'}
            </Link>

            {/* CTA — gradient green */}
            <Link
              href="/dashboard/new"
              className="flex items-center px-4 py-2 text-white text-[13px] font-bold rounded-full transition-all duration-200"
              style={{
                background: 'linear-gradient(135deg, #059669, #10b981)',
                boxShadow: '0 2px 12px rgba(5, 150, 105, 0.35)',
                letterSpacing: '-0.01em',
              }}
            >
              {lang === 'fr' ? '+ Publier' : '+ Post'}
            </Link>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-full transition-all"
              style={{ color: '#4b5563', background: mobileOpen ? '#f5f5f0' : 'transparent' }}
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
          className="fixed inset-0 z-40 pt-[56px]"
          style={{
            background: 'rgba(250, 250, 249, 0.97)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          <nav className="flex flex-col p-5 gap-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-[16px] font-semibold transition-all"
                style={{
                  background: pathname?.startsWith(item.href) ? item.bg : 'transparent',
                  color: pathname?.startsWith(item.href) ? item.color : '#1a1a1a',
                }}
              >
                {lang === 'fr' ? item.labelFr : item.labelEn}
              </Link>
            ))}
            <div className="mt-3 pt-3 border-t border-black/[0.06] flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3.5 text-[16px] font-semibold text-[#1a1a1a] rounded-2xl"
                style={{ background: '#f5f5f0' }}
              >
                {lang === 'fr' ? 'Connexion' : 'Sign in'}
              </Link>
              <Link
                href="/dashboard/new"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3.5 text-white text-[16px] font-bold rounded-2xl text-center"
                style={{ background: 'linear-gradient(135deg, #059669, #10b981)' }}
              >
                {lang === 'fr' ? '+ Publier une annonce' : '+ Post a listing'}
              </Link>
              <button
                onClick={() => { setLang(lang === 'fr' ? 'en' : 'fr'); setMobileOpen(false) }}
                className="px-4 py-3 text-[14px] font-medium text-[#6b7280] text-left"
              >
                {lang === 'fr' ? 'Switch to English' : 'Passer en Français'}
              </button>
            </div>
          </nav>
        </div>
      )}

      {/* Spacer */}
      <div className="h-[56px]" />
    </>
  )
}
