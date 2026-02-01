-- Set role to postgres first
SET ROLE postgres;

-- Grant schema usage to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;

-- Drop existing view and policies
DROP VIEW IF EXISTS daily_summaries CASCADE;

-- Drop existing user_baselines policies
DROP POLICY IF EXISTS "Users can view their own baseline" ON user_baselines;
DROP POLICY IF EXISTS "Users can insert their own baseline" ON user_baselines;
DROP POLICY IF EXISTS "Users can update their own baseline" ON user_baselines;

-- Drop and recreate user_baselines table
DROP TABLE IF EXISTS user_baselines CASCADE;

-- Create user_baselines table
CREATE TABLE user_baselines (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users NOT NULL,
    transportation_emissions float NOT NULL DEFAULT 1000,
    energy_emissions float NOT NULL DEFAULT 800,
    diet_emissions float NOT NULL DEFAULT 600,
    waste_emissions float NOT NULL DEFAULT 300,
    created_at timestamp with time zone DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Enable RLS on user_baselines
ALTER TABLE user_baselines ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_baselines
CREATE POLICY "Users can view their own baseline"
    ON user_baselines FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own baseline"
    ON user_baselines FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own baseline"
    ON user_baselines FOR UPDATE
    USING (auth.uid() = user_id);

-- Create materialized view for daily carbon emission summaries
CREATE MATERIALIZED VIEW daily_summaries AS
SELECT 
    user_id,
    date,
    SUM(CASE WHEN category = 'transportation' THEN emissions ELSE 0 END) AS transportation,
    SUM(CASE WHEN category = 'energy' THEN emissions ELSE 0 END) AS energy,
    SUM(CASE WHEN category = 'diet' THEN emissions ELSE 0 END) AS diet,
    SUM(CASE WHEN category = 'waste' THEN emissions ELSE 0 END) AS waste,
    SUM(emissions) AS total,
    COUNT(*) AS entry_count,
    MIN(created_at) AS created_at
FROM carbon_entries
GROUP BY user_id, date
ORDER BY date DESC;

-- Create index on user_id for better performance
CREATE INDEX idx_daily_summaries_user_id ON daily_summaries(user_id);
CREATE INDEX idx_daily_summaries_date ON daily_summaries(date);

-- Grant necessary permissions
GRANT SELECT ON daily_summaries TO authenticated;
ALTER MATERIALIZED VIEW daily_summaries OWNER TO postgres;

-- Create a function to get user's progress
CREATE OR REPLACE FUNCTION get_user_progress(user_uuid uuid)
RETURNS TABLE (
    category text,
    current_emissions float,
    baseline_emissions float,
    reduction float,
    percentage float
) 
LANGUAGE plpgsql
SECURITY DEFINER -- Change to definer so it can create baseline records
AS $$
DECLARE
    baseline_record record;
    current_record record;
BEGIN
    -- Verify the user has permission to access this data
    IF auth.uid() != user_uuid THEN
        RAISE EXCEPTION 'Not authorized';
    END IF;

    -- Get the user's baseline (create default if not exists)
    SELECT * INTO baseline_record FROM user_baselines 
    WHERE user_id = user_uuid;
    
    IF NOT FOUND THEN
        INSERT INTO user_baselines (
            user_id,
            transportation_emissions,
            energy_emissions,
            diet_emissions,
            waste_emissions
        ) VALUES (
            user_uuid,
            1000, -- Default transportation baseline (kg CO2/month)
            800,  -- Default energy baseline
            600,  -- Default diet baseline
            300   -- Default waste baseline
        )
        RETURNING * INTO baseline_record;
    END IF;

    -- Get the user's current emissions (average of last 7 days)
    SELECT 
        COALESCE(AVG(transportation), 0) AS transport_avg,
        COALESCE(AVG(energy), 0) AS energy_avg,
        COALESCE(AVG(diet), 0) AS diet_avg,
        COALESCE(AVG(waste), 0) AS waste_avg
    INTO current_record
    FROM daily_summaries
    WHERE user_id = user_uuid
    AND date >= CURRENT_DATE - INTERVAL '7 days';

    -- Return progress for each category
    RETURN QUERY
    SELECT 'transportation'::text AS category,
           COALESCE(current_record.transport_avg, 0) AS current_emissions,
           baseline_record.transportation_emissions AS baseline_emissions,
           baseline_record.transportation_emissions - COALESCE(current_record.transport_avg, 0) AS reduction,
           CASE 
               WHEN baseline_record.transportation_emissions > 0 
               THEN ((baseline_record.transportation_emissions - COALESCE(current_record.transport_avg, 0)) / baseline_record.transportation_emissions * 100)
               ELSE 0 
           END AS percentage
    UNION ALL
    SELECT 'energy'::text,
           COALESCE(current_record.energy_avg, 0),
           baseline_record.energy_emissions,
           baseline_record.energy_emissions - COALESCE(current_record.energy_avg, 0),
           CASE 
               WHEN baseline_record.energy_emissions > 0 
               THEN ((baseline_record.energy_emissions - COALESCE(current_record.energy_avg, 0)) / baseline_record.energy_emissions * 100)
               ELSE 0 
           END
    UNION ALL
    SELECT 'diet'::text,
           COALESCE(current_record.diet_avg, 0),
           baseline_record.diet_emissions,
           baseline_record.diet_emissions - COALESCE(current_record.diet_avg, 0),
           CASE 
               WHEN baseline_record.diet_emissions > 0 
               THEN ((baseline_record.diet_emissions - COALESCE(current_record.diet_avg, 0)) / baseline_record.diet_emissions * 100)
               ELSE 0 
           END
    UNION ALL
    SELECT 'waste'::text,
           COALESCE(current_record.waste_avg, 0),
           baseline_record.waste_emissions,
           baseline_record.waste_emissions - COALESCE(current_record.waste_avg, 0),
           CASE 
               WHEN baseline_record.waste_emissions > 0 
               THEN ((baseline_record.waste_emissions - COALESCE(current_record.waste_avg, 0)) / baseline_record.waste_emissions * 100)
               ELSE 0 
           END;
END;
$$;

-- Create a function to refresh the materialized view
CREATE OR REPLACE FUNCTION refresh_daily_summaries()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY daily_summaries;
EXCEPTION
    WHEN OTHERS THEN
        -- If concurrent refresh fails, try regular refresh
        REFRESH MATERIALIZED VIEW daily_summaries;
END;
$$;

-- Create a trigger function to refresh the materialized view
CREATE OR REPLACE FUNCTION refresh_daily_summaries_trigger()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Use a small delay to batch multiple changes
    PERFORM pg_sleep(0.1);
    PERFORM refresh_daily_summaries();
    RETURN NULL;
EXCEPTION
    WHEN OTHERS THEN
        -- Log error but don't fail the transaction
        RAISE WARNING 'Failed to refresh daily_summaries: %', SQLERRM;
        RETURN NULL;
END;
$$;

-- Create a trigger to refresh the view when carbon_entries changes
DROP TRIGGER IF EXISTS refresh_daily_summaries_on_change ON carbon_entries;
CREATE TRIGGER refresh_daily_summaries_on_change
AFTER INSERT OR UPDATE OR DELETE ON carbon_entries
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_daily_summaries_trigger();

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_user_progress(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION refresh_daily_summaries() TO authenticated;

-- Reset role
RESET ROLE; 