export type UserRole = "donor" | "ngo" | "delivery_partner" | "admin"

export type FoodType = "cooked" | "raw" | "packaged" | "bakery"

export type DonationStatus = "available" | "claimed" | "assigned" | "picked_up" | "delivered" | "cancelled" | "expired"

export type DeliveryStatus =
  | "assigned"
  | "accepted"
  | "in_transit_to_pickup"
  | "at_pickup"
  | "picked_up"
  | "in_transit_to_delivery"
  | "at_delivery"
  | "delivered"
  | "cancelled"

export interface Profile {
  id: string
  email: string
  full_name: string
  phone: string
  role: UserRole
  avatar_url?: string
  address?: string
  city: string
  state: string
  pincode?: string
  latitude?: number
  longitude?: number
  is_verified: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface DonorOrganization {
  id: string
  profile_id: string
  organization_name: string
  organization_type: string
  fssai_license?: string
  gst_number?: string
  operating_hours?: string
  created_at: string
  updated_at: string
}

export interface NGOOrganization {
  id: string
  profile_id: string
  ngo_name: string
  registration_number: string
  beneficiary_count: number
  beneficiary_type: string[]
  operating_areas: string[]
  documents_verified: boolean
  created_at: string
  updated_at: string
}

export interface DeliveryPartner {
  id: string
  profile_id: string
  vehicle_type: string
  vehicle_number: string
  license_number: string
  is_available: boolean
  current_latitude?: number
  current_longitude?: number
  rating: number
  total_deliveries: number
  created_at: string
  updated_at: string
}

export interface FoodDonation {
  id: string
  donor_id: string
  food_type: FoodType
  food_category: string
  quantity: number
  unit: string
  description?: string
  preparation_time?: string
  expiry_time: string
  pickup_address: string
  pickup_latitude?: number
  pickup_longitude?: number
  pickup_instructions?: string
  food_images: string[]
  status: DonationStatus
  claimed_by?: string
  assigned_to?: string
  claimed_at?: string
  assigned_at?: string
  pickup_time?: string
  delivery_time?: string
  cancellation_reason?: string
  created_at: string
  updated_at: string
}

export interface Delivery {
  id: string
  donation_id: string
  delivery_partner_id: string
  pickup_address: string
  pickup_latitude?: number
  pickup_longitude?: number
  delivery_address: string
  delivery_latitude?: number
  delivery_longitude?: number
  status: DeliveryStatus
  estimated_pickup_time?: string
  actual_pickup_time?: string
  estimated_delivery_time?: string
  actual_delivery_time?: string
  distance_km?: number
  route_coordinates?: any
  notes?: string
  proof_of_pickup?: string
  proof_of_delivery?: string
  created_at: string
  updated_at: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: "donation" | "request" | "delivery" | "system" | "alert"
  related_id?: string
  is_read: boolean
  created_at: string
}
