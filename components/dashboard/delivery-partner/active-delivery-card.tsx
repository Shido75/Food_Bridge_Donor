"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPinIcon, PackageIcon, NavigationIcon } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface ActiveDeliveryCardProps {
  delivery: any
}

export function ActiveDeliveryCard({ delivery }: ActiveDeliveryCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const getStatusColor = (status: string) => {
    const colors = {
      assigned: "bg-blue-500/10 text-blue-700 border-blue-500/20",
      accepted: "bg-purple-500/10 text-purple-700 border-purple-500/20",
      in_transit_to_pickup: "bg-orange-500/10 text-orange-700 border-orange-500/20",
      at_pickup: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20",
      picked_up: "bg-indigo-500/10 text-indigo-700 border-indigo-500/20",
      in_transit_to_delivery: "bg-cyan-500/10 text-cyan-700 border-cyan-500/20",
      at_delivery: "bg-teal-500/10 text-teal-700 border-teal-500/20",
    }
    return colors[status as keyof typeof colors] || colors.assigned
  }

  const getStatusLabel = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const getNextAction = (status: string) => {
    const actions = {
      assigned: { label: "Accept Delivery", nextStatus: "accepted" },
      accepted: { label: "Start to Pickup", nextStatus: "in_transit_to_pickup" },
      in_transit_to_pickup: { label: "Arrived at Pickup", nextStatus: "at_pickup" },
      at_pickup: { label: "Picked Up", nextStatus: "picked_up" },
      picked_up: { label: "Start to Delivery", nextStatus: "in_transit_to_delivery" },
      in_transit_to_delivery: { label: "Arrived at Delivery", nextStatus: "at_delivery" },
      at_delivery: { label: "Mark Delivered", nextStatus: "delivered" },
    }
    return actions[status as keyof typeof actions]
  }

  const handleStatusUpdate = async () => {
    const nextAction = getNextAction(delivery.status)
    if (!nextAction) return

    setIsLoading(true)
    try {
      const updates: any = { status: nextAction.nextStatus }

      if (nextAction.nextStatus === "picked_up") {
        updates.actual_pickup_time = new Date().toISOString()
      } else if (nextAction.nextStatus === "delivered") {
        updates.actual_delivery_time = new Date().toISOString()
      }

      const { error } = await supabase.from("deliveries").update(updates).eq("id", delivery.id)

      if (error) throw error

      // Also update the donation status
      if (nextAction.nextStatus === "picked_up") {
        await supabase.from("food_donations").update({ status: "picked_up" }).eq("id", delivery.donation_id)
      } else if (nextAction.nextStatus === "delivered") {
        await supabase.from("food_donations").update({ status: "delivered" }).eq("id", delivery.donation_id)
      }

      router.refresh()
    } catch (error) {
      console.error("[v0] Error updating delivery status:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const nextAction = getNextAction(delivery.status)

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
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
            <Badge className={getStatusColor(delivery.status)}>{getStatusLabel(delivery.status)}</Badge>
          </div>

          <div className="space-y-3 rounded-lg bg-muted/50 p-4">
            <div className="flex items-start gap-2">
              <MapPinIcon className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">Pickup Location</p>
                <p className="text-sm text-muted-foreground">{delivery.pickup_address}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <NavigationIcon className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">Delivery Location</p>
                <p className="text-sm text-muted-foreground">{delivery.delivery_address}</p>
              </div>
            </div>
          </div>

          {delivery.notes && (
            <div className="rounded-lg bg-primary/5 p-3 text-sm">
              <p className="font-medium">Notes:</p>
              <p className="text-muted-foreground">{delivery.notes}</p>
            </div>
          )}

          {nextAction && (
            <Button onClick={handleStatusUpdate} disabled={isLoading} className="w-full">
              {isLoading ? "Updating..." : nextAction.label}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
