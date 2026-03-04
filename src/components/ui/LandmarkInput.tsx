'use client'

import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { MapPin, X } from 'lucide-react'

// Dynamically import the map picker to avoid SSR issues
const MapPicker = dynamic<{
  center: [number, number]
  markerPosition: [number, number]
  onMapClick: (lat: number, lng: number) => void
}>(() => import('./MapPicker'), { ssr: false })

export interface LocationValue {
  lat?: number
  lng?: number
  landmark?: string
  city?: string
}

interface LandmarkInputProps {
  value: LocationValue
  onChange: (value: LocationValue) => void
  placeholder?: string
}

const CAMEROON_CITIES = [
  'Douala', 'Yaoundé', 'Bafoussam', 'Bamenda', 'Garoua',
  'Maroua', 'Ngaoundéré', 'Bertoua', 'Ebolowa', 'Kribi', 'Limbe', 'Buea',
]

export const CITY_CENTERS: Record<string, [number, number]> = {
  'Douala': [4.0511, 9.7679],
  'Yaoundé': [3.8480, 11.5021],
  'Bafoussam': [5.4737, 10.4179],
  'Bamenda': [5.9597, 10.1460],
  'Garoua': [9.3017, 13.3986],
  'Maroua': [10.5900, 14.3159],
  'Ngaoundéré': [7.3167, 13.5833],
  'Bertoua': [4.5833, 13.6833],
  'Ebolowa': [2.9000, 11.1500],
  'Kribi': [2.9390, 9.9090],
  'Limbe': [4.0167, 9.2000],
  'Buea': [4.1597, 9.2417],
}

const CITY_LANDMARKS: Record<string, string[]> = {
  'Douala': ['Total Bonanjo', 'Marché Central', 'Akwa', 'Bonapriso', 'Bonamoussadi', 'Makepe', 'Logbessou'],
  'Yaoundé': ['Bastos', 'Nlongkak', 'Mvan', 'Essos', 'Mvog-Mbi', 'Centre Ville', 'Biyem-Assi'],
}

const DEFAULT_LANDMARKS = ['Centre Ville', 'Marché Central', 'Quartier Administratif']

export function LandmarkInput({ value, onChange, placeholder }: LandmarkInputProps) {
  const [showMap, setShowMap] = useState(false)

  const selectedCity = value.city || ''
  const suggestions = selectedCity
    ? (CITY_LANDMARKS[selectedCity] || DEFAULT_LANDMARKS)
    : []

  const handleCityChange = (city: string) => {
    const coords = CITY_CENTERS[city]
    onChange({
      ...value,
      city,
      lat: coords ? coords[0] : undefined,
      lng: coords ? coords[1] : undefined,
    })
  }

  const handleLandmarkChange = (landmark: string) => {
    onChange({ ...value, landmark })
  }

  const handleChipClick = (chip: string) => {
    const current = value.landmark || ''
    const newLandmark = current ? `${current}, ${chip}` : chip
    onChange({ ...value, landmark: newLandmark })
  }

  const handleMapClick = useCallback((lat: number, lng: number) => {
    onChange({ ...value, lat, lng })
  }, [value, onChange])

  const mapCenter: [number, number] = value.lat && value.lng
    ? [value.lat, value.lng]
    : selectedCity && CITY_CENTERS[selectedCity]
      ? CITY_CENTERS[selectedCity]
      : [3.848, 11.502]

  return (
    <div className="space-y-4">
      {/* City Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ville *
        </label>
        <select
          value={selectedCity}
          onChange={(e) => handleCityChange(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
        >
          <option value="">Sélectionner une ville</option>
          {CAMEROON_CITIES.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      {/* Landmark Text Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Repère / Quartier
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={value.landmark || ''}
            onChange={(e) => handleLandmarkChange(e.target.value)}
            placeholder={placeholder || 'Ex: près de Total Bonanjo, derrière le marché central...'}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          {value.landmark && (
            <button
              type="button"
              onClick={() => handleLandmarkChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Landmark Chips */}
        {suggestions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {suggestions.map(chip => (
              <button
                key={chip}
                type="button"
                onClick={() => handleChipClick(chip)}
                className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full hover:bg-emerald-100 hover:text-emerald-700 transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Map Pin Preview Toggle */}
      <div>
        <button
          type="button"
          onClick={() => setShowMap(!showMap)}
          className="flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
        >
          <MapPin className="w-4 h-4" />
          {showMap ? 'Masquer la carte' : 'Épingler sur la carte (optionnel)'}
        </button>

        {value.lat && value.lng && !showMap && (
          <p className="text-xs text-gray-500 mt-1">
            📍 Position: {value.lat.toFixed(4)}, {value.lng.toFixed(4)}
          </p>
        )}
      </div>

      {/* Map Picker */}
      {showMap && (
        <div className="rounded-xl overflow-hidden border border-gray-200">
          <MapPicker
            center={mapCenter}
            markerPosition={value.lat && value.lng ? [value.lat, value.lng] : mapCenter}
            onMapClick={handleMapClick}
          />
          <p className="text-xs text-gray-500 bg-gray-50 px-3 py-2 border-t border-gray-200">
            Cliquez sur la carte pour placer votre épingle. Vous pouvez aussi faire glisser le marqueur.
          </p>
        </div>
      )}
    </div>
  )
}
