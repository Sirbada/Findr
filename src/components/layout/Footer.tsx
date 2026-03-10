'use client'

import Link from 'next/link'
import { useTranslation } from '@/lib/i18n/context'

export function Footer() {
  const { lang } = useTranslation()

  const columns = [
    {
      title: lang === 'fr' ? 'Explorer' : 'Explore',
      links: [
        { href: '/housing', label: lang === 'fr' ? 'Immobilier' : 'Housing' },
        { href: '/cars', label: lang === 'fr' ? 'V\u00e9hicules' : 'Vehicles' },
        { href: '/terrain', label: lang === 'fr' ? 'Terrain' : 'Land' },
        { href: '/emplois', label: lang === 'fr' ? 'Emplois' : 'Jobs' },
        { href: '/services', label: 'Services' },
      ],
    },
    {
      title: lang === 'fr' ? 'Compte' : 'Account',
      links: [
        { href: '/login', label: lang === 'fr' ? 'Connexion' : 'Sign in' },
        { href: '/signup', label: lang === 'fr' ? 'Inscription' : 'Sign up' },
        { href: '/dashboard', label: lang === 'fr' ? 'Tableau de bord' : 'Dashboard' },
        { href: '/dashboard/new', label: lang === 'fr' ? 'Publier une annonce' : 'Post a listing' },
        { href: '/pro', label: lang === 'fr' ? 'Passer Pro' : 'Go Pro' },
      ],
    },
    {
      title: lang === 'fr' ? 'Aide' : 'Help',
      links: [
        { href: '/faq', label: 'FAQ' },
        { href: '/cgu', label: lang === 'fr' ? 'Conditions d\'utilisation' : 'Terms of use' },
        { href: '/mentions-legales', label: lang === 'fr' ? 'Mentions l\u00e9gales' : 'Legal' },
      ],
    },
  ]

  return (
    <footer className="bg-[#1A1A2E]">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Top row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center">
                <span className="text-[#1A1A2E] font-bold text-sm">F</span>
              </div>
              <span className="font-semibold text-[15px] text-white tracking-[-0.02em]">Findr</span>
            </Link>
            <p className="text-[13px] text-white/50 leading-relaxed max-w-[200px]">
              {lang === 'fr'
                ? 'La plateforme de r\u00e9f\u00e9rence pour trouver tout au Cameroun.'
                : 'The go-to platform to find everything in Cameroon.'}
            </p>
          </div>

          {/* Nav columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-[12px] font-semibold text-white/80 tracking-[0.08em] uppercase mb-4">
                {col.title}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-white/50 hover:text-white transition-colors duration-150"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-white/40">
            Copyright \u00a9 {new Date().getFullYear()} Findr.{' '}
            {lang === 'fr' ? 'Tous droits r\u00e9serv\u00e9s.' : 'All rights reserved.'}
          </p>
          <div className="flex items-center gap-4">
            <span className="text-[12px] text-white/40">
              {lang === 'fr' ? 'Fait pour le Cameroun' : 'Made for Cameroon'}
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
