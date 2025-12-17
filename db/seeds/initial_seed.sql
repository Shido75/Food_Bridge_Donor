-- Seed some initial analytics data
INSERT INTO public.analytics (metric_type, metric_value, metric_unit, metadata) VALUES
  ('total_food_saved_kg', 0, 'kg', '{"description": "Total food saved from waste"}'),
  ('total_meals_served', 0, 'meals', '{"description": "Total meals served to beneficiaries"}'),
  ('active_donors', 0, 'count', '{"description": "Number of active donors"}'),
  ('active_ngos', 0, 'count', '{"description": "Number of active NGOs"}'),
  ('active_delivery_partners', 0, 'count', '{"description": "Number of active delivery partners"}'),
  ('co2_emissions_saved', 0, 'kg', '{"description": "Estimated CO2 emissions prevented"}')
ON CONFLICT DO NOTHING;
