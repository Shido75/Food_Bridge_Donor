"use client"

import { useState } from "react"
import type { Profile, DonorOrganization, FoodDonation } from "@/lib/types/database"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusIcon, PackageIcon, TruckIcon, CheckCircleIcon } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/shared/dashboard-header"
import { CreateDonationDialog } from "@/components/dashboard/donor/create-donation-dialog"
import { DonationCard } from "@/components/dashboard/donor/donation-card"
import { SetupOrganizationDialog } from "@/components/dashboard/donor/setup-organization-dialog"

interface DonorDashboardClientProps {
  profile: Profile
  organization: DonorOrganization | null
  donations: FoodDonation[]
  stats: {
    total: number
    active: number
    completed: number
  }
}

export function DonorDashboardClient({ profile, organization, donations, stats }: DonorDashboardClientProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showSetupDialog, setShowSetupDialog] = useState(!organization)

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader profile={profile} />

      <main className="flex-1 p-4 sm:p-6">
        <div className="mx-auto max-w-7xl space-y-4 sm:space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Welcome back, {profile.full_name}</h1>
              <p className="text-sm text-muted-foreground sm:text-base">
                Manage your food donations and track their impact
              </p>
            </div>
            <Button
              size="lg"
              onClick={() => setShowCreateDialog(true)}
              disabled={!organization}
              className="w-full sm:w-auto"
            >
              <PlusIcon className="mr-2 h-5 w-5" />
              New Donation
            </Button>
          </div>

          {/* Organization Setup Alert */}
          {!organization && (
            <Card className="border-primary/50 bg-primary/5">
              <CardHeader>
                <CardTitle>Complete Your Organization Profile</CardTitle>
                <CardDescription>
                  Set up your organization details to start listing food donations and make an impact.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => setShowSetupDialog(true)}>Setup Organization</Button>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
                <PackageIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">All time donations created</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Donations</CardTitle>
                <TruckIcon className="h-4 w-4 text-muted-foreground" />
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
          </div>

          {/* Donations List */}
          <Card>
            <CardHeader>
              <CardTitle>Your Donations</CardTitle>
              <CardDescription>Track and manage all your food donations</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="space-y-4">
                  {donations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <PackageIcon className="mb-4 h-12 w-12 text-muted-foreground" />
                      <h3 className="mb-2 text-lg font-semibold">No donations yet</h3>
                      <p className="mb-4 text-sm text-muted-foreground">
                        Create your first donation to start making an impact
                      </p>
                      {organization && (
                        <Button onClick={() => setShowCreateDialog(true)}>
                          <PlusIcon className="mr-2 h-4 w-4" />
                          Create Donation
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {donations.map((donation) => (
                        <DonationCard key={donation.id} donation={donation} />
                      ))}
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="active" className="space-y-4">
                  {donations
                    .filter((d) => ["available", "claimed", "assigned", "picked_up"].includes(d.status))
                    .map((donation) => (
                      <DonationCard key={donation.id} donation={donation} />
                    ))}
                </TabsContent>
                <TabsContent value="completed" className="space-y-4">
                  {donations
                    .filter((d) => d.status === "delivered")
                    .map((donation) => (
                      <DonationCard key={donation.id} donation={donation} />
                    ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Dialogs */}
      <CreateDonationDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} donorId={profile.id} />
      <SetupOrganizationDialog
        open={showSetupDialog}
        onOpenChange={setShowSetupDialog}
        profileId={profile.id}
        onComplete={() => setShowSetupDialog(false)}
      />
    </div>
  )
}
