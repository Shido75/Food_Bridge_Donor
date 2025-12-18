"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPinIcon, PackageIcon, ClockIcon } from "lucide-react"
import { format } from "date-fns"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface AvailableJobCardProps {
    delivery: any
    partnerId: string
}

export function AvailableJobCard({ delivery, partnerId }: AvailableJobCardProps) {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()
    const { toast } = useToast()

    const handleAccept = async () => {
        setIsLoading(true)
        try {
            const { error } = await supabase
                .from("deliveries")
                .update({
                    status: "accepted",
                    delivery_partner_id: partnerId,
                })
                .eq("id", delivery.id)
                .eq("status", "pending") // Security check

            if (error) throw error

            toast({
                title: "Job Accepted",
                description: "You have accepted the delivery job.",
            })

            router.refresh()
        } catch (error) {
            console.error("Error accepting job:", error)
            toast({
                title: "Failed to accept job",
                description: "It may have been taken by another partner.",
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
                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-orange-500/10">
                                    <PackageIcon className="h-5 w-5 text-orange-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">{delivery.donation?.food_category || "Food Donation"}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {delivery.donation?.quantity} {delivery.donation?.unit}
                                    </p>
                                </div>
                            </div>
                            <Badge variant="outline" className="border-orange-500 text-orange-600 w-fit">
                                New Job
                            </Badge>
                        </div>

                        <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                            <div className="flex items-start gap-2">
                                <MapPinIcon className="h-4 w-4 mt-0.5 text-blue-500" />
                                <div>
                                    <span className="font-medium text-foreground">Pickup:</span>
                                    <p>{delivery.pickup_address}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <MapPinIcon className="h-4 w-4 mt-0.5 text-green-500" />
                                <div>
                                    <span className="font-medium text-foreground">Dropoff:</span>
                                    <p>{delivery.delivery_address}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <ClockIcon className="h-4 w-4" />
                            <span>Created {format(new Date(delivery.created_at), "h:mm a")}</span>
                        </div>
                    </div>

                    <Button onClick={handleAccept} disabled={isLoading} className="w-full sm:w-auto">
                        {isLoading ? "Accepting..." : "Accept Job"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
