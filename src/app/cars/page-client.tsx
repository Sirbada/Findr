'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import {
  Search, Calendar, MapPin, Fuel, Settings2, Users,
  Heart, CheckCircle, Car, ChevronDown, Filter, Bell, List, Map
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { getListings, Listing } from '@/lib/supabase/queries'
import { useTranslation } from '@/lib/i18n/context'
import { SaveSearchModal } from '@/components/ui/SaveSearchModal'
import { useAuth } from '@/lib/auth/context'

const MapView = dynamic(() => import('@/components/ui/MapView').then(m => ({ default: m.MapView })), { ssr: false })

function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR').format(price)
}

export function CarsPageClient() {
  const { t, lang } = useTranslation()
  const { user } = useAuth()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')
  const [showSaveSearch, setShowSaveSearch] = useState(false)
  
  // Filters
  const [selectedCity, setSelectedCity] = useState('all')
  const [selectedBrand, setSelectedBrand] = useState('all')
  const [selectedFuel, setSelectedFuel] = useState('all')
  const [selectedDuree, setSelectedDuree] = useState('all')
  const [rentalType, setRentalType] = useState<'rent' | 'buy'>('rent')
  const [sortBy, setSortBy] = useState('newest')

  // Translated content
  const content = {
    cities: [
      { value: 'all', label: lang === 'fr' ? 'Toutes les villes' : 'All cities' },
      { value: 'Douala', label: 'Douala' },
      { value: 'Yaoundé', label: 'Yaoundé' },
      { value: 'Kribi', label: 'Kribi' },
      { value: 'Bafoussam', label: 'Bafoussam' },
      { value: 'Limbe', label: 'Limbe' },
    ],
    carBrands: [
      { value: 'all', label: lang === 'fr' ? 'Toutes les marques' : 'All brands' },
      { value: 'Toyota', label: 'Toyota' },
      { value: 'Mercedes', label: 'Mercedes' },
      { value: 'BMW', label: 'BMW' },
      { value: 'Honda', label: 'Honda' },
      { value: 'Nissan', label: 'Nissan' },
      { value: 'Hyundai', label: 'Hyundai' },
      { value: 'Kia', label: 'Kia' },
    ],
    fuelTypes: [
      { value: 'all', label: lang === 'fr' ? 'Tous' : 'All' },
      { value: 'petrol', label: t.fuelTypes.essence },
      { value: 'diesel', label: t.fuelTypes.diesel },
      { value: 'electric', label: t.fuelTypes.electric },
      { value: 'hybrid', label: t.fuelTypes.hybrid },
    ],
    heroTitle: lang === 'fr' ? 'La bonne affaire auto, sans mauvaise surprise' : 'The right car deal, without bad surprises',
    heroSubtitle: lang === 'fr' ? 'Véhicules inspectés, prix transparents — Douala, Yaoundé et partout au Cameroun' : 'Inspected vehicles, transparent prices — Douala, Yaoundé and throughout Cameroon',
    rent: lang === 'fr' ? 'Louer' : 'Rent',
    buy: lang === 'fr' ? 'Acheter' : 'Buy',
    pickupLocation: lang === 'fr' ? 'Lieu de prise en charge' : 'Pickup location',
    startDate: lang === 'fr' ? 'Date de début' : 'Start date',
    endDate: lang === 'fr' ? 'Date de fin' : 'End date',
    brand: lang === 'fr' ? 'Marque' : 'Brand',
    fuel: lang === 'fr' ? 'Carburant' : 'Fuel',
    duree: lang === 'fr' ? 'Durée' : 'Duration',
    dureeOptions: lang === 'fr' ? [
      { value: 'all', label: 'Tous' },
      { value: '1-day', label: '1 jour' },
      { value: '1-week', label: '1 semaine' },
      { value: '1-month', label: '1 mois' },
      { value: '3-months', label: '3 mois' },
      { value: '6-months', label: '6 mois' },
      { value: '1-year', label: '1 an' },
      { value: 'long-term', label: 'Long terme (1 an+)' },
    ] : [
      { value: 'all', label: 'All' },
      { value: '1-day', label: '1 day' },
      { value: '1-week', label: '1 week' },
      { value: '1-month', label: '1 month' },
      { value: '3-months', label: '3 months' },
      { value: '6-months', label: '6 months' },
      { value: '1-year', label: '1 year' },
      { value: 'long-term', label: 'Long term (1+ year)' },
    ],
    search: t.hero.search,
    categories: lang === 'fr' ? [
      { icon: '🚗', label: 'Économique', desc: 'Dès 15 000 XAF/jour' },
      { icon: '🚙', label: 'SUV', desc: 'Dès 35 000 XAF/jour' },
      { icon: '🚐', label: 'Minibus', desc: 'Dès 50 000 XAF/jour' },
      { icon: '✨', label: 'Premium', desc: 'Dès 75 000 XAF/jour' },
      { icon: '👨‍✈️', label: 'Avec chauffeur', desc: 'Service VIP' },
    ] : [
      { icon: '🚗', label: 'Economy', desc: 'From 15,000 XAF/day' },
      { icon: '🚙', label: 'SUV', desc: 'From 35,000 XAF/day' },
      { icon: '🚐', label: 'Minibus', desc: 'From 50,000 XAF/day' },
      { icon: '✨', label: 'Premium', desc: 'From 75,000 XAF/day' },
      { icon: '👨‍✈️', label: 'With driver', desc: 'VIP Service' },
    ],
    resultsFound: (count: number) => lang === 'fr' 
      ? `${count} véhicule${count > 1 ? 's' : ''} disponible${count > 1 ? 's' : ''}`
      : `${count} ${count === 1 ? 'vehicle' : 'vehicles'} available`,
    allCameroon: lang === 'fr' ? 'Tout le Cameroun' : 'All Cameroon',
    moreFilters: lang === 'fr' ? 'Plus de filtres' : 'More filters',
    pro: 'Pro',
    view: lang === 'fr' ? 'Voir' : 'View',
    auto: 'Auto',
    manual: lang === 'fr' ? 'Manuel' : 'Manual',
    seats: lang === 'fr' ? 'places' : 'seats',
    noResults: lang === 'fr' ? 'Aucun véhicule trouvé' : 'No vehicles found',
    tryDifferent: lang === 'fr' ? 'Essayez de modifier vos critères de recherche' : 'Try adjusting your search criteria',
    sortOptions: lang === 'fr' ? [
      { value: 'newest', label: 'Plus récent' },
      { value: 'price-low', label: 'Prix croissant' },
      { value: 'price-high', label: 'Prix décroissant' },
      { value: 'year-new', label: 'Plus récent (année)' },
      { value: 'popular', label: 'Plus populaire' },
    ] : [
      { value: 'newest', label: 'Newest' },
      { value: 'price-low', label: 'Price: Low to High' },
      { value: 'price-high', label: 'Price: High to Low' },
      { value: 'year-new', label: 'Newest Year' },
      { value: 'popular', label: 'Most Popular' },
    ],
  }

  // Get fuel type label
  const getFuelType = (fuel: string | null) => {
    if (!fuel) return ''
    const fuelItem = content.fuelTypes.find(f => f.value === fuel)
    return fuelItem?.label || fuel
  }

  useEffect(() => {
    async function fetchListings() {
      const data = await getListings({ category: 'cars' })
      setListings(data)
      setLoading(false)
    }
    fetchListings()
  }, [])

  // Filter and sort listings
  const filteredAndSortedListings = (() => {
    let filtered = listings.filter(listing => {
      if (selectedCity !== 'all' && listing.city !== selectedCity) return false
      if (selectedBrand !== 'all' && listing.car_brand !== selectedBrand) return false
      if (selectedFuel !== 'all' && listing.fuel_type !== selectedFuel) return false
      
      // Filter by rental type
      if (rentalType === 'rent' && !listing.price_per_day) return false
      if (rentalType === 'buy' && listing.price_per_day) return false

      // Durée filter - based on created date
      if (selectedDuree !== 'all') {
        const now = new Date()
        const listingDate = new Date(listing.created_at)
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
    })

    // Sort listings
    switch (sortBy) {
      case 'price-low':
        return filtered.sort((a, b) => {
          const priceA = rentalType === 'rent' ? (a.price_per_day || 0) : a.price
          const priceB = rentalType === 'rent' ? (b.price_per_day || 0) : b.price
          return priceA - priceB
        })
      case 'price-high':
        return filtered.sort((a, b) => {
          const priceA = rentalType === 'rent' ? (a.price_per_day || 0) : a.price
          const priceB = rentalType === 'rent' ? (b.price_per_day || 0) : b.price
          return priceB - priceA
        })
      case 'popular':
        return filtered.sort((a, b) => b.views - a.views)
      case 'year-new':
        return filtered.sort((a, b) => (b.car_year || 0) - (a.car_year || 0))
      case 'newest':
      default:
        return filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }
  })()

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8]">
      <Header />
      
      {/* Hero Search */}
      <div className="bg-gradient-to-r from-[#0D3D24] to-[#1B5E3B] py-16 min-h-[280px] flex items-center text-white">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            {content.heroTitle}
          </h1>
          <p className="text-xl font-light text-gray-200 mb-12 max-w-2xl">
            {content.heroSubtitle}
          </p>
          
          {/* Rent/Buy Toggle */}
          <div className="flex gap-3 mb-8">
            <button
              onClick={() => setRentalType('rent')}
              className={`px-8 py-3 rounded-full font-medium transition-all duration-300 ${
                rentalType === 'rent'
                  ? 'bg-[#1B5E3B] text-white shadow-sm'
                  : 'bg-white/15 text-white/70 hover:bg-white/20'
              }`}
            >
              {content.rent}
            </button>
            <button
              onClick={() => setRentalType('buy')}
              className={`px-8 py-3 rounded-full font-medium transition-all duration-300 ${
                rentalType === 'buy'
                  ? 'bg-[#1B5E3B] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {content.buy}
            </button>
          </div>
          
          {/* Search Bar */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E8E8E4]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {content.pickupLocation}
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#1B5E3B] focus:border-[#1B5E3B]/30 transition-all duration-300 bg-[#FAFAF8] hover:bg-white"
                >
                  {content.cities.map(city => (
                    <option key={city.value} value={city.value}>{city.label}</option>
                  ))}
                </select>
              </div>
              
              {rentalType === 'rent' && (
                <>
                  {/* Date From */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {content.startDate}
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#1B5E3B] focus:border-[#1B5E3B]/30 transition-all duration-300 bg-[#FAFAF8] hover:bg-white"
                    />
                  </div>
                  
                  {/* Date To */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {content.endDate}
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#1B5E3B] focus:border-[#1B5E3B]/30 transition-all duration-300 bg-[#FAFAF8] hover:bg-white"
                    />
                  </div>
                </>
              )}
              
              {rentalType === 'buy' && (
                <>
                  {/* Brand */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {content.brand}
                    </label>
                    <select
                      value={selectedBrand}
                      onChange={(e) => setSelectedBrand(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#1B5E3B] focus:border-[#1B5E3B]/30 transition-all duration-300 bg-[#FAFAF8] hover:bg-white"
                    >
                      {content.carBrands.map(brand => (
                        <option key={brand.value} value={brand.value}>{brand.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Fuel */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {content.fuel}
                    </label>
                    <select
                      value={selectedFuel}
                      onChange={(e) => setSelectedFuel(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#1B5E3B] focus:border-[#1B5E3B]/30 transition-all duration-300 bg-[#FAFAF8] hover:bg-white"
                    >
                      {content.fuelTypes.map(fuel => (
                        <option key={fuel.value} value={fuel.value}>{fuel.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Durée */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{content.duree}</label>
                    <select
                      value={selectedDuree}
                      onChange={(e) => setSelectedDuree(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#1B5E3B] focus:border-[#1B5E3B]/30 transition-all duration-300 bg-[#FAFAF8] hover:bg-white"
                    >
                      {content.dureeOptions.map(duree => (
                        <option key={duree.value} value={duree.value}>{duree.label}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}
              
              {/* Search Button */}
              <div className="flex items-end">
                <Button size="lg" className="w-full bg-[#1B5E3B] hover:bg-[#0D3D24] rounded-xl py-3 font-medium hover:scale-[1.02] transition-all duration-300">
                  <Search className="w-5 h-5 mr-3" />
                  {content.search}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Categories removed for Apple clean style */}

      {/* Results */}
      <main className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Results Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {content.resultsFound(filteredAndSortedListings.length)}
              </h2>
              <p className="text-sm text-gray-500">
                {selectedCity !== 'all' ? selectedCity : content.allCameroon}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Save Search Button - only for logged-in users */}
              {user && (
                <button
                  onClick={() => setShowSaveSearch(true)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#1B5E3B] bg-[#F0F9F4] border border-[#E6F2EC] rounded-lg hover:bg-[#E6F2EC] transition-colors"
                >
                  <Bell className="w-4 h-4" />
                  Sauvegarder
                </button>
              )}

              {/* Map / List Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-[#1B5E3B]' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <List className="w-4 h-4" />
                  Liste
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors ${viewMode === 'map' ? 'bg-white shadow-sm text-[#1B5E3B]' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <Map className="w-4 h-4" />
                  Carte
                </button>
              </div>

              {viewMode === 'list' && (
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  {content.moreFilters}
                </Button>
              )}
            </div>
          </div>

          {/* Map View */}
          {viewMode === 'map' && !loading && (
            <MapView
              listings={filteredAndSortedListings
                .filter(l => (l as any).lat != null && (l as any).lng != null)
                .map(l => ({
                  id: l.id,
                  title: l.title,
                  price: l.price_per_day ?? l.price,
                  lat: (l as any).lat,
                  lng: (l as any).lng,
                  type: 'cars',
                }))}
              onListingClick={(id) => { window.location.href = `/cars/${id}` }}
            />
          )}

          {/* Listings Grid - Mobile.de Style */}
          {viewMode === 'list' && loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 rounded-xl h-48 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : viewMode === 'list' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedListings.map((listing) => (
                <Link 
                  key={listing.id} 
                  href={`/cars/${listing.id}`}
                  className="group"
                >
                  <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-300 border border-[#E8E8E4]">
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      {listing.images?.[0] ? (
                        <img
                          src={listing.images[0]}
                          alt={listing.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex flex-col items-center justify-center">
                          <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-gray-500 text-sm font-medium">Aucune photo</span>
                        </div>
                      )}
                      
                      {/* Favorite Button */}
                      <button 
                        className="absolute top-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                        onClick={(e) => { e.preventDefault(); }}
                      >
                        <Heart className="w-4 h-4 text-gray-600" />
                      </button>
                      
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex gap-2">
                        {listing.is_verified && (
                          <span className="bg-[#1B5E3B] text-white text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Verified
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-4">
                      {/* Price prominant */}
                      <div className="mb-3">
                        {listing.price_per_day ? (
                          <>
                            <span className="text-xl font-bold text-[#1B5E3B]">
                              {formatPrice(listing.price_per_day)}
                            </span>
                            <span className="text-gray-500 text-sm"> XAF{t.listings.perDay}</span>
                          </>
                        ) : (
                          <>
                            <span className="text-xl font-bold text-[#1B5E3B]">
                              {formatPrice(listing.price)}
                            </span>
                            <span className="text-gray-500 text-sm"> XAF</span>
                          </>
                        )}
                      </div>
                      
                      {/* Brand & Model */}
                      <div className="flex items-center gap-2 mb-1">
                        {listing.car_brand && (
                          <span className="text-xs font-medium text-[#1B5E3B] bg-[#F0F9F4] px-2 py-0.5 rounded">
                            {listing.car_brand}
                          </span>
                        )}
                        {listing.car_year && (
                          <span className="text-xs text-gray-500">{listing.car_year}</span>
                        )}
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 group-hover:text-[#1B5E3B] transition-colors mb-2">
                        {listing.title}
                      </h3>
                      
                      {/* Ort/Quartier unter Titel */}
                      <div className="flex items-center text-gray-500 text-sm mb-3">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{listing.neighborhood ? `${listing.neighborhood}, ` : ''}{listing.city}</span>
                      </div>
                      
                      {/* Features - Mobile.de Style */}
                      <div className="flex flex-wrap gap-3 text-xs text-gray-600 mb-4">
                        {listing.fuel_type && (
                          <span className="flex items-center gap-1">
                            <Fuel className="w-3 h-3" />
                            {getFuelType(listing.fuel_type)}
                          </span>
                        )}
                        {listing.transmission && (
                          <span className="flex items-center gap-1">
                            <Settings2 className="w-3 h-3" />
                            {listing.transmission === 'automatic' ? content.auto : content.manual}
                          </span>
                        )}
                        {listing.seats && (
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {listing.seats} {content.seats}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : null}

          {/* No Results - Empty State */}
          {!loading && filteredAndSortedListings.length === 0 && (
            <div className="text-center py-16">
              {/* CSS-only car illustration */}
              <div className="relative w-24 h-24 mx-auto mb-8">
                <div className="absolute inset-0 bg-gradient-to-b from-[#E6F2EC] to-[#F0F9F4] rounded-xl"></div>
                <div className="absolute top-6 left-3 w-18 h-8 bg-white rounded-lg shadow-sm flex items-center justify-center">
                  <Car className="w-8 h-5 text-gray-400" />
                </div>
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-[#F0F9F4]0 rounded-full flex items-center justify-center text-white text-xs font-bold">+</div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Soyez le premier à publier dans cette catégorie!
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Aucun véhicule ne correspond à vos critères. Partagez votre auto et trouvez vos premiers clients.
              </p>
              
              <Link href="/dashboard/new">
                <Button size="lg" className="bg-[#1B5E3B] hover:bg-[#0D3D24] px-8">
                  Publier une annonce →
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Save Search Modal */}
      <SaveSearchModal
        isOpen={showSaveSearch}
        onClose={() => setShowSaveSearch(false)}
        category="cars"
        filters={{
          city: selectedCity,
          brand: selectedBrand,
          fuel: selectedFuel,
          duree: selectedDuree,
          rentalType,
        }}
      />
    </div>
  )
}
