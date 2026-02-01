-- Fix Eco Points System Migration
-- This migration fixes the flawed eco points system that was rewarding high emissions instead of low emissions

-- Drop the existing trigger and function
DROP TRIGGER IF EXISTS update_user_streak_trigger ON public.carbon_entries;
DROP FUNCTION IF EXISTS public.update_user_streak();

-- Function to calculate user level based on eco points
CREATE OR REPLACE FUNCTION public.calculate_user_level(eco_points INTEGER)
RETURNS INTEGER AS $$
BEGIN
  RETURN CASE
    WHEN eco_points >= 1000 THEN 5
    WHEN eco_points >= 500 THEN 4
    WHEN eco_points >= 250 THEN 3
    WHEN eco_points >= 100 THEN 2
    ELSE 1
  END;
END;
$$ LANGUAGE plpgsql;

-- Create the corrected function with level updates
CREATE OR REPLACE FUNCTION public.update_user_streak()
RETURNS TRIGGER AS $$
DECLARE
  last_entry_date DATE;
  streak_updated BOOLEAN := FALSE;
  today_entry_count INTEGER;
  points_awarded INTEGER := 0;
  new_total_points INTEGER;
  new_level INTEGER;
BEGIN
  -- Get date of user's last entry before today
  SELECT MAX(date) INTO last_entry_date
  FROM public.daily_summaries
  WHERE user_id = NEW.user_id AND date < CURRENT_DATE;

  -- Count how many entries the user has for today (including the new one)
  SELECT COUNT(*) INTO today_entry_count
  FROM public.carbon_entries
  WHERE user_id = NEW.user_id AND date = CURRENT_DATE;

  -- Only update streak if this is the first entry for today
  IF today_entry_count = 1 THEN
    -- Check if this is a consecutive day (yesterday or first entry)
    IF last_entry_date IS NULL OR last_entry_date = CURRENT_DATE - INTERVAL '1 day' THEN
      -- Increment streak
      UPDATE public.profiles
      SET consecutive_days = consecutive_days + 1,
          eco_points = eco_points + 5, -- 5 points for maintaining streak
          updated_at = NOW()
      WHERE id = NEW.user_id;
      streak_updated := TRUE;
    ELSIF last_entry_date < CURRENT_DATE - INTERVAL '1 day' AND NOT streak_updated THEN
      -- Reset streak if not consecutive
      UPDATE public.profiles
      SET consecutive_days = 1,
          updated_at = NOW()
      WHERE id = NEW.user_id;
    END IF;
  END IF;
  
  -- Award points based on eco-friendly choices and emissions reduction
  -- Points are awarded for tracking (engagement) and for low-emission choices
  
  -- Base points for tracking (engagement reward)
  points_awarded := points_awarded + 2;
  
  -- Bonus points for low-emission activities
  CASE NEW.category
    WHEN 'transportation' THEN
      -- Reward for eco-friendly transport choices
      IF NEW.activity_type LIKE '%bike%' OR NEW.activity_type LIKE '%walk%' THEN
        points_awarded := points_awarded + 10; -- High reward for zero-emission transport
      ELSIF NEW.activity_type LIKE '%bus%' OR NEW.activity_type LIKE '%train%' THEN
        points_awarded := points_awarded + 8; -- Good reward for public transport
      ELSIF NEW.activity_type LIKE '%electric%' OR NEW.activity_type LIKE '%hybrid%' THEN
        points_awarded := points_awarded + 5; -- Moderate reward for electric/hybrid
      ELSIF NEW.emissions < 2.0 THEN
        points_awarded := points_awarded + 3; -- Small reward for low-emission driving
      END IF;
      
    WHEN 'energy' THEN
      -- Reward for energy-efficient choices
      IF NEW.activity_type LIKE '%renewable%' OR NEW.activity_type LIKE '%green%' THEN
        points_awarded := points_awarded + 8; -- High reward for renewable energy
      ELSIF NEW.emissions < 1.0 THEN
        points_awarded := points_awarded + 5; -- Good reward for low energy usage
      ELSIF NEW.emissions < 2.0 THEN
        points_awarded := points_awarded + 3; -- Moderate reward for moderate usage
      END IF;
      
    WHEN 'diet' THEN
      -- Reward for plant-based and sustainable food choices
      IF NEW.activity_type LIKE '%vegan%' THEN
        points_awarded := points_awarded + 10; -- High reward for vegan choices
      ELSIF NEW.activity_type LIKE '%vegetarian%' THEN
        points_awarded := points_awarded + 8; -- Good reward for vegetarian choices
      ELSIF NEW.activity_type LIKE '%average%' AND NEW.emissions < 3.0 THEN
        points_awarded := points_awarded + 5; -- Moderate reward for moderate meat consumption
      ELSIF NEW.emissions < 2.0 THEN
        points_awarded := points_awarded + 2; -- Small reward for any low-emission meal
      END IF;
      
    WHEN 'waste' THEN
      -- Reward for waste reduction and recycling
      IF NEW.activity_type LIKE '%compost%' OR NEW.activity_type LIKE '%recycle%' THEN
        points_awarded := points_awarded + 8; -- High reward for composting/recycling
      ELSIF NEW.activity_type LIKE '%reuse%' OR NEW.activity_type LIKE '%reduce%' THEN
        points_awarded := points_awarded + 6; -- Good reward for reuse/reduce
      ELSIF NEW.emissions < 0.5 THEN
        points_awarded := points_awarded + 4; -- Moderate reward for low waste emissions
      END IF;
  END CASE;
  
  -- Additional points for very low emissions (overall eco-friendly choice)
  IF NEW.emissions < 1.0 THEN
    points_awarded := points_awarded + 5; -- Bonus for very low emissions
  ELSIF NEW.emissions < 2.0 THEN
    points_awarded := points_awarded + 2; -- Small bonus for low emissions
  END IF;
  
  -- Get current eco points and calculate new total
  SELECT eco_points INTO new_total_points
  FROM public.profiles
  WHERE id = NEW.user_id;
  
  new_total_points := new_total_points + points_awarded;
  new_level := public.calculate_user_level(new_total_points);
  
  -- Update eco points and level
  UPDATE public.profiles
  SET eco_points = new_total_points,
      level = new_level,
      updated_at = NOW()
  WHERE id = NEW.user_id;
  
  -- Update specific reduction categories (tracking total emissions for achievements)
  IF NEW.category = 'transportation' THEN
    UPDATE public.profiles
    SET transportation_reductions = transportation_reductions + NEW.emissions,
        updated_at = NOW()
    WHERE id = NEW.user_id;
  ELSIF NEW.category = 'energy' THEN
    UPDATE public.profiles
    SET energy_savings = energy_savings + NEW.emissions,
        updated_at = NOW()
    WHERE id = NEW.user_id;
  ELSIF NEW.category = 'waste' THEN
    UPDATE public.profiles
    SET waste_reduction = waste_reduction + NEW.emissions,
        updated_at = NOW()
    WHERE id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger
CREATE TRIGGER update_user_streak_trigger
AFTER INSERT ON public.carbon_entries
FOR EACH ROW
EXECUTE FUNCTION public.update_user_streak();

-- Reset eco points and levels for all users to start fresh with the new system
UPDATE public.profiles 
SET eco_points = 0, 
    level = 1,
    updated_at = NOW();

-- Add a comment explaining the new system
COMMENT ON FUNCTION public.update_user_streak() IS 
'Updated eco points system that rewards users for low emissions and eco-friendly choices instead of high emissions. 
Points are awarded for: 
- Tracking engagement (2 points)
- Eco-friendly transport choices (3-10 points)
- Energy-efficient choices (3-8 points) 
- Plant-based diet choices (2-10 points)
- Waste reduction practices (4-8 points)
- Very low emissions bonus (2-5 points)
- Daily streak maintenance (5 points)

Level progression:
- Level 1: 0-99 points
- Level 2: 100-249 points
- Level 3: 250-499 points
- Level 4: 500-999 points
- Level 5: 1000+ points

Levels are automatically updated when eco points change.'; 