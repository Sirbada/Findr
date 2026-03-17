'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { MapPin, ArrowRight, Home, Car, Briefcase, Wrench, BadgeCheck } from 'lucide-react'
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
  subtitle,
  icon: IconComponent,
  listings,
  href,
  viewAllLabel,
  perDaySuffix,
  perMonthSuffix,
  fromPrefix,
  index
}: {
  title: string
  subtitle: string
  icon: React.ComponentType<{ className?: string }>
  listings: DemoListing[]
  href: string
  viewAllLabel: string
  perDaySuffix: string
  perMonthSuffix: string
  fromPrefix: string
  index: number
}) {
  return (
    <div className="animate-slide-up" style={{ animationDelay: `${index * 0.2}s` }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#FFF4EC] rounded-xl flex items-center justify-center">
            <IconComponent className="w-6 h-6 text-[#E8630A]" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[#111827] tracking-[-0.01em]">
              {title}
            </h2>
            <p className="text-sm text-[#6B7280]">
              {subtitle}
            </p>
          </div>
        </div>
        <Link
          href={href}
          className="group flex items-center gap-2 text-[#E8630A] font-medium text-sm px-4 py-2 rounded-lg hover:bg-[#FFF4EC] transition-colors duration-150"
        >
          {viewAllLabel}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-150" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {listings.map((listing, listingIndex) => (
          <Link
            key={listing.id}
            href={`/${listing.category}/${listing.id}`}
            className="group bg-white rounded-xl overflow-hidden border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06),0_1px_4px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 hover:border-[#D1D5DB] transition-all duration-200 animate-scale-in"
            style={{ animationDelay: `${index * 0.2 + listingIndex * 0.1}s` }}
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={listing.images[0]}
                alt={listing.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <div className="text-white text-lg font-bold mb-1">
                  {listing.pricePerDay
                    ? `${formatPrice(listing.pricePerDay)} XAF${perDaySuffix}`
                    : listing.category === 'jobs'
                    ? `${formatPrice(listing.price)} XAF${perMonthSuffix}`
                    : listing.category === 'services'
                    ? `${fromPrefix} ${formatPrice(listing.price)} XAF`
                    : `${formatPrice(listing.price)} XAF${perMonthSuffix}`
                  }
                </div>
              </div>
              <div className="absolute top-3 right-3">
                <div className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                  <BadgeCheck className="w-3 h-3" />
                  <span>Verified</span>
                </div>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-[#111827] text-sm mb-2 line-clamp-2 group-hover:text-[#E8630A] transition-colors duration-150">
                {listing.title}
              </h3>
              <div className="flex items-center text-[#6B7280] text-xs">
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
  const { t } = useTranslation()

  const categories = [
    {
      title: t.categories.housing,
      subtitle: t.listings.recentListings,
      icon: Home,
      listings: demoHousingListings,
      href: '/housing',
    },
    {
      title: t.categories.cars,
      subtitle: t.listings.recentListings,
      icon: Car,
      listings: demoCarListings,
      href: '/cars',
    },
    {
      title: t.emplois.name,
      subtitle: t.listings.recentListings,
      icon: Briefcase,
      listings: demoJobListings,
      href: '/emplois',
    },
    {
      title: t.categoryGrid.servicesName,
      subtitle: t.listings.recentListings,
      icon: Wrench,
      listings: demoServiceListings,
      href: '/services',
    }
  ]

  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 animate-slide-up">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#E8630A] mb-3">
            {t.categoryGrid.title}
          </p>
          <h2 className="text-[32px] font-semibold text-[#111827] tracking-[-0.015em] mb-4">
            {t.categoryGrid.subtitle}
          </h2>
        </div>

        {/* Categories */}
        <div className="space-y-16">
          {categories.map((category, index) => (
            <CategorySection
              key={category.title}
              title={category.title}
              subtitle={category.subtitle}
              icon={category.icon}
              listings={category.listings}
              href={category.href}
              viewAllLabel={t.listings.viewAllLink}
              perDaySuffix={t.listings.perDay}
              perMonthSuffix={t.listings.perMonth}
              fromPrefix="A partir de"
              index={index}
            />
          ))}
        </div>

        {/* Call to action */}
        <div className="mt-16 animate-slide-up" style={{ animationDelay: '0.8s' }}>
          <div className="inline-flex flex-col items-start space-y-4 bg-[#FAFAF8] rounded-xl p-8 border border-[#E5E7EB]">
            <h3 className="text-xl font-semibold text-[#111827]">
              {t.categoryGrid.noCategory}
            </h3>
            <p className="text-[#4B5563] max-w-md">
              {t.categoryGrid.noCategoryDesc}
            </p>
            <Link
              href="/publish"
              className="inline-flex items-center justify-center bg-[#E8630A] text-white px-6 py-3 rounded-lg hover:bg-[#1A1A2E] transition-colors duration-150 font-semibold text-sm"
            >
              {t.nav.postAd}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
