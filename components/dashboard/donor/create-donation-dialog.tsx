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

interface CreateDonationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  donorId: string
}

export function CreateDonationDialog({ open, onOpenChange, donorId }: CreateDonationDialogProps) {
  const [foodType, setFoodType] = useState("")
  const [foodCategory, setFoodCategory] = useState("")
  const [quantity, setQuantity] = useState("")
  const [unit, setUnit] = useState("")
  const [description, setDescription] = useState("")
  const [expiryHours, setExpiryHours] = useState("4")
  const [pickupAddress, setPickupAddress] = useState("")
  const [pickupInstructions, setPickupInstructions] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Calculate expiry time
      const expiryTime = new Date()
      expiryTime.setHours(expiryTime.getHours() + Number.parseInt(expiryHours))

      const { error } = await supabase.from("food_donations").insert({
        donor_id: donorId,
        food_type: foodType,
        food_category: foodCategory,
        quantity: Number.parseInt(quantity),
        unit: unit,
        description: description || null,
        preparation_time: new Date().toISOString(),
        expiry_time: expiryTime.toISOString(),
        pickup_address: pickupAddress,
        pickup_instructions: pickupInstructions || null,
        status: "available",
      })

      if (error) throw error

      // Reset form
      setFoodType("")
      setFoodCategory("")
      setQuantity("")
      setUnit("")
      setDescription("")
      setExpiryHours("4")
      setPickupAddress("")
      setPickupInstructions("")

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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Donation</DialogTitle>
          <DialogDescription>List your surplus food to help those in need</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="foodType">Food Type *</Label>
              <Select value={foodType} onValueChange={setFoodType} required>
                <SelectTrigger id="foodType">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cooked">Cooked Food</SelectItem>
                  <SelectItem value="raw">Raw Ingredients</SelectItem>
                  <SelectItem value="packaged">Packaged Food</SelectItem>
                  <SelectItem value="bakery">Bakery Items</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="foodCategory">Food Category *</Label>
              <Input
                id="foodCategory"
                placeholder="e.g., Rice & Curry, Vegetables"
                value={foodCategory}
                onChange={(e) => setFoodCategory(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                placeholder="e.g., 50"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit *</Label>
              <Select value={unit} onValueChange={setUnit} required>
                <SelectTrigger id="unit">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">Kilograms (kg)</SelectItem>
                  <SelectItem value="packets">Packets</SelectItem>
                  <SelectItem value="plates">Plates</SelectItem>
                  <SelectItem value="liters">Liters</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Describe the food items, ingredients, dietary info, etc."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiryHours">Best Consumed Within *</Label>
            <Select value={expiryHours} onValueChange={setExpiryHours} required>
              <SelectTrigger id="expiryHours">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 hours</SelectItem>
                <SelectItem value="4">4 hours</SelectItem>
                <SelectItem value="6">6 hours</SelectItem>
                <SelectItem value="12">12 hours</SelectItem>
                <SelectItem value="24">24 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pickupAddress">Pickup Address *</Label>
            <Textarea
              id="pickupAddress"
              placeholder="Enter complete pickup address"
              value={pickupAddress}
              onChange={(e) => setPickupAddress(e.target.value)}
              rows={2}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pickupInstructions">Pickup Instructions (Optional)</Label>
            <Textarea
              id="pickupInstructions"
              placeholder="e.g., Ring bell at main entrance, Contact security"
              value={pickupInstructions}
              onChange={(e) => setPickupInstructions(e.target.value)}
              rows={2}
            />
          </div>

          {error && <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Donation"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
