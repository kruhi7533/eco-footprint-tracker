-- Set the role to postgres (database owner)
SET ROLE postgres;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own entries" ON public.carbon_entries;
DROP POLICY IF EXISTS "Users can insert their own entries" ON public.carbon_entries;
DROP POLICY IF EXISTS "Users can update their own entries" ON public.carbon_entries;
DROP POLICY IF EXISTS "Users can delete their own entries" ON public.carbon_entries;

-- Drop existing indexes
DROP INDEX IF EXISTS public.idx_carbon_entries_user_date;
DROP INDEX IF EXISTS public.idx_carbon_entries_category;

-- Force drop the table
DROP TABLE IF EXISTS public.carbon_entries CASCADE;

-- Create carbon entries table for tracking daily emissions
CREATE TABLE public.carbon_entries (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users NOT NULL,
    date date NOT NULL DEFAULT CURRENT_DATE,
    category text NOT NULL CHECK (category IN ('transportation', 'energy', 'diet', 'waste')),
    activity_type text NOT NULL,
    amount float,
    emissions float NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT NOW()
);

-- Add indexes for better query performance
CREATE INDEX idx_carbon_entries_user_date ON public.carbon_entries(user_id, date);
CREATE INDEX idx_carbon_entries_category ON public.carbon_entries(category);

-- Enable RLS
ALTER TABLE public.carbon_entries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own entries"
    ON public.carbon_entries FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own entries"
    ON public.carbon_entries FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own entries"
    ON public.carbon_entries FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own entries"
    ON public.carbon_entries FOR DELETE
    USING (auth.uid() = user_id);

-- Reset role
RESET ROLE; 