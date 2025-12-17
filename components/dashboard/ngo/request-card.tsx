"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ClockIcon, MapPinIcon, PackageIcon } from "lucide-react"
import { format } from "date-fns"

interface RequestCardProps {
  request: any
}

export function RequestCard({ request }: RequestCardProps) {
  const getUrgencyColor = (urgency: string) => {
    const colors = {
      low: "bg-gray-500/10 text-gray-700 border-gray-500/20",
      medium: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20",
      high: "bg-orange-500/10 text-orange-700 border-orange-500/20",
      critical: "bg-red-500/10 text-red-700 border-red-500/20",
    }
    return colors[urgency as keyof typeof colors] || colors.medium
  }

  const getStatusColor = (status: string) => {
    const colors = {
      open: "bg-blue-500/10 text-blue-700 border-blue-500/20",
      matched: "bg-purple-500/10 text-purple-700 border-purple-500/20",
      fulfilled: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
      cancelled: "bg-red-500/10 text-red-700 border-red-500/20",
    }
    return colors[status as keyof typeof colors] || colors.open
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
                <h3 className="font-semibold">{request.request_type}</h3>
                <p className="text-sm text-muted-foreground">Quantity: {request.quantity_needed}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge className={getUrgencyColor(request.urgency)}>{request.urgency.toUpperCase()}</Badge>
              <Badge className={getStatusColor(request.status)}>{request.status.toUpperCase()}</Badge>
            </div>
          </div>

          {request.description && <p className="text-sm text-muted-foreground">{request.description}</p>}

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <ClockIcon className="h-4 w-4" />
              <span>Required by: {format(new Date(request.required_by), "MMM d, h:mm a")}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPinIcon className="h-4 w-4" />
              <span>{request.delivery_address.substring(0, 50)}...</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
