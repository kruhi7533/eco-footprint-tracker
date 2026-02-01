import { createClient } from '@supabase/supabase-js'

// Types for our Supabase database
export type Profile = {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  joined_date: string;
  level: number;
  eco_points: number;
  consecutive_days: number;
  transportation_reductions: number;
  energy_savings: number;
  waste_reduction: number;
  measurement_unit: 'metric' | 'imperial';
  language: 'en' | 'es' | 'fr';
  notifications_enabled: boolean;
  data_sharing_enabled: boolean;
  updated_at: string;
};

export type DailySummary = {
  id: string;
  user_id: string;
  date: string;
  transportation: number;
  energy: number;
  diet: number;
  waste: number;
  total: number;
  created_at: string;
  updated_at: string;
};

export type AchievementDefinition = {
  id: string;
  achievement_id: string;
  title: string;
  description: string;
  icon_name: string;
  category: string;
  threshold: number | null;
  unit: string;
  level: number;
  points: number;
  requirements: {
    type: 'single' | 'multiple' | 'achievements';
    metric?: string;
    threshold?: number;
    requirements?: Array<{ metric: string; threshold: number }>;
    required?: string[];
  };
  created_at: string;
};

export type UserAchievement = {
  id: string;
  user_id: string;
  achievement_id: string;
  earned_at: string;
};

export type CarbonEntry = {
  id: string;
  user_id: string;
  date: string;
  category: 'transportation' | 'energy' | 'diet' | 'waste';
  activity_type: string;
  amount: number;
  emissions: number;
  notes?: string;
  created_at: string;
};

// Initialize Supabase client
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://uqvxekfividzcohphwqm.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxdnhla2ZpdmlkemNvaHBod3FtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxNTY1NDYsImV4cCI6MjA2MjczMjU0Nn0.n2MBghl3RiifE8RSMoQdWgyiK-90PYvt3hb1Km8hOss";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper function to get a user's profile
export const getProfile = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  // Try to get the existing profile
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
    
  if (error) {
    if (error.code === 'PGRST116') {
      // Profile doesn't exist, create one
      console.log("Profile doesn't exist, creating new profile for user", user.id);
      
      const newProfile: Partial<Profile> = {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
        avatar_url: user.user_metadata?.avatar_url || null,
        joined_date: new Date().toISOString(),
        level: 1,
        eco_points: 0,
        consecutive_days: 0,
        transportation_reductions: 0,
        energy_savings: 0,
        waste_reduction: 0,
        measurement_unit: 'metric',
        language: 'en',
        notifications_enabled: true,
        data_sharing_enabled: true,
        updated_at: new Date().toISOString()
      };
      
      const { data: createdProfile, error: createError } = await supabase
        .from('profiles')
        .insert(newProfile)
        .select('*')
        .single();
        
      if (createError) {
        console.error('Error creating profile:', createError);
        throw createError;
      }
      
      return createdProfile as Profile;
    } else {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }
  
  return data as Profile;
};

// Helper function to get daily summaries for a date range
export const getDailySummaries = async (startDate: string, endDate: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  const { data, error } = await supabase
    .from('daily_summaries')
    .select('*')
    .eq('user_id', user.id)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date');
    
  if (error) {
    throw error;
  }
  
  return data as DailySummary[];
};

// Helper function to get achievement definitions
export const getAchievementDefinitions = async () => {
  const { data, error } = await supabase
    .from('achievement_definitions')
    .select('*')
    .order('level', { ascending: true })
    .order('points', { ascending: false });
    
  if (error) {
    throw error;
  }
  
  return data as AchievementDefinition[];
};

// Helper function to get user's earned achievements
export const getAchievements = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  const { data, error } = await supabase
    .from('user_achievements')
    .select('*')
    .eq('user_id', user.id)
    .order('earned_at', { ascending: false });
    
  if (error) {
    throw error;
  }
  
  return data as UserAchievement[];
};

// Helper function to add a carbon footprint entry
export const addCarbonEntry = async (entry: Omit<CarbonEntry, 'id' | 'user_id' | 'created_at'>) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  const { data, error } = await supabase
    .from('carbon_entries')
    .insert({
      ...entry,
      user_id: user.id
    })
    .select()
    .single();
    
  if (error) {
    throw error;
  }
  
  // Refresh the daily_summaries materialized view to update the chart data
  try {
    await supabase.rpc('refresh_daily_summaries');
  } catch (refreshError) {
    console.warn('Failed to refresh daily summaries:', refreshError);
    // Don't throw error here as the main operation succeeded
  }
  
  return data as CarbonEntry;
};
