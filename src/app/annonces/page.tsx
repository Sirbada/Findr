'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Search, MapPin, Heart, SlidersHorizontal, X,
  Home, Car, Briefcase, Wrench, ChevronDown, Grid, List
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { getListings, searchListings, type Listing } from '@/lib/supabase/queries'
import { useTranslation } from '@/lib/i18n/context'
import { useAuth } from '@/lib/auth/context'
import { toggleFavorite, useFavorites } from '@/lib/supabase/favorites'

const categoryConfig = [
  { value: 'all', label: 'Toutes', icon: '📋' },
  { value: 'housing', label: 'Immobilier', icon: '🏠' },
  { value: 'cars', label: 'Véhicules', icon: '🚗' },
  { value: 'terrain', label: 'Terrain', icon: '🏗️' },
  { value: 'jobs', label: 'Emplois', icon: '💼' },
  { value: 'services', label: 'Services', icon: '⚙️' },
]

const cities = ['Toutes', 'Douala', 'Yaoundé', 'Bafoussam', 'Bamenda', 'Kribi', 'Limbe', 'Buea']

const priceRanges = [
  { value: 'all', label: 'Tous les prix' },
  { value: '0-50000', label: '< 50 000 XAF' },
  { value: '50000-150000', label: '50k - 150k XAF' },
  { value: '150000-500000', label: '150k - 500k XAF' },
  { value: '500000+', label: '> 500 000 XAF' },
]

const dureeOptions = [
  { value: 'all', label: 'Tous' },
  { value: '1-day', label: '1 jour' },
  { value: '1-week', label: '1 semaine' },
  { value: '1-month', label: '1 mois' },
  { value: '3-months', label: '3 mois' },
  { value: '6-months', label: '6 mois' },
  { value: '1-year', label: '1 an' },
  { value: 'long-term', label: 'Long terme (1 an+)' },
]

function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR').format(price)
}

