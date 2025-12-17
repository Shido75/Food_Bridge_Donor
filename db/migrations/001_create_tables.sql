-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- User Profiles Table (references auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('donor', 'ngo', 'delivery_partner', 'admin')),
  avatar_url TEXT,
  address TEXT,
  city TEXT DEFAULT 'Pune',
  state TEXT DEFAULT 'Maharashtra',
  pincode TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Donor Organizations Table
CREATE TABLE IF NOT EXISTS public.donor_organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  organization_name TEXT NOT NULL,
  organization_type TEXT NOT NULL CHECK (organization_type IN ('restaurant', 'hotel', 'hostel', 'catering', 'bakery', 'other')),
  fssai_license TEXT,
  gst_number TEXT,
  operating_hours TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- NGO Organizations Table
CREATE TABLE IF NOT EXISTS public.ngo_organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  ngo_name TEXT NOT NULL,
  registration_number TEXT NOT NULL,
  beneficiary_count INTEGER DEFAULT 0,
  beneficiary_type TEXT[] DEFAULT ARRAY[]::TEXT[],
  operating_areas TEXT[] DEFAULT ARRAY[]::TEXT[],
  documents_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Delivery Partners Table
CREATE TABLE IF NOT EXISTS public.delivery_partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  vehicle_type TEXT NOT NULL CHECK (vehicle_type IN ('bike', 'scooter', 'car', 'van')),
  vehicle_number TEXT NOT NULL,
  license_number TEXT NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  current_latitude DECIMAL(10, 8),
  current_longitude DECIMAL(11, 8),
  rating DECIMAL(3, 2) DEFAULT 0.00,
  total_deliveries INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Food Donations Table
CREATE TABLE IF NOT EXISTS public.food_donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  food_type TEXT NOT NULL CHECK (food_type IN ('cooked', 'raw', 'packaged', 'bakery')),
  food_category TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit TEXT NOT NULL CHECK (unit IN ('kg', 'packets', 'plates', 'liters')),
  description TEXT,
  preparation_time TIMESTAMPTZ,
  expiry_time TIMESTAMPTZ NOT NULL,
  pickup_address TEXT NOT NULL,
  pickup_latitude DECIMAL(10, 8),
  pickup_longitude DECIMAL(11, 8),
  pickup_instructions TEXT,
  food_images TEXT[] DEFAULT ARRAY[]::TEXT[],
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'claimed', 'assigned', 'picked_up', 'delivered', 'cancelled', 'expired')),
  claimed_by UUID REFERENCES public.profiles(id),
  assigned_to UUID REFERENCES public.profiles(id),
  claimed_at TIMESTAMPTZ,
  assigned_at TIMESTAMPTZ,
  pickup_time TIMESTAMPTZ,
  delivery_time TIMESTAMPTZ,
  cancellation_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- NGO Requests Table
CREATE TABLE IF NOT EXISTS public.ngo_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ngo_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  request_type TEXT NOT NULL,
  quantity_needed INTEGER NOT NULL,
  urgency TEXT NOT NULL CHECK (urgency IN ('low', 'medium', 'high', 'critical')),
  delivery_address TEXT NOT NULL,
  delivery_latitude DECIMAL(10, 8),
  delivery_longitude DECIMAL(11, 8),
  required_by TIMESTAMPTZ NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'matched', 'fulfilled', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Delivery Tracking Table
CREATE TABLE IF NOT EXISTS public.deliveries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donation_id UUID NOT NULL REFERENCES public.food_donations(id) ON DELETE CASCADE,
  delivery_partner_id UUID NOT NULL REFERENCES public.profiles(id),
  pickup_address TEXT NOT NULL,
  pickup_latitude DECIMAL(10, 8),
  pickup_longitude DECIMAL(11, 8),
  delivery_address TEXT NOT NULL,
  delivery_latitude DECIMAL(10, 8),
  delivery_longitude DECIMAL(11, 8),
  status TEXT NOT NULL DEFAULT 'assigned' CHECK (status IN ('assigned', 'accepted', 'in_transit_to_pickup', 'at_pickup', 'picked_up', 'in_transit_to_delivery', 'at_delivery', 'delivered', 'cancelled')),
  estimated_pickup_time TIMESTAMPTZ,
  actual_pickup_time TIMESTAMPTZ,
  estimated_delivery_time TIMESTAMPTZ,
  actual_delivery_time TIMESTAMPTZ,
  distance_km DECIMAL(10, 2),
  route_coordinates JSONB,
  notes TEXT,
  proof_of_pickup TEXT,
  proof_of_delivery TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('donation', 'request', 'delivery', 'system', 'alert')),
  related_id UUID,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ratings and Reviews Table
CREATE TABLE IF NOT EXISTS public.ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donation_id UUID REFERENCES public.food_donations(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES public.profiles(id),
  reviewee_id UUID NOT NULL REFERENCES public.profiles(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics and Metrics Table
CREATE TABLE IF NOT EXISTS public.analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  metric_type TEXT NOT NULL,
  metric_value DECIMAL(10, 2) NOT NULL,
  metric_unit TEXT,
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_city ON public.profiles(city);
CREATE INDEX IF NOT EXISTS idx_profiles_location ON public.profiles USING GIST (ST_MakePoint(longitude, latitude)::geography);
CREATE INDEX IF NOT EXISTS idx_food_donations_status ON public.food_donations(status);
CREATE INDEX IF NOT EXISTS idx_food_donations_donor_id ON public.food_donations(donor_id);
CREATE INDEX IF NOT EXISTS idx_food_donations_expiry ON public.food_donations(expiry_time);
CREATE INDEX IF NOT EXISTS idx_food_donations_location ON public.food_donations USING GIST (ST_MakePoint(pickup_longitude, pickup_latitude)::geography);
CREATE INDEX IF NOT EXISTS idx_deliveries_status ON public.deliveries(status);
CREATE INDEX IF NOT EXISTS idx_deliveries_partner ON public.deliveries(delivery_partner_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_ngo_requests_status ON public.ngo_requests(status);
