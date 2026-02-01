-- Ensure the data_sharing_enabled column exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'data_sharing_enabled'
    ) THEN
        ALTER TABLE profiles
        ADD COLUMN data_sharing_enabled boolean DEFAULT false NOT NULL;
    END IF;
END $$;

-- Add comment to explain the column if it doesn't exist
COMMENT ON COLUMN profiles.data_sharing_enabled IS 'Whether the user has agreed to share anonymous usage data';

-- Update any null values to false
UPDATE profiles 
SET data_sharing_enabled = false
WHERE data_sharing_enabled IS NULL; 