export default function AnnoncesPage() {
  const { lang } = useTranslation()
  const { user } = useAuth()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedCity, setSelectedCity] = useState('Toutes')
  const [selectedPrice, setSelectedPrice] = useState('all')
  const [selectedDuree, setSelectedDuree] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const { favorites, toggle: toggleFav } = useFavorites(user?.id)

  useEffect(() => {
    async function fetch() {
      setLoading(true)
      const data = await getListings()
      setListings(data)
      setLoading(false)
    }
    fetch()
  }, [])

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    setLoading(true)
    const data = await searchListings(searchQuery)
    setListings(data)
    setLoading(false)
  }

  // Filter
  const filtered = listings.filter(l => {
    if (selectedCategory !== 'all' && l.category !== selectedCategory) return false
    if (selectedCity !== 'Toutes' && l.city !== selectedCity) return false
    if (selectedPrice !== 'all') {
      const p = l.price
      if (selectedPrice === '0-50000' && p > 50000) return false
      if (selectedPrice === '50000-150000' && (p < 50000 || p > 150000)) return false
      if (selectedPrice === '150000-500000' && (p < 150000 || p > 500000)) return false
      if (selectedPrice === '500000+' && p < 500000) return false
    }
    
    // Durée filter - based on created date
    if (selectedDuree !== 'all') {
      const now = new Date()
      const listingDate = new Date(l.created_at)
      const diffMs = now.getTime() - listingDate.getTime()
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
      
      if (selectedDuree === '1-day' && diffDays > 1) return false
      if (selectedDuree === '1-week' && diffDays > 7) return false
      if (selectedDuree === '1-month' && diffDays > 30) return false
      if (selectedDuree === '3-months' && diffDays > 90) return false
      if (selectedDuree === '6-months' && diffDays > 180) return false
      if (selectedDuree === '1-year' && diffDays > 365) return false
      if (selectedDuree === 'long-term' && diffDays <= 365) return false
    }

    return true
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price
    if (sortBy === 'price-high') return b.price - a.price
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  const getCategoryIcon = (cat: string) => {
    if (cat === 'housing') return <Home className="w-5 h-5" />
    if (cat === 'cars') return <Car className="w-5 h-5" />
    if (cat === 'jobs') return <Briefcase className="w-5 h-5" />
    if (cat === 'services') return <Wrench className="w-5 h-5" />
    return null
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-neutral-800 to-neutral-900 py-16 min-h-[280px] flex items-center text-white">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Trouvez le bon service, le bon emploi — aujourd'hui
          </h1>
          <p className="text-xl font-light text-gray-200 mb-12 max-w-2xl">
            Artisans, professionnels et opportunités vérifiés au Cameroun
          </p>
        </div>
      </div>

      {/* Search Header */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-40">
        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* Search bar */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Rechercher une annonce..."
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-300 focus:outline-none transition-all duration-300 bg-gray-50 hover:bg-white text-lg"
              />
            </div>
            <Button onClick={handleSearch} size="lg" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-2xl font-medium hover:scale-[1.02] transition-all duration-300">
              <Search className="w-5 h-5" />
            </Button>
          </div>

          {/* Category pills */}
          <div className="flex gap-3 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-hide">
            {categoryConfig.map(cat => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === cat.value
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Filters row */}
          <div className="flex gap-4 mt-4 flex-wrap">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-4 py-3 text-sm border border-gray-200 rounded-2xl bg-gray-50 hover:bg-white transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-300"
            >
              {cities.map(c => <option key={c} value={c}>{c === 'Toutes' ? 'Toutes les villes' : c}</option>)}
            </select>
            <select
              value={selectedPrice}
              onChange={(e) => setSelectedPrice(e.target.value)}
              className="px-4 py-3 text-sm border border-gray-200 rounded-2xl bg-gray-50 hover:bg-white transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-300"
            >
              {priceRanges.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
            <select
              value={selectedDuree}
              onChange={(e) => setSelectedDuree(e.target.value)}
              className="px-4 py-3 text-sm border border-gray-200 rounded-2xl bg-gray-50 hover:bg-white transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-300"
            >
              {dureeOptions.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 text-sm border border-gray-200 rounded-2xl bg-gray-50 hover:bg-white transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-300 ml-auto"
            >
              <option value="newest">Plus récent</option>
              <option value="price-low">Prix croissant</option>
              <option value="price-high">Prix décroissant</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <main className="flex-1 py-6">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-sm text-gray-500 mb-4">
            {filtered.length} annonce{filtered.length !== 1 ? 's' : ''} trouvée{filtered.length !== 1 ? 's' : ''}
          </p>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 rounded-xl h-48 mb-3" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune annonce trouvée</h3>
              <p className="text-gray-500">Essayez de modifier vos critères de recherche</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(listing => {
                const detailHref = listing.category === 'housing'
                  ? `/housing/${listing.id}`
                  : listing.category === 'cars'
                  ? `/cars/${listing.id}`
                  : listing.category === 'terrain'
                  ? `/terrain/${listing.id}`
                  : `/annonces/${listing.id}`
                const isFav = favorites.has(listing.id)

                return (
                  <div key={listing.id} className="group">
                    <Link href={detailHref}>
                      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300 border border-gray-100">
                        {/* Image */}
                        <div className="relative h-48 overflow-hidden">
                          {listing.images?.[0] ? (
                            <img
                              src={listing.images[0]}
                              alt={listing.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                              {getCategoryIcon(listing.category)}
                            </div>
                          )}
                          {/* Category badge */}
                          <span className="absolute top-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
                            {categoryConfig.find(c => c.value === listing.category)?.icon}{' '}
                            {categoryConfig.find(c => c.value === listing.category)?.label}
                          </span>
                          {/* Favorite */}
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              if (user) toggleFav(listing.id)
                            }}
                            className="absolute top-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                          >
                            <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                          </button>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-1">
                            {listing.title}
                          </h3>
                          <div className="flex items-center text-gray-500 text-sm mb-2">
                            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                            <span className="truncate">
                              {listing.neighborhood ? `${listing.neighborhood}, ` : ''}{listing.city}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-blue-600">
                              {formatPrice(listing.price)} XAF
                            </span>
                            <span className="text-xs text-gray-400">
                              {new Date(listing.created_at).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
