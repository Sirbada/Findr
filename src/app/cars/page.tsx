'use client'

import { Suspense, useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { 
  Search, Calendar, MapPin, Fuel, Settings2, Users, 
  Heart, CheckCircle, Car, Filter, X, ArrowUpDown, SlidersHorizontal
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { getVehicles, Vehicle } from '@/lib/supabase/queries'
import { useTranslation } from '@/lib/i18n/context'

function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR').format(price)
}

type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'popular'

function CarsPageInner() {
  const { t, lang } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [listings, setListings] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  
  // Filters — initialized from URL params
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || 'all')
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || 'all')
  const [selectedFuel, setSelectedFuel] = useState(searchParams.get('fuel') || 'all')
  const [selectedTransmission, setSelectedTransmission] = useState(searchParams.get('transmission') || 'all')
  const [rentalType, setRentalType] = useState<'rent' | 'buy'>((searchParams.get('mode') as 'rent' | 'buy') || 'rent')
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '')
  const [sortBy, setSortBy] = useState<SortOption>((searchParams.get('sort') as SortOption) || 'newest')
  const [minSeats, setMinSeats] = useState(searchParams.get('minSeats') || 'all')

  // Sync filters to URL
  const syncToUrl = useCallback(() => {
    const params = new URLSearchParams()
    if (selectedCity !== 'all') params.set('city', selectedCity)
    if (selectedBrand !== 'all') params.set('brand', selectedBrand)
    if (selectedFuel !== 'all') params.set('fuel', selectedFuel)
    if (selectedTransmission !== 'all') params.set('transmission', selectedTransmission)
    if (rentalType !== 'rent') params.set('mode', rentalType)
    if (searchQuery) params.set('q', searchQuery)
    if (minPrice) params.set('minPrice', minPrice)
    if (maxPrice) params.set('maxPrice', maxPrice)
    if (sortBy !== 'newest') params.set('sort', sortBy)
    if (minSeats !== 'all') params.set('minSeats', minSeats)
    const qs = params.toString()
    router.replace(qs ? `?${qs}` : '/cars', { scroll: false })
  }, [selectedCity, selectedBrand, selectedFuel, selectedTransmission, rentalType, searchQuery, minPrice, maxPrice, sortBy, minSeats, router])

  useEffect(() => {
    syncToUrl()
  }, [syncToUrl])

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
    transmissionTypes: [
      { value: 'all', label: lang === 'fr' ? 'Toutes' : 'All' },
      { value: 'automatic', label: lang === 'fr' ? 'Automatique' : 'Automatic' },
      { value: 'manual', label: lang === 'fr' ? 'Manuel' : 'Manual' },
    ],
    seatOptions: [
      { value: 'all', label: lang === 'fr' ? 'Tous' : 'Any' },
      { value: '2', label: '2+' },
      { value: '4', label: '4+' },
      { value: '5', label: '5+' },
      { value: '7', label: '7+' },
    ],
    sortOptions: [
      { value: 'newest', label: lang === 'fr' ? 'Plus récents' : 'Newest first' },
      { value: 'price_asc', label: lang === 'fr' ? 'Prix croissant' : 'Price: low to high' },
      { value: 'price_desc', label: lang === 'fr' ? 'Prix décroissant' : 'Price: high to low' },
      { value: 'popular', label: lang === 'fr' ? 'Plus populaires' : 'Most popular' },
    ],
    heroTitle: lang === 'fr' ? 'Location & Vente de véhicules' : 'Vehicle Rental & Sales',
    heroSubtitle: lang === 'fr' ? 'Trouvez la voiture parfaite au Cameroun' : 'Find the perfect car in Cameroon',
    rent: lang === 'fr' ? 'Louer' : 'Rent',
    buy: lang === 'fr' ? 'Acheter' : 'Buy',
    pickupLocation: lang === 'fr' ? 'Lieu de prise en charge' : 'Pickup location',
    startDate: lang === 'fr' ? 'Date de début' : 'Start date',
    endDate: lang === 'fr' ? 'Date de fin' : 'End date',
    brand: lang === 'fr' ? 'Marque' : 'Brand',
    fuel: lang === 'fr' ? 'Carburant' : 'Fuel',
    transmission: lang === 'fr' ? 'Transmission' : 'Transmission',
    seats: lang === 'fr' ? 'places' : 'seats',
    seatsLabel: lang === 'fr' ? 'Places' : 'Seats',
    search: t.hero.search,
    searchPlaceholder: lang === 'fr' ? 'Rechercher un véhicule...' : 'Search for a vehicle...',
    minPriceLabel: lang === 'fr' ? 'Prix min (XAF/jour)' : 'Min price (XAF/day)',
    maxPriceLabel: lang === 'fr' ? 'Prix max (XAF/jour)' : 'Max price (XAF/day)',
    advancedFilters: lang === 'fr' ? 'Filtres avancés' : 'Advanced filters',
    hideFilters: lang === 'fr' ? 'Masquer les filtres' : 'Hide filters',
    clearAll: lang === 'fr' ? 'Tout effacer' : 'Clear all',
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
    pro: 'Pro',
    view: lang === 'fr' ? 'Voir' : 'View',
    auto: 'Auto',
    manual: lang === 'fr' ? 'Manuel' : 'Manual',
    noResults: lang === 'fr' ? 'Aucun véhicule trouvé' : 'No vehicles found',
    tryDifferent: lang === 'fr' ? 'Essayez de modifier vos critères de recherche' : 'Try adjusting your search criteria',
  }

  // Get fuel type label
  const getFuelType = (fuel: string | null) => {
    if (!fuel) return ''
    const fuelItem = content.fuelTypes.find(f => f.value === fuel)
    return fuelItem?.label || fuel
  }

  useEffect(() => {
    async function fetchListings() {
      const data = await getVehicles()
      setListings(data)
      setLoading(false)
    }
    fetchListings()
  }, [])

  // Filter listings
  const filteredListings = listings
    .filter(listing => {
      if (selectedCity !== 'all' && listing.city !== selectedCity) return false
      if (selectedBrand !== 'all' && listing.brand !== selectedBrand) return false
      if (selectedFuel !== 'all' && listing.fuel_type !== selectedFuel) return false
      if (selectedTransmission !== 'all' && listing.transmission !== selectedTransmission) return false
      if (minSeats !== 'all' && (listing.seats === null || listing.seats < parseInt(minSeats))) return false
      if (searchQuery && 
          !listing.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !listing.brand?.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !listing.model?.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !listing.city.toLowerCase().includes(searchQuery.toLowerCase())) return false
      const price = listing.price_per_day
      if (minPrice && price < parseInt(minPrice)) return false
      if (maxPrice && price > parseInt(maxPrice)) return false
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price_asc': return a.price_per_day - b.price_per_day
        case 'price_desc': return b.price_per_day - a.price_per_day
        case 'popular': return b.views - a.views
        case 'newest':
        default: return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

  const hasActiveFilters = selectedCity !== 'all' || selectedBrand !== 'all' || 
    selectedFuel !== 'all' || selectedTransmission !== 'all' || searchQuery ||
    minPrice || maxPrice || minSeats !== 'all'

  const clearAllFilters = () => {
    setSelectedCity('all')
    setSelectedBrand('all')
    setSelectedFuel('all')
    setSelectedTransmission('all')
    setSearchQuery('')
    setMinPrice('')
    setMaxPrice('')
    setSortBy('newest')
    setMinSeats('all')
  }

  return (
    <div className="min-h-screen flex flex-col bg-[color:var(--background)]">
      <Header />
      
      {/* Hero Search - Sixt/Mobile.de Style */}
      <div className="bg-gradient-to-r from-[color:var(--green-600)] to-[color:var(--green-800)] text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {content.heroTitle}
          </h1>
          <p className="text-white/80 mb-8">
            {content.heroSubtitle}
          </p>
          
          {/* Rent/Buy Toggle - Sixt Style */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setRentalType('rent')}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                rentalType === 'rent'
                  ? 'bg-white text-[color:var(--green-700)]'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              🚗 {content.rent}
            </button>
            <button
              onClick={() => setRentalType('buy')}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                rentalType === 'buy'
                  ? 'bg-white text-[color:var(--green-700)]'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              🏷️ {content.buy}
            </button>
          </div>
          
          {/* Search Bar */}
          <div className="bg-white rounded-xl p-4 shadow-lg">
            {/* Main row */}
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Query */}
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  🔍 {content.search}
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={content.searchPlaceholder}
                    className="w-full pl-10 pr-8 py-2 border border-gray-200 rounded-2xl text-gray-900 focus:ring-2 focus:ring-[color:var(--green-400)] focus:border-transparent"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                      <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                    </button>
                  )}
                </div>
              </div>

              {/* Location */}
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  📍 {content.pickupLocation}
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-2xl text-gray-900 focus:ring-2 focus:ring-[color:var(--green-400)] focus:border-transparent"
                >
                  {content.cities.map(city => (
                    <option key={city.value} value={city.value}>{city.label}</option>
                  ))}
                </select>
              </div>
              
              {rentalType === 'rent' && (
                <>
                  {/* Date From */}
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      📅 {content.startDate}
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-2 border border-gray-200 rounded-2xl text-gray-900 focus:ring-2 focus:ring-[color:var(--green-400)] focus:border-transparent"
                    />
                  </div>
                  
                  {/* Date To */}
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      📅 {content.endDate}
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-2 border border-gray-200 rounded-2xl text-gray-900 focus:ring-2 focus:ring-[color:var(--green-400)] focus:border-transparent"
                    />
                  </div>
                </>
              )}
              
              {rentalType === 'buy' && (
                <>
                  {/* Brand */}
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      🚘 {content.brand}
                    </label>
                    <select
                      value={selectedBrand}
                      onChange={(e) => setSelectedBrand(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-2xl text-gray-900 focus:ring-2 focus:ring-[color:var(--green-400)] focus:border-transparent"
                    >
                      {content.carBrands.map(brand => (
                        <option key={brand.value} value={brand.value}>{brand.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Fuel */}
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      ⛽ {content.fuel}
                    </label>
                    <select
                      value={selectedFuel}
                      onChange={(e) => setSelectedFuel(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-2xl text-gray-900 focus:ring-2 focus:ring-[color:var(--green-400)] focus:border-transparent"
                    >
                      {content.fuelTypes.map(fuel => (
                        <option key={fuel.value} value={fuel.value}>{fuel.label}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {/* Advanced Filters Toggle */}
              <div className="flex items-end">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-2xl border transition-colors font-medium text-sm whitespace-nowrap ${
                    showFilters
                      ? 'bg-[color:var(--green-600)] text-white border-[color:var(--green-600)]'
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  {showFilters ? content.hideFilters : content.advancedFilters}
                </button>
              </div>
            </div>

            {/* Advanced Filters Panel */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Brand (for rent mode) */}
                {rentalType === 'rent' && (
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      🚘 {content.brand}
                    </label>
                    <select
                      value={selectedBrand}
                      onChange={(e) => setSelectedBrand(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-2xl text-gray-900 focus:ring-2 focus:ring-[color:var(--green-400)] focus:border-transparent"
                    >
                      {content.carBrands.map(brand => (
                        <option key={brand.value} value={brand.value}>{brand.label}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Fuel (for rent mode) */}
                {rentalType === 'rent' && (
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      ⛽ {content.fuel}
                    </label>
                    <select
                      value={selectedFuel}
                      onChange={(e) => setSelectedFuel(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-2xl text-gray-900 focus:ring-2 focus:ring-[color:var(--green-400)] focus:border-transparent"
                    >
                      {content.fuelTypes.map(fuel => (
                        <option key={fuel.value} value={fuel.value}>{fuel.label}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Transmission */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    ⚙️ {content.transmission}
                  </label>
                  <div className="flex gap-1">
                    {content.transmissionTypes.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setSelectedTransmission(opt.value)}
                        className={`flex-1 py-2 text-xs rounded-xl border transition-colors ${
                          selectedTransmission === opt.value
                            ? 'bg-[color:var(--green-600)] text-white border-[color:var(--green-600)]'
                            : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Seats */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    👥 {content.seatsLabel}
                  </label>
                  <div className="flex gap-1">
                    {content.seatOptions.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setMinSeats(opt.value)}
                        className={`flex-1 py-2 text-xs rounded-xl border transition-colors ${
                          minSeats === opt.value
                            ? 'bg-[color:var(--green-600)] text-white border-[color:var(--green-600)]'
                            : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Min Price */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">{content.minPriceLabel}</label>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="0"
                    min="0"
                    className="w-full px-4 py-2 border border-gray-200 rounded-2xl text-gray-900 focus:ring-2 focus:ring-[color:var(--green-400)] focus:border-transparent"
                  />
                </div>

                {/* Max Price */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">{content.maxPriceLabel}</label>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="∞"
                    min="0"
                    className="w-full px-4 py-2 border border-gray-200 rounded-2xl text-gray-900 focus:ring-2 focus:ring-[color:var(--green-400)] focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {/* Active Filter Tags */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t items-center">
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    🔍 {searchQuery}
                    <button onClick={() => setSearchQuery('')}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {selectedCity !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-[color:var(--green-50)] text-[color:var(--green-700)] rounded-full text-sm">
                    📍 {selectedCity}
                    <button onClick={() => setSelectedCity('all')}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {selectedBrand !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                    🚘 {selectedBrand}
                    <button onClick={() => setSelectedBrand('all')}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {selectedFuel !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                    ⛽ {content.fuelTypes.find(f => f.value === selectedFuel)?.label}
                    <button onClick={() => setSelectedFuel('all')}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {selectedTransmission !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    ⚙️ {content.transmissionTypes.find(t => t.value === selectedTransmission)?.label}
                    <button onClick={() => setSelectedTransmission('all')}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {minSeats !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                    👥 {minSeats}+ {content.seats}
                    <button onClick={() => setMinSeats('all')}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {(minPrice || maxPrice) && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                    💰 {minPrice ? formatPrice(parseInt(minPrice)) : '0'} – {maxPrice ? `${formatPrice(parseInt(maxPrice))} XAF` : '∞'}
                    <button onClick={() => { setMinPrice(''); setMaxPrice('') }}><X className="w-3 h-3" /></button>
                  </span>
                )}
                <button
                  onClick={clearAllFilters}
                  className="ml-auto text-xs text-gray-500 hover:text-gray-700 underline"
                >
                  {content.clearAll}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Categories - Sixt Style */}
      <div className="bg-white border-b py-4">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-4 overflow-x-auto pb-2">
            {content.categories.map((cat, idx) => (
              <button
                key={idx}
                className="flex-shrink-0 flex items-center gap-3 px-4 py-2 bg-[color:var(--green-50)] hover:bg-[color:var(--green-100)] rounded-2xl transition-colors"
              >
                <span className="text-2xl">{cat.icon}</span>
                <div className="text-left">
                  <p className="font-medium text-gray-900">{cat.label}</p>
                  <p className="text-xs text-gray-500">{cat.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <main className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Results Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {content.resultsFound(filteredListings.length)}
              </h2>
              <p className="text-sm text-gray-500">
                {selectedCity !== 'all' ? selectedCity : content.allCameroon}
              </p>
            </div>
            
            {/* Sort */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="text-sm border border-gray-200 rounded-xl px-3 py-1.5 text-gray-700 focus:ring-2 focus:ring-[color:var(--green-400)] focus:border-transparent"
              >
                {content.sortOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Listings Grid - Mobile.de Style */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 rounded-xl h-48 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((listing) => (
                <Link 
                  key={listing.id} 
                  href={`/cars/${listing.id}`}
                  className="group"
                >
                  <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
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
                          <Car className="w-12 h-12 text-gray-300" />
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
                          <span className="bg-green-600 text-white text-xs font-medium px-2 py-1 rounded flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            {content.pro}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-4">
                      {/* Brand & Model */}
                      <div className="flex items-center gap-2 mb-1">
                        {listing.brand && (
                          <span className="text-xs font-medium text-[color:var(--green-700)] bg-[color:var(--green-50)] px-2 py-0.5 rounded">
                            {listing.brand}
                          </span>
                        )}
                        {listing.year && (
                          <span className="text-xs text-gray-500">{listing.year}</span>
                        )}
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 group-hover:text-[color:var(--green-700)] transition-colors mb-2">
                        {listing.title}
                      </h3>
                      
                      {/* Location */}
                      <div className="flex items-center text-gray-500 text-sm mb-3">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{listing.city}</span>
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
                      
                      {/* Price */}
                      <div className="flex items-center justify-between pt-3 border-t">
                        <div>
                          <span className="text-2xl font-bold text-[color:var(--green-700)]">
                            {formatPrice(listing.price_per_day)}
                          </span>
                          <span className="text-gray-500 text-sm"> XAF{t.listings.perDay}</span>
                        </div>
                        <Button size="sm" variant="outline" className="text-[color:var(--green-700)] border-[color:var(--green-400)] hover:bg-[color:var(--green-50)]">
                          {content.view}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && filteredListings.length === 0 && (
            <div className="text-center py-12">
              <Car className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {content.noResults}
              </h3>
              <p className="text-gray-500 mb-4">
                {content.tryDifferent}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-[color:var(--green-700)] hover:text-[color:var(--green-900)] font-medium underline"
                >
                  {content.clearAll}
                </button>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function CarsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Chargement...</div>
      </div>
    }>
      <CarsPageInner />
    </Suspense>
  )
}
