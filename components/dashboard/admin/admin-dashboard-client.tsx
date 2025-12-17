"use client"

import type { Profile } from "@/lib/types/database"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  UsersIcon,
  PackageIcon,
  TruckIcon,
  CheckCircleIcon,
  ClockIcon,
  AlertCircleIcon,
  HeartIcon,
  LeafIcon,
} from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/shared/dashboard-header"
import { RecentDonationsTable } from "@/components/dashboard/admin/recent-donations-table"
import { UserManagementTable } from "@/components/dashboard/admin/user-management-table"
import { VerificationQueue } from "@/components/dashboard/admin/verification-queue"

interface AdminDashboardClientProps {
  profile: Profile
  stats: {
    totalDonors: number
    totalNGOs: number
    totalDeliveryPartners: number
    totalDonations: number
    activeDonations: number
    completedDonations: number
    totalDeliveries: number
    activeDeliveries: number
  }
  recentDonations: any[]
  allUsers: Profile[]
  pendingVerifications: {
    donors: any[]
    ngos: any[]
  }
}

export function AdminDashboardClient({
  profile,
  stats,
  recentDonations,
  allUsers,
  pendingVerifications,
}: AdminDashboardClientProps) {
  const totalUsers = stats.totalDonors + stats.totalNGOs + stats.totalDeliveryPartners
  const pendingCount = pendingVerifications.donors.length + pendingVerifications.ngos.length

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader profile={profile} />

      <main className="flex-1 p-4 sm:p-6">
        <div className="mx-auto max-w-7xl space-y-4 sm:space-y-6">
          {/* Welcome Section */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground sm:text-base">Monitor platform activity and manage users</p>
          </div>

          {/* Pending Verifications Alert */}
          {pendingCount > 0 && (
            <Card className="border-orange-500/50 bg-orange-500/5">
              <CardHeader className="flex flex-row items-center gap-4 pb-4">
                <AlertCircleIcon className="h-5 w-5 text-orange-600" />
                <div className="flex-1">
                  <CardTitle className="text-base">Pending Verifications</CardTitle>
                  <CardDescription>
                    {pendingCount} organization{pendingCount > 1 ? "s" : ""} waiting for verification
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
          )}

          {/* Primary Stats */}
          <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <UsersIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.totalDonors}D • {stats.totalNGOs}N • {stats.totalDeliveryPartners}DP
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
                <PackageIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalDonations}</div>
                <p className="text-xs text-muted-foreground">{stats.completedDonations} completed</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Now</CardTitle>
                <ClockIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeDonations}</div>
                <p className="text-xs text-muted-foreground">{stats.activeDeliveries} in delivery</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Deliveries</CardTitle>
                <TruckIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalDeliveries}</div>
                <p className="text-xs text-muted-foreground">All time deliveries</p>
              </CardContent>
            </Card>
          </div>

          {/* Impact Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Impact</CardTitle>
              <CardDescription>Environmental and social impact metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex flex-col items-center rounded-lg border p-4 text-center">
                  <HeartIcon className="mb-2 h-8 w-8 text-primary" />
                  <div className="text-2xl font-bold">{(stats.completedDonations * 50).toLocaleString()}</div>
                  <p className="text-sm text-muted-foreground">Meals Served</p>
                </div>
                <div className="flex flex-col items-center rounded-lg border p-4 text-center">
                  <LeafIcon className="mb-2 h-8 w-8 text-primary" />
                  <div className="text-2xl font-bold">{(stats.completedDonations * 25).toLocaleString()} kg</div>
                  <p className="text-sm text-muted-foreground">Food Saved</p>
                </div>
                <div className="flex flex-col items-center rounded-lg border p-4 text-center">
                  <PackageIcon className="mb-2 h-8 w-8 text-primary" />
                  <div className="text-2xl font-bold">{totalUsers}</div>
                  <p className="text-sm text-muted-foreground">Active Partners</p>
                </div>
                <div className="flex flex-col items-center rounded-lg border p-4 text-center">
                  <CheckCircleIcon className="mb-2 h-8 w-8 text-primary" />
                  <div className="text-2xl font-bold">{(stats.completedDonations * 15).toLocaleString()} kg</div>
                  <p className="text-sm text-muted-foreground">CO₂ Prevented</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content Tabs */}
          <Tabs defaultValue="donations">
            <TabsList>
              <TabsTrigger value="donations">Recent Donations</TabsTrigger>
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="verifications">
                Verifications
                {pendingCount > 0 && (
                  <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    {pendingCount}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="donations">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Donations</CardTitle>
                  <CardDescription>Latest food donation activity on the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentDonationsTable donations={recentDonations} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage all users on the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <UserManagementTable users={allUsers} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="verifications">
              <VerificationQueue pendingDonors={pendingVerifications.donors} pendingNGOs={pendingVerifications.ngos} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
