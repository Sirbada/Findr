'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import {
  MapPin, Square, ArrowLeft, ChevronLeft, ChevronRight, X,
  Heart, Share2, Shield, CheckCircle
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { getListing, Listing } from '@/lib/supabase/queries'
import { useTranslation } from '@/lib/i18n/context'

export default function TerrainDetailPage() {
  const params = useParams()
  const listingId = params.id as string
  const { lang } = useTranslation()

  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showImageModal, setShowImageModal] = useState(false)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const data = await getListing(listingId)
      setListing(data)
      setLoading(false)
    }
    fetchData()
  }, [listingId])

  const formatPrice = (price: number) => new Intl.NumberFormat('fr-FR').format(price)

  const nextImage = () => {
    if (!listing?.images) return
    setCurrentImageIndex(prev => prev === listing.images.length - 1 ? 0 : prev + 1)
  }
  const prevImage = () => {
    if (!listing?.images) return
    setCurrentImageIndex(prev => prev === 0 ? listing.images.length - 1 : prev - 1)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Terrain non trouvé</h1>
            <Button onClick={() => window.history.back()}>Retour</Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <button onClick={() => window.history.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-5 h-5" /> Retour aux terrains
          </button>
        </div>
      </div>

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{listing.title}</h1>
                  {listing.title_deed && (
                    <span className="bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-full">
                      📄 Titre foncier
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-gray-600 mb-3">
                  <MapPin className="w-5 h-5" />
                  <span>{listing.neighborhood && `${listing.neighborhood}, `}{listing.city}</span>
                </div>
                <div className="flex items-center gap-6 text-gray-600">
                  {listing.surface_m2 && (
                    <div className="flex items-center gap-1">
                      <Square className="w-5 h-5" /> {listing.surface_m2} m²
                    </div>
                  )}
                  {listing.terrain_type && (
                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium capitalize">
                      {listing.terrain_type}
                    </span>
                  )}
                  {listing.zoning && (
                    <span className="text-sm text-gray-500">Zone: {listing.zoning}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="secondary" size="sm"><Heart className="w-4 h-4 mr-1" /> Sauvegarder</Button>
                <Button variant="secondary" size="sm"><Share2 className="w-4 h-4 mr-1" /> Partager</Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left */}
            <div className="lg:col-span-2 space-y-8">
              {/* Images */}
              <div className="bg-white rounded-xl overflow-hidden shadow-sm">
                {listing.images && listing.images.length > 0 ? (
                  <div className="relative">
                    <div className="aspect-video bg-gray-200 relative overflow-hidden">
                      <img src={listing.images[currentImageIndex]} alt={listing.title}
                        className="w-full h-full object-cover" />
                      {listing.images.length > 1 && (
                        <>
                          <button onClick={prevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white">
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          <button onClick={nextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white">
                            <ChevronRight className="w-5 h-5" />
                          </button>
                          <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                            {currentImageIndex + 1} / {listing.images.length}
                          </div>
                        </>
                      )}
                    </div>
                    {listing.images.length > 1 && (
                      <div className="flex gap-2 p-4 overflow-x-auto">
                        {listing.images.map((img, i) => (
                          <button key={i} onClick={() => setCurrentImageIndex(i)}
                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                              i === currentImageIndex ? 'border-emerald-500' : 'border-transparent hover:border-gray-300'
                            }`}>
                            <img src={img} alt="" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="aspect-video bg-emerald-50 flex items-center justify-center">
                    <span className="text-6xl">🏗️</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
                <p className="text-gray-700 leading-relaxed">
                  {listing.description || 'Aucune description disponible.'}
                </p>
              </div>

              {/* GPS Location */}
              {listing.latitude && listing.longitude && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">📍 Localisation</h2>
                  <a
                    href={`https://www.google.com/maps?q=${listing.latitude},${listing.longitude}`}
                    target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-3 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors font-medium"
                  >
                    <MapPin className="w-5 h-5" />
                    Voir sur Google Maps ({listing.latitude.toFixed(5)}, {listing.longitude.toFixed(5)})
                  </a>
                </div>
              )}
            </div>

            {/* Right - Price Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-emerald-600">
                    {formatPrice(listing.price)} XAF
                  </div>
                  {listing.surface_m2 && listing.price > 0 && (
                    <div className="text-sm text-gray-500 mt-1">
                      {formatPrice(Math.round(listing.price / listing.surface_m2))} XAF/m²
                    </div>
                  )}
                </div>

                <div className="space-y-3 mb-6 p-4 bg-gray-50 rounded-lg">
                  {listing.surface_m2 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Surface</span>
                      <span className="font-semibold">{listing.surface_m2} m²</span>
                    </div>
                  )}
                  {listing.terrain_type && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type</span>
                      <span className="font-semibold capitalize">{listing.terrain_type}</span>
                    </div>
                  )}
                  {listing.zoning && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Zonage</span>
                      <span className="font-semibold">{listing.zoning}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Titre foncier</span>
                    <span className="font-semibold">{listing.title_deed ? '✅ Oui' : '❌ Non'}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {listing.whatsapp_number && (
                    <a
                      href={`https://wa.me/${listing.whatsapp_number.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Bonjour, je suis intéressé(e) par votre terrain "${listing.title}" sur Findr.`)}`}
                      target="_blank" rel="noopener noreferrer"
                    >
                      <Button size="lg" className="w-full bg-green-600 hover:bg-green-700">
                        💬 Contacter via WhatsApp
                      </Button>
                    </a>
                  )}
                  {listing.latitude && listing.longitude && (
                    <a
                      href={`https://www.google.com/maps?q=${listing.latitude},${listing.longitude}`}
                      target="_blank" rel="noopener noreferrer"
                    >
                      <Button variant="secondary" size="lg" className="w-full mt-3">
                        📍 Voir sur la carte
                      </Button>
                    </a>
                  )}
                </div>

                <div className="mt-6 p-4 bg-emerald-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-emerald-800">
                      <p className="font-medium mb-1">Conseil Findr</p>
                      <p>Vérifiez toujours le titre foncier avant tout achat de terrain.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Sticky WhatsApp Button - Mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-white border-t shadow-lg md:hidden">
        {listing.whatsapp_number ? (
          <a
            href={`https://wa.me/${listing.whatsapp_number.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Bonjour, je suis intéressé par votre terrain "${listing.title}" sur Findr.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-green-500 hover:bg-green-600 text-white py-4 px-6 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-colors"
            style={{backgroundColor: '#25D366'}}
          >
            💬 Contacter via WhatsApp
          </a>
        ) : (
          <button
            className="w-full bg-green-500 hover:bg-green-600 text-white py-4 px-6 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-colors"
            style={{backgroundColor: '#25D366'}}
          >
            💬 Demander le numéro
          </button>
        )}
      </div>

      <Footer />
    </div>
  )
}
