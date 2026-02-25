'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Linkedin, ArrowRight, Heart } from 'lucide-react'
import Link from 'next/link'

const footerSections = [
  {
    title: 'Marketplace',
    links: [
      { name: 'Publier une annonce', href: '/post' },
      { name: 'Rechercher', href: '/search' },
      { name: 'Immobilier', href: '/category/immobilier' },
      { name: 'Véhicules', href: '/category/vehicules' },
      { name: 'Emplois', href: '/category/emplois' },
      { name: 'Services', href: '/category/services' }
    ]
  },
  {
    title: 'Support',
    links: [
      { name: 'Centre d\'aide', href: '/help' },
      { name: 'Contact', href: '/contact' },
      { name: 'Signaler un problème', href: '/report' },
      { name: 'Guide de sécurité', href: '/safety' },
      { name: 'FAQ', href: '/faq' },
      { name: 'Status', href: '/status' }
    ]
  },
  {
    title: 'Entreprise',
    links: [
      { name: 'À propos', href: '/about' },
      { name: 'Carrières', href: '/careers' },
      { name: 'Presse', href: '/press' },
      { name: 'Partenaires', href: '/partners' },
      { name: 'API', href: '/api' },
      { name: 'Blog', href: '/blog' }
    ]
  },
  {
    title: 'Légal',
    links: [
      { name: 'Conditions d\'utilisation', href: '/terms' },
      { name: 'Politique de confidentialité', href: '/privacy' },
      { name: 'Cookies', href: '/cookies' },
      { name: 'Mentions légales', href: '/legal' },
      { name: 'RGPD', href: '/gdpr' },
      { name: 'Modération', href: '/moderation' }
    ]
  }
]

const cities = [
  'Douala', 'Yaoundé', 'Bafoussam', 'Bamenda', 'Garoua', 
  'Maroua', 'Ngaoundéré', 'Bertoua', 'Ebolowa', 'Kribi'
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email && email.includes('@')) {
      setSubscribed(true)
      setEmail('')
      // Here you would typically send to your newsletter service
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
              📬 Reste informé des meilleures offres
            </h3>
            <p className="text-xl text-blue-100 mb-8">
              Reçois chaque semaine une sélection des nouvelles annonces dans tes catégories préférées.
            </p>
            
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ton adresse email..."
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
                  <>✓ Inscrit !</>
                ) : (
                  <>
                    S'inscrire
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
            
            <p className="text-sm text-blue-200 mt-4">
              🔒 Tes données sont protégées. Désabonnement en 1 clic.
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
                Tout commence ici.
              </div>
            </Link>
            
            <p className="text-gray-300 mb-6 leading-relaxed">
              La marketplace intelligente qui unit particuliers et professionnels 
              dans un écosystème de confiance. Simple, rapide, efficace.
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
            🌍 Findr est disponible dans ces villes
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
              <div className="text-sm text-gray-400">Startup de l'année</div>
              <div className="text-xs text-gray-500">TechCrunch Africa 2026</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mb-2">
                <span className="text-xl">🔒</span>
              </div>
              <div className="text-sm text-gray-400">Certifié SSL</div>
              <div className="text-xs text-gray-500">Sécurité A+</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-2" style={{ backgroundColor: '#F59E0B' }}>
                <span className="text-xl">🚀</span>
              </div>
              <div className="text-sm text-gray-400">Innovation</div>
              <div className="text-xs text-gray-500">Tech de pointe</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mb-2">
                <span className="text-xl">⚡</span>
              </div>
              <div className="text-sm text-gray-400">99.9% Uptime</div>
              <div className="text-xs text-gray-500">Toujours disponible</div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2026 Findr - Une création de{' '}
            <Link href="https://badainc.com" className="text-blue-400 hover:text-blue-300">
              Bada Inc.
            </Link>
            {' '}Tous droits réservés.
          </div>
          
          <div className="flex items-center gap-6 text-sm">
            <Link href="/terms" className="text-gray-400 hover:text-white">
              CGU
            </Link>
            <Link href="/privacy" className="text-gray-400 hover:text-white">
              Confidentialité
            </Link>
            <Link href="/cookies" className="text-gray-400 hover:text-white">
              Cookies
            </Link>
            <div className="text-gray-500">
              v2.1.0
            </div>
          </div>
        </div>

        {/* Made with Love */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
            Fait avec <Heart className="w-4 h-4 text-red-500 fill-current" /> par une équipe passionnée
            {' '}pour simplifier le commerce 🌍
          </p>
        </div>
      </div>
    </footer>
  )
}