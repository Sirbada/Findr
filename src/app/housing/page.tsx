'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Search, SlidersHorizontal, MapPin, Bed, Bath, Square, 
  Heart, CheckCircle, X, ChevronDown, Grid, List, Map
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { getListings, Listing } from '@/lib/supabase/queries'
import { useTranslation } from '@/lib/i18n/context'
import { NEIGHBORHOODS, getNeighborhoodsByCity } from '@/lib/data/neighborhoods'

function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR').format(price)
}

export default function HousingPage() {
  const { t, lang } = useTranslation()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  
  // Filters
  const [selectedCity, setSelectedCity] = useState('all')
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedPrice, setSelectedPrice] = useState('all')
  const [selectedDuree, setSelectedDuree] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')

  // Get neighborhoods for selected city
  const availableNeighborhoods = selectedCity !== 'all' 
    ? getNeighborhoodsByCity(selectedCity) 
    : []

  // Reset neighborhood when city changes
  useEffect(() => {
    setSelectedNeighborhood('all')
  }, [selectedCity])

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
      { value: 'house', label: t.housingTypes.house },
      { value: 'studio', label: t.housingTypes.studio },
      { value: 'room', label: t.housingTypes.room },
      { value: 'land', label: t.housingTypes.land },
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
    heroTitle: lang === 'fr' ? 'Votre prochain chez-vous vous attend' : 'Your next home awaits you',
    heroSubtitle: lang === 'fr' ? 'Appartements, maisons et villas vérifiés — sans arnaques, sans stress' : 'Verified apartments, houses and villas — no scams, no stress',
    city: lang === 'fr' ? 'Ville' : 'City',
    neighborhood: lang === 'fr' ? 'Quartier' : 'Neighborhood',
    allNeighborhoods: lang === 'fr' ? 'Tous les quartiers' : 'All neighborhoods',
    selectCityFirst: lang === 'fr' ? 'Sélectionnez une ville' : 'Select a city first',
    propertyType: lang === 'fr' ? 'Type de bien' : 'Property type',
    budget: 'Budget',
    duree: lang === 'fr' ? 'Durée' : 'Duration',
    search: t.hero.search,
    resultsFound: (count: number) => lang === 'fr' 
      ? `${count} logement${count > 1 ? 's' : ''} trouvé${count > 1 ? 's' : ''}`
      : `${count} ${count === 1 ? 'property' : 'properties'} found`,
    sortBy: lang === 'fr' ? 'Trier par' : 'Sort by',
    sortOptions: lang === 'fr' ? [
      { value: 'newest', label: 'Plus récent' },
      { value: 'price-low', label: 'Prix croissant' },
      { value: 'price-high', label: 'Prix décroissant' },
      { value: 'popular', label: 'Plus populaire' },
    ] : [
      { value: 'newest', label: 'Newest' },
      { value: 'price-low', label: 'Price: Low to High' },
      { value: 'price-high', label: 'Price: High to Low' },
      { value: 'popular', label: 'Most Popular' },
    ],
    allCameroon: lang === 'fr' ? 'Tout le Cameroun' : 'All Cameroon',
    filters: lang === 'fr' ? 'Filtres' : 'Filters',
    featured: t.listings.featured,
    verified: t.listings.verified,
    furnished: t.detail.furnished,
    noResults: t.listings.noResults,
    tryDifferent: lang === 'fr' ? 'Essayez de modifier vos critères de recherche' : 'Try adjusting your search criteria',
  }

  // Get housing type label
  const getHousingType = (type: string | null) => {
    if (!type) return lang === 'fr' ? 'Logement' : 'Property'
    const types = content.propertyTypes.find(t => t.value === type)
    return types?.label || type
  }

  useEffect(() => {
    async function fetchListings() {
      const data = await getListings({ category: 'housing' })
      setListings(data)
      setLoading(false)
    }
    fetchListings()
  }, [])

  // Filter and sort listings
  const filteredAndSortedListings = (() => {
    let filtered = listings.filter(listing => {
      if (selectedCity !== 'all' && listing.city !== selectedCity) return false
      if (selectedNeighborhood !== 'all' && listing.neighborhood?.toLowerCase() !== selectedNeighborhood) return false
      if (selectedType !== 'all' && listing.housing_type !== selectedType) return false
      if (searchQuery && !listing.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !listing.description?.toLowerCase().includes(searchQuery.toLowerCase())) return false
      
      // Price filter
      if (selectedPrice !== 'all') {
        const price = listing.price
        if (selectedPrice === '0-50000' && price > 50000) return false
        if (selectedPrice === '50000-100000' && (price < 50000 || price > 100000)) return false
        if (selectedPrice === '100000-200000' && (price < 100000 || price > 200000)) return false
        if (selectedPrice === '200000-500000' && (price < 200000 || price > 500000)) return false
        if (selectedPrice === '500000+' && price < 500000) return false
      }

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
        return filtered.sort((a, b) => a.price - b.price)
      case 'price-high':
        return filtered.sort((a, b) => b.price - a.price)
      case 'popular':
        return filtered.sort((a, b) => b.views - a.views)
      case 'newest':
      default:
        return filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }
  })()

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      {/* Hero Search */}
      <div className="bg-gradient-to-b from-slate-50 to-white py-16 min-h-[280px] flex items-center">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            {content.heroTitle}
          </h1>
          <p className="text-xl font-light text-gray-600 mb-12 max-w-2xl">
            {content.heroSubtitle}
          </p>
          
          {/* Search Bar */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{content.city}</label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all duration-300 bg-gray-50 hover:bg-white"
                >
                  {content.cities.map(city => (
                    <option key={city.value} value={city.value}>{city.label}</option>
                  ))}
                </select>
              </div>

              {/* Neighborhood (Quartier) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {content.neighborhood}
                </label>
                <select
                  value={selectedNeighborhood}
                  onChange={(e) => setSelectedNeighborhood(e.target.value)}
                  disabled={selectedCity === 'all'}
                  className={`w-full px-4 py-3 border border-gray-200 rounded-2xl text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all duration-300 ${
                    selectedCity === 'all' ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-50 hover:bg-white'
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
              
              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{content.propertyType}</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all duration-300 bg-gray-50 hover:bg-white"
                >
                  {content.propertyTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              
              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{content.budget}</label>
                <select
                  value={selectedPrice}
                  onChange={(e) => setSelectedPrice(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all duration-300 bg-gray-50 hover:bg-white"
                >
                  {content.priceRanges.map(range => (
                    <option key={range.value} value={range.value}>{range.label}</option>
                  ))}
                </select>
              </div>

              {/* Durée */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{content.duree}</label>
                <select
                  value={selectedDuree}
                  onChange={(e) => setSelectedDuree(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all duration-300 bg-gray-50 hover:bg-white"
                >
                  {content.dureeOptions.map(duree => (
                    <option key={duree.value} value={duree.value}>{duree.label}</option>
                  ))}
                </select>
              </div>
              
              {/* Search Button */}
              <div className="flex items-end">
                <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 rounded-2xl py-3 font-medium hover:scale-[1.02] transition-all duration-300">
                  <Search className="w-5 h-5 mr-3" />
                  {content.search}
                </Button>
              </div>
            </div>

            {/* Active Filters Tags */}
            {(selectedCity !== 'all' || selectedNeighborhood !== 'all' || selectedType !== 'all' || selectedPrice !== 'all' || selectedDuree !== 'all') && (
              <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-100">
                {selectedCity !== 'all' && (
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                    {selectedCity}
                    <button onClick={() => setSelectedCity('all')} className="hover:text-gray-900 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                )}
                {selectedNeighborhood !== 'all' && (
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                    {availableNeighborhoods.find(n => n.value === selectedNeighborhood)?.label}
                    <button onClick={() => setSelectedNeighborhood('all')} className="hover:text-gray-900 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                )}
                {selectedType !== 'all' && (
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                    {content.propertyTypes.find(t => t.value === selectedType)?.label}
                    <button onClick={() => setSelectedType('all')} className="hover:text-gray-900 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                )}
                {selectedPrice !== 'all' && (
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                    {content.priceRanges.find(r => r.value === selectedPrice)?.label}
                    <button onClick={() => setSelectedPrice('all')} className="hover:text-gray-900 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                )}
                {selectedDuree !== 'all' && (
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                    {content.dureeOptions.find(d => d.value === selectedDuree)?.label}
                    <button onClick={() => setSelectedDuree('all')} className="hover:text-gray-900 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                )}
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
                {content.resultsFound(filteredAndSortedListings.length)}
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
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                >
                  {content.sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* View Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setView('grid')}
                  className={`p-2 rounded transition-colors ${view === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`p-2 rounded transition-colors ${view === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
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
              {filteredAndSortedListings.map((listing) => (
                <Link 
                  key={listing.id} 
                  href={`/housing/${listing.id}`}
                  className={`group ${view === 'list' ? 'flex gap-4' : ''}`}
                >
                  <div className={`bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300 border border-gray-100 ${
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
                          <span className="bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded">
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
                        {getHousingType(listing.housing_type)}
                      </span>
                    </div>
                    
                    {/* Content */}
                    <div className="p-4 flex-1">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
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
                      {(listing.rooms || listing.bathrooms || listing.surface_m2) && (
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          {listing.rooms && (
                            <span className="flex items-center gap-1">
                              <Bed className="w-4 h-4" />
                              {listing.rooms}
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
                          <span className="text-xl font-bold text-blue-600">
                            {formatPrice(listing.price)} XAF
                          </span>
                          {listing.rental_period !== 'sale' && (
                            <span className="text-gray-500 text-sm"> {t.listings.perMonth}</span>
                          )}
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
          {!loading && filteredAndSortedListings.length === 0 && (
            <div className="text-center py-12">
              <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {content.noResults}
              </h3>
              <p className="text-gray-500">
                {content.tryDifferent}
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
