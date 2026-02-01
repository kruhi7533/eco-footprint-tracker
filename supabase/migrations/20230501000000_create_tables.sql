
-- Create users profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,
  joined_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  level INTEGER DEFAULT 1,
  eco_points INTEGER DEFAULT 0,
  consecutive_days INTEGER DEFAULT 0,
  transportation_reductions FLOAT DEFAULT 0,
  energy_savings FLOAT DEFAULT 0,
  waste_reduction FLOAT DEFAULT 0,
  measurement_unit TEXT DEFAULT 'metric',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create carbon_entries table for tracking daily emissions
CREATE TABLE IF NOT EXISTS public.carbon_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE DEFAULT CURRENT_DATE,
  category TEXT NOT NULL,  -- 'transportation', 'energy', 'diet', 'waste'
  activity_type TEXT NOT NULL, -- e.g. 'CAR', 'ELECTRICITY', 'MEAT_HEAVY', 'LANDFILL'
  amount FLOAT,  -- distance in km, energy in kWh, or waste in kg
  emissions FLOAT NOT NULL, -- calculated emissions in kg of CO2
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create daily_summaries table to track aggregated daily stats
CREATE TABLE IF NOT EXISTS public.daily_summaries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE DEFAULT CURRENT_DATE,
  transportation FLOAT DEFAULT 0,
  energy FLOAT DEFAULT 0,
  diet FLOAT DEFAULT 0,
  waste FLOAT DEFAULT 0,
  total FLOAT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Create achievements table to track user accomplishments
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Create tips table for eco-friendly suggestions
CREATE TABLE IF NOT EXISTS public.eco_tips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  tip TEXT NOT NULL,
  impact_level INTEGER DEFAULT 1
);



-- Add RLS policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carbon_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

-- Set up Row Level Security policies
-- Profiles: Users can only read/update their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Carbon entries: Users can only CRUD their own entries
DROP POLICY IF EXISTS "Users can view own carbon entries" ON public.carbon_entries;
CREATE POLICY "Users can view own carbon entries" ON public.carbon_entries
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own carbon entries" ON public.carbon_entries;
CREATE POLICY "Users can insert own carbon entries" ON public.carbon_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own carbon entries" ON public.carbon_entries;
CREATE POLICY "Users can update own carbon entries" ON public.carbon_entries
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own carbon entries" ON public.carbon_entries;
CREATE POLICY "Users can delete own carbon entries" ON public.carbon_entries
  FOR DELETE USING (auth.uid() = user_id);

-- Daily summaries: Users can only CRUD their own summaries
DROP POLICY IF EXISTS "Users can view own daily summaries" ON public.daily_summaries;
CREATE POLICY "Users can view own daily summaries" ON public.daily_summaries
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own daily summaries" ON public.daily_summaries;
CREATE POLICY "Users can insert own daily summaries" ON public.daily_summaries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own daily summaries" ON public.daily_summaries;
CREATE POLICY "Users can update own daily summaries" ON public.daily_summaries
  FOR UPDATE USING (auth.uid() = user_id);

-- Achievements: Users can only view their own achievements
DROP POLICY IF EXISTS "Users can view own achievements" ON public.achievements;
CREATE POLICY "Users can view own achievements" ON public.achievements
  FOR SELECT USING (auth.uid() = user_id);

-- Eco tips are public
ALTER TABLE public.eco_tips ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view eco tips" ON public.eco_tips;
CREATE POLICY "Anyone can view eco tips" ON public.eco_tips
  FOR SELECT USING (true);

 

-- Insert initial eco tips data
INSERT INTO public.eco_tips (category, tip, impact_level) VALUES
  ('transportation', 'Try carpooling with colleagues to work', 2),
  ('transportation', 'Consider using public transportation for your daily commute', 2),
  ('transportation', 'For short trips, opt for walking or cycling instead of driving', 1),
  ('transportation', 'Maintain your vehicle properly to ensure optimal fuel efficiency', 1),
  ('energy', 'Unplug electronics when not in use to prevent phantom energy use', 1),
  ('energy', 'Switch to LED bulbs to reduce energy consumption', 2),
  ('energy', 'Use natural light whenever possible during the day', 1),
  ('energy', 'Set your thermostat a few degrees lower in winter and higher in summer', 2),
  ('diet', 'Try to incorporate more plant-based meals into your diet', 3),
  ('diet', 'Buy local and seasonal produce to reduce transportation emissions', 2),
  ('diet', 'Reduce food waste by planning meals and using leftovers', 2),
  ('diet', 'Start a small herb garden for fresh herbs without packaging', 1),
  ('waste', 'Bring reusable bags when shopping to avoid single-use plastic bags', 1),
  ('waste', 'Use a reusable water bottle instead of buying bottled water', 1),
  ('waste', 'Start composting food scraps to reduce landfill waste', 2),
  ('waste', 'Choose products with minimal or recyclable packaging', 2);

-- Function to update user's streak and eco points when they log activities
CREATE OR REPLACE FUNCTION public.update_user_streak()
RETURNS TRIGGER AS $$
DECLARE
  last_entry_date DATE;
  streak_updated BOOLEAN := FALSE;
