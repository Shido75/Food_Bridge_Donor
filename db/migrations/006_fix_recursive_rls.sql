-- ============================================================
-- Fix: infinite recursion in profiles RLS policy
-- ============================================================
-- The original "Admins can view all profiles" policy did:
--   EXISTS (SELECT 1 FROM public.profiles WHERE ...)
-- inside a policy ON public.profiles → infinite recursion
-- that also blocks every normal user from reading their own profile.
--
-- Fix: use a SECURITY DEFINER function that reads the table
-- without triggering RLS, called from the policy instead.
-- ============================================================

-- 1. Create a helper function that checks admin role bypassing RLS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER          -- runs as the function owner (postgres), bypasses RLS
SET search_path = public   -- prevents search_path injection
STABLE                     -- result is stable within a single statement
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- 2. Drop the recursive policy on profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- 3. Recreate it using the SECURITY DEFINER function (no recursion)
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_admin());

-- 4. Fix the same pattern in analytics (also queries profiles recursively)
DROP POLICY IF EXISTS "Admins can view analytics" ON public.analytics;

CREATE POLICY "Admins can view analytics"
  ON public.analytics FOR SELECT
  USING (public.is_admin());
