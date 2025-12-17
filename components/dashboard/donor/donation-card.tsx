"use client"

import type { FoodDonation } from "@/lib/types/database"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ClockIcon, MapPinIcon, PackageIcon } from "lucide-react"
import { format } from "date-fns"

interface DonationCardProps {
  donation: FoodDonation
}

export function DonationCard({ donation }: DonationCardProps) {
  const getStatusColor = (status: string) => {
    const colors = {
      available: "bg-green-500/10 text-green-700 border-green-500/20",
      claimed: "bg-blue-500/10 text-blue-700 border-blue-500/20",
      assigned: "bg-purple-500/10 text-purple-700 border-purple-500/20",
      picked_up: "bg-orange-500/10 text-orange-700 border-orange-500/20",
      delivered: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
      cancelled: "bg-red-500/10 text-red-700 border-red-500/20",
      expired: "bg-gray-500/10 text-gray-700 border-gray-500/20",
    }
    return colors[status as keyof typeof colors] || colors.available
  }

  const getStatusLabel = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
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
              <Badge className={`${getStatusColor(donation.status)} shrink-0`}>{getStatusLabel(donation.status)}</Badge>
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

            {donation.pickup_instructions && (
              <div className="rounded-lg bg-muted p-3 text-sm">
                <p className="font-medium">Pickup Instructions:</p>
                <p className="text-muted-foreground line-clamp-2 sm:line-clamp-none">{donation.pickup_instructions}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
