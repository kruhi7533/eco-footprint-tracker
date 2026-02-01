-- Add new columns to the profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS language varchar(10) DEFAULT 'en' NOT NULL,
ADD COLUMN IF NOT EXISTS notifications_enabled boolean DEFAULT true NOT NULL,
ADD COLUMN IF NOT EXISTS data_sharing_enabled boolean DEFAULT false NOT NULL;

-- Add check constraint for language
ALTER TABLE profiles
ADD CONSTRAINT valid_language CHECK (language IN ('en', 'es', 'fr'));

-- Add comment to explain the columns
COMMENT ON COLUMN profiles.language IS 'User preferred language (en, es, fr)';
COMMENT ON COLUMN profiles.notifications_enabled IS 'Whether the user has enabled notifications';
COMMENT ON COLUMN profiles.data_sharing_enabled IS 'Whether the user has agreed to share anonymous usage data';

-- Update existing rows with default values
UPDATE profiles 
SET 
    language = 'en',
    notifications_enabled = true,
    data_sharing_enabled = false
WHERE language IS NULL; 