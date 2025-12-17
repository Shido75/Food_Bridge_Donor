"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircleIcon, XCircleIcon, BuildingIcon, HeartIcon } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface VerificationQueueProps {
  pendingDonors: any[]
  pendingNGOs: any[]
}

export function VerificationQueue({ pendingDonors, pendingNGOs }: VerificationQueueProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleVerifyDonor = async (donorId: string, profileId: string) => {
    setLoadingId(donorId)
    try {
      await supabase.from("profiles").update({ is_verified: true }).eq("id", profileId)

      router.refresh()
    } catch (error) {
      console.error("[v0] Error verifying donor:", error)
    } finally {
      setLoadingId(null)
    }
  }

  const handleVerifyNGO = async (ngoId: string) => {
    setLoadingId(ngoId)
    try {
      await supabase.from("ngo_organizations").update({ documents_verified: true }).eq("id", ngoId)

      router.refresh()
    } catch (error) {
      console.error("[v0] Error verifying NGO:", error)
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Pending Donors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BuildingIcon className="h-5 w-5" />
            Pending Donor Verifications
          </CardTitle>
          <CardDescription>Review and verify donor organizations</CardDescription>
        </CardHeader>
        <CardContent>
          {pendingDonors.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <CheckCircleIcon className="mb-2 h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No pending donor verifications</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingDonors.map((donor) => (
                <div key={donor.id} className="rounded-lg border p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{donor.organization_name}</h4>
                      <p className="text-sm text-muted-foreground">{donor.profile?.full_name}</p>
                      <p className="text-sm text-muted-foreground">{donor.profile?.email}</p>
                    </div>
                    <Badge className="capitalize">{donor.organization_type}</Badge>
                  </div>

                  {donor.fssai_license && (
                    <div className="text-sm">
                      <span className="font-medium">FSSAI License:</span> {donor.fssai_license}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleVerifyDonor(donor.id, donor.profile_id)}
                      disabled={loadingId === donor.id}
                    >
                      <CheckCircleIcon className="mr-1 h-4 w-4" />
                      Verify
                    </Button>
                    <Button size="sm" variant="outline" disabled={loadingId === donor.id}>
                      <XCircleIcon className="mr-1 h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pending NGOs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HeartIcon className="h-5 w-5" />
            Pending NGO Verifications
          </CardTitle>
          <CardDescription>Review and verify NGO organizations</CardDescription>
        </CardHeader>
        <CardContent>
          {pendingNGOs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <CheckCircleIcon className="mb-2 h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No pending NGO verifications</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingNGOs.map((ngo) => (
                <div key={ngo.id} className="rounded-lg border p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{ngo.ngo_name}</h4>
                      <p className="text-sm text-muted-foreground">{ngo.profile?.full_name}</p>
                      <p className="text-sm text-muted-foreground">{ngo.profile?.email}</p>
                    </div>
                  </div>

                  <div className="space-y-1 text-sm">
                    <div>
                      <span className="font-medium">Registration:</span> {ngo.registration_number}
                    </div>
                    <div>
                      <span className="font-medium">Beneficiaries:</span> {ngo.beneficiary_count}
                    </div>
                    {ngo.beneficiary_type?.length > 0 && (
                      <div>
                        <span className="font-medium">Types:</span> {ngo.beneficiary_type.join(", ")}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleVerifyNGO(ngo.id)} disabled={loadingId === ngo.id}>
                      <CheckCircleIcon className="mr-1 h-4 w-4" />
                      Verify
                    </Button>
                    <Button size="sm" variant="outline" disabled={loadingId === ngo.id}>
                      <XCircleIcon className="mr-1 h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
