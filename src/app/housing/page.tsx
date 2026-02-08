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
  const [searchQuery, setSearchQuery] = useState('')

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
    heroTitle: lang === 'fr' ? 'Trouvez votre logement idéal' : 'Find your ideal home',
    heroSubtitle: lang === 'fr' ? 'Appartements, maisons et terrains au Cameroun' : 'Apartments, houses and land in Cameroon',
    city: lang === 'fr' ? 'Ville' : 'City',
    neighborhood: lang === 'fr' ? 'Quartier' : 'Neighborhood',
    allNeighborhoods: lang === 'fr' ? 'Tous les quartiers' : 'All neighborhoods',
    selectCityFirst: lang === 'fr' ? 'Sélectionnez une ville' : 'Select a city first',
    propertyType: lang === 'fr' ? 'Type de bien' : 'Property type',
    budget: 'Budget',
    search: t.hero.search,
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

  // Filter listings
  const filteredListings = listings.filter(listing => {
    if (selectedCity !== 'all' && listing.city !== selectedCity) return false
    if (selectedNeighborhood !== 'all' && listing.neighborhood?.toLowerCase() !== selectedNeighborhood) return false
    if (selectedType !== 'all' && listing.housing_type !== selectedType) return false
    if (searchQuery && !listing.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
    
    // Price filter
    if (selectedPrice !== 'all') {
      const price = listing.price
      if (selectedPrice === '0-50000' && price > 50000) return false
      if (selectedPrice === '50000-100000' && (price < 50000 || price > 100000)) return false
      if (selectedPrice === '100000-200000' && (price < 100000 || price > 200000)) return false
      if (selectedPrice === '200000-500000' && (price < 200000 || price > 500000)) return false
      if (selectedPrice === '500000+' && price < 500000) return false
    }
    
    return true
  })

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      {/* Hero Search */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {content.heroTitle}
          </h1>
          <p className="text-blue-100 mb-8">
            {content.heroSubtitle}
          </p>
          
          {/* Search Bar */}
          <div className="bg-white rounded-xl p-4 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* City */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">{content.city}</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {content.cities.map(city => (
                      <option key={city.value} value={city.value}>{city.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Neighborhood (Quartier) */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  {content.neighborhood} 📍
                </label>
                <select
                  value={selectedNeighborhood}
                  onChange={(e) => setSelectedNeighborhood(e.target.value)}
                  disabled={selectedCity === 'all'}
                  className={`w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
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
              
              {/* Type */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">{content.propertyType}</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {content.propertyTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              
              {/* Price */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">{content.budget}</label>
                <select
                  value={selectedPrice}
                  onChange={(e) => setSelectedPrice(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {content.priceRanges.map(range => (
                    <option key={range.value} value={range.value}>{range.label}</option>
                  ))}
                </select>
              </div>
              
              {/* Search Button */}
              <div className="flex items-end">
                <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
                  <Search className="w-5 h-5 mr-2" />
                  {content.search}
                </Button>
              </div>
            </div>

            {/* Active Filters Tags */}
            {(selectedCity !== 'all' || selectedNeighborhood !== 'all' || selectedType !== 'all' || selectedPrice !== 'all') && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                {selectedCity !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
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
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    🏠 {content.propertyTypes.find(t => t.value === selectedType)?.label}
                    <button onClick={() => setSelectedType('all')} className="hover:text-blue-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedPrice !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                    💰 {content.priceRanges.find(r => r.value === selectedPrice)?.label}
                    <button onClick={() => setSelectedPrice('all')} className="hover:text-yellow-900">
                      <X className="w-3 h-3" />
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
            
            <div className="flex items-center gap-2">
              {/* View Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
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
                  <div className={`bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all ${
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
          {!loading && filteredListings.length === 0 && (
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
