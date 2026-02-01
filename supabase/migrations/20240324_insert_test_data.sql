-- Insert baseline data for the test user
INSERT INTO user_baselines (user_id, transportation_emissions, energy_emissions, diet_emissions, waste_emissions)
VALUES (
    '890840a5-08c7-4c1b-b0db-6a2b5e59adf4',  -- User ID
    1200.0,  -- Transportation baseline (kg CO2/month)
    800.0,   -- Energy baseline (kg CO2/month)
    600.0,   -- Diet baseline (kg CO2/month)
    300.0    -- Waste baseline (kg CO2/month)
);

-- Insert some test carbon entries for the past week
INSERT INTO carbon_entries (
    user_id,
    entry_date,
    transport_type,
    transport_distance,
    transport_emissions,
    energy_source,
    energy_consumption,
    energy_emissions,
    meal_type,
    meat_consumption,
    diet_emissions,
    waste_type,
    waste_amount,
    waste_emissions
) VALUES
-- Today's entry
(
    '890840a5-08c7-4c1b-b0db-6a2b5e59adf4',
    CURRENT_DATE,
    'car',
    30.5,
    95.0,
    'electricity',
    25.0,
    62.5,
    'mixed',
    0.3,
    45.0,
    'household',
    2.5,
    22.5
),
-- Yesterday's entry
(
    '890840a5-08c7-4c1b-b0db-6a2b5e59adf4',
    CURRENT_DATE - INTERVAL '1 day',
    'public_transport',
    25.0,
    35.0,
    'electricity',
    22.0,
    55.0,
    'vegetarian',
    0.0,
    30.0,
    'recycled',
    2.0,
    18.0
),
-- 2 days ago
(
    '890840a5-08c7-4c1b-b0db-6a2b5e59adf4',
    CURRENT_DATE - INTERVAL '2 days',
    'bicycle',
    15.0,
    0.0,
    'solar',
    20.0,
    10.0,
    'vegan',
    0.0,
    25.0,
    'composted',
    1.5,
    5.0
),
-- 3 days ago
(
    '890840a5-08c7-4c1b-b0db-6a2b5e59adf4',
    CURRENT_DATE - INTERVAL '3 days',
    'walking',
    5.0,
    0.0,
    'mixed',
    23.0,
    57.5,
    'low_meat',
    0.2,
    40.0,
    'mixed',
    2.2,
    20.0
);

-- Insert some achievements
INSERT INTO user_achievements (user_id, achievement_type, description, points_awarded)
VALUES
(
    '890840a5-08c7-4c1b-b0db-6a2b5e59adf4',
    'transportation',
    'First Zero-Emission Day - Used only bicycle and walking',
    50
),
(
    '890840a5-08c7-4c1b-b0db-6a2b5e59adf4',
    'energy',
    'Solar Pioneer - Started using solar energy',
    75
),
(
    '890840a5-08c7-4c1b-b0db-6a2b5e59adf4',
    'diet',
    'Plant-Based Explorer - Tried vegan meals',
    60
); 