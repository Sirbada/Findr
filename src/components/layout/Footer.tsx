'use client'

import Link from 'next/link'
import { useTranslation } from '@/lib/i18n/context'

export function Footer() {
  const { t, lang } = useTranslation()

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <span className="text-xl font-bold text-white">Findr</span>
            </Link>
            <p className="text-sm text-gray-400">
              {lang === 'fr' 
                ? 'La plateforme tout-en-un pour le Cameroun.'
                : 'The all-in-one platform for Cameroon.'}
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-white mb-4">
              {lang === 'fr' ? 'Catégories' : 'Categories'}
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/housing" className="hover:text-white">{t.nav.housing}</Link></li>
              <li><Link href="/cars" className="hover:text-white">{t.nav.cars}</Link></li>
            </ul>
          </div>

          {/* Cities */}
          <div>
            <h4 className="font-semibold text-white mb-4">
              {lang === 'fr' ? 'Villes' : 'Cities'}
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/housing?city=douala" className="hover:text-white">{t.cities.douala}</Link></li>
              <li><Link href="/housing?city=yaounde" className="hover:text-white">{t.cities.yaounde}</Link></li>
              <li><Link href="/housing?city=bafoussam" className="hover:text-white">{t.cities.bafoussam}</Link></li>
            </ul>
          </div>

          {/* Pro / Partner */}
          <div>
            <h4 className="font-semibold text-white mb-4">
              {lang === 'fr' ? 'Collaborer' : 'Partner with us'}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/pro" className="hover:text-white flex items-center gap-1">
                  <span className="text-blue-400">→</span>
                  {lang === 'fr' ? 'Findr Pro' : 'Findr Pro'}
                </Link>
              </li>
              <li><Link href="/pro#plans" className="hover:text-white">{lang === 'fr' ? 'Tarifs Pro' : 'Pro Pricing'}</Link></li>
              <li><Link href="/pro#contact" className="hover:text-white">{lang === 'fr' ? 'Devenir partenaire' : 'Become a partner'}</Link></li>
            </ul>
          </div>
        </div>

        {/* Second row for legal */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-8 pt-8 border-t border-gray-800">
          <div className="col-span-2 md:col-span-4">
            <div className="flex flex-wrap gap-6 text-sm justify-center">
              <Link href="/faq" className="hover:text-white font-medium">FAQ</Link>
              <Link href="/about" className="hover:text-white">{t.footer.about}</Link>
              <Link href="/contact" className="hover:text-white">{t.footer.contact}</Link>
              <Link href="/terms" className="hover:text-white">{t.footer.terms}</Link>
              <Link href="/privacy" className="hover:text-white">{t.footer.privacy}</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-8 text-center text-sm">
          <p>{t.footer.copyright}</p>
        </div>
      </div>
    </footer>
  )
}
