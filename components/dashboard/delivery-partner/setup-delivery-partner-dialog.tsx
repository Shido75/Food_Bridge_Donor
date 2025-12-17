"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface SetupDeliveryPartnerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  profileId: string
  onComplete: () => void
}

export function SetupDeliveryPartnerDialog({
  open,
  onOpenChange,
  profileId,
  onComplete,
}: SetupDeliveryPartnerDialogProps) {
  const [vehicleType, setVehicleType] = useState("")
  const [vehicleNumber, setVehicleNumber] = useState("")
  const [licenseNumber, setLicenseNumber] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.from("delivery_partners").insert({
        profile_id: profileId,
        vehicle_type: vehicleType,
        vehicle_number: vehicleNumber,
        license_number: licenseNumber,
        is_available: true,
      })

      if (error) throw error

      onComplete()
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Setup Delivery Partner Profile</DialogTitle>
          <DialogDescription>Complete your profile to start accepting deliveries</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vehicleType">Vehicle Type *</Label>
            <Select value={vehicleType} onValueChange={setVehicleType} required>
              <SelectTrigger id="vehicleType">
                <SelectValue placeholder="Select vehicle type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bike">Bike</SelectItem>
                <SelectItem value="scooter">Scooter</SelectItem>
                <SelectItem value="car">Car</SelectItem>
                <SelectItem value="van">Van</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="vehicleNumber">Vehicle Number *</Label>
            <Input
              id="vehicleNumber"
              placeholder="e.g., MH12AB1234"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="licenseNumber">Driving License Number *</Label>
            <Input
              id="licenseNumber"
              placeholder="e.g., MH1234567890123"
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value.toUpperCase())}
              required
            />
          </div>
          {error && <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save & Continue"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
