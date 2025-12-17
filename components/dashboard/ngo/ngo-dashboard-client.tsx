"use client"

import { useState } from "react"
import type { Profile, NGOOrganization, FoodDonation } from "@/lib/types/database"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusIcon, PackageIcon, CheckCircleIcon, ClockIcon } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/shared/dashboard-header"
import { SetupNGODialog } from "@/components/dashboard/ngo/setup-ngo-dialog"
import { AvailableDonationCard } from "@/components/dashboard/ngo/available-donation-card"
import { ClaimedDonationCard } from "@/components/dashboard/ngo/claimed-donation-card"
import { CreateRequestDialog } from "@/components/dashboard/ngo/create-request-dialog"
import { RequestCard } from "@/components/dashboard/ngo/request-card"

interface NGODashboardClientProps {
  profile: Profile
  organization: NGOOrganization | null
  availableDonations: FoodDonation[]
  claimedDonations: FoodDonation[]
  requests: any[]
  stats: {
    totalClaimed: number
    activeClaimed: number
    received: number
  }
}

export function NGODashboardClient({
  profile,
  organization,
  availableDonations,
  claimedDonations,
  requests,
  stats,
}: NGODashboardClientProps) {
  const [showSetupDialog, setShowSetupDialog] = useState(!organization)
  const [showRequestDialog, setShowRequestDialog] = useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader profile={profile} />

      <main className="flex-1 p-4 sm:p-6">
        <div className="mx-auto max-w-7xl space-y-4 sm:space-y-6">
          {/* Welcome Section */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Welcome, {profile.full_name}</h1>
              <p className="text-sm text-muted-foreground sm:text-base">Browse donations and manage your requests</p>
            </div>
            <Button
              size="lg"
              onClick={() => setShowRequestDialog(true)}
              disabled={!organization}
              className="w-full sm:w-auto"
            >
              <PlusIcon className="mr-2 h-5 w-5" />
              Create Request
            </Button>
          </div>

          {/* Organization Setup Alert */}
          {!organization && (
            <Card className="border-primary/50 bg-primary/5">
              <CardHeader>
                <CardTitle>Complete Your NGO Profile</CardTitle>
                <CardDescription>
                  Set up your NGO details to start claiming food donations and making requests.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => setShowSetupDialog(true)}>Setup NGO Profile</Button>
              </CardContent>
            </Card>
          )}

          {/* Stats Cards */}
          <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Claimed</CardTitle>
                <PackageIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalClaimed}</div>
                <p className="text-xs text-muted-foreground">All time donations claimed</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Claims</CardTitle>
                <ClockIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeClaimed}</div>
                <p className="text-xs text-muted-foreground">Currently in progress</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Received</CardTitle>
                <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.received}</div>
                <p className="text-xs text-muted-foreground">Successfully received</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="available">
            <TabsList>
              <TabsTrigger value="available">Available Donations</TabsTrigger>
              <TabsTrigger value="claimed">My Claims</TabsTrigger>
              <TabsTrigger value="requests">My Requests</TabsTrigger>
            </TabsList>

            <TabsContent value="available" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Available Food Donations</CardTitle>
                  <CardDescription>Browse and claim available donations from donors</CardDescription>
                </CardHeader>
                <CardContent>
                  {availableDonations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <PackageIcon className="mb-4 h-12 w-12 text-muted-foreground" />
                      <h3 className="mb-2 text-lg font-semibold">No available donations</h3>
                      <p className="text-sm text-muted-foreground">Check back later for new donations</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {availableDonations.map((donation) => (
                        <AvailableDonationCard
                          key={donation.id}
                          donation={donation}
                          ngoId={profile.id}
                          disabled={!organization}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="claimed" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>My Claimed Donations</CardTitle>
                  <CardDescription>Track donations you have claimed</CardDescription>
                </CardHeader>
                <CardContent>
                  {claimedDonations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <PackageIcon className="mb-4 h-12 w-12 text-muted-foreground" />
                      <h3 className="mb-2 text-lg font-semibold">No claimed donations</h3>
                      <p className="text-sm text-muted-foreground">Browse available donations to claim</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {claimedDonations.map((donation) => (
                        <ClaimedDonationCard key={donation.id} donation={donation} />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="requests" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>My Requests</CardTitle>
                  <CardDescription>Manage your food requests</CardDescription>
                </CardHeader>
                <CardContent>
                  {requests.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <PackageIcon className="mb-4 h-12 w-12 text-muted-foreground" />
                      <h3 className="mb-2 text-lg font-semibold">No requests yet</h3>
                      <p className="mb-4 text-sm text-muted-foreground">Create a request to get started</p>
                      {organization && (
                        <Button onClick={() => setShowRequestDialog(true)}>
                          <PlusIcon className="mr-2 h-4 w-4" />
                          Create Request
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {requests.map((request) => (
                        <RequestCard key={request.id} request={request} />
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
      <SetupNGODialog
        open={showSetupDialog}
        onOpenChange={setShowSetupDialog}
        profileId={profile.id}
        onComplete={() => setShowSetupDialog(false)}
      />
      <CreateRequestDialog open={showRequestDialog} onOpenChange={setShowRequestDialog} ngoId={profile.id} />
    </div>
  )
}
