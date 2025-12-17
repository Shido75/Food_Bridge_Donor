"use client"

import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"

interface RecentDonationsTableProps {
  donations: any[]
}

export function RecentDonationsTable({ donations }: RecentDonationsTableProps) {
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

  if (donations.length === 0) {
    return <p className="py-8 text-center text-sm text-muted-foreground">No donations yet</p>
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Food Item</TableHead>
            <TableHead>Donor</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {donations.map((donation) => (
            <TableRow key={donation.id}>
              <TableCell className="font-medium">{donation.food_category}</TableCell>
              <TableCell>{donation.donor?.full_name || "Unknown"}</TableCell>
              <TableCell>
                {donation.quantity} {donation.unit}
              </TableCell>
              <TableCell className="capitalize">{donation.food_type}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(donation.status)}>{getStatusLabel(donation.status)}</Badge>
              </TableCell>
              <TableCell>{format(new Date(donation.created_at), "MMM d, h:mm a")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
