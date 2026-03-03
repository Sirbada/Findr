'use client'

import { Suspense, useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  Search, MapPin, Bed, Bath, Square,
  Heart, CheckCircle, X, Grid, List, ArrowUpDown,
  SlidersHorizontal, Sparkles
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getProperties, Property } from '@/lib/supabase/queries'
import { useTranslation } from '@/lib/i18n/context'
import { getNeighborhoodsByCity } from '@/lib/data/neighborhoods'

function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR').format(price)
}

type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'popular'

function HousingPageInner() {
  const { t, lang } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [listings, setListings] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)

  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || 'all')
  const [selectedNeighborhood, setSelectedNeighborhood] = useState(searchParams.get('neighborhood') || 'all')
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'all')
  const [selectedPrice, setSelectedPrice] = useState(searchParams.get('price') || 'all')
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [minBedrooms, setMinBedrooms] = useState(searchParams.get('minBedrooms') || 'all')
  const [minBathrooms, setMinBathrooms] = useState(searchParams.get('minBathrooms') || 'all')
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '')
  const [sortBy, setSortBy] = useState<SortOption>((searchParams.get('sort') as SortOption) || 'newest')

  const availableNeighborhoods = selectedCity !== 'all' ? getNeighborhoodsByCity(selectedCity) : []

  useEffect(() => { setSelectedNeighborhood('all') }, [selectedCity])

  const syncToUrl = useCallback(() => {
    const params = new URLSearchParams()
    if (selectedCity !== 'all') params.set('city', selectedCity)
    if (selectedNeighborhood !== 'all') params.set('neighborhood', selectedNeighborhood)
    if (selectedType !== 'all') params.set('type', selectedType)
    if (selectedPrice !== 'all') params.set('price', selectedPrice)
    if (searchQuery) params.set('q', searchQuery)
    if (minBedrooms !== 'all') params.set('minBedrooms', minBedrooms)
    if (minBathrooms !== 'all') params.set('minBathrooms', minBathrooms)
    if (minPrice) params.set('minPrice', minPrice)
    if (maxPrice) params.set('maxPrice', maxPrice)
    if (sortBy !== 'newest') params.set('sort', sortBy)
    const qs = params.toString()
    router.replace(qs ? `?${qs}` : '/housing', { scroll: false })
  }, [selectedCity, selectedNeighborhood, selectedType, selectedPrice, searchQuery, minBedrooms, minBathrooms, minPrice, maxPrice, sortBy, router])

  useEffect(() => { syncToUrl() }, [syncToUrl])

  const cities = [
    { value: 'all', label: lang === 'fr' ? 'Toutes les villes' : 'All cities' },
    { value: 'Douala', label: 'Douala' },
    { value: 'Yaoundé', label: 'Yaoundé' },
    { value: 'Kribi', label: 'Kribi' },
    { value: 'Bafoussam', label: 'Bafoussam' },
    { value: 'Bamenda', label: 'Bamenda' },
    { value: 'Limbe', label: 'Limbe' },
  ]

  const propertyTypes = [
    { value: 'all', label: lang === 'fr' ? 'Tous les types' : 'All types' },
    { value: 'apartment', label: lang === 'fr' ? 'Appartement' : 'Apartment' },
    { value: 'villa', label: 'Villa' },
    { value: 'studio', label: 'Studio' },
    { value: 'hotel_room', label: lang === 'fr' ? 'Hôtel' : 'Hotel' },
    { value: 'guest_house', label: lang === 'fr' ? "Maison d'hôte" : 'Guest house' },
    { value: 'compound', label: 'Compound' },
  ]

  const sortOptions = [
    { value: 'newest', label: lang === 'fr' ? 'Plus récents' : 'Newest' },
    { value: 'price_asc', label: lang === 'fr' ? 'Prix croissant' : 'Price ↑' },
    { value: 'price_desc', label: lang === 'fr' ? 'Prix décroissant' : 'Price ↓' },
    { value: 'popular', label: lang === 'fr' ? 'Populaires' : 'Popular' },
  ]

  const bedroomOptions = [
    { value: 'all', label: lang === 'fr' ? 'Toutes' : 'Any' },
    { value: '1', label: '1+' },
    { value: '2', label: '2+' },
    { value: '3', label: '3+' },
    { value: '4', label: '4+' },
  ]

  useEffect(() => {
    getProperties().then(data => { setListings(data); setLoading(false) })
  }, [])

  const filteredListings = listings
    .filter(listing => {
      if (selectedCity !== 'all' && listing.city !== selectedCity) return false
      if (selectedNeighborhood !== 'all' && listing.neighborhood?.toLowerCase() !== selectedNeighborhood) return false
      if (selectedType !== 'all' && listing.property_type !== selectedType) return false
      if (searchQuery && !listing.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !listing.description?.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !listing.city.toLowerCase().includes(searchQuery.toLowerCase())) return false
      if (minBedrooms !== 'all' && (listing.bedrooms === null || listing.bedrooms < parseInt(minBedrooms))) return false
      if (minBathrooms !== 'all' && (listing.bathrooms === null || listing.bathrooms < parseInt(minBathrooms))) return false
      const price = listing.price_per_night
      if (minPrice && price < parseInt(minPrice)) return false
      if (maxPrice && price > parseInt(maxPrice)) return false
      if (!minPrice && !maxPrice && selectedPrice !== 'all') {
        if (selectedPrice === '0-50000' && price > 50000) return false
        if (selectedPrice === '50000-100000' && (price < 50000 || price > 100000)) return false
        if (selectedPrice === '100000-200000' && (price < 100000 || price > 200000)) return false
        if (selectedPrice === '200000-500000' && (price < 200000 || price > 500000)) return false
        if (selectedPrice === '500000+' && price < 500000) return false
      }
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price_asc': return a.price_per_night - b.price_per_night
        case 'price_desc': return b.price_per_night - a.price_per_night
        case 'popular': return b.views - a.views
        default: return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

  const hasActiveFilters = selectedCity !== 'all' || selectedNeighborhood !== 'all' ||
    selectedType !== 'all' || selectedPrice !== 'all' || searchQuery ||
    minBedrooms !== 'all' || minBathrooms !== 'all' || minPrice || maxPrice

  const clearAll = () => {
    setSelectedCity('all'); setSelectedNeighborhood('all'); setSelectedType('all')
    setSelectedPrice('all'); setSearchQuery(''); setMinBedrooms('all')
    setMinBathrooms('all'); setMinPrice(''); setMaxPrice(''); setSortBy('newest')
  }

  const getTypeLabel = (type: string | null) => {
    if (!type) return lang === 'fr' ? 'Logement' : 'Property'
    return propertyTypes.find(t => t.value === type)?.label || type
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Page header — Nature green gradient */}
      <div
        style={{
          background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 40%, #fafaf9 100%)',
          borderBottom: '1px solid #a7f3d0',
        }}
      >
        <div className="max-w-[1200px] mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl"
              style={{ background: 'linear-gradient(135deg, #059669, #10b981)' }}
            >
              🏠
            </div>
            <div>
              <h1
                className="font-bold"
                style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', letterSpacing: '-0.03em', lineHeight: 1.1, color: '#064e3b' }}
              >
                {lang === 'fr' ? 'Immobilier au Cameroun' : 'Housing in Cameroon'}
              </h1>
              <p className="text-[13px] font-medium" style={{ color: '#059669' }}>
                {lang === 'fr' ? 'Appartements, villas, studios et plus' : 'Apartments, villas, studios and more'}
              </p>
            </div>
          </div>
          <div className="mt-5" />

          {/* Search row */}
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868b]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'fr' ? 'Rechercher un logement...' : 'Search for a property...'}
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

            {/* Type */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2.5 bg-[#f5f5f7] text-[#1d1d1f] text-[14px] rounded-xl border border-transparent focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/15 outline-none appearance-none cursor-pointer min-w-[160px]"
              style={{ letterSpacing: '-0.01em' }}
            >
              {propertyTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
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
              {hasActiveFilters && (
                <span className="w-1.5 h-1.5 bg-[#059669] rounded-full" />
              )}
            </button>
          </div>

          {/* Advanced filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-black/[0.06] grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Neighborhood */}
              <div>
                <label className="block text-[11px] font-medium text-[#86868b] uppercase tracking-[0.04em] mb-2">
                  {lang === 'fr' ? 'Quartier' : 'Neighborhood'}
                </label>
                <select
                  value={selectedNeighborhood}
                  onChange={(e) => setSelectedNeighborhood(e.target.value)}
                  disabled={selectedCity === 'all'}
                  className="w-full px-3 py-2 bg-[#f5f5f7] text-[#1d1d1f] text-[13px] rounded-lg border border-transparent focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/15 outline-none disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <option value="all">{selectedCity === 'all' ? (lang === 'fr' ? 'Sélectionnez une ville' : 'Select a city') : (lang === 'fr' ? 'Tous les quartiers' : 'All neighborhoods')}</option>
                  {availableNeighborhoods.map(n => <option key={n.value} value={n.value}>{n.label}</option>)}
                </select>
              </div>

              {/* Min price */}
              <div>
                <label className="block text-[11px] font-medium text-[#86868b] uppercase tracking-[0.04em] mb-2">
                  {lang === 'fr' ? 'Prix min (XAF)' : 'Min price (XAF)'}
                </label>
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => { setMinPrice(e.target.value); setSelectedPrice('all') }}
                  placeholder="0"
                  className="w-full px-3 py-2 bg-[#f5f5f7] text-[#1d1d1f] text-[13px] rounded-lg border border-transparent focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/15 outline-none"
                />
              </div>

              {/* Max price */}
              <div>
                <label className="block text-[11px] font-medium text-[#86868b] uppercase tracking-[0.04em] mb-2">
                  {lang === 'fr' ? 'Prix max (XAF)' : 'Max price (XAF)'}
                </label>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => { setMaxPrice(e.target.value); setSelectedPrice('all') }}
                  placeholder="∞"
                  className="w-full px-3 py-2 bg-[#f5f5f7] text-[#1d1d1f] text-[13px] rounded-lg border border-transparent focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/15 outline-none"
                />
              </div>

              {/* Bedrooms */}
              <div>
                <label className="block text-[11px] font-medium text-[#86868b] uppercase tracking-[0.04em] mb-2">
                  {lang === 'fr' ? 'Chambres min' : 'Min bedrooms'}
                </label>
                <div className="flex gap-1">
                  {bedroomOptions.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setMinBedrooms(opt.value)}
                      className={`flex-1 py-2 text-[12px] font-medium rounded-lg transition-all ${
                        minBedrooms === opt.value
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
              {selectedType !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#f5f5f7] text-[#1d1d1f] text-[12px] font-medium rounded-full">
                  🏠 {propertyTypes.find(t => t.value === selectedType)?.label}
                  <button onClick={() => setSelectedType('all')}><X className="w-3 h-3 text-[#86868b]" /></button>
                </span>
              )}
              {(minPrice || maxPrice) && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#f5f5f7] text-[#1d1d1f] text-[12px] font-medium rounded-full">
                  💰 {minPrice ? formatPrice(parseInt(minPrice)) : '0'} – {maxPrice ? `${formatPrice(parseInt(maxPrice))} XAF` : '∞'}
                  <button onClick={() => { setMinPrice(''); setMaxPrice('') }}><X className="w-3 h-3 text-[#86868b]" /></button>
                </span>
              )}
              {minBedrooms !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#f5f5f7] text-[#1d1d1f] text-[12px] font-medium rounded-full">
                  🛏 {minBedrooms}+
                  <button onClick={() => setMinBedrooms('all')}><X className="w-3 h-3 text-[#86868b]" /></button>
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
                {loading ? '...' : `${filteredListings.length} ${lang === 'fr' ? (filteredListings.length > 1 ? 'logements' : 'logement') : (filteredListings.length === 1 ? 'property' : 'properties')}`}
              </p>
              <p className="text-[13px] text-[#86868b]">
                {selectedCity !== 'all' ? selectedCity : lang === 'fr' ? 'Tout le Cameroun' : 'All Cameroon'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Sort */}
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
              {/* View toggle */}
              <div className="flex bg-white rounded-lg p-0.5 shadow-sm border border-black/[0.06]">
                <button
                  onClick={() => setView('grid')}
                  className={`p-1.5 rounded-md transition-all ${view === 'grid' ? 'bg-[#1d1d1f] text-white shadow-sm' : 'text-[#86868b] hover:text-[#1d1d1f]'}`}
                >
                  <Grid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`p-1.5 rounded-md transition-all ${view === 'list' ? 'bg-[#1d1d1f] text-white shadow-sm' : 'text-[#86868b] hover:text-[#1d1d1f]'}`}
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className={`grid gap-4 ${view === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
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
                <MapPin className="w-7 h-7 text-[#86868b]" />
              </div>
              <h3 className="text-[17px] font-semibold text-[#1d1d1f] mb-2" style={{ letterSpacing: '-0.02em' }}>
                {lang === 'fr' ? 'Aucun logement trouvé' : 'No properties found'}
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
            <div className={`grid gap-4 ${view === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {filteredListings.map((listing) => (
                <Link
                  key={listing.id}
                  href={`/housing/${listing.id}`}
                  className={`group ${view === 'list' ? 'flex gap-0' : ''}`}
                >
                  <div className={`bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${view === 'list' ? 'flex flex-1' : ''}`}
                    style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)' }}
                  >
                    {/* Image */}
                    <div className={`relative overflow-hidden ${view === 'list' ? 'w-64 flex-shrink-0' : 'h-52'}`}>
                      {listing.images?.[0] ? (
                        <img
                          src={listing.images[0]}
                          alt={listing.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#f5f5f7] flex items-center justify-center">
                          <MapPin className="w-8 h-8 text-[#c7c7cc]" />
                        </div>
                      )}

                      {/* Favorite */}
                      <button
                        className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-sm"
                        onClick={(e) => e.preventDefault()}
                      >
                        <Heart className="w-3.5 h-3.5 text-[#1d1d1f]" />
                      </button>

                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex gap-1.5">
                        {listing.is_featured && (
                          <span className="px-2 py-0.5 bg-[#059669] text-white text-[11px] font-semibold rounded-full">
                            {lang === 'fr' ? 'Vedette' : 'Featured'}
                          </span>
                        )}
                        {listing.is_verified && (
                          <span className="flex items-center gap-1 px-2 py-0.5 bg-white/90 backdrop-blur-sm text-[#059669] text-[11px] font-semibold rounded-full">
                            <CheckCircle className="w-3 h-3" />
                            {lang === 'fr' ? 'Vérifié' : 'Verified'}
                          </span>
                        )}
                      </div>

                      {/* Type */}
                      <span className="absolute bottom-3 left-3 px-2 py-0.5 bg-black/50 backdrop-blur-sm text-white text-[11px] font-medium rounded-full">
                        {getTypeLabel(listing.property_type)}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-4 flex-1">
                      <h3
                        className="font-semibold text-[#1d1d1f] mb-1 line-clamp-1 group-hover:text-[#059669] transition-colors"
                        style={{ fontSize: '15px', letterSpacing: '-0.02em' }}
                      >
                        {listing.title}
                      </h3>

                      <div className="flex items-center gap-1 text-[#86868b] text-[13px] mb-3">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">
                          {listing.neighborhood ? `${listing.neighborhood}, ` : ''}{listing.city}
                        </span>
                      </div>

                      {(listing.bedrooms || listing.bathrooms || listing.surface_m2) && (
                        <div className="flex items-center gap-3 text-[13px] text-[#6e6e73] mb-3">
                          {listing.bedrooms && (
                            <span className="flex items-center gap-1">
                              <Bed className="w-3.5 h-3.5" />
                              {listing.bedrooms}
                            </span>
                          )}
                          {listing.bathrooms && (
                            <span className="flex items-center gap-1">
                              <Bath className="w-3.5 h-3.5" />
                              {listing.bathrooms}
                            </span>
                          )}
                          {listing.surface_m2 && (
                            <span className="flex items-center gap-1">
                              <Square className="w-3.5 h-3.5" />
                              {listing.surface_m2} m²
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-3 border-t border-[#f0fdf4]">
                        <div>
                          <span className="font-bold" style={{ fontSize: '17px', letterSpacing: '-0.02em', color: '#059669' }}>
                            {formatPrice(listing.price_per_night)}
                          </span>
                          <span className="text-[12px] ml-1" style={{ color: '#6b7280' }}>XAF/{lang === 'fr' ? 'nuit' : 'night'}</span>
                        </div>
                        {listing.furnished && (
                          <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full" style={{ background: '#d1fae5', color: '#065f46' }}>
                            {lang === 'fr' ? 'Meublé' : 'Furnished'}
                          </span>
                        )}
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

export default function HousingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-2 border-[#059669] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <HousingPageInner />
    </Suspense>
  )
}
