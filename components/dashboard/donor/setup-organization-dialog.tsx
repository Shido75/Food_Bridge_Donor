"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface SetupOrganizationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  profileId: string
  onComplete: () => void
}

export function SetupOrganizationDialog({ open, onOpenChange, profileId, onComplete }: SetupOrganizationDialogProps) {
  const [organizationName, setOrganizationName] = useState("")
  const [organizationType, setOrganizationType] = useState("")
  const [fssaiLicense, setFssaiLicense] = useState("")
  const [operatingHours, setOperatingHours] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.from("donor_organizations").insert({
        profile_id: profileId,
        organization_name: organizationName,
        organization_type: organizationType,
        fssai_license: fssaiLicense || null,
        operating_hours: operatingHours || null,
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
          <DialogTitle>Setup Your Organization</DialogTitle>
          <DialogDescription>Complete your organization profile to start creating donations</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="orgName">Organization Name *</Label>
            <Input
              id="orgName"
              placeholder="e.g., Spice Garden Restaurant"
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="orgType">Organization Type *</Label>
            <Select value={organizationType} onValueChange={setOrganizationType} required>
              <SelectTrigger id="orgType">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="restaurant">Restaurant</SelectItem>
                <SelectItem value="hotel">Hotel</SelectItem>
                <SelectItem value="hostel">Hostel</SelectItem>
                <SelectItem value="catering">Catering Service</SelectItem>
                <SelectItem value="bakery">Bakery</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fssai">FSSAI License (Optional)</Label>
            <Input
              id="fssai"
              placeholder="e.g., 12345678901234"
              value={fssaiLicense}
              onChange={(e) => setFssaiLicense(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hours">Operating Hours (Optional)</Label>
            <Textarea
              id="hours"
              placeholder="e.g., Mon-Sun: 9 AM - 10 PM"
              value={operatingHours}
              onChange={(e) => setOperatingHours(e.target.value)}
              rows={2}
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
