"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MapPinIcon, Navigation } from "lucide-react"
import { MapView } from "./map-view"
import { getCurrentLocation, PUNE_CENTER } from "@/lib/utils/map"
import { useToast } from "@/hooks/use-toast"

interface LocationPickerProps {
  onLocationSelect: (location: { lat: number; lng: number; address?: string }) => void
  initialLocation?: { lat: number; lng: number }
  disabled?: boolean
}

export function LocationPicker({ onLocationSelect, initialLocation, disabled }: LocationPickerProps) {
  const [selectedLocation, setSelectedLocation] = useState<[number, number]>(
    initialLocation ? [initialLocation.lat, initialLocation.lng] : [PUNE_CENTER.lat, PUNE_CENTER.lng],
  )
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const { toast } = useToast()

  const handleGetCurrentLocation = async () => {
    setIsLoadingLocation(true)
    try {
      const location = await getCurrentLocation()
      const newLocation: [number, number] = [location.lat, location.lng]
      setSelectedLocation(newLocation)
      onLocationSelect({ lat: location.lat, lng: location.lng })
      toast({
        title: "Location updated",
        description: "Your current location has been set",
      })
    } catch (error) {
      toast({
        title: "Location error",
        description: "Could not get your current location. Please check permissions.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingLocation(false)
    }
  }

  const handleMapClick = (lat: number, lng: number) => {
    if (disabled) return
    const newLocation: [number, number] = [lat, lng]
    setSelectedLocation(newLocation)
    onLocationSelect({ lat, lng })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPinIcon className="h-4 w-4" />
          <span>Click on map to set location or use current location</span>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleGetCurrentLocation}
          disabled={disabled || isLoadingLocation}
        >
          <Navigation className="mr-2 h-4 w-4" />
          {isLoadingLocation ? "Getting location..." : "Use Current Location"}
        </Button>
      </div>

      <MapView
        center={selectedLocation}
        zoom={14}
        markers={[
          {
            id: "selected",
            position: selectedLocation,
            title: "Selected Location",
            popup: "Pickup/Delivery Location",
            icon: "pickup",
          },
        ]}
        height="300px"
        className="border"
      />

      <p className="text-xs text-muted-foreground">
        Selected: {selectedLocation[0].toFixed(6)}, {selectedLocation[1].toFixed(6)}
      </p>
    </div>
  )
}
