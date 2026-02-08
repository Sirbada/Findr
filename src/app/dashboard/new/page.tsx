'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft, Home, Car, Upload, X, Loader2, CheckCircle,
  Briefcase, Wrench, Image as ImageIcon
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { getNeighborhoodsByCity } from '@/lib/data/neighborhoods'
import { useAuth } from '@/lib/auth/context'
import { createListing } from '@/lib/supabase/queries'
import { uploadListingImage } from '@/lib/supabase/storage'

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
  const { user } = useAuth()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState(1)
  const [category, setCategory] = useState<'housing' | 'cars' | 'jobs' | 'services' | null>(null)
  const [loading, setLoading] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [availableNeighborhoods, setAvailableNeighborhoods] = useState<any[]>([])

  const [formData, setFormData] = useState({
    title: '', description: '', price: '', city: '', neighborhood: '',
    whatsappNumber: '',
    housingType: '', rentalPeriod: 'month', rooms: '', bathrooms: '', surface: '',
    carBrand: '', carModel: '', carYear: '', fuelType: 'petrol', transmission: 'manual',
  })

  useEffect(() => {
    if (formData.city) {
      setAvailableNeighborhoods(getNeighborhoodsByCity(formData.city))
      setFormData(prev => ({ ...prev, neighborhood: '' }))
    }
  }, [formData.city])

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (imageFiles.length + files.length > 5) {
      alert('Maximum 5 images')
      return
    }
    const newFiles = [...imageFiles, ...files].slice(0, 5)
    setImageFiles(newFiles)
    setImagePreviews(newFiles.map(f => URL.createObjectURL(f)))
  }

  const removeImage = (idx: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== idx))
    setImagePreviews(prev => prev.filter((_, i) => i !== idx))
  }

  const handleSubmit = async () => {
    if (!user?.id) {
      router.push('/login')
      return
    }

    setLoading(true)
    try {
      // Upload images first
      let imageUrls: string[] = []
      if (imageFiles.length > 0) {
        setUploadingImages(true)
        const uploads = await Promise.all(
          imageFiles.map(f => uploadListingImage(user.id, f))
        )
        imageUrls = uploads.filter(Boolean) as string[]
        setUploadingImages(false)
      }

      await createListing({
        category: category!,
        title: formData.title,
        description: formData.description,
        price: parseInt(formData.price) || 0,
        city: formData.city,
        neighborhood: formData.neighborhood,
        images: imageUrls,
        user_id: user.id,
        whatsapp_number: formData.whatsappNumber,
        ...(category === 'housing' && {
          housing_type: formData.housingType,
          rental_period: formData.rentalPeriod,
          rooms: parseInt(formData.rooms) || null,
          bathrooms: parseInt(formData.bathrooms) || null,
          surface_m2: parseInt(formData.surface) || null,
          amenities: selectedAmenities,
        }),
        ...(category === 'cars' && {
          car_brand: formData.carBrand,
          car_model: formData.carModel,
          car_year: parseInt(formData.carYear) || null,
          fuel_type: formData.fuelType,
          transmission: formData.transmission,
        }),
      } as any)
      setStep(4)
    } catch (error) {
      console.error('Error:', error)
      alert('Erreur lors de la création. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => step > 1 ? setStep(step - 1) : router.back()} className="flex items-center text-gray-600 hover:text-blue-600">
            <ArrowLeft className="w-5 h-5 mr-2" /> Retour
          </button>
          <span className="text-sm text-gray-500">Étape {Math.min(step, 3)} / 3</span>
        </div>
      </header>

      <div className="bg-white border-b">
        <div className="max-w-3xl mx-auto px-4">
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${(Math.min(step, 3) / 3) * 100}%` }} />
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Step 1: Category */}
        {step === 1 && (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Nouvelle annonce</h1>
            <p className="text-gray-600 mb-8">Que souhaitez-vous publier ?</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { key: 'housing' as const, icon: Home, label: 'Immobilier', desc: 'Appartement, maison, terrain' },
                { key: 'cars' as const, icon: Car, label: 'Véhicules', desc: 'Voiture à louer ou vendre' },
                { key: 'jobs' as const, icon: Briefcase, label: 'Emplois', desc: "Offres d'emploi" },
                { key: 'services' as const, icon: Wrench, label: 'Services', desc: 'Prestations de services' },
              ].map(cat => (
                <button
                  key={cat.key}
                  onClick={() => { setCategory(cat.key); setStep(2) }}
                  className="p-6 rounded-2xl border-2 border-gray-200 hover:border-blue-300 hover:bg-gray-50 text-left transition-all"
                >
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                    <cat.icon className="w-7 h-7 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{cat.label}</h3>
                  <p className="text-sm text-gray-500">{cat.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Détails de l'annonce</h1>
            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Titre *</label>
                <input type="text" value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  placeholder="Ex: Appartement 3 pièces à Bonanjo"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              {category === 'housing' && (
                <>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Type de bien</label>
                      <select value={formData.housingType} onChange={e => setFormData({...formData, housingType: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Sélectionner</option>
                        {['Appartement', 'Maison', 'Studio', 'Chambre', 'Terrain', 'Local commercial'].map(t => (
                          <option key={t} value={t.toLowerCase()}>{t}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Type d'offre</label>
                      <select value={formData.rentalPeriod} onChange={e => setFormData({...formData, rentalPeriod: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="month">Par mois</option>
                        <option value="day">Par jour</option>
                        <option value="year">Par an</option>
                        <option value="sale">À vendre</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Chambres</label>
                      <input type="number" value={formData.rooms} onChange={e => setFormData({...formData, rooms: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Salles de bain</label>
                      <input type="number" value={formData.bathrooms} onChange={e => setFormData({...formData, bathrooms: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Surface (m²)</label>
                      <input type="number" value={formData.surface} onChange={e => setFormData({...formData, surface: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Équipements</label>
                    <div className="flex flex-wrap gap-2">
                      {amenities.map(a => (
                        <button key={a} type="button"
                          onClick={() => setSelectedAmenities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a])}
                          className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                            selectedAmenities.includes(a) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}>{a}</button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {category === 'cars' && (
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Marque</label>
                    <input type="text" value={formData.carBrand} onChange={e => setFormData({...formData, carBrand: e.target.value})}
                      placeholder="Toyota" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Modèle</label>
                    <input type="text" value={formData.carModel} onChange={e => setFormData({...formData, carModel: e.target.value})}
                      placeholder="Corolla" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Année</label>
                    <input type="number" value={formData.carYear} onChange={e => setFormData({...formData, carYear: e.target.value})}
                      placeholder="2020" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Transmission</label>
                    <select value={formData.transmission} onChange={e => setFormData({...formData, transmission: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="manual">Manuelle</option>
                      <option value="automatic">Automatique</option>
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                  rows={4} placeholder="Décrivez votre annonce en détail..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ville *</label>
                  <select value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Sélectionner</option>
                    {cities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quartier</label>
                  <select value={formData.neighborhood} onChange={e => setFormData({...formData, neighborhood: e.target.value})}
                    disabled={!formData.city}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">{formData.city ? 'Choisir' : 'Ville d\'abord'}</option>
                    {availableNeighborhoods.map(n => <option key={n.value} value={n.value}>{n.label}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Numéro WhatsApp *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">+237</span>
                  <input type="tel" value={formData.whatsappNumber}
                    onChange={e => setFormData({...formData, whatsappNumber: e.target.value})}
                    placeholder="6 XX XX XX XX"
                    className="w-full pl-16 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <p className="text-xs text-gray-500 mt-1">🟢 Les acheteurs vous contacteront via WhatsApp</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prix (XAF) *</label>
                <input type="number" value={formData.price}
                  onChange={e => setFormData({...formData, price: e.target.value})}
                  placeholder="0" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">Retour</Button>
                <Button onClick={() => setStep(3)} className="flex-1">Continuer</Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Photos */}
        {step === 3 && (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Photos</h1>
            <p className="text-gray-600 mb-8">Ajoutez jusqu'à 5 photos</p>

            <div className="bg-white rounded-2xl shadow-sm p-6">
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                multiple
                accept="image/*"
                onChange={handleImageSelect}
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors"
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Cliquez pour sélectionner des photos</p>
                <p className="text-sm text-gray-400">PNG, JPG jusqu'à 5MB • Maximum 5 photos</p>
              </button>

              {imagePreviews.length > 0 && (
                <div className="mt-6 grid grid-cols-3 gap-4">
                  {imagePreviews.map((src, idx) => (
                    <div key={idx} className="relative">
                      <img src={src} alt="" className="w-full h-24 object-cover rounded-lg" />
                      <button onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 p-1 bg-white rounded-full shadow hover:bg-red-50">
                        <X className="w-4 h-4 text-gray-600" />
                      </button>
                      {idx === 0 && (
                        <span className="absolute bottom-1 left-1 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded">
                          Principal
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <p className="text-sm text-gray-500 mt-4">💡 Les annonces avec photos reçoivent 10x plus de vues</p>

              <div className="flex gap-3 pt-6">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">Retour</Button>
                <Button onClick={handleSubmit} disabled={loading} className="flex-1">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {uploadingImages ? 'Upload photos...' : 'Publication...'}
                    </span>
                  ) : (
                    "Publier l'annonce"
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Annonce publiée !</h1>
            <p className="text-gray-600 mb-8">Votre annonce est maintenant visible sur Findr</p>
            <div className="flex justify-center gap-3">
              <Link href="/dashboard"><Button variant="outline">Mes annonces</Button></Link>
              <Link href="/"><Button>Accueil</Button></Link>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
