'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { MapPin, ArrowRight, Home, Car, Briefcase, Wrench } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

interface DemoListing {
  id: string
  title: string
  price: number
  pricePerDay?: number
  city: string
  neighborhood?: string
  images: string[]
  category: string
}

// Demo fallback data
const demoHousingListings: DemoListing[] = [
  {
    id: '1',
    title: 'Appartement 3 pièces - Bonanjo',
    price: 180000,
    city: 'Douala',
    neighborhood: 'Bonanjo',
    images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop'],
    category: 'housing'
  },
  {
    id: '2',
    title: 'Studio moderne - Bastos',
    price: 85000,
    city: 'Yaoundé',
    neighborhood: 'Bastos',
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop'],
    category: 'housing'
  },
  {
    id: '3',
    title: 'Villa avec piscine - Bonapriso',
    price: 750000,
    city: 'Douala',
    neighborhood: 'Bonapriso',
    images: ['https://images.unsplash.com/photo-1613977257363-707ba9348227?w=400&h=300&fit=crop'],
    category: 'housing'
  },
  {
    id: '4',
    title: 'Maison familiale - New Bell',
    price: 120000,
    city: 'Douala',
    neighborhood: 'New Bell',
    images: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop'],
    category: 'housing'
  }
]

const demoCarListings: DemoListing[] = [
  {
    id: '5',
    title: 'Toyota Corolla 2022',
    price: 0,
    pricePerDay: 25000,
    city: 'Douala',
    neighborhood: 'Akwa',
    images: ['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=300&fit=crop'],
    category: 'cars'
  },
  {
    id: '6',
    title: 'Mercedes Classe C 2020',
    price: 18500000,
    city: 'Yaoundé',
    neighborhood: 'Bastos',
    images: ['https://images.unsplash.com/photo-1563694983011-6f4d90358083?w=400&h=300&fit=crop'],
    category: 'cars'
  },
  {
    id: '7',
    title: 'Toyota Hilux 4x4',
    price: 22000000,
    city: 'Douala',
    neighborhood: 'Bonapriso',
    images: ['https://images.unsplash.com/photo-1551830820-330a71b2dac0?w=400&h=300&fit=crop'],
    category: 'cars'
  },
  {
    id: '8',
    title: 'Honda Civic 2019',
    price: 0,
    pricePerDay: 30000,
    city: 'Yaoundé',
    neighborhood: 'Centre',
    images: ['https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop'],
    category: 'cars'
  }
]

const demoJobListings: DemoListing[] = [
  {
    id: '9',
    title: 'Développeur Full Stack',
    price: 450000,
    city: 'Douala',
    images: ['https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop'],
    category: 'jobs'
  },
  {
    id: '10',
    title: 'Comptable Expérimenté',
    price: 250000,
    city: 'Yaoundé',
    images: ['https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop'],
    category: 'jobs'
  }
]

const demoServiceListings: DemoListing[] = [
  {
    id: '11',
    title: 'Plombier Professionnel',
    price: 15000,
    city: 'Douala',
    images: ['https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=300&fit=crop'],
    category: 'services'
  },
  {
    id: '12',
    title: 'Électricien Agréé',
    price: 20000,
    city: 'Yaoundé',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'],
    category: 'services'
  }
]

function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR').format(price)
}

function CategorySection({ 
  title, 
  icon: IconComponent, 
  listings, 
  href, 
  color,
  bgColor,
  index 
}: {
  title: string
  icon: any
  listings: DemoListing[]
  href: string
  color: string
  bgColor: string
  index: number
}) {
  const { lang } = useTranslation()

  return (
    <div className={`animate-slide-up`} style={{ animationDelay: `${index * 0.2}s` }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 ${bgColor} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
            <IconComponent className={`w-6 h-6 ${color}`} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {title}
            </h2>
            <p className="text-gray-600">
              {lang === 'fr' ? 'Découvrez nos annonces' : 'Discover our listings'}
            </p>
          </div>
        </div>
        <Link 
          href={href}
          className={`group flex items-center gap-2 ${color} hover:${color.replace('600', '700')} font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-all`}
        >
          {lang === 'fr' ? 'Voir tout' : 'View all'}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {listings.map((listing, listingIndex) => (
          <Link
            key={listing.id}
            href={`/${listing.category}/${listing.id}`}
            className={`group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover-lift animate-scale-in`}
            style={{ animationDelay: `${index * 0.2 + listingIndex * 0.1}s` }}
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={listing.images[0]}
                alt={listing.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <div className="text-white text-lg font-bold mb-1">
                  {listing.pricePerDay 
                    ? `${formatPrice(listing.pricePerDay)} XAF/jour`
                    : listing.category === 'jobs'
                    ? `${formatPrice(listing.price)} XAF/mois`
                    : listing.category === 'services'
                    ? `À partir de ${formatPrice(listing.price)} XAF`
                    : `${formatPrice(listing.price)} XAF/mois`
                  }
                </div>
              </div>
              <div className="absolute top-3 right-3">
                <div className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                  ✨ Vérifié
                </div>
              </div>
            </div>
            <div className="p-4">
              <h3 className={`font-semibold text-gray-900 text-sm mb-2 line-clamp-2 group-hover:${color} transition-colors`}>
                {listing.title}
              </h3>
              <div className="flex items-center text-gray-500 text-xs">
                <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                <span className="truncate">
                  {listing.neighborhood ? `${listing.neighborhood}, ` : ''}{listing.city}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export function CategoriesEnhanced() {
  const { lang } = useTranslation()

  const categories = [
    {
      title: lang === 'fr' ? 'Immobilier' : 'Real Estate',
      icon: Home,
      listings: demoHousingListings,
      href: '/housing',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100'
    },
    {
      title: lang === 'fr' ? 'Véhicules' : 'Vehicles',
      icon: Car,
      listings: demoCarListings,
      href: '/cars',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: lang === 'fr' ? 'Emplois' : 'Jobs',
      icon: Briefcase,
      listings: demoJobListings,
      href: '/jobs',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Services',
      icon: Wrench,
      listings: demoServiceListings,
      href: '/services',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {lang === 'fr' ? 'Explorez nos catégories' : 'Explore our categories'}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {lang === 'fr' 
              ? 'Trouvez exactement ce que vous cherchez dans nos différentes catégories'
              : 'Find exactly what you\'re looking for in our different categories'
            }
          </p>
        </div>

        {/* Categories */}
        <div className="space-y-16">
          {categories.map((category, index) => (
            <CategorySection
              key={category.title}
              title={category.title}
              icon={category.icon}
              listings={category.listings}
              href={category.href}
              color={category.color}
              bgColor={category.bgColor}
              index={index}
            />
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-16 animate-slide-up" style={{ animationDelay: '0.8s' }}>
          <div className="inline-flex flex-col items-center space-y-4 bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900">
              {lang === 'fr' ? 'Vous ne trouvez pas ce que vous cherchez ?' : 'Can\'t find what you\'re looking for?'}
            </h3>
            <p className="text-gray-600 max-w-md">
              {lang === 'fr' 
                ? 'Publiez votre annonce gratuitement et touchez des milliers d\'acheteurs potentiels'
                : 'Post your ad for free and reach thousands of potential buyers'
              }
            </p>
            <Link
              href="/publish"
              className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
            >
              {lang === 'fr' ? 'Publier une annonce' : 'Post an ad'}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}