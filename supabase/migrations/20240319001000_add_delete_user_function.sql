-- Create a function to delete all user data
CREATE OR REPLACE FUNCTION delete_user_data(user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Delete all user data in a transaction
    DELETE FROM carbon_entries WHERE user_id = $1;
    DELETE FROM daily_summaries WHERE user_id = $1;
    DELETE FROM achievements WHERE user_id = $1;
    DELETE FROM profiles WHERE id = $1;
    -- Add any other tables that contain user data
END;
$$; 