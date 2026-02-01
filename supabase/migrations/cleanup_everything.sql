-- Set the role to postgres (database owner)
SET ROLE postgres;

-- Drop all triggers first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_user_streak_trigger ON carbon_entries;
DROP TRIGGER IF EXISTS update_daily_summary_trigger ON carbon_entries;
DROP TRIGGER IF EXISTS check_achievements_trigger ON profiles;
DROP TRIGGER IF EXISTS update_carbon_entries_updated_at ON carbon_entries;

-- Drop all functions
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.update_user_streak() CASCADE;
DROP FUNCTION IF EXISTS public.update_daily_summary() CASCADE;
DROP FUNCTION IF EXISTS public.check_achievements() CASCADE;
DROP FUNCTION IF EXISTS public.get_user_progress(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

-- Drop all views
DROP VIEW IF EXISTS public.daily_summaries CASCADE;
DROP VIEW IF EXISTS public.daily_emissions_summary CASCADE;
DROP VIEW IF EXISTS public.carbon_emission_summary CASCADE;

-- Drop all policies from tables
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

DROP POLICY IF EXISTS "Users can view own entries" ON public.carbon_entries;
DROP POLICY IF EXISTS "Users can insert own entries" ON public.carbon_entries;
DROP POLICY IF EXISTS "Users can update own entries" ON public.carbon_entries;
DROP POLICY IF EXISTS "Users can delete own entries" ON public.carbon_entries;
DROP POLICY IF EXISTS "Users can view their own entries" ON public.carbon_entries;
DROP POLICY IF EXISTS "Users can insert their own entries" ON public.carbon_entries;
DROP POLICY IF EXISTS "Users can update their own entries" ON public.carbon_entries;
DROP POLICY IF EXISTS "Users can delete their own entries" ON public.carbon_entries;

DROP POLICY IF EXISTS "Users can view own daily summaries" ON public.daily_summaries;
DROP POLICY IF EXISTS "Users can insert own daily summaries" ON public.daily_summaries;
DROP POLICY IF EXISTS "Users can update own daily summaries" ON public.daily_summaries;

DROP POLICY IF EXISTS "Users can view their own baseline" ON public.user_baselines;
DROP POLICY IF EXISTS "Users can insert their own baseline" ON public.user_baselines;
DROP POLICY IF EXISTS "Users can update their own baseline" ON public.user_baselines;

DROP POLICY IF EXISTS "Users can view own achievements" ON public.achievements;
DROP POLICY IF EXISTS "Anyone can view eco tips" ON public.eco_tips;

-- Drop all tables
DROP TABLE IF EXISTS public.carbon_entries CASCADE;
DROP TABLE IF EXISTS public.daily_summaries CASCADE;
DROP TABLE IF EXISTS public.user_baselines CASCADE;
DROP TABLE IF EXISTS public.achievements CASCADE;
DROP TABLE IF EXISTS public.eco_tips CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Drop all indexes
DROP INDEX IF EXISTS public.idx_carbon_entries_user_date;
DROP INDEX IF EXISTS public.idx_carbon_entries_category;

-- Reset role
RESET ROLE; 