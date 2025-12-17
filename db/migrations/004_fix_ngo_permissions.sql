-- Allow NGOs to update donations they are claiming
CREATE POLICY "NGOs can update donations they claim"
  ON public.food_donations FOR UPDATE
  USING (
    status = 'available' OR 
    claimed_by = auth.uid()
  )
  WITH CHECK (
    claimed_by = auth.uid()
  );

-- Allow NGOs to insert delivery records for their claimed donations
CREATE POLICY "NGOs can create deliveries for their claims"
  ON public.deliveries FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.food_donations
      WHERE id = donation_id
      AND claimed_by = auth.uid()
    )
  );
