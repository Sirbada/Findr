'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, Home, Car, Upload, X, MapPin, 
  DollarSign, Image as ImageIcon, Loader2, CheckCircle
} from 'lucide-react'
import { Button } from '@/components/ui/Button'

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

export default function NewListingPage() {
  const [step, setStep] = useState(1)
  const [category, setCategory] = useState<'housing' | 'cars' | null>(null)
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<string[]>([])
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

  const handleSubmit = async () => {
    setLoading(true)
    // TODO: Implement actual submission
    setTimeout(() => {
      setLoading(false)
      setStep(4) // Success step
    }, 2000)
  }

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center text-gray-600 hover:text-emerald-600">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Retour
            </Link>
            <span className="text-sm text-gray-500">
              Étape {step} / 3
            </span>
          </div>
        </div>
      </header>

      {/* Progress bar */}
      <div className="bg-white border-b">
        <div className="max-w-3xl mx-auto px-4">
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-600 transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Step 1: Category Selection */}
        {step === 1 && (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Nouvelle annonce
            </h1>
            <p className="text-gray-600 mb-8">
              Que souhaitez-vous publier ?
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              <button
                onClick={() => { setCategory('housing'); setStep(2); }}
                className={`p-6 rounded-2xl border-2 text-left transition-all ${
                  category === 'housing'
                    ? 'border-emerald-600 bg-emerald-50'
                    : 'border-gray-200 hover:border-emerald-300 hover:bg-gray-50'
                }`}
              >
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <Home className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Immobilier
                </h3>
                <p className="text-sm text-gray-500">
                  Appartement, maison, terrain, local commercial
                </p>
              </button>

              <button
                onClick={() => { setCategory('cars'); setStep(2); }}
                className={`p-6 rounded-2xl border-2 text-left transition-all ${
                  category === 'cars'
                    ? 'border-emerald-600 bg-emerald-50'
                    : 'border-gray-200 hover:border-emerald-300 hover:bg-gray-50'
                }`}
              >
                <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                  <Car className="w-7 h-7 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Véhicule
                </h3>
                <p className="text-sm text-gray-500">
                  Voiture à louer ou à vendre
                </p>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Détails de l'annonce
            </h1>
            <p className="text-gray-600 mb-8">
              Décrivez votre {category === 'housing' ? 'bien' : 'véhicule'}
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
                  placeholder={category === 'housing' 
                    ? "Ex: Appartement 3 pièces à Bonanjo" 
                    : "Ex: Toyota Corolla 2020 à louer"
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Category specific fields */}
              {category === 'housing' && (
                <>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type de bien *
                      </label>
                      <select
                        value={formData.housingType}
                        onChange={(e) => setFormData({...formData, housingType: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                              ? 'bg-emerald-600 text-white'
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

              {category === 'cars' && (
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Carburant
                      </label>
                      <select
                        value={formData.fuelType}
                        onChange={(e) => setFormData({...formData, fuelType: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Sélectionner</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quartier
                  </label>
                  <input
                    type="text"
                    value={formData.neighborhood}
                    onChange={(e) => setFormData({...formData, neighborhood: e.target.value})}
                    placeholder="Ex: Bonanjo, Bastos..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
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
                    value={category === 'housing' ? formData.price : formData.pricePerDay}
                    onChange={(e) => setFormData({
                      ...formData, 
                      [category === 'housing' ? 'price' : 'pricePerDay']: e.target.value
                    })}
                    placeholder="0"
                    className="w-full px-4 py-3 pr-20 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                    XAF {category === 'cars' ? '/ jour' : formData.rentalPeriod === 'sale' ? '' : '/ mois'}
                  </span>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Retour
                </Button>
                <Button onClick={() => setStep(3)} className="flex-1">
                  Continuer
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Photos */}
        {step === 3 && (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Photos
            </h1>
            <p className="text-gray-600 mb-8">
              Ajoutez des photos pour attirer plus de visiteurs
            </p>

            <div className="bg-white rounded-2xl shadow-sm p-6">
              {/* Upload area */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-emerald-500 transition-colors cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">
                  Glissez vos photos ici ou cliquez pour sélectionner
                </p>
                <p className="text-sm text-gray-400">
                  PNG, JPG jusqu'à 5MB • Maximum 10 photos
                </p>
                <input type="file" className="hidden" multiple accept="image/*" />
              </div>

              {/* Preview */}
              {images.length > 0 && (
                <div className="mt-6 grid grid-cols-3 gap-4">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative">
                      <img src={img} alt="" className="w-full h-24 object-cover rounded-lg" />
                      <button className="absolute top-1 right-1 p-1 bg-white rounded-full shadow">
                        <X className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-sm text-gray-500 mt-4">
                💡 Conseil: Les annonces avec photos reçoivent 10x plus de vues
              </p>

              {/* Navigation */}
              <div className="flex gap-3 pt-6">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                  Retour
                </Button>
                <Button onClick={handleSubmit} disabled={loading} className="flex-1">
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    'Publier l\'annonce'
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Annonce publiée !
            </h1>
            <p className="text-gray-600 mb-8">
              Votre annonce est maintenant visible sur Findr
            </p>
            <div className="flex justify-center gap-3">
              <Link href="/dashboard">
                <Button variant="outline">Voir mes annonces</Button>
              </Link>
              <Link href="/">
                <Button>Retour à l'accueil</Button>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
