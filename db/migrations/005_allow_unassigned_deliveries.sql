-- Make delivery_partner_id nullable
ALTER TABLE public.deliveries ALTER COLUMN delivery_partner_id DROP NOT NULL;

-- Drop old status check and add new one with 'pending'
ALTER TABLE public.deliveries DROP CONSTRAINT IF EXISTS deliveries_status_check;
ALTER TABLE public.deliveries ADD CONSTRAINT deliveries_status_check 
  CHECK (status IN ('pending', 'assigned', 'accepted', 'in_transit_to_pickup', 'at_pickup', 'picked_up', 'in_transit_to_delivery', 'at_delivery', 'delivered', 'cancelled'));

-- Policy: Delivery partners can VIEW pending deliveries (Available Jobs)
CREATE POLICY "Delivery partners can view pending deliveries"
  ON public.deliveries FOR SELECT
  USING (status = 'pending');

-- Policy: Delivery partners can UPDATE pending deliveries (to Accept them)
CREATE POLICY "Delivery partners can accept pending deliveries"
  ON public.deliveries FOR UPDATE
  USING (status = 'pending')
  WITH CHECK (
    status = 'accepted' AND 
    delivery_partner_id = auth.uid()
  );
