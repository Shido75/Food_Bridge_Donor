"use client"

import type { FoodDonation } from "@/lib/types/database"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ClockIcon, MapPinIcon, PackageIcon } from "lucide-react"
import { format } from "date-fns"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface AvailableDonationCardProps {
  donation: FoodDonation
  ngoId: string
  disabled?: boolean
}

export function AvailableDonationCard({ donation, ngoId, disabled }: AvailableDonationCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()

  const handleClaim = async () => {
    setIsLoading(true)
    try {
      // 1. Get available delivery partner (optional now)
      const { data: availablePartners, error: partnerError } = await supabase
        .from("delivery_partners")
        .select("profile_id, profiles!inner(*)")
        .eq("is_available", true)
        .limit(1)
        .single()

      // 2. Get NGO location
      const { data: ngoProfile } = await supabase
        .from("profiles")
        .select("address, latitude, longitude")
        .eq("id", ngoId)
        .single()

      const partnerId = availablePartners?.profile_id
      const assignedAt = partnerId ? new Date().toISOString() : null
      const status = partnerId ? "assigned" : "claimed"

      // 3. Update donation status
      // We explicitly check permissions via RLS, so this should work if RLS is fixed.
      const { error: donationError } = await supabase
        .from("food_donations")
        .update({
          status: status,
          claimed_by: ngoId,
          claimed_at: new Date().toISOString(),
          assigned_to: partnerId || null,
          assigned_at: assignedAt,
        })
        .eq("id", donation.id)
        .eq("status", "available") // Ensure we only claim available ones

      if (donationError) throw donationError

      // 4. Create delivery record ONLY if we have a partner
      if (partnerId) {
        const { error: deliveryError } = await supabase.from("deliveries").insert({
          donation_id: donation.id,
          delivery_partner_id: partnerId,
          pickup_address: donation.pickup_address,
          pickup_latitude: donation.pickup_latitude,
          pickup_longitude: donation.pickup_longitude,
          delivery_address: ngoProfile?.address || "Address not set",
          delivery_latitude: ngoProfile?.latitude,
          delivery_longitude: ngoProfile?.longitude,
          status: "assigned",
          estimated_pickup_time: new Date(Date.now() + 30 * 60000).toISOString(), // 30 mins from now
          estimated_delivery_time: new Date(Date.now() + 60 * 60000).toISOString(), // 1 hour from now
        })

        if (deliveryError) {
          console.error("Failed to create delivery record:", deliveryError)
          // Note: We don't rollback the donation claim here, but in a real app we might want to.
          // For now, we just warn.
          toast({
            title: "Claimed but delivery assignment failed",
            description: "Please contact support or try assigning manually.",
            variant: "destructive",
          })
        }
      }

      toast({
        title: partnerId ? "Donation claimed & assigned" : "Donation claimed successfully",
        description: partnerId
          ? "A delivery partner has been assigned."
          : "No delivery partner available immediately. It is now claimed by you.",
      })

      router.refresh()
    } catch (error) {
      console.error("Error claiming donation:", error)
      toast({
        title: "Failed to claim donation",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1 space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <PackageIcon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{donation.food_category}</h3>
                  <p className="text-sm text-muted-foreground">
                    {donation.quantity} {donation.unit} • {donation.food_type}
                  </p>
                </div>
              </div>
              <Badge className="bg-green-500/10 text-green-700 border-green-500/20 shrink-0 w-fit">Available</Badge>
            </div>

            {donation.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">{donation.description}</p>
            )}

            <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:gap-4">
              <div className="flex items-center gap-1">
                <ClockIcon className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">Expires: {format(new Date(donation.expiry_time), "MMM d, h:mm a")}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPinIcon className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{donation.pickup_address.substring(0, 50)}...</span>
              </div>
            </div>
          </div>

          <Button onClick={handleClaim} disabled={isLoading || disabled} size="sm" className="w-full sm:w-auto">
            {isLoading ? "Claiming..." : "Claim Donation"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
