'use client'

import { useEffect } from 'react'
import { MapPin } from 'lucide-react'
import L from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import type { LatLngExpression } from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix default marker icon issue with Leaflet in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

export interface MapListing {
  id: string
  title: string
  price: number
  lat: number
  lng: number
  type: string
}

interface MapViewProps {
  listings: MapListing[]
  onListingClick?: (id: string) => void
}

function formatPricePin(price: number): string {
  if (price >= 1_000_000) {
    const val = price / 1_000_000
    return `${val % 1 === 0 ? val : val.toFixed(1)}M XAF`
  }
  if (price >= 1_000) {
    const val = price / 1_000
    return `${val % 1 === 0 ? val : val.toFixed(0)}k XAF`
  }
  return `${price} XAF`
}

function createPriceIcon(price: number): L.DivIcon {
  const label = formatPricePin(price)
  return L.divIcon({
    className: '',
    html: `<div style="
      background: white;
      border: 2px solid #2563eb;
      border-radius: 8px;
      padding: 4px 8px;
      font-size: 11px;
      font-weight: 700;
      color: #1e40af;
      white-space: nowrap;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      cursor: pointer;
      position: relative;
    ">${label}<div style="
      position: absolute;
      bottom: -7px;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 0;
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-top: 7px solid #2563eb;
    "></div></div>`,
    iconSize: [undefined as any, undefined as any],
    iconAnchor: [0, 0],
    popupAnchor: [0, -10],
  })
}

// Cameroon center
const CAMEROON_CENTER: LatLngExpression = [3.848, 11.502]
const DEFAULT_ZOOM = 6

export function MapView({ listings, onListingClick }: MapViewProps) {
  const listingsWithCoords = listings.filter(l => l.lat != null && l.lng != null)

  if (listingsWithCoords.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-gray-100 rounded-2xl border border-gray-200">
        <MapPin className="w-12 h-12 text-gray-400 mb-3" />
        <p className="text-gray-600 font-medium">Aucune annonce avec coordonnées</p>
        <p className="text-gray-400 text-sm mt-1">Les annonces sans localisation GPS ne s'affichent pas sur la carte</p>
      </div>
    )
  }

  // Compute center from listings if available
  const center: LatLngExpression = listingsWithCoords.length > 0
    ? [
        listingsWithCoords.reduce((sum, l) => sum + l.lat, 0) / listingsWithCoords.length,
        listingsWithCoords.reduce((sum, l) => sum + l.lng, 0) / listingsWithCoords.length,
      ]
    : CAMEROON_CENTER

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm" style={{ height: '500px' }}>
      <MapContainer
        center={center}
        zoom={listingsWithCoords.length === 1 ? 13 : DEFAULT_ZOOM}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {listingsWithCoords.map((listing) => (
          <Marker
            key={listing.id}
            position={[listing.lat, listing.lng] as LatLngExpression}
            icon={createPriceIcon(listing.price)}
            eventHandlers={{
              click: () => {
                if (onListingClick) onListingClick(listing.id)
              },
            }}
          >
            <Popup>
              <div className="min-w-[160px]">
                <p className="font-semibold text-gray-900 text-sm mb-1">{listing.title}</p>
                <p className="text-blue-600 font-bold text-sm mb-2">
                  {new Intl.NumberFormat('fr-FR').format(listing.price)} XAF
                </p>
                <a
                  href={`/${listing.type}/${listing.id}`}
                  className="block text-center bg-blue-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Voir l'annonce
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
