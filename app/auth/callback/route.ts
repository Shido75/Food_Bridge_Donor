import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Get user profile to redirect to appropriate dashboard
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single()

      if (profile?.role) {
        return NextResponse.redirect(new URL(`/dashboard/${profile.role}`, requestUrl.origin))
      }
    }
  }

  // If there's an error or no code, redirect to login
  return NextResponse.redirect(new URL("/auth/login", requestUrl.origin))
}
