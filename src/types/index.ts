
export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  name: string;
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
}

export interface CarbonEntry {
  id: string;
  user_id: string;
  category: 'transport' | 'energy' | 'waste' | 'diet';
  subcategory: string;
  amount: number;
  unit: string;
  carbon_footprint: number;
  date: string;
  created_at: string;
}

export interface EcoTip {
  id: string;
  title: string;
  description: string;
  category: string;
  impact_level: 'low' | 'medium' | 'high';
  created_at: string;
}

export interface Achievement {
  id: string;
  user_id: string;
  title: string;
  description: string;
  icon: string;
  earned_at: string;
  created_at: string;
}
