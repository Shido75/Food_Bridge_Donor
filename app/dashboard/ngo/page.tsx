import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { NGODashboardClient } from "@/components/dashboard/ngo/ngo-dashboard-client"

export default async function NGODashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get NGO profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile || profile.role !== "ngo") {
    redirect("/auth/login")
  }

  // Get NGO organization
  const { data: organization } = await supabase.from("ngo_organizations").select("*").eq("profile_id", user.id).single()

  // Get available donations
  const { data: availableDonations } = await supabase
    .from("food_donations")
    .select("*")
    .eq("status", "available")
    .order("created_at", { ascending: false })
    .limit(20)

  // Get claimed donations
  const { data: claimedDonations } = await supabase
    .from("food_donations")
    .select("*")
    .eq("claimed_by", user.id)
    .order("created_at", { ascending: false })
    .limit(10)

  // Get NGO requests
  const { data: requests } = await supabase
    .from("ngo_requests")
    .select("*")
    .eq("ngo_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10)

  // Get stats
  const { count: totalClaimed } = await supabase
    .from("food_donations")
    .select("*", { count: "only", head: true })
    .eq("claimed_by", user.id)

  const { count: activeClaimed } = await supabase
    .from("food_donations")
    .select("*", { count: "only", head: true })
    .eq("claimed_by", user.id)
    .in("status", ["claimed", "assigned", "picked_up"])

  const { count: received } = await supabase
    .from("food_donations")
    .select("*", { count: "only", head: true })
    .eq("claimed_by", user.id)
    .eq("status", "delivered")

  return (
    <NGODashboardClient
      profile={profile}
      organization={organization}
      availableDonations={availableDonations || []}
      claimedDonations={claimedDonations || []}
      requests={requests || []}
      stats={{
        totalClaimed: totalClaimed || 0,
        activeClaimed: activeClaimed || 0,
        received: received || 0,
      }}
    />
  )
}
