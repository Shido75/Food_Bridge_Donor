import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DonorDashboardClient } from "@/components/dashboard/donor/donor-dashboard-client"

export default async function DonorDashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get donor profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile || profile.role !== "donor") {
    redirect("/auth/login")
  }

  // Get donor organization
  const { data: organization } = await supabase
    .from("donor_organizations")
    .select("*")
    .eq("profile_id", user.id)
    .single()

  // Get donations with stats
  const { data: donations } = await supabase
    .from("food_donations")
    .select("*")
    .eq("donor_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10)

  // Get stats
  const { count: totalDonations } = await supabase
    .from("food_donations")
    .select("*", { count: "only", head: true })
    .eq("donor_id", user.id)

  const { count: activeDonations } = await supabase
    .from("food_donations")
    .select("*", { count: "only", head: true })
    .eq("donor_id", user.id)
    .in("status", ["available", "claimed", "assigned", "picked_up"])

  const { count: completedDonations } = await supabase
    .from("food_donations")
    .select("*", { count: "only", head: true })
    .eq("donor_id", user.id)
    .eq("status", "delivered")

  return (
    <DonorDashboardClient
      profile={profile}
      organization={organization}
      donations={donations || []}
      stats={{
        total: totalDonations || 0,
        active: activeDonations || 0,
        completed: completedDonations || 0,
      }}
    />
  )
}
