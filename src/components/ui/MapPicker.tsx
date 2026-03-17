'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import type { LatLngExpression } from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix default marker icon issue with Leaflet in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

interface MapPickerProps {
  center: [number, number]
  markerPosition: [number, number]
  onMapClick: (lat: number, lng: number) => void
}

function ClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

export default function MapPicker({ center, markerPosition, onMapClick }: MapPickerProps) {
  return (
    <MapContainer
      center={center as LatLngExpression}
      zoom={13}
      style={{ height: '250px', width: '100%' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ClickHandler onMapClick={onMapClick} />
      <Marker
        position={markerPosition as LatLngExpression}
        draggable={true}
        eventHandlers={{
          dragend(e) {
            const marker = e.target
            const pos = marker.getLatLng()
            onMapClick(pos.lat, pos.lng)
          },
        }}
      />
    </MapContainer>
  )
}
