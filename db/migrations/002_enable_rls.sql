-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donor_organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ngo_organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ngo_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Donor Organizations RLS Policies
CREATE POLICY "Donors can manage their organization"
  ON public.donor_organizations FOR ALL
  USING (profile_id = auth.uid());

CREATE POLICY "Everyone can view verified donor organizations"
  ON public.donor_organizations FOR SELECT
  USING (true);

-- NGO Organizations RLS Policies
CREATE POLICY "NGOs can manage their organization"
  ON public.ngo_organizations FOR ALL
  USING (profile_id = auth.uid());

CREATE POLICY "Everyone can view verified NGO organizations"
  ON public.ngo_organizations FOR SELECT
  USING (documents_verified = true);

-- Delivery Partners RLS Policies
CREATE POLICY "Delivery partners can manage their profile"
  ON public.delivery_partners FOR ALL
  USING (profile_id = auth.uid());

CREATE POLICY "Everyone can view available delivery partners"
  ON public.delivery_partners FOR SELECT
  USING (is_available = true);

-- Food Donations RLS Policies
CREATE POLICY "Donors can create donations"
  ON public.food_donations FOR INSERT
  WITH CHECK (donor_id = auth.uid());

CREATE POLICY "Donors can view and update their donations"
  ON public.food_donations FOR ALL
  USING (donor_id = auth.uid());

CREATE POLICY "NGOs can view available donations"
  ON public.food_donations FOR SELECT
  USING (
    status IN ('available', 'claimed', 'assigned', 'picked_up') OR
    claimed_by = auth.uid()
  );

CREATE POLICY "Delivery partners can view assigned donations"
  ON public.food_donations FOR SELECT
  USING (assigned_to = auth.uid());

-- NGO Requests RLS Policies
CREATE POLICY "NGOs can manage their requests"
  ON public.ngo_requests FOR ALL
  USING (ngo_id = auth.uid());

CREATE POLICY "Donors can view open NGO requests"
  ON public.ngo_requests FOR SELECT
  USING (status = 'open');

-- Deliveries RLS Policies
CREATE POLICY "Delivery partners can view their deliveries"
  ON public.deliveries FOR SELECT
  USING (delivery_partner_id = auth.uid());

CREATE POLICY "Delivery partners can update their deliveries"
  ON public.deliveries FOR UPDATE
  USING (delivery_partner_id = auth.uid());

CREATE POLICY "Donors can view deliveries for their donations"
  ON public.deliveries FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.food_donations
      WHERE food_donations.id = deliveries.donation_id
      AND food_donations.donor_id = auth.uid()
    )
  );

CREATE POLICY "NGOs can view deliveries for their claimed donations"
  ON public.deliveries FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.food_donations
      WHERE food_donations.id = deliveries.donation_id
      AND food_donations.claimed_by = auth.uid()
    )
  );

-- Notifications RLS Policies
CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "System can insert notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (true);

-- Ratings RLS Policies
CREATE POLICY "Users can view ratings"
  ON public.ratings FOR SELECT
  USING (true);

CREATE POLICY "Users can create ratings"
  ON public.ratings FOR INSERT
  WITH CHECK (reviewer_id = auth.uid());

-- Analytics RLS Policies
CREATE POLICY "Admins can view analytics"
  ON public.analytics FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "System can insert analytics"
  ON public.analytics FOR INSERT
  WITH CHECK (true);
