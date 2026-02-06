'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Search, Calendar, MapPin, Fuel, Settings2, Users, 
  Heart, CheckCircle, Car, ChevronDown, Filter
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { getListings, Listing } from '@/lib/supabase/queries'
import { useTranslation } from '@/lib/i18n/context'

function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR').format(price)
}

export default function CarsPage() {
  const { t, lang } = useTranslation()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  
  // Filters
  const [selectedCity, setSelectedCity] = useState('all')
  const [selectedBrand, setSelectedBrand] = useState('all')
  const [selectedFuel, setSelectedFuel] = useState('all')
  const [rentalType, setRentalType] = useState<'rent' | 'buy'>('rent')

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
    heroTitle: lang === 'fr' ? 'Location & Vente de véhicules' : 'Vehicle Rental & Sales',
    heroSubtitle: lang === 'fr' ? 'Trouvez la voiture parfaite au Cameroun' : 'Find the perfect car in Cameroon',
    rent: lang === 'fr' ? 'Louer' : 'Rent',
    buy: lang === 'fr' ? 'Acheter' : 'Buy',
    pickupLocation: lang === 'fr' ? 'Lieu de prise en charge' : 'Pickup location',
    startDate: lang === 'fr' ? 'Date de début' : 'Start date',
    endDate: lang === 'fr' ? 'Date de fin' : 'End date',
    brand: lang === 'fr' ? 'Marque' : 'Brand',
    fuel: lang === 'fr' ? 'Carburant' : 'Fuel',
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

  // Filter listings
  const filteredListings = listings.filter(listing => {
    if (selectedCity !== 'all' && listing.city !== selectedCity) return false
    if (selectedBrand !== 'all' && listing.car_brand !== selectedBrand) return false
    return true
  })

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      {/* Hero Search - Sixt/Mobile.de Style */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-700 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {content.heroTitle}
          </h1>
          <p className="text-orange-100 mb-8">
            {content.heroSubtitle}
          </p>
          
          {/* Rent/Buy Toggle - Sixt Style */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setRentalType('rent')}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                rentalType === 'rent'
                  ? 'bg-white text-orange-600'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              🚗 {content.rent}
            </button>
            <button
              onClick={() => setRentalType('buy')}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                rentalType === 'buy'
                  ? 'bg-white text-orange-600'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              🏷️ {content.buy}
            </button>
          </div>
          
          {/* Search Bar - Mobile.de Style */}
          <div className="bg-white rounded-xl p-4 shadow-lg">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Location */}
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  📍 {content.pickupLocation}
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  
                  {/* Date To */}
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      📅 {content.endDate}
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      {content.fuelTypes.map(fuel => (
                        <option key={fuel.value} value={fuel.value}>{fuel.label}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}
              
              {/* Search Button */}
              <div className="flex items-end">
                <Button size="lg" className="w-full md:w-auto bg-orange-600 hover:bg-orange-700">
                  <Search className="w-5 h-5 mr-2" />
                  {content.search}
                </Button>
              </div>
            </div>
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
                className="flex-shrink-0 flex items-center gap-3 px-4 py-2 bg-gray-50 hover:bg-orange-50 rounded-lg transition-colors"
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
            
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              {content.moreFilters}
            </Button>
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
                        {listing.car_brand && (
                          <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                            {listing.car_brand}
                          </span>
                        )}
                        {listing.car_year && (
                          <span className="text-xs text-gray-500">{listing.car_year}</span>
                        )}
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors mb-2">
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
                        {listing.price_per_day ? (
                          <div>
                            <span className="text-2xl font-bold text-orange-600">
                              {formatPrice(listing.price_per_day)}
                            </span>
                            <span className="text-gray-500 text-sm"> XAF{t.listings.perDay}</span>
                          </div>
                        ) : (
                          <div>
                            <span className="text-2xl font-bold text-orange-600">
                              {formatPrice(listing.price)}
                            </span>
                            <span className="text-gray-500 text-sm"> XAF</span>
                          </div>
                        )}
                        <Button size="sm" variant="outline" className="text-orange-600 border-orange-600 hover:bg-orange-50">
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
