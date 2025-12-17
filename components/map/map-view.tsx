"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix for default marker icons in Leaflet with Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

export interface MapMarker {
  id: string
  position: [number, number]
  title?: string
  popup?: string
  icon?: "default" | "pickup" | "delivery" | "partner"
}

interface MapViewProps {
  center?: [number, number]
  zoom?: number
  markers?: MapMarker[]
  height?: string
  onMarkerClick?: (markerId: string) => void
  className?: string
}

export function MapView({
  center = [18.5204, 73.8567], // Pune coordinates
  zoom = 13,
  markers = [],
  height = "400px",
  onMarkerClick,
  className = "",
}: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const markersRef = useRef<L.Marker[]>([])

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    // Create map instance
    const map = L.map(mapContainerRef.current).setView(center, zoom)

    // Add OpenStreetMap tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map)

    mapRef.current = map

    // Cleanup on unmount
    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  // Update map center and zoom
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(center, zoom)
    }
  }, [center, zoom])

  // Update markers
  useEffect(() => {
    if (!mapRef.current) return

    // Remove old markers
    markersRef.current.forEach((marker) => marker.remove())
    markersRef.current = []

    // Add new markers
    markers.forEach((markerData) => {
      const icon = getCustomIcon(markerData.icon)
      const marker = L.marker(markerData.position, icon ? { icon } : undefined).addTo(mapRef.current!)

      if (markerData.popup) {
        marker.bindPopup(markerData.popup)
      }

      if (onMarkerClick) {
        marker.on("click", () => onMarkerClick(markerData.id))
      }

      markersRef.current.push(marker)
    })

    // Auto-fit bounds if multiple markers
    if (markers.length > 1) {
      const bounds = L.latLngBounds(markers.map((m) => m.position))
      mapRef.current.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [markers, onMarkerClick])

  return <div ref={mapContainerRef} className={`rounded-lg ${className}`} style={{ height, width: "100%" }} />
}

function getCustomIcon(iconType?: MapMarker["icon"]): L.Icon | undefined {
  if (!iconType || iconType === "default") return undefined

  const iconConfig = {
    pickup: {
      iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconSize: [25, 41] as [number, number],
      iconAnchor: [12, 41] as [number, number],
      popupAnchor: [1, -34] as [number, number],
      shadowSize: [41, 41] as [number, number],
    },
    delivery: {
      iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconSize: [25, 41] as [number, number],
      iconAnchor: [12, 41] as [number, number],
      popupAnchor: [1, -34] as [number, number],
      shadowSize: [41, 41] as [number, number],
    },
    partner: {
      iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconSize: [25, 41] as [number, number],
      iconAnchor: [12, 41] as [number, number],
      popupAnchor: [1, -34] as [number, number],
      shadowSize: [41, 41] as [number, number],
    },
  }

  return new L.Icon(iconConfig[iconType])
}
