export interface User {
    id: string;
    email: string;
    name?: string;
}

export interface Session {
    user: User;
    token: string;
}

export interface Profile {
    id: string;
    email: string;
    full_name?: string;
    avatar_url?: string;
    created_at?: string;
}

export interface DailySummary {
    date: string;
    total_co2: number;
    transport_co2: number;
    energy_co2: number;
    diet_co2: number;
    waste_co2: number;
}

export interface CarbonEntry {
    id: string;
    user_id: string;
    category: 'transport' | 'energy' | 'diet' | 'waste';
    co2_amount: number;
    date: string;
    created_at: string;
    description?: string;
    // Specific fields for different types might be needed, adding generic records if needed
    [key: string]: any;
}

export interface AchievementDefinition {
    id: string;
    title: string;
    description: string;
    icon: string;
    condition_type: string;
    condition_value: number;
}

export interface UserAchievement {
    id: string;
    user_id: string;
    achievement_id: string;
    unlocked_at: string;
    definition?: AchievementDefinition;
}
