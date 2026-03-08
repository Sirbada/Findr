'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, Home, Car, Upload, X, MapPin, 
  DollarSign, Loader2, CheckCircle, Save
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { getNeighborhoodsByCity } from '@/lib/data/neighborhoods'
import { useAuth } from '@/lib/auth/context'
import { getListing, updateListing, type Listing } from '@/lib/supabase/queries'

const housingTypes = [
  { value: 'apartment', label: 'Appartement' },
  { value: 'house', label: 'Maison' },
  { value: 'studio', label: 'Studio' },
  { value: 'room', label: 'Chambre' },
  { value: 'land', label: 'Terrain' },
  { value: 'commercial', label: 'Local commercial' },
]

const rentalPeriods = [
  { value: 'day', label: 'Par jour' },
  { value: 'week', label: 'Par semaine' },
  { value: 'month', label: 'Par mois' },
  { value: 'year', label: 'Par an' },
  { value: 'sale', label: 'À vendre' },
]

const cities = [
  'Douala', 'Yaoundé', 'Bafoussam', 'Bamenda', 'Garoua', 
  'Kribi', 'Limbe', 'Buea', 'Maroua', 'Ngaoundéré'
]

const amenities = [
  'Climatisation', 'Parking', 'Gardien', 'Eau chaude',
  'WiFi', 'Meublé', 'Jardin', 'Balcon', 'Groupe électrogène',
  'Cuisine équipée', 'Piscine', 'Salle de sport'
]

