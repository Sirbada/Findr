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
        { href: '/cars', label: lang === 'fr' ? 'Véhicules' : 'Vehicles' },
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
        { href: '/mentions-legales', label: lang === 'fr' ? 'Mentions légales' : 'Legal' },
      ],
    },
  ]

  return (
    <footer className="bg-[#f5f5f7] border-t border-black/[0.06]">
      <div className="max-w-[1200px] mx-auto px-6 py-16">
        {/* Top row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-[#059669] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="font-semibold text-[15px] text-[#1d1d1f] tracking-[-0.02em]">Findr</span>
            </Link>
            <p className="text-[13px] text-[#6e6e73] leading-relaxed max-w-[200px]">
              {lang === 'fr'
                ? 'La plateforme de référence pour trouver tout au Cameroun.'
                : 'The go-to platform to find everything in Cameroon.'}
            </p>
          </div>

          {/* Nav columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-[12px] font-semibold text-[#1d1d1f] tracking-[0.04em] uppercase mb-4">
                {col.title}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-[#6e6e73] hover:text-[#1d1d1f] transition-colors"
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
        <div className="pt-8 border-t border-black/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-[#86868b]">
            Copyright © {new Date().getFullYear()} Findr.{' '}
            {lang === 'fr' ? 'Tous droits réservés.' : 'All rights reserved.'}
          </p>
          <div className="flex items-center gap-4">
            <span className="text-[12px] text-[#86868b]">
              {lang === 'fr' ? 'Fait avec ❤️ pour le Cameroun' : 'Made with ❤️ for Cameroon'}
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
