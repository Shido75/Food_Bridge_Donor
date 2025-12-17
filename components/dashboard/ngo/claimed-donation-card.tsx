"use client"

import type { FoodDonation } from "@/lib/types/database"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ClockIcon, MapPinIcon, PackageIcon, TruckIcon } from "lucide-react"
import { format } from "date-fns"

interface ClaimedDonationCardProps {
  donation: FoodDonation
}

export function ClaimedDonationCard({ donation }: ClaimedDonationCardProps) {
  const getStatusColor = (status: string) => {
    const colors = {
      claimed: "bg-blue-500/10 text-blue-700 border-blue-500/20",
      assigned: "bg-purple-500/10 text-purple-700 border-purple-500/20",
      picked_up: "bg-orange-500/10 text-orange-700 border-orange-500/20",
      delivered: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
    }
    return colors[status as keyof typeof colors] || colors.claimed
  }

  const getStatusLabel = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <PackageIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{donation.food_category}</h3>
                <p className="text-sm text-muted-foreground">
                  {donation.quantity} {donation.unit} • {donation.food_type}
                </p>
              </div>
            </div>
            <Badge className={getStatusColor(donation.status)}>{getStatusLabel(donation.status)}</Badge>
          </div>

          {donation.description && <p className="text-sm text-muted-foreground">{donation.description}</p>}

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <ClockIcon className="h-4 w-4" />
              <span>Claimed: {format(new Date(donation.claimed_at || donation.created_at), "MMM d, h:mm a")}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPinIcon className="h-4 w-4" />
              <span>{donation.pickup_address.substring(0, 50)}...</span>
            </div>
          </div>

          {donation.status === "assigned" && (
            <div className="flex items-center gap-2 rounded-lg bg-primary/5 p-3 text-sm">
              <TruckIcon className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">Delivery partner assigned and on the way</span>
            </div>
          )}

          {donation.status === "picked_up" && (
            <div className="flex items-center gap-2 rounded-lg bg-primary/5 p-3 text-sm">
              <TruckIcon className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">Food picked up and in transit to you</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
