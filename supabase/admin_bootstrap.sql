-- ==============================================================================
-- TOASTMASTERS TASK HUB - SECURE FIRST SUPER ADMIN BOOTSTRAP
-- Run this in the Supabase SQL Editor AFTER the user signs in with Google once.
-- ==============================================================================

-- 1. Promote Yahoshuva Kesaboyina to Super Admin
UPDATE public.profiles
SET 
  system_role = 'super_admin',
  club_role = 'Super Admin / Club Secretary',
  is_active = true
WHERE email IN (
  'yahoshuva.kesaboyina@scaler.com',
  'yahoshuva@scaler.com'
);

-- 2. Promote Club President
UPDATE public.profiles
SET 
  system_role = 'president',
  club_role = 'Club President',
  is_active = true
WHERE email IN (
  'arunima.vats@scaler.com'
);

-- 3. Verify System Roles & Access
SELECT id, email, full_name, system_role, club_role, is_active
FROM public.profiles
ORDER BY system_role ASC;
