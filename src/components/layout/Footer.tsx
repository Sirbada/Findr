'use client'

import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Findr */}
          <div>
            <Link href="/" className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="text-2xl font-bold">Findr</span>
            </Link>
            <p className="text-gray-300 leading-relaxed">
              Le marketplace du Cameroun
            </p>
          </div>

          {/* Catégories */}
          <div>
            <h3 className="font-semibold text-white mb-4">Catégories</h3>
            <ul className="space-y-3 text-gray-300">
              <li><Link href="/housing" className="hover:text-white transition-colors">Logement</Link></li>
              <li><Link href="/cars" className="hover:text-white transition-colors">Véhicules</Link></li>
              <li><Link href="/terrain" className="hover:text-white transition-colors">Terrains</Link></li>
              <li><Link href="/annonces" className="hover:text-white transition-colors">Annonces</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">Contact</h3>
            <ul className="space-y-3 text-gray-300">
              <li><Link href="/contact" className="hover:text-white transition-colors">Nous contacter</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Conditions</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Confidentialité</Link></li>
            </ul>
            
            {/* Social Links */}
            <div className="flex space-x-4 mt-6">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                <span className="text-blue-500 font-bold text-sm">f</span>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                <span className="text-pink-500 font-bold text-sm">ig</span>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                <span className="text-green-500 font-bold text-sm">wa</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2026 Findr. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  )
}
