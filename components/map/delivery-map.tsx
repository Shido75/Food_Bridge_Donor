"use client"

import { MapView, type MapMarker } from "./map-view"
import { Card } from "@/components/ui/card"

interface DeliveryMapProps {
  pickupLocation: { lat: number; lng: number; address: string }
  deliveryLocation: { lat: number; lng: number; address: string }
  partnerLocation?: { lat: number; lng: number }
  height?: string
}

export function DeliveryMap({ pickupLocation, deliveryLocation, partnerLocation, height = "400px" }: DeliveryMapProps) {
  const markers: MapMarker[] = [
    {
      id: "pickup",
      position: [pickupLocation.lat, pickupLocation.lng],
      title: "Pickup Location",
      popup: `<strong>Pickup</strong><br/>${pickupLocation.address}`,
      icon: "pickup",
    },
    {
      id: "delivery",
      position: [deliveryLocation.lat, deliveryLocation.lng],
      title: "Delivery Location",
      popup: `<strong>Delivery</strong><br/>${deliveryLocation.address}`,
      icon: "delivery",
    },
  ]

  if (partnerLocation) {
    markers.push({
      id: "partner",
      position: [partnerLocation.lat, partnerLocation.lng],
      title: "Delivery Partner",
      popup: "<strong>Delivery Partner</strong><br/>Current Location",
      icon: "partner",
    })
  }

  return (
    <Card className="overflow-hidden">
      <MapView markers={markers} height={height} />
    </Card>
  )
}
