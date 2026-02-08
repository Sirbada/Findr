'use client'

import Link from 'next/link'
import { Home, Car, Briefcase, Wrench, ArrowRight } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useTranslation } from '@/lib/i18n/context'

const categories = [
  {
    key: 'housing',
    href: '/housing',
    icon: Home,
    color: 'bg-blue-100 text-blue-600',
    border: 'hover:border-blue-300',
    labelFr: 'Immobilier',
    labelEn: 'Real Estate',
    descFr: 'Appartements, maisons, terrains et locaux commerciaux',
    descEn: 'Apartments, houses, land and commercial spaces',
  },
  {
    key: 'cars',
    href: '/cars',
    icon: Car,
    color: 'bg-green-100 text-green-600',
    border: 'hover:border-green-300',
    labelFr: 'Véhicules',
    labelEn: 'Vehicles',
    descFr: 'Voitures à louer ou à vendre',
    descEn: 'Cars for rent or sale',
  },
  {
    key: 'jobs',
    href: '/annonces',
    icon: Briefcase,
    color: 'bg-yellow-100 text-yellow-600',
    border: 'hover:border-yellow-300',
    labelFr: 'Emplois',
    labelEn: 'Jobs',
    descFr: 'Offres d\'emploi et opportunités',
    descEn: 'Job offers and opportunities',
    comingSoon: true,
  },
  {
    key: 'services',
    href: '/annonces',
    icon: Wrench,
    color: 'bg-red-100 text-red-600',
    border: 'hover:border-red-300',
    labelFr: 'Services',
    labelEn: 'Services',
    descFr: 'Prestation de services et expertise',
    descEn: 'Service providers and expertise',
    comingSoon: true,
  },
]

export default function AnnoncesPage() {
  const { lang } = useTranslation()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {lang === 'fr' ? 'Toutes les annonces' : 'All Listings'}
          </h1>
          <p className="text-gray-600 mb-10">
            {lang === 'fr'
              ? 'Explorez toutes les catégories disponibles sur Findr'
              : 'Browse all categories available on Findr'}
          </p>

          <div className="grid sm:grid-cols-2 gap-6">
            {categories.map((cat) => {
              const Icon = cat.icon
              return (
                <Link
                  key={cat.key}
                  href={cat.comingSoon ? '#' : cat.href}
                  className={`relative block bg-white rounded-2xl border-2 border-gray-100 ${cat.border} p-6 transition-all hover:shadow-lg group`}
                >
                  {cat.comingSoon && (
                    <span className="absolute top-4 right-4 text-xs font-medium bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                      {lang === 'fr' ? 'Bientôt' : 'Coming soon'}
                    </span>
                  )}
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${cat.color}`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1 flex items-center gap-2">
                    {lang === 'fr' ? cat.labelFr : cat.labelEn}
                    {!cat.comingSoon && (
                      <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    )}
                  </h2>
                  <p className="text-gray-500 text-sm">
                    {lang === 'fr' ? cat.descFr : cat.descEn}
                  </p>
                </Link>
              )
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
