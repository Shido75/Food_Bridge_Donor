"use client"

import { useState } from "react"
import type { Profile, DeliveryPartner } from "@/lib/types/database"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { TruckIcon, CheckCircleIcon, ClockIcon, StarIcon, PackageIcon } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/shared/dashboard-header"
import { SetupDeliveryPartnerDialog } from "@/components/dashboard/delivery-partner/setup-delivery-partner-dialog"
import { ActiveDeliveryCard } from "@/components/dashboard/delivery-partner/active-delivery-card"
import { CompletedDeliveryCard } from "@/components/dashboard/delivery-partner/completed-delivery-card"
import { AvailableJobCard } from "@/components/dashboard/delivery-partner/available-job-card"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface DeliveryPartnerDashboardClientProps {
  profile: Profile
  partnerDetails: DeliveryPartner | null
  activeDeliveries: any[]
  completedDeliveries: any[]
  pendingDeliveries: any[]
  stats: {
    total: number
    active: number
    completed: number
  }
}

export function DeliveryPartnerDashboardClient({
  profile,
  partnerDetails,
  activeDeliveries,
  completedDeliveries,
  pendingDeliveries,
  stats,
}: DeliveryPartnerDashboardClientProps) {
  const [showSetupDialog, setShowSetupDialog] = useState(!partnerDetails)
  const [isAvailable, setIsAvailable] = useState(partnerDetails?.is_available || false)
  const router = useRouter()
  const supabase = createClient()

  const handleAvailabilityToggle = async (checked: boolean) => {
    if (!partnerDetails) return

    setIsAvailable(checked)

    try {
      const { error } = await supabase
        .from("delivery_partners")
        .update({ is_available: checked })
        .eq("profile_id", profile.id)

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error("[v0] Error updating availability:", error)
      setIsAvailable(!checked)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader profile={profile} />

      <main className="flex-1 p-4 sm:p-6">
        <div className="mx-auto max-w-7xl space-y-4 sm:space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Welcome, {profile.full_name}</h1>
              <p className="text-sm text-muted-foreground sm:text-base">Manage your deliveries and track your impact</p>
            </div>
            {partnerDetails && (
              <div className="flex items-center gap-3 rounded-lg border p-3 sm:border-0 sm:p-0">
                <Label htmlFor="availability" className="text-sm font-medium">
                  Available for deliveries
                </Label>
                <Switch id="availability" checked={isAvailable} onCheckedChange={handleAvailabilityToggle} />
              </div>
            )}
          </div>

          {/* Setup Alert */}
          {!partnerDetails && (
            <Card className="border-primary/50 bg-primary/5">
              <CardHeader>
                <CardTitle>Complete Your Delivery Partner Profile</CardTitle>
                <CardDescription>
                  Set up your vehicle and license details to start accepting delivery requests.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => setShowSetupDialog(true)}>Setup Profile</Button>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Deliveries</CardTitle>
                <TruckIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">All time deliveries</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active</CardTitle>
                <ClockIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.active}</div>
                <p className="text-xs text-muted-foreground">Currently in progress</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.completed}</div>
                <p className="text-xs text-muted-foreground">Successfully delivered</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rating</CardTitle>
                <StarIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{partnerDetails?.rating.toFixed(1) || "0.0"}</div>
                <p className="text-xs text-muted-foreground">Average rating</p>
              </CardContent>
            </Card>
          </div>

          {/* Deliveries Tabs */}
          <Tabs defaultValue="active">
            <TabsList>
              <TabsTrigger value="active">Active Deliveries</TabsTrigger>
              <TabsTrigger value="available">Available Jobs</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Active Deliveries</CardTitle>
                  <CardDescription>Manage your current delivery assignments</CardDescription>
                </CardHeader>
                <CardContent>
                  {activeDeliveries.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <TruckIcon className="mb-4 h-12 w-12 text-muted-foreground" />
                      <h3 className="mb-2 text-lg font-semibold">No active deliveries</h3>
                      <p className="text-sm text-muted-foreground">
                        {isAvailable
                          ? "New delivery requests will appear here"
                          : "Turn on availability to receive delivery requests"}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {activeDeliveries.map((delivery) => (
                        <ActiveDeliveryCard key={delivery.id} delivery={delivery} />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="available" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Available Jobs</CardTitle>
                  <CardDescription>Browse and accept new delivery requests</CardDescription>
                </CardHeader>
                <CardContent>
                  {pendingDeliveries.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <PackageIcon className="mb-4 h-12 w-12 text-muted-foreground" />
                      <h3 className="mb-2 text-lg font-semibold">No available jobs</h3>
                      <p className="text-sm text-muted-foreground">New jobs will appear here when NGOs claim donations</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pendingDeliveries.map((delivery) => (
                        <AvailableJobCard key={delivery.id} delivery={delivery} partnerId={profile.id} />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Completed Deliveries</CardTitle>
                  <CardDescription>View your delivery history</CardDescription>
                </CardHeader>
                <CardContent>
                  {completedDeliveries.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <CheckCircleIcon className="mb-4 h-12 w-12 text-muted-foreground" />
                      <h3 className="mb-2 text-lg font-semibold">No completed deliveries yet</h3>
                      <p className="text-sm text-muted-foreground">Your delivery history will appear here</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {completedDeliveries.map((delivery) => (
                        <CompletedDeliveryCard key={delivery.id} delivery={delivery} />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Dialogs */}
      <SetupDeliveryPartnerDialog
        open={showSetupDialog}
        onOpenChange={setShowSetupDialog}
        profileId={profile.id}
        onComplete={() => setShowSetupDialog(false)}
      />
    </div>
  )
}
