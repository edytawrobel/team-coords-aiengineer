-- Drop all existing tables and functions
DROP TABLE IF EXISTS public.sessions CASCADE;
DROP TABLE IF EXISTS public.speakers CASCADE;
DROP TABLE IF EXISTS public.team_members CASCADE;
DROP TABLE IF EXISTS public.notes CASCADE;
DROP TABLE IF EXISTS public.attendance CASCADE;
DROP TABLE IF EXISTS public.app_state CASCADE;

-- Drop the update_updated_at_column function
DROP FUNCTION IF EXISTS update_updated_at_column();