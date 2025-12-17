"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface SetupNGODialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  profileId: string
  onComplete: () => void
}

export function SetupNGODialog({ open, onOpenChange, profileId, onComplete }: SetupNGODialogProps) {
  const [ngoName, setNgoName] = useState("")
  const [registrationNumber, setRegistrationNumber] = useState("")
  const [beneficiaryCount, setBeneficiaryCount] = useState("")
  const [beneficiaryType, setBeneficiaryType] = useState("")
  const [operatingAreas, setOperatingAreas] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.from("ngo_organizations").insert({
        profile_id: profileId,
        ngo_name: ngoName,
        registration_number: registrationNumber,
        beneficiary_count: Number.parseInt(beneficiaryCount) || 0,
        beneficiary_type: beneficiaryType.split(",").map((t) => t.trim()),
        operating_areas: operatingAreas.split(",").map((a) => a.trim()),
        documents_verified: false,
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
          <DialogTitle>Setup Your NGO Profile</DialogTitle>
          <DialogDescription>Complete your NGO profile to start claiming donations</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ngoName">NGO Name *</Label>
            <Input
              id="ngoName"
              placeholder="e.g., Hope Foundation"
              value={ngoName}
              onChange={(e) => setNgoName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="regNumber">Registration Number *</Label>
            <Input
              id="regNumber"
              placeholder="e.g., NGO-2024-12345"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="beneficiaryCount">Beneficiary Count</Label>
            <Input
              id="beneficiaryCount"
              type="number"
              placeholder="e.g., 100"
              value={beneficiaryCount}
              onChange={(e) => setBeneficiaryCount(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="beneficiaryType">Beneficiary Types (comma separated)</Label>
            <Input
              id="beneficiaryType"
              placeholder="e.g., Children, Elderly, Homeless"
              value={beneficiaryType}
              onChange={(e) => setBeneficiaryType(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="operatingAreas">Operating Areas (comma separated)</Label>
            <Textarea
              id="operatingAreas"
              placeholder="e.g., Pune City, Pimpri-Chinchwad"
              value={operatingAreas}
              onChange={(e) => setOperatingAreas(e.target.value)}
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
