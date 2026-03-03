'use client'

import { Suspense, useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  Search, MapPin, Fuel, Settings2, Users,
  Heart, CheckCircle, Car, X, ArrowUpDown, SlidersHorizontal
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
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
  const [rentalType, setRentalType] = useState<'rent' | 'buy'>((searchParams.get('mode') as 'rent' | 'buy') || 'rent')

  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || 'all')
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || 'all')
  const [selectedFuel, setSelectedFuel] = useState(searchParams.get('fuel') || 'all')
  const [selectedTransmission, setSelectedTransmission] = useState(searchParams.get('transmission') || 'all')
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '')
  const [sortBy, setSortBy] = useState<SortOption>((searchParams.get('sort') as SortOption) || 'newest')
  const [minSeats, setMinSeats] = useState(searchParams.get('minSeats') || 'all')

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

  useEffect(() => { syncToUrl() }, [syncToUrl])

  const cities = [
    { value: 'all', label: lang === 'fr' ? 'Toutes les villes' : 'All cities' },
    { value: 'Douala', label: 'Douala' },
    { value: 'Yaoundé', label: 'Yaoundé' },
    { value: 'Kribi', label: 'Kribi' },
    { value: 'Bafoussam', label: 'Bafoussam' },
    { value: 'Limbe', label: 'Limbe' },
  ]

  const brands = [
    { value: 'all', label: lang === 'fr' ? 'Toutes les marques' : 'All brands' },
    { value: 'Toyota', label: 'Toyota' },
    { value: 'Mercedes', label: 'Mercedes' },
    { value: 'BMW', label: 'BMW' },
    { value: 'Honda', label: 'Honda' },
    { value: 'Nissan', label: 'Nissan' },
    { value: 'Hyundai', label: 'Hyundai' },
    { value: 'Kia', label: 'Kia' },
  ]

  const fuelTypes = [
    { value: 'all', label: lang === 'fr' ? 'Tous' : 'All' },
    { value: 'petrol', label: lang === 'fr' ? 'Essence' : 'Petrol' },
    { value: 'diesel', label: 'Diesel' },
    { value: 'electric', label: lang === 'fr' ? 'Électrique' : 'Electric' },
    { value: 'hybrid', label: lang === 'fr' ? 'Hybride' : 'Hybrid' },
  ]

  const transmissions = [
    { value: 'all', label: lang === 'fr' ? 'Toutes' : 'All' },
    { value: 'automatic', label: lang === 'fr' ? 'Automatique' : 'Automatic' },
    { value: 'manual', label: lang === 'fr' ? 'Manuel' : 'Manual' },
  ]

  const sortOptions = [
    { value: 'newest', label: lang === 'fr' ? 'Plus récents' : 'Newest' },
    { value: 'price_asc', label: lang === 'fr' ? 'Prix croissant' : 'Price ↑' },
    { value: 'price_desc', label: lang === 'fr' ? 'Prix décroissant' : 'Price ↓' },
    { value: 'popular', label: lang === 'fr' ? 'Populaires' : 'Popular' },
  ]

  const seatOptions = [
    { value: 'all', label: lang === 'fr' ? 'Tous' : 'Any' },
    { value: '2', label: '2+' },
    { value: '4', label: '4+' },
    { value: '5', label: '5+' },
    { value: '7', label: '7+' },
  ]

  useEffect(() => {
    getVehicles().then(data => { setListings(data); setLoading(false) })
  }, [])

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
        default: return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

  const hasActiveFilters = selectedCity !== 'all' || selectedBrand !== 'all' ||
    selectedFuel !== 'all' || selectedTransmission !== 'all' || searchQuery ||
    minPrice || maxPrice || minSeats !== 'all'

  const clearAll = () => {
    setSelectedCity('all'); setSelectedBrand('all'); setSelectedFuel('all')
    setSelectedTransmission('all'); setSearchQuery(''); setMinPrice('')
    setMaxPrice(''); setSortBy('newest'); setMinSeats('all')
  }

  const getFuelLabel = (fuel: string | null) => {
    if (!fuel) return ''
    return fuelTypes.find(f => f.value === fuel)?.label || fuel
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Page header */}
      <div className="bg-white border-b border-black/[0.06]">
        <div className="max-w-[1200px] mx-auto px-6 py-8">
          <h1
            className="font-bold text-[#1d1d1f] mb-6"
            style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', letterSpacing: '-0.03em', lineHeight: 1.1 }}
          >
            {lang === 'fr' ? 'Véhicules au Cameroun' : 'Vehicles in Cameroon'}
          </h1>

          {/* Rent / Buy toggle */}
          <div className="flex items-center gap-1 mb-5 bg-[#f5f5f7] rounded-xl p-1 w-fit">
            <button
              onClick={() => setRentalType('rent')}
              className={`px-5 py-2 text-[14px] font-medium rounded-lg transition-all ${
                rentalType === 'rent'
                  ? 'bg-white text-[#1d1d1f] shadow-sm'
                  : 'text-[#6e6e73] hover:text-[#1d1d1f]'
              }`}
              style={{ letterSpacing: '-0.01em' }}
            >
              🚗 {lang === 'fr' ? 'Louer' : 'Rent'}
            </button>
            <button
              onClick={() => setRentalType('buy')}
              className={`px-5 py-2 text-[14px] font-medium rounded-lg transition-all ${
                rentalType === 'buy'
                  ? 'bg-white text-[#1d1d1f] shadow-sm'
                  : 'text-[#6e6e73] hover:text-[#1d1d1f]'
              }`}
              style={{ letterSpacing: '-0.01em' }}
            >
              🏷️ {lang === 'fr' ? 'Acheter' : 'Buy'}
            </button>
          </div>

          {/* Search row */}
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868b]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'fr' ? 'Rechercher un véhicule...' : 'Search for a vehicle...'}
                className="w-full pl-10 pr-4 py-2.5 bg-[#f5f5f7] text-[#1d1d1f] text-[14px] rounded-xl border border-transparent focus:border-[#059669] focus:bg-white focus:ring-2 focus:ring-[#059669]/15 outline-none transition-all"
                style={{ letterSpacing: '-0.01em' }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-3.5 h-3.5 text-[#86868b]" />
                </button>
              )}
            </div>

            {/* City */}
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-4 py-2.5 bg-[#f5f5f7] text-[#1d1d1f] text-[14px] rounded-xl border border-transparent focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/15 outline-none appearance-none cursor-pointer min-w-[160px]"
              style={{ letterSpacing: '-0.01em' }}
            >
              {cities.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>

            {/* Brand */}
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="px-4 py-2.5 bg-[#f5f5f7] text-[#1d1d1f] text-[14px] rounded-xl border border-transparent focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/15 outline-none appearance-none cursor-pointer min-w-[160px]"
              style={{ letterSpacing: '-0.01em' }}
            >
              {brands.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
            </select>

            {/* Filters toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 text-[14px] font-medium rounded-xl border transition-all ${
                showFilters
                  ? 'bg-[#1d1d1f] text-white border-[#1d1d1f]'
                  : 'bg-[#f5f5f7] text-[#1d1d1f] border-transparent hover:bg-[#e8e8ed]'
              }`}
              style={{ letterSpacing: '-0.01em' }}
            >
              <SlidersHorizontal className="w-4 h-4" />
              {lang === 'fr' ? 'Filtres' : 'Filters'}
              {hasActiveFilters && <span className="w-1.5 h-1.5 bg-[#059669] rounded-full" />}
            </button>
          </div>

          {/* Advanced filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-black/[0.06] grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Fuel */}
              <div>
                <label className="block text-[11px] font-medium text-[#86868b] uppercase tracking-[0.04em] mb-2">
                  {lang === 'fr' ? 'Carburant' : 'Fuel'}
                </label>
                <select
                  value={selectedFuel}
                  onChange={(e) => setSelectedFuel(e.target.value)}
                  className="w-full px-3 py-2 bg-[#f5f5f7] text-[#1d1d1f] text-[13px] rounded-lg border border-transparent focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/15 outline-none"
                >
                  {fuelTypes.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                </select>
              </div>

              {/* Transmission */}
              <div>
                <label className="block text-[11px] font-medium text-[#86868b] uppercase tracking-[0.04em] mb-2">
                  {lang === 'fr' ? 'Transmission' : 'Transmission'}
                </label>
                <div className="flex gap-1">
                  {transmissions.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setSelectedTransmission(opt.value)}
                      className={`flex-1 py-2 text-[12px] font-medium rounded-lg transition-all ${
                        selectedTransmission === opt.value
                          ? 'bg-[#1d1d1f] text-white'
                          : 'bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e8e8ed]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Min price */}
              <div>
                <label className="block text-[11px] font-medium text-[#86868b] uppercase tracking-[0.04em] mb-2">
                  {lang === 'fr' ? 'Prix min (XAF/j)' : 'Min price (XAF/d)'}
                </label>
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 bg-[#f5f5f7] text-[#1d1d1f] text-[13px] rounded-lg border border-transparent focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/15 outline-none"
                />
              </div>

              {/* Seats */}
              <div>
                <label className="block text-[11px] font-medium text-[#86868b] uppercase tracking-[0.04em] mb-2">
                  {lang === 'fr' ? 'Places min' : 'Min seats'}
                </label>
                <div className="flex gap-1">
                  {seatOptions.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setMinSeats(opt.value)}
                      className={`flex-1 py-2 text-[11px] font-medium rounded-lg transition-all ${
                        minSeats === opt.value
                          ? 'bg-[#1d1d1f] text-white'
                          : 'bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e8e8ed]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Active filter chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mt-4 items-center">
              {searchQuery && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#f5f5f7] text-[#1d1d1f] text-[12px] font-medium rounded-full">
                  🔍 {searchQuery}
                  <button onClick={() => setSearchQuery('')}><X className="w-3 h-3 text-[#86868b]" /></button>
                </span>
              )}
              {selectedCity !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#f5f5f7] text-[#1d1d1f] text-[12px] font-medium rounded-full">
                  📍 {selectedCity}
                  <button onClick={() => setSelectedCity('all')}><X className="w-3 h-3 text-[#86868b]" /></button>
                </span>
              )}
              {selectedBrand !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#f5f5f7] text-[#1d1d1f] text-[12px] font-medium rounded-full">
                  🚘 {selectedBrand}
                  <button onClick={() => setSelectedBrand('all')}><X className="w-3 h-3 text-[#86868b]" /></button>
                </span>
              )}
              {selectedFuel !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#f5f5f7] text-[#1d1d1f] text-[12px] font-medium rounded-full">
                  ⛽ {fuelTypes.find(f => f.value === selectedFuel)?.label}
                  <button onClick={() => setSelectedFuel('all')}><X className="w-3 h-3 text-[#86868b]" /></button>
                </span>
              )}
              {selectedTransmission !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#f5f5f7] text-[#1d1d1f] text-[12px] font-medium rounded-full">
                  ⚙️ {transmissions.find(t => t.value === selectedTransmission)?.label}
                  <button onClick={() => setSelectedTransmission('all')}><X className="w-3 h-3 text-[#86868b]" /></button>
                </span>
              )}
              {(minPrice || maxPrice) && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#f5f5f7] text-[#1d1d1f] text-[12px] font-medium rounded-full">
                  💰 {minPrice ? formatPrice(parseInt(minPrice)) : '0'} – {maxPrice ? `${formatPrice(parseInt(maxPrice))} XAF` : '∞'}
                  <button onClick={() => { setMinPrice(''); setMaxPrice('') }}><X className="w-3 h-3 text-[#86868b]" /></button>
                </span>
              )}
              <button onClick={clearAll} className="text-[12px] text-[#059669] hover:text-[#047857] font-medium ml-auto">
                {lang === 'fr' ? 'Tout effacer' : 'Clear all'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <main className="flex-1 bg-[#f5f5f7]">
        <div className="max-w-[1200px] mx-auto px-6 py-8">
          {/* Results bar */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-[15px] font-semibold text-[#1d1d1f]" style={{ letterSpacing: '-0.02em' }}>
                {loading ? '...' : `${filteredListings.length} ${lang === 'fr' ? (filteredListings.length > 1 ? 'véhicules' : 'véhicule') : (filteredListings.length === 1 ? 'vehicle' : 'vehicles')}`}
              </p>
              <p className="text-[13px] text-[#86868b]">
                {selectedCity !== 'all' ? selectedCity : lang === 'fr' ? 'Tout le Cameroun' : 'All Cameroon'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#86868b]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="text-[13px] text-[#1d1d1f] bg-transparent border-none outline-none cursor-pointer font-medium"
                style={{ letterSpacing: '-0.01em' }}
              >
                {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden">
                  <div className="skeleton h-52" />
                  <div className="p-4 space-y-2">
                    <div className="skeleton h-4 w-3/4" />
                    <div className="skeleton h-3 w-1/2" />
                    <div className="skeleton h-5 w-1/3 mt-3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredListings.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-[#f5f5f7] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Car className="w-7 h-7 text-[#86868b]" />
              </div>
              <h3 className="text-[17px] font-semibold text-[#1d1d1f] mb-2" style={{ letterSpacing: '-0.02em' }}>
                {lang === 'fr' ? 'Aucun véhicule trouvé' : 'No vehicles found'}
              </h3>
              <p className="text-[14px] text-[#86868b] mb-4">
                {lang === 'fr' ? 'Essayez de modifier vos critères de recherche' : 'Try adjusting your search criteria'}
              </p>
              {hasActiveFilters && (
                <button onClick={clearAll} className="text-[14px] text-[#059669] font-medium hover:text-[#047857]">
                  {lang === 'fr' ? 'Effacer les filtres' : 'Clear filters'}
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredListings.map((listing) => (
                <Link key={listing.id} href={`/cars/${listing.id}`} className="group">
                  <div
                    className="bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                    style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)' }}
                  >
                    {/* Image */}
                    <div className="relative h-52 overflow-hidden">
                      {listing.images?.[0] ? (
                        <img
                          src={listing.images[0]}
                          alt={listing.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#f5f5f7] flex items-center justify-center">
                          <Car className="w-10 h-10 text-[#c7c7cc]" />
                        </div>
                      )}

                      {/* Favorite */}
                      <button
                        className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-sm"
                        onClick={(e) => e.preventDefault()}
                      >
                        <Heart className="w-3.5 h-3.5 text-[#1d1d1f]" />
                      </button>

                      {/* Verified badge */}
                      {listing.is_verified && (
                        <div className="absolute top-3 left-3">
                          <span className="flex items-center gap-1 px-2 py-0.5 bg-white/90 backdrop-blur-sm text-[#059669] text-[11px] font-semibold rounded-full">
                            <CheckCircle className="w-3 h-3" />
                            Pro
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      {/* Brand + year */}
                      <div className="flex items-center gap-2 mb-1">
                        {listing.brand && (
                          <span className="px-2 py-0.5 bg-[#f5f5f7] text-[#059669] text-[11px] font-semibold rounded-full">
                            {listing.brand}
                          </span>
                        )}
                        {listing.year && (
                          <span className="text-[12px] text-[#86868b]">{listing.year}</span>
                        )}
                      </div>

                      <h3
                        className="font-semibold text-[#1d1d1f] mb-1 group-hover:text-[#059669] transition-colors"
                        style={{ fontSize: '15px', letterSpacing: '-0.02em' }}
                      >
                        {listing.title}
                      </h3>

                      <div className="flex items-center gap-1 text-[#86868b] text-[13px] mb-3">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{listing.city}</span>
                      </div>

                      {/* Specs */}
                      <div className="flex flex-wrap gap-3 text-[12px] text-[#6e6e73] mb-4">
                        {listing.fuel_type && (
                          <span className="flex items-center gap-1">
                            <Fuel className="w-3.5 h-3.5" />
                            {getFuelLabel(listing.fuel_type)}
                          </span>
                        )}
                        {listing.transmission && (
                          <span className="flex items-center gap-1">
                            <Settings2 className="w-3.5 h-3.5" />
                            {listing.transmission === 'automatic' ? (lang === 'fr' ? 'Auto' : 'Auto') : (lang === 'fr' ? 'Manuel' : 'Manual')}
                          </span>
                        )}
                        {listing.seats && (
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            {listing.seats} {lang === 'fr' ? 'places' : 'seats'}
                          </span>
                        )}
                      </div>

                      {/* Price */}
                      <div className="flex items-center justify-between pt-3 border-t border-black/[0.04]">
                        <div>
                          <span className="font-bold text-[#1d1d1f]" style={{ fontSize: '17px', letterSpacing: '-0.02em' }}>
                            {formatPrice(listing.price_per_day)}
                          </span>
                          <span className="text-[#86868b] text-[12px] ml-1">XAF/{lang === 'fr' ? 'jour' : 'day'}</span>
                        </div>
                        <span className="px-3 py-1.5 bg-[#059669] text-white text-[12px] font-medium rounded-full hover:bg-[#047857] transition-colors">
                          {lang === 'fr' ? 'Voir' : 'View'}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-2 border-[#059669] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <CarsPageInner />
    </Suspense>
  )
}
