-- Set role to postgres first
SET ROLE postgres;

-- Add avatar_url column to profiles table
ALTER TABLE profiles
ADD COLUMN avatar_url TEXT;

-- Reset role
RESET ROLE; 