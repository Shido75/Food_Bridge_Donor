"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPinIcon, PackageIcon, ClockIcon } from "lucide-react"
import { format } from "date-fns"

interface CompletedDeliveryCardProps {
  delivery: any
}

export function CompletedDeliveryCard({ delivery }: CompletedDeliveryCardProps) {
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
                <h3 className="font-semibold">{delivery.donation?.food_category || "Food Delivery"}</h3>
                <p className="text-sm text-muted-foreground">
                  {delivery.donation?.quantity} {delivery.donation?.unit}
                </p>
              </div>
            </div>
            <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-500/20">Delivered</Badge>
          </div>

          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <ClockIcon className="h-4 w-4" />
              <span>
                Completed: {format(new Date(delivery.actual_delivery_time || delivery.created_at), "MMM d, h:mm a")}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <MapPinIcon className="mt-0.5 h-4 w-4" />
              <div className="flex-1">
                <p className="font-medium text-foreground">Route</p>
                <p>From: {delivery.pickup_address.substring(0, 40)}...</p>
                <p>To: {delivery.delivery_address.substring(0, 40)}...</p>
              </div>
            </div>
          </div>

          {delivery.distance_km && (
            <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3 text-sm">
              <span className="text-muted-foreground">Distance</span>
              <span className="font-medium">{delivery.distance_km} km</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
