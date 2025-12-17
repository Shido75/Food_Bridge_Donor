import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminDashboardClient } from "@/components/dashboard/admin/admin-dashboard-client"

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get admin profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile || profile.role !== "admin") {
    redirect("/auth/login")
  }

  // Get platform stats
  const { count: totalDonors } = await supabase
    .from("profiles")
    .select("*", { count: "only", head: true })
    .eq("role", "donor")

  const { count: totalNGOs } = await supabase
    .from("profiles")
    .select("*", { count: "only", head: true })
    .eq("role", "ngo")

  const { count: totalDeliveryPartners } = await supabase
    .from("profiles")
    .select("*", { count: "only", head: true })
    .eq("role", "delivery_partner")

  const { count: totalDonations } = await supabase.from("food_donations").select("*", { count: "only", head: true })

  const { count: activeDonations } = await supabase
    .from("food_donations")
    .select("*", { count: "only", head: true })
    .in("status", ["available", "claimed", "assigned", "picked_up"])

  const { count: completedDonations } = await supabase
    .from("food_donations")
    .select("*", { count: "only", head: true })
    .eq("status", "delivered")

  const { count: totalDeliveries } = await supabase.from("deliveries").select("*", { count: "only", head: true })

  const { count: activeDeliveries } = await supabase
    .from("deliveries")
    .select("*", { count: "only", head: true })
    .in("status", [
      "assigned",
      "accepted",
      "in_transit_to_pickup",
      "at_pickup",
      "picked_up",
      "in_transit_to_delivery",
      "at_delivery",
    ])

  // Get recent donations
  const { data: recentDonations } = await supabase
    .from("food_donations")
    .select(
      `
      *,
      donor:profiles!food_donations_donor_id_fkey(full_name, email)
    `,
    )
    .order("created_at", { ascending: false })
    .limit(10)

  // Get all users for management
  const { data: allUsers } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })

  // Get pending verifications
  const { data: pendingDonors } = await supabase
    .from("donor_organizations")
    .select(
      `
      *,
      profile:profiles(*)
    `,
    )
    .eq("profiles.is_verified", false)

  const { data: pendingNGOs } = await supabase
    .from("ngo_organizations")
    .select(
      `
      *,
      profile:profiles(*)
    `,
    )
    .eq("documents_verified", false)

  return (
    <AdminDashboardClient
      profile={profile}
      stats={{
        totalDonors: totalDonors || 0,
        totalNGOs: totalNGOs || 0,
        totalDeliveryPartners: totalDeliveryPartners || 0,
        totalDonations: totalDonations || 0,
        activeDonations: activeDonations || 0,
        completedDonations: completedDonations || 0,
        totalDeliveries: totalDeliveries || 0,
        activeDeliveries: activeDeliveries || 0,
      }}
      recentDonations={recentDonations || []}
      allUsers={allUsers || []}
      pendingVerifications={{
        donors: pendingDonors || [],
        ngos: pendingNGOs || [],
      }}
    />
  )
}