BEGIN
  -- Get date of user's last entry before today
  SELECT MAX(date) INTO last_entry_date
  FROM public.daily_summaries
  WHERE user_id = NEW.user_id AND date < CURRENT_DATE;

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
  
  -- Award points for activity
  UPDATE public.profiles
  SET eco_points = eco_points + (NEW.emissions * 0.5)::INTEGER, -- Points based on emissions reduction
      updated_at = NOW()
  WHERE id = NEW.user_id;
  
  -- Update specific reduction categories
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

-- Create trigger on carbon_entries
CREATE TRIGGER update_user_streak_trigger
AFTER INSERT ON public.carbon_entries
FOR EACH ROW
EXECUTE FUNCTION public.update_user_streak();

-- Function to check and award achievements
CREATE OR REPLACE FUNCTION public.check_achievements()
RETURNS TRIGGER AS $$
BEGIN
  -- Carbon Cutter achievement
  IF NEW.transportation_reductions >= 50 THEN
    INSERT INTO public.achievements (user_id, achievement_id, title, description)
    VALUES (NEW.id, 'achievement1', 'Carbon Cutter', 'Reduce transportation emissions by 50kg')
    ON CONFLICT (user_id, achievement_id) DO NOTHING;
  END IF;

  -- Energy Saver achievement
  IF NEW.energy_savings >= 100 THEN
    INSERT INTO public.achievements (user_id, achievement_id, title, description)
    VALUES (NEW.id, 'achievement2', 'Energy Saver', 'Save 100kWh of energy')
    ON CONFLICT (user_id, achievement_id) DO NOTHING;
  END IF;

  -- Waste Warrior achievement
  IF NEW.waste_reduction >= 20 THEN
    INSERT INTO public.achievements (user_id, achievement_id, title, description)
    VALUES (NEW.id, 'achievement3', 'Waste Warrior', 'Reduce waste by 20kg')
    ON CONFLICT (user_id, achievement_id) DO NOTHING;
  END IF;

  -- Eco Streak achievement
  IF NEW.consecutive_days >= 7 THEN
    INSERT INTO public.achievements (user_id, achievement_id, title, description)
    VALUES (NEW.id, 'achievement4', 'Eco Streak', 'Log your footprint for 7 consecutive days')
    ON CONFLICT (user_id, achievement_id) DO NOTHING;
  END IF;

  -- Green Guardian achievement
  IF NEW.transportation_reductions >= 100 AND NEW.energy_savings >= 200 AND NEW.waste_reduction >= 40 THEN
    INSERT INTO public.achievements (user_id, achievement_id, title, description)
    VALUES (NEW.id, 'achievement5', 'Green Guardian', 'Master of all eco-friendly habits')
    ON CONFLICT (user_id, achievement_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on profiles
CREATE TRIGGER check_achievements_trigger
AFTER UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.check_achievements();

-- Function to update daily summaries when carbon entries are added
CREATE OR REPLACE FUNCTION public.update_daily_summary()
RETURNS TRIGGER AS $$
DECLARE
  trans_sum FLOAT;
  energy_sum FLOAT;
  diet_sum FLOAT;
  waste_sum FLOAT;
  total_sum FLOAT;
BEGIN
  -- Calculate sums for each category
  SELECT COALESCE(SUM(emissions), 0) INTO trans_sum
  FROM public.carbon_entries
  WHERE user_id = NEW.user_id AND date = NEW.date AND category = 'transportation';
  
  SELECT COALESCE(SUM(emissions), 0) INTO energy_sum
  FROM public.carbon_entries
  WHERE user_id = NEW.user_id AND date = NEW.date AND category = 'energy';
  
  SELECT COALESCE(SUM(emissions), 0) INTO diet_sum
  FROM public.carbon_entries
  WHERE user_id = NEW.user_id AND date = NEW.date AND category = 'diet';
  
  SELECT COALESCE(SUM(emissions), 0) INTO waste_sum
  FROM public.carbon_entries
  WHERE user_id = NEW.user_id AND date = NEW.date AND category = 'waste';
  
  total_sum := trans_sum + energy_sum + diet_sum + waste_sum;
  
  -- Insert or update daily summary
  INSERT INTO public.daily_summaries 
    (user_id, date, transportation, energy, diet, waste, total)
  VALUES 
    (NEW.user_id, NEW.date, trans_sum, energy_sum, diet_sum, waste_sum, total_sum)
  ON CONFLICT (user_id, date) DO UPDATE
  SET 
    transportation = trans_sum,
    energy = energy_sum,
    diet = diet_sum,
    waste = waste_sum,
    total = total_sum,
    updated_at = NOW();
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on carbon_entries for daily summaries
CREATE TRIGGER update_daily_summary_trigger
AFTER INSERT OR UPDATE ON public.carbon_entries
FOR EACH ROW
EXECUTE FUNCTION public.update_daily_summary();

-- Trigger to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, joined_date)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', 'User'), NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();
