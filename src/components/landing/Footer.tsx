'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Linkedin, ArrowRight, Heart } from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from '@/lib/i18n/context'

const cities = [
  'Douala', 'Yaoundé', 'Bafoussam', 'Bamenda', 'Garoua', 
  'Maroua', 'Ngaoundéré', 'Bertoua', 'Ebolowa', 'Kribi'
]

export default function Footer() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const footerSections = [
    {
      title: t.footerExt.sectionMarketplace,
      links: [
        { name: t.footerExt.linkPostAd, href: '/post' },
        { name: t.footerExt.linkSearch, href: '/search' },
        { name: t.categories.housing, href: '/category/immobilier' },
        { name: t.categories.cars, href: '/category/vehicules' },
        { name: t.emplois.name, href: '/category/emplois' },
        { name: t.categoryGrid.servicesName, href: '/category/services' }
      ]
    },
    {
      title: t.footerExt.sectionSupport,
      links: [
        { name: t.footerExt.linkHelpCenter, href: '/help' },
        { name: t.footerExt.linkContact, href: '/contact' },
        { name: t.footerExt.linkReport, href: '/report' },
        { name: t.footerExt.linkSafety, href: '/safety' },
        { name: t.footerExt.linkFaq, href: '/faq' },
        { name: t.footerExt.linkStatus, href: '/status' }
      ]
    },
    {
      title: t.footerExt.sectionCompany,
      links: [
        { name: t.footerExt.linkAbout, href: '/about' },
        { name: t.footerExt.linkCareers, href: '/careers' },
        { name: t.footerExt.linkPress, href: '/press' },
        { name: t.footerExt.linkPartners, href: '/partners' },
        { name: t.footerExt.linkApi, href: '/api' },
        { name: t.footerExt.linkBlog, href: '/blog' }
      ]
    },
    {
      title: t.footerExt.sectionLegal,
      links: [
        { name: t.footerExt.linkTerms, href: '/terms' },
        { name: t.footerExt.linkPrivacy, href: '/privacy' },
        { name: t.footerExt.linkCookies, href: '/cookies' },
        { name: t.footerExt.linkMentions, href: '/legal' },
        { name: t.footerExt.linkGdpr, href: '/gdpr' },
        { name: t.footerExt.linkModeration, href: '/moderation' }
      ]
    }
  ]

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email && email.includes('@')) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  return (
    <footer className="bg-gray-900 text-white">
      
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              {t.footerExt.newsletterTitle}
            </h3>
            <p className="text-xl text-blue-100 mb-8">
              {t.footerExt.newsletterSubtitle}
            </p>
            
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.footerExt.newsletterPlaceholder}
                className="flex-1 px-6 py-4 rounded-xl text-gray-900 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent text-lg"
                required
              />
              <button 
                type="submit"
                disabled={subscribed}
                className="disabled:bg-green-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                style={{ backgroundColor: subscribed ? undefined : '#F59E0B' }}
              >
                {subscribed ? (
                  <>{t.footerExt.subscribed}</>
                ) : (
                  <>
                    {t.footerExt.subscribeBtn}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
            
            <p className="text-sm text-blue-200 mt-4">
              {t.footerExt.privacyNote}
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-6 gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <div className="text-3xl font-bold text-white">
                Findr
              </div>
              <div className="text-blue-400 text-sm">
                {t.footerExt.tagline}
              </div>
            </Link>
            
            <p className="text-gray-300 mb-6 leading-relaxed">
              {t.footerExt.description}
            </p>

            {/* Contact Info */}
            <div className="space-y-3 text-gray-300">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-400" />
                <span>+237 6 XX XX XX XX</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-400" />
                <span>contact@findr.cm</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-blue-400" />
                <span>Douala, Cameroun</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              {[
                { icon: Facebook, href: 'https://facebook.com/findrcm', color: 'hover:text-blue-500' },
                { icon: Instagram, href: 'https://instagram.com/findrcm', color: 'hover:text-pink-500' },
                { icon: Twitter, href: 'https://twitter.com/findrcm', color: 'hover:text-blue-400' },
                { icon: Linkedin, href: 'https://linkedin.com/company/findrcm', color: 'hover:text-blue-600' }
              ].map((social, index) => {
                const IconComponent = social.icon
                return (
                  <a 
                    key={index}
                    href={social.href} 
                    className={`text-gray-400 ${social.color} transition-colors p-2 bg-gray-800 rounded-lg hover:bg-gray-700`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <IconComponent className="w-5 h-5" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Footer Links */}
          <div className="lg:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-8">
            {footerSections.map((section, index) => (
              <div key={index}>
                <h4 className="font-semibold text-white mb-4 text-lg">
                  {section.title}
                </h4>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link 
                        href={link.href}
                        className="text-gray-400 hover:text-white transition-colors text-sm leading-relaxed"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Cities Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <h4 className="font-semibold text-white mb-6 text-center">
            {t.footerExt.citiesTitle}
          </h4>
          <div className="flex flex-wrap justify-center gap-4">
            {cities.map((city, index) => (
              <Link 
                key={index}
                href={`/city/${city.toLowerCase()}`}
                className="bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                {city}
              </Link>
            ))}
          </div>
        </div>

        {/* Awards & Certifications */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-2">
                <span className="text-xl">🏆</span>
              </div>
              <div className="text-sm text-gray-400">{t.footerExt.startupAward}</div>
              <div className="text-xs text-gray-500">{t.footerExt.startupAwardSub}</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mb-2">
                <span className="text-xl">🔒</span>
              </div>
              <div className="text-sm text-gray-400">{t.footerExt.sslCert}</div>
              <div className="text-xs text-gray-500">{t.footerExt.sslCertSub}</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-2" style={{ backgroundColor: '#F59E0B' }}>
                <span className="text-xl">🚀</span>
              </div>
              <div className="text-sm text-gray-400">{t.footerExt.innovation}</div>
              <div className="text-xs text-gray-500">{t.footerExt.innovationSub}</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mb-2">
                <span className="text-xl">⚡</span>
              </div>
              <div className="text-sm text-gray-400">{t.footerExt.uptime}</div>
              <div className="text-xs text-gray-500">{t.footerExt.uptimeSub}</div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            {t.footer.copyright}{' '}
            <Link href="https://badainc.com" className="text-blue-400 hover:text-blue-300">
              Bada Inc.
            </Link>
          </div>
          
          <div className="flex items-center gap-6 text-sm">
            <Link href="/terms" className="text-gray-400 hover:text-white">
              {t.footerExt.linkTerms}
            </Link>
            <Link href="/privacy" className="text-gray-400 hover:text-white">
              {t.footer.privacy}
            </Link>
            <Link href="/cookies" className="text-gray-400 hover:text-white">
              {t.footerExt.linkCookies}
            </Link>
            <div className="text-gray-500">
              v2.1.0
            </div>
          </div>
        </div>

        {/* Made with Love */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
            {t.footerExt.madeWith} <Heart className="w-4 h-4 text-red-500 fill-current" /> {t.footerExt.byTeam}
          </p>
        </div>
      </div>
    </footer>
  )
}
