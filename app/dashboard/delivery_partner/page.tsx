import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DeliveryPartnerDashboardClient } from "@/components/dashboard/delivery-partner/delivery-partner-dashboard-client"

export default async function DeliveryPartnerDashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get delivery partner profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile || profile.role !== "delivery_partner") {
    redirect("/auth/login")
  }

  // Get delivery partner details
  const { data: partnerDetails } = await supabase
    .from("delivery_partners")
    .select("*")
    .eq("profile_id", user.id)
    .single()

  // Get active deliveries
  const { data: activeDeliveries } = await supabase
    .from("deliveries")
    .select(`
      *,
      donation:food_donations(*)
    `)
    .eq("delivery_partner_id", user.id)
    .in("status", [
      "assigned",
      "accepted",
      "in_transit_to_pickup",
      "at_pickup",
      "picked_up",
      "in_transit_to_delivery",
      "at_delivery",
    ])
    .order("created_at", { ascending: false })

  // Get completed deliveries
  const { data: completedDeliveries } = await supabase
    .from("deliveries")
    .select(`
      *,
      donation:food_donations(*)
    `)
    .eq("delivery_partner_id", user.id)
    .eq("status", "delivered")
    .order("created_at", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(10)

  // Get available jobs (pending deliveries)
  const { data: pendingDeliveries } = await supabase
    .from("deliveries")
    .select(`
      *,
      donation:food_donations(*)
    `)
    .eq("status", "pending")
    .order("created_at", { ascending: true })

  // Get stats
  const { count: totalDeliveries } = await supabase
    .from("deliveries")
    .select("*", { count: "exact", head: true })
    .eq("delivery_partner_id", user.id)

  const { count: activeCount } = await supabase
    .from("deliveries")
    .select("*", { count: "exact", head: true })
    .eq("delivery_partner_id", user.id)
    .in("status", [
      "assigned",
      "accepted",
      "in_transit_to_pickup",
      "at_pickup",
      "picked_up",
      "in_transit_to_delivery",
      "at_delivery",
    ])

  const { count: completedCount } = await supabase
    .from("deliveries")
    .select("*", { count: "exact", head: true })
    .eq("delivery_partner_id", user.id)
    .eq("status", "delivered")

  return (
    <DeliveryPartnerDashboardClient
      profile={profile}
      partnerDetails={partnerDetails}
      activeDeliveries={activeDeliveries || []}
      completedDeliveries={completedDeliveries || []}
      pendingDeliveries={pendingDeliveries || []}
      stats={{
        total: totalDeliveries || 0,
        active: activeCount || 0,
        completed: completedCount || 0,
      }}
    />
  )
}
