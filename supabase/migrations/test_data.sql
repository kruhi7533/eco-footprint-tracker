-- First check and update RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

ALTER TABLE user_baselines ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own baseline" ON user_baselines;
CREATE POLICY "Users can view own baseline" ON user_baselines
  FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own baseline" ON user_baselines;
CREATE POLICY "Users can insert own baseline" ON user_baselines
  FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own baseline" ON user_baselines;
CREATE POLICY "Users can update own baseline" ON user_baselines
  FOR UPDATE USING (auth.uid() = user_id);

ALTER TABLE carbon_entries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own entries" ON carbon_entries;
CREATE POLICY "Users can view own entries" ON carbon_entries
  FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own entries" ON carbon_entries;
CREATE POLICY "Users can insert own entries" ON carbon_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own entries" ON carbon_entries;
CREATE POLICY "Users can update own entries" ON carbon_entries
  FOR UPDATE USING (auth.uid() = user_id);

-- First create the user profile
INSERT INTO profiles (id, email, name, joined_date, level, eco_points)
VALUES (
    '3068a26e-f4a2-4d6a-8801-1372b735412d',
    'kruhi7533@gmail.com',
    'ruhinaaz',
    NOW(),
    1,
    0
) ON CONFLICT (id) DO UPDATE
SET email = EXCLUDED.email,
    name = EXCLUDED.name;

-- Insert baseline data for your user
INSERT INTO user_baselines (user_id, transportation_emissions, energy_emissions, diet_emissions, waste_emissions)
VALUES (
    '3068a26e-f4a2-4d6a-8801-1372b735412d',
    1200.0,  -- Transportation baseline (kg CO2/month)
    800.0,   -- Energy baseline (kg CO2/month)
    600.0,   -- Diet baseline (kg CO2/month)
    300.0    -- Waste baseline (kg CO2/month)
) ON CONFLICT (user_id) DO UPDATE
SET transportation_emissions = EXCLUDED.transportation_emissions,
    energy_emissions = EXCLUDED.energy_emissions,
    diet_emissions = EXCLUDED.diet_emissions,
    waste_emissions = EXCLUDED.waste_emissions;

-- Insert some test carbon entries for the past week
INSERT INTO carbon_entries (
    user_id,
    date,
    category,
    activity_type,
    amount,
    emissions,
    notes
) VALUES
-- Today's entries
(
    '3068a26e-f4a2-4d6a-8801-1372b735412d',
    CURRENT_DATE,
    'transportation',
    'car',
    30.5,
    95.0,
    'Daily commute'
),
(
    '3068a26e-f4a2-4d6a-8801-1372b735412d',
    CURRENT_DATE,
    'energy',
    'electricity',
    25.0,
    62.5,
    'Home electricity usage'
),
(
    '3068a26e-f4a2-4d6a-8801-1372b735412d',
    CURRENT_DATE,
    'diet',
    'mixed',
    0.3,
    45.0,
    'Mixed diet day'
),
(
    '3068a26e-f4a2-4d6a-8801-1372b735412d',
    CURRENT_DATE,
    'waste',
    'household',
    2.5,
    22.5,
    'Regular household waste'
),
-- Yesterday's entries
(
    '3068a26e-f4a2-4d6a-8801-1372b735412d',
    CURRENT_DATE - INTERVAL '1 day',
    'transportation',
    'public_transport',
    25.0,
    35.0,
    'Bus to work'
);

-- Verify the data was inserted
SELECT 'Profiles' as table_name, COUNT(*) as count FROM profiles WHERE id = '3068a26e-f4a2-4d6a-8801-1372b735412d'
UNION ALL
SELECT 'User Baselines', COUNT(*) FROM user_baselines WHERE user_id = '3068a26e-f4a2-4d6a-8801-1372b735412d'
UNION ALL
SELECT 'Carbon Entries', COUNT(*) FROM carbon_entries WHERE user_id = '3068a26e-f4a2-4d6a-8801-1372b735412d'; 