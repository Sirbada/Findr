'use client'

import { Home, Car, Briefcase, Wrench, TreePine, ShoppingBag } from 'lucide-react'
import Link from 'next/link'

const categories = [
  {
    id: 'immobilier',
    name: 'Immobilier',
    icon: Home,
    count: 2340,
    description: 'Appartements, maisons, bureaux',
    gradient: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
    textColor: 'text-blue-800'
  },
  {
    id: 'vehicules',
    name: 'Véhicules',
    icon: Car,
    count: 1856,
    description: 'Voitures, motos, camions',
    gradient: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50',
    iconColor: 'text-green-600',
    textColor: 'text-green-800'
  },
  {
    id: 'emplois',
    name: 'Emplois',
    icon: Briefcase,
    count: 967,
    description: 'CDI, CDD, stages, freelance',
    gradient: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600',
    textColor: 'text-purple-800'
  },
  {
    id: 'services',
    name: 'Services',
    icon: Wrench,
    count: 1234,
    description: 'Plomberie, électricité, ménage',
    gradient: 'from-yellow-500 to-yellow-600',
    bgColor: 'bg-yellow-50',
    iconColor: 'text-yellow-600',
    textColor: 'text-yellow-800'
  },
  {
    id: 'terrain',
    name: 'Terrain',
    icon: TreePine,
    count: 456,
    description: 'Parcelles, terrains agricoles',
    gradient: 'from-emerald-500 to-emerald-600',
    bgColor: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    textColor: 'text-emerald-800'
  },
  {
    id: 'autres',
    name: 'Autres',
    icon: ShoppingBag,
    count: 789,
    description: 'Mode, électronique, loisirs',
    gradient: 'from-pink-500 to-pink-600',
    bgColor: 'bg-pink-50',
    iconColor: 'text-pink-600',
    textColor: 'text-pink-800'
  }
]

export default function CategoryGrid() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Explore par catégorie
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Plus de 8,000 annonces dans toutes les catégories. 
            Trouve exactement ce dont tu as besoin.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {categories.map((category) => {
            const IconComponent = category.icon
            return (
              <Link 
                key={category.id}
                href={`/category/${category.id}`}
                className="group"
              >
                <div className={`${category.bgColor} rounded-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer border border-gray-100`}>
                  
                  {/* Icon Container */}
                  <div className="relative mb-4">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    
                    {/* Count Badge */}
                    <div className="absolute -top-2 -right-2 bg-white rounded-full px-2 py-1 shadow-md border">
                      <span className={`text-sm font-bold ${category.textColor}`}>
                        {category.count.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <h3 className={`text-lg font-bold ${category.textColor} group-hover:text-opacity-80 transition-colors`}>
                      {category.name}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {category.description}
                    </p>
                  </div>

                  {/* View All Link */}
                  <div className="mt-4 flex items-center justify-between">
                    <span className={`text-sm font-medium ${category.iconColor} group-hover:underline`}>
                      Voir tout →
                    </span>
                    <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:shadow-md transition-shadow">
                      <svg className={`w-4 h-4 ${category.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md mx-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Tu ne trouves pas ta catégorie ?
            </h3>
            <p className="text-gray-600 mb-4 text-sm">
              Publie ton annonce dans "Autres" ou contacte-nous pour ajouter une nouvelle catégorie.
            </p>
            <Link 
              href="/post"
              className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Publier une annonce
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-1">95%</div>
            <div className="text-gray-600 text-sm">Annonces vérifiées</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-green-600 mb-1">24h</div>
            <div className="text-gray-600 text-sm">Temps de réponse moyen</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-yellow-600 mb-1">4.8</div>
            <div className="text-gray-600 text-sm">Note moyenne</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-purple-600 mb-1">100%</div>
            <div className="text-gray-600 text-sm">Gratuit pour particuliers</div>
          </div>
        </div>
      </div>
    </section>
  )
}