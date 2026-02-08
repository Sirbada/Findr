'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Search, MapPin, Heart, Square, ChevronDown, Grid, List
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { getListings, Listing } from '@/lib/supabase/queries'
import { useTranslation } from '@/lib/i18n/context'
import { useAuth } from '@/lib/auth/context'
import { useFavorites } from '@/lib/supabase/favorites'

function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR').format(price)
}

const terrainTypes = [
  { value: 'all', label: 'Tous les types' },
  { value: 'constructible', label: 'Constructible' },
  { value: 'agricole', label: 'Agricole' },
  { value: 'commercial', label: 'Commercial' },
]

const cities = [
  { value: 'all', label: 'Toutes les villes' },
  { value: 'Douala', label: 'Douala' },
  { value: 'Yaoundé', label: 'Yaoundé' },
  { value: 'Kribi', label: 'Kribi' },
  { value: 'Bafoussam', label: 'Bafoussam' },
  { value: 'Bamenda', label: 'Bamenda' },
  { value: 'Limbe', label: 'Limbe' },
  { value: 'Buea', label: 'Buea' },
]

export default function TerrainPage() {
  const { lang } = useTranslation()
  const { user } = useAuth()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCity, setSelectedCity] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const { favorites, toggle: toggleFav } = useFavorites(user?.id)

  useEffect(() => {
    async function fetch() {
      const data = await getListings({ category: 'terrain' })
      setListings(data)
      setLoading(false)
    }
    fetch()
  }, [])

  const filtered = listings.filter(l => {
    if (selectedCity !== 'all' && l.city !== selectedCity) return false
    if (selectedType !== 'all' && l.terrain_type !== selectedType) return false
    return true
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price
    if (sortBy === 'price-high') return b.price - a.price
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      {/* Hero */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            🏗️ Terrains à vendre
          </h1>
          <p className="text-emerald-100 mb-8">
            Parcelles constructibles, agricoles et commerciales au Cameroun
          </p>

          <div className="bg-white rounded-xl p-4 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Ville</label>
                <select value={selectedCity} onChange={e => setSelectedCity(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-emerald-500">
                  {cities.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Type de terrain</label>
                <select value={selectedType} onChange={e => setSelectedType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-emerald-500">
                  {terrainTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Trier par</label>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-emerald-500">
                  <option value="newest">Plus récent</option>
                  <option value="price-low">Prix croissant</option>
                  <option value="price-high">Prix décroissant</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button size="lg" className="w-full bg-emerald-600 hover:bg-emerald-700">
                  <Search className="w-5 h-5 mr-2" /> Rechercher
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <main className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-sm text-gray-500 mb-6">
            {filtered.length} terrain{filtered.length !== 1 ? 's' : ''} trouvé{filtered.length !== 1 ? 's' : ''}
          </p>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 rounded-xl h-48 mb-3" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <Square className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun terrain trouvé</h3>
              <p className="text-gray-500">Essayez de modifier vos critères</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(listing => {
                const isFav = favorites.has(listing.id)
                return (
                  <div key={listing.id} className="group">
                    <Link href={`/terrain/${listing.id}`}>
                      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                        <div className="relative h-48 overflow-hidden">
                          {listing.images?.[0] ? (
                            <img src={listing.images[0]} alt={listing.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          ) : (
                            <div className="w-full h-full bg-emerald-50 flex items-center justify-center">
                              <span className="text-4xl">🏗️</span>
                            </div>
                          )}
                          <span className="absolute top-3 left-3 bg-emerald-600 text-white text-xs px-2 py-1 rounded">
                            {listing.terrain_type || 'Terrain'}
                          </span>
                          {listing.title_deed && (
                            <span className="absolute top-3 right-12 bg-green-600 text-white text-xs px-2 py-1 rounded">
                              📄 Titre foncier
                            </span>
                          )}
                          <button onClick={(e) => { e.preventDefault(); if (user) toggleFav(listing.id) }}
                            className="absolute top-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
                            <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                          </button>
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-1 mb-1">
                            {listing.title}
                          </h3>
                          <div className="flex items-center text-gray-500 text-sm mb-2">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span className="truncate">{listing.neighborhood ? `${listing.neighborhood}, ` : ''}{listing.city}</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
                            {listing.surface_m2 && (
                              <span className="flex items-center gap-1">
                                <Square className="w-4 h-4" /> {listing.surface_m2} m²
                              </span>
                            )}
                            {listing.latitude && listing.longitude && (
                              <span className="text-emerald-600">📍 GPS</span>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-emerald-600">
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
