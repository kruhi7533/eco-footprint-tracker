import { Profile, DailySummary, AchievementDefinition, UserAchievement, CarbonEntry } from './types';


const getBaseUrl = () => {
    if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
    // If running in browser
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        // If on localhost/127.0.0.1, default to localhost:5000
        // If on network IP (e.g. 192.168.x.x), use that IP:5000
        return `http://${hostname}:5000/api`;
    }
    return 'http://localhost:5000/api';
};

const API_URL = getBaseUrl();


// Helper to get headers with token
const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
    };
};

export const api = {
    get: async (endpoint: string) => {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'GET',
            headers: getHeaders(),
        });
        if (!response.ok) {
            // Handle 401: Unauthorized globally if needed, e.g. redirect to login
            throw new Error(await response.text());
        }
        return response.json();
    },
    post: async (endpoint: string, data: any) => {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error(await response.text());
        }
        return response.json();
    },
    put: async (endpoint: string, data: any) => {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error(await response.text());
        }
        return response.json();
    },
};

export const getProfile = async (): Promise<Profile> => {
    return await api.get('/profile');
};

export const getDailySummaries = async (startDate: string, endDate: string): Promise<DailySummary[]> => {
    return await api.get(`/carbon/summaries?startDate=${startDate}&endDate=${endDate}`);
};

export const getCarbonEntries = async (limit?: number): Promise<CarbonEntry[]> => {
    return await api.get(`/carbon/entries${limit ? `?limit=${limit}` : ''}`);
};

export const getEcoTips = async (): Promise<any[]> => {
    return await api.get('/tips');
};

export const getAchievementDefinitions = async (): Promise<AchievementDefinition[]> => {
    return await api.get('/achievements/definitions');
};

export const getAchievements = async (): Promise<UserAchievement[]> => {
    return await api.get('/achievements/my');
};

export const addCarbonEntry = async (entry: Omit<CarbonEntry, 'id' | 'user_id' | 'created_at'>): Promise<CarbonEntry> => {
    return await api.post('/carbon', entry);
};

export const getProgress = async (): Promise<any> => {
    return await api.get('/carbon/progress');
};

export const getLiveBenchmarkData = async (): Promise<any> => {
    return await api.get('/benchmark');
};

// Auth helpers
export const fetchUser = async () => {
    try {
        return await api.get('/auth/me');
    } catch (error) {
        return null;
    }
};

export const changePassword = async (data: any) => {
    return await api.put('/auth/password', data);
};

export const deleteAccount = async (data: any) => {
    return await api.post('/auth/delete', data);
};

export type { Profile, DailySummary, AchievementDefinition, UserAchievement, CarbonEntry };
