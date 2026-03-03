'use client'

import { Suspense, useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { 
  Search, SlidersHorizontal, MapPin, Bed, Bath, Square, 
  Heart, CheckCircle, X, ChevronDown, Grid, List, ArrowUpDown,
  ArrowUp, ArrowDown
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { getProperties, Property } from '@/lib/supabase/queries'
import { useTranslation } from '@/lib/i18n/context'
import { NEIGHBORHOODS, getNeighborhoodsByCity } from '@/lib/data/neighborhoods'

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
  
  // Filters — initialized from URL params
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

  // Get neighborhoods for selected city
  const availableNeighborhoods = selectedCity !== 'all' 
    ? getNeighborhoodsByCity(selectedCity) 
    : []

  // Reset neighborhood when city changes
  useEffect(() => {
    setSelectedNeighborhood('all')
  }, [selectedCity])

  // Sync filters to URL
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
      { value: 'Bamenda', label: 'Bamenda' },
      { value: 'Limbe', label: 'Limbe' },
    ],
    propertyTypes: [
      { value: 'all', label: lang === 'fr' ? 'Tous les types' : 'All types' },
      { value: 'apartment', label: t.housingTypes.apartment },
      { value: 'villa', label: lang === 'fr' ? 'Villa' : 'Villa' },
      { value: 'studio', label: t.housingTypes.studio },
      { value: 'hotel_room', label: lang === 'fr' ? 'Hôtel' : 'Hotel' },
      { value: 'guest_house', label: lang === 'fr' ? "Maison d'hote" : 'Guest house' },
      { value: 'compound', label: lang === 'fr' ? 'Compound' : 'Compound' },
    ],
    priceRanges: lang === 'fr' ? [
      { value: 'all', label: 'Tous les prix' },
      { value: '0-50000', label: 'Moins de 50 000 XAF' },
      { value: '50000-100000', label: '50 000 - 100 000 XAF' },
      { value: '100000-200000', label: '100 000 - 200 000 XAF' },
      { value: '200000-500000', label: '200 000 - 500 000 XAF' },
      { value: '500000+', label: 'Plus de 500 000 XAF' },
    ] : [
      { value: 'all', label: 'All prices' },
      { value: '0-50000', label: 'Under 50,000 XAF' },
      { value: '50000-100000', label: '50,000 - 100,000 XAF' },
      { value: '100000-200000', label: '100,000 - 200,000 XAF' },
      { value: '200000-500000', label: '200,000 - 500,000 XAF' },
      { value: '500000+', label: 'Over 500,000 XAF' },
    ],
    bedroomOptions: [
      { value: 'all', label: lang === 'fr' ? 'Toutes' : 'Any' },
      { value: '1', label: '1+' },
      { value: '2', label: '2+' },
      { value: '3', label: '3+' },
      { value: '4', label: '4+' },
    ],
    bathroomOptions: [
      { value: 'all', label: lang === 'fr' ? 'Toutes' : 'Any' },
      { value: '1', label: '1+' },
      { value: '2', label: '2+' },
      { value: '3', label: '3+' },
    ],
    sortOptions: [
      { value: 'newest', label: lang === 'fr' ? 'Plus récents' : 'Newest first' },
      { value: 'price_asc', label: lang === 'fr' ? 'Prix croissant' : 'Price: low to high' },
      { value: 'price_desc', label: lang === 'fr' ? 'Prix décroissant' : 'Price: high to low' },
      { value: 'popular', label: lang === 'fr' ? 'Plus populaires' : 'Most popular' },
    ],
    heroTitle: lang === 'fr' ? 'Trouvez votre logement idéal' : 'Find your ideal home',
    heroSubtitle: lang === 'fr' ? 'Appartements, maisons et terrains au Cameroun' : 'Apartments, houses and land in Cameroon',
    city: lang === 'fr' ? 'Ville' : 'City',
    neighborhood: lang === 'fr' ? 'Quartier' : 'Neighborhood',
    allNeighborhoods: lang === 'fr' ? 'Tous les quartiers' : 'All neighborhoods',
    selectCityFirst: lang === 'fr' ? 'Sélectionnez une ville' : 'Select a city first',
    propertyType: lang === 'fr' ? 'Type de bien' : 'Property type',
    budget: 'Budget',
    minPriceLabel: lang === 'fr' ? 'Prix min (XAF)' : 'Min price (XAF)',
    maxPriceLabel: lang === 'fr' ? 'Prix max (XAF)' : 'Max price (XAF)',
    bedrooms: lang === 'fr' ? 'Chambres' : 'Bedrooms',
    bathrooms: lang === 'fr' ? 'Salles de bain' : 'Bathrooms',
    search: t.hero.search,
    sortBy: lang === 'fr' ? 'Trier par' : 'Sort by',
    advancedFilters: lang === 'fr' ? 'Filtres avancés' : 'Advanced filters',
    hideFilters: lang === 'fr' ? 'Masquer les filtres' : 'Hide filters',
    resultsFound: (count: number) => lang === 'fr' 
      ? `${count} logement${count > 1 ? 's' : ''} trouvé${count > 1 ? 's' : ''}`
      : `${count} ${count === 1 ? 'property' : 'properties'} found`,
    allCameroon: lang === 'fr' ? 'Tout le Cameroun' : 'All Cameroon',
    filters: lang === 'fr' ? 'Filtres' : 'Filters',
    featured: t.listings.featured,
    verified: t.listings.verified,
    furnished: t.detail.furnished,
    noResults: t.listings.noResults,
    tryDifferent: lang === 'fr' ? 'Essayez de modifier vos critères de recherche' : 'Try adjusting your search criteria',
    clearAll: lang === 'fr' ? 'Tout effacer' : 'Clear all',
    searchPlaceholder: lang === 'fr' ? 'Rechercher un logement...' : 'Search for a property...',
  }

  // Get housing type label
  const getHousingType = (type: string | null) => {
    if (!type) return lang === 'fr' ? 'Logement' : 'Property'
    const types = content.propertyTypes.find(t => t.value === type)
    return types?.label || type
  }

  useEffect(() => {
    async function fetchListings() {
      const data = await getProperties()
      setListings(data)
      setLoading(false)
    }
    fetchListings()
  }, [])

  // Filter listings
  const filteredListings = listings
    .filter(listing => {
      if (selectedCity !== 'all' && listing.city !== selectedCity) return false
      if (selectedNeighborhood !== 'all' && listing.neighborhood?.toLowerCase() !== selectedNeighborhood) return false
      if (selectedType !== 'all' && listing.property_type !== selectedType) return false
      if (searchQuery && !listing.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !listing.description?.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !listing.city.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !listing.neighborhood?.toLowerCase().includes(searchQuery.toLowerCase())) return false
      
      // Bedroom filter
      if (minBedrooms !== 'all' && (listing.bedrooms === null || listing.bedrooms < parseInt(minBedrooms))) return false
      
      // Bathroom filter
      if (minBathrooms !== 'all' && (listing.bathrooms === null || listing.bathrooms < parseInt(minBathrooms))) return false

      // Custom price range
      const price = listing.price_per_night
      if (minPrice && price < parseInt(minPrice)) return false
      if (maxPrice && price > parseInt(maxPrice)) return false
      
      // Preset price filter (only if no custom range)
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
        case 'newest':
        default: return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

  const hasActiveFilters = selectedCity !== 'all' || selectedNeighborhood !== 'all' || 
    selectedType !== 'all' || selectedPrice !== 'all' || searchQuery ||
    minBedrooms !== 'all' || minBathrooms !== 'all' || minPrice || maxPrice

  const clearAllFilters = () => {
    setSelectedCity('all')
    setSelectedNeighborhood('all')
    setSelectedType('all')
    setSelectedPrice('all')
    setSearchQuery('')
    setMinBedrooms('all')
    setMinBathrooms('all')
    setMinPrice('')
    setMaxPrice('')
    setSortBy('newest')
  }

  return (
    <div className="min-h-screen flex flex-col bg-[color:var(--background)]">
      <Header />
      
      {/* Hero Search */}
      <div className="bg-gradient-to-r from-[color:var(--green-600)] to-[color:var(--green-800)] text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {content.heroTitle}
          </h1>
          <p className="text-white/80 mb-8">
            {content.heroSubtitle}
          </p>
          
          {/* Search Bar */}
          <div className="bg-white/90 rounded-3xl p-4 shadow-[var(--shadow-soft)] backdrop-blur-sm">
            {/* Main search row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search Query */}
              <div className="lg:col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1">{content.search}</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={content.searchPlaceholder}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-2xl text-gray-900 focus:ring-2 focus:ring-[color:var(--green-400)] focus:border-transparent"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                      <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                    </button>
                  )}
                </div>
              </div>

              {/* City */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">{content.city}</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-2xl text-gray-900 focus:ring-2 focus:ring-[color:var(--green-400)] focus:border-transparent"
                  >
                    {content.cities.map(city => (
                      <option key={city.value} value={city.value}>{city.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Type */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">{content.propertyType}</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-2xl text-gray-900 focus:ring-2 focus:ring-[color:var(--green-400)] focus:border-transparent"
                >
                  {content.propertyTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              {/* Advanced Filters Toggle */}
              <div className="flex items-end">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-2xl border transition-colors font-medium text-sm ${
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
                {/* Neighborhood */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    {content.neighborhood} 📍
                  </label>
                  <select
                    value={selectedNeighborhood}
                    onChange={(e) => setSelectedNeighborhood(e.target.value)}
                    disabled={selectedCity === 'all'}
                    className={`w-full px-4 py-2 border border-gray-200 rounded-2xl text-gray-900 focus:ring-2 focus:ring-[color:var(--green-400)] focus:border-transparent ${
                      selectedCity === 'all' ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : ''
                    }`}
                  >
                    <option value="all">
                      {selectedCity === 'all' ? content.selectCityFirst : content.allNeighborhoods}
                    </option>
                    {availableNeighborhoods.map(n => (
                      <option key={n.value} value={n.value}>{n.label}</option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">{content.budget}</label>
                  <select
                    value={selectedPrice}
                    onChange={(e) => { setSelectedPrice(e.target.value); setMinPrice(''); setMaxPrice('') }}
                    className="w-full px-4 py-2 border border-gray-200 rounded-2xl text-gray-900 focus:ring-2 focus:ring-[color:var(--green-400)] focus:border-transparent"
                  >
                    {content.priceRanges.map(range => (
                      <option key={range.value} value={range.value}>{range.label}</option>
                    ))}
                  </select>
                </div>

                {/* Min Price */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">{content.minPriceLabel}</label>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => { setMinPrice(e.target.value); setSelectedPrice('all') }}
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
                    onChange={(e) => { setMaxPrice(e.target.value); setSelectedPrice('all') }}
                    placeholder="∞"
                    min="0"
                    className="w-full px-4 py-2 border border-gray-200 rounded-2xl text-gray-900 focus:ring-2 focus:ring-[color:var(--green-400)] focus:border-transparent"
                  />
                </div>

                {/* Min Bedrooms */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    <Bed className="inline w-3 h-3 mr-1" />{content.bedrooms}
                  </label>
                  <div className="flex gap-1">
                    {content.bedroomOptions.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setMinBedrooms(opt.value)}
                        className={`flex-1 py-2 text-xs rounded-xl border transition-colors ${
                          minBedrooms === opt.value
                            ? 'bg-[color:var(--green-600)] text-white border-[color:var(--green-600)]'
                            : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Min Bathrooms */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    <Bath className="inline w-3 h-3 mr-1" />{content.bathrooms}
                  </label>
                  <div className="flex gap-1">
                    {content.bathroomOptions.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setMinBathrooms(opt.value)}
                        className={`flex-1 py-2 text-xs rounded-xl border transition-colors ${
                          minBathrooms === opt.value
                            ? 'bg-[color:var(--green-600)] text-white border-[color:var(--green-600)]'
                            : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Active Filters Tags */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t items-center">
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    🔍 {searchQuery}
                    <button onClick={() => setSearchQuery('')} className="hover:text-blue-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedCity !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-[color:var(--green-50)] text-[color:var(--green-700)] rounded-full text-sm">
                    📍 {selectedCity}
                    <button onClick={() => setSelectedCity('all')} className="hover:text-blue-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedNeighborhood !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                    🏘️ {availableNeighborhoods.find(n => n.value === selectedNeighborhood)?.label}
                    <button onClick={() => setSelectedNeighborhood('all')} className="hover:text-green-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedType !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                    🏠 {content.propertyTypes.find(t => t.value === selectedType)?.label}
                    <button onClick={() => setSelectedType('all')} className="hover:text-purple-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedPrice !== 'all' && !minPrice && !maxPrice && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                    💰 {content.priceRanges.find(r => r.value === selectedPrice)?.label}
                    <button onClick={() => setSelectedPrice('all')} className="hover:text-yellow-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {(minPrice || maxPrice) && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                    💰 {minPrice ? `${formatPrice(parseInt(minPrice))}` : '0'} – {maxPrice ? `${formatPrice(parseInt(maxPrice))} XAF` : '∞'}
                    <button onClick={() => { setMinPrice(''); setMaxPrice('') }} className="hover:text-yellow-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {minBedrooms !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                    🛏 {minBedrooms}+ {lang === 'fr' ? 'ch.' : 'bd.'}
                    <button onClick={() => setMinBedrooms('all')} className="hover:text-indigo-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {minBathrooms !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm">
                    🚿 {minBathrooms}+ {lang === 'fr' ? 'sdb.' : 'ba.'}
                    <button onClick={() => setMinBathrooms('all')} className="hover:text-pink-900">
                      <X className="w-3 h-3" />
                    </button>
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
                {selectedNeighborhood !== 'all' 
                  ? `${availableNeighborhoods.find(n => n.value === selectedNeighborhood)?.label}, ${selectedCity}`
                  : selectedCity !== 'all' 
                    ? selectedCity 
                    : content.allCameroon}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
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

              {/* View Toggle */}
              <div className="flex bg-[color:var(--green-50)] rounded-2xl p-1">
                <button
                  onClick={() => setView('grid')}
                  className={`p-2 rounded ${view === 'grid' ? 'bg-white shadow-sm' : ''}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`p-2 rounded ${view === 'list' ? 'bg-white shadow-sm' : ''}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Listings Grid */}
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
            <div className={`grid gap-6 ${
              view === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {filteredListings.map((listing) => (
                <Link 
                  key={listing.id} 
                  href={`/housing/${listing.id}`}
                  className={`group ${view === 'list' ? 'flex gap-4' : ''}`}
                >
                  <div className={`bg-white rounded-3xl overflow-hidden shadow-[var(--shadow-soft-sm)] hover:shadow-[var(--shadow-soft)] transition-all ${
                    view === 'list' ? 'flex flex-1' : ''
                  }`}>
                    {/* Image */}
                    <div className={`relative overflow-hidden ${
                      view === 'list' ? 'w-72 flex-shrink-0' : 'h-48'
                    }`}>
                      {listing.images?.[0] ? (
                        <img
                          src={listing.images[0]}
                          alt={listing.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <MapPin className="w-8 h-8 text-gray-300" />
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
                        {listing.is_featured && (
                          <span className="bg-[color:var(--green-600)] text-white text-xs font-medium px-2 py-1 rounded">
                            {content.featured}
                          </span>
                        )}
                        {listing.is_verified && (
                          <span className="bg-green-600 text-white text-xs font-medium px-2 py-1 rounded flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            {content.verified}
                          </span>
                        )}
                      </div>
                      
                      {/* Type Badge */}
                      <span className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
                        {getHousingType(listing.property_type)}
                      </span>
                    </div>
                    
                    {/* Content */}
                    <div className="p-4 flex-1">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900 group-hover:text-[color:var(--green-700)] transition-colors line-clamp-1">
                          {listing.title}
                        </h3>
                      </div>
                      
                      <div className="flex items-center text-gray-500 text-sm mb-3">
                        <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                        <span className="truncate">
                          {listing.neighborhood ? `${listing.neighborhood}, ` : ''}{listing.city}
                        </span>
                      </div>
                      
                      {/* Features */}
                      {(listing.bedrooms || listing.bathrooms || listing.surface_m2) && (
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          {listing.bedrooms && (
                            <span className="flex items-center gap-1">
                              <Bed className="w-4 h-4" />
                              {listing.bedrooms}
                            </span>
                          )}
                          {listing.bathrooms && (
                            <span className="flex items-center gap-1">
                              <Bath className="w-4 h-4" />
                              {listing.bathrooms}
                            </span>
                          )}
                          {listing.surface_m2 && (
                            <span className="flex items-center gap-1">
                              <Square className="w-4 h-4" />
                              {listing.surface_m2} m²
                            </span>
                          )}
                        </div>
                      )}
                      
                      {/* Price */}
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xl font-bold text-[color:var(--green-700)]">
                            {formatPrice(listing.price_per_night)} XAF
                          </span>
                          <span className="text-gray-500 text-sm"> {t.listings.perNight}</span>
                        </div>
                        {listing.furnished && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {content.furnished}
                          </span>
                        )}
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
              <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
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

export default function HousingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Chargement...</div>
      </div>
    }>
      <HousingPageInner />
    </Suspense>
  )
}