export default function EditListingPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user } = useAuth()
  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [availableNeighborhoods, setAvailableNeighborhoods] = useState<any[]>([])
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])

  // Form data
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    city: '',
    neighborhood: '',
    // Housing
    housingType: '',
    rentalPeriod: 'month',
    rooms: '',
    bathrooms: '',
    surface: '',
    furnished: false,
    // Cars
    carBrand: '',
    carModel: '',
    carYear: '',
    fuelType: 'petrol',
    transmission: 'manual',
    pricePerDay: '',
  })

  // Load listing data
  useEffect(() => {
    async function loadListing() {
      try {
        const data = await getListing(params.id)
        if (!data) {
          alert('Annonce non trouvée')
          router.push('/dashboard')
          return
        }

        // Check ownership
        if (data.user_id !== user?.id) {
          alert('Vous ne pouvez modifier que vos propres annonces')
          router.push('/dashboard')
          return
        }

        setListing(data)
        setFormData({
          title: data.title || '',
          description: data.description || '',
          price: data.price?.toString() || '',
          city: data.city || '',
          neighborhood: data.neighborhood || '',
          housingType: data.housing_type || '',
          rentalPeriod: data.rental_period || 'month',
          rooms: data.rooms?.toString() || '',
          bathrooms: data.bathrooms?.toString() || '',
          surface: data.surface_m2?.toString() || '',
          furnished: data.furnished || false,
          carBrand: data.car_brand || '',
          carModel: data.car_model || '',
          carYear: data.car_year?.toString() || '',
          fuelType: data.fuel_type || 'petrol',
          transmission: data.transmission || 'manual',
          pricePerDay: data.price_per_day?.toString() || '',
        })
        setSelectedAmenities(data.amenities || [])
      } catch (error) {
        console.error('Error loading listing:', error)
        alert('Erreur lors du chargement')
        router.push('/dashboard')
      } finally {
        setLoading(false)
      }
    }

    if (params.id && user?.id) {
      loadListing()
    }
  }, [params.id, user?.id, router])

  // Update neighborhoods when city changes
  useEffect(() => {
    if (formData.city) {
      const neighborhoods = getNeighborhoodsByCity(formData.city)
      setAvailableNeighborhoods(neighborhoods)
    } else {
      setAvailableNeighborhoods([])
    }
  }, [formData.city])

  const handleSubmit = async () => {
    if (!listing) return

    setSaving(true)
    try {
      const updateData = {
        title: formData.title,
        description: formData.description,
        price: parseInt(formData.price) || 0,
        city: formData.city,
        neighborhood: formData.neighborhood,
        // Housing specific
        ...(listing.category === 'housing' && {
          housing_type: formData.housingType,
          rental_period: formData.rentalPeriod,
          rooms: parseInt(formData.rooms) || null,
          bathrooms: parseInt(formData.bathrooms) || null,
          surface_m2: parseInt(formData.surface) || null,
          furnished: formData.furnished,
          amenities: selectedAmenities,
        }),
        // Cars specific
        ...(listing.category === 'cars' && {
          car_brand: formData.carBrand,
          car_model: formData.carModel,
          car_year: parseInt(formData.carYear) || null,
          fuel_type: formData.fuelType,
          transmission: formData.transmission,
          price_per_day: parseInt(formData.pricePerDay) || null,
        })
      }

      await updateListing(listing.id, updateData)
      alert('Annonce mise à jour avec succès!')
      router.push('/dashboard')
    } catch (error) {
      console.error('Error updating listing:', error)
      alert('Erreur lors de la mise à jour. Veuillez réessayer.')
    } finally {
      setSaving(false)
    }
  }

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    )
  }

  if (loading || !listing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Chargement de l'annonce...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center text-gray-600 hover:text-blue-600">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Retour au tableau de bord
            </Link>
            <div className="text-sm text-gray-500">
              Modification d'annonce
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Modifier l'annonce
          </h1>
          <p className="text-gray-600 mb-8">
            Modifiez les détails de votre {listing.category === 'housing' ? 'bien' : 'véhicule'}
          </p>

          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre de l'annonce *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder={listing.category === 'housing' 
                  ? "Ex: Appartement 3 pièces à Bonanjo" 
                  : "Ex: Toyota Corolla 2020 à louer"
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category specific fields */}
            {listing.category === 'housing' && (
              <>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type de bien *
                    </label>
                    <select
                      value={formData.housingType}
                      onChange={(e) => setFormData({...formData, housingType: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Sélectionner</option>
                      {housingTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type d'offre *
                    </label>
                    <select
                      value={formData.rentalPeriod}
                      onChange={(e) => setFormData({...formData, rentalPeriod: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {rentalPeriods.map(period => (
                        <option key={period.value} value={period.value}>{period.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chambres
                    </label>
                    <input
                      type="number"
                      value={formData.rooms}
                      onChange={(e) => setFormData({...formData, rooms: e.target.value})}
                      placeholder="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Salles de bain
                    </label>
                    <input
                      type="number"
                      value={formData.bathrooms}
                      onChange={(e) => setFormData({...formData, bathrooms: e.target.value})}
                      placeholder="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Surface (m²)
                    </label>
                    <input
                      type="number"
                      value={formData.surface}
                      onChange={(e) => setFormData({...formData, surface: e.target.value})}
                      placeholder="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Équipements
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {amenities.map(amenity => (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => toggleAmenity(amenity)}
                        className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                          selectedAmenities.includes(amenity)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {amenity}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {listing.category === 'cars' && (
              <>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Marque *
                    </label>
                    <input
                      type="text"
                      value={formData.carBrand}
                      onChange={(e) => setFormData({...formData, carBrand: e.target.value})}
                      placeholder="Ex: Toyota"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Modèle *
                    </label>
                    <input
                      type="text"
                      value={formData.carModel}
                      onChange={(e) => setFormData({...formData, carModel: e.target.value})}
                      placeholder="Ex: Corolla"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Année
                    </label>
                    <input
                      type="number"
                      value={formData.carYear}
                      onChange={(e) => setFormData({...formData, carYear: e.target.value})}
                      placeholder="2020"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Carburant
                    </label>
                    <select
                      value={formData.fuelType}
                      onChange={(e) => setFormData({...formData, fuelType: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="petrol">Essence</option>
                      <option value="diesel">Diesel</option>
                      <option value="electric">Électrique</option>
                      <option value="hybrid">Hybride</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Transmission
                    </label>
                    <select
                      value={formData.transmission}
                      onChange={(e) => setFormData({...formData, transmission: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="manual">Manuelle</option>
                      <option value="automatic">Automatique</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={4}
                placeholder="Décrivez votre bien en détail..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Location */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ville *
                </label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionner une ville</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quartier *
                </label>
                <select
                  value={formData.neighborhood}
                  onChange={(e) => setFormData({...formData, neighborhood: e.target.value})}
                  disabled={!formData.city}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    !formData.city ? 'bg-gray-50 text-gray-400' : ''
                  }`}
                >
                  <option value="">
                    {!formData.city ? 'Sélectionnez d\'abord une ville' : 'Choisir un quartier'}
                  </option>
                  {availableNeighborhoods.map(neighborhood => (
                    <option key={neighborhood.value} value={neighborhood.value}>
                      {neighborhood.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix *
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={listing.category === 'housing' ? formData.price : formData.pricePerDay}
                  onChange={(e) => setFormData({
                    ...formData, 
                    [listing.category === 'housing' ? 'price' : 'pricePerDay']: e.target.value
                  })}
                  placeholder="0"
                  className="w-full px-4 py-3 pr-20 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                  XAF {listing.category === 'cars' ? '/ jour' : formData.rentalPeriod === 'sale' ? '' : '/ mois'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Link href="/dashboard" className="flex-1">
                <Button variant="outline" className="w-full">
                  Annuler
                </Button>
              </Link>
              <Button onClick={handleSubmit} disabled={saving} className="flex-1">
                {saving ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Sauvegarder
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}