'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Search, MapPin, Star, Clock, Wrench, 
  Heart, CheckCircle, ChevronDown, User
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { getListings, Listing } from '@/lib/supabase/queries'
import { useTranslation } from '@/lib/i18n/context'

function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR').format(price)
}

export function ServicesPageClient() {
  const { t, lang } = useTranslation()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  
  // Filters
  const [selectedCity, setSelectedCity] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedPrice, setSelectedPrice] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')

  const content = {
    cities: [
      { value: 'all', label: lang === 'fr' ? 'Toutes les villes' : 'All cities' },
      { value: 'Douala', label: 'Douala' },
      { value: 'Yaoundé', label: 'Yaoundé' },
      { value: 'Bafoussam', label: 'Bafoussam' },
      { value: 'Bamenda', label: 'Bamenda' },
      { value: 'Limbe', label: 'Limbe' },
    ],
    categories: lang === 'fr' ? [
      { value: 'all', label: 'Toutes les catégories' },
      { value: 'home', label: 'Maison & Jardin' },
      { value: 'tech', label: 'Informatique & Tech' },
      { value: 'education', label: 'Formation & Cours' },
      { value: 'health', label: 'Santé & Bien-être' },
      { value: 'beauty', label: 'Beauté & Soins' },
      { value: 'transport', label: 'Transport & Livraison' },
      { value: 'business', label: 'Consulting & Business' },
      { value: 'events', label: 'Événements & Fêtes' },
    ] : [
      { value: 'all', label: 'All categories' },
      { value: 'home', label: 'Home & Garden' },
      { value: 'tech', label: 'IT & Tech' },
      { value: 'education', label: 'Education & Courses' },
      { value: 'health', label: 'Health & Wellness' },
      { value: 'beauty', label: 'Beauty & Care' },
      { value: 'transport', label: 'Transport & Delivery' },
      { value: 'business', label: 'Consulting & Business' },
      { value: 'events', label: 'Events & Parties' },
    ],
    priceRanges: lang === 'fr' ? [
      { value: 'all', label: 'Tous les prix' },
      { value: '0-25000', label: 'Moins de 25 000 XAF' },
      { value: '25000-50000', label: '25 000 - 50 000 XAF' },
      { value: '50000-100000', label: '50 000 - 100 000 XAF' },
      { value: '100000-200000', label: '100 000 - 200 000 XAF' },
      { value: '200000+', label: 'Plus de 200 000 XAF' },
    ] : [
      { value: 'all', label: 'All prices' },
      { value: '0-25000', label: 'Under 25,000 XAF' },
      { value: '25000-50000', label: '25,000 - 50,000 XAF' },
      { value: '50000-100000', label: '50,000 - 100,000 XAF' },
      { value: '100000-200000', label: '100,000 - 200,000 XAF' },
      { value: '200000+', label: 'Over 200,000 XAF' },
    ],
    heroTitle: lang === 'fr' ? 'Trouvez le bon professionnel' : 'Find the right professional',
    heroSubtitle: lang === 'fr' ? 'Des milliers de professionnels vérifiés pour tous vos besoins au Cameroun' : 'Thousands of verified professionals for all your needs in Cameroon',
    search: lang === 'fr' ? 'Rechercher' : 'Search',
    city: lang === 'fr' ? 'Ville' : 'City',
    category: lang === 'fr' ? 'Catégorie' : 'Category',
    price: lang === 'fr' ? 'Budget' : 'Budget',
    resultsFound: (count: number) => lang === 'fr' 
      ? `${count} service${count > 1 ? 's' : ''} trouvé${count > 1 ? 's' : ''}`
      : `${count} ${count === 1 ? 'service' : 'services'} found`,
    allCameroon: lang === 'fr' ? 'Tout le Cameroun' : 'All Cameroon',
    verified: lang === 'fr' ? 'Vérifié' : 'Verified',
    featured: lang === 'fr' ? 'En vedette' : 'Featured',
    from: lang === 'fr' ? 'À partir de' : 'Starting from',
    noResults: lang === 'fr' ? 'Aucun service trouvé' : 'No services found',
    tryDifferent: lang === 'fr' ? 'Essayez de modifier vos critères de recherche' : 'Try adjusting your search criteria',
  }

  useEffect(() => {
    async function fetchListings() {
      const data = await getListings({ category: 'services' })
      setListings(data)
      setLoading(false)
    }
    fetchListings()
  }, [])

  // Filter and sort listings
  const filteredAndSortedListings = (() => {
    let filtered = listings.filter(listing => {
      if (selectedCity !== 'all' && listing.city !== selectedCity) return false
      if (searchQuery && !listing.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !listing.description?.toLowerCase().includes(searchQuery.toLowerCase())) return false
      
      // Price filter
      if (selectedPrice !== 'all') {
        const price = listing.price
        if (selectedPrice === '0-25000' && price > 25000) return false
        if (selectedPrice === '25000-50000' && (price < 25000 || price > 50000)) return false
        if (selectedPrice === '50000-100000' && (price < 50000 || price > 100000)) return false
        if (selectedPrice === '100000-200000' && (price < 100000 || price > 200000)) return false
        if (selectedPrice === '200000+' && price < 200000) return false
      }
      
      return true
    })

    switch (sortBy) {
      case 'price-low':
        return filtered.sort((a, b) => a.price - b.price)
      case 'price-high':
        return filtered.sort((a, b) => b.price - a.price)
      case 'rating':
        return filtered.sort((a, b) => b.views - a.views) // Using views as proxy for rating
      case 'newest':
      default:
        return filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }
  })()

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      {/* Hero Search */}
      <div className="bg-gradient-to-r from-emerald-700 to-emerald-800 py-16 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {content.heroTitle}
          </h1>
          <p className="text-xl text-emerald-100 mb-12 max-w-2xl">
            {content.heroSubtitle}
          </p>
          
          {/* Search Bar */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service recherché
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ex: plombier, cours d'anglais..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-300 transition-all duration-300 bg-gray-50 hover:bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{content.city}</label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-300 transition-all duration-300 bg-gray-50 hover:bg-white"
                >
                  {content.cities.map(city => (
                    <option key={city.value} value={city.value}>{city.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{content.category}</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-300 transition-all duration-300 bg-gray-50 hover:bg-white"
                >
                  {content.categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-end">
                <Button size="lg" className="w-full bg-emerald-600 hover:bg-emerald-700 rounded-2xl py-3 font-medium">
                  <Search className="w-5 h-5 mr-3" />
                  {content.search}
                </Button>
              </div>
            </div>
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
                {selectedCity !== 'all' ? selectedCity : content.allCameroon}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none"
              >
                <option value="newest">Plus récent</option>
                <option value="rating">Mieux notés</option>
                <option value="price-low">Prix croissant</option>
                <option value="price-high">Prix décroissant</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Listings Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="animate-pulse bg-white rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full mr-3"></div>
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedListings.map((listing) => (
                <Link 
                  key={listing.id} 
                  href={`/services/${listing.id}`}
                  className="group"
                >
                  <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300 border border-gray-100">
                    {/* Provider Info */}
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                        <User className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Professionnel</h4>
                        <div className="flex items-center">
                          <div className="flex text-yellow-400">
                            {[1,2,3,4,5].map(i => (
                              <Star key={i} className="w-3 h-3 fill-current" />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500 ml-1">(25)</span>
                        </div>
                      </div>
                    </div>

                    {/* Service Title */}
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors mb-2 line-clamp-2">
                      {listing.title}
                    </h3>
                    
                    {/* Location */}
                    <div className="flex items-center text-gray-500 text-sm mb-3">
                      <MapPin className="w-4 h-4 mr-1" />
                      {listing.city}
                    </div>
                    
                    {/* Description */}
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                      {listing.description || 'Service professionnel de qualité...'}
                    </p>
                    
                    {/* Price and badges */}
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-lg font-bold text-emerald-600">
                          {content.from} {formatPrice(listing.price)} XAF
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {listing.is_verified && (
                          <span className="text-green-600 text-xs flex items-center">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            {content.verified}
                          </span>
                        )}
                        <button className="text-gray-400 hover:text-emerald-600 transition-colors">
                          <Heart className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Badges */}
                    <div className="flex gap-2 mt-3">
                      {listing.is_featured && (
                        <span className="bg-emerald-600 text-white text-xs font-medium px-2 py-1 rounded">
                          {content.featured}
                        </span>
                      )}
                      <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded">
                        Réponse rapide
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && filteredAndSortedListings.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-8 bg-emerald-100 rounded-full flex items-center justify-center">
                <Wrench className="w-12 h-12 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {content.noResults}
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {content.tryDifferent}
              </p>
              <Link href="/dashboard/new">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 px-8">
                  Proposer un service
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}