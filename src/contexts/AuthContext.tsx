
import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js'; // We might want to remove this dependency later
import { Profile } from '@/lib/supabase';
import { api, getProfile } from '@/lib/api';
import { toast } from 'sonner';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const userData = await api.get('/auth/me');
            setUser(userData);
            // Mock session for compatibility if needed, or adjust types
            setSession({ user: userData } as any);

            const userProfile = await getProfile();
            setProfile(userProfile);
          } catch (e) {
            console.error('Token invalid or expired', e);
            localStorage.removeItem('token');
          }
        }
      } catch (error) {
        console.error('Error in auth initialization:', error);
        toast.error('Failed to initialize authentication');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const data = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      setSession({ user: data } as any); // Mocking session structure for compatibility or simplifying
      setUser(data);
      await refreshProfile();
      toast.success('Signed in successfully!');
    } catch (error: any) {
      const message = JSON.parse(error.message).message;
      toast.error(`Sign in failed: ${message}`);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const data = await api.post('/auth/signup', { email, password, name });
      localStorage.setItem('token', data.token);
      setSession({ user: data } as any);
      setUser(data);
      await refreshProfile();
      toast.success('Account created successfully!');
    } catch (error: any) {
      const message = JSON.parse(error.message).message;
      toast.error(`Sign up failed: ${message}`);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      localStorage.removeItem('token');
      setSession(null);
      setUser(null);
      setProfile(null);
      toast.success('Signed out successfully');
    } catch (error: any) {
      toast.error(`Sign out failed: ${error.message}`);
      throw error;
    }
  };

  const refreshProfile = async () => {
    if (!user) return;
    try {
      const userProfile = await getProfile();
      setProfile(userProfile);
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  };

  const value = {
    session,
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
