"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface CreateRequestDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ngoId: string
}

export function CreateRequestDialog({ open, onOpenChange, ngoId }: CreateRequestDialogProps) {
  const [requestType, setRequestType] = useState("")
  const [quantityNeeded, setQuantityNeeded] = useState("")
  const [urgency, setUrgency] = useState("")
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [requiredByHours, setRequiredByHours] = useState("24")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const requiredBy = new Date()
      requiredBy.setHours(requiredBy.getHours() + Number.parseInt(requiredByHours))

      const { error } = await supabase.from("ngo_requests").insert({
        ngo_id: ngoId,
        request_type: requestType,
        quantity_needed: Number.parseInt(quantityNeeded),
        urgency: urgency,
        delivery_address: deliveryAddress,
        required_by: requiredBy.toISOString(),
        description: description || null,
        status: "open",
      })

      if (error) throw error

      setRequestType("")
      setQuantityNeeded("")
      setUrgency("")
      setDeliveryAddress("")
      setRequiredByHours("24")
      setDescription("")

      onOpenChange(false)
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Food Request</DialogTitle>
          <DialogDescription>Submit a request for specific food items you need</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="requestType">Request Type *</Label>
              <Input
                id="requestType"
                placeholder="e.g., Cooked Meals, Vegetables"
                value={requestType}
                onChange={(e) => setRequestType(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantityNeeded">Quantity Needed *</Label>
              <Input
                id="quantityNeeded"
                type="number"
                min="1"
                placeholder="e.g., 100"
                value={quantityNeeded}
                onChange={(e) => setQuantityNeeded(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="urgency">Urgency *</Label>
              <Select value={urgency} onValueChange={setUrgency} required>
                <SelectTrigger id="urgency">
                  <SelectValue placeholder="Select urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="requiredByHours">Required Within *</Label>
              <Select value={requiredByHours} onValueChange={setRequiredByHours} required>
                <SelectTrigger id="requiredByHours">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6 hours</SelectItem>
                  <SelectItem value="12">12 hours</SelectItem>
                  <SelectItem value="24">24 hours</SelectItem>
                  <SelectItem value="48">48 hours</SelectItem>
                  <SelectItem value="72">72 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deliveryAddress">Delivery Address *</Label>
            <Textarea
              id="deliveryAddress"
              placeholder="Enter complete delivery address"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              rows={2}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Provide additional details about your request"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {error && <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
